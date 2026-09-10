import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { customerController } from "./customer.controller";

const router = Router();

router.use(authenticate);

// Customer self-service
router.get("/me", authorize("CUSTOMER"), customerController.getMe);
router.patch("/me", authorize("CUSTOMER", "ADMIN"), customerController.updateMe);

// Admin management
router.get("/", authorize("ADMIN"), customerController.list);
router.post("/", authorize("ADMIN"), customerController.create);
router.get("/:id", authorize("ADMIN", "CUSTOMER"), customerController.getById);
router.patch("/:id", authorize("ADMIN"), customerController.update);
router.delete("/:id", authorize("ADMIN"), customerController.remove);

export default router;