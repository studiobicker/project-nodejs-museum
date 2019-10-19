const express = require("express");
const router = express.Router();

//Custom middleware function.
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
