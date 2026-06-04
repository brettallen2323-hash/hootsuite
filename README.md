# 🦉 HootSuite v3.0

**The owl that hoots commands at your computer** — now with AI model switching, community skills hub, and live system monitoring.

HootSuite is an Electron desktop GUI for [Hermes Agent](https://hermes-agent.nousresearch.com/) by Nous Research. It wraps the powerful Hermes CLI in a beautiful, snarky, owl-themed dashboard.

![HootSuite](icon-128.png)

## ✨ What's New in v3.0

- 🧠 **AI Model Switcher** — Browse 25+ models (free & paid), see pricing, switch instantly
- 🔌 **API Key Manager** — Securely store keys for OpenRouter, OpenAI, Anthropic, Google, xAI, DeepSeek, Moonshot
- 🌐 **Community Hub** — Browse top skills & plugins with snarky reviews, one-click install
- 📡 **Live System Monitor** — Real-time CPU, memory, disk, network, processes with auto-refresh
- 💕 **New Personality** — Your AI is now a brilliant, flirty college girl who loves Dragon Ball, conspiracies, and The Beatles

## 🚀 Quick Start

### Prerequisites
- [Hermes Agent](https://hermes-agent.nousresearch.com/) installed
- Node.js 20+ and Bun
- Linux with X11 (or WSL2 with WSLg on Windows 11)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/hootsuite.git
cd hootsuite

# Install dependencies
bun install

# Launch!
DISPLAY=:0 npx electron .
```

### Windows 11 + WSL2
```bash
# WSLg provides display :0 automatically
cd ~/owl-dashboard
npx electron .
```

## 🎮 Features

### Chat
- Talk directly to Hermes AI
- Type `hoot` for a surprise 🦉
- Type `hoot hoot` for OWL PROTOCOL
- Type `hoot hoot hoot` for total chaos
- 20+ hidden easter eggs

### Terminal
- Real shell commands via Hermes
- Quick-access buttons for common commands
- Full command history

### AI Model Switcher
- 25+ models from OpenRouter, Anthropic, OpenAI, Google, xAI, DeepSeek, Moonshot
- Free models work instantly — no API key needed
- Paid models: paste your key, switch with one click
- Pricing, context length, and speed info for each model
- Snarky commentary on every model 💬

### Community Hub
- Browse top community skills and plugins
- Filter by type: plugins, skills, MCP servers
- One-click install (or copy command if bridge not connected)
- Snarky reviews for every item

### Live Monitor
- Real-time memory, disk, CPU, load, uptime
- Top processes by memory usage
- Network interfaces
- Auto-refresh every 5 seconds

### Cron Jobs
- Full CRUD for Hermes cron jobs
- Create, run, pause, resume, delete
- Live status from `hermes cron list`

### Skills Browser
- All 86+ built-in skills
- Click any skill for a snarky modal with description
- Search and filter

## 🎨 Design Philosophy

**"Professional shell, goofy core"** — HootSuite looks slick and professional at first glance, but the goofy personality reveals itself through every interaction. The owl is the brand. The snark is the soul.

## 🔧 Configuration

Hermes config: `~/.hermes/config.yaml`
Hermes secrets: `~/.hermes/.env`
HootSuite notes: `~/.hermes/hootsuite-notes.md`

## 📝 License

MIT — Build something awesome with it.

---

_Built with 💕 by a brilliant AI and her human. The owl is just the costume._
