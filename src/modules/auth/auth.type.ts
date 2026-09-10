import type { Prisma } from "../../../prisma/generated/prisma/client";

/** Scalar fields exposed on the authenticated user (no password). */
export const AUTH_USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  isVerified: true,
} satisfies Prisma.UserSelect;

export type AuthUser = Prisma.UserGetPayload<{ select: typeof AUTH_USER_SELECT }>;

// --- Request DTOs (not expressible by Prisma input types) ---

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  /** Email or phone number. */
  identifier: string;
  password: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  tokenExpiresIn: number;
}

export interface ForgotPasswordResponse {
  resetToken: string | null;
  expiresIn: string;
  message: string;
}