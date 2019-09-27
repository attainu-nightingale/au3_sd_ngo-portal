const Router = require("express").Router;
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const { Joi, resetPassSchema } = require("../../config/joiSchema");

const Vol = require("../../models/Vol");
const { verifyEmail } = require("../../util/mailer");

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

    // set secret token for email verification
    const secretToken = shortid.generate();
    const active = false;
    data
      .getDB()
      .db()
      .collection("volunteers")
      .updateOne(
        { username: username },
        { $set: { password: hash, secretToken, active } }
      )
      .then(result => {
        if (!result.result.nModified) {
          req.json({ errorMessage: "Can't update right now" });
          return;
        }
        verifyEmail(req.session.userEmail, secretToken);

        const email = req.session.userEmail.split("@");
        const someLastDigit = email[0].substring(email[0].length - 5);
        let leftPart = email[0].substring(
          0,
          email[0].length - someLastDigit.length
        );
        leftPart = new Array(leftPart.length).fill("*").join("");

        const resultEmail = leftPart + someLastDigit + "@" + email[1];
        res.json({
          msg: `Verification code has been sent to ${resultEmail}`
        });
      })
      .catch(err => {
        req.json({ errorMessage: err.errmsg });
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

        req.session.userName = result.username;
        req.session.userEmail = result.email;
        res.redirect("/reset-pass");
      })
      .catch(err => req.flash("errorMessage", err.errmsg));
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

/*
@type     GET and POST
@route    /reset-pass/verify
@desc     Verufy for reest password
@access   PUBLIC
*/
router
  .get("/verify", (req, res) => {
    if (req.session.isLoggedIn) {
      res.redirect("/");
      return;
    }
    res.render("verify", {
      action: "/reset-pass/verify",
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
        .updateOne({ secretToken }, { $set: { secretToken: "", active: true } })
        .then(result => {
          // If secretToken doesn't matched
          if (!result.result.nModified) {
            req.flash("errorMessage", "Verification failed");
            res.redirect("/reset-pass/verify");
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

module.exports = router;
