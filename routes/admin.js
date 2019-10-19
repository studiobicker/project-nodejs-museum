const express = require("express");
const router = express.Router();

const Museum = require("../models/Museum");
const Review = require("../models/Review");
const User = require("../models/User");

const multer = require("multer");
const upload = multer({ dest: __dirname + "/../public/images/museums" });

router.get("/", (req, res, next) => {
  res.render("admin/dashboard", {
    title: "Dashboard",
    layout: "adminLayout.hbs"
  });
});

router.get("/museums", async (req, res, next) => {
  try {
    const museums = await Museum.find().sort({ title: 1 });
    debugger;
    res.render("admin/museums", {
      title: "Museums",
      museums: museums,
      layout: "adminLayout.hbs"
    });
  } catch (err) {
    next(err);
  }
});

/* GET single museum */
router.get("/museums/:id/", async (req, res, next) => {
  debugger;
  const id = req.params.id;
  try {
    const museum = await Museum.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    });
    if (museum) {
      res.render("admin/museum", {
        title: "Edit museum",
        museum: museum,
        layout: "adminLayout.hbs"
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post(
  "/museum/updateImg",
  upload.single("museumImg"),
  async (req, res, next) => {
    const museumId = req.body.museumId;
    debugger;

    updatedMuseum = await Museum.findByIdAndUpdate(
      { _id: museumId },
      { $set: { "image.url": req.file.filename, "image.internal": true } },
      { new: true }
    );

    res.redirect("/admin/museums/" + museumId);
  }
);

router.get("/museum/remove/:id", async (req, res, next) => {
  debugger;
  const museumId = req.params.id;

  try {
    // const reviews = await Review.find(museumId).populate("user");
    // for (let i = 0; i < reviews.length; i++) {
    //   const authorId = reviews[i].id;
    //   //delete review from user
    //   const mylist = await User.find(authorId).populate("museum");
    //   for (let j = 0; j < mylist.length; j++) {
    //     //delete museum from mylist
    //   }
    // }

    debugger;

    // const deletedReviews = await Museum.findOneAndDelete(
    //   {museum: museumId}
    // );

    // const updatedUser = await User.findByIdAndUpdate(
    //   authorId,
    //   { $pull: { reviews: reviewId } },
    //   { new: true }
    // );
    const deletedMuseum = await Museum.findByIdAndDelete(museumId);
    if (deletedMuseum) {
      res.redirect("/admin/museums");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/reviews", (req, res, next) => {
  res.render("admin", { title: "Reviews", layout: "adminLayout.hbs" });
});

router.get("/users", (req, res, next) => {
  res.render("admin", { title: "Users", layout: "adminLayout.hbs" });
});

module.exports = router;
