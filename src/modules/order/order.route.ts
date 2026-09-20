import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { orderController } from "./order.controller";

const router = Router();

router.use(authenticate);

/* ─────────── Customer ─────────── */
router.post("/", authorize("CUSTOMER"), orderController.create);
router.get("/my", authorize("CUSTOMER"), orderController.getMyOrders);
router.post(
  "/:id/cancel",
  authorize("ADMIN", "CUSTOMER"),
  orderController.cancel,
);

/* ─────────── Admin ─────────── */
router.get("/", authorize("ADMIN"), orderController.getAll);
router.get("/:id", authorize("ADMIN", "CUSTOMER"), orderController.getById);
router.patch("/:id/status", authorize("ADMIN"), orderController.updateStatus);

export default router;
