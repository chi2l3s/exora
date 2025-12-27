import { createHmac, timingSafeEqual } from 'crypto';

// Signature Header Format
// Exora-Signature: t=timestamp,v1=signature

/**
 * Generate webhook signature
 */
export function generateSignature(
  payload: string | Buffer,
  secret: string,
  timestamp: number = Date.now()
): string {
  const signedPayload = `${timestamp}.${typeof payload === 'string' ? payload : payload.toString()}`;
  const signature = createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}

/**
 * Parse signature header
 */
export function parseSignature(header: string): {
  timestamp: number;
  signatures: string[];
} | null {
  try {
    const parts = header.split(',');
    let timestamp = 0;
    const signatures: string[] = [];

    for (const part of parts) {
      const [key, value] = part.split('=');

      if (key === 't') {
        timestamp = parseInt(value, 10);
      } else if (key.startsWith('v')) {
        signatures.push(value);
      }
    }

    if (timestamp === 0 || signatures.length === 0) {
      return null;
    }

    return { timestamp, signatures };
  } catch {
    return null;
  }
}

/**
 * Verify webhook signature
 */
export function verifySignature(
  payload: string | Buffer,
  header: string,
  secret: string,
  tolerance: number = 300000 // 5 minutes in milliseconds
): { valid: boolean; error?: string } {
  const parsed = parseSignature(header);

  if (!parsed) {
    return { valid: false, error: 'Invalid signature header format' };
  }

  const { timestamp, signatures } = parsed;

  // Check timestamp tolerance
  const now = Date.now();
  if (Math.abs(now - timestamp) > tolerance) {
    return { valid: false, error: 'Signature timestamp expired' };
  }

  // Generate expected signature
  const signedPayload = `${timestamp}.${typeof payload === 'string' ? payload : payload.toString()}`;
  const expectedSignature = createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Compare signatures using timing-safe comparison
  for (const signature of signatures) {
    try {
      const sigBuffer = Buffer.from(signature, 'hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');

      if (
        sigBuffer.length === expectedBuffer.length &&
        timingSafeEqual(sigBuffer, expectedBuffer)
      ) {
        return { valid: true };
      }
    } catch {
      continue;
    }
  }

  return { valid: false, error: 'Signature verification failed' };
}

/**
 * Generate API key
 */
export function generateApiKey(prefix: string, length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';

  const randomBytes = require('crypto').randomBytes(length);
  for (let i = 0; i < length; i++) {
    key += chars[randomBytes[i] % chars.length];
  }

  return prefix + key;
}

/**
 * Hash API key for storage
 */
export function hashApiKey(key: string): string {
  return createHmac('sha256', 'exora-api-key-salt')
    .update(key)
    .digest('hex');
}

/**
 * Verify API key hash
 */
export function verifyApiKey(key: string, hash: string): boolean {
  const expectedHash = hashApiKey(key);

  try {
    return timingSafeEqual(
      Buffer.from(expectedHash, 'hex'),
      Buffer.from(hash, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Generate webhook secret
 */
export function generateWebhookSecret(): string {
  return 'whsec_' + require('crypto').randomBytes(24).toString('base64url');
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return require('crypto').randomBytes(length).toString('base64url');
}
