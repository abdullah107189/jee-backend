import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";
import { CATEGORY_MESSAGES } from "./category.constant";
import {
  validateCreateCategoryInput,
  validateUpdateCategoryInput,
  validateReorderCategoriesInput,
  validateProductListQuery,
} from "./category.validation";
import { AppError } from "../../middleware/globalErrorHandler";

/* ─────────── Helpers ─────────── */

const parseString = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

const parseBoolean = (v: unknown): boolean | undefined =>
  v === "true" ? true : v === "false" ? false : undefined;

const parseNumber = (v: unknown): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

/** Normalize wildcard param — Express 5 gives array */
const normalizeSlug = (raw: string | string[] | undefined): string =>
  Array.isArray(raw) ? raw.join("/") : (raw ?? "");

/* ─────────── Read ─────────── */

const getNav = catchAsync(async (_req: Request, res: Response) => {
  const data = await categoryService.getNav();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED,
    data,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await categoryService.getAll({
    isActive: parseBoolean(req.query.isActive),
    parentId: parseString(req.query.parentId) ?? null,
    level: parseNumber(req.query.level),
    search: parseString(req.query.search),
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED,
    data,
  });
});

const getAllFlat = catchAsync(async (_req: Request, res: Response) => {
  const data = await categoryService.getAllFlat();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED,
    data,
  });
});

const getBySlug = catchAsync(async (req: Request, res: Response) => {
  const data = await categoryService.getBySlug(req.params.slug as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED_ONE,
    data,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const data = await categoryService.getById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED_ONE,
    data,
  });
});

/* ─────────── Filters + Products ─────────── */

const getFilters = catchAsync(async (req: Request, res: Response) => {
  const fullSlug = normalizeSlug(req.params.fullSlug);
  const data = await categoryService.getFilters(fullSlug);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Filters fetched",
    data,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const result = validateProductListQuery(req.query);
  if (!result.ok) throw new AppError("Invalid query", 400, result.errors);

  const fullSlug = normalizeSlug(req.params.fullSlug);
  const data = await categoryService.getProducts(fullSlug, result.value);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products fetched",
    data,
  });
});

/* ─────────── Write (Admin) ─────────── */

const create = catchAsync(async (req: Request, res: Response) => {
  const result = validateCreateCategoryInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }
  const data = await categoryService.create(result.value);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: CATEGORY_MESSAGES.CREATED,
    data,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = validateUpdateCategoryInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }
  const data = await categoryService.update(req.params.id as string, result.value);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.UPDATED,
    data,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await categoryService.remove(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.DELETED,
    data: null,
  });
});

const reorder = catchAsync(async (req: Request, res: Response) => {
  const result = validateReorderCategoriesInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }
  const response = await categoryService.reorder(result.value);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: response.message,
    data: null,
  });
});

/* ─────────── Export ─────────── */

export const categoryController = {
  getNav,
  getAll,
  getAllFlat,
  getBySlug,
  getById,
  getFilters,
  getProducts,
  create,
  update,
  remove,
  reorder,
};