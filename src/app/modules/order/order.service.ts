/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import { prisma } from "../../../shared/prisma";
import { ICreateOrder } from "./order.interface";

export const createOrderToDB = async (
  user: JwtPayload | null,
  orderData: ICreateOrder
): Promise<any> => {
  const { orderedBooks } = orderData;

  const newOrder = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.order.create({
      data: {
        userId: user?.id,
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create order");
    }

    await transactionClient.orderedBook.createMany({
      data: orderedBooks.map(ob => ({
        orderId: result.id,
        bookId: ob.bookId,
        quantity: ob.quantity,
      })),
    });

    return result;
  });

  if (newOrder) {
    const responseData = await prisma.order.findUnique({
      where: {
        id: newOrder.id,
      },
      include: {
        orderedBooks: true,
      },
    });
    return responseData;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order!");
  }
};

export const getAllOrderFromDB = async (
  user: JwtPayload | null
): Promise<Order[] | null> => {
  if (user?.role === "admin") {
    const result = await prisma.order.findMany({
      include: {
        orderedBooks: true,
      },
    });
    return result;
  } else if (user?.role === "customer") {
    const result = await prisma.order.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        orderedBooks: true,
      },
    });
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "There is no order for you");
  }
};

export const getSingleOrderFromDB = async (
  user: JwtPayload | null,
  id: string
): Promise<Order | null> => {
  if (user?.role === "admin") {
    const result = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderedBooks: true,
      },
    });
    return result;
  } else if (user?.role === "customer") {
    const result = await prisma.order.findUnique({
      where: {
        id,
        userId: user?.id,
      },
      include: {
        orderedBooks: true,
      },
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "There is no order for you");
    }
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "There is no order for you");
  }
};
