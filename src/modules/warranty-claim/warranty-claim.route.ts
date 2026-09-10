import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { warrantyClaimController } from "./warranty-claim.controller";

const router = Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "CUSTOMER", "SELLER"), warrantyClaimController.list);
router.post("/", authorize("ADMIN", "CUSTOMER", "SELLER"), warrantyClaimController.create);
router.get("/:id", authorize("ADMIN", "CUSTOMER", "SELLER"), warrantyClaimController.getById);
router.patch("/:id/status", authorize("ADMIN"), warrantyClaimController.updateStatus);
router.patch("/:id", authorize("ADMIN"), warrantyClaimController.update);

export default router;