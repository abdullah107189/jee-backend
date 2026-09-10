import { fail, pass } from "../../utils/validation";
import { NOTIFICATION_CHANNELS, NOTIFICATION_TYPES } from "./notification.constant";
export function validateCreateNotificationInput(data) {
    if (typeof data !== "object" || data === null)
        return fail(["Request body must be an object"]);
    const body = data;
    const errors = [];
    if (typeof body.userId !== "string" || body.userId.trim() === "")
        errors.push("userId is required");
    if (typeof body.type !== "string" || !NOTIFICATION_TYPES.includes(body.type)) {
        errors.push(`Type must be one of: ${NOTIFICATION_TYPES.join(", ")}`);
    }
    if (typeof body.title !== "string" || body.title.trim() === "")
        errors.push("Title is required");
    if (typeof body.message !== "string" || body.message.trim() === "")
        errors.push("Message is required");
    if (body.channel !== undefined && !NOTIFICATION_CHANNELS.includes(body.channel)) {
        errors.push(`Channel must be one of: ${NOTIFICATION_CHANNELS.join(", ")}`);
    }
    if (errors.length > 0)
        return fail(errors);
    return pass({
        userId: body.userId.trim(),
        type: body.type,
        title: body.title.trim(),
        message: body.message.trim(),
        data: body.data !== undefined ? body.data : undefined,
        channel: body.channel !== undefined ? body.channel : undefined,
        priority: body.priority !== undefined ? String(body.priority) : undefined,
    });
}
//# sourceMappingURL=notification.validation.js.map