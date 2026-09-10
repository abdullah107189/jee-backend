import type { SellerStatus } from "../../../prisma/generated/prisma/client";
export declare const SELLER_STATUSES: readonly SellerStatus[];
export declare const SELLER: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const SELLER_MESSAGES: {
    readonly NOT_FOUND: "Seller not found";
    readonly EMAIL_IN_USE: "A user with this email already exists";
    readonly CREATED: "Seller created successfully";
    readonly UPDATED: "Seller updated successfully";
    readonly DELETED: "Seller removed successfully";
    readonly PROFILE_UPDATED: "Seller profile updated successfully";
};
