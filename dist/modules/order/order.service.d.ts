import type { OrderStatus, UserRole } from "../../../prisma/generated/prisma/client";
import type { CreateOrderInput, ListOrdersResult, OrderQuery, OrderWithRelations } from "./order.type";
export declare const orderService: {
    list(query: OrderQuery, viewer?: {
        role: UserRole;
        userId: string;
    }): Promise<ListOrdersResult>;
    getById(id: string): Promise<OrderWithRelations>;
    create(customerUserId: string, input: CreateOrderInput): Promise<OrderWithRelations>;
    updateStatus(id: string, status: OrderStatus): Promise<OrderWithRelations>;
    cancel(id: string): Promise<OrderWithRelations>;
};
