import { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

import AppError  from "../../errors/AppError";
import { slugify } from "../../utils/validation";

import { BRAND_MESSAGES } from "./brand.constant";
import { brandRepository } from "./brand.repository";

import type {
  BrandQuery,
  BrandWithCount,
  CreateBrandInput,
  ListBrandsResult,
} from "./brand.type";

export const PUBLIC_BRAND_SELECT = {
  id: true,
  name: true,
  slug: true,
  logo: true,
  description: true,
} satisfies Prisma.BrandSelect;

/* -------------------------------------------------------------------------- */
/* List                                                                       */
/* -------------------------------------------------------------------------- */

const getAll = () => {
  return prisma.brand.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    select: PUBLIC_BRAND_SELECT,
    orderBy: {
      name: "asc",
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Get By ID                                                                  */
/* -------------------------------------------------------------------------- */

const getById = async (id: string): Promise<BrandWithCount> => {
  const brand = await brandRepository.findById(id);

  if (!brand) {
    throw new AppError(BRAND_MESSAGES.NOT_FOUND, 404);
  }

  return brand;
};

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

const create = async (input: CreateBrandInput): Promise<BrandWithCount> => {
  const slug = input.slug?.trim() ?? slugify(input.name);

  const existing = await brandRepository.findBySlug(slug);

  if (existing) {
    throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
  }

  try {
    const data: Prisma.BrandUncheckedCreateInput = {
      name: input.name,
      slug,
      isActive: input.isActive ?? true,
    };

    if (input.logo !== undefined) {
      data.logo = input.logo;
    }

    if (input.description !== undefined) {
      data.description = input.description;
    }

    return await brandRepository.create(data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
    }

    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* Update                                                                     */
/* -------------------------------------------------------------------------- */

const update = async (
  id: string,
  input: Prisma.BrandUpdateInput,
): Promise<BrandWithCount> => {
  await getById(id);

  try {
    return await brandRepository.update(id, input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
    }

    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* Remove                                                                     */
/* -------------------------------------------------------------------------- */

const remove = async (id: string): Promise<void> => {
  await getById(id);

  await brandRepository.softDelete(id);
};

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

export const brandService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
