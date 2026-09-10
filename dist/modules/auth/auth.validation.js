import { fail, isEmail, pass, } from "../../utils/validation";
const MIN_PASSWORD = 6;
const MAX_PASSWORD = 128;
export function validateRegisterInput(data) {
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
    if (body.phone !== undefined && typeof body.phone !== "string")
        errors.push("Phone must be a string");
    if (errors.length > 0)
        return fail(errors);
    return pass({
        email: body.email.trim().toLowerCase(),
        password: body.password,
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        phone: body.phone !== undefined ? body.phone.trim() : undefined,
    });
}
export function validateLoginInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.identifier !== "string" || body.identifier.trim() === "") {
        errors.push("Email or phone number is required");
    }
    if (typeof body.password !== "string" || body.password === "")
        errors.push("Password is required");
    if (errors.length > 0)
        return fail(errors);
    return pass({
        identifier: body.identifier.trim(),
        password: body.password,
    });
}
export function validateChangePasswordInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.oldPassword !== "string" || body.oldPassword === "")
        errors.push("Current password is required");
    if (typeof body.newPassword !== "string" ||
        body.newPassword.length < MIN_PASSWORD ||
        body.newPassword.length > MAX_PASSWORD) {
        errors.push(`New password must be between ${MIN_PASSWORD} and ${MAX_PASSWORD} characters`);
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
    });
}
export function validateForgotPasswordInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (typeof body.email !== "string" || !isEmail(body.email))
        return fail(["A valid email address is required"]);
    return pass({ email: body.email.trim().toLowerCase() });
}
export function validateResetPasswordInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.token !== "string" || body.token === "")
        errors.push("Reset token is required");
    if (typeof body.newPassword !== "string" ||
        body.newPassword.length < MIN_PASSWORD ||
        body.newPassword.length > MAX_PASSWORD) {
        errors.push(`New password must be between ${MIN_PASSWORD} and ${MAX_PASSWORD} characters`);
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        token: body.token,
        newPassword: body.newPassword,
    });
}
//# sourceMappingURL=auth.validation.js.map