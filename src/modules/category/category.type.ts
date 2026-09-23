import type { Category, Prisma } from "../../../prisma/generated/prisma/client";

/* ─────────── Prisma Include ─────────── */

export const CATEGORY_NAV_SELECT = {
  id: true,
  name: true,
  slug: true,
  icon: true,
  image: true,
  fullSlug: true,
  level: true,
  sortOrder: true,
  productCount: true,
  parentId: true,
} satisfies Prisma.CategorySelect;

export const CATEGORY_DETAIL_INCLUDE = {
  parent: {
    select: {
      id: true,
      name: true,
      slug: true,
      fullSlug: true,
    },
  },
  children: {
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      image: true,
      fullSlug: true,
      productCount: true,
      sortOrder: true,
    },
    orderBy: { sortOrder: "asc" },
  },
  _count: {
    select: { products: true },
  },
} satisfies Prisma.CategoryInclude;

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: typeof CATEGORY_DETAIL_INCLUDE;
}>;

/* ─────────── DTOs (Response shapes) ─────────── */

/** Lightweight — for navbar */
export interface CategoryNavItem {
  id: string;
  name: string;
  slug: string;
  fullSlug: string;
  icon: string | null;
  image: string | null;
  level: number;
  sortOrder: number;
  productCount: number;
  children: CategoryNavItem[];
}

/** Full detail — for category page */
export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  fullSlug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  level: number;
  sortOrder: number;
  productCount: number;
  isActive: boolean;
  parent: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
  } | null;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
    icon: string | null;
    image: string | null;
    productCount: number;
    sortOrder: number;
  }>;
  productCountRaw: number;
}

/* ─────────── Inputs ─────────── */

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  icon?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  icon?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ReorderCategoriesInput {
  items: Array<{ id: string; sortOrder: number }>;
}

export interface CategoryQuery {
  isActive?: boolean;
  parentId?: string | null;
  level?: number;
  search?: string;
}