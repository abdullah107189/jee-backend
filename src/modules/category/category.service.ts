import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateCategoryInput } from "./category.validation";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export const PUBLIC_CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  parentId: true,
  level: true,
  icon: true,
  _count: {
    select: {
      products: true,
    },
  },
} satisfies Prisma.CategorySelect;

export const CATEGORY_INCLUDE = {
  parent: true,
  _count: { select: { products: true, children: true } },
} satisfies Prisma.CategoryInclude;

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: typeof CATEGORY_INCLUDE;
}>;

const getAll = () => {
  return prisma.category.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    select: PUBLIC_CATEGORY_SELECT,
  });
};

const create = async (
  category: CreateCategoryInput,
): Promise<CategoryWithRelations> => {
  const slug = category.slug ?? generateSlug(category.name);

  try {
    return await prisma.category.create({
      data: {
        name: category.name,
        slug,
        description: category.description,
        parentId: category.parentId,
        icon: category.icon,
        isActive: category.isActive,
      },
      include: CATEGORY_INCLUDE,
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const target = (err.meta?.target as string[])?.join(", ") ?? "field";

      const error = new Error(`Duplicate value for: ${target}`);

      (error as any).status = 409;

      throw error;
    }

    throw err;
  }
};

export const categoryService = {
  getAll,
  create,
};
