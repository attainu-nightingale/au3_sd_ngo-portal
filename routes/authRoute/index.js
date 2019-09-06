const Router = require("express").Router;

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
router.post("/user/registration", (req, res) => {
  res.send("This is user Registration route");
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
