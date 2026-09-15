/* -------------------------------------------------------------------------- */
/* Query Parsers                                                              */
/* -------------------------------------------------------------------------- */
export function queryString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (Array.isArray(value)) return queryString(value[0]);

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number") return String(value);

  return undefined;
}

export function queryStringArray(value: unknown): string[] {
  const raw = queryString(value);
  if (!raw) return [];

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function queryNumber(value: unknown): number | undefined {
  const raw = queryString(value);
  if (raw === undefined) return undefined;

  const num = Number(raw);
  return Number.isFinite(num) ? num : undefined;
}

export function toBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (["true", "1", "yes"].includes(lower)) return true;
    if (["false", "0", "no"].includes(lower)) return false;
  }

  if (typeof value === "number") return value !== 0;

  return undefined;
}

/* -------------------------------------------------------------------------- */
/* Sort                                                                       */
/* -------------------------------------------------------------------------- */
export const SORT_OPTIONS = [
  "popular",
  "price-asc",
  "price-desc",
  "newest",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export function querySort(value: unknown): SortOption | undefined {
  const raw = queryString(value);
  return SORT_OPTIONS.includes(raw as SortOption)
    ? (raw as SortOption)
    : undefined;
}