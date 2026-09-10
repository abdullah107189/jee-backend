import type { ProductItemStatus } from "../../../prisma/generated/prisma/client";
export declare const PRODUCT_ITEM_STATUSES: readonly ProductItemStatus[];
export declare const PRODUCT: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
    readonly DEFAULT_LOW_STOCK_THRESHOLD: 5;
};
export declare const PRODUCT_MESSAGES: {
    readonly NOT_FOUND: "Product not found";
    readonly VARIANT_NOT_FOUND: "Product variant not found";
    readonly ITEM_NOT_FOUND: "Product item not found";
    readonly SLUG_IN_USE: "Product slug is already in use";
    readonly SKU_IN_USE: "Variant SKU is already in use";
    readonly ITEM_UNIQUE_ID_IN_USE: "A product item with this unique ID already exists for the variant";
    readonly CREATED: "Product created successfully";
    readonly UPDATED: "Product updated successfully";
    readonly DELETED: "Product removed successfully";
    readonly VARIANT_CREATED: "Variant created successfully";
    readonly VARIANT_UPDATED: "Variant updated successfully";
    readonly VARIANT_DELETED: "Variant removed successfully";
    readonly ITEM_CREATED: "Product item created successfully";
    readonly ITEM_UPDATED: "Product item updated successfully";
    readonly ITEM_DELETED: "Product item removed successfully";
};
