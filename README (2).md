# ⬡ TabSense — AI Focus & Mental Balance Coach

> A Chrome extension that silently watches your browsing, analyzes your focus patterns, and coaches you like a calm, honest friend — not a punishment tool.

![Version](https://img.shields.io/badge/version-1.0.0-a8ff78?style=flat-square)
![Manifest](https://img.shields.io/badge/manifest-v3-60a5fa?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-f59e0b?style=flat-square)
![Cost](https://img.shields.io/badge/API%20cost-free-4ade80?style=flat-square)

---

## What it does

TabSense runs quietly in the background while you browse. Every 30 minutes it looks at what you've been doing, calculates a **focus score**, and decides whether to send you a nudge.

It understands that **balance is healthy** — 20 minutes of YouTube after 3 hours of deep work is totally fine. What it catches is when you've completely drifted and lost track of your day.

### Core features

- **Live focus score** — 0–100, updates every time you open the popup
- **5-category tracking** — Productive, Learning, Social, Entertainment, Neutral
- **Smart notifications** — warm, human-sounding coach messages (not robotic alerts)
- **Session timeline** — see every tab visit color-coded in real time
- **Daily breakdown** — visual bar showing how you split your time
- **End-of-day reflection** — a short honest summary at 9pm every day
- **Fully configurable** — work hours, check-in interval, entertainment tolerance
- **Export your data** — download your sessions as JSON any time
- **100% local** — nothing ever leaves your machine

---

## Screenshots

```
┌─────────────────────────────┐
│ ⬡ TabSense          • live  │
├─────────────────────────────┤
│                             │
│   [  74  ]  ✅ On track     │
│   [ ring ]  github.com      │
│                             │
│ Today's breakdown           │
│ ████████░░░░░░░░░░░░░       │
│ 💻 Productive  2h 10m       │
│ 📚 Learning    45m          │
│ 🎮 Entertainment 20m        │
│                             │
│ [2h 55m] [20m] [3h 15m]    │
│ focused  leisure  tracked   │
│                             │
│ Session timeline            │
│ • github.com    · 10:32am  │
│ • stackoverflow · 10:18am  │
│ • youtube.com   · 09:55am  │
│                             │
│ 🧠 Solid focus going —      │
│    keep the momentum.       │
│                             │
│ [Check in now]   Sun Mar 22 │
└─────────────────────────────┘
```

---

## Install

### Load unpacked (development)

1. Clone this repo
   ```bash
   git clone https://github.com/yourusername/tabsense.git
   ```

2. Open Chrome and go to `chrome://extensions`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked** → select the `tabsense/` folder

5. Pin the extension from the puzzle icon in your toolbar

That's it. TabSense starts tracking immediately.

---

## File structure

```
tabsense/
├── manifest.json       Chrome extension config (Manifest V3)
├── background.js       Service worker — tab tracking, alarms, notifications
├── categorizer.js      Domain ruleset, focus scoring, pattern detection
├── popup.html          Dashboard UI
├── popup.css           Dashboard styles
├── popup.js            Dashboard logic
├── options.html        Settings page
├── options.css         Settings styles
├── options.js          Settings logic
├── make_icons.py       Icon generator script (run once)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## How the focus score works

The score is **context-aware**, not just a raw ratio.

- Recent activity (last 30 mins) is weighted **2×** more than older activity
- Each category has a productivity weight: Productive `1.0` → Learning `0.85` → Neutral `0.5` → Social `0.3` → Entertainment `0.1`
- Score recovers quickly if you refocus — a bad morning doesn't ruin your afternoon score

### Score thresholds

| Score | State | Ring color |
|-------|-------|------------|
| 65–100 | Focused / On track | 🟢 Green |
| 40–64  | Drifting / Mixed | 🟡 Amber |
| 0–39   | Off track | 🔴 Red |

---

## Notification patterns

TabSense only notifies when something worth saying has happened:

| Pattern | Trigger | Tone |
|---------|---------|------|
| `DEEP_DISTRACTION` | 40+ mins entertainment, >80% of recent time | Gentle check-in |
| `LIGHT_DISTRACTION` | 20+ mins entertainment, >60% of recent time | Soft nudge |
| `DEEP_FOCUS` | 90+ mins productive, >85% of recent time | Positive reinforcement |

Notifications are throttled to **max once per 25 minutes** so they never feel spammy.

---

## Domain coverage

150+ domains pre-mapped across 5 categories. Unknown domains fall back to a 3-level heuristic:

1. Exact domain match (`github.com` → Productive)
2. Root domain match (`docs.github.com` → `github.com` → Productive)
3. URL keyword analysis (`/learn/`, `/tutorial/` → Learning)

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Notifications | On | Enable/disable all nudges |
| Check interval | 30 min | How often pattern is analyzed |
| Work start | 9 AM | No notifications before this |
| Work end | 10 PM | No notifications after this |
| Entertainment tolerance | 30% | Leisure % before nudging |

---

## Privacy

- **No account required**
- **No data ever leaves your browser**
- **No analytics, no tracking, no ads**
- All session data lives in `chrome.storage.local`
- You can export or wipe it any time from Settings

---

## Roadmap

- [ ] Weekly trends view (chart across 7 days)
- [ ] Custom domain categories (user-defined rules)
- [ ] Focus session timer (Pomodoro-style goal mode)
- [ ] Optional Claude AI integration for smarter reflections
- [ ] Firefox support

---

## Contributing

PRs welcome. If you add domains to the categorizer ruleset, open a PR — the more coverage the better.

```bash
git clone https://github.com/yourusername/tabsense.git
cd tabsense
# make changes
# test by loading unpacked in chrome://extensions
```

---

## License

MIT — use it, fork it, build on it.

---

*Built in a day. Designed to actually help.*
