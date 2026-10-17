import type { PaymentMethod, Prisma } from "../../../prisma/generated/prisma/client";
import { fail, isEmail, pass, type ValidationResult } from "../../utils/validation";
import type { CreateOfflineSaleInput } from "./offline-sale.type";
import { OFFLINE_PAYMENT_METHODS } from "./offline-sale.constant";

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  return String(value).trim() === "" ? undefined : String(value).trim();
}

export function validateCreateOfflineSaleInput(data: unknown): ValidationResult<CreateOfflineSaleInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  const hasProductItemId = typeof body.productItemId === "string" && body.productItemId.trim() !== "";
  const hasSerialNumber = typeof body.serialNumber === "string" && body.serialNumber.trim() !== "";

  if (!hasProductItemId && !hasSerialNumber) {
    errors.push("Either productItemId or serialNumber is required");
  }
  if (body.salePrice !== undefined && body.salePrice !== null && (typeof body.salePrice !== "number" || body.salePrice < 0)) {
    errors.push("salePrice must be a non-negative number");
  }
  if (body.customerEmail !== undefined && body.customerEmail !== null && typeof body.customerEmail === "string" && !isEmail(body.customerEmail)) {
    errors.push("customerEmail must be a valid email address");
  }
  if (body.discount !== undefined && (typeof body.discount !== "number" || body.discount < 0)) {
    errors.push("discount must be a non-negative number");
  }
  if (body.tax !== undefined && (typeof body.tax !== "number" || body.tax < 0)) {
    errors.push("tax must be a non-negative number");
  }
  if (body.paymentMethod !== undefined && body.paymentMethod !== null && !(OFFLINE_PAYMENT_METHODS as readonly string[]).includes(String(body.paymentMethod))) {
    errors.push(`paymentMethod must be one of: ${OFFLINE_PAYMENT_METHODS.join(", ")}`);
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    productItemId: optionalString(body.productItemId),
    serialNumber: optionalString(body.serialNumber),
    variantId: optionalString(body.variantId),
    sellerId: optionalString(body.sellerId),
    customerId: body.customerId !== undefined && body.customerId !== null ? String(body.customerId) : undefined,
    customerName: optionalString(body.customerName),
    customerPhone: optionalString(body.customerPhone),
    customerEmail: optionalString(body.customerEmail),
    salePrice: body.salePrice !== undefined && body.salePrice !== null ? (body.salePrice as number) : undefined,
    discount: body.discount !== undefined ? (body.discount as number) : undefined,
    tax: body.tax !== undefined ? (body.tax as number) : undefined,
    notes: optionalString(body.notes),
    paymentMethod: body.paymentMethod !== undefined && body.paymentMethod !== null ? (body.paymentMethod as PaymentMethod) : undefined,
    saleDate: body.saleDate !== undefined && body.saleDate !== null ? new Date(body.saleDate as string) : undefined,
  });
}

export function validateUpdateOfflineSaleInput(data: unknown): ValidationResult<Prisma.OfflineSaleUpdateInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  const input: Prisma.OfflineSaleUpdateInput = {};
  if (body.customerName !== undefined) input.customerName = body.customerName === null ? null : String(body.customerName);
  if (body.customerPhone !== undefined) input.customerPhone = body.customerPhone === null ? null : String(body.customerPhone);
  if (body.customerEmail !== undefined) input.customerEmail = body.customerEmail === null ? null : String(body.customerEmail);
  if (body.customerId === null) {
    input.customer = { disconnect: true };
  } else if (body.customerId !== undefined) {
    input.customer = { connect: { id: String(body.customerId) } };
  }
  if (body.salePrice !== undefined) input.salePrice = body.salePrice as number;
  if (body.discount !== undefined) input.discount = body.discount as number;
  if (body.tax !== undefined) input.tax = body.tax as number;
  if (body.notes !== undefined) input.notes = body.notes === null ? null : String(body.notes);
  if (body.paymentMethod !== undefined) input.paymentMethod = body.paymentMethod as PaymentMethod;
  if (body.saleDate !== undefined && body.saleDate !== null) input.saleDate = new Date(body.saleDate as string);

  if (Object.keys(input).length === 0) return fail(["At least one field must be provided"]);

  return pass(input);
}