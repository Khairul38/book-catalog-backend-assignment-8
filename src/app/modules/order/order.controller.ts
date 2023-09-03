import { Order } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  createOrderToDB,
  getAllOrderFromDB,
  getSingleOrderFromDB,
} from "./order.service";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await createOrderToDB(user, req.body);

  sendResponse<Order>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order created successfully",
    data: result,
  });
});

export const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await getAllOrderFromDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: result,
  });
});

export const getSingleOrder = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await getSingleOrderFromDB(user, req.params.orderId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single order fetched successfully",
      data: result,
    });
  }
);
