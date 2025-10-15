# JabulonCoin Integration with ProofOf.ai

**Complete guide to integrating JABL token rewards with deepfake detection**

---

## Overview

This integration enables users to earn JabulonCoin (JABL) tokens when they:
- Verify content on ProofOf.ai
- Report confirmed deepfakes
- Contribute to the AI safety ecosystem

Users can then spend JABL tokens on:
- Premium verification features
- Priority processing
- Converting to AEGIS governance tokens
- Trading on exchanges (future)

---

## Architecture

```
User Action (Verify Image)
    ↓
ProofOf.ai Frontend (Lovable)
    ↓
Backend API (FastAPI)
    ↓
Council of AIs (6 models vote)
    ↓
Blockchain (Log decision)
    ↓
JabulonCoin Contract (Distribute rewards)
    ↓
User Wallet (Receive JABL)
```

---

## Step 1: Update Backend API (30 minutes)

### Add JabulonCoin Reward Logic

**File:** `/home/ubuntu/ai-safety-empire/backend/api/routes/decisions.py`

Add this function:

```python
from backend.blockchain.client import BlockchainClient

blockchain = BlockchainClient()

async def distribute_jabl_reward(user_address: str, verification_result: dict):
    """
    Distribute JABL tokens based on verification result
    """
    # Reward amounts
    REWARDS = {
        "deepfake_detected": 100,  # 100 JABL for finding a deepfake
        "verification_performed": 10,  # 10 JABL for any verification
        "false_positive_penalty": -50,  # Penalty for wrong reports
    }
    
    reward_amount = 0
    
    # Base reward for performing verification
    reward_amount += REWARDS["verification_performed"]
    
    # Bonus for detecting deepfake (if confirmed by Council)
    if verification_result["is_deepfake"] and verification_result["confidence"] > 0.8:
        reward_amount += REWARDS["deepfake_detected"]
    
    # Distribute JABL tokens
    if reward_amount > 0:
        tx_hash = blockchain.transfer_jabl(
            to_address=user_address,
            amount=reward_amount
        )
        
        return {
            "reward_amount": reward_amount,
            "transaction_hash": tx_hash,
            "message": f"You earned {reward_amount} JABL!"
        }
    
    return None
```

### Update Verification Endpoint

**File:** `/home/ubuntu/ai-safety-empire/standalone-api/app.py`

Update the `/verify/` endpoint:

```python
@app.post("/verify/")
async def verify_content(request: VerifyRequest):
    # Existing verification logic...
    result = {
        "is_deepfake": is_deepfake,
        "confidence": confidence,
        "council_vote": council_vote,
        "blockchain_hash": blockchain_hash,
    }
    
    # NEW: Distribute JABL rewards
    if request.user_wallet_address:
        reward = await distribute_jabl_reward(
            user_address=request.user_wallet_address,
            verification_result=result
        )
        result["jabl_reward"] = reward
    
    return result
```

### Add Balance Endpoint

```python
@app.get("/jabl/balance/{wallet_address}")
async def get_jabl_balance(wallet_address: str):
    """
    Get user's JABL token balance
    """
    balance = blockchain.get_jabl_balance(wallet_address)
    
    return {
        "wallet_address": wallet_address,
        "jabl_balance": balance,
        "aegis_balance": blockchain.get_aegis_balance(wallet_address),
        "conversion_rate": "100 JABL = 1 AEGIS"
    }
```

---

## Step 2: Update Blockchain Client (20 minutes)

**File:** `/home/ubuntu/ai-safety-empire/backend/blockchain/client.py`

Add JabulonCoin interaction methods:

```python
class BlockchainClient:
    def __init__(self):
        # Existing initialization...
        
        # Load JabulonCoin contract
        self.jabulon_contract = self.w3.eth.contract(
            address=os.getenv('CONTRACT_ADDRESS_JABULON'),
            abi=JABULON_ABI
        )
    
    def get_jabl_balance(self, address: str) -> int:
        """Get JABL token balance for address"""
        balance = self.jabulon_contract.functions.balanceOf(address).call()
        return balance
    
    def transfer_jabl(self, to_address: str, amount: int) -> str:
        """Transfer JABL tokens to user"""
        # Build transaction
        tx = self.jabulon_contract.functions.transfer(
            to_address,
            amount
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 100000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for confirmation
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return tx_hash.hex()
    
    def convert_jabl_to_aegis(self, user_address: str, jabl_amount: int) -> str:
        """Convert JABL to AEGIS (100:1 ratio)"""
        # Call smart contract conversion function
        tx = self.jabulon_contract.functions.convertToAEGIS(
            jabl_amount
        ).build_transaction({
            'from': user_address,
            'nonce': self.w3.eth.get_transaction_count(user_address),
            'gas': 150000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # User needs to sign this transaction
        return tx
```

---

## Step 3: Update ProofOf.ai Frontend (Lovable) (45 minutes)

### Add Wallet Connection

**File:** `src/lib/wallet.ts` (create new)

```typescript
import { ethers } from 'ethers';

export class WalletManager {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  
  async connect(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }
    
    this.provider = new ethers.BrowserProvider(window.ethereum);
    await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.provider.getSigner();
    
    const address = await this.signer.getAddress();
    return address;
  }
  
  async getBalance(contractAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Not connected');
    
    const contract = new ethers.Contract(
      contractAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );
    
    const address = await this.signer!.getAddress();
    const balance = await contract.balanceOf(address);
    
    return ethers.formatUnits(balance, 0); // JABL has 0 decimals
  }
}
```

### Update API Client

**File:** `src/lib/api.ts` (update existing)

```typescript
const API_URL = 'https://your-railway-url.up.railway.app';

export interface VerifyRequest {
  content_url: string;
  content_type: string;
  user_wallet_address?: string; // NEW: Optional wallet address
}

export interface VerifyResponse {
  is_deepfake: boolean;
  confidence: number;
  council_vote: {
    approve: number;
    reject: number;
  };
  blockchain_hash: string;
  jabl_reward?: {
    reward_amount: number;
    transaction_hash: string;
    message: string;
  };
}

export async function verifyContent(
  contentUrl: string,
  contentType: string,
  walletAddress?: string
): Promise<VerifyResponse> {
  const response = await fetch(`${API_URL}/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content_url: contentUrl,
      content_type: contentType,
      user_wallet_address: walletAddress
    })
  });
  
  return await response.json();
}

export async function getJABLBalance(walletAddress: string): Promise<number> {
  const response = await fetch(`${API_URL}/jabl/balance/${walletAddress}`);
  const data = await response.json();
  return data.jabl_balance;
}
```

### Add Wallet UI Component

**File:** `src/components/WalletConnect.tsx` (create new)

```typescript
import { useState, useEffect } from 'react';
import { WalletManager } from '../lib/wallet';
import { getJABLBalance } from '../lib/api';

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletManager | null>(null);
  const [address, setAddress] = useState<string>('');
  const [jablBalance, setJablBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  
  const connectWallet = async () => {
    setLoading(true);
    try {
      const walletManager = new WalletManager();
      const addr = await walletManager.connect();
      
      setWallet(walletManager);
      setAddress(addr);
      
      // Get JABL balance
      const balance = await getJABLBalance(addr);
      setJablBalance(balance);
      
      // Store in localStorage
      localStorage.setItem('wallet_address', addr);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please install MetaMask.');
    } finally {
      setLoading(false);
    }
  };
  
  const disconnectWallet = () => {
    setWallet(null);
    setAddress('');
    setJablBalance(0);
    localStorage.removeItem('wallet_address');
  };
  
  // Auto-connect if previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem('wallet_address');
    if (savedAddress) {
      connectWallet();
    }
  }, []);
  
  if (!address) {
    return (
      <button
        onClick={connectWallet}
        disabled={loading}
        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }
  
  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        <div className="font-semibold text-purple-600">
          {jablBalance.toLocaleString()} JABL
        </div>
        <div className="text-gray-500 text-xs">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </div>
      <button
        onClick={disconnectWallet}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
      >
        Disconnect
      </button>
    </div>
  );
}
```

### Update Verification Component

**File:** `src/components/VerifyImage.tsx` (update existing)

```typescript
import { useState } from 'react';
import { verifyContent } from '../lib/api';
import { WalletConnect } from './WalletConnect';

export function VerifyImage() {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleVerify = async () => {
    setLoading(true);
    try {
      // Get wallet address from localStorage
      const walletAddress = localStorage.getItem('wallet_address');
      
      const response = await verifyContent(
        imageUrl,
        'image',
        walletAddress || undefined
      );
      
      setResult(response);
      
      // Show reward notification
      if (response.jabl_reward) {
        alert(`🎉 ${response.jabl_reward.message}`);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Wallet Connection */}
      <div className="mb-6 flex justify-end">
        <WalletConnect />
      </div>
      
      {/* Image URL Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Image URL
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading || !imageUrl}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Verify Image'}
      </button>
      
      {/* Results */}
      {result && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            {result.is_deepfake ? (
              <span className="text-4xl">⚠️</span>
            ) : (
              <span className="text-4xl">✅</span>
            )}
            <div>
              <h3 className="text-xl font-bold">
                {result.is_deepfake ? 'Deepfake Detected!' : 'Authentic Content'}
              </h3>
              <p className="text-gray-600">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* Council Vote */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Council of AIs Vote:</h4>
            <div className="flex gap-4">
              <div className="flex-1 bg-green-100 p-3 rounded">
                <div className="text-green-700 font-bold">
                  ✓ Approve: {result.council_vote.approve}
                </div>
              </div>
              <div className="flex-1 bg-red-100 p-3 rounded">
                <div className="text-red-700 font-bold">
                  ✗ Reject: {result.council_vote.reject}
                </div>
              </div>
            </div>
          </div>
          
          {/* JABL Reward */}
          {result.jabl_reward && (
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🪙</span>
                <h4 className="font-bold text-purple-700">
                  Reward Earned!
                </h4>
              </div>
              <p className="text-purple-900">
                +{result.jabl_reward.reward_amount} JABL
              </p>
              <p className="text-xs text-purple-600 mt-1">
                TX: {result.jabl_reward.transaction_hash.slice(0, 10)}...
              </p>
            </div>
          )}
          
          {/* Blockchain Proof */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Blockchain Hash: {result.blockchain_hash}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Step 4: Update Smart Contract (Optional Enhancement) (30 minutes)

### Add Automated Reward Distribution

**File:** `/home/ubuntu/ai-safety-empire/blockchain/contracts/JabulonCoin.sol`

Add this function:

```solidity
// Mapping to track authorized reward distributors
mapping(address => bool) public rewardDistributors;

// Event for reward distribution
event RewardDistributed(address indexed user, uint256 amount, string reason);

modifier onlyRewardDistributor() {
    require(rewardDistributors[msg.sender], "Not authorized to distribute rewards");
    _;
}

function addRewardDistributor(address distributor) external onlyOwner {
    rewardDistributors[distributor] = true;
}

function distributeReward(
    address user,
    uint256 amount,
    string memory reason
) external onlyRewardDistributor {
    require(balanceOf(address(this)) >= amount, "Insufficient reward pool");
    
    _transfer(address(this), user, amount);
    
    emit RewardDistributed(user, amount, reason);
}
```

This allows the backend to automatically distribute rewards without manual intervention.

---

## Step 5: Testing (1 hour)

### Test Locally

1. **Start local blockchain:**
```bash
cd blockchain
npx hardhat node
```

2. **Deploy contracts:**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. **Start backend:**
```bash
cd standalone-api
uvicorn app:app --reload
```

4. **Test wallet connection:**
- Install MetaMask
- Connect to localhost:8545
- Import test account from Hardhat

5. **Test verification with rewards:**
```bash
curl -X POST http://localhost:8000/verify/ \
  -H "Content-Type: application/json" \
  -d '{
    "content_url": "https://example.com/image.jpg",
    "content_type": "image",
    "user_wallet_address": "0x..."
  }'
```

6. **Check JABL balance:**
```bash
curl http://localhost:8000/jabl/balance/0x...
```

### Test on Testnet

1. **Deploy to Mumbai:**
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

2. **Update backend .env:**
```
CONTRACT_ADDRESS_JABULON=0x...
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
```

3. **Test with real MetaMask:**
- Switch to Mumbai testnet
- Get test MATIC from faucet
- Verify image on ProofOf.ai
- Check JABL balance increases

---

## Step 6: Deploy to Production (30 minutes)

### Deploy Backend

```bash
# Push to GitHub
git add .
git commit -m "Add JabulonCoin integration"
git push

# Deploy to Railway
# Railway auto-deploys from GitHub
```

### Deploy Contracts to Mainnet

```bash
# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon

# Verify on PolygonScan
npx hardhat verify --network polygon CONTRACT_ADDRESS
```

### Update Lovable

1. Update API_URL to production URL
2. Update contract addresses
3. Test on production
4. Deploy Lovable project

---

## Reward Structure

### Earning JABL

| Action | JABL Reward |
|--------|-------------|
| Verify any content | 10 JABL |
| Detect confirmed deepfake | 100 JABL |
| Report deepfake (verified by Council) | 150 JABL |
| Daily login | 5 JABL |
| Refer a friend | 50 JABL |

### Spending JABL

| Feature | JABL Cost |
|---------|-----------|
| Priority verification | 20 JABL |
| Bulk verification (10 images) | 50 JABL |
| API access (1 month) | 500 JABL |
| Convert to AEGIS (100 JABL) | 1 AEGIS |

---

## User Flow Example

1. **User visits ProofOf.ai**
2. **Clicks "Connect Wallet"** → MetaMask opens
3. **Approves connection** → Wallet address saved
4. **Pastes image URL** → Clicks "Verify"
5. **Backend processes:**
   - Council of AIs votes
   - Logs to blockchain
   - Distributes JABL reward
6. **User sees result:**
   - "Deepfake Detected!"
   - "+100 JABL earned"
   - New balance: 110 JABL
7. **User can:**
   - Verify more images (earn more)
   - Convert to AEGIS (100 JABL → 1 AEGIS)
   - Use for premium features

---

## Security Considerations

### Prevent Abuse

1. **Rate Limiting:**
```python
# Limit verifications per wallet
MAX_VERIFICATIONS_PER_DAY = 50

async def check_rate_limit(wallet_address: str):
    count = await db.count_verifications_today(wallet_address)
    if count >= MAX_VERIFICATIONS_PER_DAY:
        raise HTTPException(429, "Daily limit reached")
```

2. **Duplicate Detection:**
```python
# Don't reward same image twice
async def check_duplicate(content_url: str, wallet_address: str):
    exists = await db.check_verification_exists(content_url, wallet_address)
    if exists:
        return {"reward": 0, "message": "Already verified"}
```

3. **Sybil Resistance:**
```python
# Require minimum wallet age or activity
MIN_WALLET_AGE_DAYS = 7

async def check_wallet_age(wallet_address: str):
    age = await blockchain.get_wallet_age(wallet_address)
    if age < MIN_WALLET_AGE_DAYS:
        raise HTTPException(403, "Wallet too new")
```

---

## Analytics & Tracking

### Track Key Metrics

```python
# Add to backend
@app.get("/stats/jabl")
async def get_jabl_stats():
    return {
        "total_distributed": await db.sum_jabl_distributed(),
        "total_users": await db.count_unique_wallets(),
        "avg_reward_per_user": await db.avg_jabl_per_user(),
        "top_earners": await db.get_top_earners(limit=10),
        "verifications_today": await db.count_verifications_today(),
    }
```

### Display on Frontend

```typescript
// Show live stats on ProofOf.ai
export function JABLStats() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch(`${API_URL}/stats/jabl`)
      .then(r => r.json())
      .then(setStats);
  }, []);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-600">
          {stats?.total_distributed.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">JABL Distributed</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">
          {stats?.total_users.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Active Users</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">
          {stats?.verifications_today.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Verifications Today</div>
      </div>
    </div>
  );
}
```

---

## Timeline

### Immediate (Today)
- [x] Create integration plan ✅
- [ ] Update backend API (30 min)
- [ ] Update blockchain client (20 min)

### This Week
- [ ] Add wallet connection to Lovable (45 min)
- [ ] Test locally (1 hour)
- [ ] Deploy to testnet (30 min)
- [ ] Test on testnet (30 min)

### Next Week
- [ ] Deploy to mainnet (30 min)
- [ ] Launch publicly
- [ ] Monitor and optimize
- [ ] Add more reward types

**Total Time:** ~4 hours to full integration

---

## Success Metrics

### Week 1
- 100+ wallets connected
- 1,000+ JABL distributed
- 500+ verifications

### Month 1
- 1,000+ wallets connected
- 50,000+ JABL distributed
- 10,000+ verifications

### Month 3
- 10,000+ wallets connected
- 1,000,000+ JABL distributed
- 100,000+ verifications

---

**Ready to integrate! This will make ProofOf.ai the first deepfake detector with cryptocurrency rewards!** 🚀

