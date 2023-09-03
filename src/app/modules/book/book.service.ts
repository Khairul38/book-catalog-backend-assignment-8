/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { bookSearchableFields } from "./book.constant";
import { IBookFilters } from "./book.interface";

export const createBookToDB = async (bookData: Book): Promise<Book> => {
  const result = await prisma.book.create({
    data: bookData,
    include: {
      category: true,
    },
  });

  return result;
};

export const getAllBookFromDB = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => {
        if (key === "minPrice") {
          return {
            price: {
              gte: Number((filtersData as any)[key]),
            },
          };
        } else if (key === "maxPrice") {
          return {
            price: {
              lte: Number((filtersData as any)[key]),
            },
          };
        } else if (key === "category") {
          return {
            categoryId: {
              equals: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereCondition: Prisma.BookWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.book.findMany({
    where: whereCondition,
    skip,
    take: size,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.book.count();
  const totalPage = Number(total) / Number(size);

  return {
    meta: {
      total,
      page,
      size,
      totalPage: Math.ceil(totalPage),
    },
    data: result,
  };
};

export const getAllBookByCategoryFromDB = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions,
  id: string
): Promise<IGenericResponse<Book[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => {
        if (key === "minPrice") {
          return {
            price: {
              gte: Number((filtersData as any)[key]),
            },
          };
        } else if (key === "maxPrice") {
          return {
            price: {
              lte: Number((filtersData as any)[key]),
            },
          };
        } else if (id || key === "category") {
          return {
            categoryId: {
              equals: id || (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereCondition: Prisma.BookWhereInput =
    andCondition.length > 0
      ? { AND: andCondition }
      : {
          categoryId: id,
        };

  const result = await prisma.book.findMany({
    where: whereCondition,
    skip,
    take: size,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.book.count();
  const totalPage = Number(total) / Number(size);

  return {
    meta: {
      total,
      page,
      size,
      totalPage: Math.ceil(totalPage),
    },
    data: result,
  };
};

export const getSingleBookFromDB = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no book with the id/Failed to fetched book"
    );
  }
};

export const updateSingleBookToDB = async (
  id: string,
  payload: Partial<Book>
): Promise<Partial<Book> | null> => {
  if (payload.categoryId) {
    const isExist = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });
    if (!isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "There is no category with this category Id. Please provide a valid category Id."
      );
    }
  }

  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no book with the id/Failed to update book"
    );
  }
};

export const deleteSingleBookFromDB = async (
  id: string
): Promise<Partial<Book> | undefined> => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no book with the id/Failed to delete book"
    );
  }
};
