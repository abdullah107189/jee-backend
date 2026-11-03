import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { analyticsController } from "./analytics.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/admin", analyticsController.getAdminAnalytics);
router.get("/", analyticsController.getAdminAnalytics);

export default router;

