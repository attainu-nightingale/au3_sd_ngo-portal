const Router = require("express").Router;
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const Vol = require("../../models/Vol");

const { verifyEmail } = require("../../util/mailer");
const { Joi, loginSchema, volSchema } = require("../../config/joiSchema");
const { parser } = require("../../util/uploader");

const router = Router();

/* 
@type     GET
@route    /vol/login
@desc     Login For Volunteers page
@access   PUBLIC
*/
router.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
    return;
  }
  res.render("vollogin", {
    title: "eGurukul | Volunteer Login",
    cssFile: "/css/vol.css",
    logoLink: "../images/e.png",
    jsFile: "/js/all.js"
  });
});

/* 
@type     POST
@route    /vol/login
@desc     Login For Volunteers
@access   PUBLIC
*/
router.post("/login", async (req, res) => {
  const { error, value } = Joi.validate(req.body, loginSchema);
  if (error) {
    // res.status(403).json({
    //   error: error.message
    // });
    res.redirect("/vol/login");
    return;
  }
  try {
    const data = await Vol();

    data
      .getDB()
      .db()
      .collection("volunteers")
      .findOne({ username: value.username })
      .then(async result => {
        // If username doesn't matched
        if (!result) {
          // return res.status(404).json({ error: "Authentication Failed" });
          res.redirect("/vol/login");
          return;
        }
        // if user not verified
        if (!result.active) {
          // return res.status(403).json({ error: "Email not verified" });
          res.redirect("/vol/verify");
          return;
        }

        const isMatched = await bcrypt.compare(value.password, result.password);

        if (!isMatched) {
          // return res.status(404).json({
          //   error: "Authentication Failed"
          // });
          res.redirect("/vol/login");
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
@route    /vol/registration
@desc     For volunteers registration page
@access   PUBLIC
*/
router.get("/registration", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/");
    return;
  }
  res.render("volreg", {
    title: "eGurukul | Volunteer Registration",
    cssFile: "/css/volunteer.css",
    logoLink: "../images/e.png",
    jsFile: "/js/all.js"
  });
});

/* 
@type     POST
@route    /vol/registration
@desc     Create volunteers
@access   PUBLIC
*/
router.post(
  "/registration",
  parser.single("profile_picture"),
  async (req, res) => {
    const { url, secure_url } = req.file;

    const { error, value } = Joi.validate(req.body, volSchema);
    if (error) {
      return res.status(403).json({
        error: error.message
      });
    }

    // Encrypt password using bcrypt
    const saltRounds = 10;
    try {
      const data = await Vol();

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
        .collection("volunteers")
        .insertOne(value)
        .then(result => {
          const token = result.ops[0].secretToken;
          // send verification code to user's mail
          verifyEmail(result.ops[0].email, token);
          res.redirect("/vol/verify");
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
@type     GET and POST
@route    /user/verify
@desc     Verufy volunteer
@access   PUBLIC
*/
router
  .get("/verify", (req, res) => {
    if (req.session.isLoggedIn) {
      res.redirect("/");
      return;
    }
    res.render("verify", {
      action: "/vol/verify",
      title: "eGurukul | Verification",
      logoLink: "../images/e.png"
    });
  })
  .post("/verify", async (req, res) => {
    const { secretToken } = req.body;
    try {
      const data = await Vol();

      data
        .getDB()
        .db()
        .collection("volunteers")
        .updateOne({ secretToken }, { $set: { active: true, secretToken: "" } })
        .then(result => {
          // If secretToken doesn't matched
          if (!result.result.nModified) {
            // return res.status(404).json({ error: "Can't be verified" });
            res.redirect("/vol/verify");
            return;
          }
          req.session["isLoggedIn"] = true;
          // res.json(result);
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
