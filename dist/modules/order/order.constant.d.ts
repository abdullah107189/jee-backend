import type { OrderStatus } from "../../../prisma/generated/prisma/client";
export declare const ORDER_STATUSES: readonly OrderStatus[];
export declare const ORDER: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const ORDER_MESSAGES: {
    readonly NOT_FOUND: "Order not found";
    readonly ITEMS_UNAVAILABLE: "One or more product items are not available for purchase";
    readonly CREATED: "Order created successfully";
    readonly UPDATED: "Order updated successfully";
    readonly CANCELLED: "Order cancelled successfully";
};
