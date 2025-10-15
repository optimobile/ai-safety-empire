# AI Safety Empire - Complete Deployment Guide

**Everything you need to deploy the entire system**

---

## 🚀 Quick Deploy (15 Minutes)

### Step 1: Deploy Backend API (5 minutes)

**Option A: Railway (Recommended - Free)**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `ai-safety-empire` repository
5. Select `standalone-api` folder as root
6. Railway auto-detects and deploys!
7. Copy your URL (e.g., `https://ai-safety-empire.up.railway.app`)

**Option B: Render (Alternative - Free)**

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Root directory: `standalone-api`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
7. Deploy and copy URL

**Result:** Your API is live at a permanent URL!

---

### Step 2: Deploy Smart Contracts (10 minutes)

**Get Test MATIC:**

1. Go to [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Mumbai" testnet
3. Paste your wallet address (from `blockchain/wallet.json`)
4. Get free test MATIC

**Deploy Contracts:**

```bash
cd /home/ubuntu/ai-safety-empire/blockchain

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contracts
npx hardhat verify --network mumbai CONTRACT_ADDRESS
```

**Result:** Contracts live on Polygon testnet!

---

### Step 3: Update Configuration (2 minutes)

Update `.env` with deployed URLs:

```bash
# Backend API URL
API_URL=https://your-railway-url.up.railway.app

# Smart contract addresses (from deployment)
CONTRACT_ADDRESS_LOGGER=0x...
CONTRACT_ADDRESS_GOVERNANCE=0x...
CONTRACT_ADDRESS_AEGIS=0x...
CONTRACT_ADDRESS_JABULON=0x...

# Blockchain RPC
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
```

---

## 📦 Publish SDKs (30 Minutes)

### Python SDK to PyPI

**Setup:**

```bash
# Install twine
pip install twine

# Create PyPI account at https://pypi.org/account/register/

# Create API token at https://pypi.org/manage/account/token/
```

**Publish:**

```bash
cd /home/ubuntu/ai-safety-empire/sdk/python

# Build package
python setup.py sdist bdist_wheel

# Upload to PyPI
twine upload dist/*
# Enter your API token when prompted
```

**Result:** `pip install aisafety-sdk` works!

---

### JavaScript SDK to npm

**Setup:**

```bash
# Create npm account at https://www.npmjs.com/signup

# Login
npm login
```

**Publish:**

```bash
cd /home/ubuntu/ai-safety-empire/sdk/javascript

# Publish
npm publish --access public
```

**Result:** `npm install @aisafety/sdk` works!

---

## 🔌 Browser Extension (20 Minutes)

### Chrome Web Store

**Setup:**

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay $5 one-time developer fee
3. Create developer account

**Submit:**

1. Click "New Item"
2. Upload `browser-extension` folder as ZIP
3. Fill in details:
   - Name: "ProofOf.ai - Deepfake Detector"
   - Description: "Verify content authenticity with blockchain"
   - Category: "Productivity"
   - Screenshots: (create 3-5 screenshots)
4. Submit for review (takes 1-3 days)

**Result:** Extension live on Chrome Web Store!

---

### Firefox Add-ons

**Setup:**

1. Go to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Create account (free)

**Submit:**

1. Click "Submit a New Add-on"
2. Upload same `browser-extension` folder
3. Fill in details (same as Chrome)
4. Submit for review

**Result:** Extension live on Firefox!

---

## 🌐 Deploy Frontend Platforms

### councilof.ai (React App)

**Option A: Vercel (Recommended)**

```bash
cd /home/ubuntu/ai-safety-empire/councilof-ai

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, it auto-deploys!
```

**Option B: Netlify**

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site"
3. Connect GitHub
4. Select `councilof-ai` folder
5. Build command: `pnpm run build`
6. Publish directory: `dist`
7. Deploy!

**Result:** councilof.ai is live!

---

### Connect Lovable proofof.ai

**In your Lovable project:**

1. Create `src/lib/api.ts`
2. Paste this code:

```typescript
const API_URL = 'https://your-railway-url.up.railway.app';

export async function verifyContent(contentUrl: string, contentType: string) {
  const response = await fetch(`${API_URL}/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_url: contentUrl, content_type: contentType })
  });
  return await response.json();
}

export async function getStats() {
  const response = await fetch(`${API_URL}/stats`);
  return await response.json();
}
```

3. Use in your components
4. Test verification
5. Done!

**Result:** proofof.ai connected to backend!

---

## 🔐 Set Up Payments (Stripe)

### Using Stripe MCP

**Create Products:**

```bash
# Use Stripe MCP to create products
manus-mcp-cli tool call create_product --server stripe --input '{
  "name": "ProofOf.ai Pro",
  "description": "100,000 verifications per month",
  "default_price_data": {
    "currency": "usd",
    "unit_amount": 9900,
    "recurring": {"interval": "month"}
  }
}'
```

**Or via Stripe Dashboard:**

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Products → Add Product
3. Create three tiers:
   - Free: $0/month (10,000 verifications)
   - Pro: $99/month (100,000 verifications)
   - Enterprise: Custom pricing

**Add to Website:**

Use Stripe Checkout or Payment Links for easy integration.

---

## 📧 Set Up Email (SendGrid)

**Setup:**

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up (free tier: 100 emails/day)
3. Create API key
4. Verify sender email

**Add to Backend:**

```python
import sendgrid
from sendgrid.helpers.mail import Mail

sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))

def send_welcome_email(user_email):
    message = Mail(
        from_email='hello@aisafety.ai',
        to_emails=user_email,
        subject='Welcome to AI Safety Empire!',
        html_content='<strong>Thanks for joining!</strong>'
    )
    sg.send(message)
```

---

## 🔍 Set Up Monitoring

### Sentry (Error Tracking)

**Setup:**

```bash
# Install Sentry
pip install sentry-sdk[fastapi]
```

**Add to Backend:**

```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0
)
```

### Uptime Monitoring

Use [UptimeRobot](https://uptimerobot.com) (free):

1. Add your API URL
2. Check every 5 minutes
3. Get alerts if down

---

## 🌍 Set Up Custom Domains

### Point Domains to Services

**For Backend API (api.aisafety.ai):**

1. In Railway/Render, add custom domain
2. Get CNAME record
3. Add to your DNS:
   ```
   CNAME api xxxxxx.railway.app
   ```

**For councilof.ai:**

1. In Vercel/Netlify, add custom domain
2. Get A/CNAME records
3. Add to your DNS

**SSL Certificates:**

Automatic via Let's Encrypt (free)

---

## 📊 Set Up Analytics

### Google Analytics

**Setup:**

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property
3. Get tracking ID

**Add to Frontend:**

```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🚀 Launch Checklist

### Pre-Launch

- [ ] Backend deployed and tested
- [ ] Smart contracts on testnet
- [ ] SDKs published to package managers
- [ ] Browser extension submitted
- [ ] Frontend platforms deployed
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Analytics installed
- [ ] Email service configured
- [ ] Payment processing ready

### Launch Day

- [ ] Deploy contracts to mainnet
- [ ] Switch all services to production
- [ ] Test full end-to-end flow
- [ ] Post on Product Hunt
- [ ] Post on Hacker News
- [ ] Tweet announcement
- [ ] Email press contacts
- [ ] Update website with live stats
- [ ] Monitor for issues
- [ ] Respond to community

### Post-Launch

- [ ] Monitor error rates
- [ ] Check API performance
- [ ] Review user feedback
- [ ] Fix critical bugs
- [ ] Scale infrastructure if needed
- [ ] Respond to support requests
- [ ] Track key metrics
- [ ] Plan next features

---

## 🔧 Troubleshooting

### Backend Won't Start

**Check:**
- Environment variables set correctly
- Database connection working
- Port not already in use
- Dependencies installed

**Fix:**
```bash
# Check logs
railway logs
# or
render logs
```

### Smart Contracts Won't Deploy

**Check:**
- Wallet has MATIC
- RPC URL is correct
- Gas price not too low
- Contract compiles without errors

**Fix:**
```bash
# Increase gas price
npx hardhat run scripts/deploy.js --network mumbai --gas-price 50000000000
```

### SDK Won't Publish

**Check:**
- Package name not taken
- Version number incremented
- API token valid
- All files included

**Fix:**
```bash
# Check package
npm pack
# or
python setup.py check
```

---

## 📞 Support

### If Something Goes Wrong

1. Check logs (Railway/Render dashboard)
2. Review error messages
3. Check GitHub Issues
4. Ask in Discord (when created)
5. Email: support@aisafety.ai

### Useful Commands

```bash
# Check API health
curl https://your-api-url.com/health

# Test verification
curl -X POST https://your-api-url.com/verify/ \
  -H "Content-Type: application/json" \
  -d '{"content_url": "https://example.com/image.jpg", "content_type": "image"}'

# Check contract on PolygonScan
https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS

# View GitHub repo
gh repo view --web
```

---

## 🎯 Success Metrics

### Week 1
- ✅ All services deployed
- ✅ 0 downtime
- ✅ < 500ms API response time
- ✅ First 100 users

### Month 1
- ✅ 99.9% uptime
- ✅ 1,000+ users
- ✅ 10,000+ verifications
- ✅ First paying customer

### Month 3
- ✅ 99.99% uptime
- ✅ 10,000+ users
- ✅ 100,000+ verifications
- ✅ £10K+ MRR

---

**Everything is ready to deploy. Let's launch! 🚀**

