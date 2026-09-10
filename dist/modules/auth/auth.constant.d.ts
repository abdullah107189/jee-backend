export declare const AUTH: {
    /** 15 minutes, in seconds. */
    readonly ACCESS_TOKEN_EXPIRY_SECONDS: number;
    /** Password reset links stay valid for 15 minutes. */
    readonly RESET_TOKEN_EXPIRY_MINUTES: 15;
    readonly RESET_TOKEN_EXPIRY_SECONDS: number;
    readonly TOKEN_PURPOSE: {
        readonly RESET_PASSWORD: "reset-password";
        readonly VERIFY_EMAIL: "verify-email";
    };
};
export declare const AUTH_MESSAGES: {
    readonly REGISTER_SUCCESS: "Account created successfully";
    readonly LOGIN_SUCCESS: "Logged in successfully";
    readonly PASSWORD_CHANGED: "Password changed successfully";
    readonly PASSWORD_RESET: "Password has been reset successfully";
    readonly RESET_LINK: "If an account exists for that email, a reset token has been generated";
};
