/*
 * jailbreak_root_detection — iOS bypass (Flutter plugin com.w3conext/jailbreak_root_detection)
 *
 * Forces every iOS check in the plugin to report "clean". The plugin ORs together, per
 * JailbreakRootDetection.swift:
 *   UIDevice.isJailBroken  IOSSecuritySuite.amIJailbroken  ReverseEngineeringChecker
 *   IOSSecuritySuite.amIProxied  FridaChecker.isFound  CydiaChecker.isFound
 *   IOSSecuritySuite.amIDebugged  amIRunInEmulator  amITampered
 * and exposes them over MethodChannel 'jailbreak_root_detection'
 * (checkForIssues / isJailBroken / isRealDevice / isDebugged / isTampered).
 *
 * Two layers, because the tiny Swift check* funcs are usually inlined by the optimizer:
 *   L1  override the plugin + IOSSecuritySuite Swift symbols directly (one shot each).
 *   L2  neutralise the primitives they inline down to (file/url existence, loopback port
 *       probes, dyld image names, anti-debug syscalls) so an inlined check still comes back clean.
 *
 * JB device + frida-server over USB:
 *   frida -U -f <bundle.id> -l jailbreak_root_detection_ios_bypass.js   # spawn (launch-time checks)
 *   frida -U -n "<App Name>" -l jailbreak_root_detection_ios_bypass.js  # attach
 *
 * Frida 17+ (Module.findGlobalExportByName / Process.findModuleByName).
 */
'use strict';

const CONFIG = { log: true, logAllowed: false };
function log() { if (CONFIG.log) console.log.apply(console, arguments); }

/* =====================================================================================
 * L1 — Swift symbol overrides
 * Bool-returning funcs; the token appears verbatim inside the mangled Swift symbol
 * (same trick as iss_bypass.js). "bad" checks -> false(0); liveness checks -> true(1).
 * ===================================================================================== */
const FORCE_FALSE = [
  // plugin JailbreakRootDetection.swift choke points
  'checkJailBroken', 'checkJail', 'checkDebugged', 'checkReverseEngineered',
  'checkProxied', 'checkFrida', 'checkCydia', 'checkTampered',
  // plugin leaf checkers
  'amIReverseEngineered',        // ReverseEngineeringChecker
  // UIDevice+JailBroken extension computed getter `isJailBroken`
  'isJailBroken',
  // IOSSecuritySuite public API
  'amIJailbroken', 'amIDebugged', 'amIProxied', 'amIRunInEmulator', 'amITampered',
];
const FORCE_TRUE = [
  'checkRealDevice',             // plugin: !isSimulator && !amIRunInEmulator -> keep "real"
];
// FridaChecker.isFound / CydiaChecker.isFound: match `isFound`, but only inside the plugin
// module so we don't clobber unrelated `isFound` symbols elsewhere.
const FORCE_FALSE_PLUGIN_ONLY = ['isFound'];

const PLUGIN_MOD = 'jailbreak_root_detection';
const ISS_MOD = 'IOSSecuritySuite';
const hooked = new Set();

function candidateModules() {
  const mods = [];
  [PLUGIN_MOD, ISS_MOD].forEach(function (n) {
    const m = Process.findModuleByName(n);
    if (m) mods.push(m);
  });
  // Swift Package / static link: everything ends up in the main executable.
  try { mods.push(Process.enumerateModules()[0]); } catch (e) {}
  return mods;
}

function forceBool(sym, value, label) {
  const key = sym.address.toString();
  if (hooked.has(key)) return false;
  try {
    Interceptor.attach(sym.address, { onLeave: function (ret) { ret.replace(ptr(value)); } });
    hooked.add(key);
    log('[+] ' + (value ? 'true ' : 'false') + ' <- ' + label + '  @ ' + sym.address);
    return true;
  } catch (e) { log('[-] attach ' + label + ': ' + e); return false; }
}

function installSwiftHooks() {
  let n = 0;
  const mods = candidateModules();
  mods.forEach(function (mod) {
    let syms;
    try { syms = mod.enumerateSymbols(); } catch (e) { return; }
    const inPlugin = (mod.name === PLUGIN_MOD);
    syms.forEach(function (s) {
      if (!s.address || s.address.isNull()) return;
      const name = s.name;
      if (FORCE_TRUE.some(function (t) { return name.indexOf(t) !== -1; })) {
        if (forceBool(s, 1, name)) n++; return;
      }
      if (FORCE_FALSE.some(function (t) { return name.indexOf(t) !== -1; })) {
        if (forceBool(s, 0, name)) n++; return;
      }
      if (inPlugin && FORCE_FALSE_PLUGIN_ONLY.some(function (t) { return name.indexOf(t) !== -1; })) {
        if (forceBool(s, 0, name)) n++;
      }
    });
  });
  return n;
}

/* =====================================================================================
 * L2 — primitive neutralisation (catches inlined checks)
 * ===================================================================================== */
// Artifacts the plugin's file/path/url checks look for. Substring match; denied -> "missing".
const JB_TOKENS = [
  'Cydia', 'cydia', 'Sileo', 'blackra1n', 'checkra1n', 'FakeCarrier', 'Icy.app',
  'IntelliScreen', 'MxTube', 'RockApp', 'SBSettings', 'WinterBoard', 'Snoop-it',
  'MewSeek', 'OmniStat', 'Poof', 'iFile', 'Activator',
  'MobileSubstrate', 'CydiaSubstrate', 'Substrate', 'substrate', 'PreferenceLoader',
  'frida', 'Frida', 'FridaGadget', 'libfrida', 'cynject', 'cycript', 'libcycript',
  '/bin/bash', '/bin/sh', '/bin/su', '/usr/sbin/sshd', '/usr/bin/ssh', '/usr/bin/sshd',
  '/usr/libexec/ssh', 'sshd_config', 'sftp-server', 'ssh-keysign',
  '/etc/apt', '/private/etc/apt', '/var/lib/apt', '/var/cache/apt', 'dpkg',
  '/var/lib/cydia', '/var/stash', '/private/var/stash', 'cydia.log', 'apticket.der',
  'com.saurik', 'com.ikey.bbot', 'bootlogo', 'BootLogo', 'binpack', 'bin.sh',
];
const URL_TOKENS = ['cydia', 'sileo', 'zbra', 'filza', 'undecimus', 'activator'];
const DYLD_TOKENS = ['FridaGadget', 'frida', 'cynject', 'libcycript', 'cycript', 'substrate', 'Substrate'];
const JB_PORTS = new Set([27042, 4444, 22, 44]);

function matches(path, list) {
  if (!path) return false;
  for (let i = 0; i < list.length; i++) if (path.indexOf(list[i]) !== -1) return true;
  return false;
}

/* ---- ObjC: NSFileManager.fileExistsAtPath: / UIApplication.canOpenURL: ---- */
function installObjCHooks() {
  if (!ObjC.available) { log('[-] ObjC unavailable — skipping ObjC layer'); return; }
  const FM = ObjC.classes.NSFileManager;
  ['- fileExistsAtPath:', '- fileExistsAtPath:isDirectory:'].forEach(function (sel) {
    if (!FM || !FM[sel]) return;
    Interceptor.attach(FM[sel].implementation, {
      onEnter: function (args) { try { this.p = new ObjC.Object(args[2]).toString(); } catch (e) { this.p = null; } },
      onLeave: function (ret) {
        if (this.p && matches(this.p, JB_TOKENS)) {
          if (CONFIG.logAllowed) log('[deny] fileExistsAtPath ' + this.p);
          ret.replace(ptr(0)); // NO
        }
      }
    });
    log('[+] hooked NSFileManager ' + sel);
  });
  const APP = ObjC.classes.UIApplication;
  if (APP && APP['- canOpenURL:']) {
    Interceptor.attach(APP['- canOpenURL:'].implementation, {
      onEnter: function (args) { try { this.u = new ObjC.Object(args[2]).toString().toLowerCase(); } catch (e) { this.u = null; } },
      onLeave: function (ret) { if (this.u && matches(this.u, URL_TOKENS)) ret.replace(ptr(0)); }
    });
    log('[+] hooked UIApplication canOpenURL:');
  }
}

/* ---- libc: stat/lstat/fopen/open/access path gates + connect() port gate ---- */
function installLibcHooks() {
  const fileFns = { stat: -1, stat64: -1, lstat: -1, lstat64: -1, access: -1,
                    open: -1, open64: -1, fopen: 0, fopen64: 0 };
  Object.keys(fileFns).forEach(function (fn) {
    const p = Module.findGlobalExportByName(fn);
    if (!p) return;
    const miss = fileFns[fn];
    Interceptor.attach(p, {
      onEnter: function (args) { try { this.path = args[0].readUtf8String(); } catch (e) { this.path = null; } },
      onLeave: function (ret) { if (this.path && matches(this.path, JB_TOKENS)) ret.replace(ptr(miss)); }
    });
  });
  log('[+] hooked libc file-existence gates');

  // CydiaChecker does stat("system") too — harmless, ignored (not a JB token).

  // ReverseEngineeringChecker.checkOpenedPorts -> connect() to 127.0.0.1:<frida/ssh/...>
  const connect = Module.findGlobalExportByName('connect');
  if (connect) {
    Interceptor.attach(connect, {
      onEnter: function (args) {
        this.block = false;
        try {
          const sa = args[1];
          const family = sa.add(1).readU8();          // sockaddr_in.sin_family (Darwin: after sin_len)
          if (family === 2 /* AF_INET */) {
            const port = (sa.add(2).readU8() << 8) | sa.add(3).readU8(); // network order
            const a = sa.add(4).readU32() >>> 0;        // sin_addr, network order
            if (JB_PORTS.has(port) && a === 0x0100007f /* 127.0.0.1 */) this.block = true;
          }
        } catch (e) {}
      },
      onLeave: function (ret) { if (this.block) ret.replace(ptr(-1)); } // connection refused
    });
    log('[+] hooked connect() loopback JB-port probe');
  }
}

/* ---- dyld: hide suspicious image names from checkDYLD ---- */
function installDyldHook() {
  const p = Module.findGlobalExportByName('_dyld_get_image_name');
  if (!p) return;
  const fake = Memory.allocUtf8String('/usr/lib/libSystem.B.dylib');
  Interceptor.attach(p, {
    onLeave: function (ret) {
      try {
        const name = ret.readUtf8String();
        if (name && matches(name, DYLD_TOKENS)) ret.replace(fake);
      } catch (e) {}
    }
  });
  log('[+] hooked _dyld_get_image_name (image-name scrub)');
}

/* ---- anti-debug: IOSSecuritySuite.amIDebugged primitives ---- */
function installAntiDebugHooks() {
  const ptracePtr = Module.findGlobalExportByName('ptrace');
  if (ptracePtr) {
    Interceptor.attach(ptracePtr, {
      onEnter: function (args) { this.req = args[0].toInt32(); },
      onLeave: function (ret) { if (this.req === 31 /* PT_DENY_ATTACH */) ret.replace(ptr(0)); }
    });
    log('[+] hooked ptrace(PT_DENY_ATTACH)');
  }
  const sysctlPtr = Module.findGlobalExportByName('sysctl');
  if (sysctlPtr) {
    Interceptor.attach(sysctlPtr, {
      onEnter: function (args) { this.oldp = args[2]; },
      onLeave: function () {
        if (!this.oldp || this.oldp.isNull()) return;
        try { // kinfo_proc.kp_proc.p_flag @ +32 (arm64); clear P_TRACED (0x800)
          const f = this.oldp.add(32).readU32();
          if (f & 0x800) this.oldp.add(32).writeU32(f & ~0x800);
        } catch (e) {}
      }
    });
    log('[+] hooked sysctl P_TRACED scrubber');
  }
}

/* ===================================================================================== */
function runL1() {
  const n = installSwiftHooks();
  if (n === 0) log('[!] no plugin/IOSSecuritySuite Swift symbols yet (not loaded / inlined / stripped) — L2 still active');
  else log('[*] L1: ' + n + ' Swift symbol(s) overridden');
  return n;
}

function main() {
  installObjCHooks();
  installLibcHooks();
  installDyldHook();
  installAntiDebugHooks();
  runL1();

  // Re-run L1 when the plugin / IOSSecuritySuite framework loads later (spawn mode).
  const dlopen = Module.findGlobalExportByName('dlopen');
  if (dlopen) {
    Interceptor.attach(dlopen, { onLeave: function () { runL1(); } });
  }
  log('[*] jailbreak_root_detection iOS bypass armed.');
}

if (ObjC.available) main();
else { log('[-] ObjC runtime unavailable — running native layer only'); main(); }
