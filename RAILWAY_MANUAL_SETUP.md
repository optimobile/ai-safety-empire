# Railway Manual Setup Guide
## Council of 12 AIs - Environment Variables Configuration

**Project ID:** `1f186e98-9c06-4781-afc5-9d08bfaac0fb`

---

## 🚀 Quick Start (2 Options)

### Option 1: Automated Setup (Recommended)
```bash
# Login to Railway first
railway login

# Run automated deployment script
cd /home/ubuntu/ai-safety-empire
./deploy-to-railway.sh
```

### Option 2: Manual Setup via Railway Dashboard

Go to: https://railway.app/project/1f186e98-9c06-4781-afc5-9d08bfaac0fb

Click on your service → **Variables** tab → Add the following:

---

## 📋 Environment Variables to Add

### 1. Core API Configuration
```
ENVIRONMENT=production
VERSION=1.0.0
API_HOST=0.0.0.0
API_PORT=8000
```

### 2. JWT Authentication
```
JWT_SECRET_KEY=ai-safety-empire-production-jwt-secret-2025-secure-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Council of 12 AIs - LLM API Keys ⭐ CRITICAL
```
OPENAI_API_KEY=sk-proj-Oc_Ry_Yt6gXBGQGOBG3QhVHg8Gu7qBHBqxnZHpgpzYNfzNdXQT3BlbkFJEjPYW3MJqiLLST9Ry0ckBVlBuOJOJfzLLST9Ry0ckBVlBuOJOJfzL

ANTHROPIC_API_KEY=sk-ant-api03-qT4L5C_l-MGl4RbWRp2B0M9Az7xWoHOHIKBpDU8t8CcWAuTZMEDu4gs8hqNjEv2ASG9iUsvUCN72KwAQghA3Q-B0lRIAAA

GEMINI_API_KEY=[Your Gemini API Key from environment]
GOOGLE_AI_API_KEY=[Same as GEMINI_API_KEY]

DEEPSEEK_API_KEY=sk-19d003bdd07f4dcf826c78b046565b38
```

### 4. Blockchain Configuration
```
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
CHAIN_ID=80001
ENABLE_BLOCKCHAIN=true
```

### 5. Stripe Payment Integration
```
STRIPE_SECRET_KEY=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

STRIPE_PUBLISHABLE_KEY=pk_live_51RpLbYPJSnRiJXBsPBGNgkG5lIPBf6Eao2Ks6IEEcX3xTrsk2CAc7Ua3bgsynp5xQqwhjDSvmKOQfs0PaPc6ia3q0043elL4bv
```

### 6. CORS Configuration
```
CORS_ORIGINS=https://councilof.ai,https://proofof.ai,https://asisecurity.ai,https://agisafe.ai,https://suicidestop.ai,https://transparencyof.ai,https://ethicalgovernanceof.ai,https://safetyof.ai,https://accountabilityof.ai,https://biasdetectionof.ai,https://dataprivacyof.ai,https://jabulon.ai
```

### 7. Feature Flags
```
ENABLE_COUNCIL_VOTING=true
ENABLE_IPFS=false
ENABLE_EMAIL=false
```

### 8. Rate Limiting & Monitoring
```
RATE_LIMIT_PER_MINUTE=60
LOG_LEVEL=INFO
```

---

## 🗄️ Database & Redis Setup

### Add PostgreSQL Plugin
1. Go to your Railway project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically set `DATABASE_URL` environment variable

### Add Redis Plugin
1. Click **"+ New"** → **"Database"** → **"Add Redis"**
2. Railway will automatically set `REDIS_URL` environment variable

---

## 🔗 Smart Contract Deployment (After Railway is Running)

### Generate Blockchain Wallet
```bash
cd /home/ubuntu/ai-safety-empire/blockchain
node scripts/generate-wallet.js
```

Save the private key and add to Railway:
```
PRIVATE_KEY=[your_generated_private_key_without_0x]
```

### Deploy Smart Contracts to Polygon Mumbai
```bash
cd /home/ubuntu/ai-safety-empire/blockchain
npm install
npx hardhat run scripts/deploy.js --network mumbai
```

Add contract addresses to Railway:
```
CONTRACT_ADDRESS_LOGGER=[deployed_address]
CONTRACT_ADDRESS_GOVERNANCE=[deployed_address]
CONTRACT_ADDRESS_AEGIS=[deployed_address]
CONTRACT_ADDRESS_JABULONCOIN=[deployed_address]
```

---

## ✅ Verification Checklist

After adding all variables, verify:

- [ ] All 3 LLM API keys are set (OpenAI, Anthropic, Gemini)
- [ ] PostgreSQL plugin is added (DATABASE_URL exists)
- [ ] Redis plugin is added (REDIS_URL exists)
- [ ] Stripe keys are set for JabulonCoin purchases
- [ ] CORS origins include all your domains
- [ ] Service is deployed and running

---

## 🧪 Test the Council of 12 AIs

Once deployed, test the Council voting system:

```bash
curl -X POST https://your-railway-url.railway.app/api/v1/council/vote \
  -H "Content-Type: application/json" \
  -d '{
    "decision": {
      "type": "content_verification",
      "description": "Test decision for Council voting",
      "context": "Testing the 12 AI voting system",
      "requester": "System Test"
    }
  }'
```

Expected response: JSON with votes from all 12 AIs (GPT-4, Claude, Gemini)

---

## 🎯 Council of 12 AIs Architecture

The Council consists of 12 specialized AIs voting on every decision:

1. **councilof.ai** - The Orchestrator (GPT-4)
2. **proofof.ai** - Deepfake Detector (Gemini)
3. **asisecurity.ai** - Security Guardian (GPT-4)
4. **agisafe.ai** - AGI Safety Monitor (Claude)
5. **suicidestop.ai** - Mental Health Guardian (Claude)
6. **transparencyof.ai** - Transparency Enforcer (GPT-4)
7. **ethicalgovernanceof.ai** - Ethics Auditor (Claude)
8. **safetyof.ai** - Safety Validator (Gemini)
9. **accountabilityof.ai** - Accountability Tracker (GPT-4)
10. **biasdetectionof.ai** - Bias Detector (Gemini)
11. **dataprivacyof.ai** - Privacy Guardian (Claude)
12. **jabulon.ai** - The Lawgiver (Gemini) - Can veto if Three Laws violated

**Voting Requirements:**
- 10/12 approval needed (83% supermajority)
- Jabulon.ai has veto power for safety violations
- All votes logged on blockchain (AIDecisionLogger contract)

---

## 📞 Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Verify all environment variables are set
3. Ensure PostgreSQL and Redis plugins are added
4. Test API health endpoint: `https://your-url.railway.app/health`

---

## 🚀 Next Steps After Deployment

1. ✅ Deploy smart contracts to Polygon Mumbai
2. ✅ Deploy frontend websites to Vercel
3. ✅ Connect proofof.ai (Lovable) to backend API
4. ✅ Test full Council voting system
5. ✅ Execute 7-day launch roadmap
6. ✅ Publish Python and JavaScript SDKs
7. ✅ Launch browser extension on Chrome Web Store

---

**Status:** Ready for deployment! All API keys configured for full Council of 12 AIs operation.

