import type { Request, Response } from "express";
import type { UserRole } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { WARRANTY, WARRANTY_MESSAGES } from "./warranty.constant";
import { warrantyService } from "./warranty.service";
import type { WarrantyQuery } from "./warranty.type";
import { validateCreateWarrantyInput, validateUpdateWarrantyInput } from "./warranty.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const warrantyController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, WARRANTY.DEFAULT_PAGE_SIZE);
    const customerId = queryString(req.query.customerId);
    const sellerId = queryString(req.query.sellerId);
    const status = queryString(req.query.status) as WarrantyQuery["status"];
    const search = queryString(req.query.search);

    const viewer = req.user ? { role: req.user.role as UserRole, userId: req.user.id } : undefined;
    const { items, total } = await warrantyService.list({ customerId, sellerId, status, search, page, limit, skip, take }, viewer);
    return paginated(res, items, page, limit, total, "Warranties retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const warranty = await warrantyService.getById(String(req.params.id));
    return ok(res, warranty);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateWarrantyInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const warranty = await warrantyService.create(result.value);
    return res.status(201).json({ status: "success", message: WARRANTY_MESSAGES.CREATED, data: warranty });
  },

  async update(req: Request, res: Response) {
    const result = validateUpdateWarrantyInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const warranty = await warrantyService.update(String(req.params.id), result.value);
    return ok(res, warranty, WARRANTY_MESSAGES.UPDATED);
  },

  async remove(req: Request, res: Response) {
    await warrantyService.remove(String(req.params.id));
    return noContent(res);
  },
};