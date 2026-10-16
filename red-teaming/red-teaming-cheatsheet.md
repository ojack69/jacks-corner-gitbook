# Red Teaming Cheatsheet
## Reconnaissance

### Digital Assets Discovery - Passive Recon

- **Goal**: Identify all owned servers (IP ranges) and apex domains
- **Basic Concept**: Understand the target network and identify all digital assets within it 

**Generic passive enumeration resources**:

- Shodan - https://www.shodan.io/
- Censys - https://search.censys.io/
- Whois - https://who.is/
- Reverse Whois - https://www.reversewhois.io/
- VirusTotal - https://www.virustotal.com/
- Intelx - https://intelx.io/
- BeVigil - https://bevigil.com (for Mobile Apps)
- https://tracxn.com - Track company acquisitions\*
- https://pitchbook.com - Track company acquisitions
- https://asrank.caida.org - Track company acquisitions

\***Note**: Tracking company acquisitions may help expanding the scope, leading to identify new domains and assets which wouldn't be otherwise analyzed. It's more useful in Bug Bounty than pure RT. 

**Finding ASNs and target IPs ranges:** 
Using: https://bgp.he.net:
1. Serch for target ASNs
2. Click on every ASN
3. Check the tab Prefixes v4

**Finding IP ranges**: 
- RIPE: https://apps.db.ripe.net/db-web-ui/fulltextsearch
- ARIN: https://whois.arin.net/ui/
- `asnmap`: https://github.com/projectdiscovery/asnmap - Dumps ASN IP ranges

**Checking DNS records**:
- DNS Checker: https://dnschecker.org - Also useful for enumerating ASNs

**(Apex) Domain enumeration via public APIs**:
- https://github.com/TheArqsz/tenant-domains: it's the successor of `check_mdi` which was a tool querying a microsoft public API which allowed to enumerate a company's Microsoft 365 domains and tenants. `check_mdi` does not work anymore since Microsoft has shutdown (or limited) that API. However, a guy dumped everything before Microsoft shut down the service and now maintains a public API for querying this data. `tenant-domains` is a bash script querying this public API. **Note**: since data is basically a snapshot of the state before the shut down, it may not be updated! 

**Cloud reconnaissance**:
When dealing with clouds infrastructures, ASNs do not offer a complete picture but still may be useful.
- Always try to identify if an IP belongs to a cloud provider or to the target organization.
- Beware also of VPS/Hosting providers which customers share the same IPs ranges, similarly to Cloud.

**Clouds IP ranges and SNI public databases**: 
- https://github.com/lord-alfred/ipranges
- https://kaeferjaeger.gay/

 Continuously monitor certificate transparency (CT) logs for newly issued SSL/TLS certificates:
 -  https://github.com/g0ldencybersec/gungnir

**Automated reconnaissance tools**:
- [karma_v2](https://github.com/Dheerajmadhukar/karma_v2) - Requires Shodan Premium API key - allows to define custom check using Shodan query syntax

Passive Port Scanning using [Smap](https://github.com/s0md3v/Smap) - tool built on top of Shodan free APIs which provides an nmap-style output:

```shell
smap -sV <target IP or host>
```

Secrets and API keys enumeration using [trufflehog](https://github.com/trufflesecurity/trufflehog):

```shell
# Scan stdin
cat file.txt | trufflehog stdin

# Scan remote GitHub repository (using Docker - Unix)
docker run --rm -it -v "$PWD:/pwd" trufflesecurity/trufflehog:latest github --repo <target repo>

# Scan remote GitHub repository
trufflehog github --repo <target repo>

# Scan remote Github repository and its comments in issue and PRs
trufflehog github --repo=<target repo> --issue-comments --pr-comments

# Scan a GitHub org - ignore archived repositories
trufflehog github --org=<target org> --exclude-archived

# Scan local git repo - include only high-confidence results
trufflehog git file://<local repo> --results=verified,unknown

# Scan local files/directories
trufflehog filesystem path/to/file1.txt path/to/file2.txt path/to/dir

# Scan S3 bucket
trufflehog s3 --bucket=<bucket name> --results=verified,unknown

# Scan S3 buckets by IAM role
trufflehog s3 --role-arn=<iam role arn>

# Scan GCS bucket
trufflehog gcs --project-id=<project-ID> --cloud-environment --results=verified

# Scan docker image from a remote registry
trufflehog docker --image trufflesecurity/secrets --results=verified

# Scan docker image from local docker daemon
trufflehog docker --image docker://new_image:tag --results=verified

# Scan docker image saved as a tarball
trufflehog docker --image file://path_to_image.tar --results=verified

# See other usages on github repo README.md
```

#### Shodan Dorking

```shell
# Search by IP address or /x CIDR.
net:210.214.0.0/16

# Search by organizations
org:microsoft
org:"United States Department"

# Search by Autonomous System Number (ASN)
asn:ASxxxx

# Search by operating system.
os:"windows 7"

# Search by product (eg. webserver)
product:<product>

# Search by product version
version:<version>

# Search by CVEs
vuln:<CVE>

# Search hosts with at least one CVE
has_vuln:true

# Search by open ports.
port:21

# Search in a time window
<keyword> after:<dd/mm/YYYY> before:<dd/mm/YYYY>

# Search by raw certificate
ssl:"<target domain>"

# Search by self-signed certificates
ssl.cert.issuer.cn:<target domain> ssl.cert.subject.cn:<target domain>

# Search by expired certificates
ssl.cert.expired:true

# Search by certificate common name (CN)
ssl.cert.subject.cn:<CN>

# Search by HTTP Title
http.title:<value>
```

**Note**: filters support wildcards!
#### GitHub Dorking

TODO GitHub dorks

### Web Application Passive Enumeration

Exploring older web application snapshot may reveal hidden URLs or older APIs which may have been removed from the current version but still be reachable. It may also help to collect historical data such as exposed API keys, old JS containing paths, old subdomains, etc..

The most relevant resource is [Wayback Machine](https://web.archive.org/).

[gau](https://github.com/lc/gau) is a tool that fetches known URLs from AlienVault's Open Threat Exchange, the Wayback Machine, Common Crawl, and URLScan for any given domain:

```shell
echo '<target domain>' | gau
gau '<target domain>'
```
### Active Recon

Enumerate ports and services on active ports using `naabu`:

```shell
# Simple port scanning on targets list
cat targets.txt | naabu -silent

# Port scanning and service enumeration using nmap in combination with naabu
cat targets.txt | naabu -silent -nmap-cli 'nmap -sV'

# Full ASN ip ranges port scan using asnamp + naabu + nmap
echo "<ASN>" | asnmap -silent | naabu -silent -nmap-cli 'nmap -sV'
```

Other tools: `masscan` or `rustscan`

- Those tools are faster but sometimes they may miss some replies due to the massive scanning speed.

#### SSL Certificates Enumeration

In order to discover new domains, it's worth analyzing SSL certificates. Often, automated tools relying on public sources, do not take into account self-signed certificates since those are not actually registered anywhere. 
However, self-signed certificates may refer to internal domains, e.g UAT or staging environments.

Most interesting certificates fields to look for are:
- Common Name (CN)
- Organization Name
- Subject Alt Name

It's possible to automate previous checks using [Caduceus](https://github.com/g0ldencybersec/Caduceus). This tools scans a list of IPs (or CIDR ranges) and ports; whenever a SSL certificate is found, it looks for previous certificate fields. 

#### Domain Bruteforce

Automated tools do not guarantee that all actually existing domains for an organization are found by mean of public sources. For this reason, sometimes it may helpful to bruteforce subdomains.

ProjectDiscovery's [alterx](https://github.com/projectdiscovery/alterx) allows to generate subdomains wordlists for a provided base domain by generating permutations or variations and by mean of pattern mining. It also allows to define custom patterns for subdomain generation, e.g tailored on the target domain naming convention.


```shell
# Basic usage - using dnsx to resolve found generated subdomains
echo '<target domain>' | alterx -silent | dnsx
chaos -d <target domain> | alterx -silent | dnsx

# Use -enrich|-en to generate target aware permutations, using words from input domains to enrich the wordlist
chaos -d tesla.com | alterx -enrich
chaos -d tesla.com | alterx -en

# Provide a new pattern at runtime
chaos -d tesla.com | alterx -enrich -p '{{word}}-{{suffix}}'
```

#### Virtual Host Fuzzing

Classic virtual host enumeration combining `ffuf` and `alterx`:

```shell
echo '<target domain>' | alterx -en -o wordlist.txt
ffuf -t 5 -w wordlist -H 'Host: FUZZ' https://<target webserver> <matching/filtering condition> 
```

**Virtual Host Spraying**: Another approach is to "spray" every known subdomain to every known IP hosting a web server. 
This means to run a `ffuf` for every know IP with a wordlist containing the known subdomains; each target IP would need a different *matching/filtering condition* - for this, the option `-ac` (auto-calibrate - tries to automatically identify the filtering condition) might be useful, combined with `-ach` which instructs `ffuf` to auto-calibrate every target separately:

```shell
ffuf -t -w targets.txt:TARGET -w subdomains.txt -u https://TARGET -H 'Host: FUZZ' -ac -ach
```

**Note**: if one or more host do respond with dynamic error pages, auto-calibration may not work properly! 


#### Web Application Active Enumeration

[katana](https://github.com/projectdiscovery/katana) crawls and spiders a web application in order to extract hidden URLs and APIs:

```shell
# Basic Usage
echo https://<target webapp> | katana
katana -u https://<target webapp>

# Enable basic JS crawling
echo https://<target webapp> | katana [-jc|-js-crawl]

# Enable advanced JS crawling
echo https://<target webapp> | katana [-jsl|-jsluice]

# Run authenticated crawling by specifing authentication cookie/header
echo https://<target webapp> | katana -H 'Cookie: <auth cookie>'
echo https://<target webapp> | katana -H 'Authorization: Bearer <auth token>'

# Define the max crawling depth
echo https://<target webapp> | katana -H 

# Automatically fill forms
echo https://<target webapp> | katana [-aff|-automatic-form-fill]
```


### People OSINT

https://github.com/sherlock-project/sherlock