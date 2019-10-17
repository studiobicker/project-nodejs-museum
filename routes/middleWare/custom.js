module.exports = (req, res, next) => {
  debugger;
  const { user } = req.session;
  if (user && user._id === req.params.id) {
    req.app.locals.isAuthor = true;
  } else {
    req.app.locals.isAuthor = false;
  }
  next();
};
