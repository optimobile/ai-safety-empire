# AI Safety Empire - Day 1 Foundation

## 🎯 Overview

The AI Safety Empire is a comprehensive blockchain-based ecosystem for AI safety, governance, and robotics compliance. This repository contains the foundational infrastructure built on **Day 1** of the 18-day implementation sprint.

### What We Built Today

✅ **Blockchain Smart Contracts** (Solidity 0.8.20)
- AIDecisionLogger.sol - Immutable audit trail for all AI decisions
- GovernanceVoting.sol - AEGIS token-based governance system
- AEGISToken.sol - ERC20 utility token with staking

✅ **Database Infrastructure** (PostgreSQL + SQLAlchemy)
- Complete data models for 15 platforms
- User management and authentication
- AI decision tracking with blockchain integration
- Council voting system
- Audit logging and compliance

✅ **Backend API** (FastAPI + Python 3.11)
- RESTful API with automatic OpenAPI documentation
- JWT authentication + API key support
- Blockchain integration via Web3.py
- Health checks and monitoring

✅ **Development Environment**
- Docker Compose for local development
- PostgreSQL, Redis, Prometheus, Grafana
- Hot reload for rapid development

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   API Gateway (FastAPI)                  │
│              Rate Limiting | Auth | Logging              │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│   PostgreSQL   │  │    Redis    │  │  Polygon Chain  │
│   (Structured  │  │   (Cache/   │  │   (Immutable    │
│      Data)     │  │  Rate Limit)│  │   Audit Trail)  │
└────────────────┘  └─────────────┘  └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for blockchain deployment)
- Python 3.11+ (for local development)
- Polygon Mumbai testnet wallet with MATIC

### 1. Clone and Setup

```bash
cd ai-safety-empire
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL, Redis, Prometheus, Grafana
docker-compose up -d postgres redis prometheus grafana

# Wait for services to be healthy
docker-compose ps
```

### 3. Deploy Smart Contracts

```bash
cd blockchain
npm install
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Copy contract addresses to .env
```

### 4. Initialize Database

```bash
cd backend
pip install -r requirements.txt

# Run migrations (creates all tables)
python -c "from database.database import init_db; init_db()"
```

### 5. Start Backend API

```bash
# Development mode with hot reload
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

# Or use Docker
docker-compose up backend
```

### 6. Access Services

- **API Documentation**: http://localhost:8000/docs
- **API Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

---

## 📚 API Endpoints

### Authentication

```bash
# Register new user
POST /auth/register
{
  "email": "user@example.com",
  "username": "user",
  "password": "SecurePass123",
  "full_name": "John Doe"
}

# Login
POST /auth/login
{
  "username": "user",
  "password": "SecurePass123"
}

# Get current user
GET /auth/me
Authorization: Bearer <token>

# Create API key
POST /auth/api-keys
Authorization: Bearer <token>
{
  "name": "My API Key",
  "rate_limit": 1000,
  "expires_in_days": 365
}
```

### AI Decisions

```bash
# Create decision
POST /decisions/
Authorization: Bearer <token>
{
  "decision_type": "content_moderation",
  "input_data": {
    "text": "Sample content to moderate",
    "context": "user_post"
  },
  "is_robot_decision": false
}

# List decisions
GET /decisions/?skip=0&limit=100&status_filter=pending

# Get decision details
GET /decisions/{decision_id}

# Vote on decision (council members only)
POST /decisions/{decision_id}/vote
{
  "vote": true,
  "confidence": 0.95,
  "reasoning": "Content is safe",
  "model_name": "gpt-4",
  "processing_time_ms": 150
}

# Get statistics
GET /decisions/statistics/overview
```

### Platforms

```bash
# List platforms
GET /platforms/

# Get platform
GET /platforms/{platform_id}

# Create platform (admin only)
POST /platforms/
{
  "name": "councilof.ai",
  "domain": "councilof.ai",
  "platform_type": "governance",
  "description": "Multi-AI consensus governance"
}
```

### Health

```bash
# Overall health
GET /health/

# Database health
GET /health/database

# Blockchain health
GET /health/blockchain

# Simple ping
GET /health/ping
```

---

## 🔐 Security

### Authentication Methods

1. **JWT Tokens** - For user authentication
   - 30-minute expiration
   - Refresh token support (TODO)
   - Secure HTTP-only cookies (TODO)

2. **API Keys** - For programmatic access
   - Format: `aegis_<random_32_bytes>`
   - Rate limiting per key
   - Expiration support
   - Usage tracking

### Password Security

- bcrypt hashing with salt
- Minimum 8 characters
- Stored as hash only

### Blockchain Security

- Private key management via environment variables
- Transaction signing with eth_account
- Gas price optimization
- Nonce management

---

## 📊 Database Schema

### Core Tables

- **users** - User accounts and authentication
- **api_keys** - API key management
- **platforms** - Platform registry (15 platforms)
- **ai_decisions** - All AI decisions with blockchain hashes
- **council_votes** - Individual council member votes
- **audit_logs** - Complete audit trail
- **robot_registry** - Physical robot tracking
- **incidents** - Safety incidents and violations

### Indexes

Optimized indexes for:
- User lookups by email/username
- Decision queries by status and timestamp
- Audit log searches by action and resource
- Platform filtering

---

## 🔗 Blockchain Integration

### Smart Contracts

**AIDecisionLogger**
- Logs all AI decisions immutably
- Council voting mechanism
- 5/6 approval threshold
- Status tracking (pending → approved/rejected → executed)

**GovernanceVoting**
- AEGIS token-based governance
- 7-day voting period
- 10% quorum requirement
- 66% approval threshold

**AEGISToken**
- 1 billion max supply
- Staking with rewards (5-25% APY)
- 4-year team vesting
- Governance rights

### Polygon Network

- **Testnet**: Mumbai (Chain ID: 80001)
- **Mainnet**: Polygon PoS (Chain ID: 137)
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com

---

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio pytest-cov

# Run tests
pytest

# With coverage
pytest --cov=backend --cov-report=html

# Test specific module
pytest tests/test_auth.py -v
```

---

## 📈 Monitoring

### Prometheus Metrics

- API request duration
- Request count by endpoint
- Error rates
- Database connection pool
- Blockchain transaction success rate

### Grafana Dashboards

- API Performance
- Database Health
- Blockchain Statistics
- User Activity

---

## 🔧 Configuration

### Environment Variables

See `.env.example` for all configuration options.

**Critical Settings:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret for JWT signing
- `PRIVATE_KEY` - Blockchain wallet private key
- `CONTRACT_ADDRESS_*` - Deployed contract addresses

---

## 📝 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/new-endpoint
```

### 2. Make Changes

```bash
# Edit code
# Add tests
# Update documentation
```

### 3. Test Locally

```bash
# Run tests
pytest

# Check code style
black backend/
flake8 backend/

# Type checking
mypy backend/
```

### 4. Commit and Push

```bash
git add .
git commit -m "Add new endpoint for X"
git push origin feature/new-endpoint
```

---

## 🚧 TODO for Day 2

- [ ] Build Universal SDK (Python + JavaScript)
- [ ] Create API Gateway with routing
- [ ] Implement Council of AIs consensus mechanism
- [ ] Build admin dashboard (React)
- [ ] Set up CI/CD pipeline
- [ ] Deploy to staging environment
- [ ] Start councilof.ai platform development

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@aisafety.ai
- Discord: [AI Safety Empire](https://discord.gg/aisafety)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- FastAPI
- SQLAlchemy
- Web3.py
- OpenZeppelin
- Hardhat
- Docker

---

**Day 1 Status**: ✅ **COMPLETE**

**Next**: Day 2 - Universal SDK & API Gateway

