import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createCategory,
  getAllCategory,
  getSingleCategory,
} from "./category.controller";
import { createCategoryZodSchema } from "./category.validation";

const router = express.Router();

router.post(
  "/create-category",
  validateRequest(createCategoryZodSchema),
  createCategory
);

router.get("/", getAllCategory);

router.get("/:id", getSingleCategory);

export const CategoryRoutes = router;
