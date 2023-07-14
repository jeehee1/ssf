const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

// mongoose.set("strickQuery", true);
mongoose.connect("mongodb://localhost:27017/ssf");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

const studygroups = require("./routes/studygroups");
const comments = require("./routes/comments");

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//express가 url의 body를 parser 하도록 설정
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")))

app.use("/studygroups", studygroups);
app.use("/studygroups/:id/comments", comments);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
