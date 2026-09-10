import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

/** Sends a 200 success response. */
export function ok(res: Response, data: unknown, message = "Success"): Response {
  return res.status(200).json({ status: "success", message, data });
}

/** Sends a 201 created response. */
export function created(res: Response, data: unknown, message = "Created successfully"): Response {
  return res.status(201).json({ status: "success", message, data });
}

/** Sends a paginated list response with meta. */
export function paginated(
  res: Response,
  data: unknown,
  page: number,
  limit: number,
  total: number,
  message = "Data retrieved successfully",
): Response {
  const totalPages = Math.ceil(total / limit);
  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
  return res.status(200).json({ status: "success", message, data, meta });
}

/** Returns a 204 no-content response. */
export function noContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Parses `page` & `limit` query parameters (with sane bounds) so that
 * controllers can safely pass `skip`/`take` to Prisma pagination.
 */
export function parsePagination(query: Record<string, unknown>, defaultLimit = 20): PaginationResult {
  const rawPage = typeof query.page === "string" ? parseInt(query.page, 10) : Number.NaN;
  const rawLimit = typeof query.limit === "string" ? parseInt(query.limit, 10) : Number.NaN;
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : defaultLimit;
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

/** Returns a trimmed query-string value or undefined when blank. */
export function queryString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

/** Returns a valid ISO date from a query string, or undefined. */
export function queryDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}