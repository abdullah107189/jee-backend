import type {
  Prisma,
  ProductItemStatus,
} from "../../../prisma/generated/prisma/client";
import {
  fail,
  isBoolean,
  isPlainObject,
  isSlug,
  parseJson,
  pass,
  toBoolean,
  type ValidationResult,
} from "../../utils/validation";
import { PRODUCT_ITEM_STATUSES } from "./product.constant";
import type {
  CreateItemInput,
  CreateProductInput,
  CreateVariantInput,
} from "./product.type";

export function validateCreateProductInput(
  data: unknown,
): ValidationResult<CreateProductInput> {
  if (typeof data !== "object" || data === null)
    return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.name !== "string" || body.name.trim() === "")
    errors.push("Name is required");
  if (
    body.slug !== undefined &&
    (typeof body.slug !== "string" || !isSlug(body.slug))
  ) {
    errors.push("Slug must be a valid slug");
  }
  if (
    body.warrantyMonths !== undefined &&
    (typeof body.warrantyMonths !== "number" ||
      !Number.isInteger(body.warrantyMonths) ||
      body.warrantyMonths < 0)
  ) {
    errors.push("warrantyMonths must be a non-negative integer");
  }
  if (body.isPublished !== undefined && !isBoolean(body.isPublished))
    errors.push("isPublished must be a boolean");
  if (body.isActive !== undefined && !isBoolean(body.isActive))
    errors.push("isActive must be a boolean");
  if (
    body.categoryId !== undefined &&
    body.categoryId !== null &&
    typeof body.categoryId !== "string"
  ) {
    errors.push("categoryId must be a string or null");
  }
  if (
    body.brandId !== undefined &&
    body.brandId !== null &&
    typeof body.brandId !== "string"
  ) {
    errors.push("brandId must be a string or null");
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    name: (body.name as string).trim(),
    slug: body.slug !== undefined ? (body.slug as string).trim() : undefined,
    description:
      body.description !== undefined && body.description !== null
        ? String(body.description)
        : undefined,
    specifications: parseJson(body.specifications),
    warrantyMonths:
      body.warrantyMonths !== undefined
        ? (body.warrantyMonths as number)
        : undefined,
    warrantyTerms:
      body.warrantyTerms !== undefined && body.warrantyTerms !== null
        ? String(body.warrantyTerms)
        : undefined,
    isPublished:
      body.isPublished !== undefined ? toBoolean(body.isPublished) : undefined,
    isActive:
      body.isActive !== undefined ? toBoolean(body.isActive) : undefined,
    categoryId:
      body.categoryId !== undefined && body.categoryId !== null
        ? (body.categoryId as string)
        : undefined,
    brandId:
      body.brandId !== undefined && body.brandId !== null
        ? (body.brandId as string)
        : undefined,
  });
}

export function validateUpdateProductInput(
  data: unknown,
): ValidationResult<Prisma.ProductUpdateInput> {
  if (typeof data !== "object" || data === null)
    return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (
    body.name !== undefined &&
    (typeof body.name !== "string" || body.name.trim() === "")
  ) {
    errors.push("Name must be a non-empty string");
  }
  if (
    body.slug !== undefined &&
    (typeof body.slug !== "string" || !isSlug(body.slug))
  ) {
    errors.push("Slug must be a valid slug");
  }
  if (
    body.warrantyMonths !== undefined &&
    (typeof body.warrantyMonths !== "number" || body.warrantyMonths < 0)
  ) {
    errors.push("warrantyMonths must be a non-negative number");
  }

  if (errors.length > 0) return fail(errors);

  const input: Prisma.ProductUpdateInput = {};
  if (body.name !== undefined) input.name = (body.name as string).trim();
  if (body.slug !== undefined) input.slug = (body.slug as string).trim();
  if (body.description !== undefined)
    input.description =
      body.description === null ? null : String(body.description);
  if (body.specifications !== undefined)
    input.specifications = parseJson(
      body.specifications,
    ) as Prisma.InputJsonValue;
  if (body.warrantyMonths !== undefined)
    input.warrantyMonths = body.warrantyMonths as number;
  if (body.warrantyTerms !== undefined)
    input.warrantyTerms =
      body.warrantyTerms === null ? null : String(body.warrantyTerms);
  if (body.isPublished !== undefined)
    input.isPublished = toBoolean(body.isPublished);
  if (body.isActive !== undefined) input.isActive = toBoolean(body.isActive);
  if (body.categoryId === null) {
    input.category = { disconnect: true };
  } else if (body.categoryId !== undefined) {
    input.category = { connect: { id: String(body.categoryId) } };
  }
  if (body.brandId === null) {
    input.brand = { disconnect: true };
  } else if (body.brandId !== undefined) {
    input.brand = { connect: { id: String(body.brandId) } };
  }

  if (Object.keys(input).length === 0)
    return fail(["At least one field must be provided"]);

  return pass(input);
}

export function validateCreateVariantInput(
  data: unknown,
): ValidationResult<CreateVariantInput> {
  if (typeof data !== "object" || data === null)
    return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.sku !== "string" || body.sku.trim() === "")
    errors.push("SKU is required");
  if (
    body.price === undefined ||
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 0
  ) {
    errors.push("Price must be a non-negative number");
  }
  if (
    body.comparePrice !== undefined &&
    body.comparePrice !== null &&
    (typeof body.comparePrice !== "number" || body.comparePrice < 0)
  ) {
    errors.push("comparePrice must be a non-negative number or null");
  }
  const attributes = parseJson(body.attributes);
  if (attributes === undefined || !isPlainObject(attributes))
    errors.push("Attributes must be a valid JSON object");
  if (
    body.images !== undefined &&
    (!Array.isArray(body.images) ||
      body.images.some((img) => typeof img !== "string"))
  ) {
    errors.push("Images must be an array of strings");
  }
  if (body.isDefault !== undefined && !isBoolean(body.isDefault))
    errors.push("isDefault must be a boolean");
  if (
    body.lowStockThreshold !== undefined &&
    (typeof body.lowStockThreshold !== "number" || body.lowStockThreshold < 0)
  ) {
    errors.push("lowStockThreshold must be a non-negative number");
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    sku: (body.sku as string).trim(),
    attributes: attributes as Record<string, unknown>,
    price: body.price as number,
    comparePrice:
      body.comparePrice !== undefined && body.comparePrice !== null
        ? (body.comparePrice as number)
        : undefined,
    images: body.images !== undefined ? (body.images as string[]) : undefined,
    isDefault:
      body.isDefault !== undefined ? toBoolean(body.isDefault) : undefined,
    lowStockThreshold:
      body.lowStockThreshold !== undefined
        ? (body.lowStockThreshold as number)
        : undefined,
    isActive:
      body.isActive !== undefined ? toBoolean(body.isActive) : undefined,
  });
}

export function validateUpdateVariantInput(
  data: unknown,
): ValidationResult<Prisma.ProductVariantUpdateInput> {
  if (typeof data !== "object" || data === null)
    return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (
    body.sku !== undefined &&
    (typeof body.sku !== "string" || body.sku.trim() === "")
  ) {
    errors.push("SKU must be a non-empty string");
  }
  if (
    body.price !== undefined &&
    (typeof body.price !== "number" || body.price < 0)
  ) {
    errors.push("Price must be a non-negative number");
  }
  if (
    body.images !== undefined &&
    (!Array.isArray(body.images) ||
      body.images.some((img) => typeof img !== "string"))
  ) {
    errors.push("Images must be an array of strings");
  }

  if (errors.length > 0) return fail(errors);

  const input: Prisma.ProductVariantUpdateInput = {};
  if (body.sku !== undefined) input.sku = (body.sku as string).trim();
  if (body.attributes !== undefined)
    input.attributes = parseJson(body.attributes) as Prisma.InputJsonValue;
  if (body.price !== undefined) input.price = body.price as number;
  if (body.comparePrice !== undefined)
    input.comparePrice =
      body.comparePrice === null ? null : (body.comparePrice as number);
  if (body.images !== undefined) input.images = body.images as string[];
  if (body.isDefault !== undefined) input.isDefault = toBoolean(body.isDefault);
  if (body.lowStockThreshold !== undefined)
    input.lowStockThreshold = body.lowStockThreshold as number;
  if (body.isActive !== undefined) input.isActive = toBoolean(body.isActive);

  if (Object.keys(input).length === 0)
    return fail(["At least one field must be provided"]);

  return pass(input);
}
// The AT command has been deprecated. Please use schtasks.exe instead.

// The binding handle is invalid.

export function validateCreateItemInput(
  data: unknown,
): ValidationResult<CreateItemInput> {
  if (typeof data !== "object" || data === null)
    return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof body.uniqueId !== "string" || body.uniqueId.trim() === "")
    errors.push("uniqueId is required");
  if (
    body.status !== undefined &&
    !(PRODUCT_ITEM_STATUSES as readonly string[]).includes(
      body.status as string,
    )
  ) {
    errors.push(`Status must be one of: ${PRODUCT_ITEM_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) return fail(errors);

  return pass({
    uniqueId: (body.uniqueId as string).trim(),
    serialNumber:
      body.serialNumber !== undefined && body.serialNumber !== null
        ? String(body.serialNumber)
        : undefined,
    status:
      body.status !== undefined
        ? (body.status as ProductItemStatus)
        : undefined,
    metadata: parseJson(body.metadata),
    manufacturedAt:
      body.manufacturedAt !== undefined && body.manufacturedAt !== null
        ? new Date(body.manufacturedAt as string)
        : undefined,
  });
}

export function validateUpdateItemInput(
  data: unknown,
): ValidationResult<Prisma.ProductItemUpdateInput> {
  if (typeof data !== "object" || data === null)
    return fail(["Request body must be an object"]);
  const body = data as Record<string, unknown>;
  const errors: string[] = [];

  if (
    body.status !== undefined &&
    !(PRODUCT_ITEM_STATUSES as readonly string[]).includes(
      body.status as string,
    )
  ) {
    errors.push(`Status must be one of: ${PRODUCT_ITEM_STATUSES.join(", ")}`);
  }

  if (errors.length > 0) return fail(errors);

  const input: Prisma.ProductItemUpdateInput = {};
  if (body.uniqueId !== undefined) input.uniqueId = String(body.uniqueId);
  if (body.serialNumber !== undefined)
    input.serialNumber =
      body.serialNumber === null ? null : String(body.serialNumber);
  if (body.status !== undefined)
    input.status = body.status as ProductItemStatus;
  if (body.metadata !== undefined)
    input.metadata = parseJson(body.metadata) as Prisma.InputJsonValue;
  if (body.manufacturedAt !== undefined && body.manufacturedAt !== null)
    input.manufacturedAt = new Date(body.manufacturedAt as string);

  if (Object.keys(input).length === 0)
    return fail(["At least one field must be provided"]);

  return pass(input);
}
