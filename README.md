# 🐉 KALI PRISON

**You wake up trapped inside a Linux machine with nothing but a terminal. Find the way out.**

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/the-priest/kaliprison/main/install.sh)
```

> Or: clone the repo and open `index.html`. That's it. No server, no install, works offline.

---

Kali Prison is a browser game that teaches Linux and cybersecurity by trapping you inside a system called **AXIOM-KALI** and making you escape it. There are no levels, no chapter select, no checklist. You wake up at a blinking cursor. A previous prisoner named **V** left a trail of notes. The only way out is to learn the machine well enough to assemble the key V hid and open the firewall.

Everything runs on a **real in-memory Linux engine** inside your browser. `cd`, `ls`, `cat`, `grep`, `find`, `chmod`, pipes (`|`), `base64 -d`, `strings`, `su` — these genuinely operate on real state. When you `cat` a file you read what's actually there. When you become root, permissions actually change. It's a single self-contained HTML file.

---

## The way out

V broke the escape key into **three pieces** and hid each one a different way:

1. **Piece one** is hidden in plain sight, encoded. V teaches you what encoding is and how to decode it using a pipe.
2. **Piece two** is buried inside a file that *lies about what it is*. V teaches you how to pull hidden text from a binary.
3. **Piece three** is locked where only **root** can read it. V teaches you about root, a leaked password, and how to become the administrator.

Join the three pieces → you have the key → open the firewall → walk out.

> **Stuck at the start?** Type `ls`, then `cat from_V.txt`. Type `help` any time.

---

## What's real vs simulated

**Real** (operate on actual state in memory): `pwd cd ls cat less head tail wc grep find mkdir touch rm rmdir cp mv chmod stat file echo env export su sudo reboot clear history` — plus real pipes `|` and text tools `base64 rev tr sort uniq cut nl tac strings md5sum sha1sum sha256sum`. You can create files, change permissions, chain commands — and it all persists in the session exactly as a real shell would.

**Simulated** (realistic educational output, not a live network): the security tooling — `nmap`, `sqlmap`, `hydra`, `msfconsole`, WiFi/AD attacks, etc. These print authentic-looking results so you learn what the tools *do* and how their output reads, without a real target. The split is deliberate: the Linux fundamentals you need to escape are genuinely executed; the heavier tooling is there for breadth and achievements.

---

## Achievements

There are **50+ hidden achievements**. You can't see them as a to-do list — they pop as a quiet toast the moment you actually *do* the thing. A trophy case (`trophies` or the `✦` counter) shows what you've found; everything else is `??? hidden`.

> One thing you can do that you shouldn't: `rm -rf /` deletes the machine you're standing in. That's a **GAME OVER**. (Also an achievement.)

---

## Play

```bash
# Option 1 — one-liner (installs or updates automatically)
bash <(curl -fsSL https://raw.githubusercontent.com/the-priest/kaliprison/main/install.sh)

# Option 2 — git clone
git clone https://github.com/the-priest/kaliprison.git
cd kaliprison
open index.html          # macOS
xdg-open index.html      # Linux
```

Progress (achievements + XP) saves automatically to your browser's localStorage.

---

## Build from source

The shipped `index.html` is generated. The game lives in `src/trapped.jsx`.

```bash
cd build
npm install
npm run build        # transpile JSX + assemble into index.html
```

`build.js` transpiles the JSX to `app.bundle.js`; `assemble.js` inlines React and the bundle into a single self-contained `index.html`.

---

## Repo layout

```
kaliprison/
├── index.html          # the game — open this (generated, self-contained)
├── src/
│   └── trapped.jsx     # everything: Linux engine + V's trail + achievements + UI
├── build/
│   ├── build.js        # transpile JSX → app.bundle.js
│   ├── assemble.js     # inline bundle → index.html
│   └── package.json
├── assets/
│   └── trapped.svg     # the dragon emblem
├── install.sh          # smart installer / updater
├── LICENSE
└── README.md
```

---

## License

MIT — see [LICENSE](LICENSE). Learn from it, fork it, teach with it.

*You woke up with nothing but a terminal. By the time you leave, you'll know how it works.*
