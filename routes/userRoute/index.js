const Router = require("express").Router;

const User = require("../../models/User");

const router = Router();

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
router.post("/login", (req, res) => {
  res.send("This is user Login post route");
});

/* 
@type     GET
@route    /user/registration
@desc     For User Registration page
@access   PUBLIC
*/
router.get("/registration", (req, res) => {
  res.send("This is user Registration route");
});

/* 
@type     POST
@route    /auth/user/registration
@desc     Just for testing
@access   PUBLIC
*/
router.post("/registration", async (req, res) => {
  try {
    const data = await User();

    data
      .getDB()
      .db()
      .collection("users")
      .insertOne({
        name: "Ruhan",
        email: "ruhan@gmail.com",
        username: "RuhanRK",
        dob: "25-05-1995",
        password: "1234"
      })
      .then(result => {
        res.json(result);
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

module.exports = router;
