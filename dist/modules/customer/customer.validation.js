import { fail, isEmail, parseJson, pass } from "../../utils/validation";
const MIN_PASSWORD = 6;
const MAX_PASSWORD = 128;
export function validateCreateCustomerInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.email !== "string" || !isEmail(body.email))
        errors.push("A valid email address is required");
    if (typeof body.password !== "string" ||
        body.password.length < MIN_PASSWORD ||
        body.password.length > MAX_PASSWORD) {
        errors.push(`Password must be between ${MIN_PASSWORD} and ${MAX_PASSWORD} characters`);
    }
    if (typeof body.firstName !== "string" || body.firstName.trim() === "")
        errors.push("First name is required");
    if (typeof body.lastName !== "string" || body.lastName.trim() === "")
        errors.push("Last name is required");
    if (body.phone !== undefined && body.phone !== null && typeof body.phone !== "string") {
        errors.push("Phone must be a string or null");
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        email: body.email.trim().toLowerCase(),
        password: body.password,
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        phone: typeof body.phone === "string" && body.phone.trim() !== "" ? body.phone.trim() : undefined,
        shippingAddress: parseJson(body.shippingAddress),
        billingAddress: parseJson(body.billingAddress),
        preferredPayment: parseJson(body.preferredPayment),
    });
}
export function validateUpdateCustomerInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (body.shippingAddress === undefined && body.billingAddress === undefined && body.preferredPayment === undefined) {
        return fail(["At least one field must be provided"]);
    }
    const input = {};
    if (body.shippingAddress !== undefined)
        input.shippingAddress = parseJson(body.shippingAddress);
    if (body.billingAddress !== undefined)
        input.billingAddress = parseJson(body.billingAddress);
    if (body.preferredPayment !== undefined)
        input.preferredPayment = parseJson(body.preferredPayment);
    return pass(input);
}
//# sourceMappingURL=customer.validation.js.map