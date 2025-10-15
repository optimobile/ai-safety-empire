# AI Safety Empire SDK Documentation

**For AI Companies & Developers**

## Overview

The AI Safety Empire SDK enables AI companies to sign and verify content at creation, providing cryptographic proof of authenticity and stopping deepfakes at the source. This documentation covers integration for all major AI platforms.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Python SDK](#python-sdk)
3. [JavaScript/TypeScript SDK](#javascript-sdk)
4. [Integration Examples](#integration-examples)
5. [API Reference](#api-reference)
6. [Best Practices](#best-practices)
7. [Support](#support)

---

## Quick Start

### Installation

**Python:**
```bash
pip install aisafety-sdk
```

**JavaScript/TypeScript:**
```bash
npm install @aisafety/sdk
# or
yarn add @aisafety/sdk
# or
pnpm add @aisafety/sdk
```

### Get API Key

1. Visit [https://aisafety.ai/developers](https://aisafety.ai/developers)
2. Sign up for free account
3. Generate API key
4. Start with 10,000 free signatures/month

---

## Python SDK

### Basic Usage

```python
from aisafety import SafetySDK

# Initialize SDK
sdk = SafetySDK(api_key="your_api_key_here")

# Sign content at creation
signature = sdk.sign_content(
    content=generated_image,
    content_type="image",
    metadata={
        "model": "dall-e-3",
        "prompt": "A sunset over mountains",
        "timestamp": "2025-01-15T10:30:00Z",
        "creator_id": "user_12345"
    }
)

print(f"Signature: {signature.signature}")
print(f"Blockchain Hash: {signature.blockchain_hash}")
print(f"Proof URL: {signature.proof_url}")

# Verify content later
result = sdk.verify_content(
    content_url="https://example.com/image.jpg",
    content_type="image"
)

print(f"Is Authentic: {result.is_authentic}")
print(f"Is AI Generated: {result.is_ai_generated}")
print(f"Is Deepfake: {result.is_deepfake}")
print(f"Confidence: {result.confidence}")
```

### Advanced Features

#### Monitor AI Functions

```python
from aisafety import SafetySDK

sdk = SafetySDK(api_key="your_key")

# Automatically monitor and log AI function calls
@sdk.monitor
def generate_image(prompt: str):
    # Your AI generation code
    image = openai.Image.create(prompt=prompt)
    return image

# Every call is logged to blockchain
result = generate_image("A beautiful landscape")
```

#### Batch Signing

```python
# Sign multiple pieces of content at once
signatures = sdk.sign_batch([
    {"content": image1, "type": "image", "metadata": {...}},
    {"content": image2, "type": "image", "metadata": {...}},
    {"content": video1, "type": "video", "metadata": {...}},
])

for sig in signatures:
    print(f"Signed: {sig.blockchain_hash}")
```

#### Async Support

```python
import asyncio
from aisafety import AsyncSafetySDK

async def main():
    sdk = AsyncSafetySDK(api_key="your_key")
    
    # Async signing
    signature = await sdk.sign_content(
        content=image,
        content_type="image"
    )
    
    # Async verification
    result = await sdk.verify_content(
        content_url="https://example.com/image.jpg"
    )

asyncio.run(main())
```

---

## JavaScript SDK

### Basic Usage

```typescript
import { SafetySDK } from '@aisafety/sdk';

// Initialize SDK
const sdk = new SafetySDK({
  apiKey: 'your_api_key_here'
});

// Sign content at creation
const signature = await sdk.signContent({
  content: generatedImage,
  contentType: 'image',
  metadata: {
    model: 'dall-e-3',
    prompt: 'A sunset over mountains',
    timestamp: new Date().toISOString(),
    creatorId: 'user_12345'
  }
});

console.log('Signature:', signature.signature);
console.log('Blockchain Hash:', signature.blockchainHash);
console.log('Proof URL:', signature.proofUrl);

// Verify content later
const result = await sdk.verifyContent({
  contentUrl: 'https://example.com/image.jpg',
  contentType: 'image'
});

console.log('Is Authentic:', result.isAuthentic);
console.log('Is AI Generated:', result.isAiGenerated);
console.log('Is Deepfake:', result.isDeepfake);
console.log('Confidence:', result.confidence);
```

### React Integration

```typescript
import { useSafetySDK } from '@aisafety/sdk/react';

function ImageGenerator() {
  const { signContent, verifyContent, loading, error } = useSafetySDK({
    apiKey: 'your_key'
  });

  const handleGenerate = async () => {
    // Generate image with your AI
    const image = await generateImage(prompt);
    
    // Sign it immediately
    const signature = await signContent({
      content: image,
      contentType: 'image'
    });
    
    // Show proof to user
    alert(`Signed! Proof: ${signature.proofUrl}`);
  };

  return (
    <button onClick={handleGenerate} disabled={loading}>
      {loading ? 'Generating...' : 'Generate & Sign Image'}
    </button>
  );
}
```

### Next.js Integration

```typescript
// app/api/sign/route.ts
import { SafetySDK } from '@aisafety/sdk';

const sdk = new SafetySDK({
  apiKey: process.env.AISAFETY_API_KEY!
});

export async function POST(request: Request) {
  const { content, contentType, metadata } = await request.json();
  
  const signature = await sdk.signContent({
    content,
    contentType,
    metadata
  });
  
  return Response.json(signature);
}
```

---

## Integration Examples

### OpenAI DALL-E Integration

```python
from aisafety import SafetySDK
import openai

sdk = SafetySDK(api_key="your_aisafety_key")
openai.api_key = "your_openai_key"

def generate_and_sign_image(prompt: str):
    # Generate image with DALL-E
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="1024x1024"
    )
    
    image_url = response['data'][0]['url']
    
    # Sign the image immediately
    signature = sdk.sign_content(
        content=image_url,
        content_type="image",
        metadata={
            "model": "dall-e-3",
            "prompt": prompt,
            "openai_id": response['data'][0]['id']
        }
    )
    
    # Return both image and proof
    return {
        "image_url": image_url,
        "proof_url": signature.proof_url,
        "blockchain_hash": signature.blockchain_hash
    }

# Usage
result = generate_and_sign_image("A futuristic city")
print(f"Image: {result['image_url']}")
print(f"Proof: {result['proof_url']}")
```

### Midjourney Integration

```python
from aisafety import SafetySDK
import requests

sdk = SafetySDK(api_key="your_key")

def midjourney_callback(image_url: str, prompt: str, job_id: str):
    """
    Call this function when Midjourney completes an image
    """
    signature = sdk.sign_content(
        content=image_url,
        content_type="image",
        metadata={
            "model": "midjourney-v6",
            "prompt": prompt,
            "job_id": job_id,
            "timestamp": datetime.now().isoformat()
        }
    )
    
    # Store signature in your database
    save_to_database({
        "image_url": image_url,
        "signature": signature.signature,
        "blockchain_hash": signature.blockchain_hash,
        "proof_url": signature.proof_url
    })
    
    return signature
```

### Stable Diffusion Integration

```python
from aisafety import SafetySDK
from diffusers import StableDiffusionPipeline

sdk = SafetySDK(api_key="your_key")
pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")

@sdk.monitor  # Automatically sign all outputs
def generate_image(prompt: str):
    image = pipe(prompt).images[0]
    
    # SDK automatically signs this
    # No additional code needed!
    
    return image

# Every image is automatically signed
image = generate_image("A beautiful sunset")
```

### ElevenLabs Voice Integration

```python
from aisafety import SafetySDK
from elevenlabs import generate, Voice

sdk = SafetySDK(api_key="your_key")

def generate_and_sign_voice(text: str, voice_id: str):
    # Generate audio with ElevenLabs
    audio = generate(
        text=text,
        voice=Voice(voice_id=voice_id)
    )
    
    # Sign the audio
    signature = sdk.sign_content(
        content=audio,
        content_type="audio",
        metadata={
            "model": "elevenlabs",
            "text": text,
            "voice_id": voice_id,
            "duration": len(audio) / 44100  # Assuming 44.1kHz
        }
    )
    
    return {
        "audio": audio,
        "proof_url": signature.proof_url
    }
```

### Anthropic Claude Integration

```typescript
import { SafetySDK } from '@aisafety/sdk';
import Anthropic from '@anthropic-ai/sdk';

const sdk = new SafetySDK({ apiKey: process.env.AISAFETY_API_KEY! });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

async function generateAndSignText(prompt: string) {
  // Generate text with Claude
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const text = message.content[0].text;
  
  // Sign the generated text
  const signature = await sdk.signContent({
    content: text,
    contentType: 'text',
    metadata: {
      model: 'claude-3-opus',
      prompt: prompt,
      messageId: message.id
    }
  });
  
  return {
    text,
    proofUrl: signature.proofUrl,
    blockchainHash: signature.blockchainHash
  };
}
```

### Runway Video Integration

```python
from aisafety import SafetySDK
import runway

sdk = SafetySDK(api_key="your_key")

def generate_and_sign_video(prompt: str):
    # Generate video with Runway
    video = runway.generate_video(
        prompt=prompt,
        duration=5
    )
    
    # Sign the video
    signature = sdk.sign_content(
        content=video,
        content_type="video",
        metadata={
            "model": "runway-gen2",
            "prompt": prompt,
            "duration": 5,
            "resolution": "1280x720"
        }
    )
    
    return {
        "video_url": video.url,
        "proof_url": signature.proof_url
    }
```

---

## API Reference

### SafetySDK Class

#### Constructor

```python
SafetySDK(
    api_key: str,
    base_url: str = "https://api.aisafety.ai",
    timeout: int = 30
)
```

**Parameters:**
- `api_key` (required): Your API key from aisafety.ai
- `base_url` (optional): API base URL (default: production)
- `timeout` (optional): Request timeout in seconds (default: 30)

#### Methods

##### sign_content()

Sign content at creation time.

```python
sign_content(
    content: Union[str, bytes, BinaryIO],
    content_type: Literal["image", "video", "audio", "text"],
    metadata: Optional[Dict[str, Any]] = None
) -> SignatureResult
```

**Parameters:**
- `content`: The content to sign (URL, bytes, or file object)
- `content_type`: Type of content
- `metadata`: Optional metadata to store with signature

**Returns:**
- `SignatureResult` object with:
  - `signature`: Cryptographic signature
  - `blockchain_hash`: Transaction hash on blockchain
  - `proof_url`: URL to view proof
  - `timestamp`: ISO 8601 timestamp

##### verify_content()

Verify content authenticity.

```python
verify_content(
    content_url: str,
    content_type: Literal["image", "video", "audio", "text"]
) -> VerificationResult
```

**Parameters:**
- `content_url`: URL of content to verify
- `content_type`: Type of content

**Returns:**
- `VerificationResult` object with:
  - `is_authentic`: Boolean indicating if content is authentic
  - `is_ai_generated`: Boolean indicating if content is AI-generated
  - `is_deepfake`: Boolean indicating if content is a deepfake
  - `confidence`: Confidence score (0.0 to 1.0)
  - `blockchain_hash`: Transaction hash
  - `council_vote`: Voting results from Council of AIs
  - `jabl_reward`: JABL tokens earned

##### monitor (decorator)

Decorator to automatically monitor and sign AI function outputs.

```python
@sdk.monitor
def your_ai_function():
    # Your code here
    pass
```

##### get_jabl_balance()

Get user's JABL token balance.

```python
get_jabl_balance() -> int
```

**Returns:**
- Integer representing JABL token balance

##### get_aegis_balance()

Get user's AEGIS token balance.

```python
get_aegis_balance() -> int
```

**Returns:**
- Integer representing AEGIS token balance

---

## Best Practices

### 1. Sign at Creation

Always sign content immediately after generation, before distribution.

```python
# ✅ Good
image = generate_image(prompt)
signature = sdk.sign_content(image, "image")
distribute(image, signature)

# ❌ Bad
image = generate_image(prompt)
distribute(image)  # No signature!
```

### 2. Include Metadata

Provide rich metadata for better provenance tracking.

```python
signature = sdk.sign_content(
    content=image,
    content_type="image",
    metadata={
        "model": "dall-e-3",
        "prompt": prompt,
        "timestamp": datetime.now().isoformat(),
        "creator_id": user_id,
        "session_id": session_id,
        "version": "1.0.0"
    }
)
```

### 3. Handle Errors Gracefully

```python
from aisafety import SafetySDK, SigningError

sdk = SafetySDK(api_key="your_key")

try:
    signature = sdk.sign_content(image, "image")
except SigningError as e:
    logger.error(f"Failed to sign content: {e}")
    # Fallback: still distribute but log failure
    distribute_unsigned(image)
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise
```

### 4. Use Async for Performance

```python
import asyncio
from aisafety import AsyncSafetySDK

sdk = AsyncSafetySDK(api_key="your_key")

async def process_batch(images):
    tasks = [
        sdk.sign_content(img, "image")
        for img in images
    ]
    signatures = await asyncio.gather(*tasks)
    return signatures
```

### 5. Cache Verification Results

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def verify_with_cache(content_url: str):
    return sdk.verify_content(content_url, "image")
```

### 6. Monitor Rate Limits

```python
from aisafety import SafetySDK, RateLimitError

sdk = SafetySDK(api_key="your_key")

try:
    signature = sdk.sign_content(image, "image")
except RateLimitError as e:
    # Upgrade plan or wait
    logger.warning(f"Rate limit exceeded: {e}")
    time.sleep(60)  # Wait 1 minute
    signature = sdk.sign_content(image, "image")
```

---

## Pricing

### Free Tier
- 10,000 signatures/month
- 1,000 verifications/month
- Community support
- **Perfect for:** Testing, small projects

### Pro Tier - $99/month
- 100,000 signatures/month
- 10,000 verifications/month
- Email support
- Priority API access
- **Perfect for:** Growing startups

### Enterprise Tier - Custom
- Unlimited signatures
- Unlimited verifications
- Dedicated support
- SLA guarantee
- Custom integration
- **Perfect for:** Large AI companies

[View Full Pricing →](https://aisafety.ai/pricing)

---

## Support

### Documentation
- [Full API Reference](https://docs.aisafety.ai)
- [Integration Guides](https://docs.aisafety.ai/guides)
- [Video Tutorials](https://youtube.com/@aisafety)

### Community
- [Discord](https://discord.gg/aisafety)
- [GitHub](https://github.com/aisafety)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aisafety)

### Contact
- Email: support@aisafety.ai
- Twitter: [@aisafety](https://twitter.com/aisafety)
- Phone: +44 20 1234 5678 (Enterprise only)

---

## FAQ

**Q: Do I need to store signatures in my database?**  
A: No, signatures are stored on blockchain. You only need to store the `blockchain_hash` or `proof_url` for reference.

**Q: What happens if the API is down?**  
A: Signatures are queued and processed when service resumes. Your content is still distributed normally.

**Q: Can users verify content without an API key?**  
A: Yes! Anyone can verify content using the proof URL or our public verification tool.

**Q: How long does signing take?**  
A: Average 285ms per signature. Batch signing is faster (100ms per item).

**Q: Is this GDPR compliant?**  
A: Yes, we don't store personal data. Only content hashes and metadata you provide.

**Q: What blockchains do you support?**  
A: Currently Polygon. Ethereum, Solana, and others coming soon.

---

**Ready to integrate?** [Get your API key →](https://aisafety.ai/developers)

*Protect your AI-generated content. Build trust. Stop deepfakes.*

