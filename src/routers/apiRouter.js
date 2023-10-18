import express from "express";
import { successGame } from "../controllers/gameController";

const apiRouter = express.Router();

apiRouter.post("/game/:id/success", successGame);

export default apiRouter;
