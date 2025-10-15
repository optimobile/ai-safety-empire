"""
Main FastAPI application for AI Safety Empire
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import time
import os
from datetime import datetime

from database.database import init_db, engine
from database.models import Base
from blockchain.client import BlockchainClient
from api.routes import auth, users, platforms, decisions, health, blockchain

# Initialize blockchain client
import os
blockchain_client = BlockchainClient(
    rpc_url=os.getenv('BLOCKCHAIN_RPC_URL', 'http://localhost:8545'),
    logger_address=os.getenv('CONTRACT_ADDRESS_LOGGER'),
    governance_address=os.getenv('CONTRACT_ADDRESS_GOVERNANCE'),
    aegis_address=os.getenv('CONTRACT_ADDRESS_AEGIS'),
    jabulon_address=os.getenv('CONTRACT_ADDRESS_JABULON')
)

# Version
VERSION = "1.0.0"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events
    """
    # Startup
    print("🚀 Starting AI Safety Empire API...")
    print(f"📦 Version: {VERSION}")
    print(f"🌍 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    
    # Initialize database
    print("📊 Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized")
    
    # Check blockchain connection
    print("🔗 Checking blockchain connection...")
    if blockchain_client.is_connected():
        print(f"✅ Connected to blockchain: {blockchain_client.rpc_url}")
        print(f"   Chain ID: {blockchain_client.chain_id}")
        if blockchain_client.address:
            print(f"   Address: {blockchain_client.address}")
            balance = blockchain_client.get_balance()
            print(f"   Balance: {balance:.4f} MATIC")
    else:
        print("⚠️  Warning: Not connected to blockchain")
    
    print("✅ API is ready!")
    print()
    
    yield
    
    # Shutdown
    print("👋 Shutting down AI Safety Empire API...")


# Create FastAPI app
app = FastAPI(
    title="AI Safety Empire API",
    description="Universal API for AI safety, governance, and robotics compliance",
    version=VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware (production)
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=os.getenv("ALLOWED_HOSTS", "").split(",")
    )


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """
    Add processing time to response headers
    """
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}"
    return response


# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "body": exc.body,
            "timestamp": datetime.utcnow().isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle general exceptions
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": str(exc) if os.getenv("ENVIRONMENT") == "development" else "An error occurred",
            "timestamp": datetime.utcnow().isoformat()
        }
    )


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API information
    """
    return {
        "name": "AI Safety Empire API",
        "version": VERSION,
        "description": "Universal API for AI safety, governance, and robotics compliance",
        "documentation": "/docs",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "health": "/health",
            "auth": "/auth",
            "users": "/users",
            "platforms": "/platforms",
            "decisions": "/decisions",
            "governance": "/governance",
            "robots": "/robots"
        }
    }


# Include routers
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(platforms.router, prefix="/platforms", tags=["Platforms"])
app.include_router(decisions.router, prefix="/decisions", tags=["Decisions"])
app.include_router(blockchain.router, tags=["Blockchain"])


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("API_PORT", "8000"))
    host = os.getenv("API_HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level="info"
    )

