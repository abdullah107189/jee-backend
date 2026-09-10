import { fail, pass } from "../../utils/validation";
import { PAYMENT_METHODS, PAYMENT_STATUSES, PAYMENT_VERIFICATION_STATUSES } from "./payment.constant";
export function validateCreatePaymentInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (body.onlineOrderId === undefined && body.offlineSaleId === undefined) {
        errors.push("Either onlineOrderId or offlineSaleId is required");
    }
    if (typeof body.amount !== "number" || !Number.isFinite(body.amount) || body.amount <= 0) {
        errors.push("Amount must be a positive number");
    }
    if (typeof body.method !== "string" || !PAYMENT_METHODS.includes(body.method)) {
        errors.push(`Method must be one of: ${PAYMENT_METHODS.join(", ")}`);
    }
    if (body.status !== undefined && !PAYMENT_STATUSES.includes(body.status)) {
        errors.push(`Status must be one of: ${PAYMENT_STATUSES.join(", ")}`);
    }
    if (body.transactionId !== undefined && body.transactionId !== null && typeof body.transactionId !== "string") {
        errors.push("transactionId must be a string or null");
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        onlineOrderId: body.onlineOrderId !== undefined && body.onlineOrderId !== null ? String(body.onlineOrderId) : undefined,
        offlineSaleId: body.offlineSaleId !== undefined && body.offlineSaleId !== null ? String(body.offlineSaleId) : undefined,
        amount: body.amount,
        method: body.method,
        transactionId: body.transactionId !== undefined && body.transactionId !== null ? String(body.transactionId) : undefined,
        gateway: body.gateway !== undefined && body.gateway !== null ? String(body.gateway) : undefined,
        gatewayResponse: body.gatewayResponse !== undefined ? body.gatewayResponse : undefined,
        status: body.status !== undefined ? body.status : undefined,
    });
}
export function validatePaymentVerifyInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (typeof body.verificationStatus !== "string" || !PAYMENT_VERIFICATION_STATUSES.includes(body.verificationStatus)) {
        return fail([`verificationStatus must be one of: ${PAYMENT_VERIFICATION_STATUSES.join(", ")}`]);
    }
    if (body.status !== undefined && !PAYMENT_STATUSES.includes(body.status)) {
        return fail([`status must be one of: ${PAYMENT_STATUSES.join(", ")}`]);
    }
    return pass({
        verificationStatus: body.verificationStatus,
        status: body.status !== undefined ? body.status : undefined,
    });
}
export function validateUpdatePaymentInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (body.status !== undefined && !PAYMENT_STATUSES.includes(body.status)) {
        errors.push(`Status must be one of: ${PAYMENT_STATUSES.join(", ")}`);
    }
    if (errors.length > 0)
        return fail(errors);
    const input = {};
    if (body.status !== undefined)
        input.status = body.status;
    if (body.amount !== undefined)
        input.amount = body.amount;
    if (body.transactionId !== undefined)
        input.transactionId = body.transactionId === null ? null : String(body.transactionId);
    if (body.gateway !== undefined)
        input.gateway = body.gateway === null ? null : String(body.gateway);
    if (body.gatewayResponse !== undefined)
        input.gatewayResponse = body.gatewayResponse;
    if (Object.keys(input).length === 0)
        return fail(["At least one field must be provided"]);
    return pass(input);
}
//# sourceMappingURL=payment.validation.js.map