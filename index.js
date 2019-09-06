const path = require("path");
const http = require("http");

const express = require("express");
const hbs = require("hbs");
const reload = require("reload");

const { port, envt } = require("./config");

// Paths
const STATIC_PATH = path.join(__dirname, "./public");
const VIEWS_PATH = path.join(__dirname, "/views/templates");
const PARTIALS_PATH = path.join(__dirname, "/views/partials");

// Initialize express
const app = express();

// hbs setup
app.set("view engine", "hbs");
app.set("views", VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

// express middleware
app.use(express.static(STATIC_PATH));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.env = envt === "development";

// Home route
app.get("/", (req, res) => {
  res.render("home");
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
