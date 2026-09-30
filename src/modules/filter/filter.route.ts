import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { filterController } from "./filter.controller";

const router = Router();

/* ─────────── Public ─────────── */
router.get(
  "/category/:fullSlug",
  filterController.getCategoryFilters,
);

/* ─────────── Admin ─────────── */
router.use(authenticate, authorize("ADMIN"));

router.get("/", filterController.getAll);
router.get("/by-category/:categoryId", filterController.getByCategory);
router.post("/", filterController.create);
router.patch("/:id", filterController.update);
router.delete("/:id", filterController.remove);

export default router;