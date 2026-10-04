import type { Request } from "express";

/* ═══════════════════════════════════════════════════════════
   PAGINATION
   ═══════════════════════════════════════════════════════════ */

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Parse page + limit from query */
export function parsePagination(query: Request["query"]): PaginationParams {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

/** Build meta — pass total + parsed params */
export function buildPaginationMeta(
  total: number,
  params: PaginationParams,
): PaginationMeta {
  const totalPages = Math.ceil(total / params.limit) || 1;

  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPrevPage: params.page > 1,
  };
}

/** One-shot: return pagination meta (spread into response) */
export function paginate(
  total: number,
  params: PaginationParams,
): PaginationMeta {
  return buildPaginationMeta(total, params);
}

/* ═══════════════════════════════════════════════════════════
   QUERY SPLIT (known + dynamic filter)
   ═══════════════════════════════════════════════════════════ */

export const DEFAULT_KNOWN_KEYS = new Set([
  "page",
  "limit",
  "sortBy",
  "sort",
  "minPrice",
  "maxPrice",
  "brandId",
  "brand",
  "warrantyMonths",
  "search",
  "categoryId",
  "isActive",
  "isPublished",
]);

/** Split query → known params + dynamic filter */
export function splitQuery(
  query: Request["query"],
  knownKeys: Set<string> = DEFAULT_KNOWN_KEYS,
): {
  known: Record<string, string>;
  filter: Record<string, string>;
} {
  const known: Record<string, string> = {};
  const filter: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    const strValue = String(value);
    if (knownKeys.has(key)) known[key] = strValue;
    else filter[key] = strValue;
  }

  return { known, filter };
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
export async function paginatedQuery<
  TModel extends {
    findMany: (args: any) => Promise<any[]>;
    count: (args: any) => Promise<number>;
  },
>(
  model: TModel,
  options: {
    where?: any;
    orderBy?: any;
    select?: any;
    include?: any;
    page?: number;
    limit?: number;
    skip?: number;
    take?: number;
  } = {},
): Promise<PaginatedResult<any>> {
  const page = Math.max(1, options.page ?? DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, options.limit ?? DEFAULT_LIMIT),
  );
  const skip = options.skip ?? (page - 1) * limit;
  const take = options.take ?? limit;

  const [items, total] = await Promise.all([
    model.findMany({
      where: options.where,
      orderBy: options.orderBy,
      select: options.select,
      include: options.include,
      skip,
      take,
    }),
    model.count({ where: options.where }),
  ]);

  const meta = buildPaginationMeta(total, { page, limit, skip, take });

  return { items, meta };
}
