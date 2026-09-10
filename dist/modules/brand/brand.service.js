import { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { slugify } from "../../utils/validation";
import { BRAND_MESSAGES } from "./brand.constant";
import { brandRepository } from "./brand.repository";
export const brandService = {
    async list(query) {
        const params = { search: query.search, isActive: query.isActive, skip: query.skip, take: query.take };
        const [brands, total] = await Promise.all([brandRepository.findMany(params), brandRepository.count(params)]);
        return { brands, total };
    },
    async getById(id) {
        const brand = await brandRepository.findById(id);
        if (!brand)
            throw new AppError(BRAND_MESSAGES.NOT_FOUND, 404);
        return brand;
    },
    async create(input) {
        const slug = input.slug?.trim() ?? slugify(input.name);
        const existing = await brandRepository.findBySlug(slug);
        if (existing)
            throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
        try {
            const data = {
                name: input.name,
                slug,
                isActive: input.isActive ?? true,
            };
            if (input.logo !== undefined)
                data.logo = input.logo;
            if (input.description !== undefined)
                data.description = input.description;
            return await brandRepository.create(data);
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
            }
            throw error;
        }
    },
    async update(id, input) {
        await this.getById(id);
        try {
            return await brandRepository.update(id, input);
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new AppError(BRAND_MESSAGES.SLUG_IN_USE, 409);
            }
            throw error;
        }
    },
    async remove(id) {
        await this.getById(id);
        await brandRepository.softDelete(id);
    },
};
//# sourceMappingURL=brand.service.js.map