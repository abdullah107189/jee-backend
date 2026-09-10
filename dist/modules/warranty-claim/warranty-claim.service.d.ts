import type { ClaimStatus, Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import type { ClaimQuery, ClaimWithRelations, CreateClaimInput, ListClaimsResult } from "./warranty-claim.type";
export declare const warrantyClaimService: {
    list(query: ClaimQuery, viewer?: {
        role: UserRole;
        userId: string;
    }): Promise<ListClaimsResult>;
    getById(id: string): Promise<ClaimWithRelations>;
    create(userId: string, input: CreateClaimInput): Promise<ClaimWithRelations>;
    update(id: string, input: Prisma.WarrantyClaimUpdateInput): Promise<ClaimWithRelations>;
    updateStatus(id: string, status: ClaimStatus): Promise<ClaimWithRelations>;
};
