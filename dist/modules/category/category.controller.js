import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { toBoolean } from "../../utils/validation";
import { CATEGORY, CATEGORY_MESSAGES } from "./category.constant";
import { categoryService } from "./category.service";
import { validateCreateCategoryInput, validateUpdateCategoryInput } from "./category.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const categoryController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, CATEGORY.DEFAULT_PAGE_SIZE);
        const search = queryString(req.query.search);
        const parentQuery = queryString(req.query.parent);
        const parentId = parentQuery === undefined ? undefined : parentQuery === "null" || parentQuery === "" || parentQuery === "root" ? null : parentQuery;
        const isActive = req.query.isActive !== undefined ? toBoolean(req.query.isActive) : undefined;
        const { categories, total } = await categoryService.list({ search, parentId, isActive, page, limit, skip, take });
        return paginated(res, categories, page, limit, total, "Categories retrieved successfully");
    },
    async getById(req, res) {
        const category = await categoryService.getById(String(req.params.id));
        return ok(res, category);
    },
    async create(req, res) {
        const result = validateCreateCategoryInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const category = await categoryService.create(result.value);
        return ok(res, category, CATEGORY_MESSAGES.CREATED);
    },
    async update(req, res) {
        const result = validateUpdateCategoryInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const category = await categoryService.update(String(req.params.id), result.value);
        return ok(res, category, CATEGORY_MESSAGES.UPDATED);
    },
    async remove(req, res) {
        await categoryService.remove(String(req.params.id));
        return noContent(res);
    },
};
//# sourceMappingURL=category.controller.js.map