# AI Safety Empire JavaScript SDK

Official JavaScript/TypeScript SDK for integrating with the AI Safety Empire ecosystem.

## Features

- 🔍 **Deepfake Detection** - Verify images, videos, and audio for AI manipulation
- 🏛️ **Council of AIs** - Submit decisions for multi-AI consensus voting
- ⚖️ **Jabulon's Law** - Enforce the Three Laws for AI and robotics
- ⛓️ **Blockchain Verification** - Immutable audit trail on Polygon
- 💰 **JabulonCoin Rewards** - Earn JABL tokens for contributions
- 📘 **TypeScript Support** - Full type definitions included
- 🌐 **Browser & Node.js** - Works in both environments

## Installation

```bash
npm install @aisafety/sdk
# or
yarn add @aisafety/sdk
# or
pnpm add @aisafety/sdk
```

## Quick Start

### 1. Get Your API Key

Sign up at [aisafety.ai](https://aisafety.ai) and get your API key.

### 2. Verify Content

```typescript
import { SafetySDK } from '@aisafety/sdk';

const sdk = new SafetySDK({ apiKey: 'your_api_key_here' });

// Verify an image
const result = await sdk.verifyImage('https://example.com/photo.jpg');

if (result.isDeepfake) {
  console.log(`⚠️ Deepfake detected! Confidence: ${(result.confidence * 100).toFixed(1)}%`);
} else {
  console.log(`✅ Authentic content. Confidence: ${(result.confidence * 100).toFixed(1)}%`);
}
```

### 3. Submit to Council of AIs

```typescript
// Submit a decision for council voting
const result = await sdk.submitDecision(
  'content_moderation',
  {
    text: 'User-generated content here',
    context: 'social_media_post'
  }
);

if (result.approved) {
  console.log(`✅ Approved by council (consensus: ${(result.consensusLevel * 100).toFixed(1)}%)`);
  console.log('Votes:', result.votes);
} else {
  console.log('❌ Rejected by council');
  console.log('Reasoning:', result.reasoning);
}
```

### 4. Check Jabulon's Three Laws

```typescript
// Check if an action violates the Three Laws
const result = await sdk.checkThreeLaws({
  action: 'robot_command',
  command: 'move_forward',
  context: 'human_nearby'
});

if (result.hasViolations) {
  console.log('⚠️ Violations detected:');
  result.violations.forEach(v => console.log(`  - ${v}`));
} else {
  console.log('✅ No violations');
}
```

### 5. Earn JabulonCoin Rewards

```typescript
// Check your JABL balance
const balance = await sdk.getJablBalance();
console.log(`Your balance: ${balance} JABL`);

// Claim reward for reporting a deepfake
const reward = await sdk.claimReward(
  'deepfake_report',
  {
    content_url: 'https://example.com/fake.jpg',
    verification_id: 'ver_12345'
  }
);

console.log(`Reward claimed: ${reward.amount} JABL`);
```

## Usage in React

```typescript
import { SafetySDK } from '@aisafety/sdk';
import { useState, useEffect } from 'react';

function DeepfakeChecker() {
  const [sdk] = useState(() => new SafetySDK({ apiKey: process.env.REACT_APP_API_KEY }));
  const [result, setResult] = useState(null);

  const checkImage = async (imageUrl: string) => {
    const verification = await sdk.verifyImage(imageUrl);
    setResult(verification);
  };

  return (
    <div>
      <button onClick={() => checkImage('https://example.com/photo.jpg')}>
        Check Image
      </button>
      {result && (
        <div>
          {result.isDeepfake ? '⚠️ Deepfake' : '✅ Authentic'}
        </div>
      )}
    </div>
  );
}
```

## Usage in Node.js

```typescript
import { SafetySDK } from '@aisafety/sdk';

const sdk = new SafetySDK({
  apiKey: process.env.AISAFETY_API_KEY,
  blockchainRpc: 'https://polygon-rpc.com'
});

// Verify content
const result = await sdk.verifyImage('https://example.com/photo.jpg');
console.log(result);

// Submit decision
const decision = await sdk.submitDecision('content_moderation', {
  text: 'User content'
});
console.log(decision);
```

## Advanced Usage

### Batch Verification

```typescript
// Verify multiple items at once
const items = [
  { url: 'https://example.com/image1.jpg', type: 'image' as const },
  { url: 'https://example.com/video1.mp4', type: 'video' as const },
  { url: 'https://example.com/audio1.mp3', type: 'audio' as const },
];

const results = await sdk.batchVerify(items);

results.forEach((result, i) => {
  console.log(`Item ${i + 1}: ${result.isDeepfake ? 'Deepfake' : 'Authentic'}`);
});
```

### Blockchain Verification

```typescript
// Verify a decision on the blockchain
const decisionId = 'dec_12345';
const verified = await sdk.verifyOnBlockchain(decisionId);

if (verified) {
  console.log('✅ Decision verified on Polygon blockchain');
} else {
  console.log('❌ Decision not found on blockchain');
}
```

### Error Handling

```typescript
import { SafetySDK, AuthenticationError, RateLimitError } from '@aisafety/sdk';

try {
  const sdk = new SafetySDK({ apiKey: 'invalid_key' });
  const result = await sdk.verifyImage('https://example.com/photo.jpg');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Please wait.');
  } else {
    console.error('An error occurred:', error);
  }
}
```

## API Reference

### SafetySDK

Main client for interacting with AI Safety Empire.

#### Constructor

```typescript
new SafetySDK(config: SafetySDKConfig)
```

#### Methods

- `verifyImage(imageUrl: string): Promise<VerificationResult>`
- `verifyVideo(videoUrl: string): Promise<VerificationResult>`
- `verifyAudio(audioUrl: string): Promise<VerificationResult>`
- `verifyText(text: string): Promise<VerificationResult>`
- `submitDecision(type: string, data: object, metadata?: object): Promise<DecisionResult>`
- `getDecision(decisionId: string): Promise<DecisionResult>`
- `listDecisions(options?: object): Promise<DecisionResult[]>`
- `checkThreeLaws(data: object): Promise<LawCheckResult>`
- `verifyOnBlockchain(decisionId: string): Promise<boolean>`
- `getJablBalance(address?: string): Promise<number>`
- `claimReward(type: string, proof: object): Promise<object>`
- `batchVerify(items: array): Promise<VerificationResult[]>`

### Types

#### VerificationResult

```typescript
interface VerificationResult {
  isDeepfake: boolean;
  confidence: number;
  contentType: string;
  analysis: Record<string, any>;
  blockchainHash?: string;
  verifiedAt: string;
}
```

#### DecisionResult

```typescript
interface DecisionResult {
  id: string;
  approved: boolean;
  votes: boolean[];
  reasoning: Array<{
    ai: string;
    vote: boolean;
    reasoning: string;
    confidence: number;
  }>;
  consensusLevel: number;
  blockchainHash?: string;
  createdAt: string;
}
```

#### LawCheckResult

```typescript
interface LawCheckResult {
  hasViolations: boolean;
  violations: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recommendation?: string;
}
```

## Examples

See the [examples](https://github.com/ai-safety-empire/javascript-sdk/tree/main/examples) directory for more:

- React app with deepfake detection
- Node.js content moderation bot
- Express.js API integration
- Vue.js safety monitoring
- Next.js full-stack example

## Support

- 📚 [Documentation](https://docs.aisafety.ai)
- 💬 [Discord Community](https://discord.gg/aisafety)
- 🐛 [Issue Tracker](https://github.com/ai-safety-empire/javascript-sdk/issues)
- 📧 [Email Support](mailto:support@aisafety.ai)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Built with purpose. Powered by community. Protected by blockchain.**

[Website](https://aisafety.ai) | [Documentation](https://docs.aisafety.ai) | [GitHub](https://github.com/ai-safety-empire)

