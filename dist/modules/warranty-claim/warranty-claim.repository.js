import { prisma } from "../../../lib/prisma";
import { CLAIM_INCLUDE } from "./warranty-claim.type";
function buildWhere(params) {
    const where = {};
    if (params.warrantyId)
        where.warrantyId = params.warrantyId;
    if (params.status)
        where.status = params.status;
    if (params.customerId)
        where.warranty = { customerId: params.customerId };
    if (params.sellerId)
        where.warranty = { sellerId: params.sellerId };
    return where;
}
export const warrantyClaimRepository = {
    findMany(params) {
        return prisma.warrantyClaim.findMany({
            where: buildWhere(params),
            include: CLAIM_INCLUDE,
            skip: params.skip,
            take: params.take,
            orderBy: { submittedAt: "desc" },
        });
    },
    count(params) {
        return prisma.warrantyClaim.count({ where: buildWhere(params) });
    },
    findById(id) {
        return prisma.warrantyClaim.findUnique({ where: { id }, include: CLAIM_INCLUDE });
    },
    findWarrantyById(warrantyId) {
        return prisma.warranty.findUnique({
            where: { id: warrantyId },
            include: {
                customer: { select: { id: true, userId: true } },
                seller: { select: { id: true, userId: true } },
            },
        });
    },
    countClaimsForWarranty(warrantyId) {
        return prisma.warrantyClaim.count({ where: { warrantyId } });
    },
    create(data) {
        return prisma.warrantyClaim.create({ data, include: CLAIM_INCLUDE });
    },
    update(id, data) {
        return prisma.warrantyClaim.update({ where: { id }, data, include: CLAIM_INCLUDE });
    },
    markWarrantyClaimed(warrantyId) {
        return prisma.warranty.update({
            where: { id: warrantyId },
            data: { status: "CLAIMED", claimedAt: new Date() },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=warranty-claim.repository.js.map