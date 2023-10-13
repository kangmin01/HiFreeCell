import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.admin = Boolean(req.session.admin);
  next();
};

export const userOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  } else {
    next();
  }
};

export const adminOnlyMiddleware = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/");
  } else {
    next();
  }
};

export const avatarUpload = multer({
  dest: "uploads/",
});
