const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Studygroup = require('./models/studygroup')

// mongoose.set("strickQuery", true);
mongoose.connect("mongodb://localhost:27017/ssf");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makestudygroup", async (req, res) => {
    const group = new Studygroup({title: "second studygroup", subject: "IT", location: "서울", description: "테스트용 스터디그룹입니다"})
    await group.save();
    res.send(group);
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
