// import { Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import { filterService } from "./filter.service";
// import { FILTER_MESSAGES } from "./filter.constant";
// /* ─────────── Filter Groups ─────────── */

// const getAll = catchAsync(async (_req: Request, res: Response) => {
//   const groups = await filterService.getAllFilterGroups();
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: FILTER_MESSAGES.FETCHED,
//     data: groups,
//   });
// });

// export const filterController = {};
