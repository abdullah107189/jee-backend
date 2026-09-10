import { AppError } from "../../middleware/error.middleware";
import { ok, paginated, parsePagination, queryString } from "../../utils/api";
import { WARRANTY_CLAIM, WARRANTY_CLAIM_MESSAGES } from "./warranty-claim.constant";
import { warrantyClaimService } from "./warranty-claim.service";
import { validateClaimStatusInput, validateCreateClaimInput, validateUpdateClaimInput } from "./warranty-claim.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const warrantyClaimController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, WARRANTY_CLAIM.DEFAULT_PAGE_SIZE);
        const warrantyId = queryString(req.query.warrantyId);
        const status = queryString(req.query.status);
        const viewer = req.user ? { role: req.user.role, userId: req.user.id } : undefined;
        const { items, total } = await warrantyClaimService.list({ warrantyId, status, page, limit, skip, take }, viewer);
        return paginated(res, items, page, limit, total, "Warranty claims retrieved successfully");
    },
    async getById(req, res) {
        const claim = await warrantyClaimService.getById(String(req.params.id));
        return ok(res, claim);
    },
    async create(req, res) {
        if (!req.user)
            throw new AppError("Authentication required", 401);
        const result = validateCreateClaimInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const claim = await warrantyClaimService.create(req.user.id, result.value);
        return res.status(201).json({ status: "success", message: WARRANTY_CLAIM_MESSAGES.CREATED, data: claim });
    },
    async updateStatus(req, res) {
        const result = validateClaimStatusInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const claim = await warrantyClaimService.updateStatus(String(req.params.id), result.value.status);
        return ok(res, claim, WARRANTY_CLAIM_MESSAGES.UPDATED);
    },
    async update(req, res) {
        const result = validateUpdateClaimInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const claim = await warrantyClaimService.update(String(req.params.id), result.value);
        return ok(res, claim, WARRANTY_CLAIM_MESSAGES.UPDATED);
    },
};
//# sourceMappingURL=warranty-claim.controller.js.map