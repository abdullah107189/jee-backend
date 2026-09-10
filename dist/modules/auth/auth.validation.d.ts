import { type ValidationResult } from "../../utils/validation";
import type { ChangePasswordInput, ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "./auth.type";
export declare function validateRegisterInput(data: unknown): ValidationResult<RegisterInput>;
export declare function validateLoginInput(data: unknown): ValidationResult<LoginInput>;
export declare function validateChangePasswordInput(data: unknown): ValidationResult<ChangePasswordInput>;
export declare function validateForgotPasswordInput(data: unknown): ValidationResult<ForgotPasswordInput>;
export declare function validateResetPasswordInput(data: unknown): ValidationResult<ResetPasswordInput>;
