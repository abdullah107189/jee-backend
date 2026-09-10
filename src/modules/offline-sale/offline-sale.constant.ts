export const OFFLINE_SALE = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const OFFLINE_SALE_MESSAGES = {
  NOT_FOUND: "Offline sale not found",
  ITEM_UNAVAILABLE: "The product item is not available for sale",
  INVOICE_IN_USE: "Invoice number is already in use",
  CREATED: "Offline sale created successfully",
  UPDATED: "Offline sale updated successfully",
  DELETED: "Offline sale removed successfully",
} as const;