#!/bin/bash

# AI Safety Empire - Vercel Deployment Script
# Deploys all 11 frontend platforms to Vercel with custom domains

set -e  # Exit on error

echo "🚀 AI Safety Empire - Vercel Deployment"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel. Please login:${NC}"
    vercel login
fi

echo -e "${GREEN}✅ Vercel CLI ready${NC}"
echo ""

# Base directory
BASE_DIR="/home/ubuntu/ai-safety-empire/frontend"

# Array of platforms with their domains
declare -A PLATFORMS=(
    ["councilof-ai"]="councilof.ai"
    ["proofof-ai"]="proofof.ai"
    ["asisecurity-ai"]="asisecurity.ai"
    ["agisafe-ai"]="agisafe.ai"
    ["suicidestop-ai"]="suicidestop.ai"
    ["transparencyof-ai"]="transparencyof.ai"
    ["ethicalgovernanceof-ai"]="ethicalgovernanceof.ai"
    ["safetyof-ai"]="safetyof.ai"
    ["accountabilityof-ai"]="accountabilityof.ai"
    ["biasdetectionof-ai"]="biasdetectionof.ai"
    ["dataprivacyof-ai"]="dataprivacyof.ai"
)

# Counter for deployed platforms
DEPLOYED=0
TOTAL=${#PLATFORMS[@]}

echo -e "${BLUE}📦 Deploying ${TOTAL} platforms to Vercel...${NC}"
echo ""

# Deploy each platform
for PROJECT in "${!PLATFORMS[@]}"; do
    DOMAIN="${PLATFORMS[$PROJECT]}"
    PROJECT_DIR="$BASE_DIR/$PROJECT"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}🚀 Deploying: ${PROJECT}${NC}"
    echo -e "${BLUE}📍 Domain: ${DOMAIN}${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Check if project directory exists
    if [ ! -d "$PROJECT_DIR" ]; then
        echo -e "${YELLOW}⚠️  Directory not found: $PROJECT_DIR${NC}"
        echo -e "${YELLOW}   Skipping...${NC}"
        echo ""
        continue
    fi
    
    cd "$PROJECT_DIR"
    
    # Build the project
    echo -e "${BLUE}🔨 Building ${PROJECT}...${NC}"
    if npm run build; then
        echo -e "${GREEN}✅ Build successful${NC}"
    else
        echo -e "${YELLOW}⚠️  Build failed for ${PROJECT}${NC}"
        echo -e "${YELLOW}   Skipping deployment...${NC}"
        echo ""
        continue
    fi
    
    # Deploy to Vercel
    echo -e "${BLUE}☁️  Deploying to Vercel...${NC}"
    if vercel --prod --yes --name "$PROJECT"; then
        echo -e "${GREEN}✅ Deployed successfully${NC}"
        ((DEPLOYED++))
        
        # Add custom domain (this will prompt for confirmation)
        echo -e "${BLUE}🌐 Adding custom domain: ${DOMAIN}${NC}"
        vercel domains add "$DOMAIN" "$PROJECT" --yes || echo -e "${YELLOW}⚠️  Domain might already be added${NC}"
        
    else
        echo -e "${YELLOW}⚠️  Deployment failed for ${PROJECT}${NC}"
    fi
    
    echo ""
done

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Successfully deployed: ${DEPLOYED}/${TOTAL} platforms${NC}"
echo ""

if [ $DEPLOYED -eq $TOTAL ]; then
    echo -e "${GREEN}🎊 All platforms deployed successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  Some platforms were skipped. Check the output above.${NC}"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Configure DNS for custom domains in Namecheap"
echo "2. Wait for DNS propagation (5-10 minutes)"
echo "3. Verify SSL certificates are active"
echo "4. Test all platforms"
echo ""
echo "🌐 Your Platforms:"
for PROJECT in "${!PLATFORMS[@]}"; do
    DOMAIN="${PLATFORMS[$PROJECT]}"
    echo "   • https://${DOMAIN}"
done
echo ""
echo -e "${GREEN}✨ AI Safety Empire is live!${NC}"

