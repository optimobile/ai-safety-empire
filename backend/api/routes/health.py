"""
Health check endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import os

from ...database.database import get_db
from ...database.schemas import HealthCheck
from ...blockchain.client import get_blockchain_client, BlockchainClient

router = APIRouter()


@router.get("/", response_model=HealthCheck)
async def health_check(
    db: Session = Depends(get_db),
    blockchain: BlockchainClient = Depends(get_blockchain_client)
):
    """
    Comprehensive health check for all services
    """
    # Check database
    try:
        db.execute("SELECT 1")
        database_status = "healthy"
    except Exception as e:
        database_status = f"unhealthy: {str(e)}"
    
    # Check Redis (placeholder - implement when Redis is added)
    redis_status = "not_configured"
    
    # Check blockchain
    try:
        if blockchain.is_connected():
            blockchain_status = "healthy"
        else:
            blockchain_status = "disconnected"
    except Exception as e:
        blockchain_status = f"unhealthy: {str(e)}"
    
    # Overall status
    if database_status == "healthy" and blockchain_status == "healthy":
        overall_status = "healthy"
    else:
        overall_status = "degraded"
    
    return HealthCheck(
        status=overall_status,
        timestamp=datetime.utcnow(),
        database=database_status,
        redis=redis_status,
        blockchain=blockchain_status,
        version=os.getenv("VERSION", "1.0.0")
    )


@router.get("/database")
async def database_health(db: Session = Depends(get_db)):
    """
    Check database health
    """
    try:
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }


@router.get("/blockchain")
async def blockchain_health(blockchain: BlockchainClient = Depends(get_blockchain_client)):
    """
    Check blockchain connection health
    """
    try:
        connected = blockchain.is_connected()
        
        if not connected:
            return {
                "status": "disconnected",
                "timestamp": datetime.utcnow().isoformat()
            }
        
        # Get additional info
        stats = blockchain.get_statistics()
        balance = blockchain.get_balance() if blockchain.address else None
        
        return {
            "status": "healthy",
            "connected": True,
            "rpc_url": blockchain.rpc_url,
            "chain_id": blockchain.chain_id,
            "address": blockchain.address,
            "balance_matic": balance,
            "statistics": stats,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }


@router.get("/ping")
async def ping():
    """
    Simple ping endpoint
    """
    return {
        "ping": "pong",
        "timestamp": datetime.utcnow().isoformat()
    }

