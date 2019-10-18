const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const helpers = require("./helpers");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const mongoose = require("mongoose");
const hbs = require("hbs");
const momentHandler = require("handlebars.moment");

const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const museumsRouter = require("./routes/museums");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const mylistRouter = require("./routes/mylist");
const reviewsRouter = require("./routes/reviews");
const adminRouter = require("./routes/admin");
const authorizationRouter = require("./routes/middleWare/authorization");

const app = express();

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(connection => {
    console.log("successfully connected");
  })
  .catch(err => {
    console.log(err);
  });

mongoose.set("useCreateIndex", true);

//Session middleware. This will take care of storing the session in mongo,
//and
app.use(
  session({
    secret: "wow much secret, very secret", //encrypts cookie (so it hashes)
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // options for cookie storage
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day expiration of sesh
    })
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//register Partials + Helpers
hbs.registerPartials(__dirname + "/partials");
hbs.registerHelper("incremented", function(index) {
  index++;
  return index;
});
hbs.registerHelper("ifIn", function(elem, list, options) {
  if (list && list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});
hbs.registerHelper("times", function(n, block) {
  let accum = "";
  for (let i = 0; i < n; ++i) {
    debugger;
    accum += block.fn(i);
  }
  debugger;
  return accum;
});
hbs.registerHelper("ifEquals", function(arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("getAvg", function(list) {
  debugger;
  let total = 0;
  for (let i = 0; i < list.length; i++) {
    total += list[i].rating;
  }
  const avg = Math.round((total / list.length) * 10) / 10;
  const fullstars = Math.floor(avg);

  let stars = "";
  for (let x = 0; x < fullstars; x++) {
    stars += `<i class="fas fa-star"></i>`;
  }
  let halfstars = 0;
  if (avg > fullstars) {
    halfstars = 1;
    stars += `<i class="fas fa-star-half-alt"></i>`;
  }
  let emptystars = 5 - fullstars - halfstars;
  for (let y = 0; y < emptystars; y++) {
    stars += `<i class="far fa-star"></i>`;
  }
  return stars;
});

momentHandler.registerHelpers(hbs);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.user = req.session.user || null;
  next();
});

app.use("/", (req, res, next) => {
  if (req.session.user) {
    app.locals.loggedIn = true;
  } else {
    app.locals.loggedIn = false;
  }
  next();
});

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/profile", authorizationRouter, profileRouter);
app.use("/users", usersRouter);
app.use("/museums", museumsRouter);
app.use("/reviews", authorizationRouter, reviewsRouter);
app.use("/mylist", authorizationRouter, mylistRouter);
app.use("/admin", authorizationRouter, adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
