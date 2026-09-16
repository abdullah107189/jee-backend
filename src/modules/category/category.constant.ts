export const CATEGORY = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  MAX_LEVEL: 3,
} as const;

export const CATEGORY_MESSAGES = {
  FETCHED: "Categories fetched successfully",
  NOT_FOUND: "Category not found",
  SLUG_IN_USE: "Category slug is already in use",
  PARENT_NOT_FOUND: "Parent category not found",
  CREATED: "Category created successfully",
  UPDATED: "Category updated successfully",
  DELETED: "Category removed successfully",
} as const;
