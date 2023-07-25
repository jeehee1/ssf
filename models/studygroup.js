const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const StudygroupSchema = new Schema({
  title: String,
  subject: String,
  location: String,
  address: String,
  date: Date,
  images: [ImageSchema],
  description: String,
  capacity: Number,
  participants: [String],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Studygroup", StudygroupSchema);
