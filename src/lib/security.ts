// Security utilities for PrintFlow Inventory System
// Implements OWASP security best practices

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and potentially dangerous characters
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize input for database queries
 * Escapes special characters that could be used for injection
 */
export function sanitizeForQuery(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\x00/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z');
}

/**
 * Generate a cryptographically secure random string
 * Used for CSRF tokens, session IDs, etc.
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate and sanitize URL to prevent open redirect vulnerabilities
 */
export function sanitizeRedirectUrl(url: string, allowedOrigins: string[] = []): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow same-origin redirects by default
    if (parsed.origin === window.location.origin) {
      return parsed.pathname + parsed.search;
    }
    
    // Check against allowed external origins
    if (allowedOrigins.includes(parsed.origin)) {
      return url;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Rate limiting helper for client-side
 * Returns true if action should be blocked
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function isRateLimited(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= maxAttempts) {
    return true;
  }
  
  record.count++;
  return false;
}

/**
 * Clear rate limit for a key (e.g., after successful login)
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Content Security Policy headers (for reference)
 * These should be set on the server side
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/**
 * Password strength checker
 * Returns a score from 0-100
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 20;
  else feedback.push('Password should be at least 8 characters');
  
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  if (/[a-z]/.test(password)) score += 10;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 10;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) score += 10;
  else feedback.push('Add numbers');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;
  else feedback.push('Add special characters');
  
  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'admin'];
  const lowerPassword = password.toLowerCase();
  if (commonPatterns.some(pattern => lowerPassword.includes(pattern))) {
    score -= 30;
    feedback.push('Avoid common words and patterns');
  }
  
  // Check for sequential characters
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('Avoid repeated characters');
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback,
  };
}

/**
 * Session timeout handler
 */
export function createSessionTimeout(
  timeoutMs: number,
  onTimeout: () => void
): { reset: () => void; clear: () => void } {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  const reset = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(onTimeout, timeoutMs);
  };
  
  const clear = () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
  
  reset();
  
  return { reset, clear };
}

/**
 * Mask sensitive data for display
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) return '*'.repeat(data.length);
  return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
}

/**
 * Format currency for Philippine Peso
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}
