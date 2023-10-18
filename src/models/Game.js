import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  deck: { type: Object },
  successfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  failedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  winRate: { type: Number, default: -1 },
  shortestTime: { type: Number },
  topRanking: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

gameSchema.pre("save", function (next) {
  const totalUsers = this.successfulUsers.length + this.failedUsers.length;
  if (totalUsers === 0) {
    this.winRate = -1;
  } else {
    this.winRate = (this.successfulUsers.length / totalUsers) * 100;
  }
  next();
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
