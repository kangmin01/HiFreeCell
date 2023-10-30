import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.admin = Boolean(req.session.admin);
  res.locals.isFly = Boolean(req.session.isFly);
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

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    apiVersion: "2023-10-29",
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: "hifreecell-mini",
  acl: "public-read",
  key: function (request, file, ab_callback) {
    const newFileName = Date.now() + "-" + file.originalname;
    const fullPath = "uploads/" + newFileName;
    ab_callback(null, fullPath);
  },
});

const isFly = process.env.NODE_ENV === "production";

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isFly ? multerUploader : undefined,
});
