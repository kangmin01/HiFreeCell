import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: Number, required: true },
  deck: [],
  successfulUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  failedUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  winRate: { type: Number },
  playTime: [{ type: Number }],
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
