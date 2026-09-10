import { prisma } from "../../../lib/prisma";
import { BRAND_INCLUDE } from "./brand.type";
function buildWhere(params) {
    const where = { deletedAt: null };
    if (params.isActive !== undefined)
        where.isActive = params.isActive;
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
}
export const brandRepository = {
    findMany(params) {
        return prisma.brand.findMany({
            where: buildWhere(params),
            include: BRAND_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { name: "asc" },
        });
    },
    count(params) {
        return prisma.brand.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.brand.findUnique({ where: { id }, include: BRAND_INCLUDE });
    },
    findBySlug(slug) {
        return prisma.brand.findUnique({ where: { slug }, select: { id: true } });
    },
    create(data) {
        return prisma.brand.create({ data, include: BRAND_INCLUDE });
    },
    update(id, data) {
        return prisma.brand.update({ where: { id }, data, include: BRAND_INCLUDE });
    },
    softDelete(id) {
        return prisma.brand.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
    },
};
//# sourceMappingURL=brand.repository.js.map