import type { Request, Response } from "express";

import { noContent, ok, paginated, parsePagination } from "../../utils/api";
import {
  queryNumber,
  querySort,
  queryString,
  queryStringArray,
  toBoolean,
} from "../../utils/query";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

import { PRODUCT, PRODUCT_MESSAGES } from "./product.constant";
import { productService } from "./product.service";
import { validateCreateProductInput } from "./product.validation";
import AppError  from "../../errors/AppError";

/* -------------------------------------------------------------------------- */
/* Create                                                                     */
/* -------------------------------------------------------------------------- */

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = validateCreateProductInput(req.body);
  if (!result.ok) {
    throw new AppError("Validation failed", 400, result.errors);
  }

  const product = await productService.create(result.value);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: PRODUCT_MESSAGES.CREATED,
    data: product,
  });
});

/* -------------------------------------------------------------------------- */
/* get filter                                                                 */
/* -------------------------------------------------------------------------- */
const getFilters = catchAsync(async (_req: Request, res: Response) => {
  const filters = await productService.getFilters();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product filters retrieved successfully",
    data: filters,
  });
});

/* -------------------------------------------------------------------------- */
/* List                                                                       */
/* -------------------------------------------------------------------------- */
const list = catchAsync(async (req: Request, res: Response) => {
  /* ---------- Pagination ---------- */
  const { page, limit } = parsePagination(
    req.query as Record<string, unknown>,
    PRODUCT.DEFAULT_PAGE_SIZE,
  );

  const safeLimit = Math.min(limit, 50);
  const safeSkip = (page - 1) * safeLimit;

  /* ---------- Filters ---------- */
  const search = queryString(req.query.search);
  const categoryId = queryString(req.query.categoryId);

  const brandIds = queryStringArray(req.query.brandIds);
  const brandId = queryString(req.query.brandId);

  const minPrice = queryNumber(req.query.minPrice);
  const maxPrice = queryNumber(req.query.maxPrice);

  // warrantyMonths=24,120
  const warrantyMonths = queryStringArray(req.query.warrantyMonths)
    .map(Number)
    .filter(Number.isFinite);

  const sort = querySort(req.query.sort);

  const isPublished = toBoolean(req.query.isPublished);
  const isActive = toBoolean(req.query.isActive);

  /* ---------- Service ---------- */
  const { items, total } = await productService.list({
    search,
    categoryId,
    brandId,
    brandIds: brandIds.length ? brandIds : undefined,
    minPrice,
    maxPrice,
    warrantyMonths: warrantyMonths.length
      ? warrantyMonths
      : undefined,
    sort,
    isPublished,
    isActive,
    skip: safeSkip,
    take: safeLimit,
  });

  /* ---------- Response ---------- */
  const totalPages = Math.ceil(total / safeLimit);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products retrieved successfully",
    meta: {
      page,
      limit: safeLimit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: items,
  });
});


/* -------------------------------------------------------------------------- */
/* Get by slug — DETAIL                                                       */
/* -------------------------------------------------------------------------- */
const getBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = String(req.params.slug);

  // Fetch product first
  const product = await productService.getBySlug(slug);

  // Then fetch related (parallel-er jonno alada call)
  const related = await productService.getRelated(
    product.id,
    product.category?.id ?? null,
    8,
  );

  return ok(res, {
    ...product,
    relatedProducts: related,
  });
});
/* -------------------------------------------------------------------------- */
/* Get by id — admin                                                          */
/* -------------------------------------------------------------------------- */
const getById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getById(String(req.params.id));
  return ok(res, product);
});

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */
export const productController = {
  createProduct,
  getFilters,
  list,
  getBySlug,
  getById,
};
