import express from "express";
import { userOnlyMiddleware } from "../middlewares";
import { games, playGame } from "../controllers/gameController";

const gameRouter = express.Router();

gameRouter.route("/").all(userOnlyMiddleware).get(games);
gameRouter.route("/:id").all(userOnlyMiddleware).get(playGame);

export default gameRouter;
