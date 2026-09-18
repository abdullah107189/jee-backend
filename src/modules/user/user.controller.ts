import type { Request, Response } from "express";
import type { UserRole } from "../../../prisma/generated/prisma/client";
import AppError  from "../../errors/AppError";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { toBoolean } from "../../utils/validation";
import { USER, USER_MESSAGES } from "./user.constant";
import { userService } from "./user.service";
import { validateCreateUserInput, validateProfileInput, validateUpdateUserInput } from "./user.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const userController = {
  async getMe(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const user = await userService.me(req.user.id);
    return ok(res, user);
  },

  async updateMe(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const result = validateProfileInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const user = await userService.updateMe(req.user.id, result.value);
    return ok(res, user, USER_MESSAGES.PROFILE_UPDATED);
  },

  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, USER.DEFAULT_PAGE_SIZE);
    const search = queryString(req.query.search);
    const role = queryString(req.query.role) as UserRole | undefined;
    const isActive = req.query.isActive !== undefined ? toBoolean(req.query.isActive) : undefined;

    const { users, total } = await userService.list({ search, role, isActive, page, limit, skip, take });
    return paginated(res, users, page, limit, total, "Users retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const user = await userService.getById(String(req.params.id));
    return ok(res, user);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateUserInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const user = await userService.create(result.value);
    return ok(res, user, USER_MESSAGES.CREATED);
  },

  async update(req: Request, res: Response) {
    const result = validateUpdateUserInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const user = await userService.update(String(req.params.id), result.value);
    return ok(res, user, USER_MESSAGES.UPDATED);
  },

  async remove(req: Request, res: Response) {
    await userService.remove(String(req.params.id));
    return noContent(res);
  },
};