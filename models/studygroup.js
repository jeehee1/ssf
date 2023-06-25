const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudygroupSchema = new Schema({
  title: String,
  subject: String,
  location: String,
  address: String,
  date: Date,
  images: [String],
  description: String,
  capacity: Number,
  participants: [String],
});

module.exports =  mongoose.model("Studygroup", StudygroupSchema);
