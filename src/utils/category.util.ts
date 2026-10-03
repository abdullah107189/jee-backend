import { prisma } from "../lib/prisma";

export async function getCategoryWithDescendants(fullSlug: string) {
  // fullSlug diye khoj — slug na (slug sudhu last part)
  const category = await prisma.category.findFirst({
    where: { fullSlug, deletedAt: null },
  });

  if (!category) {
    throw new Error(`Category not found: ${fullSlug}`);
  }

  const descendants = await prisma.$queryRaw<{ id: string }[]>`
    WITH RECURSIVE category_tree AS (
      SELECT id, "parentId"
      FROM categories
      WHERE id = ${category.id}

      UNION ALL

      SELECT c.id, c."parentId"
      FROM categories c
      INNER JOIN category_tree ct ON c."parentId" = ct.id
    )
    SELECT id FROM category_tree;
  `;

  return { category, categoryIds: descendants.map((d) => d.id) };
}
