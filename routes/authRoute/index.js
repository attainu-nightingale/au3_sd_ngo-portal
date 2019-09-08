const Router = require("express").Router;

const User = require("../../models/User");

const router = Router();

// For User ===============>

/* 
@type     GET
@route    /auth/user/login
@desc     For User  Login page
@access   PUBLIC
*/
router.get("/user/login", (req, res) => {
  res.send("This is user Login route");
});

/* 
@type     POST
@route    /auth/user/login
@desc     For User  Login page
@access   PUBLIC
*/
router.get("/user/login", (req, res) => {
  res.send("This is user Login post route");
});

/* 
@type     GET
@route    /auth/user/registration
@desc     For User Registration page
@access   PUBLIC
*/
router.get("/user/registration", (req, res) => {
  res.send("This is user Registration route");
});

/* 
@type     POST
@route    /auth/user/registration
@desc     Just for testing
@access   PUBLIC
*/
router.post("/user/registration", async (req, res) => {
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

// For Volunteer ===============>

/* 
@type     GET
@route    /auth/vol/login
@desc     Login For Volunteers page
@access   PUBLIC
*/
router.get("/vol/login", (req, res) => {
  res.send("This is Volunteer Login route");
});

/* 
@type     POST
@route    /auth/vol/login
@desc     Login For Volunteers
@access   PUBLIC
*/
router.post("/vol/login", (req, res) => {
  res.json("This is Volunteer Login post route");
});

/* 
@type     GET
@route    /auth/vol/registration
@desc     For volunteers registration page
@access   PUBLIC
*/
router.get("/vol/registration", (req, res) => {
  res.send("This is Volunteer registration route");
});

/* 
@type     POST
@route    /auth/vol/registration
@desc     Create volunteers
@access   PUBLIC
*/
router.post("/vol/registration", (req, res) => {
  res.send("This is Volunteer Registration post route");
});

module.exports = router;
