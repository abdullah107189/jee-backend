import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { sellerController } from "./seller.controller";

const router = Router();

router.use(authenticate);

// Seller self-service
router.get("/me", authorize("SELLER"), sellerController.getMe);
router.patch("/me", authorize("SELLER", "ADMIN"), sellerController.updateMe);

// Admin management
router.get("/", authorize("ADMIN"), sellerController.list);
router.post("/", authorize("ADMIN"), sellerController.create);
router.get("/:id", authorize("ADMIN", "SELLER"), sellerController.getById);
router.patch("/:id", authorize("ADMIN"), sellerController.update);
router.delete("/:id", authorize("ADMIN"), sellerController.remove);

export default router;