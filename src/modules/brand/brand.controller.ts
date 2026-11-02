import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  validateCreateBrandInput,
  validateUpdateBrandInput,
} from "./brand.validation";
import sendResponse from "../../utils/sendResponse";
import { brandService } from "./brand.service";
import { BRAND_MESSAGES } from "./brand.constant";
import { logAudit } from "../../utils/auditLogger";

const getAll = catchAsync(async (req: Request, res: Response) => {
  const brands = await brandService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: BRAND_MESSAGES.FETCHED,
    data: brands,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const brand = await brandService.getById(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brand fetched successfully",
    data: brand,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const result = validateCreateBrandInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const brand = await brandService.create(result.value);

  if (req.user?.id) {
    logAudit({
      userId: req.user.id,
      action: "BRAND_CREATED",
      entity: "Brand",
      entityId: brand.id,
      changes: result.value,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: BRAND_MESSAGES.CREATED,
    data: brand,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = validateUpdateBrandInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const brand = await brandService.update(
    req.params.id as string,
    result.value,
  );

  if (req.user?.id) {
    logAudit({
      userId: req.user.id,
      action: "BRAND_UPDATED",
      entity: "Brand",
      entityId: brand.id,
      changes: result.value,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: BRAND_MESSAGES.UPDATED,
    data: brand,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  await brandService.remove(req.params.id as string);

  if (req.user?.id) {
    logAudit({
      userId: req.user.id,
      action: "BRAND_DELETED",
      entity: "Brand",
      entityId: req.params.id as string,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: BRAND_MESSAGES.DELETED,
    data: null,
  });
});

export const brandController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
