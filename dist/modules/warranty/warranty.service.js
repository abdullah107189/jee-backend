import { AppError } from "../../middleware/error.middleware";
import { WARRANTY_MESSAGES } from "./warranty.constant";
import { warrantyRepository } from "./warranty.repository";
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}
export const warrantyService = {
    async list(query, viewer) {
        let customerId = query.customerId;
        let sellerId = query.sellerId;
        if (viewer?.role === "CUSTOMER") {
            const customer = await warrantyRepository.findCustomerIdByUserId(viewer.userId);
            if (customer)
                customerId = customer.id;
        }
        else if (viewer?.role === "SELLER") {
            const seller = await warrantyRepository.findSellerIdByUserId(viewer.userId);
            if (seller)
                sellerId = seller.id;
        }
        const params = { customerId, sellerId, status: query.status, search: query.search, skip: query.skip, take: query.take };
        const [items, total] = await Promise.all([warrantyRepository.findMany(params), warrantyRepository.count(params)]);
        return { items, total };
    },
    async getById(id) {
        const warranty = await warrantyRepository.findById(id);
        if (!warranty)
            throw new AppError(WARRANTY_MESSAGES.NOT_FOUND, 404);
        return warranty;
    },
    async create(input) {
        const item = await warrantyRepository.findProductItem(input.productItemId);
        if (!item)
            throw new AppError(WARRANTY_MESSAGES.ITEM_NOT_FOUND, 404);
        if (await warrantyRepository.findByProductItemId(input.productItemId)) {
            throw new AppError(WARRANTY_MESSAGES.ALREADY_EXISTS, 409);
        }
        if (input.offlineSaleId && (await warrantyRepository.findByOfflineSaleId(input.offlineSaleId))) {
            throw new AppError(WARRANTY_MESSAGES.OFFLINE_SALE_IN_USE, 409);
        }
        const startDate = input.startDate ? new Date(input.startDate) : new Date();
        const warrantyMonths = item.variant.product.warrantyMonths ?? 12;
        const endDate = input.endDate ?? addMonths(startDate, warrantyMonths);
        const data = {
            productItemId: input.productItemId,
            saleType: input.saleType,
            startDate,
            endDate,
            status: input.status ?? "ACTIVE",
            claimLimitType: input.claimLimitType ?? "LIMITED",
        };
        if (input.customerId !== undefined)
            data.customerId = input.customerId;
        if (input.sellerId !== undefined)
            data.sellerId = input.sellerId;
        if (input.onlineOrderId !== undefined)
            data.onlineOrderId = input.onlineOrderId;
        if (input.offlineSaleId !== undefined)
            data.offlineSaleId = input.offlineSaleId;
        if (input.terms !== undefined)
            data.terms = input.terms;
        return warrantyRepository.create(data);
    },
    async update(id, input) {
        await this.getById(id);
        return warrantyRepository.update(id, input);
    },
    async remove(id) {
        await this.getById(id);
        try {
            await warrantyRepository.remove(id);
        }
        catch {
            throw new AppError(WARRANTY_MESSAGES.CANNOT_DELETE_WITH_CLAIMS, 409);
        }
    },
};
//# sourceMappingURL=warranty.service.js.map