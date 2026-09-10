import { fail, pass } from "../../utils/validation";
import { CLAIM_STATUSES } from "./warranty-claim.constant";
export function validateCreateClaimInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.warrantyId !== "string" || body.warrantyId.trim() === "") {
        errors.push("warrantyId is required");
    }
    if (typeof body.description !== "string" || body.description.trim() === "") {
        errors.push("Description is required");
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        warrantyId: body.warrantyId.trim(),
        description: body.description.trim(),
    });
}
export function validateClaimStatusInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (typeof body.status !== "string" || !CLAIM_STATUSES.includes(body.status)) {
        return fail([`Status must be one of: ${CLAIM_STATUSES.join(", ")}`]);
    }
    return pass({ status: body.status });
}
export function validateUpdateClaimInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (body.status !== undefined && !CLAIM_STATUSES.includes(body.status)) {
        return fail([`Status must be one of: ${CLAIM_STATUSES.join(", ")}`]);
    }
    const input = {};
    if (body.status !== undefined)
        input.status = body.status;
    if (body.description !== undefined)
        input.description = String(body.description);
    if (body.resolution !== undefined)
        input.resolution = body.resolution === null ? null : String(body.resolution);
    if (body.claimAmount !== undefined)
        input.claimAmount = body.claimAmount === null ? null : body.claimAmount;
    if (Object.keys(input).length === 0)
        return fail(["At least one field must be provided"]);
    return pass(input);
}
//# sourceMappingURL=warranty-claim.validation.js.map