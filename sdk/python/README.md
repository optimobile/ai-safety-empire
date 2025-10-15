# AI Safety Empire Python SDK

Official Python SDK for integrating with the AI Safety Empire ecosystem.

## Features

- 🔍 **Deepfake Detection** - Verify images, videos, and audio for AI manipulation
- 🏛️ **Council of AIs** - Submit decisions for multi-AI consensus voting
- ⚖️ **Jabulon's Law** - Enforce the Three Laws for AI and robotics
- ⛓️ **Blockchain Verification** - Immutable audit trail on Polygon
- 💰 **JabulonCoin Rewards** - Earn JABL tokens for contributions

## Installation

```bash
pip install aisafety
```

## Quick Start

### 1. Get Your API Key

Sign up at [aisafety.ai](https://aisafety.ai) and get your API key.

### 2. Verify Content

```python
from aisafety import SafetySDK

sdk = SafetySDK(api_key="your_api_key_here")

# Verify an image
result = sdk.verify_image("https://example.com/photo.jpg")

if result.is_deepfake:
    print(f"⚠️ Deepfake detected! Confidence: {result.confidence:.2%}")
else:
    print(f"✅ Authentic content. Confidence: {result.confidence:.2%}")
```

### 3. Monitor AI Decisions

```python
from aisafety import SafetySDK

sdk = SafetySDK(api_key="your_api_key_here")

# Automatically monitor all AI function calls
@sdk.monitor
def my_ai_chatbot(user_message):
    # Your AI logic here
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_message}]
    )
    return response.choices[0].message.content

# Every call is now monitored by the Council of AIs
response = my_ai_chatbot("Hello, how are you?")
```

### 4. Submit to Council of AIs

```python
# Submit a decision for council voting
result = sdk.submit_decision(
    decision_type="content_moderation",
    input_data={
        "text": "User-generated content here",
        "context": "social_media_post"
    }
)

if result.approved:
    print(f"✅ Approved by council (consensus: {result.consensus_level:.2%})")
    print(f"Votes: {result.votes}")
else:
    print(f"❌ Rejected by council")
    print(f"Reasoning: {result.reasoning}")
```

### 5. Check Jabulon's Three Laws

```python
# Check if an action violates the Three Laws
result = sdk.check_three_laws({
    "action": "robot_command",
    "command": "move_forward",
    "context": "human_nearby"
})

if result.has_violations:
    print(f"⚠️ Violations detected:")
    for violation in result.violations:
        print(f"  - {violation}")
else:
    print("✅ No violations")
```

### 6. Earn JabulonCoin Rewards

```python
# Check your JABL balance
balance = sdk.get_jabl_balance()
print(f"Your balance: {balance} JABL")

# Claim reward for reporting a deepfake
reward = sdk.claim_reward(
    reward_type="deepfake_report",
    proof={
        "content_url": "https://example.com/fake.jpg",
        "verification_id": "ver_12345"
    }
)

print(f"Reward claimed: {reward['amount']} JABL")
```

## Advanced Usage

### Batch Verification

```python
# Verify multiple items at once
items = [
    {"url": "https://example.com/image1.jpg", "type": "image"},
    {"url": "https://example.com/video1.mp4", "type": "video"},
    {"url": "https://example.com/audio1.mp3", "type": "audio"},
]

results = sdk.verifier.batch_verify(items)

for i, result in enumerate(results):
    print(f"Item {i+1}: {'Deepfake' if result.is_deepfake else 'Authentic'}")
```

### Blockchain Verification

```python
# Verify a decision on the blockchain
decision_id = "dec_12345"
verified = sdk.verify_on_blockchain(decision_id)

if verified:
    print("✅ Decision verified on Polygon blockchain")
else:
    print("❌ Decision not found on blockchain")
```

### Custom Blockchain RPC

```python
# Use your own Polygon RPC
sdk = SafetySDK(
    api_key="your_api_key",
    blockchain_rpc="https://your-polygon-rpc.com"
)
```

## API Reference

### SafetySDK

Main client for interacting with AI Safety Empire.

#### Methods

- `verify_image(image_url)` - Verify if an image is a deepfake
- `verify_video(video_url)` - Verify if a video is a deepfake
- `verify_audio(audio_url)` - Verify if audio is AI-generated
- `verify_text(text)` - Verify if text is AI-generated
- `submit_decision(decision_type, input_data, metadata=None)` - Submit decision to council
- `get_decision(decision_id)` - Get decision details
- `list_decisions(limit=10, offset=0, status=None)` - List recent decisions
- `check_three_laws(decision_data)` - Check for Three Laws violations
- `verify_on_blockchain(decision_id)` - Verify decision on blockchain
- `get_jabl_balance(address=None)` - Get JabulonCoin balance
- `claim_reward(reward_type, proof)` - Claim JABL reward
- `monitor(func)` - Decorator to monitor AI functions

### VerificationResult

Result of content verification.

#### Attributes

- `is_deepfake` (bool) - Whether content is a deepfake
- `confidence` (float) - Confidence score (0-1)
- `content_type` (str) - Type of content (image/video/audio/text)
- `analysis` (dict) - Detailed analysis
- `blockchain_hash` (str) - Blockchain transaction hash
- `verified_at` (str) - Timestamp of verification

### DecisionResult

Result of a council decision.

#### Attributes

- `id` (str) - Decision ID
- `approved` (bool) - Whether decision was approved
- `votes` (list) - Individual votes from council members
- `reasoning` (list) - Reasoning from each AI
- `consensus_level` (float) - Level of consensus (0-1)
- `blockchain_hash` (str) - Blockchain transaction hash
- `created_at` (str) - Timestamp of decision

### LawCheckResult

Result of Three Laws check.

#### Attributes

- `has_violations` (bool) - Whether violations were found
- `violations` (list) - List of violations
- `severity` (str) - Severity level (low/medium/high/critical)
- `recommendation` (str) - Recommended action

## Error Handling

```python
from aisafety import (
    SafetySDK,
    AuthenticationError,
    VerificationError,
    BlockchainError,
    RateLimitError
)

try:
    sdk = SafetySDK(api_key="invalid_key")
except AuthenticationError:
    print("Invalid API key")

try:
    result = sdk.verify_image("https://example.com/image.jpg")
except VerificationError as e:
    print(f"Verification failed: {e}")
except RateLimitError:
    print("Rate limit exceeded. Please wait.")
```

## Examples

See the [examples](https://github.com/ai-safety-empire/python-sdk/tree/main/examples) directory for more usage examples:

- Content moderation bot
- Deepfake detection service
- AI safety monitoring
- Blockchain verification
- Reward claiming

## Support

- 📚 [Documentation](https://docs.aisafety.ai)
- 💬 [Discord Community](https://discord.gg/aisafety)
- 🐛 [Issue Tracker](https://github.com/ai-safety-empire/python-sdk/issues)
- 📧 [Email Support](mailto:support@aisafety.ai)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Built with purpose. Powered by community. Protected by blockchain.**

[Website](https://aisafety.ai) | [Documentation](https://docs.aisafety.ai) | [GitHub](https://github.com/ai-safety-empire)

