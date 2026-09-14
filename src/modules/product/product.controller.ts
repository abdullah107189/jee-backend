import type { Request, Response } from "express";

import {
  noContent,
  ok,
  paginated,
  parsePagination,
  queryString,
} from "../../utils/api";
import { toBoolean } from "../../utils/validation";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

import { PRODUCT, PRODUCT_MESSAGES } from "./product.constant";
import { productService } from "./product.service";
import { validateCreateProductInput } from "./product.validation";
import { AppError } from "../../middleware/error.middleware";

type ValidationError = {
  field: string;
  message: string;
};

// ---- Products ----

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = validateCreateProductInput(req.body);

  if (!result.ok) {
    throw new AppError("Validation failed", 400, result.errors);
  }

  const product = await productService.create(result.value);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: PRODUCT_MESSAGES.CREATED,
    data: product,
  });
});

const list = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, take } = parsePagination(
    req.query as Record<string, unknown>,
    PRODUCT.DEFAULT_PAGE_SIZE,
  );

  const search = queryString(req.query.search);
  const categoryId = queryString(req.query.categoryId);
  const brandId = queryString(req.query.brandId);

  const isPublished =
    req.query.isPublished !== undefined
      ? toBoolean(req.query.isPublished)
      : undefined;

  const isActive =
    req.query.isActive !== undefined
      ? toBoolean(req.query.isActive)
      : undefined;

  const { items, total } = await productService.list({
    search,
    categoryId,
    brandId,
    isPublished,
    isActive,
    page,
    limit,
    skip,
    take,
  });

  return paginated(
    res,
    items,
    page,
    limit,
    total,
    "Products retrieved successfully",
  );
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getById(String(req.params.id));

  return ok(res, product);
});

// const update = catchAsync(async (req: Request, res: Response) => {
//   const result = validateUpdateProductInput(req.body);

//   if (!result.ok) {
//     return sendValidationError(res, result.errors);
//   }

//   const product = await productService.update(
//     String(req.params.id),
//     result.value,
//   );

//   return ok(res, product, PRODUCT_MESSAGES.UPDATED);
// });

const remove = catchAsync(async (req: Request, res: Response) => {
  await productService.remove(String(req.params.id));

  return noContent(res);
});

// ---- Variants ----

const listVariants = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, take } = parsePagination(
    req.query as Record<string, unknown>,
    PRODUCT.DEFAULT_PAGE_SIZE,
  );

  const search = queryString(req.query.search);

  const { items, total } = await productService.listVariants({
    search,
    page,
    limit,
    skip,
    take,
  });

  return paginated(
    res,
    items,
    page,
    limit,
    total,
    "Variants retrieved successfully",
  );
});

const listVariantsByProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit, skip, take } = parsePagination(
      req.query as Record<string, unknown>,
      PRODUCT.DEFAULT_PAGE_SIZE,
    );

    const search = queryString(req.query.search);
    const productId = String(req.params.id);

    // Check whether product exists
    await productService.getById(productId);

    const { items, total } = await productService.listVariants({
      productId,
      search,
      page,
      limit,
      skip,
      take,
    });

    return paginated(
      res,
      items,
      page,
      limit,
      total,
      "Variants retrieved successfully",
    );
  },
);

const getVariantById = catchAsync(async (req: Request, res: Response) => {
  const variant = await productService.getVariantById(
    String(req.params.variantId),
  );

  return ok(res, variant);
});

const removeVariant = catchAsync(async (req: Request, res: Response) => {
  await productService.removeVariant(String(req.params.variantId));

  return noContent(res);
});

// ---- Product Items ----

const listItems = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, take } = parsePagination(
    req.query as Record<string, unknown>,
    PRODUCT.DEFAULT_PAGE_SIZE,
  );

  const status = queryString(req.query.status);
  const variantId = queryString(req.query.variantId);
  const productId = queryString(req.query.productId);

  const isAvailable =
    req.query.isAvailable !== undefined
      ? toBoolean(req.query.isAvailable)
      : undefined;

  const { items, total } = await productService.listItems({
    status,
    variantId,
    productId,
    isAvailable,
    page,
    limit,
    skip,
    take,
  });

  return paginated(
    res,
    items,
    page,
    limit,
    total,
    "Product items retrieved successfully",
  );
});

const getItemById = catchAsync(async (req: Request, res: Response) => {
  const item = await productService.getItemById(String(req.params.itemId));

  return ok(res, item);
});

const removeItem = catchAsync(async (req: Request, res: Response) => {
  await productService.removeItem(String(req.params.itemId));

  return noContent(res);
});

// ---- Controller ----

export const productController = {
  // Products
  createProduct,
  list,
  getById,
  // update,
  remove,

  // Variants
  listVariants,
  listVariantsByProduct,
  getVariantById,
  removeVariant,

  // Product Items
  listItems,
  getItemById,
  removeItem,
};
