import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { toBoolean } from "../../utils/validation";
import { PRODUCT, PRODUCT_MESSAGES } from "./product.constant";
import { productService } from "./product.service";
import { validateCreateItemInput, validateCreateProductInput, validateCreateVariantInput, validateUpdateItemInput, validateUpdateProductInput, validateUpdateVariantInput, } from "./product.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const productController = {
    // ---- Products ----
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, PRODUCT.DEFAULT_PAGE_SIZE);
        const search = queryString(req.query.search);
        const categoryId = queryString(req.query.categoryId);
        const brandId = queryString(req.query.brandId);
        const isPublished = req.query.isPublished !== undefined ? toBoolean(req.query.isPublished) : undefined;
        const isActive = req.query.isActive !== undefined ? toBoolean(req.query.isActive) : undefined;
        const { items, total } = await productService.list({ search, categoryId, brandId, isPublished, isActive, page, limit, skip, take });
        return paginated(res, items, page, limit, total, "Products retrieved successfully");
    },
    async getById(req, res) {
        const product = await productService.getById(String(req.params.id));
        return ok(res, product);
    },
    async create(req, res) {
        const result = validateCreateProductInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const product = await productService.create(result.value);
        return ok(res, product, PRODUCT_MESSAGES.CREATED);
    },
    async update(req, res) {
        const result = validateUpdateProductInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const product = await productService.update(String(req.params.id), result.value);
        return ok(res, product, PRODUCT_MESSAGES.UPDATED);
    },
    async remove(req, res) {
        await productService.remove(String(req.params.id));
        return noContent(res);
    },
    // ---- Variants ----
    async listVariants(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, PRODUCT.DEFAULT_PAGE_SIZE);
        const search = queryString(req.query.search);
        const { items, total } = await productService.listVariants({ search, page, limit, skip, take });
        return paginated(res, items, page, limit, total, "Variants retrieved successfully");
    },
    async listVariantsByProduct(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, PRODUCT.DEFAULT_PAGE_SIZE);
        const search = queryString(req.query.search);
        const productId = String(req.params.id);
        await productService.getById(productId);
        const { items, total } = await productService.listVariants({ productId, search, page, limit, skip, take });
        return paginated(res, items, page, limit, total, "Variants retrieved successfully");
    },
    async getVariantById(req, res) {
        const variant = await productService.getVariantById(String(req.params.variantId));
        return ok(res, variant);
    },
    async createVariant(req, res) {
        const result = validateCreateVariantInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const variant = await productService.createVariant(String(req.params.id), result.value);
        return ok(res, variant, PRODUCT_MESSAGES.VARIANT_CREATED);
    },
    async updateVariant(req, res) {
        const result = validateUpdateVariantInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const variant = await productService.updateVariant(String(req.params.variantId), result.value);
        return ok(res, variant, PRODUCT_MESSAGES.VARIANT_UPDATED);
    },
    async removeVariant(req, res) {
        await productService.removeVariant(String(req.params.variantId));
        return noContent(res);
    },
    // ---- Product items ----
    async listItems(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, PRODUCT.DEFAULT_PAGE_SIZE);
        const status = queryString(req.query.status);
        const variantId = queryString(req.query.variantId);
        const productId = queryString(req.query.productId);
        const isAvailable = req.query.isAvailable !== undefined ? toBoolean(req.query.isAvailable) : undefined;
        const { items, total } = await productService.listItems({ status, variantId, productId, isAvailable, page, limit, skip, take });
        return paginated(res, items, page, limit, total, "Product items retrieved successfully");
    },
    async getItemById(req, res) {
        const item = await productService.getItemById(String(req.params.itemId));
        return ok(res, item);
    },
    async createItem(req, res) {
        const result = validateCreateItemInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const item = await productService.createItem(String(req.params.variantId), result.value);
        return ok(res, item, PRODUCT_MESSAGES.ITEM_CREATED);
    },
    async updateItem(req, res) {
        const result = validateUpdateItemInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const item = await productService.updateItem(String(req.params.itemId), result.value);
        return ok(res, item, PRODUCT_MESSAGES.ITEM_UPDATED);
    },
    async removeItem(req, res) {
        await productService.removeItem(String(req.params.itemId));
        return noContent(res);
    },
};
//# sourceMappingURL=product.controller.js.map