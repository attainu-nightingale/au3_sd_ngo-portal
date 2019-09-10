const path = require("path");
const multer = require("multer");

const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // check the ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(".")[0];

    cb(null, fileName + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("profile_picture");

module.exports = {
  upload
};
