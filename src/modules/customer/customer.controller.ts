import type { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { CUSTOMER, CUSTOMER_MESSAGES } from "./customer.constant";
import { customerService } from "./customer.service";
import { validateCreateCustomerInput, validateUpdateCustomerInput } from "./customer.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const customerController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, CUSTOMER.DEFAULT_PAGE_SIZE);
    const search = queryString(req.query.search);

    const { customers, total } = await customerService.list({ search, page, limit, skip, take });
    return paginated(res, customers, page, limit, total, "Customers retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const customer = await customerService.getById(String(req.params.id));
    return ok(res, customer);
  },

  async getMe(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const customer = await customerService.getByUserId(req.user.id);
    return ok(res, customer);
  },

  async updateMe(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const result = validateUpdateCustomerInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const customer = await customerService.updateMe(req.user.id, result.value);
    return ok(res, customer, CUSTOMER_MESSAGES.PROFILE_UPDATED);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateCustomerInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const customer = await customerService.create(result.value);
    return ok(res, customer, CUSTOMER_MESSAGES.CREATED);
  },

  async update(req: Request, res: Response) {
    const result = validateUpdateCustomerInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const customer = await customerService.update(String(req.params.id), result.value);
    return ok(res, customer, CUSTOMER_MESSAGES.UPDATED);
  },

  async remove(req: Request, res: Response) {
    await customerService.remove(String(req.params.id));
    return noContent(res);
  },
};