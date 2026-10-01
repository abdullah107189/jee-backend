import { Prisma } from "../../../prisma/generated/prisma/client";

export async function syncFiltersFromAttributes(
  tx: Prisma.TransactionClient,
  categoryId: string | null | undefined,
  attributes: Record<string, string | number>,
) {
  if (!categoryId) return;

  for (const [key, rawValue] of Object.entries(attributes)) {
    const value = String(rawValue);
    const slug = key.toLowerCase().trim();

    const filter = await tx.filter.upsert({
      where: { slug },
      update: {},
      create: { name: key, slug },
    });

    await tx.filterOption.upsert({
      where: { filterId_value: { filterId: filter.id, value } },
      update: {},
      create: { filterId: filter.id, value },
    });

    await tx.categoryFilter.upsert({
      where: { categoryId_filterId: { categoryId, filterId: filter.id } },
      update: {},
      create: { categoryId, filterId: filter.id },
    });
  }
}
