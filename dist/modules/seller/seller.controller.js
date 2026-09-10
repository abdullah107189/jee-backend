import { AppError } from "../../middleware/error.middleware";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { SELLER, SELLER_MESSAGES } from "./seller.constant";
import { sellerService } from "./seller.service";
import { validateCreateSellerInput, validateSellerProfileInput, validateUpdateSellerInput } from "./seller.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const sellerController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, SELLER.DEFAULT_PAGE_SIZE);
        const search = queryString(req.query.search);
        const status = queryString(req.query.status);
        const { sellers, total } = await sellerService.list({ search, status, page, limit, skip, take });
        return paginated(res, sellers, page, limit, total, "Sellers retrieved successfully");
    },
    async getById(req, res) {
        const seller = await sellerService.getById(String(req.params.id));
        return ok(res, seller);
    },
    async getMe(req, res) {
        if (!req.user)
            throw new AppError("Authentication required", 401);
        const seller = await sellerService.getByUserId(req.user.id);
        return ok(res, seller);
    },
    async updateMe(req, res) {
        if (!req.user)
            throw new AppError("Authentication required", 401);
        const result = validateSellerProfileInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const seller = await sellerService.updateMe(req.user.id, result.value);
        return ok(res, seller, SELLER_MESSAGES.PROFILE_UPDATED);
    },
    async create(req, res) {
        const result = validateCreateSellerInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const seller = await sellerService.create(result.value);
        return ok(res, seller, SELLER_MESSAGES.CREATED);
    },
    async update(req, res) {
        const result = validateUpdateSellerInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const seller = await sellerService.update(String(req.params.id), result.value);
        return ok(res, seller, SELLER_MESSAGES.UPDATED);
    },
    async remove(req, res) {
        await sellerService.remove(String(req.params.id));
        return noContent(res);
    },
};
//# sourceMappingURL=seller.controller.js.map