export const WARRANTY_STATUSES = ["ACTIVE", "EXPIRED", "VOID", "CLAIMED", "TRANSFERRED"];
export const SALE_TYPES = ["ONLINE", "OFFLINE"];
export const CLAIM_LIMIT_TYPES = ["LIMITED", "UNLIMITED"];
export const WARRANTY = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};
export const WARRANTY_MESSAGES = {
    NOT_FOUND: "Warranty not found",
    ITEM_NOT_FOUND: "Product item not found",
    ALREADY_EXISTS: "A warranty already exists for this product item",
    OFFLINE_SALE_IN_USE: "A warranty already exists for this offline sale",
    CREATED: "Warranty created successfully",
    UPDATED: "Warranty updated successfully",
    DELETED: "Warranty removed successfully",
    CANNOT_DELETE_WITH_CLAIMS: "Cannot delete a warranty that has claims",
};
//# sourceMappingURL=warranty.constant.js.map