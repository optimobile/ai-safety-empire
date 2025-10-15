"""
Platform management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...database.database import get_db
from ...database.schemas import (
    PlatformCreate, PlatformResponse, PlatformUpdate
)
from ...database.models import Platform, User
from ...utils.auth import get_current_user, get_current_admin_user

router = APIRouter()


@router.get("/", response_model=List[PlatformResponse])
async def list_platforms(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    List all platforms
    """
    query = db.query(Platform)
    
    if active_only:
        query = query.filter(Platform.is_active == True)
    
    platforms = query.offset(skip).limit(limit).all()
    return platforms


@router.get("/{platform_id}", response_model=PlatformResponse)
async def get_platform(
    platform_id: int,
    db: Session = Depends(get_db)
):
    """
    Get platform by ID
    """
    platform = db.query(Platform).filter(Platform.id == platform_id).first()
    
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    return platform


@router.post("/", response_model=PlatformResponse, status_code=status.HTTP_201_CREATED)
async def create_platform(
    platform_data: PlatformCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Create a new platform (admin only)
    """
    # Check if platform with same name or domain exists
    existing = db.query(Platform).filter(
        (Platform.name == platform_data.name) | 
        (Platform.domain == platform_data.domain)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Platform with this name or domain already exists"
        )
    
    # Create platform
    platform = Platform(**platform_data.dict())
    db.add(platform)
    db.commit()
    db.refresh(platform)
    
    return platform


@router.patch("/{platform_id}", response_model=PlatformResponse)
async def update_platform(
    platform_id: int,
    platform_update: PlatformUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update platform (admin only)
    """
    platform = db.query(Platform).filter(Platform.id == platform_id).first()
    
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    # Update fields
    update_data = platform_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(platform, field, value)
    
    db.commit()
    db.refresh(platform)
    
    return platform


@router.delete("/{platform_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_platform(
    platform_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a platform (admin only)
    """
    platform = db.query(Platform).filter(Platform.id == platform_id).first()
    
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found"
        )
    
    db.delete(platform)
    db.commit()
    
    return None

