import { z } from "zod";

export const createCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});
