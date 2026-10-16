// This script bypasses the Flutter plugin jaibreak_root_detection (https://pub.dev/packages/jailbreak_root_detection) on iOS.
// Note: the following checks are not hooked and therefore not bypassed even though theri bypass is naive:
//  1. UIDevice+JailBroken - hasCydiaInstalled: this check tryies opening a deep link with the protocol `cydia://` - Cydia is abandoned and deprecated
//  2. UIDevice+JailBroken - isSimulator: checks if current device is a simulator - Testing on a simulator is not common

if (ObjC.available) {
    function hookFileManagerFileExists() {
        const blacklisted = [
            // Bypass CydiaChecker

            "/Applications/Cydia.app",
            "/Library/MobileSubstrate/MobileSubstrate.dylib",
            "/bin/bash",

            // Bypass FridaChecker
            "/usr/bin/frida-server",
            "/usr/lib/libfrida-core.dylib",

            // Bypass ReverseEngineeringChecker - suspicious files
            "/usr/sbin/frida-server",
            "/private/etc/dpkg/origins/debian",
            "/private/var/lib/cydia/metadata.plist",
            "/private/var/mobile/Library/Preferences/com.saurik.CyDelete.plist",
            "/private/var/stash",

            // Bypass UIDevice+JailBroken - isContainsSuspiciousApps
            "/Applications/Cydia.app",
            "/Applications/blackra1n.app",
            "/Applications/FakeCarrier.app",
            "/Applications/Icy.app",
            "/Applications/IntelliScreen.app",
            "/Applications/MxTube.app",
            "/Applications/RockApp.app",
            "/Applications/SBSettings.app",
            "/Applications/WinterBoard.app",
            "/Applications/Snoop-itConfig.app",
            "/Applications/Cydia.app",
            "/Applications/Icy.app",
            "/Applications/MxTube.app",
            "/Applications/RockApp.app",
            "/Applications/SBSettings.app",
            "/Applications/WinterBoard.app",
            "/Applications/Snoop-itConfig.app",
            "/Applications/SBSetttings.app",
            "/Applications/IntelliScreenX.app",
            "/Applications/terminal.app",
            "/Applications/MewSeek.app",
            "/Applications/OmniStat.app",
            "/Applications/Poof.app",
            "/Applications/Terminal.app",
            "/Applications/iFile.app",
            "/Applications/Activator.app",
            "/Applications/checkra1n.app",
            "/var/checkra1n.dmg",

            // Bypass UIDevice+JailBroken - isSuspiciousSystemPathsExists
            "/Library/MobileSubstrate/DynamicLibraries/LiveClock.plist",
            "/Library/MobileSubstrate/DynamicLibraries/Veency.plist",
            "/Library/MobileSubstrate/DynamicLibraries/Activator.dylib ",
            "/private/var/lib/apt",
            "/private/var/lib/apt/",
            "/private/var/lib/cydia",
            "/private/var/mobile/Library/SBSettings/Themes",
            "/private/var/stash",
            "/private/var/tmp/cydia.log",
            "/System/Library/Caches/apticket.der",
            "/System/Library/LaunchDaemons/com.ikey.bbot.plist",
            "/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
            "/System/Library/Caches/com.apple.dyld/dyld_shared_cache_armv7s",
            "/usr/bin/sshd",
            "/Library/Frameworks/CydiaSubstrate.framework",
            "/Library/PreferenceLoader/Preferences",
            "/Library/PreferenceBundles",
            "/usr/bin/ssh",
            "/usr/libexec/sftp-server",
            "/usr/sbin/sshd",
            "/etc/apt",
            "/bin/bash",
            "/Library/MobileSubstrate/MobileSubstrate.dylib",
            "/bin/sh",
            "/bin/su",
            "/etc/ssh/sshd_config",
            "/private/var/mobile/Library/SBSettings/Themes",
            "/private/var/mobile/Library/SBSettings",
            "/private/var/stash",
            "/var/tmp/cydia.log",
            "/var/lib/cydia",
            "/usr/libexec/ssh-keysign",
            "/var/cache/apt",
            "/var/lib/apt",
            "/etc/apt/sources.list.d",
            "/etc/apt/sources.list.d/cydia.list",
            "/usr/bin/cycript",
            "/usr/sbin/frida-server",
            "/usr/local/bin/cycript",
            "/usr/lib/libcycript.dylib",
            "/var/log/syslog",
            "/private/etc/dpkg/origins/debian",
            "/bin.sh",
            "/private/etc/apt",
            "/etc/ssh/sshd_config",
            "/private/etc/ssh/sshd_config",
            "/private/var/mobileLibrary/SBSettingsThemes/",
            "/private/var/stash",
            "/usr/libexec/cydia/",
            "/var/binpack",
            "/var/lib/dpkg/info/checkra1n.list",
            "/usr/bin/checkra1n",
            "/private/var/lib/dpkg/info",
            "/private/var/lib/dpkg/status",
            "/private/var/root/Media/Cydia",
            "/private/var/root/Media/Cydia/AutoInstall",
            "/private/var/mobile/Media/BootLogo",
            "/private/var/mobile/Media/Firmware",
        ]


        const FM = ObjC.classes.NSFileManager;
        const argPath = (args) => new ObjC.Object(args[2]).toString();
        Interceptor.attach(FM['- fileExistsAtPath:'].implementation, {
            onEnter(args) {
                try { this.path = argPath(args); } catch (e) { this.path = null; }
                // console.log(`[!] fileExistsAtPath: ${this.path}`)
            },
            onLeave(ret) {
                if (blacklisted.includes(this.path)) {
                    console.log(`[>] Bypassing fileExistsAtPath: ${this.path}`)
                    ret.replace(ptr(0)); // NO / false
                }
            }
        });

    }

    function hookStat() {
        const statPtr = Module.findGlobalExportByName("stat");
        Interceptor.attach(statPtr, {
            onEnter: function (args) {
                this.path = args[0].readUtf8String();
                // console.log(`[!] stat: ${this.path}`)
            },
            onLeave: function (ret) {
                if (this.path === 'system') {
                    console.log(`[>] Bypassing stat: ${this.path}`)
                    ret.replace(ptr(-1));
                }
            }
        })
    }

    function hookDylib() {
        const bannedLibs = [
            "FridaGadget",
            "frida", // Needle injects frida-somerandom.dylib
            "cynject",
            "libcycript"
        ]
        const statPtr = Module.findGlobalExportByName("_dyld_get_image_name");
        Interceptor.attach(statPtr, {
            onEnter: function (args) {
                // console.log(`[!] dylib: ${this.path}`)
            },
            onLeave: function (ret) {
                this.libname = ret.readUtf8String()
                if (bannedLibs.some(x => this.libname.toLowerCase().includes(x.toLowerCase()))) {
                    console.log(`[>] Bypassing dylib: ${this.libname}`)
                    ret.replace(ptr(-1));
                }
            }
        })
    }

    function hookFileWrite() {
        Interceptor.attach(Module.findGlobalExportByName("write"), {
            onEnter: function (args) {
                const buffer = args[1];
                const count = args[2].toInt32();
                let data = '';
                try {
                    data = buffer.readUtf8String(Math.min(count, 4096));
                } catch (_) {
                    data = '<non UTF-8 data>';
                }
                this.content = data
            },
            onLeave: function (ret) {
                if (this.content === 'Developer Insider') {
                    console.log(`[>] Bypassing file write: ${this.content}`)
                    ret.replace(ptr(0))
                }
            }
        })
    }

    function hookPortCheck() {
        const connectPtr = Module.findGlobalExportByName('connect');

        if (connectPtr === null) {
            throw new Error('connect() not found');
        }

        const TARGET_PORT = 9999;
        const bannedPorts = [
            27042, // default Frida
            4444, // default Needle
            22, // OpenSSH
            44 // checkra1n
        ]

        Interceptor.attach(connectPtr, {
            onEnter(args) {
                const sockfd = args[0].toInt32();
                const addr = args[1];
                const addrlen = args[2].toInt32();

                // sockaddr_in requires at least 16 bytes.
                if (addr.isNull() || addrlen < 16) {
                    return;
                }

                const portPtr = addr.add(2);
                const netPort = portPtr.readU16();
                // Convert LE endianess to host representation
                const originalPort = ((netPort & 0xFF) << 8) | ((netPort >> 8) & 0xFF);

                if (bannedPorts.includes(originalPort)) {
                    console.log(`[>] Bypassing check port: ${originalPort}`)
                    // sin_port is stored in network byte order.
                    const replacementPort = ((TARGET_PORT & 0xFF) << 8) |
                        ((TARGET_PORT >> 8) & 0xFF);

                    console.log(
                        `[connect] fd=${sockfd}, port=${originalPort} -> ${TARGET_PORT}`
                    );

                    portPtr.writeU16(replacementPort);
                }

            }
        });

    }

    hookFileManagerFileExists()
    hookStat()
    hookDylib()
    hookFileWrite()
    hookPortCheck()
}
