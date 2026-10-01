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

const getAllFlat = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllFlat();

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

const getProductsByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { fullSlug } = req.params;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const brandIds = req.query.brand
      ? String(req.query.brand).split(",").filter(Boolean)
      : undefined;

    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;
    const warrantyMonths = req.query.warrantyMonths
      ? Number(req.query.warrantyMonths)
      : undefined;
    const sort = req.query.sort as any;

    const result = await categoryService.getProductsByCategory(
      fullSlug as string,
      {
        brandIds,
        minPrice,
        maxPrice,
        warrantyMonths,
        sort,
        page,
        limit,
      },
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category products fetched",
      data: result,
    });
  },
);

// ------ filter ----------
const getFilters = catchAsync(async (req: Request, res: Response) => {
  const data = await categoryService.getFilters(req.params.fullSlug as string);
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

  const data = await categoryService.getProducts(
    req.params.fullSlug as string,
    result.value,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products fetched",
    data,
  });
});

/* ─────────── Export ─────────── */

export const categoryController = {
  getNav,
  getAll,
  getAllFlat,
  getBySlug,
  create,
  update,
  remove,
  reorder,
  getById,
  getProductsByCategory,

  // ------- filter ---------
  getFilters,
  getProducts,
};
