const Router = require("express").Router;
const ObjectID = require("mongodb").ObjectID;

const Stories = require("../../models/Stories");

const router = Router();

/* 
@type     GET
@route    /stories
@desc     Get all stories
@access   PUBLIC
*/
router.get("/", async (req, res) => {
  res.render("stories_page", {
    title: "eGurukul | Our Awesome stories",
    logoLink: "./images/e.png",
    jsFile: "/js/all.js"
  });
  /*   try {
    const data = await Stories();

    // TODO:- Do with same way
    // data
    //   .getDB()
    //   .db()
    //   .collection("stories")
    //   .insertOne({
    //     title: "Johny Doe",
    //     image: "http://image.com",
    //     details: "Some random details",
    //     createdBy: "John"
    //   })
    //   .then(result => {
    //     res.json(result.ops);
    //   })
    //   .catch(err => {
    //     res.status(400).json({
    //       error: err.errmsg
    //     });
    //   });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  } */
});

/* 
@type     GET
@route    /stories/:id
@desc     Get Single Stories stories
@access   PUBLIC
*/
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Stories();

    // TODO:- do with same way
    // data
    //   .getDB()
    //   .db()
    //   .collection("stories")
    //   .findOne({ _id: ObjectID(id) })
    //   .then(result => {
    //     res.json(result);
    //   })
    //   .catch(err => {
    //     res.status(400).json({
    //       error: err.errmsg
    //     });
    //   });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

/* 
@type     POST
@route    /stories
@desc     Create a Story
@access   Private (for volunteer)
*/
router.post("/", async (req, res) => {
  try {
    const data = await Stories();

    //TODO:- Do with same way
    // data
    //   .getDB()
    //   .db()
    //   .collection("stories")
    //   .insertOne({
    //     title: "Johny Doe",
    //     image: "http://image.com",
    //     details: "Some random details",
    //     createdBy: "John"
    //   })
    //   .then(result => {
    //     res.json(result.ops);
    //   })
    //   .catch(err => {
    //     res.status(400).json({
    //       error: err.errmsg
    //     });
    //   });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

/* 
@type     PUT
@route    /stories/:id
@desc     Update a story
@access   Private (for volunteer)
*/
router.put("/:id", async (req, res) => {
  try {
    const data = await Stories();

    // TODO:- Do with same way
    // data
    //   .getDB()
    //   .db()
    //   .collection("stories")
    //   .insertOne({
    //     title: "Johny Doe",
    //     image: "http://image.com",
    //     details: "Some random details",
    //     createdBy: "John"
    //   })
    //   .then(result => {
    //     res.json(result.ops);
    //   })
    //   .catch(err => {
    //     res.status(400).json({
    //       error: err.errmsg
    //     });
    //   });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

/* 
@type     DELETE
@route    /stories/:id
@desc     Delete a story
@access   Private (for volunteer)
*/
router.delete("/:id", async (req, res) => {
  try {
    const data = await Stories();

    // TODO:- Do with same way
    // data
    //   .getDB()
    //   .db()
    //   .collection("stories")
    //   .insertOne({
    //     title: "Johny Doe",
    //     image: "http://image.com",
    //     details: "Some random details",
    //     createdBy: "John"
    //   })
    //   .then(result => {
    //     res.json(result.ops);
    //   })
    //   .catch(err => {
    //     res.status(400).json({
    //       error: err.errmsg
    //     });
    //   });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

module.exports = router;
