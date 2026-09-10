import type { Prisma } from "../../../prisma/generated/prisma/client";

export const BRAND_INCLUDE = {
  _count: { select: { products: true } },
} satisfies Prisma.BrandInclude;

export type BrandWithCount = Prisma.BrandGetPayload<{ include: typeof BRAND_INCLUDE }>;

export interface CreateBrandInput {
  name: string;
  slug?: string;
  logo?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export type UpdateBrandInput = Prisma.BrandUpdateInput;

export interface BrandQuery {
  search?: string;
  isActive?: boolean;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListBrandsResult {
  brands: BrandWithCount[];
  total: number;
}