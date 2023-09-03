import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  createBook,
  deleteSingleBook,
  getAllBook,
  getAllBookByCategory,
  getSingleBook,
  updateSingleBook,
} from "./book.controller";
import { createBookZodSchema, updateBookZodSchema } from "./book.validation";

const router = express.Router();

router.post(
  "/create-book",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(createBookZodSchema),
  createBook
);

router.get("/", getAllBook);

router.get("/:categoryId/category", getAllBookByCategory);

router.get("/:id", getSingleBook);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(updateBookZodSchema),
  updateSingleBook
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), deleteSingleBook);

export const BookRoutes = router;
