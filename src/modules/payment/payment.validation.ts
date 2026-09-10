import type { Prisma } from "../../../prisma/generated/prisma/client";
import { fail, pass, type ValidationResult } from "../../utils/validation";
import { PAYMENT_METHODS, PAYMENT_STATUSES, PAYMENT_VERIFICATION_STATUSES } from "./payment.constant";
import type { CreatePaymentInput, PaymentVerifyInput } from "./payment.type";

export function validateCreatePaymentInput(data: unknown): ValidationResult<CreatePaymentInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (body.onlineOrderId === undefined && body.offlineSaleId === undefined) {
    errors.push("Either onlineOrderId or offlineSaleId is required");
  }
  if (typeof body.amount !== "number" || !Number.isFinite(body.amount) || body.amount <= 0) {
    errors.push("Amount must be a positive number");
  }
  if (typeof body.method !== "string" || !(PAYMENT_METHODS as readonly string[]).includes(body.method)) {
    errors.push(`Method must be one of: ${PAYMENT_METHODS.join(", ")}`);
  }
  if (body.status !== undefined && !(PAYMENT_STATUSES as readonly string[]).includes(body.status as string)) {
    errors.push(`Status must be one of: ${PAYMENT_STATUSES.join(", ")}`);
  }
  if (body.transactionId !== undefined && body.transactionId !== null && typeof body.transactionId !== "string") {
    errors.push("transactionId must be a string or null");
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    onlineOrderId: body.onlineOrderId !== undefined && body.onlineOrderId !== null ? String(body.onlineOrderId) : undefined,
    offlineSaleId: body.offlineSaleId !== undefined && body.offlineSaleId !== null ? String(body.offlineSaleId) : undefined,
    amount: body.amount as number,
    method: body.method as CreatePaymentInput["method"],
    transactionId: body.transactionId !== undefined && body.transactionId !== null ? String(body.transactionId) : undefined,
    gateway: body.gateway !== undefined && body.gateway !== null ? String(body.gateway) : undefined,
    gatewayResponse: body.gatewayResponse !== undefined ? body.gatewayResponse : undefined,
    status: body.status !== undefined ? (body.status as CreatePaymentInput["status"]) : undefined,
  });
}

export function validatePaymentVerifyInput(data: unknown): ValidationResult<PaymentVerifyInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (typeof body.verificationStatus !== "string" || !(PAYMENT_VERIFICATION_STATUSES as readonly string[]).includes(body.verificationStatus)) {
    return fail([`verificationStatus must be one of: ${PAYMENT_VERIFICATION_STATUSES.join(", ")}`]);
  }
  if (body.status !== undefined && !(PAYMENT_STATUSES as readonly string[]).includes(body.status as string)) {
    return fail([`status must be one of: ${PAYMENT_STATUSES.join(", ")}`]);
  }

  return pass({
    verificationStatus: body.verificationStatus as PaymentVerifyInput["verificationStatus"],
    status: body.status !== undefined ? (body.status as PaymentVerifyInput["status"]) : undefined,
  });
}

export function validateUpdatePaymentInput(data: unknown): ValidationResult<Prisma.PaymentUpdateInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (body.status !== undefined && !(PAYMENT_STATUSES as readonly string[]).includes(body.status as string)) {
    errors.push(`Status must be one of: ${PAYMENT_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) return fail(errors);

  const input: Prisma.PaymentUpdateInput = {};
  if (body.status !== undefined) input.status = body.status as Prisma.PaymentUpdateInput["status"];
  if (body.amount !== undefined) input.amount = body.amount as number;
  if (body.transactionId !== undefined) input.transactionId = body.transactionId === null ? null : String(body.transactionId);
  if (body.gateway !== undefined) input.gateway = body.gateway === null ? null : String(body.gateway);
  if (body.gatewayResponse !== undefined) input.gatewayResponse = body.gatewayResponse as Prisma.InputJsonValue;

  if (Object.keys(input).length === 0) return fail(["At least one field must be provided"]);

  return pass(input);
}