import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";
import { CATEGORY_MESSAGES } from "./category.constant";
import {
  validateCreateCategoryInput,
  validateUpdateCategoryInput,
  validateReorderCategoriesInput,
} from "./category.validation";

/* ─────────── Helpers ─────────── */

function parseString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/* ─────────── Read ─────────── */

const getNav = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getNav();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED,
    data: categories,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAll({
    isActive: parseBoolean(req.query.isActive),
    parentId: parseString(req.query.parentId) ?? null,
    level: parseNumber(req.query.level),
    search: parseString(req.query.search),
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED,
    data: categories,
  });
});

const getBySlug = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getBySlug(req.params.slug as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED_ONE,
    data: category,
  });
});

// ----------------- Get category by ID (Admin) -----------------
const getById = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.FETCHED_ONE,
    data: category,
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

  const category = await categoryService.create(result.value);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: CATEGORY_MESSAGES.CREATED,
    data: category,
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

  const category = await categoryService.update(
    req.params.id as string,
    result.value,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: CATEGORY_MESSAGES.UPDATED,
    data: category,
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
  getBySlug,
  create,
  update,
  remove,
  reorder,
  getById,
};
