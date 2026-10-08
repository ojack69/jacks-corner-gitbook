# Jack's Corner

My personal notes on stuff I like, nothing special.

Published with GitBook via Git Sync. Site structure is defined in [`gitbook-docs.yaml`](gitbook-docs.yaml): each top-level directory below is a space.

## Contents

| Space | Directory | Contents |
| --- | --- | --- |
| Active Directory | [`ad/`](ad/) | AD cheatsheet, GOAD notes |
| AI | [`ai/`](ai/) | LLM cheatsheet |
| Binary Exploitation | [`binary-exploitation/`](binary-exploitation/) | Cheatsheet, buffer overflow, format string, heap exploitation, ROP Emporium |
| Books | [`books/`](books/) | *Attacking and Exploiting Modern Web Applications* |
| Certifications | [`certifications/`](certifications/) | eJPT cheatsheet and concepts |
| Cloud | [`cloud/`](cloud/) | Cloud cheatsheet, flaws.cloud, flaws2.cloud |
| CTF | [`ctf/`](ctf/) | MAPNA CTF 2024, Vulnlab chains |
| Misc | [`misc/`](misc/) | Misc, network and PowerShell cheatsheets |
| Mobile | [`mobile/`](mobile/) | Mobile cheatsheet, MobileHackingLab writeups |
| Personal | [`personal/`](personal/) | Goals |
| Privilege Escalation | [`privilege-escalation/`](privilege-escalation/) | Windows privilege escalation notes and cheatsheet |
| Reversing | [`reversing/`](reversing/) | Reverse engineering and IDA cheatsheets |
| Web | [`web/`](web/) | Web cheatsheet |

## Repository layout

- `images/`, `drawio/`, `assets/`: images, diagrams and other files referenced by the notes.
- `sync.sh`: replaces the content directories with a fresh copy from the notes root (path in `.notes_root`), drops the paths listed in `.banned`, then runs `autocommit.sh`.
- `autocommit.sh`: pulls, commits everything and pushes.
