import crypto from "crypto";

function normalize(value: unknown): string {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "");
}

function productCode(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // Super Star AC Net Fan -> SSANF
  const code = words.map((word) => word[0]).join("");

  return normalize(code).slice(0, 6);
}

function attributeCode(attributes: Record<string, unknown>): string {
  return Object.entries(attributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => normalize(value).slice(0, 3))
    .filter(Boolean)
    .join("-");
}

export function generateSku(
  productName: string,
  attributes: Record<string, unknown>
): string {
  const product = productCode(productName);
  const attrs = attributeCode(attributes);

  // 6 character base36 unique part
  const unique = crypto
    .randomBytes(4)
    .readUInt32BE(0)
    .toString(36)
    .toUpperCase()
    .slice(0, 6)
    .padStart(6, "0");

  return attrs
    ? `${product}-${attrs}-${unique}`
    : `${product}-${unique}`;
}
