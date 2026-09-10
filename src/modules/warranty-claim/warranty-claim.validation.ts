import type { Prisma } from "../../../prisma/generated/prisma/client";
import { fail, pass, type ValidationResult } from "../../utils/validation";
import { CLAIM_STATUSES } from "./warranty-claim.constant";
import type { ClaimStatusInput, CreateClaimInput } from "./warranty-claim.type";

export function validateCreateClaimInput(data: unknown): ValidationResult<CreateClaimInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.warrantyId !== "string" || body.warrantyId.trim() === "") {
    errors.push("warrantyId is required");
  }
  if (typeof body.description !== "string" || body.description.trim() === "") {
    errors.push("Description is required");
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    warrantyId: (body.warrantyId as string).trim(),
    description: (body.description as string).trim(),
  });
}

export function validateClaimStatusInput(data: unknown): ValidationResult<ClaimStatusInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (typeof body.status !== "string" || !(CLAIM_STATUSES as readonly string[]).includes(body.status)) {
    return fail([`Status must be one of: ${CLAIM_STATUSES.join(", ")}`]);
  }

  return pass({ status: body.status as ClaimStatusInput["status"] });
}

export function validateUpdateClaimInput(data: unknown): ValidationResult<Prisma.WarrantyClaimUpdateInput> {
  if (typeof data !== "object" || data === null) return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;

  if (body.status !== undefined && !(CLAIM_STATUSES as readonly string[]).includes(body.status as string)) {
    return fail([`Status must be one of: ${CLAIM_STATUSES.join(", ")}`]);
  }

  const input: Prisma.WarrantyClaimUpdateInput = {};
  if (body.status !== undefined) input.status = body.status as Prisma.WarrantyClaimUpdateInput["status"];
  if (body.description !== undefined) input.description = String(body.description);
  if (body.resolution !== undefined) input.resolution = body.resolution === null ? null : String(body.resolution);
  if (body.claimAmount !== undefined) input.claimAmount = body.claimAmount === null ? null : (body.claimAmount as number);

  if (Object.keys(input).length === 0) return fail(["At least one field must be provided"]);

  return pass(input);
}