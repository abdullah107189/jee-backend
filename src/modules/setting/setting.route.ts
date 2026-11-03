import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { settingController } from "./setting.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/", settingController.getSettings);
router.patch("/", settingController.updateSettings);
router.get("/backup", settingController.exportBackup);

export default router;

