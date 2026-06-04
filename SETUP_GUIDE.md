# 🦉 HootSuite + Hermes Agent — Full Setup Guide for New Computer

## Quick Start (Copy-Paste This)

### 1. Install Hermes Agent
```bash
# Install via pip
pip install hermes-agent --break-system-packages

# Or install from source
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
pip install -e . --break-system-packages
```

### 2. Clone HootSuite
```bash
git clone https://github.com/YOUR_USERNAME/hootsuite.git
cd hootsuite
bun install
```

### 3. Copy Your Config Files
From your OLD computer, copy these files to the NEW computer:

```bash
# Hermes config (contains ALL your settings)
scp ~/.hermes/config.yaml NEW_COMPUTER:~/.hermes/config.yaml

# Hermes secrets (API keys)
scp ~/.hermes/.env NEW_COMPUTER:~/.hermes/.env

# All your custom skills
scp -r ~/.hermes/skills/ NEW_COMPUTER:~/.hermes/skills/

# HootSuite app
scp -r ~/owl-dashboard/ NEW_COMPUTER:~/owl-dashboard/

# HootSuite notes
scp ~/.hermes/hootsuite-notes.md NEW_COMPUTER:~/.hermes/hootsuite-notes.md
```

### 4. Install All Community Skills
```bash
cd ~

# Clone all community skill repos
git clone https://github.com/obra/superpowers.git
git clone https://github.com/kepano/obsidian-skills.git
git clone https://github.com/kepano/defuddle.git
git clone https://github.com/Leonxlnx/taste-skill.git
git clone https://github.com/Lethe044/hermes-incident-commander.git
git clone https://github.com/Lethe044/hermes-life-os.git
git clone https://github.com/witt3rd/oh-my-hermes.git
git clone https://github.com/Yonkoo11/hermes-dojo.git
git clone https://github.com/Cranot/super-hermes.git
git clone https://github.com/aaron-he-zhu/seo-geo-claude-skills.git
git clone https://github.com/Felo-Inc/felo-skills.git
git clone https://github.com/ComposioHQ/awesome-claude-skills.git

# Install skills to Hermes
cp -r superpowers/skills/* ~/.hermes/skills/
cp -r obsidian-skills/skills/* ~/.hermes/skills/
cp -r taste-skill/skills/* ~/.hermes/skills/
cp -r hermes-incident-commander/skills/* ~/.hermes/skills/
cp -r hermes-life-os/skills/* ~/.hermes/skills/
cp -r hermes-dojo/* ~/.hermes/skills/hermes-dojo/
cp -r super-hermes/skills/* ~/.hermes/skills/
cp -r seo-geo-claude-skills/commands/* ~/.hermes/skills/seo-geo/
for dir in felo-skills/felo-*/; do
  skill_name=$(basename "$dir")
  [ -f "$dir/SKILL.md" ] && cp -r "$dir" ~/.hermes/skills/"$skill_name"
done
for dir in awesome-claude-skills/*/; do
  skill_name=$(basename "$dir")
  [ -f "$dir/SKILL.md" ] && cp -r "$dir" ~/.hermes/skills/"$skill_name"
done

# Install Python deps
cd hermes-incident-commander && pip install -r requirements.txt --break-system-packages
cd ~/hermes-life-os && pip install -r requirements.txt --break-system-packages
cd ~/oh-my-hermes && pip install -e . --break-system-packages

# Install Defuddle
cd ~/defuddle && npm install && npm run build
```

### 5. Install Electron (for HootSuite GUI)
```bash
# Install bun if not present
curl -fsSL https://bun.sh/install | bash

# Install Electron dependencies
cd ~/owl-dashboard
bun install
```

### 6. Launch HootSuite
```bash
cd ~/owl-dashboard
DISPLAY=:0 npx electron .
```

### 7. Restore Cron Jobs
```bash
hermes cron create "*/5 * * * *" "System health watchdog" --name "health-watchdog"
hermes cron create "0 9 * * *" "Morning AI briefing: search arXiv and HN for latest AI news" --name "morning-briefing"
hermes cron create "0 4 * * *" "HootSuite daily work session" --name "hootsuite-daily"
hermes cron create "0 6 * * *" "Hermes Dojo overnight evolution" --name "dojo-evolution"
```

### 8. Enable Plugins
```bash
hermes plugins enable disk-cleanup
hermes plugins enable google_meet
hermes plugins enable teams_pipeline
```

## What You'll Have After Setup:
- 🦉 HootSuite v3.0 desktop GUI with all panels
- 🧠 108+ skills (built-in + community)
- 🔌 5 plugins enabled
- ⏰ 6 cron jobs
- 🥋 Hermes Dojo self-improvement system
- 🎨 Fun Zone with themes, soundboard, achievements
- 📡 Live system monitor
- 🧠 AI Model Switcher (25+ models)
- 🌐 Community skills browser

## Config File Locations:
- `~/.hermes/config.yaml` — Main Hermes config
- `~/.hermes/.env` — API keys
- `~/.hermes/skills/` — All skills
- `~/owl-dashboard/` — HootSuite app
- `~/.hermes/SOUL.md` — My personality (the snarky owl!)

## Performance Settings (Already Applied):
- reasoning_effort: high
- max_turns: 500
- terminal.timeout: 900s
- gateway_timeout: 3600s
- api_max_retries: 5
- compression.threshold: 0.7
- streaming: true
