const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String },
  profileImg: { type: String },
  timestamp: { type: Date, default: Date.now },
  reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
  mylist: [{ type: mongoose.Schema.ObjectId, ref: "Museum" }],
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
