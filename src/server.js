import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import { localsMiddleware } from "./middlewares";

import rootRouter from "./routers/rootRouter";
import gameRouter from "./routers/gameRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("images"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/games", gameRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
