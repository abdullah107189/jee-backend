import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { toBoolean } from "../../utils/validation";
import { BRAND, BRAND_MESSAGES } from "./brand.constant";
import { brandService } from "./brand.service";
import { validateCreateBrandInput, validateUpdateBrandInput } from "./brand.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const brandController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, BRAND.DEFAULT_PAGE_SIZE);
        const search = queryString(req.query.search);
        const isActive = req.query.isActive !== undefined ? toBoolean(req.query.isActive) : undefined;
        const { brands, total } = await brandService.list({ search, isActive, page, limit, skip, take });
        return paginated(res, brands, page, limit, total, "Brands retrieved successfully");
    },
    async getById(req, res) {
        const brand = await brandService.getById(String(req.params.id));
        return ok(res, brand);
    },
    async create(req, res) {
        const result = validateCreateBrandInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const brand = await brandService.create(result.value);
        return ok(res, brand, BRAND_MESSAGES.CREATED);
    },
    async update(req, res) {
        const result = validateUpdateBrandInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const brand = await brandService.update(String(req.params.id), result.value);
        return ok(res, brand, BRAND_MESSAGES.UPDATED);
    },
    async remove(req, res) {
        await brandService.remove(String(req.params.id));
        return noContent(res);
    },
};
//# sourceMappingURL=brand.controller.js.map