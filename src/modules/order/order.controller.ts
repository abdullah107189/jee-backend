import type { Request, Response } from "express";
import type { OrderStatus, UserRole } from "../../../prisma/generated/prisma/client";
import AppError  from "../../errors/AppError";
import { ok, paginated, parsePagination, queryString } from "../../utils/api";
import { ORDER, ORDER_MESSAGES } from "./order.constant";
import { orderService } from "./order.service";
import { validateCreateOrderInput, validateOrderStatusInput } from "./order.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const orderController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, ORDER.DEFAULT_PAGE_SIZE);
    const status = queryString(req.query.status) as OrderStatus | undefined;
    const search = queryString(req.query.search);
    const customerId = queryString(req.query.customerId);

    const viewer = req.user ? { role: req.user.role as UserRole, userId: req.user.id } : undefined;
    const { items, total } = await orderService.list({ customerId, status, search, page, limit, skip, take }, viewer);
    return paginated(res, items, page, limit, total, "Orders retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const order = await orderService.getById(String(req.params.id));
    return ok(res, order);
  },

  async create(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const result = validateCreateOrderInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const order = await orderService.create(req.user.id, result.value);
    return res.status(201).json({ status: "success", message: ORDER_MESSAGES.CREATED, data: order });
  },

  async updateStatus(req: Request, res: Response) {
    const result = validateOrderStatusInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const order = await orderService.updateStatus(String(req.params.id), result.value.status);
    return ok(res, order, ORDER_MESSAGES.UPDATED);
  },

  async cancel(req: Request, res: Response) {
    const order = await orderService.cancel(String(req.params.id));
    return ok(res, order, ORDER_MESSAGES.CANCELLED);
  },
};