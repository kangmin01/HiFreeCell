import express from "express";
import {
  userOnlyMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";
import {
  logout,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
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
  .all(userOnlyMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(userOnlyMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/oauth/google", publicOnlyMiddleware, googleOauth);
userRouter.get(
  "/oauth/google/callback",
  publicOnlyMiddleware,
  googleOauthCallback
);
userRouter.get("/oauth/kakao", publicOnlyMiddleware, kakaoOauth);
userRouter.get(
  "/oauth/kakao/callback",
  publicOnlyMiddleware,
  kakaoOauthCallback
);
userRouter.get("/:id", userInfo);

export default userRouter;
