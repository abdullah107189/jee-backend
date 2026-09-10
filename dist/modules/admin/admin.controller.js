import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import { ADMIN, ADMIN_MESSAGES } from "./admin.constant";
import { adminService } from "./admin.service";
import { validateCreateAdminInput, validateUpdateAdminInput } from "./admin.validation";
function sendValidationError(res, errors) {
    return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}
export const adminController = {
    async list(req, res) {
        const { page, limit, skip, take } = parsePagination(req.query, ADMIN.DEFAULT_PAGE_SIZE);
        const search = queryString(req.query.search);
        const { admins, total } = await adminService.list({ search, page, limit, skip, take });
        return paginated(res, admins, page, limit, total, "Admins retrieved successfully");
    },
    async getById(req, res) {
        const admin = await adminService.getById(String(req.params.id));
        return ok(res, admin);
    },
    async create(req, res) {
        const result = validateCreateAdminInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const admin = await adminService.create(result.value);
        return ok(res, admin, ADMIN_MESSAGES.CREATED);
    },
    async update(req, res) {
        const result = validateUpdateAdminInput(req.body);
        if (!result.ok)
            return sendValidationError(res, result.errors);
        const admin = await adminService.update(String(req.params.id), result.value);
        return ok(res, admin, ADMIN_MESSAGES.UPDATED);
    },
    async remove(req, res) {
        await adminService.remove(String(req.params.id));
        return noContent(res);
    },
};
//# sourceMappingURL=admin.controller.js.map