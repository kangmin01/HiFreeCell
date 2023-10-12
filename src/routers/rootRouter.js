import express from "express";
import { publicOnlyMiddleware, avatarUpload } from "../middlewares";
import {
  home,
  getCreateGame,
  postCreateGame,
} from "../controllers/gameController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/join")
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(avatarUpload.single("avatar"), postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.route("/admin").get(getCreateGame).post(postCreateGame);

export default rootRouter;
