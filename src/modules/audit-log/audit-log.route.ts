import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { auditLogController } from "./audit-log.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/", auditLogController.list);
router.get("/stats", auditLogController.stats);
router.get("/:id", auditLogController.getById);
router.post("/", auditLogController.create);

export default router;