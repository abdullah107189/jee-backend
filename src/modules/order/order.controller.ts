import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderService } from "./order.service";
import { ORDER, ORDER_MESSAGES, ORDER_STATUSES } from "./order.constant";
import {
  validateCreateOrderInput,
  validateOrderStatusInput,
} from "./order.validation";
import type { AuthRequest } from "../../middleware/auth.middleware";
import type { OrderStatus } from "../../../prisma/generated/prisma/client";

/* ─────────── Helpers ─────────── */

function parseString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseStatus(value: unknown): OrderStatus | undefined {
  if (typeof value !== "string") return undefined;
  return (ORDER_STATUSES as readonly string[]).includes(value)
    ? (value as OrderStatus)
    : undefined;
}

function parsePagination(query: Request["query"]) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(
    ORDER.MAX_PAGE_SIZE,
    Math.max(1, Number(query.limit) || ORDER.DEFAULT_PAGE_SIZE),
  );
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

/* ─────────── Handlers ─────────── */

const getAll = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, take } = parsePagination(req.query);

  const result = await orderService.getAll({
    customerId: parseString(req.query.customerId),
    status: parseStatus(req.query.status),
    search: parseString(req.query.search),
    page,
    limit,
    skip,
    take,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: ORDER_MESSAGES.FETCHED,
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page, limit, skip, take } = parsePagination(req.query);

  const result = await orderService.getMyOrders(req.user!.id, {
    status: parseStatus(req.query.status),
    search: parseString(req.query.search),
    page,
    limit,
    skip,
    take,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: ORDER_MESSAGES.FETCHED,
    data: result,
  });
});

const getById = catchAsync(async (req: AuthRequest, res: Response) => {
  const order = await orderService.getById(req.params.id as string, {
    role: req.user!.role,
    userId: req.user!.id,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: ORDER_MESSAGES.FETCHED_ONE,
    data: order,
  });
});

const create = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = validateCreateOrderInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const order = await orderService.create(req.user!.id, result.value);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: ORDER_MESSAGES.CREATED,
    data: order,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const result = validateOrderStatusInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const order = await orderService.updateStatus(
    req.params.id as string,
    result.value.status,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: ORDER_MESSAGES.UPDATED,
    data: order,
  });
});

const cancel = catchAsync(async (req: AuthRequest, res: Response) => {
  const order = await orderService.cancel(req.params.id as string, {
    role: req.user!.role,
    userId: req.user!.id,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: ORDER_MESSAGES.CANCELLED,
    data: order,
  });
});

export const orderController = {
  getAll,
  getMyOrders,
  getById,
  create,
  updateStatus,
  cancel,
};
