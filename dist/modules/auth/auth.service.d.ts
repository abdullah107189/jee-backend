import type { AuthResponse, ChangePasswordInput, ForgotPasswordInput, ForgotPasswordResponse, LoginInput, RegisterInput, ResetPasswordInput } from "./auth.type";
export declare const authService: {
    register(input: RegisterInput): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
    changePassword(userId: string, input: ChangePasswordInput): Promise<void>;
    forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordResponse>;
    resetPassword(input: ResetPasswordInput): Promise<void>;
};
