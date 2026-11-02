import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { brandController } from "./brand.controller";

const router = Router();

router.get("/", brandController.getAll);
router.get("/:id", brandController.getById);

router.post("/", authenticate, authorize("ADMIN"), brandController.create);
router.patch("/:id", authenticate, authorize("ADMIN"), brandController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), brandController.remove);

export default router;
