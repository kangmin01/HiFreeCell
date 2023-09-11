import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: Number, required: true },
  deck: [],
  ResolvedUser: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  ],
  unresolvedUser: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  ],
  winRate: { type: Number, required: true, default: null },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
