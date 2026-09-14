import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { validateCreateCategoryInput } from "./category.validation";
import sendResponse from "../../utils/sendResponse";
import { categoryService } from "./category.service";
import { CATEGORY_MESSAGES } from "./category.constant";

const create = catchAsync(async (req: Request, res: Response) => {
  console.log("het");
  const result = validateCreateCategoryInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }

  const category = await categoryService.create(result.value);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: CATEGORY_MESSAGES.CREATED,
    data: category,
  });
});

export const categoryController = {
  create,
};
