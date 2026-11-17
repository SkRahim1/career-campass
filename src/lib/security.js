/**
 * Security utility functions for Career Compass portal.
 * Centralizes input validation, sanitization, and rate-limiting helpers.
 */

/**
 * Sanitizes a URL to prevent javascript: protocol injection attacks.
 * Only allows http:// and https:// URLs.
 * @param {string} url - Raw URL input from user
 * @returns {string} Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return '';
  }
  try {
    // Validate it is actually a parseable URL
    new URL(trimmed);
    return trimmed;
  } catch {
    return '';
  }
}

/**
 * Validates an Indian mobile number (10 digits, starts with 6-9).
 * @param {string} mobile - Mobile number string
 * @returns {boolean}
 */
export function isValidIndianMobile(mobile) {
  return /^[6-9]\d{9}$/.test((mobile || '').replace(/\s+/g, ''));
}

/**
 * Checks password strength requirements.
 * Minimum 8 characters, at least one uppercase, one number.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  return { valid: true, message: '' };
}

/**
 * Sanitizes a text input to remove leading/trailing whitespace and limit length.
 * Does NOT strip HTML (React handles XSS by default).
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeText(text, maxLength = 500) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().slice(0, maxLength);
}

/**
 * Client-side login attempt rate limiter.
 * Tracks failed attempts in memory (not localStorage) to prevent manipulation.
 */
const loginAttempts = {
  count: 0,
  firstAttemptTime: null,
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_ATTEMPTS: 5,
};

export function checkLoginRateLimit() {
  const now = Date.now();
  if (loginAttempts.firstAttemptTime && now - loginAttempts.firstAttemptTime > loginAttempts.WINDOW_MS) {
    // Reset window
    loginAttempts.count = 0;
    loginAttempts.firstAttemptTime = null;
  }
  if (loginAttempts.count >= loginAttempts.MAX_ATTEMPTS) {
    const remaining = Math.ceil((loginAttempts.WINDOW_MS - (now - loginAttempts.firstAttemptTime)) / 1000);
    throw new Error(`Too many failed login attempts. Please wait ${remaining} seconds before trying again.`);
  }
}

export function recordFailedLogin() {
  if (!loginAttempts.firstAttemptTime) {
    loginAttempts.firstAttemptTime = Date.now();
  }
  loginAttempts.count++;
}

export function resetLoginAttempts() {
  loginAttempts.count = 0;
  loginAttempts.firstAttemptTime = null;
}
