export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

export function pass<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

export function fail(errors: string[]): ValidationResult<never> {
  return { ok: false, errors };
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function inRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function isBoolean(value: unknown): boolean {
  return typeof value === "boolean" || value === "true" || value === "false";
}

export function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  return value === "true";
}

/**
 * Accepts either an already-parsed JSON value or a JSON string and returns the
 * value (or undefined when it cannot be parsed).
 */
export function parseJson(value: unknown): unknown {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

/** Converts arbitrary text into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/** Strips a leading/trailing `/` from a route segment. */
export function normalizeReference(value: string): string {
  return value.trim().replace(/^\/+|\/+$/g, "");
}