import { fail, isEmail, pass } from "../../utils/validation";
function optionalString(value) {
    if (value === undefined || value === null)
        return undefined;
    return String(value).trim() === "" ? undefined : String(value).trim();
}
export function validateCreateOfflineSaleInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.productItemId !== "string" || body.productItemId.trim() === "") {
        errors.push("productItemId is required");
    }
    if (typeof body.customerName !== "string" || body.customerName.trim() === "") {
        errors.push("Customer name is required");
    }
    if (typeof body.customerPhone !== "string" || body.customerPhone.trim() === "") {
        errors.push("Customer phone is required");
    }
    if (body.salePrice === undefined || typeof body.salePrice !== "number" || body.salePrice < 0) {
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
    if (errors.length > 0)
        return fail(errors);
    return pass({
        productItemId: body.productItemId.trim(),
        customerId: body.customerId !== undefined && body.customerId !== null ? String(body.customerId) : undefined,
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        customerEmail: optionalString(body.customerEmail),
        salePrice: body.salePrice,
        discount: body.discount !== undefined ? body.discount : undefined,
        tax: body.tax !== undefined ? body.tax : undefined,
        notes: optionalString(body.notes),
        paymentMethod: optionalString(body.paymentMethod),
        saleDate: body.saleDate !== undefined && body.saleDate !== null ? new Date(body.saleDate) : undefined,
    });
}
export function validateUpdateOfflineSaleInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const input = {};
    if (body.customerName !== undefined)
        input.customerName = String(body.customerName);
    if (body.customerPhone !== undefined)
        input.customerPhone = String(body.customerPhone);
    if (body.customerEmail !== undefined)
        input.customerEmail = body.customerEmail === null ? null : String(body.customerEmail);
    if (body.customerId === null) {
        input.customer = { disconnect: true };
    }
    else if (body.customerId !== undefined) {
        input.customer = { connect: { id: String(body.customerId) } };
    }
    if (body.salePrice !== undefined)
        input.salePrice = body.salePrice;
    if (body.discount !== undefined)
        input.discount = body.discount;
    if (body.tax !== undefined)
        input.tax = body.tax;
    if (body.notes !== undefined)
        input.notes = body.notes === null ? null : String(body.notes);
    if (body.paymentMethod !== undefined)
        input.paymentMethod = body.paymentMethod === null ? null : String(body.paymentMethod);
    if (body.saleDate !== undefined && body.saleDate !== null)
        input.saleDate = new Date(body.saleDate);
    if (Object.keys(input).length === 0)
        return fail(["At least one field must be provided"]);
    return pass(input);
}
//# sourceMappingURL=offline-sale.validation.js.map