import { z } from "zod";
import type { OrderStatus, PaymentWay } from "../../../prisma/generated/prisma/client";
import { fail, parseJson, pass, type ValidationResult } from "../../utils/validation";
import { ORDER_STATUSES } from "./order.constant";
import type { CreateOrderInput, OrderStatusInput } from "./order.type";

/* ─────────── Constants ─────────── */

const PAYMENT_WAYS = ["COD", "FULL"] as const;

/* ─────────── Schemas ─────────── */

const orderItemSchema = z.object({
  variantId: z
    .string()
    .trim()
    .min(1, "variantId must be a non-empty string"),

  quantity: z
    .number()
    .int("quantity must be an integer")
    .min(1, "quantity must be a positive integer"),
});

const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, "items must be a non-empty array")
    .max(50, "items cannot exceed 50 entries"),

  discount: z
    .number()
    .finite()
    .min(0, "discount must be a non-negative number")
    .optional(),

  tax: z
    .number()
    .finite()
    .min(0, "tax must be a non-negative number")
    .optional(),

  shipping: z
    .number()
    .finite()
    .min(0, "shipping must be a non-negative number")
    .optional(),

  paymentWay: z
    .enum(PAYMENT_WAYS)
    .optional(),

  notes: z
    .string()
    .optional(),

  shippingAddress: z
    .unknown()
    .optional(),

  billingAddress: z
    .unknown()
    .optional(),

  metadata: z
    .unknown()
    .optional(),
});

const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

/* ─────────── Helpers ─────────── */

function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0
      ? `${issue.path.join(".")}: `
      : "";

    return `${path}${issue.message}`;
  });
}

/* ─────────── Validate Create Order ─────────── */

export function validateCreateOrderInput(
  data: unknown,
): ValidationResult<CreateOrderInput> {
  const result = createOrderSchema.safeParse(data);

  if (!result.success) {
    return fail(formatZodErrors(result.error));
  }

  const input = result.data;

  return pass({
    items: input.items,

    shippingAddress: parseJson(input.shippingAddress),
    billingAddress: parseJson(input.billingAddress),

    discount: input.discount,
    tax: input.tax,
    shipping: input.shipping,

    paymentWay: input.paymentWay as PaymentWay | undefined,

    notes: input.notes,

    metadata: parseJson(input.metadata),
  });
}

/* ─────────── Validate Status Update ─────────── */

export function validateOrderStatusInput(
  data: unknown,
): ValidationResult<OrderStatusInput> {
  const result = orderStatusSchema.safeParse(data);

  if (!result.success) {
    return fail(formatZodErrors(result.error));
  }

  return pass({
    status: result.data.status as OrderStatus,
  });
}
