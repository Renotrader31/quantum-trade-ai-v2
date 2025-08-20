#!/bin/bash

echo "🚀 QUANTUM TRADE AI v2.1 - GitHub Pages Deployment Script"
echo "========================================================"

# Set working directory
cd /home/user/webapp

echo "📋 Step 1: Checking current setup..."
echo "Current branch: $(git branch --show-current)"
echo "Git status:"
git status --porcelain

echo ""
echo "📦 Step 2: Installing gh-pages if needed..."
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "Installing gh-pages..."
    npm install --save-dev gh-pages
else
    echo "✅ gh-pages already installed"
fi

echo ""
echo "🔨 Step 3: Building optimized production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi

echo ""
echo "🚀 Step 4: Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "======================================="
    echo ""
    echo "📊 Monitor your deployment:"
    echo "1. Actions tab: https://github.com/renotrader31/quantum-trade-ai-v2/actions"
    echo "2. Settings: https://github.com/renotrader31/quantum-trade-ai-v2/settings/pages"
    echo ""
    echo "🌐 Your site will be live at:"
    echo "   https://renotrader31.github.io/quantum-trade-ai-v2/"
    echo ""
    echo "⏱️  Expected deployment time: 2-10 minutes"
    echo "✅ Look for green checkmark in Actions tab when ready!"
else
    echo "❌ Deployment failed! Check errors above."
    exit 1
fi