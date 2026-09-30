import type { Prisma, FilterType } from "../../../prisma/generated/prisma/client";

/* ─────────── Prisma includes ─────────── */

export const FILTER_GROUP_INCLUDE = {
  category: { select: { id: true, name: true, slug: true, fullSlug: true } },
  filters: {
    orderBy: { sortOrder: "asc" as const },
    include: {
      options: { orderBy: { sortOrder: "asc" as const } },
    },
  },
} satisfies Prisma.FilterGroupInclude;

export type FilterGroupWithRelations = Prisma.FilterGroupGetPayload<{
  include: typeof FILTER_GROUP_INCLUDE;
}>;

/* ─────────── DTOs ─────────── */

export interface FilterOptionDTO {
  id: string;
  value: string;
  label: string | null;
  sortOrder: number;
  productCount?: number;  // available options only
}

export interface FilterDTO {
  id: string;
  name: string;
  label: string;
  type: FilterType;
  sortOrder: number;
  options: FilterOptionDTO[];
}

export interface FilterGroupDTO {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    fullSlug: string;
  };
  filters: FilterDTO[];
}

/* ─────────── Inputs ─────────── */

export interface CreateFilterOptionInput {
  value: string;
  label?: string;
  sortOrder?: number;
}

export interface CreateFilterInput {
  name: string;
  label?: string;
  type: FilterType;
  sortOrder?: number;
  options: CreateFilterOptionInput[];
}

export interface CreateFilterGroupInput {
  name: string;
  slug?: string;
  categoryId: string;
  sortOrder?: number;
  filters: CreateFilterInput[];
}

export interface UpdateFilterOptionInput {
  id?: string;
  value: string;
  label?: string;
  sortOrder?: number;
}

export interface UpdateFilterInput {
  id?: string;
  name: string;
  label?: string;
  type: FilterType;
  sortOrder?: number;
  options: UpdateFilterOptionInput[];
}

export interface UpdateFilterGroupInput {
  name?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
  filters?: UpdateFilterInput[];
}

/* ─────────── Product filter values ─────────── */

export interface ProductFilterValueInput {
  filterId: string;
  filterOptionIds: string[];
}