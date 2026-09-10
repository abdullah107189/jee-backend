import type { OrderStatus } from "../../../prisma/generated/prisma/client";
import { fail, parseJson, pass, type ValidationResult } from "../../utils/validation";
import { ORDER_STATUSES } from "./order.constant";
import type { CreateOrderInput, OrderStatusInput } from "./order.type";

function isStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateCreateOrderInput(data: unknown): ValidationResult<CreateOrderInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (!isStringArray(body.productItemIds) || (body.productItemIds as unknown[]).length === 0) {
    errors.push("productItemIds must be a non-empty array of strings");
  }
  if (body.discount !== undefined && (typeof body.discount !== "number" || body.discount < 0)) {
    errors.push("discount must be a non-negative number");
  }
  if (body.tax !== undefined && (typeof body.tax !== "number" || body.tax < 0)) {
    errors.push("tax must be a non-negative number");
  }
  if (body.shipping !== undefined && (typeof body.shipping !== "number" || body.shipping < 0)) {
    errors.push("shipping must be a non-negative number");
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    productItemIds: (body.productItemIds as string[]).slice(0, 50),
    shippingAddress: parseJson(body.shippingAddress),
    billingAddress: parseJson(body.billingAddress),
    discount: body.discount !== undefined ? (body.discount as number) : undefined,
    tax: body.tax !== undefined ? (body.tax as number) : undefined,
    shipping: body.shipping !== undefined ? (body.shipping as number) : undefined,
    metadata: parseJson(body.metadata),
  });
}

export function validateOrderStatusInput(data: unknown): ValidationResult<OrderStatusInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (typeof body.status !== "string" || !(ORDER_STATUSES as readonly string[]).includes(body.status)) {
    return fail([`Status must be one of: ${ORDER_STATUSES.join(", ")}`]);
  }

  return pass({ status: body.status as OrderStatus });
}