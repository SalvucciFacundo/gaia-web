#!/bin/bash
# deploy.sh — Auto-deploy script for GAIA landing page
# Runs: git pull → npm ci → npm run build → pm2 restart
set -e

echo "🚀 GAIA Web Deploy — $(date)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Pull latest code
echo "📥 Pulling from GitHub..."
git pull origin main

# 2. Install deps (frozen lockfile, no upgrades)
echo "📦 Installing dependencies..."
npm ci

# 3. Build
echo "🔨 Building..."
npm run build

# 4. Restart PM2
echo "♻️  Restarting PM2 process..."
pm2 restart gaia

echo "✅ Deploy complete!"
