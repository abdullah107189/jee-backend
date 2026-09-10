import type { ClaimStatus } from "../../../prisma/generated/prisma/client";

export const CLAIM_STATUSES: readonly ClaimStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "UNDER_REPAIR",
  "COMPLETED",
  "CANCELLED",
];

export const WARRANTY_CLAIM = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const WARRANTY_CLAIM_MESSAGES = {
  NOT_FOUND: "Warranty claim not found",
  WARRANTY_NOT_FOUND: "Warranty not found",
  ALREADY_CLAIMED: "A claim is already under review for this warranty",
  CREATED: "Warranty claim submitted successfully",
  UPDATED: "Warranty claim updated successfully",
} as const;