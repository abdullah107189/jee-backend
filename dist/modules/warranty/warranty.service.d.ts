import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import type { CreateWarrantyInput, ListWarrantiesResult, WarrantyQuery, WarrantyWithRelations } from "./warranty.type";
export declare const warrantyService: {
    list(query: WarrantyQuery, viewer?: {
        role: UserRole;
        userId: string;
    }): Promise<ListWarrantiesResult>;
    getById(id: string): Promise<WarrantyWithRelations>;
    create(input: CreateWarrantyInput): Promise<WarrantyWithRelations>;
    update(id: string, input: Prisma.WarrantyUpdateInput): Promise<WarrantyWithRelations>;
    remove(id: string): Promise<void>;
};
