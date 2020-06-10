const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("config");
const http = require("http");

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const usersRouter = require("./routes/api/users");
const authRouter = require("./routes/api/auth");
const contestRouter = require("./routes/api/contest");
const contestsRouter = require("./routes/api/contests");
const chatRoomRouter = require("./routes/api/chatroom");
const stripeRouter = require("./routes/api/stripe");
const visionRouter = require('./routes/api/vision')
const db = config.get("mongoURI");

const { json, urlencoded } = express;

var app = express();

//connect to db
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/api/contest", contestRouter);
app.use("/api/contests", contestsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/chatroom", chatRoomRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/vision", visionRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
