const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const { cloudName, apiKey, apiSecret } = require("../config");

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png/;
  // check the ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extName) {
    let fileName = file.originalname.split(".");
    fileName = fileName.slice(0, fileName.length - 1).join("");
    fileName += "-" + Date.now();
    return cb(null, fileName);
  } else {
    cb("Error: Images only!");
  }
};

const storage = cloudinaryStorage({
  cloudinary,
  folder: "egurukul",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
  filename: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

const parser = multer({ storage });
module.exports = {
  parser
};
