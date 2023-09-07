import express from "express";
import { userOnlyMiddleware } from "../middlewares";
import { logout, userInfo } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", userOnlyMiddleware, logout);
userRouter.get("/:id", userInfo);

export default userRouter;
