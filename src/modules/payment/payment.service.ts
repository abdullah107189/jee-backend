import { prisma } from "../../../lib/prisma";
import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { PAYMENT_MESSAGES } from "./payment.constant";
import { paymentRepository } from "./payment.repository";
import type {
  CreatePaymentInput,
  ListPaymentsResult,
  PaymentQuery,
  PaymentVerifyInput,
  PaymentWithRelations,
} from "./payment.type";

export const paymentService = {
  async list(query: PaymentQuery, viewer?: { role: UserRole; userId: string }): Promise<ListPaymentsResult> {
    let customerId: string | undefined;
    let sellerId: string | undefined;

    if (viewer?.role === "CUSTOMER") {
      customerId = (await paymentRepository.findCustomerIdByUserId(viewer.userId))?.id;
    } else if (viewer?.role === "SELLER") {
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

  async getById(id: string): Promise<PaymentWithRelations> {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new AppError(PAYMENT_MESSAGES.NOT_FOUND, 404);
    return payment;
  },

  async create(userId: string, role: UserRole, input: CreatePaymentInput): Promise<PaymentWithRelations> {
    if (!input.onlineOrderId && !input.offlineSaleId) {
      throw new AppError(PAYMENT_MESSAGES.REFERENCE_REQUIRED, 400);
    }

    let sellerId: string | undefined;

    if (input.onlineOrderId) {
      if (role !== "CUSTOMER") throw new AppError("Only customers can pay for online orders", 403);
      const order = await paymentRepository.findOnlineOrder(input.onlineOrderId);
      if (!order) throw new AppError(PAYMENT_MESSAGES.ORDER_NOT_FOUND, 404);

      const customer = await paymentRepository.findCustomerIdByUserId(userId);
      if (!customer || order.customerId !== customer.id) {
        throw new AppError("You can only pay for your own orders", 403);
      }
    }

    if (input.offlineSaleId) {
      if (role === "CUSTOMER") throw new AppError("Offline sales are paid by the seller", 403);
      const sale = await paymentRepository.findOfflineSale(input.offlineSaleId);
      if (!sale) throw new AppError(PAYMENT_MESSAGES.OFFLINE_SALE_NOT_FOUND, 404);
      sellerId = sale.sellerId;
    }

    const data: Prisma.PaymentUncheckedCreateInput = {
      amount: input.amount,
      method: input.method,
      status: input.status ?? "PENDING",
      verificationStatus: "PENDING",
    };
    if (input.onlineOrderId !== undefined) data.onlineOrderId = input.onlineOrderId;
    if (input.offlineSaleId !== undefined) data.offlineSaleId = input.offlineSaleId;
    if (input.transactionId !== undefined) data.transactionId = input.transactionId;
    if (input.gateway !== undefined) data.gateway = input.gateway;
    if (input.gatewayResponse !== undefined) data.gatewayResponse = input.gatewayResponse as Prisma.InputJsonValue;

    return paymentRepository.create(data);
  },

  async verify(id: string, adminUserId: string, input: PaymentVerifyInput): Promise<PaymentWithRelations> {
    await this.getById(id);

    const admin = await prisma.admin.findUnique({ where: { userId: adminUserId }, select: { id: true } });
    if (!admin) throw new AppError("Admin profile not found", 404);

    const data: Prisma.PaymentUpdateInput = {
      verificationStatus: input.verificationStatus,
      verifiedBy: { connect: { id: admin.id } },
      verifiedAt: new Date(),
      status: input.status ?? (input.verificationStatus === "VERIFIED" ? "PAID" : "FAILED"),
      processedAt: new Date(),
    };

    return paymentRepository.update(id, data);
  },

  async update(id: string, input: Prisma.PaymentUpdateInput): Promise<PaymentWithRelations> {
    await this.getById(id);
    return paymentRepository.update(id, input);
  },
};