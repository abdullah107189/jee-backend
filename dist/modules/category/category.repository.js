import { prisma } from "../../../lib/prisma";
import { CATEGORY_INCLUDE } from "./category.type";
function buildWhere(params) {
    const where = { deletedAt: null };
    if (params.parentId === null) {
        where.parentId = null;
    }
    else if (params.parentId !== undefined) {
        where.parentId = params.parentId;
    }
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
export const categoryRepository = {
    findMany(params) {
        return prisma.category.findMany({
            where: buildWhere(params),
            include: CATEGORY_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: [{ level: "asc" }, { name: "asc" }],
        });
    },
    count(params) {
        return prisma.category.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.category.findUnique({ where: { id }, include: CATEGORY_INCLUDE });
    },
    findBySlug(slug) {
        return prisma.category.findUnique({ where: { slug }, select: { id: true, level: true } });
    },
    findParent(parentId) {
        return prisma.category.findUnique({ where: { id: parentId }, select: { id: true, level: true } });
    },
    create(data) {
        return prisma.category.create({ data, include: CATEGORY_INCLUDE });
    },
    update(id, data) {
        return prisma.category.update({ where: { id }, data, include: CATEGORY_INCLUDE });
    },
    softDelete(id) {
        return prisma.category.update({ where: { id }, data: { deletedAt: new Date(), isActive: false }, select: { id: true } });
    },
};
//# sourceMappingURL=category.repository.js.map