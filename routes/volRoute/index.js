const Router = require("express").Router;
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const Vol = require("../../models/Vol");

const { verifyEmail } = require("../../util/mailer");
const { Joi, loginSchema, volSchema } = require("../../config/joiSchema");

const router = Router();

/* 
@type     GET
@route    /vol/login
@desc     Login For Volunteers page
@access   PUBLIC
*/
router.get("/login", (req, res) => {
  res.render("vollogin", {
    title: "eGurukul | Volunteer Login",
    cssFile: "/css/vol.css",
    logoLink: "../images/e.png"
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
    res.status(403).json({
      error: error.message
    });
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
          return res.status(404).json({ error: "Authentication Failed" });
        }
        // if user not verified
        if (!result.active) {
          return res.status(403).json({ error: "Email not verified" });
        }

        const isMatched = await bcrypt.compare(value.password, result.password);

        if (!isMatched) {
          return res.status(404).json({
            error: "Authentication Failed"
          });
        }
        res.json(result);
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
  res.render("volreg", {
    title: "eGurukul | Volunteer Registration",
    cssFile: "/css/volunteer.css",
    logoLink: "../images/e.png"
  });
});

/* 
@type     POST
@route    /vol/registration
@desc     Create volunteers
@access   PUBLIC
*/
router.post("/registration", async (req, res) => {
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

    data
      .getDB()
      .db()
      .collection("volunteers")
      .insertOne(value)
      .then(result => {
        const token = result.ops[0].secretToken;
        // send verification code to user's mail
        verifyEmail("ruhikhandaker@gmail.com", token);
        res.json({
          success: "Registerd. Now verify your account"
        });
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
});

/*
@type     POST
@route    /user/verify
@desc     Verufy volunteer
@access   PUBLIC
*/
router.post("/verify", async (req, res) => {
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
        if (!result) {
          return res.status(404).json({ error: "Can't be verified" });
          // res.redirect("/user/login")
        }
        res.json(result);
        // res.redirect("/user")
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
