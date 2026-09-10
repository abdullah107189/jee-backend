export function pass(value) {
    return { ok: true, value };
}
export function fail(errors) {
    return { ok: false, errors };
}
export function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function isSlug(value) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
export function inRange(value, min, max) {
    return Number.isFinite(value) && value >= min && value <= max;
}
export function isBoolean(value) {
    return typeof value === "boolean" || value === "true" || value === "false";
}
export function toBoolean(value) {
    if (typeof value === "boolean")
        return value;
    return value === "true";
}
/**
 * Accepts either an already-parsed JSON value or a JSON string and returns the
 * value (or undefined when it cannot be parsed).
 */
export function parseJson(value) {
    if (value === undefined || value === null || value === "")
        return undefined;
    if (typeof value !== "string")
        return value;
    try {
        return JSON.parse(value);
    }
    catch {
        return undefined;
    }
}
/** Converts arbitrary text into a URL-safe slug. */
export function slugify(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");
}
/** Strips a leading/trailing `/` from a route segment. */
export function normalizeReference(value) {
    return value.trim().replace(/^\/+|\/+$/g, "");
}
//# sourceMappingURL=validation.js.map