import express from "express";
import { gameInfo, play } from "../controllers/gameController";

const gameRouter = express.Router();

gameRouter.get("/:id", gameInfo);
gameRouter.get("/:id/play", play);

export default gameRouter;
