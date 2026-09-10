import type { Prisma } from "../../../prisma/generated/prisma/client";
import type { CreateSellerInput, ListSellersResult, SellerProfile, SellerProfileInput, SellerQuery } from "./seller.type";
export declare const sellerService: {
    list(query: SellerQuery): Promise<ListSellersResult>;
    getById(id: string): Promise<SellerProfile>;
    getByUserId(userId: string): Promise<SellerProfile>;
    create(input: CreateSellerInput): Promise<SellerProfile>;
    update(id: string, input: Prisma.SellerUpdateInput): Promise<SellerProfile>;
    updateMe(userId: string, input: SellerProfileInput): Promise<SellerProfile>;
    remove(id: string): Promise<void>;
};
