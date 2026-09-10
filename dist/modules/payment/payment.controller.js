import { AppError } from "../../middleware/error.middleware";
import { ok, paginated, parsePagination, queryString } from "../../utils/api";
import { PAYMENT, PAYMENT_MESSAGES } from "./payment.constant";
import { paymentService } from "./payment.service";
import { validateCreatePaymentInput, validatePaymentVerifyInput, validateUpdatePaymentInput } from "./payment.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const paymentController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, PAYMENT.DEFAULT_PAGE_SIZE);
        const onlineOrderId = queryString(req.query.onlineOrderId);
        const offlineSaleId = queryString(req.query.offlineSaleId);
        const status = queryString(req.query.status);
        const viewer = req.user ? { role: req.user.role, userId: req.user.id } : undefined;
        const { items, total } = await paymentService.list({ onlineOrderId, offlineSaleId, status, page, limit, skip, take }, viewer);
        return paginated(res, items, page, limit, total, "Payments retrieved successfully");
    },
    async getById(req, res) {
        const payment = await paymentService.getById(String(req.params.id));
        return ok(res, payment);
    },
    async create(req, res) {
        if (!req.user)
            throw new AppError("Authentication required", 401);
        const result = validateCreatePaymentInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const payment = await paymentService.create(req.user.id, req.user.role, result.value);
        return res.status(201).json({ status: "success", message: PAYMENT_MESSAGES.CREATED, data: payment });
    },
    async verify(req, res) {
        if (!req.user)
            throw new AppError("Authentication required", 401);
        const result = validatePaymentVerifyInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const payment = await paymentService.verify(String(req.params.id), req.user.id, result.value);
        return ok(res, payment, PAYMENT_MESSAGES.VERIFIED);
    },
    async update(req, res) {
        const result = validateUpdatePaymentInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const payment = await paymentService.update(String(req.params.id), result.value);
        return ok(res, payment, PAYMENT_MESSAGES.UPDATED);
    },
};
//# sourceMappingURL=payment.controller.js.map