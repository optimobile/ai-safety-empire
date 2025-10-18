"""
Main entry point for Railway deployment
Simplified to avoid path issues
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import the app
from backend.app import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🚀 Starting AI Safety Empire on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")

