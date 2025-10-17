#!/bin/bash

# ========================================
# Railway Deployment Script
# Council of 12 AIs - Automated Setup
# ========================================

set -e  # Exit on error

echo "🚀 Starting Railway Deployment for Council of 12 AIs..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_ID="1f186e98-9c06-4781-afc5-9d08bfaac0fb"
SERVICE_NAME="ai-safety-empire-backend"

echo -e "${BLUE}Project ID: ${PROJECT_ID}${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI is not installed${NC}"
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

echo -e "${GREEN}✓ Railway CLI is installed${NC}"

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Railway${NC}"
    echo "Please run: railway login"
    echo "Then run this script again"
    exit 1
fi

echo -e "${GREEN}✓ Logged in to Railway${NC}"
echo ""

# Link to the project
echo -e "${BLUE}📦 Linking to Railway project...${NC}"
railway link $PROJECT_ID

echo -e "${GREEN}✓ Linked to project${NC}"
echo ""

# Set environment variables
echo -e "${BLUE}🔧 Setting environment variables for Council of 12 AIs...${NC}"
echo ""

# Core API Configuration
railway variables --set ENVIRONMENT=production
railway variables --set VERSION=1.0.0
railway variables --set API_HOST=0.0.0.0
railway variables --set API_PORT=8000

# JWT Authentication
railway variables --set JWT_SECRET_KEY="ai-safety-empire-production-jwt-secret-2025-secure-key-change-this"
railway variables --set JWT_ALGORITHM=HS256
railway variables --set ACCESS_TOKEN_EXPIRE_MINUTES=30

# Council of 12 AIs - LLM API Keys
echo -e "${YELLOW}Setting OpenAI API key...${NC}"
railway variables --set OPENAI_API_KEY="sk-proj-Oc_Ry_Yt6gXBGQGOBG3QhVHg8Gu7qBHBqxnZHpgpzYNfzNdXQT3BlbkFJEjPYW3MJqiLLST9Ry0ckBVlBuOJOJfzLLST9Ry0ckBVlBuOJOJfzL"

echo -e "${YELLOW}Setting Anthropic API key...${NC}"
railway variables --set ANTHROPIC_API_KEY="sk-ant-api03-qT4L5C_l-MGl4RbWRp2B0M9Az7xWoHOHIKBpDU8t8CcWAuTZMEDu4gs8hqNjEv2ASG9iUsvUCN72KwAQghA3Q-B0lRIAAA"

echo -e "${YELLOW}Setting Gemini API key...${NC}"
railway variables --set GEMINI_API_KEY="$GEMINI_API_KEY"
railway variables --set GOOGLE_AI_API_KEY="$GEMINI_API_KEY"

echo -e "${YELLOW}Setting DeepSeek API key...${NC}"
railway variables --set DEEPSEEK_API_KEY="sk-19d003bdd07f4dcf826c78b046565b38"

# Blockchain Configuration
railway variables --set POLYGON_RPC_URL="https://rpc-mumbai.maticvigil.com"
railway variables --set CHAIN_ID=80001
railway variables --set ENABLE_BLOCKCHAIN=true

# Stripe Payment Configuration
echo -e "${YELLOW}Setting Stripe API keys...${NC}"
railway variables --set STRIPE_SECRET_KEY="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"
railway variables --set STRIPE_PUBLISHABLE_KEY="pk_live_51RpLbYPJSnRiJXBsPBGNgkG5lIPBf6Eao2Ks6IEEcX3xTrsk2CAc7Ua3bgsynp5xQqwhjDSvmKOQfs0PaPc6ia3q0043elL4bv"

# CORS Configuration
railway variables --set CORS_ORIGINS="https://councilof.ai,https://proofof.ai,https://asisecurity.ai,https://agisafe.ai,https://suicidestop.ai,https://transparencyof.ai,https://ethicalgovernanceof.ai,https://safetyof.ai,https://accountabilityof.ai,https://biasdetectionof.ai,https://dataprivacyof.ai,https://jabulon.ai"

# Feature Flags
railway variables --set ENABLE_COUNCIL_VOTING=true
railway variables --set ENABLE_IPFS=false
railway variables --set ENABLE_EMAIL=false

# Rate Limiting & Monitoring
railway variables --set RATE_LIMIT_PER_MINUTE=60
railway variables --set LOG_LEVEL=INFO

echo ""
echo -e "${GREEN}✓ All environment variables set!${NC}"
echo ""

# Deploy the application
echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
railway up

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📊 Next steps:${NC}"
echo "1. Add PostgreSQL plugin in Railway dashboard"
echo "2. Add Redis plugin in Railway dashboard"
echo "3. Generate blockchain wallet: node blockchain/scripts/generate-wallet.js"
echo "4. Deploy smart contracts to Polygon Mumbai testnet"
echo "5. Update CONTRACT_ADDRESS_* variables in Railway"
echo "6. Test the Council of 12 AIs at your Railway URL"
echo ""
echo -e "${GREEN}🎉 Council of 12 AIs is ready to vote!${NC}"

