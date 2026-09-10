import type { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { created, ok } from "../../utils/api";
import { AUTH_MESSAGES } from "./auth.constant";
import { authService } from "./auth.service";
import {
  validateChangePasswordInput,
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
} from "./auth.validation";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const authController = {
  async register(req: Request, res: Response) {
    const result = validateRegisterInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const data = await authService.register(result.value);
    return created(res, data, AUTH_MESSAGES.REGISTER_SUCCESS);
  },

  async login(req: Request, res: Response) {
    const result = validateLoginInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const data = await authService.login(result.value);
    return ok(res, data, AUTH_MESSAGES.LOGIN_SUCCESS);
  },

  async changePassword(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Authentication required", 401);

    const result = validateChangePasswordInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);

    await authService.changePassword(userId, result.value);
    return ok(res, null, AUTH_MESSAGES.PASSWORD_CHANGED);
  },

  async forgotPassword(req: Request, res: Response) {
    const result = validateForgotPasswordInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const data = await authService.forgotPassword(result.value);
    return ok(res, data);
  },

  async resetPassword(req: Request, res: Response) {
    const result = validateResetPasswordInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    await authService.resetPassword(result.value);
    return ok(res, null, AUTH_MESSAGES.PASSWORD_RESET);
  },
};