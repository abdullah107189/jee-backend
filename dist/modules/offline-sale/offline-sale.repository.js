import { prisma } from "../../../lib/prisma";
import { OFFLINE_SALE_INCLUDE } from "./offline-sale.type";
function buildWhere(params) {
    const where = {};
    if (params.sellerId)
        where.sellerId = params.sellerId;
    if (params.from || params.to) {
        where.saleDate = {
            ...(params.from ? { gte: params.from } : {}),
            ...(params.to ? { lte: params.to } : {}),
        };
    }
    if (params.search) {
        where.OR = [
            { customerName: { contains: params.search, mode: "insensitive" } },
            { customerPhone: { contains: params.search, mode: "insensitive" } },
            { invoiceNumber: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
}
export const offlineSaleRepository = {
    findMany(params) {
        return prisma.offlineSale.findMany({
            where: buildWhere(params),
            include: OFFLINE_SALE_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { saleDate: "desc" },
        });
    },
    count(params) {
        return prisma.offlineSale.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.offlineSale.findUnique({ where: { id }, include: OFFLINE_SALE_INCLUDE });
    },
    findSellerIdByUserId(userId) {
        return prisma.seller.findUnique({ where: { userId }, select: { id: true } });
    },
    findProductItem(productItemId) {
        return prisma.productItem.findUnique({
            where: { id: productItemId },
            include: { variant: { include: { product: { select: { id: true, name: true, slug: true } } } } },
        });
    },
    setProductItemStatus(productItemId, status) {
        return prisma.productItem.update({ where: { id: productItemId }, data: { status }, select: { id: true } });
    },
    findByInvoiceNumber(invoiceNumber) {
        return prisma.offlineSale.findUnique({ where: { invoiceNumber }, select: { id: true } });
    },
    create(data) {
        return prisma.offlineSale.create({ data, include: OFFLINE_SALE_INCLUDE });
    },
    update(id, data) {
        return prisma.offlineSale.update({ where: { id }, data, include: OFFLINE_SALE_INCLUDE });
    },
    remove(id) {
        return prisma.offlineSale.delete({ where: { id } });
    },
};
//# sourceMappingURL=offline-sale.repository.js.map