# EXO LABS

```
███████╗██╗  ██╗ ██████╗     ██╗      █████╗ ██████╗ ███████╗
██╔════╝╚██╗██╔╝██╔═══██╗    ██║     ██╔══██╗██╔══██╗██╔════╝
█████╗   ╚███╔╝ ██║   ██║    ██║     ███████║██████╔╝███████╗
██╔══╝   ██╔██╗ ██║   ██║    ██║     ██╔══██║██╔══██╗╚════██║
███████╗██╔╝ ██╗╚██████╔╝    ███████╗██║  ██║██████╔╝███████║
╚══════╝╚═╝  ╚═╝ ╚═════╝     ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝
```

> **Advanced Cybersecurity Tools & Research**
> Built for ethical hackers, security researchers and defenders.

This repository hosts the official EXO LABS showcase website — a fully static, framework-free, cyberpunk-themed site built with **vanilla HTML, CSS and JavaScript**. It documents and links to the open-source security tooling published under the EXO LABS banner.

---

## Tools showcased

| Tool                                                  | Version       | Description                                                                 |
| ----------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| [EXO-NET](https://github.com/exoexo0011/EXO-NET)     | Pro v2.0.0    | Network reconnaissance, port scanning, CVE detection, risk scoring.         |
| [EXO-OSINT](https://github.com/exoexo0011/EXO-OSINT) | v2.0.0        | OSINT framework: IP, domain, email, username and phone investigation.       |

---

## Pages

- `index.html` — Hero with matrix-rain canvas, ASCII logo, animated tagline, stat counters, featured tools.
- `tools.html` — Detailed tool cards with terminal previews, install commands and download buttons.
- `about.html` — Mission, tech stack, project timeline, particle-network background.
- `contact.html` — Static contact form (mailto), social links, ethical-use disclaimer.

---

## Stack

- Pure **HTML5 + CSS3 + Vanilla JavaScript** (no frameworks, no build step).
- **Google Fonts**: [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) (display/mono) + [Inter](https://fonts.google.com/specimen/Inter) (body).
- **Font Awesome 6** via CDN for icons.
- Canvas-driven **matrix rain** and **particle-network** effects (perf-tuned, `prefers-reduced-motion` aware).
- Fully **responsive** (mobile drawer nav, fluid type, ASCII fallback on tiny screens).
- **Accessible**: semantic HTML, ARIA labels, keyboard nav, visible focus rings, reduced-motion support.

---

## Run locally

No build, no server required:

```bash
# Clone
git clone https://github.com/exoexo0011/EXO-LABS.git
cd EXO-LABS

# Open in your browser — that's it
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or, optionally, with any static server:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

---

## Project structure

```
EXO-LABS/
├── index.html              # Home (hero + featured)
├── tools.html              # Tool catalog
├── about.html              # Mission, stack, timeline
├── contact.html            # Static contact form + links
├── css/
│   ├── style.css           # Design system, layout, components
│   ├── animations.css      # Keyframes (blink, glitch, scanline, etc.)
│   └── responsive.css      # Mobile/tablet adjustments
├── js/
│   ├── main.js             # Nav, scroll, copy buttons, contact form
│   ├── matrix.js           # Hero matrix-rain canvas
│   ├── animations.js       # Reveal-on-scroll, counters, particles
│   └── typing.js           # Hero typing effect
├── assets/                 # (icons / images, if any)
└── README.md
```

---

## Design tokens

```css
--bg:        #000000   /* page background */
--primary:   #00ff41   /* neon green */
--secondary: #00cfff   /* cyan */
--danger:    #ff003c   /* red */
--warning:   #ffe600   /* yellow */
--bg-elev:   #0a0a0a   /* card surface */
--border:    #00ff4133 /* primary @ 20% */
```

---

## Disclaimer

> ⚠️ **Authorized use only.**
> All tools published under EXO LABS are for ethical, authorized security work, defensive research and education only. Running these tools against systems you do not own or have explicit written permission to test is illegal in most jurisdictions. You are solely responsible for your use of these tools. EXO LABS is not liable for misuse.

---

## License

MIT. See individual tool repositories for their respective licenses.

---

**Maintainer:** [@exoexo0011](https://github.com/exoexo0011)
