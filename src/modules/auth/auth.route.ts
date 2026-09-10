import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authenticate, authController.changePassword);

export default router;