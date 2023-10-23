import express from "express";
import {
  successGame,
  failGame,
  randomPlayGame,
} from "../controllers/gameController";

const apiRouter = express.Router();

apiRouter.post("/game/:id/success", successGame);
apiRouter.post("/game/:id/fail", failGame);
apiRouter.get("/game/play", randomPlayGame);

export default apiRouter;
