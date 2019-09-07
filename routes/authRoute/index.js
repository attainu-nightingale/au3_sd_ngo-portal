const Router = require("express").Router;

const User = require("../../models/User");

const router = Router();

// For User ===============>

/* 
@type     GET
@route    /auth/user/login
@desc     Just for testing
@access   PUBLIC
*/
router.get("/user/login", (req, res) => {
  res.send("This is user Login route");
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
@desc     Just for testing
@access   PUBLIC
*/
router.get("/vol/login", (req, res) => {
  res.send("This is Volunteer Login route");
});

/* 
@type     POST
@route    /auth/vol/registration
@desc     Just for testing
@access   PUBLIC
*/
router.post("/vol/registration", (req, res) => {
  res.send("This is Volunteer Registration route");
});

module.exports = router;
