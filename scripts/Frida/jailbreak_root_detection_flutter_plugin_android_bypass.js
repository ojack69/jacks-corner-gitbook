if (Java.available) {

    Java.perform(() => {

        // RootedCheck.isJailBroken
        const RootedCheck = Java.use('com.anish.trust_fall.rooted.RootedCheck');
        RootedCheck.isJailBroken.implementation = function (args) {
            console.log("[!] Bypassing RootedCheck.isJailBrokens")
            return false;
        }

        // AntiFridaChecker.checkFrida
        const AntiFridaChecker = Java.use('com.w3conext.jailbreak_root_detection.frida.AntiFridaChecker$Companion');
        AntiFridaChecker.checkFrida.implementation = function (args) {
            console.log("[!] Bypassing AntiFridaChecker.checkFrida")
            return false;
        }

        // Debugger.isDebugged
        const Debugger = Java.use('com.w3conext.jailbreak_root_detection.debuger.Debugger');
        Debugger.isDebugged.implementation = function (args) {
            console.log("[!] Bypassing Debugger.isDebugged")
            return false;
        }

        // DevMode.isDevMode
        const DevMode = Java.use('com.w3conext.jailbreak_root_detection.devmode.DevMode');
        DevMode.isDevMode.implementation = function (args) {
            console.log("[!] Bypassing DevMode.isDevMode")
            return false;
        }

        // MagiskChecker.isInstalled
        const MagiskChecker = Java.use('com.w3conext.jailbreak_root_detection.magisk.MagiskChecker');
        MagiskChecker.isInstalled.implementation = function (args) {
            console.log("[!] Bypassing MagiskChecker.isInstalled")
            return false;
        }

        // EmulatorCheck.isEmulator
        const EmulatorCheck = Java.use('com.anish.trust_fall.emulator.EmulatorCheck');
        EmulatorCheck.isEmulator.implementation = function(args){
            console.log("[!] Bypassing EmulatorCheck.isEmulator")
            return false
        }

        // ExternalStorageCheck.isOnExternalStorage
        const ExternalStorageCheck = Java.use('com.anish.trust_fall.externalstorage.ExternalStorageCheck');
        ExternalStorageCheck.isOnExternalStorage.implementation = function (args) {
            console.log("[!] Bypassing ExternalStorageCheck.isOnExternalStorage")
            return false;
        }
    })
}