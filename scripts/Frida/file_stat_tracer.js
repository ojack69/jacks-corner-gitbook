/*
 * File-existence / stat gate (iOS/macOS)
 * DENY-BY-DEFAULT: every hooked file-check reports "not found" / false, EXCEPT paths
 * that match the WHITELIST (those run normally). Logs every decision.
 *
 *   frida -U -f <bundle.id> -l file_stat_tracer.js
 *   frida -U -n "<App Name>" -l file_stat_tracer.js
 *
 * !! WARNING: denying stat/open across the whole filesystem WILL break the app unless
 *    the paths it legitimately needs are whitelisted. The defaults below keep the app
 *    runnable (its bundle, data container, system libs, fonts, caches, tmp, prefs).
 *    Trim the WHITELIST to exactly what you want to allow.
 */
'use strict';

const CONFIG = {
  mode: 'allow',        // 'deny'  = deny everything except WHITELIST
                        // 'allow' = allow everything except BLOCKLIST
  log: true,            // print every allow/deny decision
  logAllowed: false,    // also print allowed paths — very noisy
  onlyExisting: true,   // only log paths that actually exist on the device (from the
                        // call's real return value) — cuts the noise of missing-path probes
  backtrace: false,     // short caller backtrace on denied hits
};

// deny-by-default mode: substring match; a path runs normally if it contains ANY entry.
// Everything else is forced to "missing".
const WHITELIST = [
  '/var/mobile/Containers/Data/Application',   // app data container (the example)
  '/var/containers/Bundle/Application',         // app .app bundle + embedded frameworks
  '/private/var/containers/Bundle/Application',
  // --- recommended: keep these or the app likely crashes -------------------
  '/System/',                                   // system frameworks
  '/usr/lib/',                                  // dyld shared cache stubs, libs
  '/Library/Fonts',                             // system fonts
  '/var/mobile/Library',                        // Caches, Preferences, Cookies, ...
  '/private/var/mobile/Library',
  '/tmp',                                       // scratch
  '/private/var/tmp',
  '/dev/',                                      // devices
];

// allow-by-default mode: substring match; a path is forced to "missing" if it contains
// ANY entry. Everything else runs normally. Prefilled with common JB/tooling artifacts.
const BLOCKLIST = [
  'Cydia', 'Sileo', 'Zebra', 'Filza', 'Checkra1n', 'unc0ver',
  '/bin/bash', '/bin/sh', '/bin/zsh', '/etc/apt', '/usr/sbin/sshd', '/usr/bin/ssh',
  'MobileSubstrate', '/Library/MobileSubstrate', 'TweakInject', '/usr/lib/substitute',
  '/var/lib/cydia', '/var/lib/apt', '/private/var/lib/apt', '/private/var/stash',
  'apt-get', 'dpkg', '/var/jb', '/jb/',
  'frida', 'cynject', 'libcycript', 'libhooker',
];

/* ---- helpers --------------------------------------------------------------- */
function allowed(path) {
  if (!path) return true; // unknown path -> don't interfere
  if (CONFIG.mode === 'deny') return WHITELIST.some((w) => path.indexOf(w) !== -1);
  // allow-by-default: blocked only if it matches the blocklist
  return !BLOCKLIST.some((b) => path.indexOf(b) !== -1);
}
function bt(ctx) {
  if (!CONFIG.backtrace) return '';
  return '\n    ' + Thread.backtrace(ctx, Backtracer.ACCURATE)
    .slice(0, 5).map(DebugSymbol.fromAddress).join('\n    ');
}
function denied(path) { return !allowed(path); }

// Logged in onLeave, once the real result is known. `existed` comes from the call's
// original return value (ground truth from the OS), so onlyExisting can filter on it.
function note(api, path, deny, existed, ctx) {
  if (!path || !CONFIG.log) return;
  if (CONFIG.onlyExisting && !existed) return;
  if (deny) console.log('[DENY  ] ' + api + ' ' + path + (existed ? '  (exists)' : '') + bt(ctx));
  else if (CONFIG.logAllowed) console.log('[ALLOW ] ' + api + ' ' + path + (existed ? '  (exists)' : ''));
}

/* ---- libc: path is a C string; return int (-1) or pointer (NULL) on miss --- */
const LIBC = {
  stat: -1, stat64: -1, lstat: -1, lstat64: -1,
  access: -1, open: -1, open64: -1,
  faccessat: -1, openat: -1,
  fopen: 0, fopen64: 0, freopen: 0,
};
const PATH_ARG1 = new Set(['faccessat', 'openat']); // path is args[1] for *at variants

Object.keys(LIBC).forEach((fn) => {
  const p = Module.findExportByName(null, fn);
  if (!p) return;
  const missVal = LIBC[fn];
  const isPtr = (missVal === 0);           // fopen family returns a pointer (NULL = miss)
  const idx = PATH_ARG1.has(fn) ? 1 : 0;
  Interceptor.attach(p, {
    onEnter(args) {
      try { this.path = args[idx].readUtf8String(); } catch (e) { this.path = null; }
      this.deny = this.path ? denied(this.path) : false;
      this.ctx = this.context;
    },
    onLeave(ret) {
      const existed = isPtr ? !ret.isNull() : (ret.toInt32() >= 0); // original result
      note(fn, this.path, this.deny, existed, this.ctx);
      if (this.deny) ret.replace(ptr(missVal));
    }
  });
  console.log('[+] hooked libc ' + fn);
});

/* ---- ObjC: NSFileManager + NSURL reachability (BOOL -> force NO) ----------- */
function hookObjCBool(cls, sel, api, pathFromArgs) {
  if (!cls || !cls[sel]) return;
  Interceptor.attach(cls[sel].implementation, {
    onEnter(args) {
      try { this.path = pathFromArgs(args); } catch (e) { this.path = null; }
      this.deny = this.path ? denied(this.path) : false;
      this.ctx = this.context;
    },
    onLeave(ret) {
      const existed = ret.toInt32() !== 0; // original BOOL
      note(api, this.path, this.deny, existed, this.ctx);
      if (this.deny) ret.replace(ptr(0)); // NO / false
    }
  });
  console.log('[+] hooked ' + api);
}

if (ObjC.available) {
  const FM = ObjC.classes.NSFileManager;
  const argPath = (args) => new ObjC.Object(args[2]).toString(); // self, _cmd, path

  hookObjCBool(FM, '- fileExistsAtPath:', '-[NSFileManager fileExistsAtPath:]', argPath);
  hookObjCBool(FM, '- fileExistsAtPath:isDirectory:', '-[NSFileManager fileExistsAtPath:isDirectory:]', argPath);
  hookObjCBool(FM, '- isReadableFileAtPath:', '-[NSFileManager isReadableFileAtPath:]', argPath);
  hookObjCBool(FM, '- isWritableFileAtPath:', '-[NSFileManager isWritableFileAtPath:]', argPath);

  const URL = ObjC.classes.NSURL;
  hookObjCBool(URL, '- checkResourceIsReachableAndReturnError:',
    '-[NSURL checkResourceIsReachableAndReturnError:]',
    (args) => new ObjC.Object(args[0]).path().toString()); // self is the URL
} else {
  console.log('[-] ObjC runtime unavailable — libc hooks only');
}

const summary = CONFIG.mode === 'deny'
  ? 'deny-by-default, ' + WHITELIST.length + ' whitelisted prefixes'
  : 'allow-by-default, ' + BLOCKLIST.length + ' blocked patterns';
console.log('[*] file-stat gate armed (' + summary + ').');
