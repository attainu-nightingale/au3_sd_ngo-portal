const Router = require("express").Router;
const ObjectID = require("mongodb").ObjectID;

const Student = require("../../models/Student");
const { parser } = require("../../util/uploader");

const router = Router();

/* 
@type     GET
@route    /student
@desc     Get all students
@access   PRIVATE(for volunteers)
*/
router.get("/", async (req, res) => {
  if (!req.session.volUser) {
    res.redirect("/vol/login");
    return;
  }
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .find({})
      .toArray()
      .then(result => {
        res.render("students", {
          logoLink: "../images/e.png",
          jsFile: "/js/all.js",
          data: result,
          routeName: "students"
        });
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
        res.redirect("/");
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

/* 
@type     GET
@route    /student/:id
@desc     Get One student
@access   PRIVATE(for volunteers)
*/
router.get("/:id", async (req, res) => {
  if (!req.session.volUser) {
    res.redirect("/vol/login");
    return;
  }
  const id = req.params.id;
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .findOne({ _id: ObjectID(id) })
      .then(result => {
        const {
          fullname,
          guardian,
          dob,
          gender,
          location,
          study,
          profile_pic,
          report,
          _id: id
        } = result;
        res.render("student-report", {
          title: "eGurukul: Student Report Card",
          logoLink: "../images/e.png",
          jsFile: "/js/all.js",
          cssFile: "../css/report.css",
          fullname,
          guardian,
          dob,
          gender,
          location,
          study,
          profile_pic,
          id,
          report
        });
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
        res.redirect("/");
      });
  } catch (error) {
    req.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

/* 
@type     POST
@route    /student
@desc     Create a Student
@access   Private (for volunteer)
*/
router.post("/", parser.single("profile_picture"), async (req, res) => {
  if (!req.file) {
    req.flash("errorMessage", "You need to upload profile picture");
    res.redirect("/add-student");
    return;
  }

  const { secure_url: profile_pic } = req.file;

  const report = "You need to write report";
  try {
    const data = await Student();
    data
      .getDB()
      .db()
      .collection("students")
      .insertOne({
        ...req.body,
        profile_pic,
        report
      })
      .then(result => {
        res.redirect("/students");
      })
      .catch(err => {
        req.flash("errorMessage", err.errmsg);
      });
  } catch (error) {
    rreq.flash("errorMessage", "Server Error");
    res.redirect("/");
  }
});

/*
@type     GET
@route    /students/edit/:id
@desc     Get a student in a from
@access   Private (for volunteer)
*/
router.get("/edit/:id", async (req, res) => {
  if (!req.session.volUser) {
    res.redirect("/vol/login");
    return;
  }
  const id = req.params.id;
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .findOne({ _id: ObjectID(id) })
      .then(result => {
        const { fullname, guardian, dob, location, study } = result;

        res.render("edit", {
          title: "eGurukul: Edit Student's Field",
          logoLink: "../../images/e.png",
          jsFile: "/js/all.js",
          cssFile: "/css/newForm.css",
          fullname,
          guardian,
          dob,
          location,
          study,
          id
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
@type     GET
@route    /students/report/:id
@desc     Get a student report in a from
@access   Private (for volunteer)
*/
router.get("/report/:id", async (req, res) => {
  if (!req.session.volUser) {
    res.redirect("/vol/login");
    return;
  }
  const id = req.params.id;
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .findOne({ _id: ObjectID(id) })
      .then(result => {
        const { fullname, report } = result;

        res.render("add-report", {
          title: "eGurukul: Add report",
          logoLink: "../../images/e.png",
          jsFile: "/js/all.js",
          cssFile: "/css/add-report.css",
          name: fullname,
          id,
          report
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
@type     PUT
@route    /students/edit/:id
@desc     Update a student
@access   Private (for volunteer)
*/
router.put("/edit/:id", async (req, res) => {
  const datas = req.body;
  try {
    const data = await Student();
    data
      .getDB()
      .db()
      .collection("students")
      .updateOne({ _id: ObjectID(req.params.id) }, { $set: { ...datas } })
      .then(result => {
        res.json({
          success: "Succssfully updated"
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
@type     PUT
@route    /students/report/:id
@desc     Update a student
@access   Private (for volunteer)
*/
router.put("/report/:id", async (req, res) => {
  const datas = req.body;
  try {
    const data = await Student();
    data
      .getDB()
      .db()
      .collection("students")
      .updateOne({ _id: ObjectID(req.params.id) }, { $set: { ...datas } })
      .then(result => {
        res.json({
          success: "Succssfully updated"
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
@route    /student/:id
@desc     Delete a student
@access   Private (for volunteer)
*/
router.delete("/:id", async (req, res) => {
  try {
    const data = await Student();

    data
      .getDB()
      .db()
      .collection("students")
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.json({
          success: "Successfully deleted"
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
