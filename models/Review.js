const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: "You must supply an author!"
  },
  museum: {
    type: Schema.ObjectId,
    ref: "Museum",
    required: "You must supply a museum!"
  },
  text: {
    type: String,
    required: "Your review must have text!"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
