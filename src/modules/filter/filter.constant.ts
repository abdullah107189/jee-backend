export const FILTER_MESSAGES = {
  FETCHED: "Filters fetched successfully",
  CREATED: "Filter group created successfully",
  UPDATED: "Filter group updated successfully",
  DELETED: "Filter group deleted successfully",
  NOT_FOUND: "Filter group not found",
  CATEGORY_NOT_FOUND: "Category not found",
  DUPLICATE_CATEGORY: "Filter group already exists for this category",
  SLUG_EXISTS: "Slug already exists",
  INVALID_OPTION: "Invalid filter option",
} as const;

export const FILTER_TYPE_LABELS = {
  MULTI_SELECT: "Multi Select",
  SINGLE_SELECT: "Single Select",
  RANGE: "Range",
  BOOLEAN: "Boolean",
} as const;