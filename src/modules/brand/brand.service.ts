import { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { slugify } from "../../utils/validation";
import { BRAND_MESSAGES } from "./brand.constant";
import { brandRepository } from "./brand.repository";
import type { BrandQuery, BrandWithCount, CreateBrandInput, ListBrandsResult } from "./brand.type";

export const brandService = {
  async list(query: BrandQuery): Promise<ListBrandsResult> {
    const params = { search: query.search, isActive: query.isActive, skip: query.skip, take: query.take };
    const [brands, total] = await Promise.all([brandRepository.findMany(params), brandRepository.count(params)]);
    return { brands, total };
  },

  async getById(id: string): Promise<BrandWithCount> {
    const brand = await brandRepository.findById(id);
    if (!brand) throw new AppError(BRAND_MESSAGES.NOT_FOUND, 404);
    return brand;
  },

  async create(input: CreateBrandInput): Promise<BrandWithCount> {
    const slug = input.slug?.trim() ?? slugify(input.name);

    const existing = await brandRepository.findBySlug(slug);
    if (existing) throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);

    try {
      const data: Prisma.BrandUncheckedCreateInput = {
        name: input.name,
        slug,
        isActive: input.isActive ?? true,
      };
      if (input.logo !== undefined) data.logo = input.logo;
      if (input.description !== undefined) data.description = input.description;

      return await brandRepository.create(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
      }
      throw error;
    }
  },

  async update(id: string, input: Prisma.BrandUpdateInput): Promise<BrandWithCount> {
    await this.getById(id);
    try {
      return await brandRepository.update(id, input);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
      }
      throw error;
    }
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await brandRepository.softDelete(id);
  },
};