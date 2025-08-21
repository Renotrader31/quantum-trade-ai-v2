#!/bin/bash

# Quantum Trade AI v2 - Vercel Deployment Script
# Enhanced HTML Platform Deployment

echo "🚀 Deploying Quantum Trade AI v2 Enhanced to Vercel..."

# Check if we're in the right directory
if [[ ! -f "NUCLEAR_DEPLOYMENT_ENHANCED.html" ]]; then
    echo "❌ Error: NUCLEAR_DEPLOYMENT_ENHANCED.html not found!"
    echo "Please run this script from the webapp directory."
    exit 1
fi

# Make sure latest changes are committed
echo "📝 Checking git status..."
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  Warning: You have uncommitted changes!"
    echo "Please commit your changes first:"
    echo "  git add ."
    echo "  git commit -m 'Update platform'"
    echo "  git push origin main"
    exit 1
fi

# Push latest changes to GitHub
echo "📤 Pushing latest changes to GitHub..."
git push origin main

echo "✅ Ready for Vercel deployment!"
echo ""
echo "🔗 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository: Renotrader31/quantum-trade-ai-v2"
echo "3. Use these settings:"
echo "   - Framework Preset: Other"
echo "   - Build Command: (leave empty)"
echo "   - Output Directory: (leave empty)"
echo "   - Install Command: (leave empty)"
echo "4. Deploy!"
echo ""
echo "🎯 Your platform will be available at:"
echo "   https://quantum-trade-ai-v2-[random].vercel.app"
echo ""
echo "📱 Test the platform after deployment:"
echo "   - Execute trades from AI Strategy tab"
echo "   - Verify ML metrics update correctly"
echo "   - Test pending orders → filled workflow"
echo "   - Check browser console for any errors"
