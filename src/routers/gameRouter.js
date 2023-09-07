import express from "express";
import { games, gameInfo, play } from "../controllers/gameController";

const gameRouter = express.Router();

gameRouter.get("/", games);
gameRouter.get("/:id", gameInfo);
gameRouter.get("/:id/play", play);

export default gameRouter;
