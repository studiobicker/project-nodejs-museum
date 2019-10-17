const express = require("express");
const router = express.Router();
const User = require("../models/User");

const multer = require("multer");
const upload = multer({ dest: __dirname + "/../public/images/profile" });

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (user) {
      res.render("profile", { isAuthor: true, user: user });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/update", upload.single("profile"), async (req, res) => {
  debugger;

  updatedUser = await User.findByIdAndUpdate(
    req.session.user._id,
    { $set: { profileImg: req.file.filename } },
    { new: true }
  );
  req.session.user = updatedUser;
  res.redirect("/profile");
});

module.exports = router;
