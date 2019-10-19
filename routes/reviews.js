const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const Museum = require("../models/Museum");
const User = require("../models/User");
const Review = require("../models/Review");

async function isFirstReview(req, res, next) {
  try {
    debugger;
    const museum = await Museum.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    });
    for (let i = 0; i < museum.reviews.length; i++) {
      if (museum.reviews[i].author.id === req.session.user._id) {
        next(createError(403));
        return false;
      }
    }
    next();
  } catch (err) {
    debugger;
    next(err);
  }
}

router.get("/add/:id", isFirstReview, async (req, res, next) => {
  const museumId = req.params.id;

  try {
    const museum = await Museum.findById(museumId);
    if (museum) {
      res.render("review", {
        title: "Write a review",
        action: "add",
        museum: museum
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/add", async (req, res, next) => {
  const { text, rating, museumId } = req.body;

  // the user id (which we need to establish as relation) we get from the session
  const id = req.session.user._id;

  try {
    const review = await Review.create({
      text: text,
      rating: rating,
      museum: museumId,
      author: id
    });
    if (review) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $push: { reviews: review._id } },
        { new: true }
      );
      const updatedMuseum = await Museum.findByIdAndUpdate(
        museumId,
        { $push: { reviews: review._id } },
        { new: true }
      );
      res.redirect("/museums/" + museumId);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/update", async (req, res, next) => {
  const { text, rating, reviewId, museumId } = req.body;
  debugger;
  // the user id (which we need to establish as relation) we get from the session
  const id = req.session.user._id;

  try {
    const review = await Review.findByIdAndUpdate(reviewId, {
      $set: { text: text, rating: rating }
    });
    res.redirect("/museums/" + museumId);
  } catch (err) {
    next(err);
  }
});

async function confirmAuthor(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    debugger;
    if (review.author.equals(req.session.user._id)) next();
    else next(createError(403));
  } catch (err) {
    next(err);
  }
}

router.get("/edit/:id", confirmAuthor, async (req, res, next) => {
  debugger;
  const reviewId = req.params.id;
  const id = req.session.user._id;

  try {
    const review = await Review.findById(reviewId).populate("museum user");
    if (review) {
      res.render("review", {
        title: "Edit review",
        action: "update",
        review: review
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/remove/:id", confirmAuthor, async (req, res, next) => {
  debugger;
  const reviewId = req.params.id;
  const id = req.session.user._id;

  try {
    const review = await Review.findById(reviewId).populate("museum user");

    const museumId = review.museum.id;
    const authorId = review.author;

    const updatedMuseum = await Museum.findByIdAndUpdate(
      museumId,
      { $pull: { reviews: reviewId } },
      { new: true }
    );
    const updatedUser = await User.findByIdAndUpdate(
      authorId,
      { $pull: { reviews: reviewId } },
      { new: true }
    );
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (deletedReview) {
      res.redirect("/museums/" + museumId);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
