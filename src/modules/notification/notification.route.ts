import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { notificationController } from "./notification.controller";

const router = Router();

router.use(authenticate);

// Own notifications (any role)
router.get("/", notificationController.list);
router.patch("/read-all", notificationController.markAllRead);
router.get("/:id", notificationController.getById);
router.patch("/:id/read", notificationController.markRead);
router.delete("/:id", notificationController.remove);

// Admin broadcast
router.post("/", authorize("ADMIN"), notificationController.create);

export default router;