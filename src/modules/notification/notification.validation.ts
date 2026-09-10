import { fail, pass, toBoolean, type ValidationResult } from "../../utils/validation";
import { NOTIFICATION_CHANNELS, NOTIFICATION_TYPES } from "./notification.constant";
import type { CreateNotificationInput } from "./notification.type";

export function validateCreateNotificationInput(data: unknown): ValidationResult<CreateNotificationInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.userId !== "string" || body.userId.trim() === "") errors.push("userId is required");
  if (typeof body.type !== "string" || !(NOTIFICATION_TYPES as readonly string[]).includes(body.type)) {
    errors.push(`Type must be one of: ${NOTIFICATION_TYPES.join(", ")}`);
  }
  if (typeof body.title !== "string" || body.title.trim() === "") errors.push("Title is required");
  if (typeof body.message !== "string" || body.message.trim() === "") errors.push("Message is required");
  if (body.channel !== undefined && !(NOTIFICATION_CHANNELS as readonly string[]).includes(body.channel as string)) {
    errors.push(`Channel must be one of: ${NOTIFICATION_CHANNELS.join(", ")}`);
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    userId: (body.userId as string).trim(),
    type: body.type as CreateNotificationInput["type"],
    title: (body.title as string).trim(),
    message: (body.message as string).trim(),
    data: body.data !== undefined ? body.data : undefined,
    channel: body.channel !== undefined ? (body.channel as CreateNotificationInput["channel"]) : undefined,
    priority: body.priority !== undefined ? String(body.priority) : undefined,
  });
}