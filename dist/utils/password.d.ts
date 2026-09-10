/**
 * Hashes a password with a random per-password salt using Node's built-in
 * scrypt (no external bcrypt dependency). Format: `scrypt:<salt>:<hash>`.
 */
export declare function hashPassword(password: string): string;
/** Constant-time comparison of a plain-text password against a stored hash. */
export declare function verifyPassword(password: string, storedHash: string): boolean;
/** Generates a numeric OTP (default 6 digits). */
export declare function generateOtp(length?: number): string;
/** Generates a cryptographically-random hexadecimal nonce. */
export declare function generateNonce(bytes?: number): string;
