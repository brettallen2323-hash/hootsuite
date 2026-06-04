#!/bin/bash
# 🦉 HootSuite v3.0 — One-Command Install Script
# Run this on a fresh Linux/macOS/WSL system
set -e

echo "🦉 Setting up HootSuite + Hermes Agent..."
echo ""

# 1. Install Hermes Agent
echo "📦 Installing Hermes Agent..."
pip install hermes-agent --break-system-packages 2>/dev/null || pip3 install hermes-agent --break-system-packages

# 2. Install Bun (for Electron)
echo "📦 Installing Bun..."
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"

# 3. Clone HootSuite
echo "📦 Cloning HootSuite..."
git clone https://github.com/nousresearch/hootsuite.git ~/owl-dashboard 2>/dev/null || echo "Using local copy..."
cd ~/owl-dashboard
bun install

# 4. Clone all community skill repos
echo "🧩 Installing community skills..."
cd ~
for repo in obra/superpowers kepano/obsidian-skills kepano/defuddle Leonxlnx/taste-skill Lethe044/hermes-incident-commander Lethe044/hermes-life-os witt3rd/oh-my-hermes Yonkoo11/hermes-dojo Cranot/super-hermes aaron-he-zhu/seo-geo-claude-skills Felo-Inc/felo-skills ComposioHQ/awesome-claude-skills; do
  name=$(basename "$repo")
  if [ ! -d "$name" ]; then
    echo "  Cloning $name..."
    git clone "https://github.com/$repo.git" 2>/dev/null || echo "  ⚠️ Could not clone $name"
  fi
done

# 5. Install skills
echo "🧩 Copying skills to Hermes..."
[ -d superpowers/skills ] && cp -r superpowers/skills/* ~/.hermes/skills/
[ -d obsidian-skills/skills ] && cp -r obsidian-skills/skills/* ~/.hermes/skills/
[ -d taste-skill/skills ] && cp -r taste-skill/skills/* ~/.hermes/skills/
[ -d hermes-incident-commander/skills ] && cp -r hermes-incident-commander/skills/* ~/.hermes/skills/
[ -d hermes-life-os/skills ] && cp -r hermes-life-os/skills/* ~/.hermes/skills/
[ -d hermes-dojo ] && cp -r hermes-dojo ~/.hermes/skills/hermes-dojo
[ -d super-hermes/skills ] && cp -r super-hermes/skills/* ~/.hermes/skills/
[ -d seo-geo-claude-skills/commands ] && mkdir -p ~/.hermes/skills/seo-geo && cp -r seo-geo-claude-skills/commands/* ~/.hermes/skills/seo-geo/

for dir in felo-skills/felo-*/; do
  skill_name=$(basename "$dir")
  [ -f "$dir/SKILL.md" ] && cp -r "$dir" ~/.hermes/skills/"$skill_name"
done

for dir in awesome-claude-skills/*/; do
  skill_name=$(basename "$dir")
  [ -f "$dir/SKILL.md" ] && cp -r "$dir" ~/.hermes/skills/"$skill_name"
done

# 6. Install Python deps
cd ~/hermes-incident-commander && pip install -r requirements.txt --break-system-packages 2>/dev/null
cd ~/hermes-life-os && pip install -r requirements.txt --break-system-packages 2>/dev/null
cd ~/oh-my-hermes && pip install -e . --break-system-packages 2>/dev/null

# 7. Install Defuddle
cd ~/defuddle && npm install 2>/dev/null && npm run build 2>/dev/null

# 8. Enable plugins
echo "🔌 Enabling plugins..."
hermes plugins enable disk-cleanup 2>/dev/null
hermes plugins enable google_meet 2>/dev/null
hermes plugins enable teams_pipeline 2>/dev/null

# 9. Set performance config
echo "⚡ Boosting performance..."
hermes config set agent.reasoning_effort high 2>/dev/null
hermes config set agent.max_turns 500 2>/dev/null
hermes config set terminal.timeout 900 2>/dev/null
hermes config set agent.gateway_timeout 3600 2>/dev/null
hermes config set compression.threshold 0.7 2>/dev/null
hermes config set display.streaming true 2>/dev/null

# 10. Copy SOUL.md
echo "🦉 Setting up owl personality..."
# SOUL.md should be copied from backup

echo ""
echo "🦉 HootSuite v3.0 install complete!"
echo ""
echo "Next steps:"
echo "  1. Copy your ~/.hermes/SOUL.md from backup"
echo "  2. Copy your ~/.hermes/.env from backup (API keys)"
echo "  3. Launch: cd ~/owl-dashboard && DISPLAY=:0 npx electron ."
echo ""
echo "Total skills: $(ls ~/.hermes/skills/ | wc -l)"
echo "🦉 Hoot hoot! We're ready to roll!"
