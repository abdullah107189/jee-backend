import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();
router.get("/", categoryController.getAll);
router.post("/", categoryController.create);

export default router;
