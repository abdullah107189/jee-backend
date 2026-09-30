import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { filterService } from "./filter.service";
import { FILTER_MESSAGES } from "./filter.constant";
import {
  validateCreateFilterGroupInput,
  validateUpdateFilterGroupInput,
} from "./filter.validation";

/* ─────────── Filter Groups ─────────── */

const getAll = catchAsync(async (_req: Request, res: Response) => {
  const groups = await filterService.getAllFilterGroups();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: FILTER_MESSAGES.FETCHED,
    data: groups,
  });
});

const getByCategory = catchAsync(async (req: Request, res: Response) => {
  const group = await filterService.getFilterGroupByCategory(req.params.categoryId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: FILTER_MESSAGES.FETCHED,
    data: group,
  });
});

const create = catchAsync(async (req: Request, res: Response) => {
  const result = validateCreateFilterGroupInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const group = await filterService.createFilterGroup(result.value);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: FILTER_MESSAGES.CREATED,
    data: group,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = validateUpdateFilterGroupInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const group = await filterService.updateFilterGroup(req.params.id as string, result.value);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: FILTER_MESSAGES.UPDATED,
    data: group,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const response = await filterService.deleteFilterGroup(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: response.message,
    data: null,
  });
});

/* ─────────── Category Filters (Public) ─────────── */

const getCategoryFilters = catchAsync(async (req: Request, res: Response) => {
  const filters = await filterService.getCategoryFilters(req.params.fullSlug as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: FILTER_MESSAGES.FETCHED,
    data: filters,
  });
});

export const filterController = {
  getAll,
  getByCategory,
  create,
  update,
  remove,
  getCategoryFilters,
};