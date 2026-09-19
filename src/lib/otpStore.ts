import crypto from 'crypto';

export interface OtpRecord {
  code: string;
  email: string;
  type: 'login' | 'signup';
  name?: string;
  expiresAt: number; // timestamp in ms
  attempts: number;
  createdAt: number;
}

// Global in-memory cache for OTP records
// In Next.js dev mode, global keeps instances persistent across fast-refresh
const globalForOtp = global as unknown as {
  daytrackOtpStore?: Map<string, OtpRecord>;
  daytrackRateLimit?: Map<string, number[]>;
};

const otpStore: Map<string, OtpRecord> =
  globalForOtp.daytrackOtpStore || new Map<string, OtpRecord>();
globalForOtp.daytrackOtpStore = otpStore;

const rateLimitStore: Map<string, number[]> =
  globalForOtp.daytrackRateLimit || new Map<string, number[]>();
globalForOtp.daytrackRateLimit = rateLimitStore;

const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Generate a cryptographically secure 6-digit numeric OTP code
 */
export function generateOtpCode(): string {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Check if the email is rate-limited from requesting new OTPs
 */
export function isRateLimited(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  const timestamps = rateLimitStore.get(normalizedEmail) || [];

  // Filter out timestamps outside the current window
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitStore.set(normalizedEmail, activeTimestamps);

  return activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW;
}

/**
 * Record a new OTP request for rate-limiting purposes
 */
function recordRateLimitRequest(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const timestamps = rateLimitStore.get(normalizedEmail) || [];
  timestamps.push(Date.now());
  rateLimitStore.set(normalizedEmail, timestamps);
}

/**
 * Create and store an OTP for the given email and flow type
 */
export function createOtp(
  email: string,
  type: 'login' | 'signup',
  name?: string
): { success: boolean; code?: string; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();

  if (isRateLimited(normalizedEmail)) {
    return {
      success: false,
      error: 'Too many OTP requests. Please wait a few minutes before trying again.',
    };
  }

  const code = generateOtpCode();
  const now = Date.now();

  const record: OtpRecord = {
    code,
    email: normalizedEmail,
    type,
    name,
    expiresAt: now + OTP_EXPIRATION_MS,
    attempts: 0,
    createdAt: now,
  };

  const storeKey = `${normalizedEmail}:${type}`;
  otpStore.set(storeKey, record);
  recordRateLimitRequest(normalizedEmail);

  return { success: true, code };
}

/**
 * Verify an entered OTP code
 */
export function verifyOtp(
  email: string,
  code: string,
  type: 'login' | 'signup'
): { success: boolean; error?: string; name?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const storeKey = `${normalizedEmail}:${type}`;
  const record = otpStore.get(storeKey);

  if (!record) {
    return {
      success: false,
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(storeKey);
    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.',
    };
  }

  record.attempts += 1;

  if (record.attempts > MAX_ATTEMPTS) {
    otpStore.delete(storeKey);
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, this code has been invalidated. Please request a new one.',
    };
  }

  if (record.code !== code.trim()) {
    return {
      success: false,
      error: `Invalid verification code. ${MAX_ATTEMPTS - record.attempts} attempts remaining.`,
    };
  }

  // OTP is verified! Clean up so it cannot be re-used
  const savedName = record.name;
  otpStore.delete(storeKey);

  return { success: true, name: savedName };
}

/**
 * Retrieve active OTP record for developer assistance / debugging
 */
export function getActiveOtp(email: string, type: 'login' | 'signup'): OtpRecord | undefined {
  const normalizedEmail = email.toLowerCase().trim();
  return otpStore.get(`${normalizedEmail}:${type}`);
}
