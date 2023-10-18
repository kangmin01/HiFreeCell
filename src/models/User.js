import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  socialOnly: { type: Boolean, default: false },
  password: { type: String },
  role: { type: String, required: true, default: "user" },
  wonGame: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  lostGame: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  shortestTime: { type: Number },
  playTime: [{ type: Number }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 3);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
