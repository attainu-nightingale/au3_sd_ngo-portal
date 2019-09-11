const path = require("path");
const http = require("http");

const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const reload = require("reload");
const helmet = require("helmet");
const flash = require("req-flash");

// DB
const db = require("./db/db");

// Config
const { port, envt } = require("./config");

// Router
const userRouter = require("./routes/userRoute");
const volRouter = require("./routes/volRoute");
const studentRouter = require("./routes/studentRoute");
const storiesRouter = require("./routes/storiesRoute");
const activitesRoute = require("./routes/activityRoute");

// Paths
const STATIC_PATH = path.join(__dirname, "/public");
const VIEWS_PATH = path.join(__dirname, "/views/templates");
const PARTIALS_PATH = path.join(__dirname, "/views/partials");

// Initialize express
const app = express();

// Secure all routes
app.use(helmet());

// express-session middlewares
app.use(
  session({
    secret: "Yaa this is secret code, don't copy it", // 🤪
    resave: false,
    saveUninitialized: true
  })
);

// It'll prevent to use home route by back button when user logout
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

// hbs setup
app.set("view engine", "hbs");
app.set("views", VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

// express middleware
app.use(express.static(STATIC_PATH));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Flash Middleware
app.use(flash());

// set locals for using reload js inside of layout file
app.locals.env = envt === "development";

// Home route
app.get("/", (req, res) => {
  app.locals.logged = req.session.isLoggedIn;
  app.locals.voLogged = req.session.volUser;
  app.locals.userLogged = req.session.userLogged;
  res.render("home", {
    home: true,
    title: "eGurukul | Made for Students and Helped by you",
    logoLink: "./images/e.png"
  });
});

// Donate Page
app.get("/donate", (req, res) => {
  res.render("donate", {
    title: "eGurukul | Donate to poor students",
    cssFile: "css/donate.css",
    logoLink: "./images/e.png",
    jsFile: "/js/all.js"
  });
});

// About us page
app.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    title: "eGurukul | Aboutus",
    logoLink: "./images/e.png",
    jsFile: "/js/all.js"
  });
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Contact us Page
app.get("/contactus", (req, res) => {
  res.render("contact", {
    title: "eGurukul | Contact Us",
    cssFile: "css/contact.css",
    logoLink: "./images/e.png",
    jsFile: "/js/all.js"
  });
});

// Add activity
app.get("/add-activity", (req, res) => {
  if (!req.session.volUser) {
    res.redirect("/vol/login");
    return;
  }
  res.render("add-activities", {
    title: "eGurukul | Add student activity",
    cssFile: "css/activites.css",
    logoLink: "./images/e.png",
    jsFile: "/js/all.js",
    flash: req.flash()["errorMessage"]
  });
});

// Add Student
app.get("/add-student", (req, res) => {
  // if (!req.session.volUser) {
  //   res.redirect("/vol/login");
  //   return;
  // }
  res.render("addNewStudent", {
    title: "eGurukul | Add student",
    cssFile: "css/addNewStudent.css",
    logoLink: "./images/e.png",
    jsFile: "/js/all.js"
  });
});

// Routes
app.use("/user", userRouter);
app.use("/vol", volRouter);
app.use("/students", studentRouter);
app.use("/stories", storiesRouter);
app.use("/activites", activitesRoute);

// Initialize Database
db.initDB((err, db) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB connected");
  }
});

// Start Server
if (envt === "development") {
  const server = http.createServer(app);
  server.listen(port, () => console.log(`Server Running at ${port}`));
  reload(app);
} else {
  app.listen(port, () => {
    console.log(`Heroku Server Running at ${port}`);
  });
}
