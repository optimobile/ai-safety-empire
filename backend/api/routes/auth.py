"""
Authentication routes - register, login, API keys
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from ...database.database import get_db
from ...database.schemas import (
    UserCreate, UserResponse, LoginRequest, Token,
    APIKeyCreate, APIKeyResponse, APIKeyWithSecret
)
from ...database.models import User
from ...utils.auth import (
    authenticate_user, create_access_token, create_user,
    get_current_user, create_api_key_for_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account
    """
    try:
        user = create_user(
            db=db,
            email=user_data.email,
            username=user_data.username,
            password=user_data.password,
            full_name=user_data.full_name
        )
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with username and password to get JWT token
    """
    user = authenticate_user(db, login_data.username, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "username": user.username},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    return current_user


@router.post("/api-keys", response_model=APIKeyWithSecret, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    api_key_data: APIKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new API key for the current user
    
    **Important**: The API key is only shown once. Save it securely!
    """
    try:
        api_key_obj, api_key_secret = create_api_key_for_user(
            db=db,
            user_id=current_user.id,
            name=api_key_data.name,
            description=api_key_data.description,
            rate_limit=api_key_data.rate_limit,
            expires_in_days=api_key_data.expires_in_days
        )
        
        # Return API key with secret (only time it's shown)
        response = APIKeyWithSecret(
            id=api_key_obj.id,
            name=api_key_obj.name,
            description=api_key_obj.description,
            rate_limit=api_key_obj.rate_limit,
            is_active=api_key_obj.is_active,
            created_at=api_key_obj.created_at,
            expires_at=api_key_obj.expires_at,
            last_used=api_key_obj.last_used,
            usage_count=api_key_obj.usage_count,
            api_key=api_key_secret
        )
        
        return response
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create API key: {str(e)}"
        )


@router.get("/api-keys", response_model=list[APIKeyResponse])
async def list_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all API keys for the current user
    """
    from ...database.models import APIKey
    
    api_keys = db.query(APIKey).filter(APIKey.user_id == current_user.id).all()
    return api_keys


@router.delete("/api-keys/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an API key
    """
    from ...database.models import APIKey
    
    api_key = db.query(APIKey).filter(
        APIKey.id == api_key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    db.delete(api_key)
    db.commit()
    
    return None

