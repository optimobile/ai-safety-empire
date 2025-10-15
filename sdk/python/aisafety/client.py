"""
Main SDK client for AI Safety Empire
"""

import requests
from typing import Optional, Dict, Any, List
from .verification import ContentVerifier
from .blockchain import BlockchainClient
from .exceptions import AuthenticationError, AISafetyError


class SafetySDK:
    """
    Main client for interacting with AI Safety Empire API
    
    Args:
        api_key: Your API key from aisafety.ai
        base_url: API base URL (default: https://api.aisafety.ai)
        blockchain_rpc: Polygon RPC URL (optional)
    
    Example:
        >>> sdk = SafetySDK(api_key="your_key")
        >>> result = sdk.verify_image("https://example.com/image.jpg")
        >>> print(result.is_deepfake)
        False
    """
    
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.aisafety.ai",
        blockchain_rpc: Optional[str] = None
    ):
        if not api_key:
            raise AuthenticationError("API key is required")
        
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "AISafety-Python-SDK/1.0.0"
        })
        
        # Initialize sub-clients
        self.verifier = ContentVerifier(self)
        self.blockchain = BlockchainClient(blockchain_rpc) if blockchain_rpc else None
    
    def _request(
        self,
        method: str,
        endpoint: str,
        **kwargs
    ) -> Dict[str, Any]:
        """Make HTTP request to API"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                raise AuthenticationError("Invalid API key")
            elif e.response.status_code == 429:
                from .exceptions import RateLimitError
                raise RateLimitError("Rate limit exceeded")
            else:
                raise AISafetyError(f"API error: {e.response.text}")
        except requests.exceptions.RequestException as e:
            raise AISafetyError(f"Request failed: {str(e)}")
    
    # Content Verification Methods
    
    def verify_image(self, image_url: str) -> 'VerificationResult':
        """
        Verify if an image is a deepfake
        
        Args:
            image_url: URL of the image to verify
        
        Returns:
            VerificationResult with is_deepfake, confidence, etc.
        
        Example:
            >>> result = sdk.verify_image("https://example.com/photo.jpg")
            >>> if result.is_deepfake:
            ...     print(f"Deepfake detected! Confidence: {result.confidence}")
        """
        return self.verifier.verify_image(image_url)
    
    def verify_video(self, video_url: str) -> 'VerificationResult':
        """Verify if a video is a deepfake"""
        return self.verifier.verify_video(video_url)
    
    def verify_audio(self, audio_url: str) -> 'VerificationResult':
        """Verify if audio is AI-generated"""
        return self.verifier.verify_audio(audio_url)
    
    def verify_text(self, text: str) -> 'VerificationResult':
        """Verify if text is AI-generated"""
        return self.verifier.verify_text(text)
    
    # Council of AIs Methods
    
    def submit_decision(
        self,
        decision_type: str,
        input_data: Dict[str, Any],
        metadata: Optional[Dict[str, Any]] = None
    ) -> 'DecisionResult':
        """
        Submit a decision to the Council of AIs for voting
        
        Args:
            decision_type: Type of decision (e.g., "content_moderation")
            input_data: The data for the decision
            metadata: Optional metadata
        
        Returns:
            DecisionResult with approval status, votes, reasoning
        
        Example:
            >>> result = sdk.submit_decision(
            ...     decision_type="content_moderation",
            ...     input_data={"text": "User content here"}
            ... )
            >>> if result.approved:
            ...     print("Decision approved by council")
        """
        data = {
            "decision_type": decision_type,
            "input_data": input_data,
            "metadata": metadata or {}
        }
        
        response = self._request("POST", "/decisions/", json=data)
        return DecisionResult(response)
    
    def get_decision(self, decision_id: str) -> 'DecisionResult':
        """Get details of a specific decision"""
        response = self._request("GET", f"/decisions/{decision_id}")
        return DecisionResult(response)
    
    def list_decisions(
        self,
        limit: int = 10,
        offset: int = 0,
        status: Optional[str] = None
    ) -> List['DecisionResult']:
        """List recent decisions"""
        params = {"limit": limit, "offset": offset}
        if status:
            params["status"] = status
        
        response = self._request("GET", "/decisions/", params=params)
        return [DecisionResult(d) for d in response.get("decisions", [])]
    
    # Jabulon's Law Methods
    
    def check_three_laws(self, decision_data: Dict[str, Any]) -> 'LawCheckResult':
        """
        Check if a decision violates Jabulon's Three Laws
        
        Args:
            decision_data: The decision to check
        
        Returns:
            LawCheckResult with violations, if any
        
        Example:
            >>> result = sdk.check_three_laws({
            ...     "action": "robot_command",
            ...     "command": "move_forward"
            ... })
            >>> if result.has_violations:
            ...     print(f"Violations: {result.violations}")
        """
        response = self._request("POST", "/jabulon/check", json=decision_data)
        return LawCheckResult(response)
    
    # Blockchain Methods
    
    def verify_on_blockchain(self, decision_id: str) -> bool:
        """
        Verify a decision exists on the blockchain
        
        Args:
            decision_id: The decision ID to verify
        
        Returns:
            True if verified on blockchain, False otherwise
        """
        if not self.blockchain:
            raise AISafetyError("Blockchain client not initialized")
        
        response = self._request("GET", f"/blockchain/verify/{decision_id}")
        return response.get("verified", False)
    
    # Rewards Methods
    
    def get_jabl_balance(self, address: Optional[str] = None) -> float:
        """
        Get JabulonCoin balance
        
        Args:
            address: Wallet address (optional, uses authenticated user if not provided)
        
        Returns:
            JABL balance
        """
        endpoint = f"/rewards/balance/{address}" if address else "/rewards/balance"
        response = self._request("GET", endpoint)
        return float(response.get("balance", 0))
    
    def claim_reward(self, reward_type: str, proof: Dict[str, Any]) -> Dict[str, Any]:
        """
        Claim a JabulonCoin reward
        
        Args:
            reward_type: Type of reward (e.g., "deepfake_report")
            proof: Proof of the action
        
        Returns:
            Reward details including amount
        """
        data = {"reward_type": reward_type, "proof": proof}
        return self._request("POST", "/rewards/claim", json=data)
    
    # Monitoring Decorator
    
    def monitor(self, func):
        """
        Decorator to automatically monitor AI function calls
        
        Example:
            >>> @sdk.monitor
            ... def my_ai_function(user_input):
            ...     response = openai.chat.completions.create(...)
            ...     return response
        """
        from functools import wraps
        
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Execute function
            result = func(*args, **kwargs)
            
            # Submit to council for monitoring
            try:
                self.submit_decision(
                    decision_type="ai_function_call",
                    input_data={
                        "function": func.__name__,
                        "args": str(args),
                        "kwargs": str(kwargs),
                        "result": str(result)
                    }
                )
            except Exception as e:
                # Don't fail the function if monitoring fails
                print(f"Warning: Failed to monitor function: {e}")
            
            return result
        
        return wrapper


class VerificationResult:
    """Result of content verification"""
    
    def __init__(self, data: Dict[str, Any]):
        self.is_deepfake = data.get("is_deepfake", False)
        self.confidence = data.get("confidence", 0.0)
        self.content_type = data.get("content_type")
        self.analysis = data.get("analysis", {})
        self.blockchain_hash = data.get("blockchain_hash")
        self.verified_at = data.get("verified_at")
    
    def __repr__(self):
        return f"<VerificationResult deepfake={self.is_deepfake} confidence={self.confidence}>"


class DecisionResult:
    """Result of a council decision"""
    
    def __init__(self, data: Dict[str, Any]):
        self.id = data.get("id")
        self.approved = data.get("approved", False)
        self.votes = data.get("votes", [])
        self.reasoning = data.get("reasoning", [])
        self.consensus_level = data.get("consensus_level", 0.0)
        self.blockchain_hash = data.get("blockchain_hash")
        self.created_at = data.get("created_at")
    
    def __repr__(self):
        return f"<DecisionResult id={self.id} approved={self.approved} consensus={self.consensus_level}>"


class LawCheckResult:
    """Result of Jabulon's Law check"""
    
    def __init__(self, data: Dict[str, Any]):
        self.has_violations = data.get("has_violations", False)
        self.violations = data.get("violations", [])
        self.severity = data.get("severity")
        self.recommendation = data.get("recommendation")
    
    def __repr__(self):
        return f"<LawCheckResult violations={len(self.violations)} severity={self.severity}>"

