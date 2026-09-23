import { prisma } from "../src/lib/prisma";

interface CategorySeed {
  id: string;
  name: string;
  slug: string;
  fullSlug: string;
  parentId: string | null;
  level: number;
  sortOrder: number;
  icon?: string;
  image?: string;
}

const categories: CategorySeed[] = [
  // ─────────── MAIN (Level 0) ───────────
  {
    id: "cat_fans",
    name: "Fans",
    slug: "fans",
    fullSlug: "fans",
    parentId: null,
    level: 0,
    sortOrder: 1,
  },
  {
    id: "cat_lightings",
    name: "Lightings",
    slug: "lightings",
    fullSlug: "lightings",
    parentId: null,
    level: 0,
    sortOrder: 2,
  },
  {
    id: "cat_ac",
    name: "Air Conditioners",
    slug: "air-conditioners",
    fullSlug: "air-conditioners",
    parentId: null,
    level: 0,
    sortOrder: 3,
  },

  // ─────────── FANS (Level 1) ───────────
  {
    id: "cat_ceiling_fan",
    name: "Ceiling Fan",
    slug: "ceiling-fan",
    fullSlug: "fans/ceiling-fan",
    parentId: "cat_fans",
    level: 1,
    sortOrder: 1,
  },
  {
    id: "cat_table_fan",
    name: "Table Fan",
    slug: "table-fan",
    fullSlug: "fans/table-fan",
    parentId: "cat_fans",
    level: 1,
    sortOrder: 2,
  },
  {
    id: "cat_wall_fan",
    name: "Wall Fan",
    slug: "wall-fan",
    fullSlug: "fans/wall-fan",
    parentId: "cat_fans",
    level: 1,
    sortOrder: 3,
  },
  {
    id: "cat_exhaust_fan",
    name: "Exhaust Fan",
    slug: "exhaust-fan",
    fullSlug: "fans/exhaust-fan",
    parentId: "cat_fans",
    level: 1,
    sortOrder: 4,
  },

  // ─────────── LIGHTINGS (Level 1) ───────────
  {
    id: "cat_led_bulb",
    name: "LED Bulb",
    slug: "led-bulb",
    fullSlug: "lightings/led-bulb",
    parentId: "cat_lightings",
    level: 1,
    sortOrder: 1,
  },
  {
    id: "cat_tube_light",
    name: "Tube Light",
    slug: "tube-light",
    fullSlug: "lightings/tube-light",
    parentId: "cat_lightings",
    level: 1,
    sortOrder: 2,
  },
  {
    id: "cat_panel_light",
    name: "Panel Light",
    slug: "panel-light",
    fullSlug: "lightings/panel-light",
    parentId: "cat_lightings",
    level: 1,
    sortOrder: 3,
  },
  {
    id: "cat_smart_light",
    name: "Smart Light",
    slug: "smart-light",
    fullSlug: "lightings/smart-light",
    parentId: "cat_lightings",
    level: 1,
    sortOrder: 4,
  },

  // ─────────── AIR CONDITIONERS (Level 1) ───────────
  {
    id: "cat_split_ac",
    name: "Split AC",
    slug: "split-ac",
    fullSlug: "air-conditioners/split-ac",
    parentId: "cat_ac",
    level: 1,
    sortOrder: 1,
  },
  {
    id: "cat_window_ac",
    name: "Window AC",
    slug: "window-ac",
    fullSlug: "air-conditioners/window-ac",
    parentId: "cat_ac",
    level: 1,
    sortOrder: 2,
  },
  {
    id: "cat_portable_ac",
    name: "Portable AC",
    slug: "portable-ac",
    fullSlug: "air-conditioners/portable-ac",
    parentId: "cat_ac",
    level: 1,
    sortOrder: 3,
  },
];

async function main() {
  console.log("🌱 Seeding categories...\n");

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { id: cat.id },
    });

    if (existing) {
      console.log(`⏭️  Skip (exists): ${cat.name}`);
      continue;
    }

    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        fullSlug: cat.fullSlug,
        parentId: cat.parentId,
        level: cat.level,
        sortOrder: cat.sortOrder,
        icon: cat.icon,
        image: cat.image,
        isActive: true,
        productCount: 0,
      },
    });

    console.log(`✅ Created: ${cat.name} (${cat.fullSlug})`);
  }

  console.log("\n🎉 Seeding complete!");

  // Print tree
  const all = await prisma.category.findMany({
    orderBy: [{ level: "asc" }, { sortOrder: "asc" }],
  });

  console.log("\n📁 Category Tree:\n");
  for (const cat of all) {
    const indent = "  ".repeat(cat.level);
    console.log(`${indent}${cat.level === 0 ? "📂" : "📄"} ${cat.name}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());