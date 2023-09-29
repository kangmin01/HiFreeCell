import express from "express";
import { userOnlyMiddleware } from "../middlewares";
import {
  logout,
  userInfo,
  googleOauth,
  googleOauthCallback,
  kakaoOauth,
  kakaoOauthCallback,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", userOnlyMiddleware, logout);
userRouter.get("/oauth/google", googleOauth);
userRouter.get("/oauth/google/callback", googleOauthCallback);
userRouter.get("/oauth/kakao", kakaoOauth);
userRouter.get("/oauth/kakao/callback", kakaoOauthCallback);
userRouter.get("/:id", userInfo);

export default userRouter;
