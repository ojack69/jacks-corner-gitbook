Title: Windows Privilege Escalation
Slug: privilege-escalation/windows-privilege-escalation
Date: 2025-01-18 00:00
Category: Privilege Escalation

## Concepts

**User Accounts**: users used to log into a Windows system.

- The local `Administrator` account is created by default at installation; there are other default accounts such as `Guest`.

**Service Accounts**: users used to run services in Windows. Are not used to log into a Windows system.

- The `SYSTEM` account is the default service account with the highest privileges; there are other default service account such as `NETWORK SERVICE` and `LOCAL SERVICE`

**Groups**: allow easier access control to resources; multiple user can belong to multiple groups.

- **Regular Groups**: groups with a set list of members (e.g. Administrator, Users).
- **Pseudo Groups**: groups with a dynamic list of members (e.g. Authenticated Users).

**Resources**: files/directories, registry entries, services, etc are all different type of Windows' resources. Resource are also known as **Objects**.

- The access to resources is regulated by **Access Control Lists (ACLs)** which define whether a user or a group can perform a read/write operation on an object.
- ACLS are composed by zero or more **Access Control Entries (ACEs)** which define the relationship between a principal (e.g. a user or a group) and a *access right*.

**Access Tokens**: are special object that store a user's identity and privileges, defining the **security context** of the user's processes and thread. There are two type of access tokens:

- **Primary Access Tokens**: created when the user logs in, bound to the current user session. When the user starts a new process, the primary access token gets copied to the new process.
- **Impersonation Access Token**: created when a process or thread need to temporarily run with  the security context of another user.

**Token Duplication**: processes and threads can duplicate their access tokens. This way, an impersonation access token can be duplicated into a primary access token. 

- An attacker can inject into a running process if it has the `SeDebugPrivilege`.
- Having this capabilities, it's possible for it to duplicate the access token of the process and spawn a separate process with the same privileges.

**Named Pipes**: a named pipe is an extension of traditional pipe concept typical in Unix systems. While a traditional pipe is "unnamed" and lasts as long as the process, a named pipe lasts as long as the system is up. 

- A process `A` creates a named pipe.
- Other processes `X` can open this named pipe in order to perform read/write operations.
- The process `A` **can impersonate the security context** of the process `Xi` which connects to its named pipe.

**User Privileges**:

- `SeImpersonatePrivilege`: grants the ability to impersonate any access token.
- `SeAssignPrimaryPrivilege`: grants the ability to assign an access token to a new process
- `SeBackupPrivilege`: grants read access to all objects on the system, regardless of their ACL. Abusing this privilege, an attacker could gain access to sensitive file, extract hashes from the registry to be cracked or passed around, etc.
- `SeRestorePrivilege`: grants write access to all objects on the system, regardless of their ACL. Abusing this privilege, an attacker could modify services binaries, overwrite DLLs, modify registry settings, etc.
- `SeTakeOwnershipPrivilege`: grants the ability to take ownership over an object.
- `SeTcbPrivilege`: grants the ability to act as part of the operating system, allowing the process to authenticate as any user. Often required by system services that impersonate clients.
- `SeCreateTokenPrivilege`: allows the creation of security tokens, enabling the process to create and assign new access tokens. This is highly sensitive and typically reserved for system-level operations.
- `SeLoadDriverPrivilege`: permits the loading and unloading of device drivers. This privilege is critical for kernel-mode code execution and can impact system stability and security.
- `SeDebugPrivilege`: enables the process to debug and access the memory of any process, including system processes. Essential for developers and troubleshooting but a significant security risk if misused.
- [Detailed reference](https://github.com/hatRiot/token-priv)

## Kernel Exploits

**Kernel**: layer between the application software and the computer hardware.

- Has complete control over the operating system.
- Exploiting a kernel vulnerability can result in executing command as SYSTEM user.

**Kernel exploits can often be unstable and may cause a system crash.**

See [[windows-privilege-escalation-cheatsheet#Kernel Exploits|Windows Privilege Escalation Cheatsheet - Kernel Exploits]].

## Service and Tasks Exploits

**Insecure Service Permissions**: when the user has the **SERVICE_CHANGE_CONFIG** or **SERVICE_ALL_ACCESS** permissions on a the ACL for a service that runs as SYSTEM, it can modify the service configuration, setting the executable of the service to a malevolent one (generally, a reverse shell).


**Unquoted Service Path**:  Services that uses binaries with unquoted paths and a space in their name allow an attacker to drop an arbitrary binary to be executed by the service abusing the ambiguity in the service's binary path.

Consider the following bin path:

~~~
c:\program files\sub dir\program name
~~~

The system tries to interpret the possible correct path in the following order:

1. c:\program.exe 
2. c:\program files\sub.exe 
3. c:\program files\sub dir\program.exe
4. c:\program files\sub dir\program name.exe


**Weak Permissions Registry**: For each service are store some entries, such as the binary path, in the Windows Registry. Misconfigured ACLs on these registry entries may allow an attacker to modify the service even though it has not direct permission on the service object.

- Service's registry entries are located at `HKLM\System\CurrentControlSet\Services`

**Insecure Service Executable**: When permissions on a service's executable are misconfigured, an attacker could simply replace the legit binary with a mischievous one even though it not has privileges on the service.

**DLL Hijacking**: When a service's binary loads a DLL to execute some functionalities, these will run with the same privileges as the service. 

- When the DLL is loaded with an absolute path, if it's writable by an attacker controlled user, it's possible for it to replace this DLL with a mischievous one.
- When the DLL is not loaded with an absolute path, if an attacker has write permissions on the location where the system would try to load this DLL, it can inject a mischievous DLL.

When DLLs are loaded by a binary, Windows would try to locate it in the following order:

~~~
- Directory where the binary is located
- C:\Windows\System32
- C:\Windows\System
- C:\Windows\
- Current directory where the binary has been launched
- Directory present in %PATH% environment variable
~~~

A good approach is to enumerate directories in the `%PATH%` environment variable and check if those are writable by the user.

**Note**: In order to exploit any of the previous techniques, the service must be restarted:

- **SERVICE_STOP** and **SERVICE_START** privileges are required to restart a service. 


**Scheduled Tasks**: Windows allows to configure scheduled tasks that run periodically on when triggered by an event. Task generally run with the creator user's privileges; however, it's possible for administrator to configure the running user. An attacker is likely to target tasks running with SYSTEM privileges.

- If the attacker can write on the executable being run by the task, it can inject command to be executed with elevated privileges.

See [[windows-privilege-escalation-cheatsheet#Service and Tasks Exploits|Windows Privilege Escalation Cheatsheet - Service and Tasks Exploits]].

## Registry Exploits

**AutoRuns**: Windows allows to run command at startup with elevated privileges by specifying the executable to "auto run". An attacker that can write on an AutoRun executable, might escalate privileges the moment the system gets restarted.

- AutoRun executables are located at `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`
- **On Windows 10, the executables runs with the privileges of the last logged on user!**

**AlwaysInstallElevated**: Normally MSI executables run with the permission of the user trying to install them. However, when the `AlwaysInstallElevated` registry is set to `1`, it's possible to run MSI files with elevated privileges even though the Administrator password is not known. `AlwaysInstallElevated` must be set to `1` for both current user and local machine in order to allow privilege escalation:

- Local Machine registry: `HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer`
- Current User registry: `HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer`

See [[windows-privilege-escalation-cheatsheet#Registry Exploits|Windows Privilege Escalation Cheatsheet - Registry Exploits]].

## Applications Exploits

**Insecure GUI Applications**: On older version on Windows, users could be granted permissions to run GUI application with elevated privileges. An attacker could abuse some native Windows functionality such as the "file browse" to execute commands or even spawn an elevated command prompt.

**Startup App**: Windows allows to start some application when a user logs in. Moreover, generally for administrators, it's possible to add startup applications for all users. This is done by creating a shortcut to the target application in the following folders:

- **Current user startup folder**: `C:\Users\Username\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`
- **All users startup folder**: `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp`

When the attacker can write in the last folder, it can setup a mischievious executable to be run the moment an admin logs in.


## Potatoes

General Reference: [Potatoes - Windows Privilege Escalation](https://jlajara.gitlab.io/Potatoes_Windows_Privesc#hotPotato)

### Hot Potato

This attack uses a combination of **NTLM relay** and **DNS spoofing** to gain SYSTEM privileges.  
- This is done by mean of a **NBNS Spoofer** which will impersonate the name resolution and force the system to download and deploy a malicious WAPD configuration from a fake **WPAD Proxy Server** which will force the system to perform a NTLM authentication against an HTTP server.
	- The NBS Spoofer can eventually force a DNS lookup by mean of a technique called **Port Exhaustion**: binding to every single UDP port (NBNS is a UDP protocol), when the system tries to perform a DNS lookup it will fail because there will be no available source port for the DNS reply to come to.
- The NTLM credential gets then relayed to SMB (**SMB Relay**) in order to execute commands as SYSTEM.

~~~quote
Microsoft patched this (MS16-075) by disallowing same-protocol NTLM authentication using a challenge that is already in flight. What this means is that SMB->SMB NTLM relay from one host back to itself will no longer work. MS16-077 WPAD Name Resolution will not use NetBIOS (CVE-2016-3213) and does not send credential when requesting the PAC file(CVE-2016-3236). WAPD MITM Attack is patched.
~~~

Vulnerable Windows versions:

- Windows 7 and earlier
- Windows Server 2008 R2 and earlier
- Windows 8.x
- Windows 10 before release 1607
- Windows server 2012 and 2012 R2

Hot Potato reference: [https://github.com/foxglovesec/Potato](https://github.com/foxglovesec/Potato)

See [[windows-privilege-escalation-cheatsheet#Potatoes|Windows Privilege Escalation Cheatsheet - Potatoes]].
### Rotten Potato

Users with `SeImpersonate` and `SeAssignPrimaryToken` privileges can impersonate the access token of other users, including SYSTEM. 

- Generally, service accounts are configured with these two privileges.

The Rotten Potato attacks abuses this privileges in order to gain SYSTEM privileges. This attack is complex; please refer to [this](https://foxglovesecurity.com/2016/09/26/rotten-potato-privilege-escalation-from-service-accounts-to-system/):

~~~quote
1. Trick the “NT AUTHORITY\SYSTEM” account into authenticating via NTLM to a TCP endpoint we control.
2. Man-in-the-middle this authentication attempt (NTLM relay) to locally negotiate a security token for the “NT AUTHORITY\SYSTEM” account. This is done through a series of Windows API calls.
3. Impersonate the token we have just negotiated. This can only be done if the attackers current account has the privilege to impersonate security tokens. This is usually true of most service accounts and not true of most user-level accounts.
~~~


Vulnerable Windows versions:

- Windows 7 and earlier
- Windows 8 and Windows 8.1
- Windows 10 before release 1607
- Windows Server 2008 and 2008 R2
- Windows Server 2012 and 2012 R2
- Windows Server 2016 (early versions)

See [[windows-privilege-escalation-cheatsheet#Potatoes|Windows Privilege Escalation Cheatsheet - Potatoes]].

### Juicy Potato

This attack works in the same way as Rotten Potato, extending it and bypassing some of its limits.

Vulnerable Windows versions:

- Windows 7 and earlier
- Windows 8 and Windows 8.1
- Windows 10 before release 1607
- Windows Server 2008 and 2008 R2
- Windows Server 2012 and 2012 R2
- Windows Server 2016 (early versions)

See [[windows-privilege-escalation-cheatsheet#Potatoes|Windows Privilege Escalation Cheatsheet - Potatoes]].

### Rogue Potato

Rogue Potato uses **RPC over ALPC (Asynchronous Local Procedure Call)** instead of traditional COM interfaces, bypassing restrictions that prevent Rotten/Juicy Potato attacks.

This attack is complex; please refer to [this](https://decoder.cloud/2020/05/11/no-more-juicypotato-old-story-welcome-roguepotato/).

Vulnerable Windows versions:

- Windows 7
- Windows 8
- Windows 8.1
- Windows 10 before release 1709
- Windows Server 2008
- Windows Server 2008 R2
- Windows Server 2012
- Windows Server 2012 R2
- Windows Server 2016


See [[windows-privilege-escalation-cheatsheet#Potatoes|Windows Privilege Escalation Cheatsheet - Potatoes]].

### Print Spoofer

The **PrintSpoofer** attack is a Windows **privilege escalation** technique that exploits the **Print Spooler service** to impersonate privileged tokens (e.g., SYSTEM). It leverages the ability of authenticated users to interact with the Print Spooler to perform NTLM authentication redirection and token impersonation, granting SYSTEM-level access on the local machine.

Vulnerable Windows versions:

- Windows 7
- Windows 8
- Windows 8.1
- Windows 10 before release 20H2
- Windows Server 2008
- Windows Server 2008 R2
- Windows Server 2012
- Windows Server 2012 R2
- Windows Server 2016
- Windows Server 2019 (early builds)

See [[windows-privilege-escalation-cheatsheet#Potatoes|Windows Privilege Escalation Cheatsheet - Potatoes]].
(yeah, it's not a potato but it's a similar attack)
### Local Potato

Reference: [LocalPotato - When Swapping The Context Leads You To SYSTEM](https://www.localpotato.com/localpotato_html/LocalPotato.html)

The Local Potato attack is a Windows privilege escalation technique that exploits vulnerabilities in `SeImpersonatePrivilege` and NTLM authentication redirection. It allows attackers with low-privilege access to perform arbitrary file read/write and elevation of privileges.

It works targeting two different scenarios:

- SMB Scenario: patched with **[CVE-2023-21746](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2023-21746)**. By abusing SMB, it's possible for an attacker to copy malicious DLL to any system path, enabling to elevate privileges by DLL Hijacking attacks.
- HTTP/WebDAV scenario: should still work on recent releases. By abusing the WebDAV, it's possible for an attacker to perform arbitrary file write to the WebDAV directory.

See [[windows-privilege-escalation-cheatsheet#Potatoes|Windows Privilege Escalation Cheatsheet - Potatoes]].

### Sweet Potato & Generic Potato

**Sweet Potato**: is a collection of various native Windows privilege escalation techniques from service accounts to SYSTEM. Reference [here](https://github.com/CCob/SweetPotato).

**Generic Potato**: modified version of SweetPotato  supporting impersonating authentication over HTTP and/or named pipes. This allows for local privilege escalation from SSRF and/or file writes. Reference [here](https://github.com/micahvandeusen/GenericPotato).

Generic potato is useful when:

~~~quote
// https://jlajara.gitlab.io/Potatoes_Windows_Privesc#hotPotato
- The system doesn’t have the print service running which prevents SweetPotato.
- WinRM is running preventing RogueWinRM
- You don’t have outbound RPC allowed to any machine you control and the BITS service is disabled preventing RoguePotato.
~~~

### God Potato

Reference: [GodPotato: Empowering Windows Privilege Escalation Techniques](https://medium.com/@iamkumarraj/godpotato-empowering-windows-privilege-escalation-techniques-400b88403a71)

Not so much information available.

Vulnerable Windows Versions:

- from Windows Server 2012 to Windows Server 2022 
- from Windows8 to Windows 11

See [[windows-privilege-escalation-cheatsheet#Potatoes|Windows Privilege Escalation Cheatsheet - Potatoes]].


## Meterpreter getsystem

Meterpreter's `getsystem` command allows a local admin user to escalate to SYSTEM. It tries three different attacks in cascade:

- **Named Pipe Impersonation (In Memory/Admin)**: Creates a **named pipe** controlled by Meterpreter and a service running as SYSTEM (**therefore, local admin privileges are required**) which will connect to the named pipe. This way, it can impersonate the connected process' security context and copies it's **impersonation token** to all subsequent threads which will run as SYSTEM.
- **Named Pipe Impersonation (Dropper/Admin)**: similar to previous technique; a DLL gets written on the disk and a service is created to run as SYSTEM, executing the DLL which connects to the named pipe.
- **Token Duplication (In Memory/Admin)**: requires the `SeDebugPrivilege`. It injects into a service process running as SYSTEM. In this process, it injects a DLL which **duplicates the access token** of the service and assigns it to Meterpreter. This technique only works on x86 architectures, therefore is almost completely deprecated.

## Misc

### EFS Encryption

To decrypt a file that’s been encrypted using **Encrypting File System (EFS)** on Windows, you need to do it as the user who originally encrypted the file **or** a user who has access to the encryption certificate (i.e., has the private key).

There are different ways to decrypt an EFS-encrypted file:

- Using file explorer as the user that encrypted the file. It also works with RDP sessions.
- From command line when **user profile is fully loaded**:  EFS decryption only works when the correct user profile is fully loaded since the EFS certificate and keys lives in the user's certificate store (`Cert:\CurrentUser\My`) and registry (`HKEY_CURRENT_USER`). For this reason, `psexec` or `wmiexec` (or similar) won't work since these methods do not load a full user profile. Using instead `runas` (or `RunasCs`) will work.
- Import the user certificate under **"Personal" Certificates** when using a different user. Requires the certificate `.pfx` and the private key.

User's EFS certificate are located at:

- `AppData\Roaming\Microsoft\SystemCertificates\My\Certificates`
- `AppData\Roaming\Microsoft\SystemCertificates\My\Keys`

It's also possible to export EFS certificates with `certmgr.msc`.