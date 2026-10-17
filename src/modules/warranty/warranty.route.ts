import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { warrantyController } from "./warranty.controller";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "CUSTOMER", "SELLER"), warrantyController.list);
router.get("/:id", authorize("ADMIN", "CUSTOMER", "SELLER"), warrantyController.getById);
router.patch("/:id", authorize("ADMIN"), warrantyController.update);

export default router;