import { Router } from "express";
import {
  register,
  verifyEmail,
  resendOTP,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
} from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

// forgot password
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);
router.post("/reset-password", resetPassword);

export default router;
