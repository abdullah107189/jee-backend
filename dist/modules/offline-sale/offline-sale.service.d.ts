import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import type { CreateOfflineSaleInput, ListOfflineSalesResult, OfflineSaleQuery, OfflineSaleWithRelations } from "./offline-sale.type";
export declare const offlineSaleService: {
    list(query: OfflineSaleQuery, viewer?: {
        role: UserRole;
        userId: string;
    }): Promise<ListOfflineSalesResult>;
    getById(id: string): Promise<OfflineSaleWithRelations>;
    create(sellerUserId: string, input: CreateOfflineSaleInput): Promise<OfflineSaleWithRelations>;
    update(id: string, input: Prisma.OfflineSaleUpdateInput): Promise<OfflineSaleWithRelations>;
    remove(id: string): Promise<void>;
};
