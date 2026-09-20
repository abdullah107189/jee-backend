import type { Prisma, OrderStatus, PaymentWay } from "../../../prisma/generated/prisma/client";

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
  payments: true,
} satisfies Prisma.OnlineOrderInclude;

export type OrderWithRelations = Prisma.OnlineOrderGetPayload<{
  include: typeof ORDER_INCLUDE;
}>;

/* ─────────── Create Order Input ─────────── */
export interface CreateOrderItemInput {
  variantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  shippingAddress?: unknown;
  billingAddress?: unknown;
  discount?: number;
  tax?: number;
  shipping?: number;
  paymentWay?: PaymentWay;
  notes?: string;
  metadata?: unknown;
}

/* ─────────── Status Update ─────────── */
export interface OrderStatusInput {
  status: OrderStatus;
}

/* ─────────── Query ─────────── */
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