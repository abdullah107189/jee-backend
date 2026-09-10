import crypto from "node:crypto";
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 };
/**
 * Hashes a password with a random per-password salt using Node's built-in
 * scrypt (no external bcrypt dependency). Format: `scrypt:<salt>:<hash>`.
 */
export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH, SCRYPT_OPTIONS);
    return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}
/** Constant-time comparison of a plain-text password against a stored hash. */
export function verifyPassword(password, storedHash) {
    const [scheme, salt, hash] = storedHash.split(":");
    if (scheme !== "scrypt" || !salt || !hash)
        return false;
    const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH, SCRYPT_OPTIONS);
    const expected = Buffer.from(hash, "hex");
    const actual = derivedKey;
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}
/** Generates a numeric OTP (default 6 digits). */
export function generateOtp(length = 6) {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return String(crypto.randomInt(min, max + 1));
}
/** Generates a cryptographically-random hexadecimal nonce. */
export function generateNonce(bytes = 24) {
    return crypto.randomBytes(bytes).toString("hex");
}
