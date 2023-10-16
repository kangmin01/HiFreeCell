import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  deck: { type: Object },
  successfulUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  failedUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  winRate: { type: Number, default: -1 },
  playTime: [{ type: Number }],
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
