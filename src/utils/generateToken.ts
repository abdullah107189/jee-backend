// src/shared/utils/generateToken.ts

import jwt from "jsonwebtoken";

// ======================================================
// ACCESS TOKEN
// ======================================================

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    {
      userId,
      role,
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      // expiresIn: "15m",
      expiresIn: "10s", // For testing purposes, set to 10 seconds. Change to "15m" in production.
    },
  );
};

// ======================================================
// REFRESH TOKEN
// ======================================================

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      // expiresIn: "7d",
      expiresIn: "1m", // For testing purposes, set to 1 minute. Change to "7d" in production.
    },
  );
};

// ======================================================
// VERIFY ACCESS TOKEN
// IMPORTANT:
// Do NOT swallow TokenExpiredError
// ======================================================

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
};

// ======================================================
// VERIFY REFRESH TOKEN
// ======================================================

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};

// ======================================================
// BACKWARD COMPATIBILITY
// ======================================================

export const generateToken = generateAccessToken;

export const verifyToken = verifyAccessToken;
