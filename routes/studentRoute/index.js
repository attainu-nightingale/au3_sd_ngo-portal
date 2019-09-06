const Router = require("express").Router;

const router = Router();

/* 
@type     GET
@route    /student
@desc     Get all students
@access   PRIVATE(for volunteers)
*/
router.get("/", (req, res) => {
  res.send("All Students Route");
});

/* 
@type     GET
@route    /student/:id
@desc     Get One student
@access   PRIVATE(for volunteers)
*/
router.get("/:id", (req, res) => {
  res.send("Single Student Route");
});

/* 
@type     POST
@route    /student
@desc     Create a Student
@access   Private (for volunteer)
*/
router.post("/", (req, res) => {
  res.send("Crate Student Route");
});

/* 
@type     PUT
@route    /student/:id
@desc     Update a student
@access   Private (for volunteer)
*/
router.put("/:id", (req, res) => {
  res.json({
    update: req.params.id
  });
});

/* 
@type     DELETE
@route    /student/:id
@desc     Delete a student
@access   Private (for volunteer)
*/
router.delete("/:id", (req, res) => {
  res.json({
    delete: req.params.id
  });
});

module.exports = router;
