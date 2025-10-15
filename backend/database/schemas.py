"""
Pydantic schemas for request/response validation
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, validator
from enum import Enum


# Enums
class UserRoleEnum(str, Enum):
    ADMIN = "admin"
    PLATFORM_OWNER = "platform_owner"
    DEVELOPER = "developer"
    AUDITOR = "auditor"
    USER = "user"


class DecisionStatusEnum(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CONDITIONAL = "conditional"
    EXECUTED = "executed"
    FAILED = "failed"


class PlatformTypeEnum(str, Enum):
    GOD_LAYER = "god_layer"
    GOVERNANCE = "governance"
    AI_SAFETY = "ai_safety"
    ROBOTICS_SAFETY = "robotics_safety"
    VERIFICATION = "verification"
    MONITORING = "monitoring"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = None
    wallet_address: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    wallet_address: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: UserRoleEnum
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# API Key Schemas
class APIKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    rate_limit: int = Field(default=1000, ge=1, le=100000)
    allowed_platforms: Optional[List[int]] = None
    expires_in_days: Optional[int] = Field(default=365, ge=1, le=3650)


class APIKeyResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    rate_limit: int
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime]
    last_used: Optional[datetime]
    usage_count: int
    
    class Config:
        from_attributes = True


class APIKeyWithSecret(APIKeyResponse):
    api_key: str  # Only returned once on creation


# Platform Schemas
class PlatformBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    domain: str
    platform_type: PlatformTypeEnum
    description: Optional[str] = None


class PlatformCreate(PlatformBase):
    api_endpoint: Optional[str] = None
    webhook_url: Optional[str] = None
    config: Optional[Dict[str, Any]] = None


class PlatformUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    api_endpoint: Optional[str] = None
    webhook_url: Optional[str] = None
    config: Optional[Dict[str, Any]] = None


class PlatformResponse(PlatformBase):
    id: int
    is_active: bool
    api_endpoint: Optional[str]
    contract_address: Optional[str]
    wallet_address: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# AI Decision Schemas
class AIDecisionCreate(BaseModel):
    decision_type: str
    input_data: Dict[str, Any]
    is_robot_decision: bool = False
    robot_id: Optional[str] = None
    sensor_data: Optional[Dict[str, Any]] = None


class CouncilVoteData(BaseModel):
    platform_name: str
    vote: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    model_name: str
    processing_time_ms: int


class AIDecisionResponse(BaseModel):
    id: int
    decision_hash: str
    decision_type: str
    status: DecisionStatusEnum
    approval_count: int
    rejection_count: int
    is_robot_decision: bool
    robot_id: Optional[str]
    blockchain_tx_hash: Optional[str]
    ipfs_hash: Optional[str]
    created_at: datetime
    approved_at: Optional[datetime]
    executed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class AIDecisionDetail(AIDecisionResponse):
    input_data: Dict[str, Any]
    output_data: Optional[Dict[str, Any]]
    council_votes: Optional[List[Dict[str, Any]]]
    sensor_data: Optional[Dict[str, Any]]


# Council Vote Schemas
class CouncilVoteCreate(BaseModel):
    decision_id: int
    vote: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    model_name: str
    model_version: Optional[str] = None
    processing_time_ms: int


# Audit Log Schemas
class AuditLogCreate(BaseModel):
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    success: bool = True
    error_message: Optional[str] = None


class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource_type: str
    resource_id: Optional[str]
    details: Optional[Dict[str, Any]]
    success: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Robot Registry Schemas
class RobotRegistryCreate(BaseModel):
    robot_id: str = Field(..., min_length=1, max_length=100)
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    capabilities: Optional[Dict[str, Any]] = None
    safety_features: Optional[Dict[str, Any]] = None
    location: Optional[Dict[str, Any]] = None


class RobotRegistryResponse(BaseModel):
    id: int
    robot_id: str
    manufacturer: Optional[str]
    model: Optional[str]
    is_active: bool
    is_compliant: bool
    last_safety_check: Optional[datetime]
    wallet_address: Optional[str]
    registered_at: datetime
    
    class Config:
        from_attributes = True


# Incident Schemas
class IncidentCreate(BaseModel):
    incident_type: str
    severity: str = Field(..., pattern="^(low|medium|high|critical)$")
    title: str = Field(..., min_length=1, max_length=255)
    description: str
    impact: Optional[str] = None
    decision_id: Optional[int] = None
    robot_id: Optional[str] = None
    platform_id: Optional[int] = None
    evidence: Optional[Dict[str, Any]] = None


class IncidentUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(open|investigating|resolved|closed)$")
    resolution: Optional[str] = None


class IncidentResponse(BaseModel):
    id: int
    incident_type: str
    severity: str
    title: str
    description: str
    status: str
    decision_id: Optional[int]
    robot_id: Optional[str]
    platform_id: Optional[int]
    blockchain_tx_hash: Optional[str]
    reported_at: datetime
    resolved_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Statistics Schemas
class SystemStats(BaseModel):
    total_decisions: int
    approved_decisions: int
    rejected_decisions: int
    pending_decisions: int
    total_robot_decisions: int
    total_platforms: int
    active_platforms: int
    total_users: int
    active_users: int
    total_incidents: int
    open_incidents: int


class PlatformStats(BaseModel):
    platform_id: int
    platform_name: str
    total_decisions: int
    approved_decisions: int
    rejected_decisions: int
    avg_processing_time_ms: float
    uptime_percentage: float


# Health Check Schema
class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    database: str
    redis: str
    blockchain: str
    version: str


# Pagination
class PaginationParams(BaseModel):
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=100, ge=1, le=1000)


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    skip: int
    limit: int
    has_more: bool

