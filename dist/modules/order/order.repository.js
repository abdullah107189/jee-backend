import { prisma } from "../../../lib/prisma";
import { ORDER_INCLUDE } from "./order.type";
function buildWhere(params) {
    const where = {};
    if (params.customerId)
        where.customerId = params.customerId;
    if (params.status)
        where.status = params.status;
    if (params.search) {
        where.OR = [{ orderNumber: { contains: params.search, mode: "insensitive" } }];
    }
    return where;
}
export const orderRepository = {
    findMany(params) {
        return prisma.onlineOrder.findMany({
            where: buildWhere(params),
            include: ORDER_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { createdAt: "desc" },
        });
    },
    count(params) {
        return prisma.onlineOrder.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.onlineOrder.findUnique({ where: { id }, include: ORDER_INCLUDE });
    },
    /** The customer profile linked to a user (used to scope customer orders). */
    findCustomerIdByUserId(userId) {
        return prisma.customer.findUnique({ where: { userId }, select: { id: true } });
    },
    findAvailableItemsByIds(ids) {
        return prisma.productItem.findMany({
            where: { id: { in: ids }, status: "AVAILABLE", deletedAt: null },
            include: { variant: { include: { product: { select: { id: true, name: true, slug: true } } } } },
        });
    },
    update(id, data) {
        return prisma.onlineOrder.update({ where: { id }, data, include: ORDER_INCLUDE });
    },
    findItemIdsByOrder(orderId) {
        return prisma.onlineOrderItem.findMany({ where: { orderId }, select: { productItemId: true } });
    },
    setProductItemStatus(productItemIds, status) {
        return prisma.productItem.updateMany({ where: { id: { in: productItemIds }, deletedAt: null }, data: { status } });
    },
};
//# sourceMappingURL=order.repository.js.map