import express from "express";
import { getAllUser, getSingleUser } from "./user.controller";

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getSingleUser);

export const UserRoutes = router;
