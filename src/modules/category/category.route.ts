import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { categoryController } from "./category.controller";

const router = Router();

/* ─────────── Public ─────────── */

// ── static (specific)
router.get("/nav", categoryController.getNav);
router.get("/flat", categoryController.getAllFlat);

// ── slug-path routes (Express 5 named wildcard)
router.get("/{*fullSlug}/products", categoryController.getProducts);
router.get("/{*fullSlug}/filters", categoryController.getFilters);

// ── generic (last)
router.get("/id/:id", categoryController.getById);
router.get("/:slug", categoryController.getBySlug);
router.get("/", categoryController.getAll);

/* ─────────── Admin ─────────── */
router.post("/", authenticate, authorize("ADMIN"), categoryController.create);
router.patch(
  "/reorder",
  authenticate,
  authorize("ADMIN"),
  categoryController.reorder,
);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  categoryController.remove,
);

export default router;
