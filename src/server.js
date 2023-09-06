import express from "express";
import morgan from "morgan";

import rootRouter from "./routers/rootRouter";
import gameRouter from "./routers/gameRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

app.use(logger);

app.use("/", rootRouter);
app.use("/games", gameRouter);
app.use("/users", userRouter);

export default app;
