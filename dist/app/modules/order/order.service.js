"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleOrderFromDB = exports.getAllOrderFromDB = exports.createOrderToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = require("../../../shared/prisma");
const createOrderToDB = (user, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderedBooks } = orderData;
    console.log(user);
    console.log(orderData);
    const newOrder = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.order.create({
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to create order");
        }
        yield transactionClient.orderedBook.createMany({
            data: orderedBooks.map(ob => ({
                orderId: result.id,
                bookId: ob.bookId,
                quantity: ob.quantity,
            })),
        });
        return result;
    }));
    if (newOrder) {
        const responseData = yield prisma_1.prisma.order.findUnique({
            where: {
                id: newOrder.id,
            },
            include: {
                orderedBooks: true,
            },
        });
        return responseData;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create order!");
    }
});
exports.createOrderToDB = createOrderToDB;
const getAllOrderFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
        const result = yield prisma_1.prisma.order.findMany({
            include: {
                orderedBooks: true,
            },
        });
        return result;
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === "customer") {
        const result = yield prisma_1.prisma.order.findMany({
            where: {
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
            include: {
                orderedBooks: true,
            },
        });
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no order for you");
    }
});
exports.getAllOrderFromDB = getAllOrderFromDB;
const getSingleOrderFromDB = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
        const result = yield prisma_1.prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                orderedBooks: true,
            },
        });
        return result;
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === "customer") {
        const result = yield prisma_1.prisma.order.findUnique({
            where: {
                id,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
            include: {
                orderedBooks: true,
            },
        });
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no order for you");
    }
});
exports.getSingleOrderFromDB = getSingleOrderFromDB;
