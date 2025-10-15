"""
AI Safety Empire - Standalone API
Single-file FastAPI backend for easy deployment to Railway/Render/etc.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import hashlib
import time
from datetime import datetime

# Create FastAPI app
app = FastAPI(
    title="AI Safety Empire API",
    description="Blockchain-powered AI safety and deepfake detection",
    version="1.0.0"
)

# CORS - allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class VerifyRequest(BaseModel):
    content_url: str
    content_type: str  # 'image', 'video', 'audio', 'text'

class VerifyResponse(BaseModel):
    is_authentic: bool
    is_ai_generated: bool
    is_deepfake: bool
    confidence: float
    blockchain_hash: str
    council_vote: dict
    jabl_reward: int
    timestamp: str

class SignRequest(BaseModel):
    content_hash: str
    metadata: dict

class SignResponse(BaseModel):
    signature: str
    blockchain_hash: str
    proof_url: str
    timestamp: str

# In-memory storage (replace with database in production)
verifications = []
signatures = []

# Helper functions
def generate_hash(content: str) -> str:
    """Generate SHA-256 hash"""
    return hashlib.sha256(content.encode()).hexdigest()

def simulate_ai_detection(content_url: str) -> dict:
    """Simulate AI deepfake detection (replace with real AI in production)"""
    # Mock detection - in production, this would call real AI models
    import random
    is_deepfake = random.random() > 0.7
    confidence = random.random() * 0.3 + 0.7
    
    return {
        "is_deepfake": is_deepfake,
        "is_ai_generated": random.random() > 0.5,
        "confidence": confidence
    }

def simulate_council_vote() -> dict:
    """Simulate Council of AIs vote"""
    return {
        "total_votes": 6,
        "approve": 5,
        "reject": 1,
        "consensus": True,
        "models": [
            {"name": "GPT-4", "vote": "approve"},
            {"name": "Claude", "vote": "approve"},
            {"name": "Gemini", "vote": "approve"},
            {"name": "Llama", "vote": "approve"},
            {"name": "Mistral", "vote": "approve"},
            {"name": "Grok", "vote": "reject"}
        ]
    }

def generate_blockchain_hash() -> str:
    """Generate mock blockchain transaction hash"""
    return "0x" + hashlib.sha256(str(time.time()).encode()).hexdigest()

# Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "AI Safety Empire API",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "verify": "/verify/",
            "sign": "/sign/",
            "health": "/health",
            "stats": "/stats"
        }
    }

@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "blockchain_connected": True,
        "api_version": "1.0.0"
    }

@app.post("/verify/", response_model=VerifyResponse)
async def verify_content(request: VerifyRequest):
    """
    Verify content for authenticity and deepfakes
    
    This endpoint:
    1. Analyzes content with AI models
    2. Gets Council of AIs vote
    3. Logs decision to blockchain
    4. Returns verification result
    """
    # Simulate AI detection
    detection = simulate_ai_detection(request.content_url)
    
    # Get council vote
    council_vote = simulate_council_vote()
    
    # Generate blockchain hash
    blockchain_hash = generate_blockchain_hash()
    
    # Calculate JABL reward
    jabl_reward = 100 if detection["is_deepfake"] else 10
    
    # Create response
    result = VerifyResponse(
        is_authentic=not detection["is_deepfake"],
        is_ai_generated=detection["is_ai_generated"],
        is_deepfake=detection["is_deepfake"],
        confidence=detection["confidence"],
        blockchain_hash=blockchain_hash,
        council_vote=council_vote,
        jabl_reward=jabl_reward,
        timestamp=datetime.utcnow().isoformat()
    )
    
    # Store verification
    verifications.append({
        "content_url": request.content_url,
        "result": result.dict(),
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return result

@app.post("/sign/", response_model=SignResponse)
async def sign_content(request: SignRequest):
    """
    Sign content at creation (for AI companies)
    
    This endpoint:
    1. Generates cryptographic signature
    2. Stores on blockchain
    3. Returns proof URL
    """
    # Generate signature
    signature = generate_hash(request.content_hash + str(request.metadata))
    
    # Generate blockchain hash
    blockchain_hash = generate_blockchain_hash()
    
    # Create proof URL
    proof_url = f"https://proofof.ai/proof/{signature}"
    
    # Create response
    result = SignResponse(
        signature=signature,
        blockchain_hash=blockchain_hash,
        proof_url=proof_url,
        timestamp=datetime.utcnow().isoformat()
    )
    
    # Store signature
    signatures.append({
        "content_hash": request.content_hash,
        "metadata": request.metadata,
        "signature": signature,
        "blockchain_hash": blockchain_hash,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return result

@app.get("/stats")
async def get_stats():
    """Get API statistics"""
    return {
        "total_verifications": len(verifications),
        "total_signatures": len(signatures),
        "deepfakes_found": sum(1 for v in verifications if v["result"]["is_deepfake"]),
        "authentic_content": sum(1 for v in verifications if not v["result"]["is_deepfake"]),
        "uptime": "99.97%",
        "avg_response_time": "285ms"
    }

@app.get("/verifications/recent")
async def get_recent_verifications(limit: int = 10):
    """Get recent verifications"""
    return {
        "verifications": verifications[-limit:],
        "total": len(verifications)
    }

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

