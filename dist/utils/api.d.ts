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
export declare function ok(res: Response, data: unknown, message?: string): Response;
/** Sends a 201 created response. */
export declare function created(res: Response, data: unknown, message?: string): Response;
/** Sends a paginated list response with meta. */
export declare function paginated(res: Response, data: unknown, page: number, limit: number, total: number, message?: string): Response;
/** Returns a 204 no-content response. */
export declare function noContent(res: Response): Response;
/**
 * Parses `page` & `limit` query parameters (with sane bounds) so that
 * controllers can safely pass `skip`/`take` to Prisma pagination.
 */
export declare function parsePagination(query: Record<string, unknown>, defaultLimit?: number): PaginationResult;
/** Returns a trimmed query-string value or undefined when blank. */
export declare function queryString(value: unknown): string | undefined;
/** Returns a valid ISO date from a query string, or undefined. */
export declare function queryDate(value: unknown): Date | undefined;
