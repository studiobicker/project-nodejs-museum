const express = require("express");
const router = express.Router();

const Museum = require("../models/Museum");
const Review = require("../models/Review");
const User = require("../models/User");

router.get("/", (req, res, next) => {
  res.render("dashboard", { title: "Dashboard", layout: "adminLayout.hbs" });
});

router.get("/museums", (req, res, next) => {
  res.render("admin", { title: "Museums", layout: "adminLayout.hbs" });
});

router.get("/reviews", (req, res, next) => {
  res.render("admin", { title: "Reviews", layout: "adminLayout.hbs" });
});

router.get("/users", (req, res, next) => {
  res.render("admin", { title: "Users", layout: "adminLayout.hbs" });
});

module.exports = router;
