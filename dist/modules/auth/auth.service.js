import { config } from "../../config/config";
import { AppError } from "../../middleware/error.middleware";
import { signToken, verifyToken } from "../../utils/jwt";
import { hashPassword, verifyPassword } from "../../utils/password";
import { AUTH, AUTH_MESSAGES } from "./auth.constant";
import { authRepository } from "./auth.repository";
function toAuthUser(user) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
    };
}
function issueAccessToken(userId) {
    return signToken({ sub: userId }, config.jwtSecret, AUTH.ACCESS_TOKEN_EXPIRY_SECONDS);
}
export const authService = {
    async register(input) {
        const email = input.email.trim().toLowerCase();
        const [existingByEmail, existingByPhone] = await Promise.all([
            authRepository.findByEmail(email),
            input.phone ? authRepository.findByPhone(input.phone.trim()) : Promise.resolve(null),
        ]);
        if (existingByEmail)
            throw new AppError("An account with this email already exists", 409);
        if (existingByPhone)
            throw new AppError("An account with this phone already exists", 409);
        const user = await authRepository.create({
            email,
            password: hashPassword(input.password),
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            phone: input.phone !== undefined && input.phone.trim() !== "" ? input.phone.trim() : undefined,
            role: "CUSTOMER",
            // A Customer profile is created automatically so every customer has one.
            customer: { create: {} },
        });
        return {
            user: toAuthUser(user),
            accessToken: issueAccessToken(user.id),
            tokenExpiresIn: AUTH.ACCESS_TOKEN_EXPIRY_SECONDS,
        };
    },
    async login(input) {
        const identifier = input.identifier.trim();
        const isEmail = identifier.includes("@");
        const user = isEmail
            ? await authRepository.findByEmail(identifier.toLowerCase())
            : await authRepository.findByPhone(identifier);
        if (!user)
            throw new AppError("Invalid credentials", 401);
        if (!verifyPassword(input.password, user.password))
            throw new AppError("Invalid credentials", 401);
        if (!user.isActive)
            throw new AppError("This account has been disabled. Contact support", 403);
        await authRepository.updateLastLogin(user.id);
        return {
            user: toAuthUser(user),
            accessToken: issueAccessToken(user.id),
            tokenExpiresIn: AUTH.ACCESS_TOKEN_EXPIRY_SECONDS,
        };
    },
    async changePassword(userId, input) {
        const user = await authRepository.findById(userId);
        if (!user)
            throw new AppError("User not found", 404);
        if (!verifyPassword(input.oldPassword, user.password)) {
            throw new AppError("Current password is incorrect", 400);
        }
        if (input.oldPassword === input.newPassword) {
            throw new AppError("New password must be different from the current password", 400);
        }
        await authRepository.updatePassword(userId, hashPassword(input.newPassword));
    },
    async forgotPassword(input) {
        const user = await authRepository.findByEmail(input.email.trim().toLowerCase());
        // Never reveal whether an email exists.
        if (!user) {
            return { resetToken: null, expiresIn: `${AUTH.RESET_TOKEN_EXPIRY_MINUTES} minutes`, message: AUTH_MESSAGES.RESET_LINK };
        }
        const resetToken = signToken({ sub: user.id, purpose: AUTH.TOKEN_PURPOSE.RESET_PASSWORD }, config.jwtSecret, AUTH.RESET_TOKEN_EXPIRY_SECONDS);
        // TODO: hand the token to your email/notification provider here.
        return {
            resetToken,
            expiresIn: `${AUTH.RESET_TOKEN_EXPIRY_MINUTES} minutes`,
            message: AUTH_MESSAGES.RESET_LINK,
        };
    },
    async resetPassword(input) {
        let payload;
        try {
            payload = verifyToken(input.token, config.jwtSecret);
        }
        catch {
            throw new AppError("Reset token is invalid or has expired", 400);
        }
        if (payload.purpose !== AUTH.TOKEN_PURPOSE.RESET_PASSWORD || typeof payload.sub !== "string") {
            throw new AppError("Reset token is invalid", 400);
        }
        const user = await authRepository.findById(payload.sub);
        if (!user)
            throw new AppError("User not found", 404);
        await authRepository.updatePassword(user.id, hashPassword(input.newPassword));
    },
};
//# sourceMappingURL=auth.service.js.map