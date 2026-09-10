import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { warrantyController } from "./warranty.controller";
const router = Router();
router.use(authenticate);
router.get("/", authorize("ADMIN", "CUSTOMER", "SELLER"), warrantyController.list);
router.post("/", authorize("ADMIN"), warrantyController.create);
router.get("/:id", authorize("ADMIN", "CUSTOMER", "SELLER"), warrantyController.getById);
router.patch("/:id", authorize("ADMIN"), warrantyController.update);
router.delete("/:id", authorize("ADMIN"), warrantyController.remove);
export default router;
//# sourceMappingURL=warranty.route.js.map