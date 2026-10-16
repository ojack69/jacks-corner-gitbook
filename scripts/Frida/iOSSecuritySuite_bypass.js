/*
 * IOSSecuritySuite bypass — jailbreak + debugger + reverse-engineering + emulator + proxy
 * Target: iOS Flutter app embedding securing/IOSSecuritySuite
 */

/* All IOSSecuritySuite public Bool checks return `true` when the device is "bad".
 * Forcing the native return (x0) to 0 makes each report clean. These tokens appear
 * verbatim inside the Swift-mangled symbol names (e.g. ...13amIJailbrokenSbyFZ). */
const BOOL_CHECKS = [
  'amIJailbroken',        // also amIJailbrokenWithFailMessage / WithFailedChecks
  'amIDebugged',
  'amIReverseEngineered',
  'amIRunInEmulator',
  'amIProxied',
  'amITampered',
];
const VOID_NOOPS = ['denyDebugger']; // actively hardens anti-debug -> no-op it
const MAX_TRIES = 10; // max number of tries when install hooks
const WAIT_TIME = 3; // number of seconds to wait before trying install hooks again

const hooked = new Set(); // guard against double-hooking on dlopen retries

/* ---- primary: resolve + hook IOSSecuritySuite Swift symbols ---------------- */
function enumTargetModules() {
  const fw = Process.findModuleByName('IOSSecuritySuite'); // dynamic framework
  if (fw) return [fw];
  return [Process.enumerateModules()[0]]; // static link -> app executable
}

function scanSymbols(mods) {
  const want = BOOL_CHECKS.concat(VOID_NOOPS);
  const hits = {};
  mods.forEach((mod) => {
    let syms;
    try { syms = mod.enumerateSymbols(); } catch (e) { return; }
    syms.forEach((s) => {
      if (!s.address || s.address.isNull()) return;
      want.forEach((w) => {
        if (s.name.indexOf(w) !== -1) (hits[w] = hits[w] || []).push(s);
      });
    });
  });
  return hits;
}

function installSwiftHooks() {
  let hits = scanSymbols(enumTargetModules());
  if (Object.keys(hits).length === 0) hits = scanSymbols(Process.enumerateModules()); // broaden
  let count = 0;

  BOOL_CHECKS.forEach((name) => (hits[name] || []).forEach((s) => {
    const key = s.address.toString();
    if (hooked.has(key)) return;
    try {
      Interceptor.attach(s.address, {
        onLeave(retval) { retval.replace(ptr(0)); } // Swift Bool / tuple-leading Bool in x0
      });
      hooked.add(key); count++;
      console.log('[+] forced false: ' + name + '  @ ' + s.address);
    } catch (e) { console.log('[-] attach ' + name + ': ' + e); }
  }));

  VOID_NOOPS.forEach((name) => (hits[name] || []).forEach((s) => {
    const key = s.address.toString();
    if (hooked.has(key)) return;
    try {
      Interceptor.replace(s.address, new NativeCallback(() => { }, 'void', []));
      hooked.add(key); count++;
      console.log('[+] no-op: ' + name + '  @ ' + s.address);
    } catch (e) { console.log('[-] replace ' + name + ': ' + e); }
  }));
  return count;
}

/* ---- orchestration --------------------------------------------------------- */
function runAll() {
  const n = 0;
  // const n = installSwiftHooks();
  if (n === 0) console.log('[!] No IOSSecuritySuite Swift symbols yet (not loaded / stripped)');
  return n;
}

function main() {
  if (runAll() > 0) {
    console.log('[*] IOSSecuritySuite bypass armed.');
  } else {
    console.log('[-] Cannot install IOSSecuritySuite hooks.');
  }

}

if (ObjC.available) main();
else console.log('[-] ObjC runtime unavailable');
