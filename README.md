# 🐉 KALI PRISON

**You wake up trapped inside a Linux machine with nothing but a terminal. Find the way out.**

Kali Prison is a browser game that teaches you Linux and the shell by trapping you
inside a system called **AXIOM-KALI** and making you escape it. There are no levels,
no chapter select, no checklist of tasks. You wake up at a blinking cursor, a previous
prisoner named **V** has left you a trail of notes, and the only way out is to learn
the machine well enough to assemble the key V hid and open the firewall.

Everything runs on a **real in-memory Linux engine** — an actual virtual filesystem in
your browser. `cd`, `ls`, `cat`, `grep`, `find`, `chmod`, pipes (`|`), `base64 -d`,
`strings`, `su` — these genuinely operate on real state. When you `cat` a file you read
what's actually there. When you become root, permissions actually change. Security tools
like `nmap`, `sqlmap`, and `msfconsole` produce realistic teaching output. It is a single
self-contained HTML file — no install, no server, works offline.

---

## What this is (and what it used to be)

This is a **ground-up redesign**. The earlier version was a guided 15-chapter course
with visible stages and an objectives checklist — and the escape could be triggered from
anywhere, which broke the whole point. That's gone. Now:

- **No stages. No chapters. No visible objectives.** You're dropped into the machine and
  left to explore. The only structure is the trail V left and your own curiosity.
- **Hidden achievements, Steam-style.** There are 50+ achievements. You can't see them as
  a to-do list. They only pop — a quiet toast in the corner — the moment you actually *do*
  the thing. A trophy case (type `trophies`, or tap the `✦` counter) shows what you've
  found; everything you haven't is just `??? (hidden)`.
- **The escape is gated for real.** Running `./escape.sh` without the genuine key gets you
  ACCESS DENIED. The only way out is V's key — and the only way to get the key is to do the
  work that teaches you Linux.
- **V is your teacher.** She leaves a breadcrumb trail of notes written for someone who has
  **never heard of Linux**. Each note teaches one or two real commands and points you to the
  next clue. By the time you hold all three pieces of the key, you've genuinely learned to
  navigate a filesystem, read hidden files, decode data, search inside files, and become root.

---

## The way out (no big spoilers — this is the shape, not the answers)

V broke the escape key into **three pieces** and hid each one a different way so the warden
program (AXIOM) couldn't wipe it. Her notes walk you to each:

1. **Piece one** is hidden in plain sight, *encoded*. V teaches you what encoding is and how
   to turn it back into readable text using a pipe and a decoder.
2. **Piece two** is buried inside a file that *lies about what it is*. V teaches you how to
   pull hidden text out of a binary file.
3. **Piece three** is locked where only the **administrator (root)** can read it. V teaches you
   what root is, how a reused password got leaked, and how to become root to claim it.

Join the three pieces and you have the key. Open the firewall. Walk out. There is **one true
ending**, and you have to earn it.

Along the way, the rest of the box is yours to poke at — every Linux command and security tool
you try may quietly unlock an achievement. None of it is required to escape; it's there for the
curious.

> One thing you can do that you shouldn't: `rm -rf /` deletes the machine you're standing in.
> That's a **GAME OVER**. (It's also, fittingly, an achievement.)

---

## What's real vs. simulated

**Real (operate on actual filesystem state):** `pwd cd ls cat less head tail wc grep find mkdir
touch rm rmdir cp mv chmod stat file echo env export su sudo reboot clear history` plus real
pipes `|` and the text tools `base64 rev tr sort uniq cut nl tac strings md5sum sha1sum sha256sum`.
You can create files, move them, change permissions, chain commands — and it all persists in the
session exactly as a real shell would behave.

**Simulated (realistic teaching output, not a live network):** the offensive-security tooling —
`nmap`, `sqlmap`, `hydra`, `msfconsole`, `msfvenom`, ARP/WiFi/AD attacks, etc. These print
authentic-looking results so you learn what the tools *do* and how their output reads, without a
real target to attack.

This split is deliberate: the **Linux fundamentals you need to escape are genuinely executed**, so
you actually learn them; the heavier weaponry is there for flavor, breadth, and achievements.

---

## Play

Open `index.html` in any modern browser. That's it — no install, no internet required.

```
git clone https://github.com/the-priest/kaliprison.git
```
```
cd kaliprison
```
```
xdg-open index.html
```

Or run the launcher:

```
bash install.sh
```

Stuck at the start? The game tells you: type `ls`, then `cat from_V.txt`, and follow V from
there. Type `help` any time. Progress (achievements + XP) saves automatically to your browser.

---

## Build from source

The shipped `index.html` is generated. The game lives in `src/trapped.jsx` (a single React
component plus the Linux engine). To rebuild:

```
cd build
```
```
node build.js
```
```
node assemble.js
```

`build.js` transpiles the JSX into `app.bundle.js`; `assemble.js` inlines the bundle into a
single self-contained `index.html`. After building, the new content must show up in
`index.html` — the build is only done once both steps have run.

### What's tested
Kali Prison ships with a headless test harness (jsdom) that drives the real UI and verifies:

- **The escape is gated** — `./escape.sh --tunnel` with no key, or a wrong key, returns ACCESS
  DENIED and does *not* escape; only the assembled key opens the door.
- **The full beginner trail is walkable** — starting from a blank machine and typing *only* what
  V's notes literally tell you, step by step (`ls` -> `cat from_V.txt` -> `ls -a` -> `cat .v1` ...
  decode piece one -> `strings` piece two -> read the leaked password -> `su root` -> piece three
  -> read the final note -> escape), you reach the real ending. Confirmed end to end.
- **Hidden achievements fire** as you act, the counter climbs, and the trophy case shows unlocked
  ones by name and locked ones as `???`.
- **`rm -rf /`** triggers GAME OVER.
- The build compiles with **zero runtime errors** in the harness.

---

## Repo layout

```
kaliprison/
├── index.html          # the game (open this) — generated, self-contained
├── src/
│   └── trapped.jsx      # the whole game: Linux engine + V's trail + achievements + UI
├── build/
│   ├── build.js         # transpile JSX -> app.bundle.js
│   ├── assemble.js      # inline bundle -> index.html
│   └── package.json
├── assets/
│   └── trapped.svg      # the dragon emblem
├── install.sh
├── LICENSE
└── README.md
```

---

## License

MIT — see [LICENSE](LICENSE). Learn from it, fork it, teach with it.

*You woke up with nothing but a terminal. By the time you leave, you'll know how it works.*
