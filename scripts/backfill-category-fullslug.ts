import { prisma } from "../src/lib/prisma";

 

async function buildFullSlug(categoryId: string): Promise<string> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { slug: true, parentId: true },
  });

  if (!category) return "";

  if (!category.parentId) {
    return category.slug;
  }

  const parentSlug = await buildFullSlug(category.parentId);
  return `${parentSlug}/${category.slug}`;
}

async function main() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
  });

  console.log(`Found ${categories.length} categories`);

  for (const cat of categories) {
    const fullSlug = await buildFullSlug(cat.id);

    await prisma.category.update({
      where: { id: cat.id },
      data: { fullSlug },
    });

    console.log(`✅ ${cat.name} → ${fullSlug}`);
  }

  // Count products per category
  console.log("\nUpdating productCount...");

  const allCategories = await prisma.category.findMany({
    select: { id: true },
  });

  for (const cat of allCategories) {
    const count = await prisma.product.count({
      where: {
        categoryId: cat.id,
        isPublished: true,
        isActive: true,
        deletedAt: null,
      },
    });

    await prisma.category.update({
      where: { id: cat.id },
      data: { productCount: count },
    });
  }

  console.log(`✅ All done.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());