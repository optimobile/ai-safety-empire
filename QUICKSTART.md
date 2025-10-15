# Quick Start Guide - AI Safety Empire

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for blockchain)
- Python 3.11+ (optional, for local development)

---

## Option 1: Docker (Recommended)

### 1. Clone and Configure

```bash
cd ai-safety-empire
cp .env.example .env
```

### 2. Edit `.env` File

**Minimum required**:
```bash
# Generate a secret key
JWT_SECRET_KEY=$(openssl rand -hex 32)

# Use default PostgreSQL
DATABASE_URL=postgresql://ai_safety:ai_safety_password@postgres:5432/ai_safety_db

# Use default Redis
REDIS_URL=redis://redis:6379

# Use public Polygon Mumbai RPC
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
CHAIN_ID=80001
```

### 3. Start Everything

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- Prometheus monitoring
- Grafana dashboards
- FastAPI backend

### 4. Access Services

- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090

---

## Option 2: Local Development

### 1. Set Up Backend

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Set Up Blockchain

```bash
cd blockchain
npm install
npx hardhat compile
```

### 3. Start Database (Docker)

```bash
docker-compose up -d postgres redis
```

### 4. Initialize Database

```bash
cd backend
source venv/bin/activate
python -c "from database.database import init_db; init_db()"
```

### 5. Start API

```bash
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🧪 Test the API

### Register a User

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "SecurePass123",
    "full_name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "SecurePass123"
  }'
```

Save the `access_token` from the response.

### Create API Key

```bash
curl -X POST http://localhost:8000/auth/api-keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First API Key",
    "rate_limit": 1000
  }'
```

Save the `api_key` from the response (shown only once!).

### Create AI Decision

```bash
curl -X POST http://localhost:8000/decisions/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "decision_type": "content_moderation",
    "input_data": {
      "text": "Sample content to moderate",
      "context": "user_post"
    },
    "is_robot_decision": false
  }'
```

### Get Statistics

```bash
curl http://localhost:8000/decisions/statistics/overview \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔗 Deploy Smart Contracts (Optional)

### 1. Get Test MATIC

Visit: https://mumbaifaucet.com/
Enter your wallet address to get test MATIC.

### 2. Configure Wallet

Add to `.env`:
```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
```

### 3. Deploy Contracts

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network mumbai
```

### 4. Update Contract Addresses

Copy the deployed addresses to `.env`:
```bash
CONTRACT_ADDRESS_LOGGER=0x...
CONTRACT_ADDRESS_GOVERNANCE=0x...
CONTRACT_ADDRESS_AEGIS=0x...
```

### 5. Restart API

```bash
docker-compose restart backend
# or if running locally:
# Ctrl+C and restart uvicorn
```

---

## 📊 View Monitoring

### Grafana Dashboard

1. Open http://localhost:3001
2. Login: admin / admin
3. Add Prometheus data source:
   - URL: http://prometheus:9090
4. Import dashboard or create custom panels

### Prometheus Metrics

1. Open http://localhost:9090
2. Try queries:
   - `up` - Service status
   - `http_requests_total` - Request count
   - `http_request_duration_seconds` - Response time

---

## 🛠️ Common Commands

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Restart a service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build backend
```

### Database

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U ai_safety -d ai_safety_db

# Backup database
docker-compose exec postgres pg_dump -U ai_safety ai_safety_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U ai_safety -d ai_safety_db < backup.sql
```

### Blockchain

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.js --network hardhat

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contract on PolygonScan
npx hardhat verify --network mumbai CONTRACT_ADDRESS
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 PID
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Blockchain Connection Error

- Check RPC URL in `.env`
- Try alternative RPC: https://polygon-mumbai.g.alchemy.com/v2/demo
- Verify chain ID is 80001 for Mumbai

### Permission Denied

```bash
# Fix file permissions
chmod +x scripts/*.sh

# Fix Docker socket (Linux)
sudo chmod 666 /var/run/docker.sock
```

---

## 📚 Next Steps

1. **Read the README**: Complete project documentation
2. **Explore API Docs**: http://localhost:8000/docs
3. **Check Day 1 Summary**: DAY1_COMPLETE.md
4. **Start Day 2**: Build the first platform (councilof.ai)

---

## 💡 Tips

- Use **API docs** for interactive testing
- Check **health endpoint** to verify all services
- Enable **hot reload** for faster development
- Use **Docker logs** to debug issues
- Keep **private keys** secure and never commit them

---

## 🆘 Need Help?

- Check logs: `docker-compose logs -f`
- Test health: `curl http://localhost:8000/health`
- Verify database: `docker-compose exec postgres psql -U ai_safety -d ai_safety_db -c "SELECT 1;"`
- Check blockchain: `curl http://localhost:8000/health/blockchain`

---

**Ready to build the future of AI safety!** 🚀

