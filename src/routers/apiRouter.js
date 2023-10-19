import express from "express";
import { successGame, failGame } from "../controllers/gameController";

const apiRouter = express.Router();

apiRouter.post("/game/:id/success", successGame);
apiRouter.post("/game/:id/fail", failGame);

export default apiRouter;
