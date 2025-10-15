"""
Custom exceptions for AI Safety Empire SDK
"""


class AISafetyError(Exception):
    """Base exception for AI Safety SDK"""
    pass


class AuthenticationError(AISafetyError):
    """Raised when authentication fails"""
    pass


class VerificationError(AISafetyError):
    """Raised when content verification fails"""
    pass


class BlockchainError(AISafetyError):
    """Raised when blockchain interaction fails"""
    pass


class RateLimitError(AISafetyError):
    """Raised when API rate limit is exceeded"""
    pass


class DecisionError(AISafetyError):
    """Raised when decision submission fails"""
    pass

