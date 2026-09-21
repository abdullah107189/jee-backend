import type {
  OrderStatus,
  OrderPaymentStatus,
  PaymentWay,
  Prisma,
} from "../../../prisma/generated/prisma/client";

/* ─────────── Order Query (list) ─────────── */

export interface OrderQuery {
  customerId?: string;
  status?: OrderStatus;
  search?: string;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

/* ─────────── Create Order Input ─────────── */

export interface CreateOrderItemInput {
  variantId: string;
  quantity: number;
}

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  email?: string;
  division?: string;
  district?: string;
  upazila?: string;
  streetAddress: string;
  apartment?: string;
  zipCode?: string;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  shippingAddress: ShippingAddressInput;
  discount?: number;
  tax?: number;
  shipping?: number;
  paymentWay?: PaymentWay;
  notes?: string;
  metadata?: unknown;
}

export interface OrderStatusInput {
  status: OrderStatus;
}

/* ─────────── LIST VIEW (lightweight) ─────────── */

export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentWay: PaymentWay;
  total: number;
  itemCount: number;

  // ✅ Product preview (first 2-3 items)
  items: Array<{
    id: string;
    name: string; // product name
    image?: string; // first variant image
    quantity: number; // = 1 per productItem, but keep for future
  }>;

  customer: {
    id: string;
    name: string;
    phone: string | null;
    email: string;
  };
  orderedAt: string;
  createdAt: string;
}

export interface PaginatedOrders {
  items: OrderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ─────────── DETAIL VIEW (full) ─────────── */

export interface OrderDetailItem {
  id: string;
  variantId: string;
  productItemId: string;
  price: number;
  total: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  };
  variant: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface OrderDetailPayment {
  id: string;
  method: string;
  amount: number;
  status: string;
  transactionId: string | null;
  createdAt: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentWay: PaymentWay;

  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;

  shippingAddress: ShippingAddressInput | null;
  notes: string | null;
  trackingNumber: string | null;
  metadata: unknown;

  customer: {
    id: string;
    userId: string;
    name: string;
    phone: string | null;
    email: string;
  };

  items: OrderDetailItem[];
  payments: OrderDetailPayment[];

  orderedAt: string;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─────────── Repository internal include ─────────── */

export const ORDER_LIST_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  paymentWay: true,
  total: true,
  orderedAt: true,
  createdAt: true,
  customer: {
    select: {
      id: true,
      user: { select: { name: true, phone: true, email: true } },
    },
  },
  // ✅ Total count
  _count: { select: { orderItems: true } },
  // ✅ First 3 items — preview
  orderItems: {
    take: 3,
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      productItem: {
        select: {
          variant: {
            select: {
              images: true,
              product: { select: { name: true } },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.OnlineOrderSelect;
export const ORDER_DETAIL_INCLUDE = {
  customer: {
    select: {
      id: true,
      userId: true,
      user: { select: { name: true, phone: true, email: true } },
    },
  },
  orderItems: {
    include: {
      productItem: {
        include: {
          variant: {
            select: {
              id: true,
              sku: true,
              attributes: true,
              images: true, // ✅ variant images (String[])
              price: true,
              product: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      },
    },
  },
  payments: {
    select: {
      id: true,
      method: true,
      amount: true,
      status: true,
      transactionId: true,
      createdAt: true,
    },
  },
} satisfies Prisma.OnlineOrderInclude;
