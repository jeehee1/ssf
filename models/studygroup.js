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
  geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
},
});

module.exports =  mongoose.model("Studygroup", StudygroupSchema);
