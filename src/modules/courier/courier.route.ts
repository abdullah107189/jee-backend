import { Router } from "express";
import { courierController } from "./courier.controller";

const router = Router();

// Public webhook endpoints called directly by courier services
router.post("/webhooks/courier/steadfast", courierController.handleSteadfastWebhook);
router.post("/webhooks/courier/pathao", courierController.handlePathaoWebhook);

export default router;
