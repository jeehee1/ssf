const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Studygroup = require("./models/studygroup");

// mongoose.set("strickQuery", true);
mongoose.connect("mongodb://localhost:27017/ssf");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/studygroups", async (req, res) => {
  const studygroups = await Studygroup.find({});
  res.render("studygroups/index", { studygroups });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
