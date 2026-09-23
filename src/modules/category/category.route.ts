import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { categoryController } from "./category.controller";

const router = Router();

/* ─────────── Public ─────────── */
router.get("/nav", categoryController.getNav);
router.get("/", categoryController.getAll);
router.get("/:slug", categoryController.getBySlug);
router.get("/id/:id", categoryController.getById); 

/* ─────────── Admin ─────────── */
router.post("/", authenticate, authorize("ADMIN"), categoryController.create);
router.patch("/reorder", authenticate, authorize("ADMIN"), categoryController.reorder);
router.patch("/:id", authenticate, authorize("ADMIN"), categoryController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), categoryController.remove);

export default router;