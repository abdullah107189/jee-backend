import type { Request, Response } from "express";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { toBoolean } from "../../utils/validation";
import { CATEGORY, CATEGORY_MESSAGES } from "./category.constant";
import { categoryService } from "./category.service";
import { validateCreateCategoryInput, validateUpdateCategoryInput } from "./category.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const categoryController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, CATEGORY.DEFAULT_PAGE_SIZE);
    const search = queryString(req.query.search);
    const parentQuery = queryString(req.query.parent);
    const parentId = parentQuery === undefined ? undefined : parentQuery === "null" || parentQuery === "" || parentQuery === "root" ? null : parentQuery;
    const isActive = req.query.isActive !== undefined ? toBoolean(req.query.isActive) : undefined;

    const { categories, total } = await categoryService.list({ search, parentId, isActive, page, limit, skip, take });
    return paginated(res, categories, page, limit, total, "Categories retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const category = await categoryService.getById(String(req.params.id));
    return ok(res, category);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateCategoryInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const category = await categoryService.create(result.value);
    return ok(res, category, CATEGORY_MESSAGES.CREATED);
  },

  async update(req: Request, res: Response) {
    const result = validateUpdateCategoryInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const category = await categoryService.update(String(req.params.id), result.value);
    return ok(res, category, CATEGORY_MESSAGES.UPDATED);
  },

  async remove(req: Request, res: Response) {
    await categoryService.remove(String(req.params.id));
    return noContent(res);
  },
};