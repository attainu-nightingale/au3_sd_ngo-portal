const Router = require("express").Router;
const ObjectID = require("mongodb").ObjectID;

const Student = require("../../models/Student");

const router = Router();

/* 
@type     GET
@route    /student
@desc     Get all students
@access   PRIVATE(for volunteers)
*/
router.get("/", async (req, res) => {
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .find()
      .toArray()
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(400).json({
          error: err.errmsg
        });
      });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

/* 
@type     GET
@route    /student/:id
@desc     Get One student
@access   PRIVATE(for volunteers)
*/
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .findOne({ _id: ObjectID(id) })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(400).json({
          error: err.errmsg
        });
      });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

/* 
@type     POST
@route    /student
@desc     Create a Student
@access   Private (for volunteer)
*/
router.post("/", async (req, res) => {
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .insertOne({
        gurdianName: "Johny Michel Doe",
        name: "John Doe",
        location: "Delhi, India",
        dob: "25-05-1995"
      })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(400).json({
          error: err.errmsg
        });
      });
  } catch (error) {
    res.status(500).json({
      error: "Server Error"
    });
  }
});

/* 
@type     PUT
@route    /student/:id
@desc     Update a student
@access   Private (for volunteer)
*/
router.put("/:id", async (req, res) => {
  try {
    const data = await Student();

    //TODO:- Do with same way
    // data
    //   .getDB()
    //   .db()
    //   .collection("students")
    //   .insertOne({
    //     gurdianName: "Johny Michel Doe",
    //     name: "John Doe",
    //     location: "Delhi, India",
    //     dob: "25-05-1995"
    //   })
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
@type     DELETE
@route    /student/:id
@desc     Delete a student
@access   Private (for volunteer)
*/
router.delete("/:id", async (req, res) => {
  try {
    const data = await Student();

    //TODO:- Do with same way
    // data
    //   .getDB()
    //   .db()
    //   .collection("students")
    //   .insertOne({
    //     gurdianName: "Johny Michel Doe",
    //     name: "John Doe",
    //     location: "Delhi, India",
    //     dob: "25-05-1995"
    //   })
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

module.exports = router;
