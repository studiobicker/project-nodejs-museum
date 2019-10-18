const express = require("express");
const router = express.Router();

const User = require("../models/User");

require("dotenv").config();

router.get("/", async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id).populate("mylist");
    if (user) {
      res.render("mylist", { user: user, mapKey: process.env.MAP_KEY });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/feed", async (req, res, next) => {
  try {
    debugger;
    const user = await User.findById(req.session.user._id).populate("mylist");
    const data = user.mylist;
    if (data) {
      return res.json(data);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/add/:id", async (req, res, next) => {
  debugger;
  const museumId = req.params.id;
  const id = req.session.user._id;

  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { $addToSet: { mylist: museumId } },
      { new: true }
    );
    if (updated) {
      debugger;
      req.session.user = updated;
    }
    res.redirect("/museums/" + museumId);
  } catch (err) {
    next(err);
  }
});

router.get("/remove/:id", async (req, res, next) => {
  debugger;
  const referer = req.headers.referrer || req.headers.referer;
  const museumId = req.params.id;
  const id = req.session.user._id;

  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { $pull: { mylist: museumId } },
      { new: true }
    );
    if (updated) {
      req.session.user = updated;
    }
    res.redirect(referer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
