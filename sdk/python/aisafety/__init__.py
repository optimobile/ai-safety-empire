"""
AI Safety Empire Python SDK

Official Python SDK for integrating with the AI Safety Empire ecosystem.
Provides easy access to:
- Content verification (deepfake detection)
- Council of AIs decision voting
- Jabulon's Law enforcement
- Blockchain verification
- JabulonCoin rewards

Installation:
    pip install aisafety

Quick Start:
    from aisafety import SafetySDK
    
    sdk = SafetySDK(api_key="your_api_key")
    
    # Verify content
    result = sdk.verify_image("https://example.com/image.jpg")
    if result.is_deepfake:
        print(f"Deepfake detected! Confidence: {result.confidence}")
    
    # Monitor AI decisions
    @sdk.monitor
    def my_ai_function(user_input):
        # Your AI logic here
        return response

Author: AI Safety Empire
License: MIT
Version: 1.0.0
"""

__version__ = "1.0.0"
__author__ = "AI Safety Empire"
__license__ = "MIT"

from .client import SafetySDK
from .verification import ContentVerifier
from .blockchain import BlockchainClient
from .decorators import monitor
from .exceptions import (
    AISafetyError,
    AuthenticationError,
    VerificationError,
    BlockchainError,
    RateLimitError
)

__all__ = [
    "SafetySDK",
    "ContentVerifier",
    "BlockchainClient",
    "monitor",
    "AISafetyError",
    "AuthenticationError",
    "VerificationError",
    "BlockchainError",
    "RateLimitError",
]

