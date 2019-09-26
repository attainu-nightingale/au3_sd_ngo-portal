const Router = require("express").Router;
const bcrypt = require("bcrypt");

const { Joi, resetPassSchema } = require("../../config/joiSchema");

const Vol = require("../../models/Vol");

const router = Router();

// Reset password page
router.get("/", (req, res) => {
  if (!req.session.userName) {
    res.redirect("/vol/login");
    return;
  }
  res.render("reset-pass", {
    title: "eGurukul | Reset Password",
    logoLink: "./images/e.png",
    jsFile: "/js/all.js",
    username: req.session.userName
  });
});

router.put("/:username", async (req, res) => {
  const username = req.params.username;
  const { error, value } = Joi.validate(req.body, resetPassSchema);
  if (error) {
    res.json({ errorMessage: error.message });
    return;
  }
  // Encrypt password using bcrypt
  const saltRounds = 10;
  try {
    const { password } = value;

    const data = await Vol();

    const hash = await bcrypt.hash(password, saltRounds);

    data
      .getDB()
      .db()
      .collection("volunteers")
      .updateOne({ username: username }, { $set: { password: hash } })
      .then(result => {
        if (!result.result.nModified) {
          res.status(403).json({
            error: "Can't update"
          });
          return;
        }
        res.json({
          success: "Successfully updated"
        });
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
        res.redirect("/reset-password");
        return;
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

// Reset Route
router.post("/", async (req, res) => {
  try {
    const data = await Vol();

    data
      .getDB()
      .db()
      .collection("volunteers")
      .findOne({ username: req.body.username })
      .then(result => {
        if (!result) {
          req.flash("errorMessage", "Username not found");
          res.redirect("/vol/login");
          return;
        }
        req.session.userName = req.body.username;
        res.redirect("/reset-pass");
      })
      .catch(err => req.flash("errorMessage", err.errmsg));
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

module.exports = router;
