/** Sends a 200 success response. */
export function ok(res, data, message = "Success") {
    return res.status(200).json({ status: "success", message, data });
}
/** Sends a 201 created response. */
export function created(res, data, message = "Created successfully") {
    return res.status(201).json({ status: "success", message, data });
}
/** Sends a paginated list response with meta. */
export function paginated(res, data, page, limit, total, message = "Data retrieved successfully") {
    const totalPages = Math.ceil(total / limit);
    const meta = {
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
export function noContent(res) {
    return res.status(204).send();
}
/**
 * Parses `page` & `limit` query parameters (with sane bounds) so that
 * controllers can safely pass `skip`/`take` to Prisma pagination.
 */
export function parsePagination(query, defaultLimit = 20) {
    const rawPage = typeof query.page === "string" ? parseInt(query.page, 10) : Number.NaN;
    const rawLimit = typeof query.limit === "string" ? parseInt(query.limit, 10) : Number.NaN;
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : defaultLimit;
    return { page, limit, skip: (page - 1) * limit, take: limit };
}
/** Returns a trimmed query-string value or undefined when blank. */
export function queryString(value) {
    return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}
/** Returns a valid ISO date from a query string, or undefined. */
export function queryDate(value) {
    if (typeof value !== "string" || value.trim() === "")
        return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}
//# sourceMappingURL=api.js.map