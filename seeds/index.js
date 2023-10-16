const mongoose = require("mongoose");
const Studygroup = require("../models/studygroup");
const { groupTitle } = require("./groupTitle");

mongoose.connect("mongodb://localhost:27017/ssf");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Studygroup.deleteMany();
  for (let i = 0; i < 50; i++) {
    const newGroup = new Studygroup({
      title: groupTitle[i].title,
      subject: groupTitle[i].subject,
      capacity: 30,
      city: "서울",
      participants: [],
      location: "ssf 커피",
      address: "서울 노원구 동일로241가길 5",
      date: new Date("2023-07-30"),
      images: [
        {
          url: "https://res.cloudinary.com/dzgbzobwo/image/upload/v1690250280/ssf/jvmt6qay5vlejmx3frx2.jpg",
          filename: "ssf/jvmt6qay5vlejmx3frx2",
        },
        {
          url: "https://res.cloudinary.com/dzgbzobwo/image/upload/v1690250281/ssf/eli2p1ep9rlmsyq4qciy.jpg",
          filename: "ssf/eli2p1ep9rlmsyq4qciy",
        },
      ],
      description:
        "Velit enim sit aute aliquip culpa exercitation tempor officia velit exercitation incididunt. Qui laboris in labore officia sit aliquip labore eu. Cillum veniam exercitation reprehenderit id culpa dolor. Elit in excepteur ea dolore. Dolor culpa amet aute consequat Lorem. Cupidatat cillum officia minim commodo do aute sit proident sint qui pariatur aliqua nostrud commodo. Elit voluptate nulla minim irure. Cillum eiusmod excepteur officia incididunt commodo nulla irure dolor proident labore magna mollit commodo. Consectetur culpa culpa in et incididunt irure do velit elit nostrud cupidatat.",
      author: "64b6898f3a6ec2b222b6cebc",
    });
    await newGroup.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("CONNECTION CLOSED");
});
