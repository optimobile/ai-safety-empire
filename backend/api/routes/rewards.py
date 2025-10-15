"""
JabulonCoin Reward Distribution System
Handles JABL token rewards for user actions
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import hashlib

router = APIRouter(prefix="/rewards", tags=["rewards"])

# Reward amounts (in JABL tokens)
REWARD_AMOUNTS = {
    "verification_performed": 10,
    "deepfake_detected": 100,
    "deepfake_reported": 150,
    "daily_login": 5,
    "referral": 50,
    "first_verification": 25,
    "milestone_10": 50,
    "milestone_100": 500,
    "milestone_1000": 5000,
}

# In-memory storage (replace with database in production)
user_verifications = {}
user_rewards = {}
verification_cache = {}


class RewardRequest(BaseModel):
    user_wallet_address: str
    action_type: str
    metadata: Optional[Dict[str, Any]] = None


class RewardResponse(BaseModel):
    success: bool
    reward_amount: int
    total_balance: int
    transaction_hash: Optional[str] = None
    message: str


async def check_rate_limit(wallet_address: str, action_type: str) -> bool:
    """Check if user has exceeded rate limits"""
    key = f"{wallet_address}:{action_type}:{datetime.now().date()}"
    
    if key not in user_verifications:
        user_verifications[key] = 0
    
    # Rate limits per action type
    limits = {
        "verification_performed": 50,  # Max 50 verifications per day
        "deepfake_reported": 20,       # Max 20 reports per day
        "daily_login": 1,              # Once per day
    }
    
    limit = limits.get(action_type, 100)
    
    if user_verifications[key] >= limit:
        return False
    
    user_verifications[key] += 1
    return True


async def check_duplicate(content_hash: str, wallet_address: str) -> bool:
    """Check if this content was already verified by this user"""
    key = f"{content_hash}:{wallet_address}"
    return key in verification_cache


async def calculate_reward(
    wallet_address: str,
    action_type: str,
    metadata: Optional[Dict[str, Any]] = None
) -> int:
    """Calculate reward amount based on action and user history"""
    
    # Base reward
    reward = REWARD_AMOUNTS.get(action_type, 0)
    
    if reward == 0:
        return 0
    
    # Bonus for first-time action
    user_key = f"{wallet_address}:first_{action_type}"
    if user_key not in user_rewards:
        reward += REWARD_AMOUNTS.get("first_verification", 0)
        user_rewards[user_key] = True
    
    # Milestone bonuses
    total_verifications = user_verifications.get(f"{wallet_address}:total", 0)
    
    if total_verifications == 10:
        reward += REWARD_AMOUNTS["milestone_10"]
    elif total_verifications == 100:
        reward += REWARD_AMOUNTS["milestone_100"]
    elif total_verifications == 1000:
        reward += REWARD_AMOUNTS["milestone_1000"]
    
    # Confidence-based multiplier for deepfake detection
    if action_type == "deepfake_detected" and metadata:
        confidence = metadata.get("confidence", 0)
        if confidence > 0.95:
            reward = int(reward * 1.5)  # 50% bonus for high confidence
    
    return reward


@router.post("/distribute", response_model=RewardResponse)
async def distribute_reward(request: RewardRequest):
    """
    Distribute JABL tokens as reward for user action
    """
    
    # Validate wallet address
    if not request.user_wallet_address.startswith("0x"):
        raise HTTPException(400, "Invalid wallet address")
    
    # Check rate limits
    if not await check_rate_limit(request.user_wallet_address, request.action_type):
        return RewardResponse(
            success=False,
            reward_amount=0,
            total_balance=user_rewards.get(request.user_wallet_address, 0),
            message="Daily limit reached for this action"
        )
    
    # Check for duplicates (for verifications)
    if request.action_type == "verification_performed" and request.metadata:
        content_hash = request.metadata.get("content_hash")
        if content_hash and await check_duplicate(content_hash, request.user_wallet_address):
            return RewardResponse(
                success=False,
                reward_amount=0,
                total_balance=user_rewards.get(request.user_wallet_address, 0),
                message="Content already verified by this wallet"
            )
        
        # Cache this verification
        if content_hash:
            verification_cache[f"{content_hash}:{request.user_wallet_address}"] = True
    
    # Calculate reward
    reward_amount = await calculate_reward(
        request.user_wallet_address,
        request.action_type,
        request.metadata
    )
    
    if reward_amount == 0:
        return RewardResponse(
            success=False,
            reward_amount=0,
            total_balance=user_rewards.get(request.user_wallet_address, 0),
            message="No reward for this action"
        )
    
    # Update user balance (in production, this would call blockchain)
    current_balance = user_rewards.get(request.user_wallet_address, 0)
    new_balance = current_balance + reward_amount
    user_rewards[request.user_wallet_address] = new_balance
    
    # Update total verifications
    total_key = f"{request.user_wallet_address}:total"
    user_verifications[total_key] = user_verifications.get(total_key, 0) + 1
    
    # In production, this would call blockchain to transfer JABL
    # tx_hash = blockchain.transfer_jabl(request.user_wallet_address, reward_amount)
    tx_hash = hashlib.sha256(
        f"{request.user_wallet_address}{reward_amount}{datetime.now()}".encode()
    ).hexdigest()
    
    return RewardResponse(
        success=True,
        reward_amount=reward_amount,
        total_balance=new_balance,
        transaction_hash=tx_hash,
        message=f"You earned {reward_amount} JABL!"
    )


@router.get("/balance/{wallet_address}")
async def get_balance(wallet_address: str):
    """Get user's JABL token balance"""
    
    balance = user_rewards.get(wallet_address, 0)
    total_verifications = user_verifications.get(f"{wallet_address}:total", 0)
    
    return {
        "wallet_address": wallet_address,
        "jabl_balance": balance,
        "total_verifications": total_verifications,
        "next_milestone": get_next_milestone(total_verifications),
    }


@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top JABL earners"""
    
    # Sort users by balance
    sorted_users = sorted(
        user_rewards.items(),
        key=lambda x: x[1],
        reverse=True
    )[:limit]
    
    leaderboard = []
    for rank, (wallet, balance) in enumerate(sorted_users, 1):
        leaderboard.append({
            "rank": rank,
            "wallet_address": f"{wallet[:6]}...{wallet[-4:]}",
            "jabl_balance": balance,
            "total_verifications": user_verifications.get(f"{wallet}:total", 0)
        })
    
    return {"leaderboard": leaderboard}


@router.get("/stats")
async def get_reward_stats():
    """Get overall reward statistics"""
    
    total_distributed = sum(user_rewards.values())
    total_users = len(user_rewards)
    total_verifications = sum(
        v for k, v in user_verifications.items() if k.endswith(":total")
    )
    
    return {
        "total_jabl_distributed": total_distributed,
        "total_users": total_users,
        "total_verifications": total_verifications,
        "average_per_user": total_distributed / total_users if total_users > 0 else 0,
    }


def get_next_milestone(current_count: int) -> Dict[str, Any]:
    """Get information about next milestone"""
    
    milestones = [
        (10, REWARD_AMOUNTS["milestone_10"]),
        (100, REWARD_AMOUNTS["milestone_100"]),
        (1000, REWARD_AMOUNTS["milestone_1000"]),
    ]
    
    for count, reward in milestones:
        if current_count < count:
            return {
                "count": count,
                "reward": reward,
                "remaining": count - current_count
            }
    
    return {
        "count": None,
        "reward": None,
        "remaining": None,
        "message": "All milestones achieved!"
    }

