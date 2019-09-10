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
  res.render("userlogin", {
    title: "eGurukul | User Login",
    cssFile: "/css/users_login.css",
    logoLink: "../images/e.png",
    jsFile: "/js/all.js"
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
    // res.status(403).json({
    //   error: "an error occured"
    // });
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
          // return res.status(404).json({ error: "Authentication Failed" });
          res.redirect("/user/login");
          return;
        }
        // if user not verified
        if (!result.active) {
          // return res.status(403).json({ error: "Email not verified" });
          res.redirect("/user/verify");
          return;
        }

        const isMatched = await bcrypt.compare(value.password, result.password);

        if (!isMatched) {
          // return res.status(404).json({
          //   error: "Authentication Failed"
          // });
          res.redirect("/user/login");
          return;
        }
        req.session["isLoggedIn"] = true;
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          error: err.errmsg
        });
      });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

/* 
@type     GET
@route    /user/registration
@desc     For User Registration page
@access   PUBLIC
*/
router.get("/registration", (req, res) => {
  res.render("userreg", {
    title: "eGurukul | User Registration",
    cssFile: "/css/users_signup.css",
    logoLink: "../images/e.png",
    jsFile: "/js/all.js"
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
    const { secure_url } = req.file;
    const { error, value } = Joi.validate(req.body, regSchema);
    if (error) {
      return res.status(403).json({
        error: error.message
      });
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
          console.log(err);
          res.status(400).json({
            error: err.errmsg
          });
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Server Error"
      });
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
      logoLink: "../images/e.png"
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
            // return res.status(404).json({ error: "Can't be verified" });
            res.redirect("/user/verify");
            return;
          }
          req.session["isLoggedIn"] = true;
          res.redirect("/");
        })
        .catch(err => {
          res.status(400).json({
            error: err.errmsg
          });
        });
    } catch (error) {
      res.status(500).json({
        error: "Server Error"
      });
    }
  });

module.exports = router;
