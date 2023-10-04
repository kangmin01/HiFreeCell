import express from "express";
import { userOnlyMiddleware, avatarUpload } from "../middlewares";
import {
  logout,
  getEdit,
  postEdit,
  userInfo,
  googleOauth,
  googleOauthCallback,
  kakaoOauth,
  kakaoOauthCallback,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", userOnlyMiddleware, logout);
userRouter
  .route("/edit")
  .get(userOnlyMiddleware, getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/oauth/google", googleOauth);
userRouter.get("/oauth/google/callback", googleOauthCallback);
userRouter.get("/oauth/kakao", kakaoOauth);
userRouter.get("/oauth/kakao/callback", kakaoOauthCallback);
userRouter.get("/:id", userInfo);

export default userRouter;
