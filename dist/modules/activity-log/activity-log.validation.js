import { fail, pass } from "../../utils/validation";
export function validateCreateActivityInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    if (typeof body.activity !== "string" || body.activity.trim() === "") {
        return fail(["Activity is required"]);
    }
    return pass({
        activity: body.activity.trim(),
        description: body.description !== undefined && body.description !== null ? String(body.description) : undefined,
        data: body.data !== undefined ? body.data : undefined,
    });
}
//# sourceMappingURL=activity-log.validation.js.map