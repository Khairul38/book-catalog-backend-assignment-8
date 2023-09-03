import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createOrder, getAllOrder, getSingleOrder } from "./order.controller";
import { createOrderZodSchema } from "./order.validation";

const router = express.Router();

router.post(
  "/create-order",
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(createOrderZodSchema),
  createOrder
);

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  getAllOrder
);

router.get(
  "/:orderId",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  getSingleOrder
);

export const OrderRoutes = router;
