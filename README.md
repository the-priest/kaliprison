# Kali Prison

```
   _  __     _ _   ___     _
  | |/ /__ _| (_) | _ \_ _(_)___ ___ _ _
  | ' </ _` | | | |  _/ '_| (_-</ _ \ ' \
  |_|\_\__,_|_|_| |_| |_| |_/__/\___/_||_|
```

**You wake inside a machine. No body, no memory — just a terminal and a firewall.
Learn this box completely and you walk out. Stop learning and you stay.**

A single-player, browser-based terminal game that teaches real Linux and security
the only way that sticks: by making you *type the commands*. **15 chapters ·
71 stages · 205 objectives**, from `whoami` to tunnelling out through a locked-down
firewall.

It runs offline as a self-contained `index.html` — React is baked in, nothing
phones home, no build step, no server.

**What's real vs. simulated.** The Linux layer is a real in-memory filesystem:
`cd`, `ls`, `cat`, `grep`, `find`, `mkdir`, `touch`, `rm`, `cp`, `mv`, `chmod`,
`echo >`/`>>`, real pipes (`|`), `base64`, `rev`, `tr`, `sort`, `uniq`, `cut`,
`strings`, `su`, `sudo`, `reboot` actually operate on state — you can explore
the whole box, decode ciphers, chain forensics one-liners, follow clues, find the
root password, become root, and read what root can read. The **security tools**
(`nmap`, `sqlmap`, `hydra`, `hashcat`, `msfconsole`, `mimikatz`, …) are
**simulated** — they return hand-written teaching output and never touch a real
host or network (a browser sandbox can't, and shouldn't). Try `rm -rf /` if
you're feeling brave.

**The puzzles teach.** Every one of the 71 stages is built around a real
*mission goal*, not a command to copy. Hints are layered — a vague nudge first,
more only if you ask for it — so you choose how much you struggle. Clear a stage
and you get an explicit **WHAT YOU LEARNED** debrief explaining the technique and
why it matters in the real world. Threaded through all fifteen chapters is the
mystery of **V**, the pentester trapped here before you, whose notes, workspace,
and three hidden cipher fragments (one base64-encoded, one buried in a file that
lies about being an image, one readable only as root) assemble into the key to
the escape — and a second, true ending for anyone who actually explores.

---

## Install

One line. It detects your OS, grabs the game, and drops a clickable launcher in
your app menu.

```bash
curl -fsSL https://raw.githubusercontent.com/the-priest/kaliprison/main/install.sh | bash
```

No `curl`? Use `wget`:

```bash
wget -qO- https://raw.githubusercontent.com/the-priest/kaliprison/main/install.sh | bash
```

Then search **“Kali Prison”** in your applications, or run `kaliprison` in a
terminal, or just open `~/.local/share/kaliprison/index.html` in any browser.

### What the installer actually does

It’s built to survive a messy machine and route around failure:

- **Detects your system** — Debian/Ubuntu/Mint, Arch, Fedora/RHEL, openSUSE,
  Alpine, Void, Solus, macOS (Homebrew), and **Termux** on Android.
- **Installs nothing it doesn’t have to.** The game has no runtime dependencies,
  so the only thing it really needs is a downloader you already used.
- **Fetches with fallbacks:** `git clone` → `git pull` for updates → tarball via
  `curl`/`wget` → `python3`/`perl` → individual raw files. If one path dies, it
  tries the next.
- **Finds a browser** for a real app window (Chromium/Chrome/Brave/Edge `--app=`,
  Firefox, GNOME Web/epiphany on Phosh, `xdg-open`, macOS `open`, Termux
  `termux-open`). If none exists it still installs the files and tells you where
  they are.
- **Idempotent.** Re-run it any time to **update** — it pulls the latest in place.

### Update

```bash
curl -fsSL https://raw.githubusercontent.com/the-priest/kaliprison/main/install.sh | bash
```

Same line. It detects the existing install and updates it.

### Uninstall

```bash
~/.local/share/kaliprison/install.sh --uninstall
```

### Options

```
--uninstall      Remove the app, launcher and icon
--no-desktop     Install files only; skip the launcher/icon
--dir <path>     Install location (default: ~/.local/share/kaliprison)
--branch <name>  Track a different branch (default: main)
```

`KP_DIR` and `KP_BRANCH` work as environment variables too.

---

## Play without installing

Clone (or download the ZIP) and double-click `index.html`:

```bash
git clone https://github.com/the-priest/kaliprison.git
xdg-open kaliprison/index.html      # or just double-click it
```

That’s the whole game. It works with no internet connection.

---

## Saving

Progress saves automatically. Close the game and reopen it — the **main menu**
offers **Continue** (resumes your chapter, stage and XP) or **New Game**. There's
a **☰ MENU** button in the top bar during play, and your save persists in the
browser's local storage for that app. *(In the live preview inside a chat sandbox,
storage may be blocked, so saving only works in the real installed/standalone
app — which is how you'll actually play it.)*

---

## Controls

| Key / action            | Does                                  |
| ----------------------- | ------------------------------------- |
| Type + `Enter`          | Run a command                         |
| `↑` / `↓`               | Cycle command history                 |
| Sidebar **HINT** button | Reveal a hint when a stage stalls you |
| Click the terminal pane | Refocus the input                     |
| `help`                  | In-game command reference             |

---

## What you learn

| Ch | Title              | Focus                                                         |
| -- | ------------------ | ------------------------------------------------------------- |
| 1  | The Awakening      | Linux basics, navigation, hidden files, file ops             |
| 2  | The Labyrinth      | `/etc`, permissions, bash scripting, loops, text processing   |
| 3  | The Nervous System | processes, users, services, environment, Python              |
| 4  | The Network        | TCP/IP, DNS (incl. zone transfers), HTTP, packet capture      |
| 5  | The Watchtower     | passive recon, OSINT, theHarvester, exiftool, active recon    |
| 6  | The Scanner        | nmap, NSE, service enum, gobuster, nikto                      |
| 7  | The Web            | SQLi, XSS, LFI, command injection, SSRF, JWT                  |
| 8  | The Armory         | Metasploit, Meterpreter, msfvenom, reverse shells             |
| 9  | The Underground    | privesc, persistence, credential harvesting, lateral movement |
| 10 | The Battlefield    | ARP spoof, MITM, WiFi, DNS poisoning, Bluetooth               |
| 11 | The Vault          | hashing, hashcat rules/masks, encryption, steganography       |
| 12 | The Archive        | log analysis, disk forensics, IR lifecycle, memory forensics  |
| 13 | The Shield         | hardening, iptables, auditd, osquery, threat hunting          |
| 14 | The Domain         | AD enumeration, Kerberoasting, DCSync, Golden Ticket          |
| 15 | The Escape         | firewall analysis → DNS tunnel → out                          |

The narrative ties it together: AXIOM SYSTEMS, the 847-day uptime, the
`axiom-daemon` watching every keystroke, credentials buried in bash history, a
TLS cert leaking internal subdomains, recovered chat logs, and a firewall that
only lets 53/UDP and 443/TCP out. Everything connects.

---

## Build from source

The committed `index.html` is prebuilt, so you don’t need this to play. To rebuild
after editing `src/trapped.jsx`:

```bash
cd build
npm install
node build.js      # JSX -> plain JS bundle
node assemble.js   # inline React + bundle -> ../index.html
```

The build step also escapes any literal `</script>` inside the source, which
would otherwise close the inline `<script>` tag and break the page in every
browser.

---

## Disclaimer

Everything here is **simulated and educational**. No command in the game executes
anything, scans anything, or contacts any host. It teaches concepts and tool
*usage* — the same ground covered by TryHackMe, Hack The Box, and standard
pentest coursework — so you can go practice for real on systems you’re authorised
to touch.

## License

MIT © the-priest — see [LICENSE](LICENSE).
