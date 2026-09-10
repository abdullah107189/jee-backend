import { AppError } from "../../middleware/error.middleware";
import { noContent, ok, paginated, parsePagination, queryDate, queryString } from "../../utils/api";
import { OFFLINE_SALE, OFFLINE_SALE_MESSAGES } from "./offline-sale.constant";
import { offlineSaleService } from "./offline-sale.service";
import { validateCreateOfflineSaleInput, validateUpdateOfflineSaleInput } from "./offline-sale.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const offlineSaleController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, OFFLINE_SALE.DEFAULT_PAGE_SIZE);
        const sellerId = queryString(req.query.sellerId);
        const search = queryString(req.query.search);
        const from = queryDate(req.query.from);
        const to = queryDate(req.query.to);
        const viewer = req.user ? { role: req.user.role, userId: req.user.id } : undefined;
        const { items, total } = await offlineSaleService.list({ sellerId, search, from, to, page, limit, skip, take }, viewer);
        return paginated(res, items, page, limit, total, "Offline sales retrieved successfully");
    },
    async getById(req, res) {
        const sale = await offlineSaleService.getById(String(req.params.id));
        return ok(res, sale);
    },
    async create(req, res) {
        if (!req.user)
            throw new AppError("Authentication required", 401);
        const result = validateCreateOfflineSaleInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const sale = await offlineSaleService.create(req.user.id, result.value);
        return res.status(201).json({ status: "success", message: OFFLINE_SALE_MESSAGES.CREATED, data: sale });
    },
    async update(req, res) {
        const result = validateUpdateOfflineSaleInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const sale = await offlineSaleService.update(String(req.params.id), result.value);
        return ok(res, sale, OFFLINE_SALE_MESSAGES.UPDATED);
    },
    async remove(req, res) {
        await offlineSaleService.remove(String(req.params.id));
        return noContent(res);
    },
};
//# sourceMappingURL=offline-sale.controller.js.map