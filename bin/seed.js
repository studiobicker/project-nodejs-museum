const json = require("./MuseaGalleries.json"); // Import of the data from './MuseaGalleries.json'

const museumArray = json.filter(museum => museum.types[0].catid ==="2.1.6" && museum.location.city === "AMSTERDAM").map(museum => {
  return {
    title: museum.details.en.title,
    calendarsummary: museum.details.en.calendarsummary,
    description: museum.details.en.shortdescription,
    longdescription: museum.details.en.longdescription,
    location: {
      address: museum.location.adress,
      zipcode: museum.location.zipcode,
      city: museum.location.city,
      latitude: museum.location.latitude,
      longitude: museum.location.longitude,
    },
    url: museum.urls[0],
    image: museum.media[0]
  }
});
console.log(museumArray);

const mongoose = require("mongoose");
const Museum = require(__dirname + "/../models/Museum.js"); // Import of the model Museum from './models/Museum'

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongo!");
     return Museum.deleteMany({});
  })
  .then(success => {
    return Museum.insertMany(museumArray);
  })
  .then(success => {
    console.log("successfully inserted data");
  })
  .catch(err => {
    console.error("Error", err);
  });
