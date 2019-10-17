const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const museumSchema = new Schema({
  title: { type: String, required: "Please enter a title" },
  calendarsummary: String,
  description: String,
  longdescription: String,
  location: {
    address: String,
    zipcode: String,
    city: String,
    latitude: String,
    longitude: String
  },
  url: String,
  image: {
    url: String,
    main: String
  },
  rated: Number,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  timestamp: { type: Date, default: Date.now }
});

// Define our indexes
museumSchema.index({
  title: "text"
});

const Museum = mongoose.model("Museum", museumSchema);
module.exports = Museum;
