import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { orderController } from "./order.controller";
const router = Router();
router.use(authenticate);
router.post("/", authorize("CUSTOMER"), orderController.create);
router.get("/", authorize("ADMIN", "CUSTOMER"), orderController.list);
router.post("/:id/cancel", authorize("ADMIN", "CUSTOMER"), orderController.cancel);
router.get("/:id", authorize("ADMIN", "CUSTOMER"), orderController.getById);
router.patch("/:id/status", authorize("ADMIN"), orderController.updateStatus);
export default router;
//# sourceMappingURL=order.route.js.map