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
      .collection("activities")
      .find()
      .toArray()
      .then(result => {
        res.render("activites", {
          logoLink: "./images/e.png",
          jsFile: "/js/all.js",
          cssFile: "css/activity.css",
          data: result,
          volunteerLogged: req.session.volUser,
          routeName: "activites"
        });
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
        res.redirect("/activites");
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

/* 
@type     POST
@route    /activity
@desc     Create a activity
@access   Private (for volunteer)
*/
router.post("/", parser.single("activity_img"), async (req, res) => {
  if (!req.file) {
    req.flash("errorMessage", "You need to upload activity image");
    res.redirect("/add-activity");
    return;
  }
  const { secure_url: activity_image } = req.file;

  try {
    const data = await Activites();

    data
      .getDB()
      .db()
      .collection("activities")
      .insertOne({
        ...req.body,
        activity_image,
        createdBy: req.session.volUser
      })
      .then(result => {
        res.redirect("/activites");
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
        res.redirect("/add-activity");
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});
/*
@type     GET
@route    /activity/:id
@desc     Update activity page
@access   Private (for volunteer)
*/
router.get("/:id", async (req, res) => {
  if (!req.session.volUser) {
    res.redirect("/vol/login");
    return;
  }
  try {
    const data = await Activites();

    data
      .getDB()
      .db()
      .collection("activities")
      .findOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.render("update-activites", {
          logoLink: "../images/e.png",
          jsFile: "../js/all.js",
          cssFile: "../css/activites.css",
          data: result,
          routeName: "activites"
        });
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
        res.redirect("/activites");
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
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
      .collection("activities")
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
      .collection("activities")
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
