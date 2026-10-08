Title: eJPT-v2 Concepts
Slug: certifications/inesecurity/ejpt-concepts
Date: 2024-01-05 18:00
Category: Certifications


# Information Gathering

Active: actively interacting with systems or individuals to obtain specific information
Passive: find as much information about a target from public available information

## Passive Information Gathering
### WHOIS

Whois: protocol used to perform a lookup of a domains or ip address blocks registered users or assignee

when privacy options are enabled (for example by enabling DNSSEC), it hides information about registrant.

### Website Footprinting with Netcraft
Netcraft: it's used to gather information about a target domain such as registrar, emails, ip addresses, tls/ssl certificates, OS or web technologies, probable vulnerabilities, etc.
It offers an Internet Data Mining service which collects all kind of informations about a target

It collects all information collected manually into previous topics.

### DNS Recon

When cloudflare is set as proxy, if the mail server and website are hosted on the same server, the MX record will expose the real IP since it needs an A record since Cloudflare does not proxy mail traffic ([see here](https://community.cloudflare.com/t/deprecated-an-a-aaaa-cname-or-mx-record-is-pointed-to-your-origin-server-exposing-your-origin-ip-address/67604)).

### Subdomain Enumeration with sublist3r

sublist3r: uses public accessible databases (OSINT) to collect information about a domain. Eventually it supports brute force but it would be active enumeration.

Since it uses public engines, a large number of requests can lead to a block: bypassable with a VPN

## Active Information Gathering

### DNS Zone Transfers

Cool resource:

- zonetransfer.me : playground domain useful when testing tools regarding DNS pentesting

Zone transfer is a mechanism use to copy one or more zone records from a DNS server to another; in case of misconfigurations, this functionality can be abused by attackers which can obtain a more complete view of the target network, and, in some cases, leak internal network addresses.

\*Note: /etc/hosts has priority above dns server when resolving a name

### Port Scanning
When dealing with windows systems, ICMP requests are tipically blocked. Nmap uses ping (ICMP protocol) to check host aliveness: when ICMP is blocked, the -Pn option is required to avoid checking host is alive.

# Assessment Methodologies: Footprinting & Scanning

## Network Host Mapping
Network mapping process involves:

- Physical Access: 
     - a PT can include physical security like camera
     - get ip addresses or dns records through OSINT, 
     - Use Social engineering to get addresses

- Sniffing: 
    - collect ip addresses or mac intercepting traffic

- ARP: protocol which maps MAC with ip addresses. Each host holds an arp table containing the known associations between MAC and IP addresses; when a new host requests (via broadcast message) whose MAC is associated to an ip, the first host who knows the answer (in its arp table) will respond
    - arp-scan: tool to run an arp scan

- ICMP: protocol generally used to diagnose network connectivity issues. 
    - traceroute: shows all the network point between a source and a destinations, revealing the path of the sent packages
    - ping: sends an echo request (type 8) and eventually gets a response; used to check if an host is alive

## Port Scanning
TCP Three way handshake
    - Client: SYN
    - Server: SYN + ACK
    - Client: ACK

- Identify Operating Systems:
    - Based on what's revealed by signature: the tool compares the responses from an host with the signatures stored in its signature database

- Identify Services: trying to connect to their port and understand how them respond.
    - Trying a TCP full handshake (three-way handshake)
    - Trying a stealth TCP connection, resetting the connection (RST) right after the SYN + ACK
    - banner grabbing

## Assessment Methodologies: Enumeration

### SMB & SAMBA
Generally ports open are 135, 139, 445 when dealing with machines with SMB.

**SMB**: Windows implementation of a network file share service. Stands for Server Message Block.
**SAMBA**: is SMB protocol implementation on Linux.

### FTP
File Transfer Protocol, default port is 21.

Anonymous login: when anonymous login is enabled is possible to login as "anonymous" user with empty password

### SSH
Secure Shell, default port is 22.


### MySQL
Default port is 3306.

### MSSQL

Default port 1433.

### SMTP

SMTP uses TCP port 25 by default. It is can also be configured to run on TCP port 465 and 587 when running with SSL or TLS.

# Vulnerability Assessment

### Vulnerabilities

Vulnerability: 

- NIST definition: A weakness in the computational logic (e.g., code) found in software and hardware components that, when exploited, results in a negative impact to confidentiality, integrity, or availability.

Can be found in:

- the hardware
- the software
- the OS

### Heartbleed

Heartbleed (CVE-2014-0160): The (1) TLS and (2) DTLS implementations in OpenSSL 1.0.1 before 1.0.1g do not properly handle Heartbeat Extension packets, which allows remote attackers to obtain sensitive information from process memory via crafted packets that trigger a buffer over-read, as demonstrated by reading private keys, related to d1_both.c and t1_lib.c, aka the Heartbleed bug.

### EternalBlue - MS17-1010

EternalBlue (CVE-2017-0143): The SMBv1 server in Microsoft Windows Vista SP2; Windows Server 2008 SP2 and R2 SP1; Windows 7 SP1; Windows 8.1; Windows Server 2012 Gold and R2; Windows RT 8.1; and Windows 10 Gold, 1511, and 1607; and Windows Server 2016 allows remote attackers to execute arbitrary code via crafted packets, aka "Windows SMB Remote Code Execution Vulnerability." 

### Log4J

CVE-2021-44228: Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.3.1) JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints. An attacker who can control log messages or log message parameters can execute arbitrary code loaded from LDAP servers when message lookup substitution is enabled. From log4j 2.15.0, this behavior has been disabled by default. From version 2.16.0 (along with 2.12.2, 2.12.3, and 2.3.1), this functionality has been completely removed. Note that this vulnerability is specific to log4j-core and does not affect log4net, log4cxx, or other Apache Logging Services projects.

# Host & Network Penetration Testing: System/Host Based Attacks

Inherent with exploiting Windows or Linux vulnerabilities.

System/Host based attacks are attacks targeting a specific system running a specific operating system. Usually exploitable after gaining access to the target network. 

## Windows

Microsoft Windows has various OS versions and releases which makes the threat surface fragmented in terms of vulnerabilities.

- For example, vulnerabilities that exist in Windows 7 are not present in Windows 10

All Windows OS’s:

- are developed in C => vulnerable to buffer overflows, arbitrary code execution
- are unsafe by default, a proactive implementation of security policies is required
- new vulnerabilities are slowly patched due the fragmented Windows nature

Transition from a Windows release to another is a slow process for customers so many of them opt to use older versions that may be affected by an increasing number of vulnerabilities.

### Frequently Exploited Windows Services


| Protocol/Service                                | Ports              | Purpose                                                                                                                                                   |  
|:------------------------------------------------|:-------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------|  
| Microsoft IIS (Internet Information Services)   | TCP ports 80/443   | Proprietary web server software developed by Microsoft that runs on Windows.                                                                              |  
| WebDAV (Web Distributed Authoring & Versioning) | TCP ports 80/443   | HTTP extension that allows clients to update, delete, move and copy files on a web server. WebDAV is used to enable a web server to act as a file server. |  
| SMB/CIFS (Server Message Block Protocol)        | TCP port 445       | Network file sharing protocol that is used to facilitate the sharing of files and peripherals between computers on a local network (LAN).                 |  
| RDP(Remote Desktop Protocol)                    | TCP port 445       | Proprietary GUI remote access protocol developed by Microsoft and is used to remotely authenticate and interact with a Windows system.                    |  
| WinRM (Windows Remote Management Protocol)      | TCP ports 5986/443 | Windows remote management protocol that can be used to facilitate remote access with Windows systems.                                                     |  

#### IIS

IIS (Internet Information Services) is a proprietary extensible web server software developed by Microsoft for use with the Windows NT family.

Supported executable file extensions:

- .asp
- .aspx
- .config
- .php

#### WebDAV

WebDAV (Web-based Distributed Authoring and Versioning) is a set of extensions to the HTTP protocol which allow users to collaboratively edit and manage files on remote web servers. WebDAV runs on top Microsoft IIS on ports 80/443.
WebDAV implements authentication in the form of a username and password.

Exploitation:

- Identifying whether WebDAV has been configured to run on the IIS web server
- Brute-force attack on the WebDAV server in order to identify legitimate credentials
- Upload a malicious .asp payload that can be used to execute arbitrary commands or obtain a reverse shell on the target.
#### SMB and PsExec

SMB (Server Message Block) is a network file sharing protocol that is used to facilitate the sharing of files and peripherals (printers and serial ports) between computers on a local network (LAN).

Users must provide a username and password in order to authenticate with the SMB server in order to access a share.

PsExec is a lightweight telnet-replacement developed by Microsoft that allows you execute processes on remote windows systems using any user’s credentials.

#### MS17-010 EternalBlue Exploit

EternalBlue (MS17-010/CVE-2017-0144) is the name given to a collection of
Windows vulnerabilities and exploits that allow attackers to remotely execute arbitrary code and gain access to a Windows system and consequently the network that the target system is a part of.
The EternalBlue exploit takes advantage of a vulnerability in the Windows SMBv1 protocol that allows attackers to send specially crafted packets that consequently facilitate the execution of arbitrary commands.

It grants generally elevated privileges.
This vulnerability affects multiple versions of Windows:

- Windows Vista
- Windows 7
- Windows Server 2008
- Windows 8.1
- Windows Server 2012
- Windows 10
- Windows Server 2016

Microsoft released a patch for the vulnerability in March, 2017, however, many users and companies have still not yet patched their systems.

#### RDP

The Remote Desktop Protocol (RDP) is a proprietary GUI remote access protocol developed by Microsoft and is used to remotely connect and interact with a Windows system. 

RDP authentication requires a legitimate user account on the target system as well as the user’s password in clear-text.

- perform RDP brute-force attack to identify legitimate user credentials

Often system administrators change the default port 3389.

#### CVE-2019-0708 - BlueKeep

BlueKeep (CVE-2019-0708) is the name given to an RDP vulnerability in Windows that could potentially allow attackers to remotely execute arbitrary code and gain access to a Windows system and consequently the network that the target system is a part of.

The BlueKeep vulnerability was made public by Microsoft in May 2019.

The BlueKeep exploit takes advantage of a vulnerability in the Windows RDP protocol that allows attackers to gain access to a chunk of kernel memory consequently allowing them to remotely execute arbitrary code at the system level without authentication.

The BlueKeep vulnerability affects multiple versions of Windows:
- XP
- Vista
- Windows 7
- Windows Server 2008 & R2

#### WinRM

Windows Remote Management (WinRM) is a Windows remote management protocol that can be used to facilitate remote access with Windows systems over HTTP(S).

WinRM is typically used in the following ways:
- Remotely access and interact with Windows hosts on a local network.
- Remotely access and execute commands on Windows systems.
- Manage and configure Windows systems remotely.

WinRM typically uses TCP port 5985 and 5986 (HTTPS).

WinRM implements access control and security for communication between systems through various forms of authentication.


### Windows Privilege Escalation

Privilege escalation is the process of exploiting vulnerabilities or misconfigurations in
systems to elevate privileges from one user to another, typically to a user with
administrative or root access on a system.

#### Windows Kernel Exploitation

A Kernel is a computer program that is the core of an operating system and has
complete control over every resource and hardware on a system. It acts as a translation
layer between hardware and software and facilitates the communication between
these two layers.

- Windows NT is the kernel that comes pre-packaged with all versions of Microsoft
Windows

 It consists of two main modes of operation that determine access to
system resources and hardware:

- User Mode: Programs and services running in user mode have limited access to
system resources and functionality.
- Kernel Mode: Kernel mode has unrestricted access to system resources and
functionality with the added functionality of managing devices and system
memory.

Privilege escalation on Windows systems will typically follow the following
methodology:
- Identifying kernel vulnerabilities
- Downloading, compiling and transferring kernel exploits onto the target
system.

#### Bypassing UAC With UACMe

User Account Control (UAC) is a Windows security feature introduced in Windows Vista that is used to prevent unauthorized changes from being made to the operating system.

- changes to the operating system require approval from the administrator or a user account that is part of the local administrators group.

A non-privileged user attempting to execute a program with elevated privileges will be prompted with the UAC credential prompt, whereas a privileged user will be prompted with a consent prompt.

- Attacks can bypass UAC in order to execute malicious executables with elevated privileges.

In order to successfully bypass UAC, we will need to have access to a user account that is a part of the local administrators group on the Windows target system.

UAC has various integrity levels ranging from low to high, if the UAC protection level is set below high, Windows programs can be executed with elevated privileges without prompting the user for confirmation

Tools:

[UACMe](https://github.com/hfiref0x/UACME) is an open source, robust privilege escalation tool developed by @hfire0x. It can be used to bypass Windows UAC by leveraging various techniques

- It allows attackers to execute malicious payloads on a Windows target with
administrative/elevated privileges by abusing the inbuilt Windows AutoElevate tool.

#### Access Token Impersonation

Windows access tokens are a core element of the authentication process on Windows and are created and managed by the **Local Security Authority Subsystem Service** (LSASS).

A Windows access token is responsible for identifying and describing the security context of a process or thread running on a system. Simply put, an access token can be thought of as a temporary key akin to a web cookie that provides users with access to a system or network resource without having to provide credentials each time a process is started or a system resource is accessed.

Access tokens are generated by the winlogon.exe process every time a user authenticates successfully and includes the identity and privileges of the user account associated with the thread or process. This token is then attached to the userinit.exe process, after which all child processes started by a user will inherit a copy of the access token from their creator and will run under the privileges of the same access token.

An access token will typically be assigned one of the following security levels:

- Impersonate-level tokens are created as a direct result of a non-interactive login on Windows, typically through specific system services or domain logons.
	- Impersonate-level tokens can be used to impersonate a token on the local system and not on any external systems that utilize the token.
- Delegate-level tokens are typically created through an interactive login on Windows, primarily through a traditional login or through remote access protocols such as RDP.
	- Delegate-level tokens pose the largest threat as they can be used to impersonate tokens on any system.

The following are the privileges that are required for a successful impersonation attack:
- SeAssignPrimaryToken: This allows a user to impersonate tokens.
- SeCreateToken: This allows a user to create an arbitrary token with administrative privileges.
- SeImpersonatePrivilege: This allows a user to create a process under the security context of another user typically with administrative privileges.

### Windows File System Vulnerabilities

#### Alternate Data Streams
Alternate Data Streams (ADS) is an NTFS (New Technology File System) file attribute and
was designed to provide compatibility with the MacOS HFS (Hierarchical File System).

Any file created on an NTFS formatted drive will have two different forks/streams:
- Data stream - Default stream that contains the data of the file.
- Resource stream - Typically contains the metadata of the file.

Attackers can use ADS to hide malicious code or executables in legitimate files in order to
evade detection by storing the malicious code or executables in the file attribute resource
stream (metadata) of a legitimate file.

This technique is usually used to evade basic signature based AVs and static scanning
tools.

### Windows Credential Dumping

#### Windows Password

The Windows OS stores hashed user account passwords locally in the **SAM (Security
Accounts Manager)** database. Authentication and verification of user credentials is facilitated by the Local Security Authority (LSA).

Windows versions up to Windows Server 2003 utilize two different types of hashes:
- LM
- NTLM
Windows disables LM hashing and utilizes NTLM hashing from Windows Vista onwards.


All user account passwords stored in the SAM database are hashed.
- The SAM database file cannot be copied while the operating system is running.
- The Windows NT kernel keeps the SAM database file locked and as a result, attackers typically utilize in-memory techniques and tools to dump SAM hashes from the LSASS process. <-> Elevated/Administrative privileges are required in order to access and interact with the LSASS process.

In modern versions of Windows, the SAM database is encrypted with a syskey.

LM (LanMan): is used to hash user passwords, and the hashing process can be broken down into the following steps:
+ The password is broken into two seven-character chunks.
+ All characters are then converted into uppercase.
+ Each chunk is then hashed separately with the DES algorithm.

LM hashing is generally considered to be a weak protocol and can easily becracked, primarily because the password hash does not include salts, consequently making brute-force and rainbow table attacks effective against LM hashes.

NTLM (NTHash): is a collection of authentication protocols that are utilized in Windows to facilitate authentication between computers. When a user account is created, it is encrypted using the MD4 hashing algorithm, while the original password is disposed of.

NTLM improves upon LM in the following ways:
- Does not split the hash in to two chunks.
- Case sensitive.
- Allows the use of symbols and unicode characters.

#### Passwords in Configuration Files

Windows can automate a variety of repetitive tasks; this is typically done through the use of the Unattended Windows Setup utility, which is used to automate the mass installation/deployment of Windows on systems.
- **This tool utilizes configuration files that contain specific configurations and user account credentials, specifically the Administrator account’s password**.

If the Unattended Windows Setup configuration files are left on the target system after installation, they can reveal user account credentials that can be used by attackers to authenticate with Windows target legitimately.

The Unattended Windows Setup utility will typically utilize one of the following configuration files that contain user account and system configuration information:
- C:\\Windows\\Panther\\Unattend.xml
- C:\\Windows\\Panther\\Autounattend.xml

#### Pass-the-Hash Attack

Pass-the-hash is an exploitation technique that involves capturing or harvesting NTLM hashes or clear-text passwords and using them to authenticate with the target legitimately.

## Linux Exploitation

### Frequently Exploited Linux Services

| Protocol/Service             | Ports            | Purpose |
| ---------------------------- | ---------------- | ------- |
| Apache Web Server            | TCP ports 80/443 | Free and open source cross-platform web server released under the Apache License 2.0. Apache accounts for over 80% of web servers globally.        |
| SSH (Secure Shell)           | TCP ports 22     | SSH is a cryptographic remote access protocol that is used to remotely access and control systems over an unsecured network. SSH was developed as a secure successor to telnet.        |
| FTP (File Transfer Protocol) | TCP port 21      | FTP (File Transfer Protocol) is a protocol that uses TCP port 21 and is used to facilitate file sharing between a server and client/clients and vice versa.        |
| SAMBA                        | TCP port 445     | Samba is the Linux implementation of SMB, and allows Windows systems to access Linux shares and devices.        |


### Bash CVE-2014-6271 Vulnerability (Shellshock)

Shellshock (CVE-2014-6271) is the name given to a family of vulnerabilities in the Bash shell (since V1.3) that allow an attacker to execute remote arbitrary commands via Bash, consequently allowing the attacker to obtain remote access to the target system via a reverse shell.

The Shellshock vulnerability is caused by a vulnerability in Bash, whereby Bash mistakenly executes trailing commands after a series of characters: () {:;};.

- In order to exploit this vulnerability, you will need to locate an input vector or script
that allows you to communicate with Bash.
- In the context of an Apache web server, we can utilize any legitimate CGI scripts accessible on the web server. Whenever a CGI script is executed, the web server will initiate a new process and run the CGI script with Bash.


### Linux Kernel Exploits
Kernel exploits on Linux will typically target vulnerabilities In the Linux kernel to execute arbitrary code in order to run privileged system commands or to obtain a system shell.

Privilege escalation on Linux systems will typically follow the following
methodology:
- Identifying kernel vulnerabilities
- Downloading, compiling and transferring kernel exploits onto the target system.

### Exploiting Misconfigured Cron Jobs

Cron jobs can be run as any user on the system; keep an eye on Cron jobs that have been configured to be run as the “root” user.

-  any script or command that is run by a Cron job will run as the root user and will consequently provide us with root access.

A stealthy way to exploit it could be to give a previously pwned user sudo privileges

### Exploiting SUID Binaries

When applied, SUID permission provides users with the ability to execute a script or binary with the permissions of the file owner as opposed to the user that is running the script or binary. 

- SUID permissions are typically used to provide unprivileged users with the ability to run specific scripts or binaries with “root” permissions. It is to be noted, however, that the provision of elevate privileges is limited to the execution of the script and does not translate to elevation of privileges, however, if improperly configured unprivileged users can exploit misconfigurations or vulnerabilities within the binary or script to obtain an elevated session.

## Linux Credential Dumping

Linux has multi-user support and as a result, multiple users can access the system simultaneously. 

The passwd file gives us information in regards to the hashing algorithm that is being used and the password hash, this is very helpful as we are able to determine the type of hashing algorithm that is being used and its strength. We can determine this by looking at the number after the username encapsulated by the dollar symbol ($).

| Value | Hashing Algorithms |
| ----- | ------------------ |
| $1    | MD5                |
| $2    | Blowfish           |
| $5    | SHA-256            |
| $6    | SHA-512            |

# Metasploit Framework

## Architecture

![[metasploit-architecture.png]]

A module in the context of MSF, is a piece of code that can be utilized by the MSF. Its execution is facilitated by MSF libraries.

 Modules:

- **Exploit**: A module that is used to take advantage of vulnerability and is typically paired with a payload.
- **Payload**: Code that is delivered by MSF and remotely executed on the target after successful exploitation. An example of a payload is a reverse shell that initiates a connection from the target system back to the attacker.
- **Encoder**: Used to encode payloads in order to avoid AV detection. For example, shikata_ga_nai is used to encode Windows payloads.
- **NOPS**: Used to ensure that payloads sizes are consistent and ensure the stability of a payload when executed.
+ **Auxiliary**: A module that is used to perform additional functionality like port scanning and enumeration.

There are two types of payloads that can be paired with an exploit:
1. **Non-Staged Payload**: Payload that is sent to the target system as is along with the exploit.
2. **Staged Payload**: A staged payload is sent to the target in two part; the first part (**stager**) contains a payload that is used to establish a reverse connection back to the attacker, download the second part of the payload (**stage**) and execute it.


The **Meterpreter** (Meta-Interpreter) payload is an advanced multi-functional
payload that is executed in memory on the target system making it difficult to
detect.
It communicates over a stager socket and provides an attacker with an interactive command interpreter on the target system that facilitates the execution of system commands, file system navigation, keylogging and much more.

## Penetration Testing with MSF

| Penetration Testing Phase | Metasploit Framework Implementation |
| ---- | ---- |
| Information Gathering & Enumeration | Auxiliary Modules |
| Vulnerability Scanning<br> | Auxiliary Modules<br>Nessus |
| Exploitation<br> | Exploit Modules & Payloads |
| Post Exploitation<br> | Meterpreter |
| Privilege Escalation | Post Exploitation Modules<br>Meterpreter |
| Maintaining Persistent Access & Clearing Tracks | Post Exploitation Modules<br>Persistence Modules |
## MSF Workspaces

Workspaces allow you to keep track of all your hosts, scans and activities and are extremely useful when conducting penetration tests as they allow you to sort and organize your data based on the target or organization.

## MSF: WMAP

WMAP is a powerful, feature-rich web application vulnerability scanner that can be used to automate web server enumeration and scan web applications for vulnerabilities.

## Meterpreter

Sometimes, Meterpreter process has to be migrated in order to:

- Hiding the process to gain persistence and avoid detection.
- Change the process architecture to execute some payloads with the corrent architecture. For example, if there is a 64-bits system and our meterpreter process is 86-bits, some architecture-related problems could happen if we try to execute some exploits against the session gained.
- Migrate to a more stable process

## MSF: Windows Post-Exploitation Modules

The Windows OS stores and catalogs all actions/events performed on the system and stores them in the Windows Event log.

Event logs are categorized based on the type of events they store:
+ Application logs: Stores application/program events like startups, crashes etc.
+ System logs: Stores system events like startups, reboots etc.
+ Security logs: Stores security events like password changes, authentication failures etc.
+ Event logs can be accessed via the Event Viewer on Windows.

We can utilise these post exploitation modules to enumerate information about the Windows system we currently have access to:
- Enumerate user privileges
- Enumerate logged on users
- VM check
- Enumerate installed programs
- Enumerate AVs
- Enumerate computers connected to domain
- Enumerate installed patches
- Enumerate shares

#  Host & Network Penetration Testing: Exploitation

## AV Evasion & Obfuscation

AV software will typically utilize signature, heuristic and behaviour based detection.

1. **Signature based detection** - An AV signature is a unique sequence of bytes that uniquely identifies malware i.e bypassable by modifying the malware's byte sequence, therefore changing the signature.
2. **Heuristic-based detection** - Relies on rules or decisions to determine whether a binary is malicious. It also looks for specific patterns within the code or program calls.
3. **Behavior based detection** - Relies on identifying malware by monitoring its behavior.


**On-disk Evasion Techniques**

- **Obfuscation** - Obfuscation refers to the process of concealing something important, valuable, or critical.
- **Encoding** - Encoding data is a *reversible* process involving changing data into a new format using a scheme. 
- **Packing** - Generate executable with new binary structure with a smaller size and therefore provides the payload with a new signature.
- **Crypters** - Encrypts code or payloads and decrypts the encrypted code in memory. The decryption key/function is usually stored in a stub.

**In-Memory Evasion Techniques**
- Focuses on manipulation of memory and does not write files to disk.
- Injects payload into a process by leveraging various Windows APIs.
- Payload is then executed in memory in a separate thread.

#### Shellter

Shellter is a dynamic shellcode injection tool that can be used in order to inject shellcode into native Windows applications - see [there](https://www.shellterproject.com/).
#### Invoke-Obfuscation

Invoke-Obfuscation is an open source PowerShell v2.0+ compatible PowerShell command and script obfuscator. - see [there](https://github.com/danielbohannon/Invoke-Obfuscation).


#  Host & Network Penetration Testing: Post-Exploitation

![[post-exploitation-methodology.png]]


1 - Local Enumeration

- Enumerating System Information
- Enumerating Users and Group
- Enumerating Network Information
- Enumerating Services
- Automatic Local Enumeration

2 - Transfering Files

- Setting up a web server
- Transfering Files to targets

3 - Upgrading Shells

- Upgrading command shells to meterpreter
- Spawning TTY Shells

4 - Privilege Escalation

- Identify PrivEsc Vulns
- Windows/Linux PrivEsc

5 - Persistence

- Setting up persistence on the target

6 - Dumping & Cracking Hashes

7 -  Pivoting

- Internal Network Recon
- Pivoting

8 - Clearing your tracks