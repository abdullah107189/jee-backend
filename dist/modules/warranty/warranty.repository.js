import { prisma } from "../../../lib/prisma";
import { WARRANTY_INCLUDE } from "./warranty.type";
function buildWhere(params) {
    const where = {};
    if (params.customerId)
        where.customerId = params.customerId;
    if (params.sellerId)
        where.sellerId = params.sellerId;
    if (params.status)
        where.status = params.status;
    if (params.search) {
        where.OR = [{ productItem: { uniqueId: { contains: params.search, mode: "insensitive" } } }];
    }
    return where;
}
export const warrantyRepository = {
    findMany(params) {
        return prisma.warranty.findMany({
            where: buildWhere(params),
            include: WARRANTY_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.warranty.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.warranty.findUnique({ where: { id }, include: WARRANTY_INCLUDE });
    },
    findByProductItemId(productItemId) {
        return prisma.warranty.findUnique({ where: { productItemId }, select: { id: true } });
    },
    findByOfflineSaleId(offlineSaleId) {
        return prisma.warranty.findUnique({ where: { offlineSaleId }, select: { id: true } });
    },
    findProductItem(productItemId) {
        return prisma.productItem.findUnique({
            where: { id: productItemId },
            include: { variant: { include: { product: { select: { id: true, warrantyMonths: true } } } } },
        });
    },
    findCustomerIdByUserId(userId) {
        return prisma.customer.findUnique({ where: { userId }, select: { id: true } });
    },
    findSellerIdByUserId(userId) {
        return prisma.seller.findUnique({ where: { userId }, select: { id: true } });
    },
    create(data) {
        return prisma.warranty.create({ data, include: WARRANTY_INCLUDE });
    },
    update(id, data) {
        return prisma.warranty.update({ where: { id }, data, include: WARRANTY_INCLUDE });
    },
    remove(id) {
        return prisma.warranty.delete({ where: { id } });
    },
};
//# sourceMappingURL=warranty.repository.js.map