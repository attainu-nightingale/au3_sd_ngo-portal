const Router = require("express").Router;

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
router.post("/login", (req, res) => {
  res.json("This is Volunteer Login post route");
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
router.post("/registration", (req, res) => {
  res.send("This is Volunteer Registration post route");
});

module.exports = router;
