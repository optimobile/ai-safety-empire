"""
AI Safety Empire - Unified API Gateway
Routes requests to all 11 platforms with shared authentication and logging
"""

from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import jwt
import os
from datetime import datetime, timedelta
from typing import Optional
import redis
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import hashlib

# Initialize FastAPI
app = FastAPI(
    title="AI Safety Empire API Gateway",
    description="Unified gateway for all 11 AI safety platforms",
    version="1.0.0"
)

# CORS configuration for all domains
ALLOWED_ORIGINS = [
    "https://councilof.ai",
    "https://proofof.ai",
    "https://asisecurity.ai",
    "https://agisafe.ai",
    "https://suicidestop.ai",
    "https://transparencyof.ai",
    "https://ethicalgovernanceof.ai",
    "https://safetyof.ai",
    "https://accountabilityof.ai",
    "https://biasdetectionof.ai",
    "https://dataprivacyof.ai",
    "http://localhost:5173",  # Development
    "http://localhost:3000",  # Development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/aisafety")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
BACKEND_API_URL = os.getenv("BACKEND_API_URL", "http://localhost:8000")

# Database setup
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Redis setup for caching
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# Platform routing configuration
PLATFORM_ROUTES = {
    "council": {"name": "councilof.ai", "prefix": "/council"},
    "proof": {"name": "proofof.ai", "prefix": "/proof"},
    "security": {"name": "asisecurity.ai", "prefix": "/security"},
    "agi": {"name": "agisafe.ai", "prefix": "/agi"},
    "suicide": {"name": "suicidestop.ai", "prefix": "/suicide"},
    "transparency": {"name": "transparencyof.ai", "prefix": "/transparency"},
    "ethical": {"name": "ethicalgovernanceof.ai", "prefix": "/ethical"},
    "safety": {"name": "safetyof.ai", "prefix": "/safety"},
    "accountability": {"name": "accountabilityof.ai", "prefix": "/accountability"},
    "bias": {"name": "biasdetectionof.ai", "prefix": "/bias"},
    "privacy": {"name": "dataprivacyof.ai", "prefix": "/privacy"},
}

# Database Models
class User(Base):
    __tablename__ = "gateway_users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    wallet_address = Column(String, unique=True, nullable=True)
    jabl_balance = Column(Integer, default=0)
    aegis_balance = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class CouncilDecision(Base):
    __tablename__ = "gateway_council_decisions"
    
    id = Column(String, primary_key=True)
    platform = Column(String, index=True)
    decision_type = Column(String)
    user_id = Column(String, index=True)
    council_votes = Column(String)  # JSON string
    blockchain_hash = Column(String, unique=True)
    jabl_reward = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT token for authentication"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Get current user from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        
        payload = verify_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

# Routes

@app.get("/")
async def root():
    """Gateway health check"""
    return {
        "service": "AI Safety Empire API Gateway",
        "status": "operational",
        "platforms": len(PLATFORM_ROUTES),
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    # Check database
    db_status = "healthy"
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Check Redis
    redis_status = "healthy"
    try:
        redis_client.ping()
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "redis": redis_status,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/auth/register")
async def register(email: str, password: str, db: Session = Depends(get_db)):
    """Register new user"""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = hashlib.sha256(email.encode()).hexdigest()[:16]
    user = User(
        id=user_id,
        email=email,
        jabl_balance=100,  # Welcome bonus
        aegis_balance=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create token
    token = create_access_token(data={"sub": user.id, "email": user.email})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "jabl_balance": user.jabl_balance,
            "aegis_balance": user.aegis_balance
        }
    }

@app.post("/auth/login")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create token
    token = create_access_token(data={"sub": user.id, "email": user.email})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "jabl_balance": user.jabl_balance,
            "aegis_balance": user.aegis_balance
        }
    }

@app.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "wallet_address": current_user.wallet_address,
        "jabl_balance": current_user.jabl_balance,
        "aegis_balance": current_user.aegis_balance,
        "created_at": current_user.created_at.isoformat(),
        "last_login": current_user.last_login.isoformat()
    }

@app.post("/council/submit")
async def submit_to_council(
    platform: str,
    decision_type: str,
    decision_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit decision to Council of AIs for voting"""
    # Validate platform
    if platform not in PLATFORM_ROUTES:
        raise HTTPException(status_code=400, detail="Invalid platform")
    
    # Forward to backend API for Council voting
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BACKEND_API_URL}/council/vote",
            json={
                "platform": platform,
                "decision_type": decision_type,
                "decision_data": decision_data,
                "user_id": current_user.id
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Council voting failed")
        
        result = response.json()
    
    # Save decision to database
    decision_id = hashlib.sha256(f"{platform}{decision_type}{datetime.utcnow()}".encode()).hexdigest()[:16]
    decision = CouncilDecision(
        id=decision_id,
        platform=platform,
        decision_type=decision_type,
        user_id=current_user.id,
        council_votes=str(result.get("votes", {})),
        blockchain_hash=result.get("blockchain_hash", ""),
        jabl_reward=result.get("jabl_reward", 10)
    )
    db.add(decision)
    
    # Update user JABL balance
    current_user.jabl_balance += decision.jabl_reward
    db.commit()
    
    return {
        "decision_id": decision.id,
        "council_votes": result.get("votes", {}),
        "approved": result.get("approved", False),
        "blockchain_hash": result.get("blockchain_hash", ""),
        "jabl_reward": decision.jabl_reward,
        "new_balance": current_user.jabl_balance
    }

@app.get("/council/decisions")
async def get_council_decisions(
    platform: Optional[str] = None,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent Council decisions"""
    query = db.query(CouncilDecision)
    
    if platform:
        query = query.filter(CouncilDecision.platform == platform)
    
    decisions = query.order_by(CouncilDecision.created_at.desc()).limit(limit).all()
    
    return {
        "decisions": [
            {
                "id": d.id,
                "platform": d.platform,
                "decision_type": d.decision_type,
                "blockchain_hash": d.blockchain_hash,
                "jabl_reward": d.jabl_reward,
                "created_at": d.created_at.isoformat()
            }
            for d in decisions
        ]
    }

@app.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Get ecosystem statistics"""
    total_users = db.query(User).count()
    total_decisions = db.query(CouncilDecision).count()
    total_jabl_distributed = db.query(CouncilDecision).with_entities(
        db.func.sum(CouncilDecision.jabl_reward)
    ).scalar() or 0
    
    # Platform-specific stats
    platform_stats = {}
    for platform_key, platform_info in PLATFORM_ROUTES.items():
        count = db.query(CouncilDecision).filter(
            CouncilDecision.platform == platform_key
        ).count()
        platform_stats[platform_info["name"]] = count
    
    return {
        "total_users": total_users,
        "total_decisions": total_decisions,
        "total_jabl_distributed": total_jabl_distributed,
        "platform_activity": platform_stats,
        "platforms_active": len(PLATFORM_ROUTES)
    }

@app.api_route("/{platform}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def platform_proxy(
    platform: str,
    path: str,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Proxy requests to platform-specific backends"""
    if platform not in PLATFORM_ROUTES:
        raise HTTPException(status_code=404, detail="Platform not found")
    
    # Forward request to backend
    async with httpx.AsyncClient() as client:
        url = f"{BACKEND_API_URL}/{platform}/{path}"
        headers = dict(request.headers)
        headers["X-User-ID"] = current_user.id
        
        response = await client.request(
            method=request.method,
            url=url,
            headers=headers,
            content=await request.body()
        )
        
        return JSONResponse(
            content=response.json() if response.headers.get("content-type") == "application/json" else response.text,
            status_code=response.status_code
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

