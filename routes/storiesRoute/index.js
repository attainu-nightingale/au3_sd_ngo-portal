const Router = require("express").Router;

const router = Router();

/* 
@type     GET
@route    /stories
@desc     Get all stories
@access   PUBLIC
*/
router.get("/", (req, res) => {
  res.send("All Stories Route");
});

/* 
@type     GET
@route    /stories/:id
@desc     Get Single Stories stories
@access   PUBLIC
*/
router.get("/:id", (req, res) => {
  res.json({
    single: req.params.id
  });
});

/* 
@type     POST
@route    /stories
@desc     Create a Story
@access   Private (for volunteer)
*/
router.post("/", (req, res) => {
  res.send("Crate Story Route");
});

/* 
@type     PUT
@route    /stories/:id
@desc     Update a story
@access   Private (for volunteer)
*/
router.put("/:id", (req, res) => {
  res.json({
    update: req.params.id
  });
});

/* 
@type     DELETE
@route    /stories/:id
@desc     Delete a story
@access   Private (for volunteer)
*/
router.delete("/:id", (req, res) => {
  res.json({
    delete: req.params.id
  });
});

module.exports = router;
