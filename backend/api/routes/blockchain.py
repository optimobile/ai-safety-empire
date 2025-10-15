"""
Blockchain verification routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from ...database.database import get_db
from ...database import models, schemas
from ...blockchain.client import BlockchainClient
from ...utils.auth import get_current_user
import os

router = APIRouter(prefix="/blockchain", tags=["blockchain"])

# Initialize blockchain client
blockchain_client = BlockchainClient(
    rpc_url=os.getenv("BLOCKCHAIN_RPC_URL", "http://localhost:8545"),
    logger_address=os.getenv("CONTRACT_ADDRESS_LOGGER"),
    governance_address=os.getenv("CONTRACT_ADDRESS_GOVERNANCE"),
    aegis_address=os.getenv("CONTRACT_ADDRESS_AEGIS"),
    jabulon_address=os.getenv("CONTRACT_ADDRESS_JABULON")
)


@router.get("/status")
async def get_blockchain_status():
    """
    Get blockchain connection status
    
    Returns:
        Connection status and network info
    """
    try:
        is_connected = blockchain_client.is_connected()
        chain_id = blockchain_client.get_chain_id() if is_connected else None
        block_number = blockchain_client.get_block_number() if is_connected else None
        
        return {
            "connected": is_connected,
            "chain_id": chain_id,
            "block_number": block_number,
            "network": os.getenv("BLOCKCHAIN_NETWORK", "unknown"),
            "contracts": {
                "logger": os.getenv("CONTRACT_ADDRESS_LOGGER"),
                "governance": os.getenv("CONTRACT_ADDRESS_GOVERNANCE"),
                "aegis": os.getenv("CONTRACT_ADDRESS_AEGIS"),
                "jabulon": os.getenv("CONTRACT_ADDRESS_JABULON")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain error: {str(e)}")


@router.post("/verify/{decision_id}")
async def verify_decision_on_blockchain(
    decision_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Verify a decision exists on the blockchain
    
    Args:
        decision_id: The decision ID to verify
    
    Returns:
        Verification result
    """
    # Get decision from database
    decision = db.query(models.AIDecision).filter(
        models.AIDecision.id == decision_id
    ).first()
    
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    
    if not decision.blockchain_hash:
        raise HTTPException(status_code=400, detail="Decision not yet on blockchain")
    
    try:
        # Verify on blockchain
        verified = blockchain_client.verify_transaction(decision.blockchain_hash)
        
        return {
            "decision_id": decision_id,
            "blockchain_hash": decision.blockchain_hash,
            "verified": verified,
            "timestamp": decision.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")


@router.post("/log-decision")
async def log_decision_to_blockchain(
    decision_data: schemas.DecisionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Log a decision to the blockchain
    
    Args:
        decision_data: Decision data to log
    
    Returns:
        Transaction hash and decision ID
    """
    try:
        # Create decision in database first
        db_decision = models.AIDecision(
            platform_id=decision_data.platform_id,
            decision_type=decision_data.decision_type,
            input_data=decision_data.input_data,
            output_data={},
            status="pending",
            created_by=current_user.id
        )
        db.add(db_decision)
        db.flush()
        
        # Log to blockchain
        decision_hash = blockchain_client.generate_decision_hash(
            str(db_decision.id),
            decision_data.decision_type,
            decision_data.input_data
        )
        
        tx_hash = blockchain_client.log_decision(
            decision_hash=decision_hash,
            ipfs_hash="QmPlaceholder",  # TODO: Upload to IPFS
            is_robot_decision=decision_data.decision_type == "robot_command"
        )
        
        # Update decision with blockchain hash
        db_decision.blockchain_hash = tx_hash
        db.commit()
        db.refresh(db_decision)
        
        return {
            "decision_id": str(db_decision.id),
            "blockchain_hash": tx_hash,
            "decision_hash": decision_hash,
            "status": "logged"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to log decision: {str(e)}")


@router.get("/tokens/aegis/balance/{address}")
async def get_aegis_balance(address: str):
    """
    Get AEGIS token balance for an address
    
    Args:
        address: Wallet address
    
    Returns:
        AEGIS balance
    """
    try:
        balance = blockchain_client.get_aegis_balance(address)
        return {
            "address": address,
            "balance": balance,
            "token": "AEGIS"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get balance: {str(e)}")


@router.get("/tokens/jabl/balance/{address}")
async def get_jabl_balance(address: str):
    """
    Get JabulonCoin balance for an address
    
    Args:
        address: Wallet address
    
    Returns:
        JABL balance
    """
    try:
        balance = blockchain_client.get_jabulon_balance(address)
        return {
            "address": address,
            "balance": balance,
            "token": "JABL"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get balance: {str(e)}")


@router.post("/tokens/jabl/convert")
async def convert_jabl_to_aegis(
    amount: float,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Convert JabulonCoin to AEGIS tokens
    
    Args:
        amount: Amount of JABL to convert
    
    Returns:
        Transaction details
    """
    if not current_user.wallet_address:
        raise HTTPException(status_code=400, detail="No wallet address linked")
    
    try:
        # Convert on blockchain
        tx_hash = blockchain_client.convert_jabl_to_aegis(
            amount=amount,
            from_address=current_user.wallet_address
        )
        
        return {
            "transaction_hash": tx_hash,
            "jabl_amount": amount,
            "aegis_amount": amount / 100,  # 100:1 conversion rate
            "status": "pending"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@router.get("/statistics")
async def get_blockchain_statistics():
    """
    Get blockchain statistics from AIDecisionLogger contract
    
    Returns:
        Statistics about decisions logged
    """
    try:
        stats = blockchain_client.get_decision_statistics()
        return {
            "total_decisions": stats[0],
            "total_approved": stats[1],
            "total_rejected": stats[2],
            "total_robot_decisions": stats[3],
            "active_platforms": stats[4]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

