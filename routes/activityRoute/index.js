const Router = require("express").Router;
const ObjectID = require("mongodb").ObjectID;

const Activites = require("../../models/Activites");
const { parser } = require("../../util/uploader");

const router = Router();

/* 
@type     GET
@route    /activity
@desc     Get all activites
@access   Public 
*/
router.get("/", async (req, res) => {
  try {
    const data = await Activites();

    data
      .getDB()
      .db()
      .collection("activites")
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
@type     POST
@route    /activity
@desc     Create a activity
@access   Private (for volunteer)
*/
router.post("/", async (req, res) => {
  try {
    const data = await Activites();

    data
      .getDB()
      .db()
      .collection("activites")
      .insertOne({ ...req.body, createdBy: "RuhanRK" })
      .then(result => {
        res.json(result.ops);
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
@route    /activity/:id
@desc     Update a activity
@access   Private (for volunteer)
*/
router.put("/:id", async (req, res) => {
  try {
    const data = await Activites();

    data
      .getDB()
      .db()
      .collection("activites")
      .updateOne({ _id: ObjectID(req.params.id) }, { $set: req.body })
      .then(result => {
        if (!result.result.nModified) {
          res.status(403).json({
            error: "Can't update"
          });
          return;
        }
        res.json({
          success: "Successfully updated"
        });
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
@type     DELETE
@route    /activity/:id
@desc     Delete a activity
@access   Private (for volunteer)
*/
router.delete("/:id", async (req, res) => {
  try {
    const data = await Activites();

    data
      .getDB()
      .db()
      .collection("activites")
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        if (!result.result.n) {
          res.status(402).json({
            error: "Can't be deleted"
          });
          return;
        }
        res.json({
          success: "Deleted successfully"
        });
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

module.exports = router;
