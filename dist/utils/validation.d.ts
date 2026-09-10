export type ValidationResult<T> = {
    ok: true;
    value: T;
} | {
    ok: false;
    errors: string[];
};
export declare function pass<T>(value: T): ValidationResult<T>;
export declare function fail(errors: string[]): ValidationResult<never>;
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function isEmail(value: string): boolean;
export declare function isSlug(value: string): boolean;
export declare function inRange(value: number, min: number, max: number): boolean;
export declare function isBoolean(value: unknown): boolean;
export declare function toBoolean(value: unknown): boolean;
/**
 * Accepts either an already-parsed JSON value or a JSON string and returns the
 * value (or undefined when it cannot be parsed).
 */
export declare function parseJson(value: unknown): unknown;
/** Converts arbitrary text into a URL-safe slug. */
export declare function slugify(value: string): string;
/** Strips a leading/trailing `/` from a route segment. */
export declare function normalizeReference(value: string): string;
