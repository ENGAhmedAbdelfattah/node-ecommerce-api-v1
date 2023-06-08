const { join } = require("path");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config({
  path: join(__dirname, "./../.env"),
});

const connectDB = require("./dataBase");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
connectDB(process.env.DB_URL);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/assets", express.static(join(__dirname, "./../app/uploads")));
app.set("views", join(__dirname, "../app/views/"));
// app.set("view engine", "pug");
app.use(helmet());
app.use(cookieParser());


module.exports = app;
