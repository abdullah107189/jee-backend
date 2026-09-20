import type { OrderStatus } from "../../../prisma/generated/prisma/client";

export const ORDER_STATUSES: readonly OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export const ORDER = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const ORDER_MESSAGES = {
  FETCHED: "Orders fetched successfully",
  FETCHED_ONE: "Order fetched successfully",
  NOT_FOUND: "Order not found",
  ITEMS_UNAVAILABLE: "One or more product items are not available for purchase",
  CREATED: "Order created successfully",
  UPDATED: "Order updated successfully",
  CANCELLED: "Order cancelled successfully",
} as const;
