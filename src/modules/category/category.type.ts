import type { Prisma } from "../../../prisma/generated/prisma/client";

export const CATEGORY_INCLUDE = {
  _count: { select: { children: true, products: true } },
} satisfies Prisma.CategoryInclude;

export type CategoryWithCount = Prisma.CategoryGetPayload<{ include: typeof CATEGORY_INCLUDE }>;

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  parentId?: string | null;
  level?: number;
  icon?: string | null;
  isActive?: boolean;
}

export type UpdateCategoryInput = Prisma.CategoryUpdateInput;

export interface CategoryQuery {
  search?: string;
  /** Supply `null` to list only root categories; omit to list all. */
  parentId?: string | null;
  isActive?: boolean;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListCategoriesResult {
  categories: CategoryWithCount[];
  total: number;
}