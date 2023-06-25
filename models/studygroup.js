const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudygroupSchema = new Schema({
  title: String,
  subject: String,
  location: String,
  address: String,
  date: Date,
  description: String,
  capacity: Number,
});

module.exports =  mongoose.model("Studygroup", StudygroupSchema);
