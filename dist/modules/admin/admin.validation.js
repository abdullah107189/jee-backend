import { fail, isEmail, pass } from "../../utils/validation";
const MIN_PASSWORD = 6;
const MAX_PASSWORD = 128;
function isStringArray(value) {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}
export function validateCreateAdminInput(data) {
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
    if (body.permissions !== undefined && !isStringArray(body.permissions)) {
        errors.push("Permissions must be an array of strings");
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        email: body.email.trim().toLowerCase(),
        password: body.password,
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        phone: body.phone !== undefined && body.phone.trim() !== "" ? body.phone.trim() : undefined,
        permissions: body.permissions !== undefined ? body.permissions : undefined,
    });
}
export function validateUpdateAdminInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (body.permissions === undefined)
        return fail(["At least one field must be provided"]);
    if (!isStringArray(body.permissions))
        return fail(["Permissions must be an array of strings"]);
    return pass({ permissions: body.permissions });
}
//# sourceMappingURL=admin.validation.js.map