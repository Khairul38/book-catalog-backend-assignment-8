import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { getUserProfile } from "./profile.controller";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  getUserProfile
);

export const ProfileRoutes = router;
