#!/bin/bash

# AI Safety Empire - Single Platform Vercel Deployment Script
# Usage: ./deploy-single-platform.sh <platform-name> <domain>
# Example: ./deploy-single-platform.sh councilof-ai councilof.ai

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}❌ Error: Missing arguments${NC}"
    echo ""
    echo "Usage: $0 <platform-name> <domain>"
    echo ""
    echo "Example:"
    echo "  $0 councilof-ai councilof.ai"
    echo ""
    echo "Available platforms:"
    echo "  • councilof-ai → councilof.ai"
    echo "  • proofof-ai → proofof.ai"
    echo "  • asisecurity-ai → asisecurity.ai"
    echo "  • agisafe-ai → agisafe.ai"
    echo "  • suicidestop-ai → suicidestop.ai"
    echo "  • transparencyof-ai → transparencyof.ai"
    echo "  • ethicalgovernanceof-ai → ethicalgovernanceof.ai"
    echo "  • safetyof-ai → safetyof.ai"
    echo "  • accountabilityof-ai → accountabilityof.ai"
    echo "  • biasdetectionof-ai → biasdetectionof.ai"
    echo "  • dataprivacyof-ai → dataprivacyof.ai"
    exit 1
fi

PROJECT_NAME=$1
DOMAIN=$2
BASE_DIR="/home/ubuntu/ai-safety-empire/frontend"
PROJECT_DIR="$BASE_DIR/$PROJECT_NAME"

echo "🚀 AI Safety Empire - Platform Deployment"
echo "=========================================="
echo ""
echo -e "${BLUE}📦 Platform: ${PROJECT_NAME}${NC}"
echo -e "${BLUE}🌐 Domain: ${DOMAIN}${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Error: Directory not found: $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

# Check if logged in
echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in. Please login:${NC}"
    vercel login
fi

# Build
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build

# Deploy
echo -e "${BLUE}☁️  Deploying to Vercel...${NC}"
DEPLOYMENT_URL=$(vercel --prod --yes --name "$PROJECT_NAME" 2>&1 | grep -o 'https://[^ ]*' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployed successfully!${NC}"
echo -e "${GREEN}📍 URL: ${DEPLOYMENT_URL}${NC}"
echo ""

# Add custom domain
echo -e "${BLUE}🌐 Adding custom domain: ${DOMAIN}${NC}"
vercel domains add "$DOMAIN" "$PROJECT_NAME" --yes || echo -e "${YELLOW}⚠️  Domain might already be configured${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "1. Configure DNS in Namecheap:"
echo "   • A Record: @ → 76.76.21.21"
echo "   • CNAME Record: www → cname.vercel-dns.com"
echo ""
echo "2. Wait for DNS propagation (5-10 minutes)"
echo ""
echo "3. Verify your site:"
echo "   • Vercel URL: ${DEPLOYMENT_URL}"
echo "   • Custom Domain: https://${DOMAIN}"
echo ""
echo -e "${GREEN}✨ ${PROJECT_NAME} is live!${NC}"

