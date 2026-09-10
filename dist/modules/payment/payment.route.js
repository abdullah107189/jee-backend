import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { paymentController } from "./payment.controller";
const router = Router();
router.use(authenticate);
router.get("/", authorize("ADMIN", "CUSTOMER", "SELLER"), paymentController.list);
router.post("/", authorize("ADMIN", "CUSTOMER", "SELLER"), paymentController.create);
router.get("/:id", authorize("ADMIN", "CUSTOMER", "SELLER"), paymentController.getById);
router.patch("/:id/verify", authorize("ADMIN"), paymentController.verify);
router.patch("/:id", authorize("ADMIN"), paymentController.update);
export default router;
//# sourceMappingURL=payment.route.js.map