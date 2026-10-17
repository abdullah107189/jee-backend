import type { Prisma } from "../../../prisma/generated/prisma/client";
import { fail, pass, type ValidationResult } from "../../utils/validation";
import { WARRANTY_STATUSES } from "./warranty.constant";

export function validateUpdateWarrantyInput(data: unknown): ValidationResult<Prisma.WarrantyUpdateInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (body.startDate !== undefined || body.endDate !== undefined) {
    return fail(["Warranty dates cannot be modified"]);
  }

  if (body.status === undefined || !(WARRANTY_STATUSES as readonly string[]).includes(String(body.status))) {
    return fail([`status is required and must be one of: ${WARRANTY_STATUSES.join(", ")}`]);
  }

  const input: Prisma.WarrantyUpdateInput = {
    status: body.status as Prisma.WarrantyUpdateInput["status"],
  };

  if (body.claimReason !== undefined) {
    input.claimReason = body.claimReason === null ? null : String(body.claimReason);
  }

  return pass(input);
}