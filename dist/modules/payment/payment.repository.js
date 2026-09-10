import { prisma } from "../../../lib/prisma";
import { PAYMENT_INCLUDE } from "./payment.type";
function buildWhere(params) {
    const where = {};
    if (params.onlineOrderId)
        where.onlineOrderId = params.onlineOrderId;
    if (params.offlineSaleId)
        where.offlineSaleId = params.offlineSaleId;
    if (params.status)
        where.status = params.status;
    if (params.customerId)
        where.order = { customerId: params.customerId };
    if (params.sellerId)
        where.offlineSale = { sellerId: params.sellerId };
    return where;
}
export const paymentRepository = {
    findMany(params) {
        return prisma.payment.findMany({
            where: buildWhere(params),
            include: PAYMENT_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.payment.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.payment.findUnique({ where: { id }, include: PAYMENT_INCLUDE });
    },
    findCustomerIdByUserId(userId) {
        return prisma.customer.findUnique({ where: { userId }, select: { id: true } });
    },
    findSellerIdByUserId(userId) {
        return prisma.seller.findUnique({ where: { userId }, select: { id: true } });
    },
    findOnlineOrder(id) {
        return prisma.onlineOrder.findUnique({ where: { id }, select: { id: true, customerId: true, total: true } });
    },
    findOfflineSale(id) {
        return prisma.offlineSale.findUnique({ where: { id }, select: { id: true, sellerId: true, total: true } });
    },
    create(data) {
        return prisma.payment.create({ data, include: PAYMENT_INCLUDE });
    },
    update(id, data) {
        return prisma.payment.update({ where: { id }, data, include: PAYMENT_INCLUDE });
    },
};
//# sourceMappingURL=payment.repository.js.map