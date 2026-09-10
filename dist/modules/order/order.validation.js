import { fail, parseJson, pass } from "../../utils/validation";
import { ORDER_STATUSES } from "./order.constant";
function isStringArray(value) {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}
export function validateCreateOrderInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (!isStringArray(body.productItemIds) || body.productItemIds.length === 0) {
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
    if (errors.length > 0)
        return fail(errors);
    return pass({
        productItemIds: body.productItemIds.slice(0, 50),
        shippingAddress: parseJson(body.shippingAddress),
        billingAddress: parseJson(body.billingAddress),
        discount: body.discount !== undefined ? body.discount : undefined,
        tax: body.tax !== undefined ? body.tax : undefined,
        shipping: body.shipping !== undefined ? body.shipping : undefined,
        metadata: parseJson(body.metadata),
    });
}
export function validateOrderStatusInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (typeof body.status !== "string" || !ORDER_STATUSES.includes(body.status)) {
        return fail([`Status must be one of: ${ORDER_STATUSES.join(", ")}`]);
    }
    return pass({ status: body.status });
}
//# sourceMappingURL=order.validation.js.map