import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Verify a session token is valid and not expired.
 * This is a standalone utility that can be used in middleware.
 */
export function verifySessionToken(token: string, secret: string): boolean {
  try {
    const parts = token.split(':')
    if (parts.length !== 3) return false

    const [randomId, expiresAtStr, providedSignature] = parts
    const expiresAt = parseInt(expiresAtStr, 10)

    // Check expiration
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false
    }

    // Verify signature
    const payload = `${randomId}:${expiresAtStr}`
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Use constant-time comparison to prevent timing attacks
    const providedBuffer = Buffer.from(providedSignature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (providedBuffer.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(providedBuffer, expectedBuffer)
  } catch {
    return false
  }
}
