import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { productController } from "./product.controller";

const router = Router();

// Public (storefront) reads
router.get("/", productController.list);
router.get("/filters", productController.getFilters);

// router.get("/variants", productController.listVariants);
// router.get("/variants/:variantId", productController.getVariantById);

// Inventory reads (auth)
// router.get("/items", authenticate, authorize("ADMIN", "SELLER"), productController.listItems);
// router.get("/items/:itemId", authenticate, authorize("ADMIN", "SELLER"), productController.getItemById);
router.get("/:id", productController.getById);
router.get("/slug/:slug", productController.getBySlug);
// router.get("/:id/variants", productController.listVariantsByProduct);

// Writes
// router.post("/", authenticate, authorize("ADMIN"), productController.create);
router.post("/", productController.createProduct);
// router.post("/:id/variants", authenticate, authorize("ADMIN"), productController.createVariant);
// router.patch("/:id", authenticate, authorize("ADMIN"), productController.update);
// router.delete("/:id", authenticate, authorize("ADMIN"), productController.remove);

// router.patch("/variants/:variantId", authenticate, authorize("ADMIN"), productController.updateVariant);
// router.delete("/variants/:variantId", authenticate, authorize("ADMIN"), productController.removeVariant);

// router.post("/variants/:variantId/items", authenticate, authorize("ADMIN", "SELLER"), productController.createItem);
// router.patch("/items/:itemId", authenticate, authorize("ADMIN", "SELLER"), productController.updateItem);
// router.delete("/items/:itemId", authenticate, authorize("ADMIN", "SELLER"), productController.removeItem);

export default router;
