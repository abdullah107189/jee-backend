import type { ClaimLimitType, SaleType, WarrantyStatus } from "../../../prisma/generated/prisma/client";
export declare const WARRANTY_STATUSES: readonly WarrantyStatus[];
export declare const SALE_TYPES: readonly SaleType[];
export declare const CLAIM_LIMIT_TYPES: readonly ClaimLimitType[];
export declare const WARRANTY: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const WARRANTY_MESSAGES: {
    readonly NOT_FOUND: "Warranty not found";
    readonly ITEM_NOT_FOUND: "Product item not found";
    readonly ALREADY_EXISTS: "A warranty already exists for this product item";
    readonly OFFLINE_SALE_IN_USE: "A warranty already exists for this offline sale";
    readonly CREATED: "Warranty created successfully";
    readonly UPDATED: "Warranty updated successfully";
    readonly DELETED: "Warranty removed successfully";
    readonly CANNOT_DELETE_WITH_CLAIMS: "Cannot delete a warranty that has claims";
};
