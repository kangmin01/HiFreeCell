import express from "express";
import {
  successGame,
  failGame,
  randomPlayGame,
  deleteGame,
} from "../controllers/gameController";

const apiRouter = express.Router();

apiRouter.post("/game/:id/success", successGame);
apiRouter.post("/game/:id/fail", failGame);
apiRouter.get("/game/play", randomPlayGame);
apiRouter.delete("/game/delete", deleteGame);

export default apiRouter;
