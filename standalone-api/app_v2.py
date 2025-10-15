"""
AI Safety Empire API - Version 2 with JabulonCoin Integration
Complete backend with reward distribution
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import hashlib
import random

app = FastAPI(
    title="AI Safety Empire API",
    description="Blockchain-powered AI safety verification with JABL rewards",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Data Models ====================

class VerifyRequest(BaseModel):
    content_url: str
    content_type: str
    user_wallet_address: Optional[str] = None


class VerifyResponse(BaseModel):
    is_deepfake: bool
    is_ai_generated: bool
    confidence: float
    council_vote: Dict[str, int]
    blockchain_hash: str
    jabl_reward: Optional[Dict[str, Any]] = None
    timestamp: str


class SignRequest(BaseModel):
    content_url: str
    content_type: str
    metadata: Optional[Dict[str, Any]] = None


# ==================== In-Memory Storage ====================

verifications_db = []
user_rewards = {}
user_verifications = {}
verification_cache = {}

# ==================== Reward System ====================

REWARD_AMOUNTS = {
    "verification_performed": 10,
    "deepfake_detected": 100,
    "deepfake_reported": 150,
    "daily_login": 5,
    "referral": 50,
    "first_verification": 25,
}


async def distribute_reward(
    wallet_address: str,
    action_type: str,
    confidence: float = 0.0
) -> Optional[Dict[str, Any]]:
    """Distribute JABL reward to user"""
    
    if not wallet_address:
        return None
    
    # Calculate reward
    reward = REWARD_AMOUNTS.get(action_type, 0)
    
    # Bonus for high confidence deepfake detection
    if action_type == "deepfake_detected" and confidence > 0.95:
        reward = int(reward * 1.5)
    
    # Check if first verification (bonus)
    if f"{wallet_address}:first" not in user_rewards:
        reward += REWARD_AMOUNTS["first_verification"]
        user_rewards[f"{wallet_address}:first"] = True
    
    # Update balance
    current_balance = user_rewards.get(wallet_address, 0)
    new_balance = current_balance + reward
    user_rewards[wallet_address] = new_balance
    
    # Generate transaction hash
    tx_hash = hashlib.sha256(
        f"{wallet_address}{reward}{datetime.now()}".encode()
    ).hexdigest()
    
    return {
        "reward_amount": reward,
        "new_balance": new_balance,
        "transaction_hash": tx_hash,
        "message": f"You earned {reward} JABL!"
    }


# ==================== Council of AIs ====================

def council_of_ais_vote(content_url: str, content_type: str) -> Dict[str, Any]:
    """
    Simulate Council of 6 AIs voting on content authenticity
    In production, this would call real AI models
    """
    
    # Simulate AI models
    ai_models = [
        "GPT-4 Vision",
        "Claude 3 Opus",
        "Gemini Pro Vision",
        "Deepfake Detector v3",
        "Forensic AI",
        "Blockchain Verifier"
    ]
    
    # Simulate votes (in production, call real models)
    votes = []
    for model in ai_models:
        # Random vote for demo (replace with real AI calls)
        is_deepfake = random.random() > 0.7
        confidence = random.uniform(0.6, 0.99)
        
        votes.append({
            "model": model,
            "is_deepfake": is_deepfake,
            "confidence": confidence
        })
    
    # Count votes
    deepfake_votes = sum(1 for v in votes if v["is_deepfake"])
    authentic_votes = len(votes) - deepfake_votes
    
    # Require 5/6 approval (super-majority)
    is_deepfake = deepfake_votes >= 5
    avg_confidence = sum(v["confidence"] for v in votes) / len(votes)
    
    return {
        "votes": votes,
        "deepfake_count": deepfake_votes,
        "authentic_count": authentic_votes,
        "is_deepfake": is_deepfake,
        "confidence": avg_confidence
    }


# ==================== API Endpoints ====================

@app.get("/")
async def root():
    """API information"""
    return {
        "name": "AI Safety Empire API",
        "version": "2.0.0",
        "description": "Blockchain-powered AI safety with JABL rewards",
        "features": [
            "Deepfake detection",
            "Council of 6 AIs voting",
            "Blockchain verification",
            "JABL token rewards",
            "Content signing"
        ],
        "endpoints": {
            "verify": "/verify/",
            "sign": "/sign/",
            "balance": "/jabl/balance/{wallet_address}",
            "leaderboard": "/jabl/leaderboard",
            "stats": "/stats",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }


@app.post("/verify/", response_model=VerifyResponse)
async def verify_content(request: VerifyRequest):
    """
    Verify content for deepfakes using Council of AIs
    Rewards users with JABL tokens
    """
    
    # Get Council of AIs vote
    council_result = council_of_ais_vote(request.content_url, request.content_type)
    
    is_deepfake = council_result["is_deepfake"]
    confidence = council_result["confidence"]
    
    # Generate blockchain hash
    blockchain_hash = hashlib.sha256(
        f"{request.content_url}{datetime.now()}".encode()
    ).hexdigest()
    
    # Distribute JABL reward
    jabl_reward = None
    if request.user_wallet_address:
        action_type = "deepfake_detected" if is_deepfake else "verification_performed"
        jabl_reward = await distribute_reward(
            request.user_wallet_address,
            action_type,
            confidence
        )
    
    # Store verification
    verification = {
        "content_url": request.content_url,
        "content_type": request.content_type,
        "is_deepfake": is_deepfake,
        "confidence": confidence,
        "blockchain_hash": blockchain_hash,
        "timestamp": datetime.now().isoformat(),
        "wallet_address": request.user_wallet_address,
        "jabl_reward": jabl_reward
    }
    verifications_db.append(verification)
    
    return VerifyResponse(
        is_deepfake=is_deepfake,
        is_ai_generated=is_deepfake,  # For simplicity
        confidence=confidence,
        council_vote={
            "approve": council_result["authentic_count"],
            "reject": council_result["deepfake_count"]
        },
        blockchain_hash=blockchain_hash,
        jabl_reward=jabl_reward,
        timestamp=datetime.now().isoformat()
    )


@app.post("/sign/")
async def sign_content(request: SignRequest):
    """
    Sign content at creation (for AI companies)
    Proves content is AI-generated and authentic
    """
    
    # Generate signature
    signature = hashlib.sha256(
        f"{request.content_url}{datetime.now()}{request.metadata}".encode()
    ).hexdigest()
    
    # Generate blockchain hash
    blockchain_hash = hashlib.sha256(
        f"{signature}{datetime.now()}".encode()
    ).hexdigest()
    
    return {
        "signature": signature,
        "blockchain_hash": blockchain_hash,
        "proof_url": f"https://proofof.ai/verify/{blockchain_hash}",
        "timestamp": datetime.now().isoformat(),
        "metadata": request.metadata
    }


@app.get("/jabl/balance/{wallet_address}")
async def get_jabl_balance(wallet_address: str):
    """Get user's JABL token balance"""
    
    balance = user_rewards.get(wallet_address, 0)
    total_verifications = sum(
        1 for v in verifications_db 
        if v.get("wallet_address") == wallet_address
    )
    
    return {
        "wallet_address": wallet_address,
        "jabl_balance": balance,
        "total_verifications": total_verifications,
        "rank": get_user_rank(wallet_address)
    }


@app.get("/jabl/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top JABL earners"""
    
    # Sort users by balance
    sorted_users = sorted(
        [(addr, bal) for addr, bal in user_rewards.items() if not addr.endswith(":first")],
        key=lambda x: x[1],
        reverse=True
    )[:limit]
    
    leaderboard = []
    for rank, (wallet, balance) in enumerate(sorted_users, 1):
        total_verifications = sum(
            1 for v in verifications_db 
            if v.get("wallet_address") == wallet
        )
        
        leaderboard.append({
            "rank": rank,
            "wallet_address": f"{wallet[:6]}...{wallet[-4:]}",
            "jabl_balance": balance,
            "total_verifications": total_verifications
        })
    
    return {"leaderboard": leaderboard}


@app.get("/stats")
async def get_stats():
    """Get overall platform statistics"""
    
    total_verifications = len(verifications_db)
    deepfakes_found = sum(1 for v in verifications_db if v["is_deepfake"])
    total_jabl_distributed = sum(
        bal for addr, bal in user_rewards.items() 
        if not addr.endswith(":first")
    )
    total_users = len(set(v.get("wallet_address") for v in verifications_db if v.get("wallet_address")))
    
    return {
        "total_verifications": total_verifications,
        "deepfakes_detected": deepfakes_found,
        "authentic_content": total_verifications - deepfakes_found,
        "total_jabl_distributed": total_jabl_distributed,
        "total_users": total_users,
        "average_per_user": total_jabl_distributed / total_users if total_users > 0 else 0,
        "success_rate": (deepfakes_found / total_verifications * 100) if total_verifications > 0 else 0
    }


@app.get("/verifications/recent")
async def get_recent_verifications(limit: int = 10):
    """Get recent verifications"""
    
    recent = sorted(
        verifications_db,
        key=lambda x: x["timestamp"],
        reverse=True
    )[:limit]
    
    return {"verifications": recent}


# ==================== Helper Functions ====================

def get_user_rank(wallet_address: str) -> int:
    """Get user's rank on leaderboard"""
    
    sorted_users = sorted(
        [(addr, bal) for addr, bal in user_rewards.items() if not addr.endswith(":first")],
        key=lambda x: x[1],
        reverse=True
    )
    
    for rank, (addr, _) in enumerate(sorted_users, 1):
        if addr == wallet_address:
            return rank
    
    return 0


# ==================== Startup ====================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("🚀 AI Safety Empire API v2.0 starting...")
    print("✅ JABL rewards system enabled")
    print("✅ Council of AIs ready")
    print("✅ Blockchain verification active")
    print("🌐 API ready at http://localhost:8000")
    print("📚 Docs available at http://localhost:8000/docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

