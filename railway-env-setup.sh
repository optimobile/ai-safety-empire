#!/bin/bash

# ========================================
# Railway Environment Variables Setup
# One-command deployment for Council of 12 AIs
# ========================================

PROJECT_ID="1f186e98-9c06-4781-afc5-9d08bfaac0fb"

echo "🚀 Setting up Council of 12 AIs on Railway..."
echo ""

# Link project
railway link $PROJECT_ID

# Set all variables at once
railway variables set \
  ENVIRONMENT=production \
  VERSION=1.0.0 \
  API_HOST=0.0.0.0 \
  API_PORT=8000 \
  JWT_SECRET_KEY="ai-safety-empire-production-jwt-secret-2025" \
  JWT_ALGORITHM=HS256 \
  ACCESS_TOKEN_EXPIRE_MINUTES=30 \
  OPENAI_API_KEY="sk-proj-Oc_Ry_Yt6gXBGQGOBG3QhVHg8Gu7qBHBqxnZHpgpzYNfzNdXQT3BlbkFJEjPYW3MJqiLLST9Ry0ckBVlBuOJOJfzLLST9Ry0ckBVlBuOJOJfzL" \
  ANTHROPIC_API_KEY="sk-ant-api03-qT4L5C_l-MGl4RbWRp2B0M9Az7xWoHOHIKBpDU8t8CcWAuTZMEDu4gs8hqNjEv2ASG9iUsvUCN72KwAQghA3Q-B0lRIAAA" \
  GEMINI_API_KEY="$GEMINI_API_KEY" \
  GOOGLE_AI_API_KEY="$GEMINI_API_KEY" \
  DEEPSEEK_API_KEY="sk-19d003bdd07f4dcf826c78b046565b38" \
  STRIPE_SECRET_KEY="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" \
  STRIPE_PUBLISHABLE_KEY="pk_live_51RpLbYPJSnRiJXBsPBGNgkG5lIPBf6Eao2Ks6IEEcX3xTrsk2CAc7Ua3bgsynp5xQqwhjDSvmKOQfs0PaPc6ia3q0043elL4bv" \
  POLYGON_RPC_URL="https://rpc-mumbai.maticvigil.com" \
  CHAIN_ID=80001 \
  ENABLE_BLOCKCHAIN=true \
  ENABLE_COUNCIL_VOTING=true \
  ENABLE_IPFS=false \
  ENABLE_EMAIL=false \
  CORS_ORIGINS="https://councilof.ai,https://proofof.ai,https://asisecurity.ai,https://agisafe.ai,https://suicidestop.ai,https://transparencyof.ai,https://ethicalgovernanceof.ai,https://safetyof.ai,https://accountabilityof.ai,https://biasdetectionof.ai,https://dataprivacyof.ai" \
  RATE_LIMIT_PER_MINUTE=60 \
  LOG_LEVEL=INFO

echo ""
echo "✅ All environment variables set!"
echo ""
echo "📊 Next: Add PostgreSQL and Redis plugins in Railway dashboard"
echo "🔗 https://railway.app/project/$PROJECT_ID"

