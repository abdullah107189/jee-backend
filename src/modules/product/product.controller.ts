import type { Request, Response } from "express";

import { noContent, ok, paginated, parsePagination } from "../../utils/api";
import { queryNumber, querySort, queryString, queryStringArray, toBoolean } from "../../utils/query";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

import { PRODUCT, PRODUCT_MESSAGES } from "./product.constant";
import { productService } from "./product.service";
import { validateCreateProductInput } from "./product.validation";
import { AppError } from "../../middleware/error.middleware";

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/* List                                                                       */
/* -------------------------------------------------------------------------- */
const list = catchAsync(async (req: Request, res: Response) => {
  /* -------------------- Pagination -------------------- */
  const { page, limit, skip, take } = parsePagination(
    req.query as Record<string, unknown>,
    PRODUCT.DEFAULT_PAGE_SIZE,
  );

  /* -------------------- Filters -------------------- */
  const search = queryString(req.query.search);
  const categoryId = queryString(req.query.categoryId);

  // Multi-brand (preferred) + single-brand fallback
  const brandIds = queryStringArray(req.query.brandIds);
  const brandId = queryString(req.query.brandId);

  // Price range
  const minPrice = queryNumber(req.query.minPrice);
  const maxPrice = queryNumber(req.query.maxPrice);

  // Sort
  const sort = querySort(req.query.sort);

  // Boolean flags
  const isPublished =
    req.query.isPublished !== undefined
      ? toBoolean(req.query.isPublished)
      : undefined;

  const isActive =
    req.query.isActive !== undefined
      ? toBoolean(req.query.isActive)
      : undefined;

  /* -------------------- Delegate -------------------- */
  const { items, total } = await productService.list({
    search,
    categoryId,
    brandId,
    brandIds: brandIds.length > 0 ? brandIds : undefined,
    minPrice,
    maxPrice,
    sort,
    isPublished,
    isActive,
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

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */
export const productController = {
  createProduct,
  list,
};
