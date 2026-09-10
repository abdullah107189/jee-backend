import type { Prisma, OrderStatus } from "../../../prisma/generated/prisma/client";

export const ORDER_INCLUDE = {
  customer: { select: { id: true, userId: true } },
  orderItems: {
    include: {
      productItem: {
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.OnlineOrderInclude;

export type OrderWithRelations = Prisma.OnlineOrderGetPayload<{ include: typeof ORDER_INCLUDE }>;

export interface CreateOrderInput {
  productItemIds: string[];
  shippingAddress?: unknown;
  billingAddress?: unknown;
  discount?: number;
  tax?: number;
  shipping?: number;
  metadata?: unknown;
}

export interface OrderStatusInput {
  status: OrderStatus;
}

export interface OrderQuery {
  customerId?: string;
  status?: OrderStatus;
  search?: string;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListOrdersResult {
  items: OrderWithRelations[];
  total: number;
}