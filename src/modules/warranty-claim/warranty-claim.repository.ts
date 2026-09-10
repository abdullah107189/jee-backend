import { prisma } from "../../../lib/prisma";
import type { ClaimStatus, Prisma } from "../../../prisma/generated/prisma/client";
import { CLAIM_INCLUDE } from "./warranty-claim.type";

export interface FindClaimsParams {
  warrantyId?: string;
  status?: ClaimStatus;
  customerId?: string;
  sellerId?: string;
  skip: number;
  take: number;
}

function buildWhere(params: Omit<FindClaimsParams, "skip" | "take">): Prisma.WarrantyClaimWhereInput {
  const where: Prisma.WarrantyClaimWhereInput = {};
  if (params.warrantyId) where.warrantyId = params.warrantyId;
  if (params.status) where.status = params.status;
  if (params.customerId) where.warranty = { customerId: params.customerId };
  if (params.sellerId) where.warranty = { sellerId: params.sellerId };
  return where;
}

export const warrantyClaimRepository = {
  findMany(params: FindClaimsParams) {
    return prisma.warrantyClaim.findMany({
      where: buildWhere(params),
      include: CLAIM_INCLUDE,
      skip: params.skip,
      take: params.take,
      orderBy: { submittedAt: "desc" },
    });
  },

  count(params: Omit<FindClaimsParams, "skip" | "take">) {
    return prisma.warrantyClaim.count({ where: buildWhere(params) });
  },

  findById(id: string) {
    return prisma.warrantyClaim.findUnique({ where: { id }, include: CLAIM_INCLUDE });
  },

  findWarrantyById(warrantyId: string) {
    return prisma.warranty.findUnique({
      where: { id: warrantyId },
      include: {
        customer: { select: { id: true, userId: true } },
        seller: { select: { id: true, userId: true } },
      },
    });
  },

  countClaimsForWarranty(warrantyId: string) {
    return prisma.warrantyClaim.count({ where: { warrantyId } });
  },

  create(data: Prisma.WarrantyClaimUncheckedCreateInput) {
    return prisma.warrantyClaim.create({ data, include: CLAIM_INCLUDE });
  },

  update(id: string, data: Prisma.WarrantyClaimUpdateInput) {
    return prisma.warrantyClaim.update({ where: { id }, data, include: CLAIM_INCLUDE });
  },

  markWarrantyClaimed(warrantyId: string) {
    return prisma.warranty.update({
      where: { id: warrantyId },
      data: { status: "CLAIMED", claimedAt: new Date() },
      select: { id: true },
    });
  },
};