import { Request, Response } from 'express'; 
import { catchAsync } from '../../utils/catchAsync';
import { validateCreateBrandInput } from './brand.validation';
import sendResponse from '../../utils/sendResponse';
import { brandService } from './brand.service';
import { BRAND_MESSAGES } from './brand.constant';

const create = catchAsync(async (req: Request, res: Response) => {
  const result = validateCreateBrandInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Validation failed',
      data: result.errors,
    });
  }

  const brand = await brandService.create(result.value);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: BRAND_MESSAGES.CREATED,
    data: brand,
  });
});

export const brandController = {
  create,
};