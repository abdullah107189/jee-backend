import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { WARRANTY, WARRANTY_MESSAGES } from "./warranty.constant";
import { warrantyService } from "./warranty.service";
import { validateCreateWarrantyInput, validateUpdateWarrantyInput } from "./warranty.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const warrantyController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, WARRANTY.DEFAULT_PAGE_SIZE);
        const customerId = queryString(req.query.customerId);
        const sellerId = queryString(req.query.sellerId);
        const status = queryString(req.query.status);
        const search = queryString(req.query.search);
        const viewer = req.user ? { role: req.user.role, userId: req.user.id } : undefined;
        const { items, total } = await warrantyService.list({ customerId, sellerId, status, search, page, limit, skip, take }, viewer);
        return paginated(res, items, page, limit, total, "Warranties retrieved successfully");
    },
    async getById(req, res) {
        const warranty = await warrantyService.getById(String(req.params.id));
        return ok(res, warranty);
    },
    async create(req, res) {
        const result = validateCreateWarrantyInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const warranty = await warrantyService.create(result.value);
        return res.status(201).json({ status: "success", message: WARRANTY_MESSAGES.CREATED, data: warranty });
    },
    async update(req, res) {
        const result = validateUpdateWarrantyInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const warranty = await warrantyService.update(String(req.params.id), result.value);
        return ok(res, warranty, WARRANTY_MESSAGES.UPDATED);
    },
    async remove(req, res) {
        await warrantyService.remove(String(req.params.id));
        return noContent(res);
    },
};
//# sourceMappingURL=warranty.controller.js.map