"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    name: zod_1.z.string({
      required_error: "Name is required",
    }),
    email: zod_1.z.string({
      required_error: "Email is required",
    }),
    password: zod_1.z.string({
      required_error: "Password is required",
    }),
    role: zod_1.z.enum([...Object.values(client_1.UserRole)], {
      required_error: "Role is required",
    }),
    contactNo: zod_1.z.string({
      required_error: "Contact No is required",
    }),
    address: zod_1.z.string({
      required_error: "Address is required",
    }),
    profileImg: zod_1.z.string({
      required_error: "Profile Img is required",
    }),
  }),
});
exports.updateUserZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    role: zod_1.z.enum([...Object.values(client_1.UserRole)]).optional(),
    contactNo: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    profileImg: zod_1.z.string().optional(),
  }),
});
