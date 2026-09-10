import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { activityLogController } from "./activity-log.controller";
const router = Router();
router.use(authenticate);
router.get("/", activityLogController.list);
router.post("/", activityLogController.create);
router.get("/:id", activityLogController.getById);
export default router;
//# sourceMappingURL=activity-log.route.js.map