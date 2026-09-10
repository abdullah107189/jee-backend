export const CUSTOMER = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const CUSTOMER_MESSAGES = {
  NOT_FOUND: "Customer not found",
  EMAIL_IN_USE: "A user with this email already exists",
  CREATED: "Customer created successfully",
  UPDATED: "Customer updated successfully",
  DELETED: "Customer removed successfully",
  PROFILE_UPDATED: "Customer profile updated successfully",
} as const;