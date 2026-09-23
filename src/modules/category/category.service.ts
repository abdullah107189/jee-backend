import AppError from "../../errors/AppError";
import { CATEGORY, CATEGORY_MESSAGES } from "./category.constant";
import { categoryRepository } from "./category.repository";
import type {
  CategoryNavItem,
  CategoryDetail,
  CreateCategoryInput,
  UpdateCategoryInput,
  ReorderCategoriesInput,
  CategoryQuery,
} from "./category.type";

/* ─────────── Helpers ─────────── */

const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/** Build tree from flat list */
const buildTree = (
  flat: Array<{
    id: string;
    parentId: string | null;
    name: string;
    slug: string;
    fullSlug: string;
    icon: string | null;
    image: string | null;
    level: number;
    sortOrder: number;
    productCount: number;
  }>,
): CategoryNavItem[] => {
  const map = new Map<string, CategoryNavItem>();
  const roots: CategoryNavItem[] = [];

  // First pass: create nodes
  for (const item of flat) {
    map.set(item.id, {
      id: item.id,
      name: item.name,
      slug: item.slug,
      fullSlug: item.fullSlug,
      icon: item.icon,
      image: item.image,
      level: item.level,
      sortOrder: item.sortOrder,
      productCount: item.productCount,
      children: [],
    });
  }

  // Second pass: link
  for (const item of flat) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};

/** Compute fullSlug from parent */
const computeFullSlug = async (
  slug: string,
  parentId?: string | null,
): Promise<{ fullSlug: string; level: number }> => {
  if (!parentId) {
    return { fullSlug: slug, level: 0 };
  }

  const parent = await categoryRepository.findById(parentId);
  if (!parent) {
    throw new AppError(CATEGORY_MESSAGES.PARENT_NOT_FOUND, 404);
  }

  const level = parent.level + 1;
  if (level > CATEGORY.MAX_LEVEL) {
    throw new AppError(CATEGORY_MESSAGES.MAX_DEPTH, 400);
  }

  return {
    fullSlug: `${parent.fullSlug}/${slug}`,
    level,
  };
};

/** Check circular parent — new parent cannot be a descendant */
const checkCircularParent = async (
  categoryId: string,
  newParentId: string,
): Promise<void> => {
  if (categoryId === newParentId) {
    throw new AppError(CATEGORY_MESSAGES.CIRCULAR_PARENT, 400);
  }

  const category = await categoryRepository.findById(categoryId);
  if (!category) return;

  const descendants = await categoryRepository.findDescendantsByFullSlug(
    category.fullSlug,
  );

  if (descendants.some((d) => d.id === newParentId)) {
    throw new AppError(CATEGORY_MESSAGES.CIRCULAR_PARENT, 400);
  }
};

/* ─────────── Read ─────────── */

const getNav = async (): Promise<CategoryNavItem[]> => {
  const flat = await categoryRepository.findManyForNav();
  return buildTree(flat);
};

const getAll = async (query: CategoryQuery) => {
  const params = {
    isActive: query.isActive,
    parentId: query.parentId,
    level: query.level,
    search: query.search,
  };

  const categories = await categoryRepository.findMany(params);
  return categories;
};

const getBySlug = async (slug: string): Promise<CategoryDetail> => {
  const category = await categoryRepository.findBySlug(slug);

  if (!category) {
    throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    fullSlug: category.fullSlug,
    description: category.description,
    icon: category.icon,
    image: category.image,
    level: category.level,
    sortOrder: category.sortOrder,
    productCount: category.productCount,
    isActive: category.isActive,
    parent: category.parent,
    children: category.children,
    productCountRaw: category._count.products,
  };
};

const getById = async (id: string) => {
  const category = await categoryRepository.findById(id);
  if (!category) throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    fullSlug: category.fullSlug,
    description: category.description,
    icon: category.icon,
    image: category.image,
    level: category.level,
    sortOrder: category.sortOrder,
    productCount: category.productCount,
    isActive: category.isActive,
    parentId: category.parentId,
    parent: category.parent,
    children: category.children,
  };
};
/** All descendant category IDs (for product listing) */
const getDescendantIds = async (categoryId: string): Promise<string[]> => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) return [];

  const descendants = await categoryRepository.findDescendantsByFullSlug(
    category.fullSlug,
  );

  return [category.id, ...descendants.map((d) => d.id)];
};

/* ─────────── Write ─────────── */

const create = async (input: CreateCategoryInput) => {
  const slug = input.slug ?? generateSlug(input.name);

  // Check unique
  const [existingName, existingSlug] = await Promise.all([
    categoryRepository.findByName(input.name),
    categoryRepository.findBySlugRaw(slug),
  ]);

  if (existingName) throw new AppError(CATEGORY_MESSAGES.NAME_EXISTS, 409);
  if (existingSlug) throw new AppError(CATEGORY_MESSAGES.SLUG_EXISTS, 409);

  // Compute fullSlug + level
  const { fullSlug, level } = await computeFullSlug(slug, input.parentId);

  return categoryRepository.create({
    name: input.name,
    slug,
    description: input.description,
    parent: input.parentId ? { connect: { id: input.parentId } } : undefined,
    icon: input.icon,
    image: input.image,
    sortOrder: input.sortOrder ?? CATEGORY.DEFAULT_SORT_ORDER,
    isActive: input.isActive ?? true,
    fullSlug,
    level,
  });
};

const update = async (id: string, input: UpdateCategoryInput) => {
  const existing = await categoryRepository.findById(id);
  if (!existing) throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);

  const data: any = {};

  // Name change
  if (input.name && input.name !== existing.name) {
    const dup = await categoryRepository.findByName(input.name);
    if (dup && dup.id !== id) {
      throw new AppError(CATEGORY_MESSAGES.NAME_EXISTS, 409);
    }
    data.name = input.name;
  }

  // Slug change
  if (input.slug && input.slug !== existing.slug) {
    const dup = await categoryRepository.findBySlugRaw(input.slug);
    if (dup && dup.id !== id) {
      throw new AppError(CATEGORY_MESSAGES.SLUG_EXISTS, 409);
    }
    data.slug = input.slug;
  }

  // Parent change → recompute fullSlug + level
  const parentChanged =
    input.parentId !== undefined && input.parentId !== existing.parentId;

  if (parentChanged) {
    if (input.parentId) {
      await checkCircularParent(id, input.parentId);
    }

    const newSlug = data.slug ?? existing.slug;
    const { fullSlug, level } = await computeFullSlug(newSlug, input.parentId);

    data.fullSlug = fullSlug;
    data.level = level;
    data.parent = input.parentId
      ? { connect: { id: input.parentId } }
      : { disconnect: true };
  }

  if (input.description !== undefined) data.description = input.description;
  if (input.icon !== undefined) data.icon = input.icon;
  if (input.image !== undefined) data.image = input.image;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return categoryRepository.update(id, data);
};

const remove = async (id: string) => {
  const category = await categoryRepository.findById(id);
  if (!category) throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);

  // Check children
  const children = await categoryRepository.findChildren(id);
  if (children.length > 0) {
    throw new AppError(CATEGORY_MESSAGES.HAS_CHILDREN, 400);
  }

  // Check products
  const productCount = await categoryRepository.countProducts(id);
  if (productCount > 0) {
    throw new AppError(CATEGORY_MESSAGES.HAS_PRODUCTS, 400);
  }

  return categoryRepository.softDelete(id);
};

const reorder = async (input: ReorderCategoriesInput) => {
  await categoryRepository.reorder(input.items);
  return { message: "Reordered successfully" };
};

/** Recalculate productCount for a category */
const refreshProductCount = async (categoryId: string) => {
  const count = await categoryRepository.countProducts(categoryId);
  return categoryRepository.updateProductCount(categoryId, count);
};

/* ─────────── Export ─────────── */

export const categoryService = {
  getNav,
  getAll,
  getBySlug,
  getById,
  getDescendantIds,
  create,
  update,
  remove,
  reorder,
  refreshProductCount,
};
