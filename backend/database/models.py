"""
Database models for the AI Safety Empire
Using SQLAlchemy ORM with PostgreSQL
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text, 
    ForeignKey, JSON, Enum, Float, Index
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()


class UserRole(str, enum.Enum):
    """User roles in the system"""
    ADMIN = "admin"
    PLATFORM_OWNER = "platform_owner"
    DEVELOPER = "developer"
    AUDITOR = "auditor"
    USER = "user"


class PlatformType(str, enum.Enum):
    """Types of platforms in the ecosystem"""
    GOD_LAYER = "god_layer"
    GOVERNANCE = "governance"
    AI_SAFETY = "ai_safety"
    ROBOTICS_SAFETY = "robotics_safety"
    VERIFICATION = "verification"
    MONITORING = "monitoring"


class DecisionStatus(str, enum.Enum):
    """Status of AI decisions"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CONDITIONAL = "conditional"
    EXECUTED = "executed"
    FAILED = "failed"


class User(Base):
    """User accounts"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    wallet_address = Column(String(42), unique=True, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)
    
    # Relationships
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    decisions = relationship("AIDecision", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
    
    __table_args__ = (
        Index('idx_user_email_active', 'email', 'is_active'),
    )


class APIKey(Base):
    """API keys for authentication"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key_hash = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    
    is_active = Column(Boolean, default=True, nullable=False)
    rate_limit = Column(Integer, default=1000)  # requests per hour
    allowed_platforms = Column(JSON)  # List of platform IDs
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime)
    last_used = Column(DateTime)
    usage_count = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")


class Platform(Base):
    """Platform registry"""
    __tablename__ = "platforms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    domain = Column(String(255), unique=True, nullable=False)
    platform_type = Column(Enum(PlatformType), nullable=False)
    description = Column(Text)
    
    is_active = Column(Boolean, default=True, nullable=False)
    api_endpoint = Column(String(255))
    webhook_url = Column(String(255))
    
    # Configuration
    config = Column(JSON)  # Platform-specific configuration
    
    # Blockchain
    contract_address = Column(String(42))
    wallet_address = Column(String(42))
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    decisions = relationship("AIDecision", back_populates="platform")


class AIDecision(Base):
    """AI decisions logged in the system"""
    __tablename__ = "ai_decisions"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_hash = Column(String(66), unique=True, index=True, nullable=False)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    platform_id = Column(Integer, ForeignKey("platforms.id"), nullable=False)
    
    # Decision details
    decision_type = Column(String(100), nullable=False)
    input_data = Column(JSON, nullable=False)
    output_data = Column(JSON)
    
    # Status
    status = Column(Enum(DecisionStatus), default=DecisionStatus.PENDING, nullable=False)
    
    # Voting
    approval_count = Column(Integer, default=0)
    rejection_count = Column(Integer, default=0)
    council_votes = Column(JSON)  # Details of each council member's vote
    
    # Blockchain
    blockchain_tx_hash = Column(String(66), index=True)
    ipfs_hash = Column(String(100))
    
    # Robot-specific
    is_robot_decision = Column(Boolean, default=False, nullable=False)
    robot_id = Column(String(100))
    sensor_data = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    approved_at = Column(DateTime)
    executed_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="decisions")
    platform = relationship("Platform", back_populates="decisions")
    
    __table_args__ = (
        Index('idx_decision_status_created', 'status', 'created_at'),
        Index('idx_decision_platform_created', 'platform_id', 'created_at'),
    )


class CouncilVote(Base):
    """Individual council member votes"""
    __tablename__ = "council_votes"
    
    id = Column(Integer, primary_key=True, index=True)
    decision_id = Column(Integer, ForeignKey("ai_decisions.id"), nullable=False)
    platform_id = Column(Integer, ForeignKey("platforms.id"), nullable=False)
    
    vote = Column(Boolean, nullable=False)  # True = approve, False = reject
    confidence = Column(Float)  # 0.0 to 1.0
    reasoning = Column(Text)
    
    # AI model details
    model_name = Column(String(100))
    model_version = Column(String(50))
    processing_time_ms = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    __table_args__ = (
        Index('idx_vote_decision_platform', 'decision_id', 'platform_id'),
    )


class AuditLog(Base):
    """Audit trail for all system actions"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    action = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100))
    
    details = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(String(255))
    
    success = Column(Boolean, default=True, nullable=False)
    error_message = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    
    __table_args__ = (
        Index('idx_audit_action_created', 'action', 'created_at'),
        Index('idx_audit_resource_created', 'resource_type', 'resource_id', 'created_at'),
    )


class SystemMetric(Base):
    """System performance metrics"""
    __tablename__ = "system_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    platform_id = Column(Integer, ForeignKey("platforms.id"))
    
    metric_name = Column(String(100), nullable=False, index=True)
    metric_value = Column(Float, nullable=False)
    metric_unit = Column(String(50))
    
    tags = Column(JSON)  # Additional metadata
    
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    __table_args__ = (
        Index('idx_metric_name_timestamp', 'metric_name', 'timestamp'),
        Index('idx_metric_platform_timestamp', 'platform_id', 'timestamp'),
    )


class Subscription(Base):
    """User subscriptions and billing"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    plan_name = Column(String(100), nullable=False)
    plan_tier = Column(String(50), nullable=False)  # free, starter, professional, enterprise
    
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Limits
    monthly_api_calls = Column(Integer)
    max_platforms = Column(Integer)
    features = Column(JSON)  # List of enabled features
    
    # Billing
    price_monthly = Column(Float)
    currency = Column(String(3), default="USD")
    
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime)
    cancelled_at = Column(DateTime)
    
    # Payment
    stripe_subscription_id = Column(String(255))
    stripe_customer_id = Column(String(255))
    
    __table_args__ = (
        Index('idx_subscription_user_active', 'user_id', 'is_active'),
    )


class RobotRegistry(Base):
    """Registry of physical robots"""
    __tablename__ = "robot_registry"
    
    id = Column(Integer, primary_key=True, index=True)
    robot_id = Column(String(100), unique=True, index=True, nullable=False)
    
    manufacturer = Column(String(255))
    model = Column(String(255))
    serial_number = Column(String(255))
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_compliant = Column(Boolean, default=True, nullable=False)
    last_safety_check = Column(DateTime)
    
    # Capabilities
    capabilities = Column(JSON)  # List of robot capabilities
    safety_features = Column(JSON)  # Implemented safety features
    
    # Location
    location = Column(JSON)  # GPS coordinates or facility info
    
    # Blockchain
    wallet_address = Column(String(42))
    
    registered_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_robot_active_compliant', 'is_active', 'is_compliant'),
    )


class Incident(Base):
    """Safety incidents and violations"""
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String(100), nullable=False, index=True)
    severity = Column(String(50), nullable=False)  # low, medium, high, critical
    
    # Related entities
    decision_id = Column(Integer, ForeignKey("ai_decisions.id"))
    robot_id = Column(String(100), ForeignKey("robot_registry.robot_id"))
    platform_id = Column(Integer, ForeignKey("platforms.id"))
    
    # Details
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    impact = Column(Text)
    
    # Status
    status = Column(String(50), default="open", nullable=False)  # open, investigating, resolved, closed
    
    # Resolution
    resolution = Column(Text)
    resolved_at = Column(DateTime)
    resolved_by = Column(Integer, ForeignKey("users.id"))
    
    # Evidence
    evidence = Column(JSON)  # Links to logs, videos, sensor data
    blockchain_tx_hash = Column(String(66))
    
    reported_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_incident_severity_status', 'severity', 'status'),
        Index('idx_incident_type_reported', 'incident_type', 'reported_at'),
    )

