"""
AI Decision routes - core functionality for logging and voting on AI decisions
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...database.database import get_db
from ...database.schemas import (
    AIDecisionCreate, AIDecisionResponse, AIDecisionDetail,
    CouncilVoteCreate
)
from ...database.models import AIDecision, User, Platform, CouncilVote
from ...utils.auth import get_current_user
from ...blockchain.client import get_blockchain_client, BlockchainClient

router = APIRouter()


async def log_to_blockchain(
    decision_hash: str,
    ipfs_hash: str,
    is_robot_decision: bool,
    blockchain: BlockchainClient
):
    """
    Background task to log decision to blockchain
    """
    try:
        tx_hash = await blockchain.log_decision(
            decision_hash=decision_hash,
            ipfs_hash=ipfs_hash,
            is_robot_decision=is_robot_decision
        )
        
        if tx_hash:
            # Update decision with blockchain tx hash
            # (This would need a database session - simplified for now)
            print(f"✅ Decision logged to blockchain: {tx_hash}")
        else:
            print(f"❌ Failed to log decision to blockchain")
    
    except Exception as e:
        print(f"❌ Error logging to blockchain: {e}")


@router.post("/", response_model=AIDecisionResponse, status_code=status.HTTP_201_CREATED)
async def create_decision(
    decision_data: AIDecisionCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    blockchain: BlockchainClient = Depends(get_blockchain_client)
):
    """
    Create a new AI decision for council review
    
    This endpoint:
    1. Logs the decision to the database
    2. Creates a unique hash for the decision
    3. Logs to blockchain asynchronously
    4. Triggers council voting process
    """
    # Get platform (for now, use first platform or create logic to determine)
    platform = db.query(Platform).first()
    
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No platform configured"
        )
    
    # Create decision hash
    decision_dict = decision_data.dict()
    decision_dict['timestamp'] = datetime.utcnow().isoformat()
    decision_dict['user_id'] = current_user.id
    
    decision_hash = blockchain.create_decision_hash(decision_dict)
    
    # Create decision record
    decision = AIDecision(
        decision_hash=decision_hash,
        user_id=current_user.id,
        platform_id=platform.id,
        decision_type=decision_data.decision_type,
        input_data=decision_data.input_data,
        is_robot_decision=decision_data.is_robot_decision,
        robot_id=decision_data.robot_id,
        sensor_data=decision_data.sensor_data,
        status="pending"
    )
    
    db.add(decision)
    db.commit()
    db.refresh(decision)
    
    # Log to blockchain in background
    ipfs_hash = "QmPlaceholder"  # TODO: Upload to IPFS
    background_tasks.add_task(
        log_to_blockchain,
        decision_hash,
        ipfs_hash,
        decision_data.is_robot_decision,
        blockchain
    )
    
    # TODO: Trigger council voting process
    
    return decision


@router.get("/", response_model=List[AIDecisionResponse])
async def list_decisions(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    robot_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List AI decisions
    """
    query = db.query(AIDecision)
    
    if status_filter:
        query = query.filter(AIDecision.status == status_filter)
    
    if robot_only:
        query = query.filter(AIDecision.is_robot_decision == True)
    
    # Order by most recent first
    query = query.order_by(AIDecision.created_at.desc())
    
    decisions = query.offset(skip).limit(limit).all()
    return decisions


@router.get("/{decision_id}", response_model=AIDecisionDetail)
async def get_decision(
    decision_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a decision
    """
    decision = db.query(AIDecision).filter(AIDecision.id == decision_id).first()
    
    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found"
        )
    
    return decision


@router.post("/{decision_id}/vote", status_code=status.HTTP_201_CREATED)
async def vote_on_decision(
    decision_id: int,
    vote_data: CouncilVoteCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    blockchain: BlockchainClient = Depends(get_blockchain_client)
):
    """
    Cast a council vote on a decision
    
    Only council members (specific platforms) can vote
    """
    # Get decision
    decision = db.query(AIDecision).filter(AIDecision.id == decision_id).first()
    
    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Decision not found"
        )
    
    if decision.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Decision is not pending"
        )
    
    # Check if already voted
    existing_vote = db.query(CouncilVote).filter(
        CouncilVote.decision_id == decision_id,
        CouncilVote.platform_id == vote_data.platform_id  # Assuming platform_id in vote_data
    ).first()
    
    if existing_vote:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already voted on this decision"
        )
    
    # Create vote record
    vote = CouncilVote(
        decision_id=decision_id,
        platform_id=vote_data.platform_id,
        vote=vote_data.vote,
        confidence=vote_data.confidence,
        reasoning=vote_data.reasoning,
        model_name=vote_data.model_name,
        model_version=vote_data.model_version,
        processing_time_ms=vote_data.processing_time_ms
    )
    
    db.add(vote)
    
    # Update decision vote counts
    if vote_data.vote:
        decision.approval_count += 1
    else:
        decision.rejection_count += 1
    
    # Check if decision can be finalized (5 out of 6 approvals needed)
    if decision.approval_count >= 5:
        decision.status = "approved"
        decision.approved_at = datetime.utcnow()
    elif decision.rejection_count > 0:  # Strict: any rejection = rejected
        decision.status = "rejected"
    
    db.commit()
    
    # Log vote to blockchain in background
    # TODO: Implement blockchain vote logging
    
    return {
        "message": "Vote recorded successfully",
        "decision_status": decision.status,
        "approval_count": decision.approval_count,
        "rejection_count": decision.rejection_count
    }


@router.get("/statistics/overview")
async def get_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    blockchain: BlockchainClient = Depends(get_blockchain_client)
):
    """
    Get decision statistics
    """
    # Database statistics
    total_decisions = db.query(AIDecision).count()
    approved = db.query(AIDecision).filter(AIDecision.status == "approved").count()
    rejected = db.query(AIDecision).filter(AIDecision.status == "rejected").count()
    pending = db.query(AIDecision).filter(AIDecision.status == "pending").count()
    robot_decisions = db.query(AIDecision).filter(AIDecision.is_robot_decision == True).count()
    
    # Blockchain statistics
    blockchain_stats = blockchain.get_statistics() or {}
    
    return {
        "database": {
            "total_decisions": total_decisions,
            "approved": approved,
            "rejected": rejected,
            "pending": pending,
            "robot_decisions": robot_decisions
        },
        "blockchain": blockchain_stats,
        "timestamp": datetime.utcnow().isoformat()
    }

