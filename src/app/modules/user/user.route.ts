import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { getAllUser, getSingleUser } from "./user.controller";

const router = express.Router();

router.get("/", auth(ENUM_USER_ROLE.ADMIN), getAllUser);
router.get("/:id", auth(ENUM_USER_ROLE.ADMIN), getSingleUser);

export const UserRoutes = router;
