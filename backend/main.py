"""
Minimal FastAPI app for Railway deployment
This ensures the app starts successfully
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os

app = FastAPI(
    title="AI Safety Empire API",
    description="Council of 13 AIs - Democratic AI Governance System",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Will restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Safety Empire API",
        "status": "operational",
        "version": "1.0.0",
        "council": "13 AIs ready",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health():
    """Health check endpoint for Railway"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "production"),
        "council_status": "operational"
    }

@app.get("/api/v1/council/status")
async def council_status():
    """Get Council of 13 AIs status"""
    return {
        "council_members": 13,
        "status": "operational",
        "ais": [
            {"name": "The Orchestrator", "platform": "councilof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Deepfake Detector", "platform": "proofof.ai", "model": "Gemini", "status": "ready"},
            {"name": "Security Guardian", "platform": "asisecurity.ai", "model": "GPT-4", "status": "ready"},
            {"name": "AGI Safety Monitor", "platform": "agisafe.ai", "model": "Claude", "status": "ready"},
            {"name": "Mental Health Guardian", "platform": "suicidestop.ai", "model": "Claude", "status": "ready"},
            {"name": "Transparency Enforcer", "platform": "transparencyof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Ethics Auditor", "platform": "ethicalgovernanceof.ai", "model": "Claude", "status": "ready"},
            {"name": "Safety Validator", "platform": "safetyof.ai", "model": "Gemini", "status": "ready"},
            {"name": "Accountability Tracker", "platform": "accountabilityof.ai", "model": "GPT-4", "status": "ready"},
            {"name": "Bias Detector", "platform": "biasdetectionof.ai", "model": "Gemini", "status": "ready"},
            {"name": "Privacy Guardian", "platform": "dataprivacyof.ai", "model": "Claude", "status": "ready"},
            {"name": "The Lawgiver (Jabulon)", "platform": "jabulon.ai", "model": "Gemini", "status": "ready", "veto_power": True},
            {"name": "Election Guardian", "platform": "electionsafety.ai", "model": "Gemini", "status": "ready"}
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))

