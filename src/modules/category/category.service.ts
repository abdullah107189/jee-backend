import { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { slugify } from "../../utils/validation";
import { CATEGORY, CATEGORY_MESSAGES } from "./category.constant";
import { categoryRepository } from "./category.repository";
import type {
  CategoryWithCount,
  CategoryQuery,
  CreateCategoryInput,
  ListCategoriesResult,
} from "./category.type";

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export const categoryService = {
  async list(query: CategoryQuery): Promise<ListCategoriesResult> {
    const params = {
      search: query.search,
      parentId: query.parentId,
      isActive: query.isActive,
      skip: query.skip,
      take: query.take,
    };
    const [categories, total] = await Promise.all([categoryRepository.findMany(params), categoryRepository.count(params)]);
    return { categories, total };
  },

  async getById(id: string): Promise<CategoryWithCount> {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError(CATEGORY_MESSAGES.NOT_FOUND, 404);
    return category;
  },

  async create(input: CreateCategoryInput): Promise<CategoryWithCount> {
    const slug = input.slug?.trim() ?? slugify(input.name);

    const existing = await categoryRepository.findBySlug(slug);
    if (existing) throw new AppError(CATEGORY_MESSAGES.SLUG_IN_USE, 409);

    let level = input.level ?? 0;
    if (input.parentId) {
      const parent = await categoryRepository.findParent(input.parentId);
      if (!parent) throw new AppError(CATEGORY_MESSAGES.PARENT_NOT_FOUND, 404);
      level = parent.level + 1;
      if (level > CATEGORY.MAX_LEVEL) {
        throw new AppError(`Categories can be nested at most ${CATEGORY.MAX_LEVEL} levels deep`, 400);
      }
    }

    try {
      const data: Prisma.CategoryUncheckedCreateInput = {
        name: input.name,
        slug,
        level,
        isActive: input.isActive ?? true,
      };
      if (input.description !== undefined) data.description = input.description;
      if (input.parentId !== undefined) data.parentId = input.parentId;
      if (input.icon !== undefined) data.icon = input.icon;

      return await categoryRepository.create(data);
    } catch (error) {
      if (isUniqueViolation(error)) throw new AppError(CATEGORY_MESSAGES.SLUG_IN_USE, 409);
      throw error;
    }
  },

  async update(id: string, input: Prisma.CategoryUpdateInput): Promise<CategoryWithCount> {
    await this.getById(id);

    const parentRelation = input.parent;
    if (parentRelation !== undefined) {
      const connectId = (parentRelation as { connect?: { id?: string } } | null)?.connect?.id;
      if (connectId) {
        const parent = await categoryRepository.findParent(connectId);
        if (!parent) throw new AppError(CATEGORY_MESSAGES.PARENT_NOT_FOUND, 404);
        input.level = parent.level + 1;
      } else {
        input.level = 0;
      }
    }

    try {
      return await categoryRepository.update(id, input);
    } catch (error) {
      if (isUniqueViolation(error)) throw new AppError(CATEGORY_MESSAGES.SLUG_IN_USE, 409);
      throw error;
    }
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await categoryRepository.softDelete(id);
  },
};