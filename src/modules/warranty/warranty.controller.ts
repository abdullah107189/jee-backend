import type { Request, Response } from "express";
import type { UserRole } from "../../../prisma/generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { parsePagination, queryString } from "../../utils/api";
import { WARRANTY, WARRANTY_MESSAGES } from "./warranty.constant";
import { warrantyService } from "./warranty.service";
import type { WarrantyQuery } from "./warranty.type";
import { validateUpdateWarrantyInput } from "./warranty.validation";

const list = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip, take } = parsePagination(
    req.query as Record<string, unknown>,
    WARRANTY.DEFAULT_PAGE_SIZE,
  );
  const customerId = queryString(req.query.customerId);
  const sellerId = queryString(req.query.sellerId);
  const status = queryString(req.query.status) as WarrantyQuery["status"];
  const search = queryString(req.query.search);

  const viewer = req.user
    ? { role: req.user.role as UserRole, userId: req.user.id }
    : undefined;
  const { items, total } = await warrantyService.list(
    { customerId, sellerId, status, search, page, limit, skip, take },
    viewer,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Warranties retrieved successfully",
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: items,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const viewer = req.user
    ? { role: req.user.role as UserRole, userId: req.user.id }
    : undefined;
  const warranty = await warrantyService.getById(String(req.params.id), viewer);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Warranty retrieved successfully",
    data: warranty,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = validateUpdateWarrantyInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const warranty = await warrantyService.update(
    String(req.params.id),
    result.value,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: WARRANTY_MESSAGES.UPDATED,
    data: warranty,
  });
});

const checkBySerialNumber = catchAsync(async (req: Request, res: Response) => {
  const serialNumber = String(req.params.serialNumber);
  const result = await warrantyService.checkBySerialNumber(serialNumber);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Warranty details retrieved successfully",
    data: result,
  });
});

export const warrantyController = {
  list,
  getById,
  update,
  checkBySerialNumber,
};
