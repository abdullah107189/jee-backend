import type { ClaimStatus, Prisma } from "../../../prisma/generated/prisma/client";

export const CLAIM_INCLUDE = {
  warranty: {
    include: {
      productItem: {
        include: {
          variant: { include: { product: { select: { id: true, name: true, slug: true } } } },
          offlineSale: { select: { customerName: true, customerPhone: true, customerEmail: true, invoiceNumber: true } },
        },
      },
      customer: { select: { id: true, userId: true, user: { select: { name: true, phone: true, email: true } } } },
      seller: { select: { id: true, companyName: true } },
    },
  },
} satisfies Prisma.WarrantyClaimInclude;

export type ClaimWithRelations = Prisma.WarrantyClaimGetPayload<{ include: typeof CLAIM_INCLUDE }>;

export interface CreateClaimInput {
  warrantyId: string;
  description: string;
}

export type UpdateClaimInput = Prisma.WarrantyClaimUpdateInput;

export interface ClaimStatusInput {
  status: ClaimStatus;
}

export interface ClaimQuery {
  warrantyId?: string;
  status?: ClaimStatus;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListClaimsResult {
  items: ClaimWithRelations[];
  total: number;
}