import express from "express";
import morgan from "morgan";

import rootRouter from "./routers/rootRouter";
import gameRouter from "./routers/gameRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

const PORT = 4000;

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

app.use(logger);

app.use("/", rootRouter);
app.use("/games", gameRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT}`);

app.listen(4000, handleListening);
