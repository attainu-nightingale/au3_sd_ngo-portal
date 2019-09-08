const path = require("path");
const http = require("http");

const express = require("express");
const hbs = require("hbs");
const reload = require("reload");
const helmet = require("helmet");

// DB
const db = require("./db/db");

// Config
const { port, envt } = require("./config");

// Router
const userRouter = require("./routes/userRoute");
const volRouter = require("./routes/volRoute");
const studentRouter = require("./routes/studentRoute");
const storiesRouter = require("./routes/storiesRoute");

// Paths
const STATIC_PATH = path.join(__dirname, "/public");
const VIEWS_PATH = path.join(__dirname, "/views/templates");
const PARTIALS_PATH = path.join(__dirname, "/views/partials");

// Initialize express
const app = express();

// Secure all routes
app.use(helmet());

// hbs setup
app.set("view engine", "hbs");
app.set("views", VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

// express middleware
app.use(express.static(STATIC_PATH));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set locals for using reload js inside of layout file
app.locals.env = envt === "development";

// Home route
app.get("/", (req, res) => {
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
    logoLink: "./images/e.png"
  });
});

// About us page
app.get("/aboutus", (req, res) => {
  res.send("About us page");
});

// Routes
app.use("/user", userRouter);
app.use("/vol", volRouter);
app.use("/student", studentRouter);
app.use("/stories", storiesRouter);

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
