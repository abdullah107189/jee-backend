import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { warrantyCheckRateLimiter } from "../../middleware/rateLimiter";
import { warrantyController } from "./warranty.controller";

const router = Router();

// Public check endpoint (no login required, rate-limited)
router.get(
  "/check/:serialNumber",
  warrantyCheckRateLimiter,
  warrantyController.checkBySerialNumber,
);

// Authenticated routes below
router.use(authenticate);

router.get(
  "/",
  authorize("ADMIN", "CUSTOMER", "SELLER"),
  warrantyController.list,
);
router.get(
  "/:id",
  authorize("ADMIN", "CUSTOMER", "SELLER"),
  warrantyController.getById,
);
router.patch("/:id", authorize("ADMIN"), warrantyController.update);

export default router;