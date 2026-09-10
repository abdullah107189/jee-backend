import type { Request, Response } from "express";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { ADMIN, ADMIN_MESSAGES } from "./admin.constant";
import { adminService } from "./admin.service";
import { validateCreateAdminInput, validateUpdateAdminInput } from "./admin.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const adminController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, ADMIN.DEFAULT_PAGE_SIZE);
    const search = queryString(req.query.search);

    const { admins, total } = await adminService.list({ search, page, limit, skip, take });
    return paginated(res, admins, page, limit, total, "Admins retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const admin = await adminService.getById(String(req.params.id));
    return ok(res, admin);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateAdminInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const admin = await adminService.create(result.value);
    return ok(res, admin, ADMIN_MESSAGES.CREATED);
  },

  async update(req: Request, res: Response) {
    const result = validateUpdateAdminInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const admin = await adminService.update(String(req.params.id), result.value);
    return ok(res, admin, ADMIN_MESSAGES.UPDATED);
  },

  async remove(req: Request, res: Response) {
    await adminService.remove(String(req.params.id));
    return noContent(res);
  },
};