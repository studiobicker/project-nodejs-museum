const express = require("express");
const router = express.Router();

// function auth(rerouteTo){

//   return function (req, res, next) {
//     if (req.session.user) {
//       next();
//     } else {
//       res.redirect("/login");
//     }
//   }

// }

// app.get("/profile", auth("/profile") )

//Our custom middleware function.
router.use("/", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.session.redirectURL = req.originalUrl;
    res.redirect("/login");
  }
});

//module.exports = auth;
module.exports = router;
