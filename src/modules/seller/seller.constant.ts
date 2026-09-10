import type { SellerStatus } from "../../../prisma/generated/prisma/client";

export const SELLER_STATUSES: readonly SellerStatus[] = ["PENDING", "APPROVED", "SUSPENDED", "DISABLED"];

export const SELLER = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const SELLER_MESSAGES = {
  NOT_FOUND: "Seller not found",
  EMAIL_IN_USE: "A user with this email already exists",
  CREATED: "Seller created successfully",
  UPDATED: "Seller updated successfully",
  DELETED: "Seller removed successfully",
  PROFILE_UPDATED: "Seller profile updated successfully",
} as const;