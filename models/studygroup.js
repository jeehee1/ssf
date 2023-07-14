const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudygroupSchema = new Schema({
  title: String,
  subject: String,
  location: String,
  address: String,
  date: Date,
  image: String,
  description: String,
  capacity: Number,
  participants: [String],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Studygroup", StudygroupSchema);
