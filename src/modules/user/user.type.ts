import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";

/** Scalar fields we safely expose for a user (no password). */
export const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  phone: true,
  firstName: true,
  lastName: true,
  role: true,
  isVerified: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof PUBLIC_USER_SELECT }>;

/**
 * Fields an admin may set when creating a user. Derived from Prisma's own
 * input type by omitting ids, timestamps and relational fields.
 */
export type CreateUserInput = Omit<
  Prisma.UserUncheckedCreateInput,
  "id" | "createdAt" | "updatedAt" | "lastLogin" | "deletedAt" | "admin" | "seller" | "customer" | "notifications" | "auditLogs" | "activityLogs"
>;

/** Update payloads also follow Prisma's own update input type. */
export type UpdateUserInput = Prisma.UserUpdateInput;

export interface UserQuery {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListUsersResult {
  users: PublicUser[];
  total: number;
}