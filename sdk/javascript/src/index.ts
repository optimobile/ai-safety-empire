/**
 * AI Safety Empire JavaScript/TypeScript SDK
 * 
 * Official SDK for integrating with the AI Safety Empire ecosystem.
 * 
 * @packageDocumentation
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import Web3 from 'web3';

/**
 * Configuration options for SafetySDK
 */
export interface SafetySDKConfig {
  /** Your API key from aisafety.ai */
  apiKey: string;
  /** API base URL (default: https://api.aisafety.ai) */
  baseUrl?: string;
  /** Polygon RPC URL for blockchain verification (optional) */
  blockchainRpc?: string;
}

/**
 * Result of content verification
 */
export interface VerificationResult {
  /** Whether the content is a deepfake */
  isDeepfake: boolean;
  /** Confidence score (0-1) */
  confidence: number;
  /** Type of content (image/video/audio/text) */
  contentType: string;
  /** Detailed analysis */
  analysis: Record<string, any>;
  /** Blockchain transaction hash */
  blockchainHash?: string;
  /** Timestamp of verification */
  verifiedAt: string;
}

/**
 * Result of a council decision
 */
export interface DecisionResult {
  /** Decision ID */
  id: string;
  /** Whether the decision was approved */
  approved: boolean;
  /** Individual votes from council members */
  votes: boolean[];
  /** Reasoning from each AI */
  reasoning: Array<{
    ai: string;
    vote: boolean;
    reasoning: string;
    confidence: number;
  }>;
  /** Level of consensus (0-1) */
  consensusLevel: number;
  /** Blockchain transaction hash */
  blockchainHash?: string;
  /** Timestamp of decision */
  createdAt: string;
}

/**
 * Result of Jabulon's Law check
 */
export interface LawCheckResult {
  /** Whether violations were found */
  hasViolations: boolean;
  /** List of violations */
  violations: string[];
  /** Severity level */
  severity?: 'low' | 'medium' | 'high' | 'critical';
  /** Recommended action */
  recommendation?: string;
}

/**
 * Main SDK client for AI Safety Empire
 * 
 * @example
 * ```typescript
 * import { SafetySDK } from '@aisafety/sdk';
 * 
 * const sdk = new SafetySDK({ apiKey: 'your_api_key' });
 * 
 * // Verify an image
 * const result = await sdk.verifyImage('https://example.com/photo.jpg');
 * if (result.isDeepfake) {
 *   console.log(`Deepfake detected! Confidence: ${result.confidence}`);
 * }
 * ```
 */
export class SafetySDK {
  private client: AxiosInstance;
  private web3?: Web3;

  /**
   * Create a new SafetySDK instance
   * 
   * @param config - Configuration options
   */
  constructor(config: SafetySDKConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    const baseUrl = config.baseUrl || 'https://api.aisafety.ai';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AISafety-JS-SDK/1.0.0',
      },
    });

    // Initialize Web3 if blockchain RPC provided
    if (config.blockchainRpc) {
      this.web3 = new Web3(config.blockchainRpc);
    }
  }

  // Content Verification Methods

  /**
   * Verify if an image is a deepfake
   * 
   * @param imageUrl - URL of the image to verify
   * @returns Verification result
   * 
   * @example
   * ```typescript
   * const result = await sdk.verifyImage('https://example.com/photo.jpg');
   * console.log(result.isDeepfake); // true or false
   * ```
   */
  async verifyImage(imageUrl: string): Promise<VerificationResult> {
    return this.verify(imageUrl, 'image');
  }

  /**
   * Verify if a video is a deepfake
   * 
   * @param videoUrl - URL of the video to verify
   * @returns Verification result
   */
  async verifyVideo(videoUrl: string): Promise<VerificationResult> {
    return this.verify(videoUrl, 'video');
  }

  /**
   * Verify if audio is AI-generated
   * 
   * @param audioUrl - URL of the audio to verify
   * @returns Verification result
   */
  async verifyAudio(audioUrl: string): Promise<VerificationResult> {
    return this.verify(audioUrl, 'audio');
  }

  /**
   * Verify if text is AI-generated
   * 
   * @param text - Text to verify
   * @returns Verification result
   */
  async verifyText(text: string): Promise<VerificationResult> {
    const response = await this.client.post<VerificationResult>('/verify/', {
      content: text,
      contentType: 'text',
    });
    return response.data;
  }

  private async verify(url: string, type: string): Promise<VerificationResult> {
    const response = await this.client.post<VerificationResult>('/verify/', {
      content_url: url,
      content_type: type,
    });
    return response.data;
  }

  // Council of AIs Methods

  /**
   * Submit a decision to the Council of AIs for voting
   * 
   * @param decisionType - Type of decision (e.g., "content_moderation")
   * @param inputData - The data for the decision
   * @param metadata - Optional metadata
   * @returns Decision result
   * 
   * @example
   * ```typescript
   * const result = await sdk.submitDecision(
   *   'content_moderation',
   *   { text: 'User content here' }
   * );
   * if (result.approved) {
   *   console.log('Decision approved by council');
   * }
   * ```
   */
  async submitDecision(
    decisionType: string,
    inputData: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<DecisionResult> {
    const response = await this.client.post<DecisionResult>('/decisions/', {
      decision_type: decisionType,
      input_data: inputData,
      metadata: metadata || {},
    });
    return response.data;
  }

  /**
   * Get details of a specific decision
   * 
   * @param decisionId - The decision ID
   * @returns Decision result
   */
  async getDecision(decisionId: string): Promise<DecisionResult> {
    const response = await this.client.get<DecisionResult>(`/decisions/${decisionId}`);
    return response.data;
  }

  /**
   * List recent decisions
   * 
   * @param options - Query options
   * @returns Array of decision results
   */
  async listDecisions(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<DecisionResult[]> {
    const response = await this.client.get<{ decisions: DecisionResult[] }>('/decisions/', {
      params: options,
    });
    return response.data.decisions;
  }

  // Jabulon's Law Methods

  /**
   * Check if a decision violates Jabulon's Three Laws
   * 
   * @param decisionData - The decision to check
   * @returns Law check result
   * 
   * @example
   * ```typescript
   * const result = await sdk.checkThreeLaws({
   *   action: 'robot_command',
   *   command: 'move_forward'
   * });
   * if (result.hasViolations) {
   *   console.log('Violations:', result.violations);
   * }
   * ```
   */
  async checkThreeLaws(decisionData: Record<string, any>): Promise<LawCheckResult> {
    const response = await this.client.post<LawCheckResult>('/jabulon/check', decisionData);
    return response.data;
  }

  // Blockchain Methods

  /**
   * Verify a decision exists on the blockchain
   * 
   * @param decisionId - The decision ID to verify
   * @returns True if verified, false otherwise
   */
  async verifyOnBlockchain(decisionId: string): Promise<boolean> {
    const response = await this.client.get<{ verified: boolean }>(
      `/blockchain/verify/${decisionId}`
    );
    return response.data.verified;
  }

  // Rewards Methods

  /**
   * Get JabulonCoin balance
   * 
   * @param address - Wallet address (optional, uses authenticated user if not provided)
   * @returns JABL balance
   */
  async getJablBalance(address?: string): Promise<number> {
    const endpoint = address ? `/rewards/balance/${address}` : '/rewards/balance';
    const response = await this.client.get<{ balance: number }>(endpoint);
    return response.data.balance;
  }

  /**
   * Claim a JabulonCoin reward
   * 
   * @param rewardType - Type of reward (e.g., "deepfake_report")
   * @param proof - Proof of the action
   * @returns Reward details
   */
  async claimReward(
    rewardType: string,
    proof: Record<string, any>
  ): Promise<{ amount: number; transaction: string }> {
    const response = await this.client.post<{ amount: number; transaction: string }>(
      '/rewards/claim',
      {
        reward_type: rewardType,
        proof,
      }
    );
    return response.data;
  }

  // Utility Methods

  /**
   * Batch verify multiple items
   * 
   * @param items - Array of items to verify
   * @returns Array of verification results
   */
  async batchVerify(
    items: Array<{ url: string; type: 'image' | 'video' | 'audio' }>
  ): Promise<VerificationResult[]> {
    const response = await this.client.post<{ results: VerificationResult[] }>(
      '/verify/batch',
      { items }
    );
    return response.data.results;
  }
}

/**
 * Custom error class for AI Safety SDK
 */
export class AISafetyError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'AISafetyError';
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AISafetyError {
  constructor(message = 'Invalid API key') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AISafetyError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

// Export everything
export default SafetySDK;

