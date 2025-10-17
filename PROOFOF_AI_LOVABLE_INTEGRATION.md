# 🔗 ProofOf.ai Integration Guide
## Connecting Lovable Frontend to Railway Backend API

---

## 📋 Overview

**proofof.ai** is already built on Lovable platform. Now we need to connect it to the Railway backend API to enable:

- Council of 12 AIs voting
- Blockchain verification
- JABL reward distribution
- Real deepfake detection

---

## 🎯 Integration Points

### 1. API Endpoint Configuration

Update Lovable environment variables:

```env
VITE_API_URL=https://your-railway-url.railway.app
VITE_API_VERSION=v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51RpLbYPJSnRiJXBs...
```

### 2. Authentication

Implement JWT authentication:

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}
```

### 3. Deepfake Detection API

```typescript
// src/lib/deepfake.ts
export async function verifyContent(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/api/v1/verify/content`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });
  
  return await response.json();
}
```

Expected response:
```json
{
  "decision_id": "uuid",
  "result": "AUTHENTIC" | "DEEPFAKE" | "UNCERTAIN",
  "confidence": 0.95,
  "council_votes": [
    {
      "ai_name": "Deepfake Detector",
      "vote": "AUTHENTIC",
      "confidence": 95,
      "reasoning": "..."
    }
    // ... 11 more votes
  ],
  "blockchain_proof": {
    "transaction_hash": "0x...",
    "block_number": 12345,
    "timestamp": "2025-01-17T12:00:00Z"
  },
  "jabl_reward": 100
}
```

### 4. JABL Balance Display

```typescript
// src/components/JABLBalance.tsx
import { useEffect, useState } from 'react';

export function JABLBalance() {
  const [balance, setBalance] = useState(0);
  
  useEffect(() => {
    async function fetchBalance() {
      const response = await fetch(`${API_URL}/api/v1/users/me/balance`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setBalance(data.jabl_balance);
    }
    
    fetchBalance();
  }, []);
  
  return (
    <div className="jabl-balance">
      <span className="icon">🪙</span>
      <span className="amount">{balance.toLocaleString()} JABL</span>
    </div>
  );
}
```

### 5. Council Voting Display

```typescript
// src/components/CouncilVotes.tsx
export function CouncilVotes({ votes }: { votes: CouncilVote[] }) {
  return (
    <div className="council-votes">
      <h3>Council of 12 AIs Votes</h3>
      <div className="votes-grid">
        {votes.map((vote) => (
          <div key={vote.ai_name} className="vote-card">
            <div className="ai-name">{vote.ai_name}</div>
            <div className="platform">{vote.platform}</div>
            <div className={`vote ${vote.vote.toLowerCase()}`}>
              {vote.vote}
            </div>
            <div className="confidence">{vote.confidence}% confident</div>
            <div className="reasoning">{vote.reasoning}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 6. Blockchain Proof Display

```typescript
// src/components/BlockchainProof.tsx
export function BlockchainProof({ proof }: { proof: BlockchainProof }) {
  return (
    <div className="blockchain-proof">
      <h4>🔗 Blockchain Verification</h4>
      <div className="proof-details">
        <div className="proof-item">
          <span className="label">Transaction:</span>
          <a 
            href={`https://mumbai.polygonscan.com/tx/${proof.transaction_hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {proof.transaction_hash.slice(0, 10)}...
          </a>
        </div>
        <div className="proof-item">
          <span className="label">Block:</span>
          <span>{proof.block_number}</span>
        </div>
        <div className="proof-item">
          <span className="label">Timestamp:</span>
          <span>{new Date(proof.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 UI Updates Needed

### 1. Upload Interface

Add file upload with progress:

```tsx
<div className="upload-section">
  <h2>Verify Content Authenticity</h2>
  <p>Upload an image, video, or audio file to check for deepfakes</p>
  
  <FileUpload
    onUpload={handleUpload}
    accept="image/*,video/*,audio/*"
    maxSize={100 * 1024 * 1024} // 100MB
  />
  
  {isAnalyzing && (
    <div className="analyzing">
      <Spinner />
      <p>Council of 12 AIs is analyzing...</p>
    </div>
  )}
</div>
```

### 2. Results Display

Show comprehensive results:

```tsx
<div className="results-section">
  <ResultBadge result={result} confidence={confidence} />
  <CouncilVotes votes={councilVotes} />
  <BlockchainProof proof={blockchainProof} />
  <JABLReward amount={jablReward} />
</div>
```

### 3. History Section

Show past verifications:

```tsx
<div className="history-section">
  <h3>Your Verification History</h3>
  <HistoryList items={history} />
</div>
```

---

## 🔐 Security Implementation

### 1. API Key Management

Never expose API keys in frontend code:

```typescript
// ❌ Bad
const OPENAI_API_KEY = 'sk-...';

// ✅ Good - All API calls go through backend
const response = await fetch(`${API_URL}/api/v1/verify/content`);
```

### 2. Rate Limiting

Implement client-side rate limiting:

```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000 // 1 minute
});

async function verifyContent(file: File) {
  if (!rateLimiter.canMakeRequest()) {
    throw new Error('Rate limit exceeded. Please wait.');
  }
  
  // Make API call
}
```

### 3. Input Validation

Validate files before upload:

```typescript
function validateFile(file: File) {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ['image/', 'video/', 'audio/'];
  
  if (file.size > maxSize) {
    throw new Error('File too large. Max 100MB.');
  }
  
  if (!allowedTypes.some(type => file.type.startsWith(type))) {
    throw new Error('Invalid file type.');
  }
  
  return true;
}
```

---

## 💰 JABL Integration

### 1. Reward System

Show rewards after verification:

```typescript
async function handleVerificationComplete(result: VerificationResult) {
  // Show result
  setResult(result);
  
  // Show JABL reward
  if (result.jabl_reward > 0) {
    showNotification({
      type: 'success',
      title: 'JABL Earned!',
      message: `You earned ${result.jabl_reward} JABL tokens`,
      icon: '🪙'
    });
    
    // Update balance
    await refreshJABLBalance();
  }
}
```

### 2. Purchase JABL

Implement Stripe checkout:

```typescript
async function purchaseJABL(amount: number) {
  const response = await fetch(`${API_URL}/api/v1/jabl/purchase`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount })
  });
  
  const { checkout_url } = await response.json();
  window.location.href = checkout_url;
}
```

### 3. Stake JABL

Allow users to stake for rewards:

```typescript
async function stakeJABL(amount: number, duration: number) {
  const response = await fetch(`${API_URL}/api/v1/jabl/stake`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ amount, duration })
  });
  
  return await response.json();
}
```

---

## 🧪 Testing Checklist

- [ ] File upload works for images, videos, audio
- [ ] Council voting displays correctly
- [ ] Blockchain proof links to PolygonScan
- [ ] JABL rewards are credited
- [ ] Balance updates in real-time
- [ ] Error handling for failed uploads
- [ ] Rate limiting prevents abuse
- [ ] Mobile responsive
- [ ] Fast load times
- [ ] Accessibility (WCAG 2.1 AA)

---

## 📊 Analytics Events

Track key user actions:

```typescript
// Track verification
analytics.track('Content Verified', {
  file_type: file.type,
  file_size: file.size,
  result: result.result,
  confidence: result.confidence,
  jabl_earned: result.jabl_reward
});

// Track JABL purchase
analytics.track('JABL Purchased', {
  amount: amount,
  price: price,
  payment_method: 'stripe'
});

// Track staking
analytics.track('JABL Staked', {
  amount: amount,
  duration: duration,
  apy: apy
});
```

---

## 🚀 Deployment Steps

### 1. Update Lovable Project

1. Go to Lovable dashboard
2. Open proofof.ai project
3. Add environment variables:
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

### 2. Update API Integration

1. Replace mock API calls with real endpoints
2. Implement authentication
3. Add JABL balance display
4. Add Council voting display

### 3. Test Integration

1. Upload test file
2. Verify Council votes appear
3. Check blockchain proof
4. Confirm JABL reward

### 4. Deploy

1. Commit changes in Lovable
2. Lovable auto-deploys to proofof.ai
3. Verify custom domain works
4. Test end-to-end workflow

---

## 🔗 API Endpoints Reference

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Content Verification
```
POST /api/v1/verify/content
GET  /api/v1/verify/history
GET  /api/v1/verify/{decision_id}
```

### JABL Management
```
GET  /api/v1/users/me/balance
POST /api/v1/jabl/purchase
POST /api/v1/jabl/stake
POST /api/v1/jabl/unstake
GET  /api/v1/jabl/transactions
```

### Council
```
POST /api/v1/council/vote
GET  /api/v1/council/decisions
GET  /api/v1/council/stats
```

---

## 📞 Support

**Lovable Dashboard:** https://lovable.dev  
**Railway API:** https://railway.app/project/1f186e98-9c06-4781-afc5-9d08bfaac0fb  
**API Documentation:** https://your-railway-url.railway.app/docs

---

**Status:** Ready to integrate  
**Time to Complete:** 2-3 hours  
**Next:** Test end-to-end workflow

