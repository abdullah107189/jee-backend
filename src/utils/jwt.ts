import crypto from "node:crypto";

export interface JwtPayload {
  sub: string;
  purpose?: string;
  [key: string]: unknown;
}

interface JwtHeader {
  alg: string;
  typ: string;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * Signs a JWT (HS256) using only Node's built-in crypto — no extra dependency.
 */
export function signToken(payload: JwtPayload, secret: string, expiresInSeconds: number): string {
  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies signature + expiry. Throws on malformed / invalid / expired tokens.
 */
export function verifyToken(token: string, secret: string): JwtPayload {
  const [encodedHeader, encodedPayload, signature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error("Invalid token format");
  }

  const expected = sign(`${encodedHeader}.${encodedPayload}`, secret);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (provided.length !== expectedBuffer.length || !crypto.timingSafeEqual(provided, expectedBuffer)) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;

  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
    throw new Error("Token has expired");
  }

  return payload;
}

/** Safely decodes a token without verification (e.g. for pre-processing). */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const [, encodedPayload] = token.split(".");
    return encodedPayload ? (JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload) : null;
  } catch {
    return null;
  }
}