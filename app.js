const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const Studygroup = require("./models/studygroup");

// mongoose.set("strickQuery", true);
mongoose.connect("mongodb://localhost:27017/ssf");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//express가 url의 body를 parser 하도록 설정
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/studygroups", async (req, res) => {
  const studygroups = await Studygroup.find({});
  res.render("studygroups/index", { studygroups });
});

app.post("/studygroups", async (req, res) => {
  const studygroup = new Studygroup({ ...req.body.studygroup });
  await studygroup.save();
  res.redirect(`/studygroups/${studygroup._id}`);
});

app.get("/studygroups/new", (req, res) => {
  res.render("studygroups/new");
});

app.get("/studygroups/:id/edit", async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id);
  res.render("studygroups/edit", { studygroup });
});

app.get("/studygroups/:id", async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id);
  res.render("studygroups/show", { studygroup });
});

app.put("/studygroups/:id", async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findByIdAndUpdate(id, {
    ...req.body.studygroup,
  });
  res.redirect(`/studygroups/${id}`);
});

app.delete("/studygroups/:id", async (req, res) => {
  const { id } = req.params;
  await Studygroup.findByIdAndDelete(id);
  res.redirect("/studygroups");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
