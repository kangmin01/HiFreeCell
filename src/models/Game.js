import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: Number, required: true },
  Resolved: {},
  unresolvedUser: {},
  winRate: { type: Number, required: true },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
