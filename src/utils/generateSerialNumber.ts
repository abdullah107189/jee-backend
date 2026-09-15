export function generateSerialNumber(sku: string, index: number) {
  return `${sku}-${String(index + 1).padStart(4, "0")}`;
}
