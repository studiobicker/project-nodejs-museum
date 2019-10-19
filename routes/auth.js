const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10; // cost factor for producing the hash

/* GET signup page. */
router.get("/register", (req, res, next) => {
  res.render("auth/register");
});

/* Post signup page. */
router.post("/register", async (req, res, next) => {
  const { username, password, firstname } = req.body;
  try {
    if (username && password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        username,
        password: hashedPassword,
        firstname
      });
      req.session.user = user;
      req.app.locals.loggedIn = true;
      res.redirect("/profile");
    } else {
      res.render("auth/register", {
        errorMessage: "Please enter both a username and password to register."
      });
    }
  } catch (err) {
    if (err.code === 11000) {
      res.render("auth/register", {
        errorMessage:
          "The username already exist. Please use a different username."
      });
    }
    next(err);
  }
});

/* GET login page. */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (username && password) {
      const user = await User.findOne({ username });
      if (user) {
        const correctPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (correctPassword) {
          req.session.user = user;
          req.app.locals.loggedIn = true;
          debugger;
          const redirectionUrl = req.session.redirectURL || "/profile";
          res.redirect(redirectionUrl);
        } else {
          res.render("auth/login", {
            errorMessage: "Please enter a valid username or password."
          });
        }
      } else {
        res.render("auth/login", {
          errorMessage: "Please enter a valid username or password."
        });
      }
    } else {
      res.render("auth/login", {
        errorMessage: "Please enter both a username and password to register."
      });
    }
  } catch (err) {
    next(err);
  }
});

// GET /logout
router.get("/logout", (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(err => {
      if (err) {
        return next(err);
      } else {
        req.app.locals.loggedIn = false;
        return res.redirect("/");
      }
    });
  }
});
module.exports = router;
