import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { PAYMENT_MESSAGES } from "./payment.constant";
import { paymentRepository } from "./payment.repository";
export const paymentService = {
    async list(query, viewer) {
        let customerId;
        let sellerId;
        if (viewer?.role === "CUSTOMER") {
            customerId = (await paymentRepository.findCustomerIdByUserId(viewer.userId))?.id;
        }
        else if (viewer?.role === "SELLER") {
            sellerId = (await paymentRepository.findSellerIdByUserId(viewer.userId))?.id;
        }
        const params = {
            onlineOrderId: query.onlineOrderId,
            offlineSaleId: query.offlineSaleId,
            status: query.status,
            customerId,
            sellerId,
            skip: query.skip,
            take: query.take,
        };
        const [items, total] = await Promise.all([paymentRepository.findMany(params), paymentRepository.count(params)]);
        return { items, total };
    },
    async getById(id) {
        const payment = await paymentRepository.findById(id);
        if (!payment)
            throw new AppError(PAYMENT_MESSAGES.NOT_FOUND, 404);
        return payment;
    },
    async create(userId, role, input) {
        if (!input.onlineOrderId && !input.offlineSaleId) {
            throw new AppError(PAYMENT_MESSAGES.REFERENCE_REQUIRED, 400);
        }
        let sellerId;
        if (input.onlineOrderId) {
            if (role !== "CUSTOMER")
                throw new AppError("Only customers can pay for online orders", 403);
            const order = await paymentRepository.findOnlineOrder(input.onlineOrderId);
            if (!order)
                throw new AppError(PAYMENT_MESSAGES.ORDER_NOT_FOUND, 404);
            const customer = await paymentRepository.findCustomerIdByUserId(userId);
            if (!customer || order.customerId !== customer.id) {
                throw new AppError("You can only pay for your own orders", 403);
            }
        }
        if (input.offlineSaleId) {
            if (role === "CUSTOMER")
                throw new AppError("Offline sales are paid by the seller", 403);
            const sale = await paymentRepository.findOfflineSale(input.offlineSaleId);
            if (!sale)
                throw new AppError(PAYMENT_MESSAGES.OFFLINE_SALE_NOT_FOUND, 404);
            sellerId = sale.sellerId;
        }
        const data = {
            amount: input.amount,
            method: input.method,
            status: input.status ?? "PENDING",
            verificationStatus: "PENDING",
        };
        if (input.onlineOrderId !== undefined)
            data.onlineOrderId = input.onlineOrderId;
        if (input.offlineSaleId !== undefined)
            data.offlineSaleId = input.offlineSaleId;
        if (input.transactionId !== undefined)
            data.transactionId = input.transactionId;
        if (input.gateway !== undefined)
            data.gateway = input.gateway;
        if (input.gatewayResponse !== undefined)
            data.gatewayResponse = input.gatewayResponse;
        return paymentRepository.create(data);
    },
    async verify(id, adminUserId, input) {
        await this.getById(id);
        const admin = await prisma.admin.findUnique({ where: { userId: adminUserId }, select: { id: true } });
        if (!admin)
            throw new AppError("Admin profile not found", 404);
        const data = {
            verificationStatus: input.verificationStatus,
            verifiedBy: { connect: { id: admin.id } },
            verifiedAt: new Date(),
            status: input.status ?? (input.verificationStatus === "VERIFIED" ? "PAID" : "FAILED"),
            processedAt: new Date(),
        };
        return paymentRepository.update(id, data);
    },
    async update(id, input) {
        await this.getById(id);
        return paymentRepository.update(id, input);
    },
};
//# sourceMappingURL=payment.service.js.map