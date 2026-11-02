import type { Request, Response } from "express";
import AppError from "../../errors/AppError";
import { noContent, ok, paginated, parsePagination, queryString } from "../../utils/api";
import type { SellerStatus } from "../../../prisma/generated/prisma/client";
import { SELLER, SELLER_MESSAGES } from "./seller.constant";
import { sellerService } from "./seller.service";
import { validateCreateSellerInput, validateSellerProfileInput, validateUpdateSellerInput } from "./seller.validation";
import { logAudit } from "../../utils/auditLogger";

function sendValidationError(res: Response, errors: string[]): Response {
  return res.status(400).json({ status: "fail", message: "Validation failed", errors });
}

export const sellerController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip, take } = parsePagination(req.query as Record<string, unknown>, SELLER.DEFAULT_PAGE_SIZE);
    const search = queryString(req.query.search);
    const status = queryString(req.query.status) as SellerStatus | undefined;

    const { sellers, total } = await sellerService.list({ search, status, page, limit, skip, take });
    return paginated(res, sellers, page, limit, total, "Sellers retrieved successfully");
  },

  async getById(req: Request, res: Response) {
    const seller = await sellerService.getById(String(req.params.id));
    return ok(res, seller);
  },

  async getMe(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const seller = await sellerService.getByUserId(req.user.id);
    return ok(res, seller);
  },

  async updateMe(req: Request, res: Response) {
    if (!req.user) throw new AppError("Authentication required", 401);
    const result = validateSellerProfileInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const seller = await sellerService.updateMe(req.user.id, result.value);
    return ok(res, seller, SELLER_MESSAGES.PROFILE_UPDATED);
  },

  async create(req: Request, res: Response) {
    const result = validateCreateSellerInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const seller = await sellerService.create(result.value);
    if (req.user?.id) {
      logAudit({
        userId: req.user.id,
        action: "SELLER_CREATED",
        entity: "Seller",
        entityId: seller.id,
        changes: result.value,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
    }
    return ok(res, seller, SELLER_MESSAGES.CREATED);
  },

  async update(req: Request, res: Response) {
    const result = validateUpdateSellerInput(req.body);
    if (!result.ok) return sendValidationError(res, result.errors);
    const seller = await sellerService.update(String(req.params.id), result.value);
    if (req.user?.id) {
      const actionName = result.value.status ? `SELLER_${result.value.status}` : "SELLER_UPDATED";
      logAudit({
        userId: req.user.id,
        action: actionName,
        entity: "Seller",
        entityId: String(req.params.id),
        changes: result.value,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
    }
    return ok(res, seller, SELLER_MESSAGES.UPDATED);
  },

  async remove(req: Request, res: Response) {
    await sellerService.remove(String(req.params.id));
    if (req.user?.id) {
      logAudit({
        userId: req.user.id,
        action: "SELLER_DELETED",
        entity: "Seller",
        entityId: String(req.params.id),
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
    }
    return noContent(res);
  },
};
