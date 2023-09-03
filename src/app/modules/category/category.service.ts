/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, Prisma } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { ICategoryFilters } from "./category.interface";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { categorySearchableFields } from "./category.constant";

export const createCategoryToDB = async (
  categoryData: Category
): Promise<Category> => {
  const result = await prisma.category.create({
    data: categoryData,
  });

  return result;
};

export const getAllCategoryFromDB = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Category[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: categorySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.CategoryWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.category.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.category.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const getSingleCategoryFromDB = async (
  id: string
): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  return result;
};
