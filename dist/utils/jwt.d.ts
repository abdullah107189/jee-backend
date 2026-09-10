export interface JwtPayload {
    sub: string;
    purpose?: string;
    [key: string]: unknown;
}
/**
 * Signs a JWT (HS256) using only Node's built-in crypto — no extra dependency.
 */
export declare function signToken(payload: JwtPayload, secret: string, expiresInSeconds: number): string;
/**
 * Verifies signature + expiry. Throws on malformed / invalid / expired tokens.
 */
export declare function verifyToken(token: string, secret: string): JwtPayload;
/** Safely decodes a token without verification (e.g. for pre-processing). */
export declare function decodeToken(token: string): JwtPayload | null;
