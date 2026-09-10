import type { ClaimStatus } from "../../../prisma/generated/prisma/client";
export declare const CLAIM_STATUSES: readonly ClaimStatus[];
export declare const WARRANTY_CLAIM: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const WARRANTY_CLAIM_MESSAGES: {
    readonly NOT_FOUND: "Warranty claim not found";
    readonly WARRANTY_NOT_FOUND: "Warranty not found";
    readonly ALREADY_CLAIMED: "A claim is already under review for this warranty";
    readonly CREATED: "Warranty claim submitted successfully";
    readonly UPDATED: "Warranty claim updated successfully";
};
