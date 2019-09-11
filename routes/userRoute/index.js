const Router = require("express").Router;
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const User = require("../../models/User");

const { verifyEmail } = require("../../util/mailer");
const { Joi, loginSchema, regSchema } = require("../../config/joiSchema");
const { parser } = require("../../util/uploader");

const router = Router();

/* 
@type     GET
@route    /user
@desc     For User  Login page
@access   PUBLIC
*/
router.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
    return;
  }
  res.render("userlogin", {
    title: "eGurukul | User Login",
    cssFile: "/css/users_login.css",
    logoLink: "../images/e.png",
    jsFile: "/js/all.js",
    flash: req.flash()["errorMessage"]
  });
});

/* 
@type     POST
@route    /user/login
@desc     For User  Login page
@access   PUBLIC
*/
router.post("/login", async (req, res) => {
  const { error, value } = Joi.validate(req.body, loginSchema);
  if (error) {
    req.flash("errorMessage", error.message);
    res.redirect("/user/login");
    return;
  }
  try {
    const data = await User();

    data
      .getDB()
      .db()
      .collection("users")
      .findOne({ username: value.username })
      .then(async result => {
        // If username doesn't matched
        if (!result) {
          req.flash("errorMessage", "Authentication Failed");
          res.redirect("/user/login");
          return;
        }
        // if user not verified
        if (!result.active) {
          res.redirect("/user/verify");
          return;
        }

        const isMatched = await bcrypt.compare(value.password, result.password);

        if (!isMatched) {
          req.flash("errorMessage", "Authentication Failed");
          res.redirect("/user/login");
          return;
        }
        req.session["isLoggedIn"] = true;
        res.redirect("/");
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
  }
});

/* 
@type     GET
@route    /user/registration
@desc     For User Registration page
@access   PUBLIC
*/
router.get("/registration", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
    return;
  }
  res.render("userreg", {
    title: "eGurukul | User Registration",
    cssFile: "/css/users_signup.css",
    logoLink: "../images/e.png",
    jsFile: "/js/all.js",
    flash: req.flash()["errorMessage"]
  });
});

/* 
@type     POST
@route    /user/registration
@desc     Just for testing
@access   PUBLIC
*/
router.post(
  "/registration",
  parser.single("profile_picture"),
  async (req, res) => {
    if (!req.file) {
      req.flash("errorMessage", "You need to upload profile picture");
      res.redirect("/user/registration");
      return;
    }
    const { secure_url } = req.file;

    const { error, value } = Joi.validate(req.body, regSchema);
    if (error) {
      req.flash("errorMessage", error.message);
      res.redirect("/user/registration");
      return;
    }
    // Encrypt password using bcrypt
    const saltRounds = 10;
    try {
      const data = await User();

      const hash = await bcrypt.hash(value.password, saltRounds);

      // change plain text password to hash password
      value.password = hash;

      // set secret token for email verification
      value.secretToken = shortid.generate();

      // flag for inactive
      value.active = false;
      // add image url
      value.profile_pic = secure_url;

      data
        .getDB()
        .db()
        .collection("users")
        .insertOne(value)
        .then(result => {
          const token = result.ops[0].secretToken;
          // send verification code to user's mail
          verifyEmail(result.ops[0].email, token);
          res.redirect("/user/verify");
        })
        .catch(err => {
          req.flash("errorMessage", err.errmsg);
        });
    } catch (error) {
      req.flash("errorMessage", "Server Error");
    }
  }
);

/*
@type     GET & POST
@route    /user/verify
@desc     Verufy user
@access   PUBLIC
*/
router
  .get("/verify", (req, res) => {
    if (req.session.isLoggedIn) {
      res.redirect("/");
      return;
    }
    res.render("verify", {
      action: "/user/verify",
      title: "eGurukul | Verification",
      logoLink: "../images/e.png",
      flash: req.flash()["errorMessage"]
    });
  })
  .post("/verify", async (req, res) => {
    const { secretToken } = req.body;
    try {
      const data = await User();

      data
        .getDB()
        .db()
        .collection("users")
        .updateOne({ secretToken }, { $set: { active: true, secretToken: "" } })
        .then(result => {
          // If secretToken doesn't matched
          if (!result.result.nModified) {
            req.flash("errorMessage", "Verification failed");
            res.redirect("/user/verify");
            return;
          }
          req.session["isLoggedIn"] = true;
          res.redirect("/");
        })
        .catch(err => {
          req.flash("errorMessage", err.errmsg);
        });
    } catch (error) {
      req.flash("errorMessage", "Server Error");
    }
  });

module.exports = router;
