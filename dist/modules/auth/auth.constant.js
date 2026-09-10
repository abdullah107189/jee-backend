export const AUTH = {
    /** 15 minutes, in seconds. */
    ACCESS_TOKEN_EXPIRY_SECONDS: 15 * 60,
    /** Password reset links stay valid for 15 minutes. */
    RESET_TOKEN_EXPIRY_MINUTES: 15,
    RESET_TOKEN_EXPIRY_SECONDS: 15 * 60,
    TOKEN_PURPOSE: {
        RESET_PASSWORD: "reset-password",
        VERIFY_EMAIL: "verify-email",
    },
};
export const AUTH_MESSAGES = {
    REGISTER_SUCCESS: "Account created successfully",
    LOGIN_SUCCESS: "Logged in successfully",
    PASSWORD_CHANGED: "Password changed successfully",
    PASSWORD_RESET: "Password has been reset successfully",
    RESET_LINK: "If an account exists for that email, a reset token has been generated",
};
//# sourceMappingURL=auth.constant.js.map