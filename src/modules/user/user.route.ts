import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { userController } from "./user.controller";

const router = Router();

router.use(authenticate);

// Self-service endpoints (any authenticated user)
router.get("/me", userController.getMe);
router.patch("/me", userController.updateMe);

// Admin management endpoints
router.get("/", authorize("ADMIN"), userController.list);
router.post("/", authorize("ADMIN"), userController.create);
router.get("/:id", authorize("ADMIN"), userController.getById);
router.patch("/:id", authorize("ADMIN"), userController.update);
router.delete("/:id", authorize("ADMIN"), userController.remove);

export default router;