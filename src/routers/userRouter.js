import express from "express";
import { userInfo } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/:id", userInfo);

export default userRouter;
