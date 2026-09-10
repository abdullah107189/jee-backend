import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { offlineSaleController } from "./offline-sale.controller";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "SELLER"), offlineSaleController.list);
router.post("/", authorize("ADMIN", "SELLER"), offlineSaleController.create);
router.get("/:id", authorize("ADMIN", "SELLER"), offlineSaleController.getById);
router.patch("/:id", authorize("ADMIN", "SELLER"), offlineSaleController.update);
router.delete("/:id", authorize("ADMIN"), offlineSaleController.remove);

export default router;