const Router = require("express").Router;
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const ObjectID = require("mongodb").ObjectID;

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
    jsFile: "/js/all.js",
    flash: req.flash()["errorMessage"]
  });
});

/*
@type     GET
@route    /vol/profile
@desc     Profile for Volunteers
@access   PRIVATE
*/
router.get("/profile", async (req, res) => {
  if (req.session.volUser) {
    try {
      const data = await Vol();
      data
        .getDB()
        .db()
        .collection("volunteers")
        .findOne({ username: req.session.volUser })
        .then(result => {
          res.render("profile", {
            title: "eGurukul| Your profile",
            logoLink: "../images/e.png",
            cssFile: "/css/profile.css",
            jsFile: "/js/all.js",
            name: result.fullname,
            email: result.email,
            dob: result.dob,
            number: result.number,
            location: result.location,
            profile: result.profile_pic,
            id: result._id,
            route: "vol",
            routeName: "profile"
          });
        })
        .catch(err => {
          req.flash("errorMessage", err.errmsg);
        });
    } catch (error) {
      req.flash("errorMessage", "Server Error");
      res.redirect("/");
    }
  } else {
    res.redirect("/vol/login");
  }
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
    req.flash("errorMessage", error.message);
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
          req.flash("errorMessage", "Authentication Failed");
          res.redirect("/vol/login");
          return;
        }
        // if user not verified
        if (!result.active) {
          res.redirect("/vol/verify");
          return;
        }

        const isMatched = await bcrypt.compare(value.password, result.password);

        if (!isMatched) {
          req.flash("errorMessage", "Authentication Failed");
          res.redirect("/vol/login");
          return;
        }
        req.session["isLoggedIn"] = true;
        req.session["volUser"] = result.username;
        res.redirect("/");
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
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
    jsFile: "/js/all.js",
    flash: req.flash()["errorMessage"]
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
    if (!req.file) {
      req.flash("errorMessage", "You need to upload profile picture");
      res.redirect("/user/registration");
      return;
    }
    const { secure_url } = req.file;

    const { error, value } = Joi.validate(req.body, volSchema);
    if (error) {
      req.flash("errorMessage", error.message);
      res.redirect("/user/registration");
      return;
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
          req.flash("errorMessage", err.errmsg);
          res.redirect("/vol/registration");
          return;
        });
    } catch (error) {
      req.flash("errorMessage", "Server Error");
      res.redirect("/vol/registration");
      return;
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
      logoLink: "../images/e.png",
      flash: req.flash()["errorMessage"]
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
            req.flash("errorMessage", "Verification failed");
            res.redirect("/vol/verify");
            return;
          }
          res.redirect("/vol/login");
        })
        .catch(err => {
          req.flash("errorMessage", err.errmsg);
        });
    } catch (error) {
      req.flash("errorMessage", "Server Error");
    }
  });

/*
@type     DELETE
@route    /vol/profile/:id
@desc     Delete Profile
@access   PRIVATE
*/
router.delete("/profile/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Vol();
    data
      .getDB()
      .db()
      .collection("volunteers")
      .deleteOne({ _id: ObjectID(id) })
      .then(result => {
        res.json({
          success: "Successfully deleted"
        });
      })
      .catch(err => {
        req.json({
          err: "Some error occured"
        });
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

module.exports = router;
