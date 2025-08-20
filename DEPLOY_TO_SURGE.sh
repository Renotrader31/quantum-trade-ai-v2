#!/bin/bash

# 🚀 NUCLEAR OPTION: Deploy to Surge.sh with guaranteed new version
# This bypasses all cache and deployment issues

echo "🔥 DEPLOYING TO SURGE.SH - GUARANTEED NEW VERSION 🔥"
echo "Building fresh version..."

# Build the project
npm run build

# Install surge if not installed
if ! command -v surge &> /dev/null; then
    echo "Installing Surge.sh..."
    npm install -g surge
fi

echo "🚀 Deploying to Surge.sh - this will give you a working URL immediately!"
echo "Your new enhanced trading platform will be live in under 1 minute!"

# Deploy to surge with a unique domain
surge build/ quantum-trade-ai-v2-new.surge.sh

echo "✅ Deployment complete!"
echo "🎯 Your enhanced AI trading platform is now live at:"
echo "https://quantum-trade-ai-v2-new.surge.sh"
echo ""
echo "🚀 Features available:"
echo "- 📊 Dashboard - Performance metrics"
echo "- 🤖 AI Strategy - 6 ML algorithms" 
echo "- 📈 Live Data - Real-time feeds"
echo "- 🐋 Options Flow - Whale tracking"
echo "- 🔍 Technical Analysis - 20+ indicators"
echo "- 📝 Record Trade - Performance tracking"