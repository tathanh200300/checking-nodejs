require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user.apis");
var jdsRouter = require("./routes/jd.apis");
var cvsRouter = require("./routes/cv.apis");
var uploadRouter = require("./routes/upload.apis");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const mongoose = require("mongoose");
const { MONGODB } = require("./utils/env.util");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/employer", jdsRouter);
app.use("/employee", cvsRouter);
app.use("/employee", uploadRouter);
app.use("/employer", uploadRouter);

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
  res.render("error");
});

console.log(MONGODB);
mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
});

module.exports = app;
