import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import "./config/mongo.js";
import WebSockets from "./utils/WebSockets.js";
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";

import { decode } from "./middlewares/jwt.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

// var store = new MongoDBStore({
//   uri: process.env.MONGODB,
//   collection: "mySessions",
// });

const app = express();

const port = process.env.PORT || 3000;
app.set("port", port);

app.use(cors());
app.use(
  session({
    secret: "keyboard cat",
    cookie: {
      secure: true,
    },
    store: new MongoStore({ url: process.env.MONGODB }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const server = http.createServer(app);
global.io = require("socket.io")(server, {
  cors: { origin: "*" },
});

global.io.on("connection", WebSockets.connection);

server.listen(port);
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
