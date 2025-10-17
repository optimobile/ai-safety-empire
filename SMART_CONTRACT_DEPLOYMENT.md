# 🔗 Smart Contract Deployment Guide
## AI Safety Empire - Polygon Mumbai Testnet

---

## ✅ Wallet Generated

**Deployment Address:** `0x1249Da8e694B7Efa63850A4ad9C5e993C8AAe5d5`

**Private Key:** `0xc257074bd007ac0c360c5059da7f03e9e8df713371649bf79dae75a4f2ef089c`

⚠️ **Security Note:** This is a testnet wallet. Generate a new wallet for production mainnet deployment.

---

## 📋 Smart Contracts to Deploy

### 1. AIDecisionLogger.sol
**Purpose:** Records all Council of 12 AIs voting decisions on-chain

**Features:**
- Immutable decision logging
- Council vote tracking
- Timestamp and metadata storage
- Query decisions by ID or requester

### 2. GovernanceVoting.sol
**Purpose:** Democratic governance for platform decisions

**Features:**
- Proposal creation and voting
- 10/12 supermajority requirement
- Jabulon.ai veto power
- Time-locked execution

### 3. AEGISToken.sol
**Purpose:** Platform access token (ERC-20)

**Features:**
- Standard ERC-20 functionality
- Minting and burning capabilities
- Transfer restrictions for compliance
- Integration with JabulonCoin

### 4. JabulonCoin.sol
**Purpose:** Cryptocurrency for AI safety ecosystem (ERC-20)

**Features:**
- Total supply: 1,000,000,000 JABL
- Staking with 5-25% APY
- Community rewards for deepfake reporting
- Conversion to AEGIS (100 JABL = 1 AEGIS)
- Charity pool for victims

---

## 🚀 Deployment Steps

### Step 1: Get Test MATIC

1. Go to Polygon Mumbai Faucet:
   ```
   https://faucet.polygon.technology/
   ```

2. Enter wallet address:
   ```
   0x1249Da8e694B7Efa63850A4ad9C5e993C8AAe5d5
   ```

3. Complete CAPTCHA and request test MATIC

4. Wait 1-2 minutes for MATIC to arrive

5. Verify on PolygonScan:
   ```
   https://mumbai.polygonscan.com/address/0x1249Da8e694B7Efa63850A4ad9C5e993C8AAe5d5
   ```

---

### Step 2: Configure Environment

Update `.env` file in blockchain directory:

```bash
cd /home/ubuntu/ai-safety-empire/blockchain
nano .env
```

Add these variables:
```env
PRIVATE_KEY=c257074bd007ac0c360c5059da7f03e9e8df713371649bf79dae75a4f2ef089c
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

**Note:** Get PolygonScan API key from https://polygonscan.com/apis

---

### Step 3: Deploy All Contracts

```bash
cd /home/ubuntu/ai-safety-empire/blockchain
npx hardhat run scripts/deploy-all.js --network mumbai
```

This will deploy all 4 contracts and output their addresses.

---

### Step 4: Verify Contracts on PolygonScan

```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
npx hardhat verify --network mumbai 0x123... "AIDecisionLogger" "1.0"
```

---

### Step 5: Update Railway Environment Variables

Add deployed contract addresses to Railway:

```env
CONTRACT_ADDRESS_LOGGER=0x...
CONTRACT_ADDRESS_GOVERNANCE=0x...
CONTRACT_ADDRESS_AEGIS=0x...
CONTRACT_ADDRESS_JABULONCOIN=0x...
```

Go to: https://railway.app/project/1f186e98-9c06-4781-afc5-9d08bfaac0fb
→ Variables tab → Add these variables

---

## 🧪 Testing Deployed Contracts

### Test AIDecisionLogger

```bash
npx hardhat run scripts/test-logger.js --network mumbai
```

### Test GovernanceVoting

```bash
npx hardhat run scripts/test-governance.js --network mumbai
```

### Test JabulonCoin

```bash
npx hardhat run scripts/test-jabuloncoin.js --network mumbai
```

---

## 📊 Contract Addresses (After Deployment)

Fill in after deployment:

```
AIDecisionLogger:   0x_____________________________________
GovernanceVoting:   0x_____________________________________
AEGISToken:         0x_____________________________________
JabulonCoin:        0x_____________________________________
```

---

## 🔍 Verify on PolygonScan

After deployment, verify each contract:

1. **AIDecisionLogger:**
   https://mumbai.polygonscan.com/address/CONTRACT_ADDRESS

2. **GovernanceVoting:**
   https://mumbai.polygonscan.com/address/CONTRACT_ADDRESS

3. **AEGISToken:**
   https://mumbai.polygonscan.com/address/CONTRACT_ADDRESS

4. **JabulonCoin:**
   https://mumbai.polygonscan.com/address/CONTRACT_ADDRESS

---

## 💰 JabulonCoin Economics

### Token Distribution
- **Total Supply:** 1,000,000,000 JABL
- **Initial Price:** $0.01 per JABL
- **Market Cap Target:** $10M → $100M → $1B

### Earning JABL
- Verify content: 10 JABL
- Detect deepfake: 100 JABL
- Report deepfake: 150 JABL
- Daily login: 5 JABL
- Refer friend: 50 JABL

### Spending JABL
- Priority verification: 20 JABL
- Bulk verification: 50 JABL
- API access: 500 JABL/month
- Convert to AEGIS: 100 JABL = 1 AEGIS

### Staking
- Lock JABL for 30-365 days
- Earn 5-25% APY
- Voting rights in governance
- Early unstaking penalty: 10%

---

## 🔐 Security Checklist

Before mainnet deployment:

- [ ] Audit all smart contracts (use CertiK, OpenZeppelin, etc.)
- [ ] Test all functions on Mumbai testnet
- [ ] Verify contract source code on PolygonScan
- [ ] Set up multi-sig wallet for contract ownership
- [ ] Implement time-locks for critical functions
- [ ] Test emergency pause functionality
- [ ] Verify gas optimization
- [ ] Document all contract interactions
- [ ] Set up monitoring and alerts
- [ ] Prepare incident response plan

---

## 🚀 Mainnet Deployment (Future)

When ready for production:

1. **Generate New Wallet**
   ```bash
   node scripts/generate-wallet.js
   ```

2. **Get Real MATIC**
   - Buy MATIC on exchange
   - Transfer to deployment wallet
   - Need ~10 MATIC for deployment gas

3. **Update Network Configuration**
   ```env
   POLYGON_RPC_URL=https://polygon-rpc.com
   CHAIN_ID=137
   ```

4. **Deploy to Mainnet**
   ```bash
   npx hardhat run scripts/deploy-all.js --network polygon
   ```

5. **Verify Contracts**
   ```bash
   npx hardhat verify --network polygon <ADDRESS> <ARGS>
   ```

---

## 📚 Additional Resources

### Polygon Documentation
- Mumbai Testnet: https://docs.polygon.technology/docs/develop/network-details/network/
- Faucet: https://faucet.polygon.technology/
- Explorer: https://mumbai.polygonscan.com/

### Hardhat Documentation
- Getting Started: https://hardhat.org/getting-started/
- Deploying Contracts: https://hardhat.org/guides/deploying.html
- Verifying Contracts: https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html

### OpenZeppelin
- ERC-20 Standard: https://docs.openzeppelin.com/contracts/4.x/erc20
- Security Best Practices: https://docs.openzeppelin.com/contracts/4.x/security

---

## 🎯 Next Steps After Deployment

1. ✅ Update Railway with contract addresses
2. ✅ Test backend integration with contracts
3. ✅ Deploy frontend websites to Vercel
4. ✅ Connect proofof.ai to backend API
5. ✅ Test end-to-end workflows
6. ✅ Execute 7-day launch roadmap

---

**Deployment Wallet:** 0x1249Da8e694B7Efa63850A4ad9C5e993C8AAe5d5  
**Network:** Polygon Mumbai Testnet  
**Status:** Ready to deploy (need test MATIC)  
**Time to Deploy:** 10-15 minutes (after getting MATIC)

