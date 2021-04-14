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
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

// var store = new MongoDBStore({
//   uri: process.env.MONGODB,
//   collection: "mySessions",
// });

const app = express();

const port = process.env.PORT || 3000;
app.set("port", port);

app.use(
  cors({
    origin: [
      "https://thelunarproject.asuscomm.com",
      "https://thelunarproject.asuscomm.com/chatex_client",
      "https://thelunarproject.asuscomm.com/chatex_client/home",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "keyboard cat",
    cookie: {
      secure: true,
      email: "",
      aauthorization: "",
      userId: "",
      sessionId: "",
    },
    store: new MongoStore({ url: process.env.MONGODB }),
    saveUninitialized: false,
    resave: false,
  })
);
app.use(cookieParser("keyboard cat"));

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

const server = http.createServer(app);
global.io = require("socket.io")(server, {
  cors: { origin: "*" },
});

global.io.on("connection", WebSockets.connection);

server.listen(port);
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
