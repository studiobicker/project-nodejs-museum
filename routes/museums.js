const express = require("express");
const router = express.Router();

const Museum = require("../models/Museum");
const Review = require("../models/Review");
const User = require("../models/User");

require("dotenv").config();

router.get("/", async (req, res, next) => {
  try {
    const museums = await Museum.find()
      .populate("reviews")
      .sort({ title: 1 });
    res.render("museums", { museums: museums });
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const data = await Museum.find({
      title: { $regex: req.query.museum, $options: "i" }
    }).sort({ title: 1 });
    if (data) {
      return res.json(data);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/feed", async (req, res, next) => {
  try {
    const data = await Museum.find();
    if (data) {
      return res.json(data);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/map", async (req, res, next) => {
  try {
    const museums = await Museum.find().sort({ title: 1 });
    res.render("map", { museums: museums, mapKey: process.env.MAP_KEY });
  } catch (err) {
    next(err);
  }
});

/* GET single museum */
router.get("/:id/", async (req, res, next) => {
  const id = req.params.id;
  try {
    const museum = await Museum.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    });

    if (museum) {
      res.render("museum", { museum: museum });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
