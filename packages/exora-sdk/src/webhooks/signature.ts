import { createHmac, timingSafeEqual } from 'crypto';

export interface SignatureVerificationResult {
  valid: boolean;
  error?: string;
}

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
): SignatureVerificationResult {
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
