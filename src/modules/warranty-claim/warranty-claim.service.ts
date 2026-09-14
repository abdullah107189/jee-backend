import { prisma } from "../../lib/prisma";
import type { ClaimStatus, Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { WARRANTY_CLAIM_MESSAGES } from "./warranty-claim.constant";
import { warrantyClaimRepository } from "./warranty-claim.repository";
import type { ClaimQuery, ClaimWithRelations, CreateClaimInput, ListClaimsResult } from "./warranty-claim.type";

function generateClaimNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 5);
  return `WCL-${timestamp}${random}`;
}

export const warrantyClaimService = {
  async list(query: ClaimQuery, viewer?: { role: UserRole; userId: string }): Promise<ListClaimsResult> {
    let customerId: string | undefined;
    let sellerId: string | undefined;

    if (viewer?.role === "CUSTOMER") {
      customerId = (await prisma.customer.findUnique({ where: { userId: viewer.userId }, select: { id: true } }))?.id;
    } else if (viewer?.role === "SELLER") {
      sellerId = (await prisma.seller.findUnique({ where: { userId: viewer.userId }, select: { id: true } }))?.id;
    }

    const params = { warrantyId: query.warrantyId, status: query.status, customerId, sellerId, skip: query.skip, take: query.take };
    const [items, total] = await Promise.all([warrantyClaimRepository.findMany(params), warrantyClaimRepository.count(params)]);
    return { items, total };
  },

  async getById(id: string): Promise<ClaimWithRelations> {
    const claim = await warrantyClaimRepository.findById(id);
    if (!claim) throw new AppError(WARRANTY_CLAIM_MESSAGES.NOT_FOUND, 404);
    return claim;
  },

  async create(userId: string, input: CreateClaimInput): Promise<ClaimWithRelations> {
    const warranty = await warrantyClaimRepository.findWarrantyById(input.warrantyId);
    if (!warranty) throw new AppError(WARRANTY_CLAIM_MESSAGES.WARRANTY_NOT_FOUND, 404);

    // A LIMITED warranty that is already claimed cannot take more claims.
    if (warranty.claimLimitType === "LIMITED" && warranty.status === "CLAIMED") {
      throw new AppError(WARRANTY_CLAIM_MESSAGES.ALREADY_CLAIMED, 409);
    }

    const data: Prisma.WarrantyClaimUncheckedCreateInput = {
      warrantyId: input.warrantyId,
      claimNumber: generateClaimNumber(),
      description: input.description,
      status: "SUBMITTED",
    };

    const claim = await warrantyClaimRepository.create(data);
    await warrantyClaimRepository.markWarrantyClaimed(input.warrantyId);

    return claim;
  },

  async update(id: string, input: Prisma.WarrantyClaimUpdateInput): Promise<ClaimWithRelations> {
    await this.getById(id);

    if (input.status === "APPROVED") input.approvedAt = new Date();
    if (input.status === "COMPLETED") input.completedAt = new Date();

    return warrantyClaimRepository.update(id, input);
  },

  async updateStatus(id: string, status: ClaimStatus): Promise<ClaimWithRelations> {
    const input: Prisma.WarrantyClaimUpdateInput = { status };
    if (status === "APPROVED") input.approvedAt = new Date();
    if (status === "COMPLETED") input.completedAt = new Date();
    return this.update(id, input);
  },
};