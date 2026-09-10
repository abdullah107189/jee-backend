import { AppError } from "../../middleware/error.middleware";
import { OFFLINE_SALE_MESSAGES } from "./offline-sale.constant";
import { offlineSaleRepository } from "./offline-sale.repository";
function roundMoney(value) {
    return Math.round(value * 100) / 100;
}
function generateInvoiceNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString("hex").toUpperCase().slice(0, 5);
    return `INV-${timestamp}${random}`;
}
export const offlineSaleService = {
    async list(query, viewer) {
        let sellerId = query.sellerId;
        if (viewer?.role === "SELLER") {
            const seller = await offlineSaleRepository.findSellerIdByUserId(viewer.userId);
            if (!seller)
                throw new AppError("Seller profile not found", 404);
            sellerId = seller.id;
        }
        const params = { sellerId, search: query.search, from: query.from, to: query.to, skip: query.skip, take: query.take };
        const [items, total] = await Promise.all([offlineSaleRepository.findMany(params), offlineSaleRepository.count(params)]);
        return { items, total };
    },
    async getById(id) {
        const sale = await offlineSaleRepository.findById(id);
        if (!sale)
            throw new AppError(OFFLINE_SALE_MESSAGES.NOT_FOUND, 404);
        return sale;
    },
    async create(sellerUserId, input) {
        const seller = await offlineSaleRepository.findSellerIdByUserId(sellerUserId);
        if (!seller)
            throw new AppError("Seller profile not found", 404);
        const item = await offlineSaleRepository.findProductItem(input.productItemId);
        if (!item)
            throw new AppError(OFFLINE_SALE_MESSAGES.ITEM_UNAVAILABLE, 400);
        if (item.status !== "AVAILABLE")
            throw new AppError(OFFLINE_SALE_MESSAGES.ITEM_UNAVAILABLE, 400);
        const discount = input.discount ?? 0;
        const tax = input.tax ?? 0;
        const total = roundMoney(input.salePrice - discount + tax);
        let invoiceNumber = generateInvoiceNumber();
        for (let attempt = 0; attempt < 3; attempt += 1) {
            if (await offlineSaleRepository.findByInvoiceNumber(invoiceNumber)) {
                invoiceNumber = generateInvoiceNumber();
                continue;
            }
            break;
        }
        const data = {
            productItemId: input.productItemId,
            sellerId: seller.id,
            customerName: input.customerName,
            customerPhone: input.customerPhone,
            salePrice: input.salePrice,
            discount,
            tax,
            total,
            invoiceNumber,
            paymentStatus: "PAID",
            saleDate: input.saleDate ?? new Date(),
        };
        if (input.customerId !== undefined)
            data.customerId = input.customerId;
        if (input.customerEmail !== undefined)
            data.customerEmail = input.customerEmail;
        if (input.notes !== undefined)
            data.notes = input.notes;
        if (input.paymentMethod !== undefined)
            data.paymentMethod = input.paymentMethod;
        const sale = await offlineSaleRepository.create(data);
        await offlineSaleRepository.setProductItemStatus(input.productItemId, "SOLD");
        return sale;
    },
    async update(id, input) {
        await this.getById(id);
        const sale = await offlineSaleRepository.update(id, input);
        if (typeof input.total === "number" || typeof input.discount === "number" || typeof input.tax === "number") {
            const discount = typeof input.discount === "number" ? input.discount : Number(sale.discount ?? 0);
            const tax = typeof input.tax === "number" ? input.tax : Number(sale.tax ?? 0);
            const price = Number(sale.salePrice);
            await offlineSaleRepository.update(id, { total: roundMoney(price - discount + tax) });
        }
        return this.getById(id);
    },
    async remove(id) {
        const sale = await this.getById(id);
        await offlineSaleRepository.remove(id);
        await offlineSaleRepository.setProductItemStatus(sale.productItemId, "AVAILABLE");
    },
};
//# sourceMappingURL=offline-sale.service.js.map