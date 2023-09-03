import { Book } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { bookFilterableFields } from "./book.constant";
import {
  createBookToDB,
  deleteSingleBookFromDB,
  getAllBookByCategoryFromDB,
  getAllBookFromDB,
  getSingleBookFromDB,
  updateSingleBookToDB,
} from "./book.service";

export const createBook = catchAsync(async (req: Request, res: Response) => {
  const { ...book } = req.body;

  const result = await createBookToDB(book);

  sendResponse<Book>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Book created successfully",
    data: result,
  });
});

export const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const pagination = pick(req.query, paginationFields);

  const result = await getAllBookFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getAllBookByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, bookFilterableFields);
    const pagination = pick(req.query, paginationFields);
    const result = await getAllBookByCategoryFromDB(
      filters,
      pagination,
      req.params.categoryId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Books with associated category data fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const result = await getSingleBookFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single book fetched successfully",
    data: result,
  });
});

export const updateSingleBook = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateSingleBookToDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book updated successfully",
      data: result,
    });
  }
);

export const deleteSingleBook = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSingleBookFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Book deleted successfully",
      data: result,
    });
  }
);
