import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { adminController } from "./admin.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/", adminController.list);
router.post("/", adminController.create);
router.get("/:id", adminController.getById);
router.patch("/:id", adminController.update);
router.delete("/:id", adminController.remove);

export default router;