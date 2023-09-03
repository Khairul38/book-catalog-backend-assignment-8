import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import { getAllUserFromDB, getSingleUserFromDB } from "./user.service";

export const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const pagination = pick(req.query, paginationFields);

  const result = await getAllUserFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All user fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await getSingleUserFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single user fetched successfully",
    data: result,
  });
});
