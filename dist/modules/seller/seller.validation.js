import { fail, isEmail, pass } from "../../utils/validation";
import { SELLER_STATUSES } from "./seller.constant";
const MIN_PASSWORD = 6;
const MAX_PASSWORD = 128;
function isKnownStatus(value) {
    return typeof value === "string" && SELLER_STATUSES.includes(value);
}
function optionalString(value, label) {
    if (value === undefined)
        return undefined;
    if (typeof value !== "string")
        return value;
    return value.trim() === "" ? undefined : value.trim();
}
export function validateCreateSellerInput(data) {
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
    if (typeof body.companyName !== "string" || body.companyName.trim() === "") {
        errors.push("Company name is required");
    }
    if (typeof body.country !== "string" || body.country.trim() === "")
        errors.push("Country is required");
    if (errors.length > 0)
        return fail(errors);
    return pass({
        email: body.email.trim().toLowerCase(),
        password: body.password,
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        phone: optionalString(body.phone, "phone"),
        companyName: body.companyName.trim(),
        businessLicense: optionalString(body.businessLicense, "businessLicense"),
        address: optionalString(body.address, "address"),
        city: optionalString(body.city, "city"),
        state: optionalString(body.state, "state"),
        zipCode: optionalString(body.zipCode, "zipCode"),
        country: body.country.trim(),
        taxId: optionalString(body.taxId, "taxId"),
    });
}
export function validateSellerProfileInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    for (const key of ["companyName", "businessLicense", "address", "city", "state", "zipCode", "country", "taxId"]) {
        if (body[key] !== undefined && body[key] !== null && typeof body[key] !== "string") {
            errors.push(`${key} must be a string or null`);
        }
    }
    if (errors.length > 0)
        return fail(errors);
    const input = {};
    if (typeof body.companyName === "string" && body.companyName.trim() !== "") {
        input.companyName = body.companyName.trim();
    }
    if (body.businessLicense !== undefined)
        input.businessLicense = body.businessLicense === null ? null : String(body.businessLicense);
    if (body.address !== undefined)
        input.address = body.address === null ? null : String(body.address);
    if (body.city !== undefined)
        input.city = body.city === null ? null : String(body.city);
    if (body.state !== undefined)
        input.state = body.state === null ? null : String(body.state);
    if (body.zipCode !== undefined)
        input.zipCode = body.zipCode === null ? null : String(body.zipCode);
    if (typeof body.country === "string" && body.country.trim() !== "")
        input.country = body.country.trim();
    if (body.taxId !== undefined)
        input.taxId = body.taxId === null ? null : String(body.taxId);
    if (Object.keys(input).length === 0)
        return fail(["At least one field must be provided"]);
    return pass(input);
}
export function validateUpdateSellerInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (body.companyName !== undefined && (typeof body.companyName !== "string" || body.companyName.trim() === "")) {
        errors.push("Company name must be a non-empty string");
    }
    if (body.status !== undefined && !isKnownStatus(body.status)) {
        errors.push("Status must be one of: PENDING, APPROVED, SUSPENDED, DISABLED");
    }
    if (errors.length > 0)
        return fail(errors);
    const input = {};
    if (typeof body.companyName === "string")
        input.companyName = body.companyName.trim();
    if (body.status !== undefined)
        input.status = body.status;
    if (body.businessLicense !== undefined)
        input.businessLicense = body.businessLicense === null ? null : String(body.businessLicense);
    if (body.address !== undefined)
        input.address = body.address === null ? null : String(body.address);
    if (body.city !== undefined)
        input.city = body.city === null ? null : String(body.city);
    if (body.state !== undefined)
        input.state = body.state === null ? null : String(body.state);
    if (body.zipCode !== undefined)
        input.zipCode = body.zipCode === null ? null : String(body.zipCode);
    if (body.country !== undefined)
        input.country = String(body.country);
    if (body.taxId !== undefined)
        input.taxId = body.taxId === null ? null : String(body.taxId);
    if (Object.keys(input).length === 0)
        return fail(["At least one field must be provided"]);
    return pass(input);
}
//# sourceMappingURL=seller.validation.js.map