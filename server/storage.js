//import { createRequire } from "module";
//const require = createRequire(import.meta.url);
const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const { v4: uuidv4 } = require("uuid");
var multer = require("multer");
var multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
//const { S3 } = require("aws-sdk");

const {
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_BUCKET,
} = require("./config");

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  endpoint: S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, {
        originalname: file.originalname,
      });
    },
    contentType: function (req, file, cb) {
      cb(null, file.mimetype);
    },
    key: function (req, file, cb) {
      //generate unique file names for the server
      const uuid = uuidv4();
      const key = `${req.s3_key_prefix}${uuid}`;
      req.saved_files.push({
        originalname: file.originalname,
        mimetype: file.mimetype,
        encoding: file.encoding,
        key,
      });
      cb(null, key);
    },
  }),
});

const upload_auth = (req, res, next) => {
  //path to where the file will be uploaded
  try {
    req.s3_key_prefix = req.headers["x-path"].replace("/^//+g, ");
  } catch (e) {
    return next(Boom.badImplementation("x-path header incorrect"));
  }
  //all uploaded filesget pushed into this array
  //array is returned back to client once all uploads are completed
  req.saved_files = [];

  next();
};

router.get("/file/:fileName", (req, res, next) => {
  res.set("Content-Type", "image/jpeg");
  res.set("Content-Type", "image/jpg");
  res.set("Content-Type", "image/png");

  const params = {
    Bucket: S3_BUCKET,
    Key: "/" + req.params.fileName,
    Expires: 20,
  };
  try {
    const viewingLink = s3.getSignedUrl("getObject", params);
    res.json({ viewingLink });
  } catch (err) {
    res.status(500).json({ err });
  }

  /*
  const stream = s3.getObject(params).createReadStream();
  stream.on("error", (err) => {
    console.log(err);
    //logger.log({ level: "error", messsage: "stream error", error: `${err}` });
  });
  stream.pipe(res);

  /*
  console.log("Received parameters", req.params);
  const params = {
    Bucket: S3_BUCKET,
    Key: "/" + req.params.fileName,
    Expires: 20,
  };
  try {
    const viewingLink = s3.getSignedUrl("getObject", params);
    res.json({ viewingLink });
  } catch (err) {
    res.status(500).json({ err });
  }
  */
});

router.post(
  "/upload",
  upload_auth,
  upload.array("files", 50),
  function (req, res) {
    res.json(req.saved_files);
  }
);

module.exports = router;
