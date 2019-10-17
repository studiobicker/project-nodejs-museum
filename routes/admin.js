const express = require("express");
const router = express.Router();

const Museum = require("../models/Museum");
const Review = require("../models/Review");
const User = require("../models/User");

router.get("/", (req, res, next) => {
  res.render("dashboard", { title: "Dashboard", layout: "adminLayout.hbs" });
});

module.exports = router;
