const Router = require("express").Router;

const router = Router();

const { Joi, contactSchema } = require("../../config/joiSchema");
const { contactEmail } = require("../../util/mailer");

router.post("/", (req, res) => {
  const { error, value } = Joi.validate(req.body, contactSchema);
  if (error) {
    req.flash("errorMessage", error.message);
    res.redirect("/contactus");
    return;
  }
  const { email } = value;
  contactEmail(email, value);
  setTimeout(() => {
    req.flash("successMessage", "Thank you for contact");
    res.redirect("/contactus");
  }, 2000);
});

module.exports = router;
