export const CATEGORY_MESSAGES = {
  FETCHED: "Categories fetched successfully",
  FETCHED_ONE: "Category fetched successfully",
  CREATED: "Category created successfully",
  UPDATED: "Category updated successfully",
  DELETED: "Category deleted successfully",
  NOT_FOUND: "Category not found",
  SLUG_EXISTS: "Category with this slug already exists",
  NAME_EXISTS: "Category with this name already exists",
  PARENT_NOT_FOUND: "Parent category not found",
  CIRCULAR_PARENT: "Cannot set a descendant as parent",
  MAX_DEPTH: "Category nesting is too deep (max 3 levels)",
  HAS_CHILDREN: "Cannot delete category with sub-categories",
  HAS_PRODUCTS: "Cannot delete category with products",
} as const;

export const CATEGORY = {
  MAX_LEVEL: 3, // 0, 1, 2
  DEFAULT_SORT_ORDER: 0,
} as const;
