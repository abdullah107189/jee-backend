import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { brandController } from "./brand.controller";

const router = Router();

router.post("/", brandController.create);
export default router;
