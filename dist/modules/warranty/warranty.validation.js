import { fail, pass } from "../../utils/validation";
import { CLAIM_LIMIT_TYPES, SALE_TYPES, WARRANTY_STATUSES } from "./warranty.constant";
function optionalString(value) {
    if (value === undefined || value === null)
        return undefined;
    return String(value).trim() === "" ? undefined : String(value).trim();
}
export function validateCreateWarrantyInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.productItemId !== "string" || body.productItemId.trim() === "") {
        errors.push("productItemId is required");
    }
    if (typeof body.saleType !== "string" || !SALE_TYPES.includes(body.saleType)) {
        errors.push(`saleType must be one of: ${SALE_TYPES.join(", ")}`);
    }
    if (body.status !== undefined && !WARRANTY_STATUSES.includes(body.status)) {
        errors.push(`status must be one of: ${WARRANTY_STATUSES.join(", ")}`);
    }
    if (body.claimLimitType !== undefined && !CLAIM_LIMIT_TYPES.includes(body.claimLimitType)) {
        errors.push(`claimLimitType must be one of: ${CLAIM_LIMIT_TYPES.join(", ")}`);
    }
    if (body.endDate !== undefined && body.endDate !== null && Number.isNaN(new Date(body.endDate).getTime())) {
        errors.push("endDate must be a valid date");
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        productItemId: body.productItemId.trim(),
        saleType: body.saleType,
        customerId: body.customerId !== undefined && body.customerId !== null ? String(body.customerId) : undefined,
        sellerId: body.sellerId !== undefined && body.sellerId !== null ? String(body.sellerId) : undefined,
        onlineOrderId: body.onlineOrderId !== undefined && body.onlineOrderId !== null ? String(body.onlineOrderId) : undefined,
        offlineSaleId: body.offlineSaleId !== undefined && body.offlineSaleId !== null ? String(body.offlineSaleId) : undefined,
        startDate: body.startDate !== undefined && body.startDate !== null ? new Date(body.startDate) : undefined,
        endDate: body.endDate !== undefined && body.endDate !== null ? new Date(body.endDate) : undefined,
        status: body.status !== undefined ? body.status : undefined,
        claimLimitType: body.claimLimitType !== undefined ? body.claimLimitType : undefined,
        terms: optionalString(body.terms),
    });
}
export function validateUpdateWarrantyInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (body.status !== undefined && !WARRANTY_STATUSES.includes(body.status)) {
        errors.push(`status must be one of: ${WARRANTY_STATUSES.join(", ")}`);
    }
    if (errors.length > 0)
        return fail(errors);
    const input = {};
    if (body.status !== undefined)
        input.status = body.status;
    if (body.claimLimitType !== undefined)
        input.claimLimitType = body.claimLimitType;
    if (body.startDate !== undefined && body.startDate !== null)
        input.startDate = new Date(body.startDate);
    if (body.endDate !== undefined && body.endDate !== null)
        input.endDate = new Date(body.endDate);
    if (body.terms !== undefined)
        input.terms = body.terms === null ? null : String(body.terms);
    if (body.sellerId === null) {
        input.seller = { disconnect: true };
    }
    else if (body.sellerId !== undefined) {
        input.seller = { connect: { id: String(body.sellerId) } };
    }
    if (body.customerId === null) {
        input.customer = { disconnect: true };
    }
    else if (body.customerId !== undefined) {
        input.customer = { connect: { id: String(body.customerId) } };
    }
    if (body.claimReason !== undefined)
        input.claimReason = body.claimReason === null ? null : String(body.claimReason);
    if (Object.keys(input).length === 0)
        return fail(["At least one field must be provided"]);
    return pass(input);
}
//# sourceMappingURL=warranty.validation.js.map