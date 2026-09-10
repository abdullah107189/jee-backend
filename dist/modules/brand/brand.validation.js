import { fail, isBoolean, isSlug, pass, toBoolean } from "../../utils/validation";
export function validateCreateBrandInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.name !== "string" || body.name.trim() === "")
        errors.push("Name is required");
    if (body.slug !== undefined && (typeof body.slug !== "string" || !isSlug(body.slug))) {
        errors.push("Slug must be a valid URL slug (lowercase letters, numbers and hyphens)");
    }
    if (body.isActive !== undefined && !isBoolean(body.isActive))
        errors.push("isActive must be a boolean");
    if (body.logo !== undefined && body.logo !== null && typeof body.logo !== "string") {
        errors.push("logo must be a string or null");
    }
    if (body.description !== undefined && body.description !== null && typeof body.description !== "string") {
        errors.push("description must be a string or null");
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        name: body.name.trim(),
        slug: body.slug !== undefined ? body.slug.trim() : undefined,
        logo: body.logo !== undefined && body.logo !== null ? String(body.logo) : undefined,
        description: body.description !== undefined && body.description !== null ? String(body.description) : undefined,
        isActive: body.isActive !== undefined ? toBoolean(body.isActive) : undefined,
    });
}
export function validateUpdateBrandInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (body.name !== undefined && (typeof body.name !== "string" || body.name.trim() === "")) {
        errors.push("Name must be a non-empty string");
    }
    if (body.slug !== undefined && (typeof body.slug !== "string" || !isSlug(body.slug))) {
        errors.push("Slug must be a valid slug");
    }
    if (body.isActive !== undefined && !isBoolean(body.isActive))
        errors.push("isActive must be a boolean");
    if (errors.length > 0)
        return fail(errors);
    const input = {};
    if (body.name !== undefined)
        input.name = body.name.trim();
    if (body.slug !== undefined)
        input.slug = body.slug.trim();
    if (body.logo !== undefined)
        input.logo = body.logo === null ? null : String(body.logo);
    if (body.description !== undefined)
        input.description = body.description === null ? null : String(body.description);
    if (body.isActive !== undefined)
        input.isActive = toBoolean(body.isActive);
    if (Object.keys(input).length === 0)
        return fail(["At least one field must be provided"]);
    return pass(input);
}
//# sourceMappingURL=brand.validation.js.map