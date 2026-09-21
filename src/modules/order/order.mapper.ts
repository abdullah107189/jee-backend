import type {
  OrderListItem,
  OrderDetail,
  ShippingAddressInput,
} from "./order.type";

/* ─────────── List Mapper ─────────── */

export function toOrderListItem(raw: any): OrderListItem {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: raw.status,
    paymentStatus: raw.paymentStatus,
    paymentWay: raw.paymentWay,
    total: Number(raw.total),
    itemCount: raw._count?.orderItems ?? 0,

    // ✅ Preview items
    items: (raw.orderItems ?? []).map((item: any) => ({
      id: item.id,
      name: item.productItem.variant.product.name,
      image: item.productItem.variant.images?.[0] ?? undefined,
      quantity: 1, // each orderItem = 1 productItem
    })),

    customer: {
      id: raw.customer.id,
      name: raw.customer.user.name,
      phone: raw.customer.user.phone,
      email: raw.customer.user.email,
    },
    orderedAt: raw.orderedAt.toISOString(),
    createdAt: raw.createdAt.toISOString(),
  };
}
/* ─────────── Detail Mapper ─────────── */

export function toOrderDetail(raw: any): OrderDetail {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber,
    status: raw.status,
    paymentStatus: raw.paymentStatus,
    paymentWay: raw.paymentWay,

    subtotal: Number(raw.subtotal),
    discount: Number(raw.discount),
    tax: Number(raw.tax),
    shipping: Number(raw.shipping),
    total: Number(raw.total),

    shippingAddress: (raw.shippingAddress as ShippingAddressInput) ?? null,
    notes: raw.notes,
    trackingNumber: raw.trackingNumber,
    metadata: raw.metadata,

    customer: {
      id: raw.customer.id,
      userId: raw.customer.userId,
      name: raw.customer.user.name,
      phone: raw.customer.user.phone,
      email: raw.customer.user.email,
    },

    items: raw.orderItems.map((item: any) => ({
      id: item.id,
      variantId: item.variantId,
      productItemId: item.productItemId,
      price: Number(item.price),
      total: Number(item.total),
      product: {
        id: item.productItem.variant.product.id,
        name: item.productItem.variant.product.name,
        slug: item.productItem.variant.product.slug,
      },
      variant: {
        id: item.productItem.variant.id,
        name: item.productItem.variant.name,
        image: item.productItem.variant.images?.[0] ?? undefined,
      },
    })),

    payments: raw.payments.map((p: any) => ({
      id: p.id,
      method: p.method,
      amount: Number(p.amount),
      status: p.status,
      transactionId: p.transactionId,
      createdAt: p.createdAt.toISOString(),
    })),

    orderedAt: raw.orderedAt.toISOString(),
    deliveredAt: raw.deliveredAt?.toISOString() ?? null,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}
