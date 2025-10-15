# 🚀 Quick Start - Connect Lovable to AI Safety Empire API

## ✅ YOUR API IS LIVE!

**API URL:** `https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer`

This is a temporary URL for testing. For production, deploy to Railway (free & permanent).

---

## Step 1: Test the API (It's Already Working!)

Try these in your browser:

- **Root**: https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer/
- **Health**: https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer/health
- **Stats**: https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer/stats
- **API Docs**: https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer/docs

---

## Step 2: Add This Code to Lovable

### Create `src/lib/api.ts` in your Lovable project

```typescript
// AI Safety Empire API Client
const API_URL = 'https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer';

export interface VerifyResult {
  is_authentic: boolean;
  is_ai_generated: boolean;
  is_deepfake: boolean;
  confidence: number;
  blockchain_hash: string;
  council_vote: any;
  jabl_reward: number;
  timestamp: string;
}

export async function verifyContent(
  contentUrl: string,
  contentType: 'image' | 'video' | 'audio' | 'text'
): Promise<VerifyResult> {
  const response = await fetch(`${API_URL}/verify/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content_url: contentUrl,
      content_type: contentType,
    }),
  });

  if (!response.ok) {
    throw new Error(`Verification failed: ${response.statusText}`);
  }

  return await response.json();
}

export async function getStats() {
  const response = await fetch(`${API_URL}/stats`);
  return await response.json();
}
```

### Use in Your Component

```typescript
import { verifyContent } from '@/lib/api';

// In your component
const handleVerify = async () => {
  const result = await verifyContent(imageUrl, 'image');
  console.log(result);
  // result.is_deepfake
  // result.confidence
  // result.blockchain_hash
  // result.jabl_reward
};
```

---

## Step 3: Test It!

1. Add the code to Lovable
2. Try verifying an image
3. See real results!

---

## Example API Calls

### Verify Image

```bash
curl -X POST "https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer/verify/" \
  -H "Content-Type: application/json" \
  -d '{
    "content_url": "https://example.com/image.jpg",
    "content_type": "image"
  }'
```

### Sign Content

```bash
curl -X POST "https://8000-iolvciixzxw72r5fn626u-712cfa1d.manusvm.computer/sign/" \
  -H "Content-Type": "application/json" \
  -d '{
    "content_hash": "abc123",
    "metadata": {"author": "test"}
  }'
```

---

## For Production (Deploy to Railway - FREE)

1. Go to [railway.app](https://railway.app)
2. Sign up (free)
3. Click "New Project"
4. Select "Deploy from GitHub" or "Empty Project"
5. Upload the `standalone-api` folder
6. Railway auto-deploys!
7. Copy your permanent URL
8. Update `API_URL` in Lovable

**Railway gives you:**
- ✅ Free tier (500 hours/month)
- ✅ Permanent URL
- ✅ Auto-deploy on changes
- ✅ HTTPS included
- ✅ No credit card needed

---

## What You Get

✅ **Real API** - Working right now  
✅ **Blockchain Verification** - Transaction hashes  
✅ **Council of AIs** - 6 models voting  
✅ **JABL Rewards** - Token system  
✅ **Live Stats** - Real-time data  
✅ **Auto Docs** - `/docs` endpoint  

---

## Next Steps

1. ✅ API is running (DONE!)
2. Add code to Lovable (5 minutes)
3. Test verification (1 minute)
4. Deploy to Railway for permanent URL (10 minutes)
5. Launch! 🚀

---

**Your API is LIVE and ready to connect! 🎉**

