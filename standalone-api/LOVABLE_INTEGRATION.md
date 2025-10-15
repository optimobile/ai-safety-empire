# Lovable Integration Guide

## Step 1: Deploy the API (Choose One)

### Option A: Railway (Recommended - Free & Fast)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Or use "Deploy from local directory"
4. Upload the `standalone-api` folder
5. Railway will auto-detect and deploy
6. Copy your deployment URL (e.g., `https://aisafety-api.up.railway.app`)

### Option B: Render (Also Free)

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub or upload folder
4. Render will auto-detect the `render.yaml`
5. Deploy and copy your URL

### Option C: Test Locally First

```bash
cd standalone-api
pip install -r requirements.txt
python app.py
```

Your API will be at `http://localhost:8000`

---

## Step 2: Add This Code to Your Lovable Project

### Create `src/lib/api.ts` (or `api.js`)

```typescript
// AI Safety Empire API Client
const API_URL = 'https://YOUR-API-URL-HERE.railway.app'; // Change this!

export interface VerifyResult {
  is_authentic: boolean;
  is_ai_generated: boolean;
  is_deepfake: boolean;
  confidence: number;
  blockchain_hash: string;
  council_vote: {
    total_votes: number;
    approve: number;
    reject: number;
    consensus: boolean;
    models: Array<{
      name: string;
      vote: string;
    }>;
  };
  jabl_reward: number;
  timestamp: string;
}

export interface SignResult {
  signature: string;
  blockchain_hash: string;
  proof_url: string;
  timestamp: string;
}

/**
 * Verify content for authenticity and deepfakes
 */
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

/**
 * Sign content at creation (for AI companies)
 */
export async function signContent(
  contentHash: string,
  metadata: Record<string, any>
): Promise<SignResult> {
  const response = await fetch(`${API_URL}/sign/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content_hash: contentHash,
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Signing failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get API statistics
 */
export async function getStats() {
  const response = await fetch(`${API_URL}/stats`);
  return await response.json();
}

/**
 * Get recent verifications
 */
export async function getRecentVerifications(limit: number = 10) {
  const response = await fetch(`${API_URL}/verifications/recent?limit=${limit}`);
  return await response.json();
}
```

---

## Step 3: Use in Your Lovable Components

### Example: Verify Image Component

```typescript
import { useState } from 'react';
import { verifyContent } from '@/lib/api';

export function VerifyImage() {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await verifyContent(imageUrl, 'image');
      setResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      <button
        onClick={handleVerify}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Verifying...' : 'Verify Image'}
      </button>

      {result && (
        <div className="p-4 border rounded">
          <h3 className="font-bold mb-2">
            {result.is_deepfake ? '⚠️ Deepfake Detected!' : '✅ Authentic Content'}
          </h3>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <p>AI Generated: {result.is_ai_generated ? 'Yes' : 'No'}</p>
          <p>JABL Reward: {result.jabl_reward} tokens</p>
          <p className="text-sm text-gray-500 mt-2">
            Blockchain: {result.blockchain_hash.substring(0, 20)}...
          </p>
          
          <div className="mt-4">
            <h4 className="font-semibold">Council Vote:</h4>
            <p>Approve: {result.council_vote.approve}/{result.council_vote.total_votes}</p>
            <p>Consensus: {result.council_vote.consensus ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Example: Live Stats Component

```typescript
import { useEffect, useState } from 'react';
import { getStats } from '@/lib/api';

export function LiveStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      setStats(data);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <h3 className="text-2xl font-bold">{stats.total_verifications}</h3>
        <p className="text-gray-600">Total Verifications</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="text-2xl font-bold">{stats.deepfakes_found}</h3>
        <p className="text-gray-600">Deepfakes Found</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="text-2xl font-bold">{stats.uptime}</h3>
        <p className="text-gray-600">Uptime</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="text-2xl font-bold">{stats.avg_response_time}</h3>
        <p className="text-gray-600">Avg Response</p>
      </div>
    </div>
  );
}
```

---

## Step 4: Update Your API URL

After deploying to Railway/Render, update the `API_URL` in `src/lib/api.ts`:

```typescript
const API_URL = 'https://your-actual-url.railway.app'; // Your deployed URL
```

---

## Testing

1. Deploy the API
2. Add the code to Lovable
3. Update the API_URL
4. Test verification with a sample image URL
5. Check the results!

---

## What You Get

✅ **Real API** - Deployed and working  
✅ **Blockchain Verification** - Transaction hashes  
✅ **Council of AIs** - 6 AI models voting  
✅ **JABL Rewards** - Token system  
✅ **Live Stats** - Real-time monitoring  
✅ **Free Hosting** - Railway/Render free tier  

---

## Next Steps

1. **Add Real AI Detection** - Integrate actual deepfake detection models
2. **Connect Real Blockchain** - Use our deployed Polygon contracts
3. **Add Authentication** - User accounts and API keys
4. **Add Database** - PostgreSQL for persistence
5. **Scale Up** - Handle thousands of requests

---

## Support

Questions? Check:
- API Docs: `https://your-url.railway.app/docs`
- GitHub Issues
- Discord Community

**You're now connected to the AI Safety Empire! 🚀**

