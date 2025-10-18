"""
Full FastAPI Application with Council of 13 AIs Integration
Production-ready backend for AI Safety Empire
"""
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

# Import Council
from council.council_of_12_ais import CouncilOf12AIs

# Initialize FastAPI
app = FastAPI(
    title="AI Safety Empire API",
    description="Council of 13 AIs - Democratic AI Governance System",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
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
        "http://localhost:3000",
        "http://localhost:5173",
        "*"  # Allow all for now, restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Council (singleton)
council = None

def get_council():
    """Get or create Council instance"""
    global council
    if council is None:
        council = CouncilOf12AIs()
    return council


# Pydantic Models
class DecisionRequest(BaseModel):
    """Request model for Council voting"""
    type: str = Field(..., description="Decision type: content_verification, agi_deployment, policy_change, etc.")
    description: str = Field(..., description="What is being decided")
    context: Optional[str] = Field(None, description="Additional context")
    requester: Optional[str] = Field("anonymous", description="Who is requesting the decision")

class DecisionResponse(BaseModel):
    """Response model for Council voting"""
    approved: bool
    reason: str
    consensus: str
    yes_votes: int
    no_votes: int
    abstain_votes: int
    has_veto: bool
    blockchain_hash: str
    timestamp: str
    votes: Dict[str, Any]

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    environment: str
    council_status: str
    api_keys_configured: Dict[str, bool]

class CouncilStatusResponse(BaseModel):
    """Council status response"""
    council_members: int
    status: str
    ais: List[Dict[str, Any]]
    timestamp: str


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Safety Empire API",
        "status": "operational",
        "version": "2.0.0",
        "council": "13 AIs ready",
        "timestamp": datetime.utcnow().isoformat(),
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "council_status": "/api/v1/council/status",
            "council_vote": "/api/v1/council/vote"
        }
    }


# Health check
@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint for Railway"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "production"),
        "council_status": "operational",
        "api_keys_configured": {
            "openai": bool(os.getenv("OPENAI_API_KEY")),
            "anthropic": bool(os.getenv("ANTHROPIC_API_KEY")),
            "gemini": bool(os.getenv("GEMINI_API_KEY"))
        }
    }


# Council Status
@app.get("/api/v1/council/status", response_model=CouncilStatusResponse)
async def council_status():
    """Get Council of 13 AIs status"""
    return {
        "council_members": 12,
        "status": "operational",
        "ais": [
            {"name": "The Orchestrator", "platform": "councilof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Deepfake Detector", "platform": "proofof.ai", "model": "Gemini", "status": "ready"},
            {"name": "Security Guardian", "platform": "asisecurity.ai", "model": "GPT-4", "status": "ready"},
            {"name": "AGI Safety Monitor", "platform": "agisafe.ai", "model": "Claude", "status": "ready"},
            {"name": "Mental Health Guardian", "platform": "suicidestop.ai", "model": "Claude", "status": "ready"},
            {"name": "Transparency Advocate", "platform": "transparencyof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Ethics Philosopher", "platform": "ethicalgovernanceof.ai", "model": "Claude", "status": "ready"},
            {"name": "Safety First", "platform": "safetyof.ai", "model": "Claude", "status": "ready"},
            {"name": "Accountability Enforcer", "platform": "accountabilityof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Bias Detector", "platform": "biasdetectionof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Privacy Protector", "platform": "dataprivacyof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Jabulon's Law Enforcer", "platform": "jabulon.ai", "model": "GPT-4", "status": "ready", "veto_power": True}
        ],
        "timestamp": datetime.utcnow().isoformat()
    }


# Council Vote Endpoint
@app.post("/api/v1/council/vote", response_model=DecisionResponse)
async def council_vote(decision: DecisionRequest):
    """
    Submit a decision to the Council of 13 AIs for democratic voting
    
    Requires 10/12 supermajority approval.
    Jabulon can veto if Three Laws violated.
    """
    try:
        # Get council instance
        council_instance = get_council()
        
        # Convert request to dict
        decision_dict = {
            "type": decision.type,
            "description": decision.description,
            "context": decision.context or "No additional context provided",
            "requester": decision.requester or "anonymous"
        }
        
        # Submit to council for voting
        result = await council_instance.vote(decision_dict)
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Council voting failed: {str(e)}"
        )


# Test endpoint (for development)
@app.post("/api/v1/council/test")
async def council_test():
    """Test the Council with a simple decision"""
    try:
        council_instance = get_council()
        
        test_decision = {
            "type": "test",
            "description": "Test decision to verify Council is operational",
            "context": "This is a test from the API endpoint",
            "requester": "api_test"
        }
        
        result = await council_instance.vote(test_decision)
        
        return {
            "success": True,
            "message": "Council test completed",
            "result": result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Council test failed: {str(e)}"
        )


# Deepfake Detection Endpoint (for proofof.ai)
@app.post("/api/v1/deepfake/verify")
async def verify_deepfake(
    image_url: Optional[str] = None,
    video_url: Optional[str] = None,
    audio_url: Optional[str] = None
):
    """
    Verify if content is a deepfake
    Uses the Council's Deepfake Detector AI
    """
    if not any([image_url, video_url, audio_url]):
        raise HTTPException(
            status_code=400,
            detail="Must provide at least one media URL"
        )
    
    # Create decision for Council
    media_type = "image" if image_url else "video" if video_url else "audio"
    media_url = image_url or video_url or audio_url
    
    decision = {
        "type": "content_verification",
        "description": f"Verify authenticity of {media_type} content",
        "context": f"Media URL: {media_url}. Check for manipulation, deepfake indicators, and authenticity.",
        "requester": "proofof.ai"
    }
    
    try:
        council_instance = get_council()
        result = await council_instance.vote(decision)
        
        return {
            "is_authentic": result["approved"],
            "confidence": result["yes_votes"] / 12 * 100,
            "analysis": result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Deepfake verification failed: {str(e)}"
        )


# Security Check Endpoint (for asisecurity.ai)
@app.post("/api/v1/security/check")
async def security_check(
    action: str,
    description: str,
    context: Optional[str] = None
):
    """
    Security check for actions
    Uses the Council's Security Guardian AI
    """
    decision = {
        "type": "security_check",
        "description": f"Security check: {action} - {description}",
        "context": context or "No additional context",
        "requester": "asisecurity.ai"
    }
    
    try:
        council_instance = get_council()
        result = await council_instance.vote(decision)
        
        return {
            "is_safe": result["approved"],
            "security_score": result["yes_votes"] / 12 * 100,
            "analysis": result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Security check failed: {str(e)}"
        )


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize Council on startup"""
    global council
    try:
        print("🚀 Starting AI Safety Empire API...")
        print("🏛️ Initializing Council of 13 AIs...")
        council = CouncilOf12AIs()
        print("✅ Council initialized successfully!")
    except Exception as e:
        print(f"⚠️ Warning: Council initialization failed: {e}")
        print("   Council will be initialized on first request")


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

