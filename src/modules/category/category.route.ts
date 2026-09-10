import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { categoryController } from "./category.controller";

const router = Router();

// Public (storefront) reads
router.get("/", categoryController.list);
router.get("/:id", categoryController.getById);

// Admin writes
router.post("/", authenticate, authorize("ADMIN"), categoryController.create);
router.patch("/:id", authenticate, authorize("ADMIN"), categoryController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), categoryController.remove);

export default router;