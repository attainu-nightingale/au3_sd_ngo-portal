const Router = require("express").Router;
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const User = require("../../models/User");

const router = Router();

const loginSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required()
});

const regSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(20)
    .required(),
  name: Joi.string()
    .min(3)
    .max(40)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .max(30)
    .required(),
  dob: Joi.date()
    .greater("1-1-1961")
    .required()
    .raw(),
  location: Joi.string().required()
});

// For User ===============>

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
    logoLink: "../images/e.png"
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
    res.status(403).json({
      error: error.details[0].message
    });
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
@route    /user/registration
@desc     For User Registration page
@access   PUBLIC
*/
router.get("/registration", (req, res) => {
  res.render("userreg", {
    title: "eGurukul | User Registration",
    cssFile: "/css/users_signup.css",
    logoLink: "../images/e.png"
  });
});

/* 
@type     POST
@route    /user/registration
@desc     Just for testing
@access   PUBLIC
*/
router.post("/registration", async (req, res) => {
  const { error, value } = Joi.validate(req.body, regSchema);
  if (error) {
    console.log(error.details[0].message);
    return res.send("An error occured");
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

    data
      .getDB()
      .db()
      .collection("users")
      .insertOne(value)
      .then(result => {
        res.json(result.ops);
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
@desc     Verufy user
@access   PUBLIC
*/
router.post("/verify", async (req, res) => {
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
