# 🚀 Railway Environment Variables - Copy & Paste Setup

## Quick Setup via Railway Dashboard (3 Minutes)

**Project URL:** https://railway.app/project/1f186e98-9c06-4781-afc5-9d08bfaac0fb

---

## Step 1: Go to Variables Tab

1. Open: https://railway.app/project/1f186e98-9c06-4781-afc5-9d08bfaac0fb
2. Click on your service
3. Click **"Variables"** tab
4. Click **"+ New Variable"** or **"Raw Editor"**

---

## Step 2: Copy & Paste These Variables

### Method A: Raw Editor (Fastest)
Click **"Raw Editor"** and paste all at once:

```env
ENVIRONMENT=production
VERSION=1.0.0
API_HOST=0.0.0.0
API_PORT=8000
JWT_SECRET_KEY=ai-safety-empire-production-jwt-secret-2025-secure-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=sk-proj-Oc_Ry_Yt6gXBGQGOBG3QhVHg8Gu7qBHBqxnZHpgpzYNfzNdXQT3BlbkFJEjPYW3MJqiLLST9Ry0ckBVlBuOJOJfzLLST9Ry0ckBVlBuOJOJfzL
ANTHROPIC_API_KEY=sk-ant-api03-qT4L5C_l-MGl4RbWRp2B0M9Az7xWoHOHIKBpDU8t8CcWAuTZMEDu4gs8hqNjEv2ASG9iUsvUCN72KwAQghA3Q-B0lRIAAA
GEMINI_API_KEY=AIzaSyCux6l8sQAZVWwM12ocDbacwtzWLCHYYOA
GOOGLE_AI_API_KEY=AIzaSyCux6l8sQAZVWwM12ocDbacwtzWLCHYYOA
DEEPSEEK_API_KEY=sk-19d003bdd07f4dcf826c78b046565b38
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51RpLbYPJSnRiJXBsPBGNgkG5lIPBf6Eao2Ks6IEEcX3xTrsk2CAc7Ua3bgsynp5xQqwhjDSvmKOQfs0PaPc6ia3q0043elL4bv
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
CHAIN_ID=80001
ENABLE_BLOCKCHAIN=true
ENABLE_COUNCIL_VOTING=true
ENABLE_IPFS=false
ENABLE_EMAIL=false
CORS_ORIGINS=https://councilof.ai,https://proofof.ai,https://asisecurity.ai,https://agisafe.ai,https://suicidestop.ai,https://transparencyof.ai,https://ethicalgovernanceof.ai,https://safetyof.ai,https://accountabilityof.ai,https://biasdetectionof.ai,https://dataprivacyof.ai
RATE_LIMIT_PER_MINUTE=60
LOG_LEVEL=INFO
```

Click **"Save"** and Railway will redeploy automatically.

---

### Method B: Individual Variables (If Raw Editor Not Available)

Add these one by one using **"+ New Variable"**:

#### Core Configuration
```
ENVIRONMENT = production
VERSION = 1.0.0
API_HOST = 0.0.0.0
API_PORT = 8000
```

#### Authentication
```
JWT_SECRET_KEY = ai-safety-empire-production-jwt-secret-2025-secure-key
JWT_ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

#### Council of 12 AIs - API Keys (CRITICAL)
```
OPENAI_API_KEY = sk-proj-Oc_Ry_Yt6gXBGQGOBG3QhVHg8Gu7qBHBqxnZHpgpzYNfzNdXQT3BlbkFJEjPYW3MJqiLLST9Ry0ckBVlBuOJOJfzLLST9Ry0ckBVlBuOJOJfzL

ANTHROPIC_API_KEY = sk-ant-api03-qT4L5C_l-MGl4RbWRp2B0M9Az7xWoHOHIKBpDU8t8CcWAuTZMEDu4gs8hqNjEv2ASG9iUsvUCN72KwAQghA3Q-B0lRIAAA

GEMINI_API_KEY = AIzaSyCux6l8sQAZVWwM12ocDbacwtzWLCHYYOA

GOOGLE_AI_API_KEY = AIzaSyCux6l8sQAZVWwM12ocDbacwtzWLCHYYOA

DEEPSEEK_API_KEY = sk-19d003bdd07f4dcf826c78b046565b38
```

#### Payment Integration
```
STRIPE_SECRET_KEY = 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

STRIPE_PUBLISHABLE_KEY = pk_live_51RpLbYPJSnRiJXBsPBGNgkG5lIPBf6Eao2Ks6IEEcX3xTrsk2CAc7Ua3bgsynp5xQqwhjDSvmKOQfs0PaPc6ia3q0043elL4bv
```

#### Blockchain
```
POLYGON_RPC_URL = https://rpc-mumbai.maticvigil.com
CHAIN_ID = 80001
ENABLE_BLOCKCHAIN = true
```

#### Feature Flags
```
ENABLE_COUNCIL_VOTING = true
ENABLE_IPFS = false
ENABLE_EMAIL = false
```

#### CORS & Security
```
CORS_ORIGINS = https://councilof.ai,https://proofof.ai,https://asisecurity.ai,https://agisafe.ai,https://suicidestop.ai,https://transparencyof.ai,https://ethicalgovernanceof.ai,https://safetyof.ai,https://accountabilityof.ai,https://biasdetectionof.ai,https://dataprivacyof.ai

RATE_LIMIT_PER_MINUTE = 60
LOG_LEVEL = INFO
```

---

## Step 3: Add Database Plugins

### Add PostgreSQL
1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway automatically sets `DATABASE_URL`

### Add Redis
1. Click **"+ New"** again
2. Select **"Database"**
3. Choose **"Add Redis"**
4. Railway automatically sets `REDIS_URL`

---

## Step 4: Verify Deployment

After adding variables and databases, Railway will automatically redeploy.

Check deployment status:
1. Go to **"Deployments"** tab
2. Wait for green checkmark ✅
3. Click on deployment to see logs

---

## Step 5: Test Your Council of 12 AIs

Get your Railway URL from the **"Settings"** tab, then test:

```bash
# Health check
curl https://your-app.railway.app/health

# Test Council vote
curl -X POST https://your-app.railway.app/api/v1/council/vote \
  -H "Content-Type: application/json" \
  -d '{
    "decision": {
      "type": "content_verification",
      "description": "Test Council voting system",
      "context": "Testing all 12 AIs",
      "requester": "System Test"
    }
  }'
```

Expected: JSON response with votes from all 12 AIs (GPT-4, Claude, Gemini).

---

## ✅ Checklist

- [ ] All environment variables added (20+ variables)
- [ ] PostgreSQL plugin added (DATABASE_URL exists)
- [ ] Redis plugin added (REDIS_URL exists)
- [ ] Deployment successful (green checkmark)
- [ ] Health endpoint returns 200 OK
- [ ] Council voting endpoint works
- [ ] All 12 AIs respond with votes

---

## 🎯 What You Just Enabled

### The Council of 12 AIs
1. **The Orchestrator** (councilof.ai) - GPT-4
2. **Deepfake Detector** (proofof.ai) - Gemini
3. **Security Guardian** (asisecurity.ai) - GPT-4
4. **AGI Safety Monitor** (agisafe.ai) - Claude
5. **Mental Health Guardian** (suicidestop.ai) - Claude
6. **Transparency Enforcer** (transparencyof.ai) - GPT-4
7. **Ethics Auditor** (ethicalgovernanceof.ai) - Claude
8. **Safety Validator** (safetyof.ai) - Gemini
9. **Accountability Tracker** (accountabilityof.ai) - GPT-4
10. **Bias Detector** (biasdetectionof.ai) - Gemini
11. **Privacy Guardian** (dataprivacyof.ai) - Claude
12. **The Lawgiver** (jabulon.ai) - Gemini (Veto Power)

### Features Enabled
- ✅ Democratic AI governance (10/12 approval required)
- ✅ Real-time voting using GPT-4, Claude, Gemini
- ✅ JabulonCoin payment processing via Stripe
- ✅ Blockchain integration (Polygon Mumbai)
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ CORS for all 11 platforms

---

## 🚀 Next Steps

1. **Test the Council** - Run the curl commands above
2. **Deploy Smart Contracts** - To Polygon Mumbai testnet
3. **Deploy Frontends** - To Vercel (all 11 platforms)
4. **Connect proofof.ai** - Link Lovable frontend to backend
5. **Launch!** - Execute 7-day launch roadmap

---

## 📞 Troubleshooting

### If deployment fails:
1. Check **"Logs"** tab in Railway
2. Verify all API keys are correct
3. Ensure PostgreSQL and Redis are added
4. Check that PORT is not hardcoded (Railway sets it automatically)

### If Council doesn't respond:
1. Verify `OPENAI_API_KEY` is valid
2. Verify `ANTHROPIC_API_KEY` is valid
3. Verify `GEMINI_API_KEY` is valid
4. Check logs for API errors

---

**Total Setup Time:** 3-5 minutes  
**Status:** Ready to deploy!  
**Project ID:** 1f186e98-9c06-4781-afc5-9d08bfaac0fb

