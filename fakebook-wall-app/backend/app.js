const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();


if (process.env.IS_MONGO_CLOUD != "true") {
  console.log('using local mongo db');
  mongoose
    .connect(process.env.LOCAL_MONGO_DB,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    )
    .then(() => {
      console.log("Connected to database!");
    })
    .catch(() => {
      console.log("Connection failed!");
    });
} else if (process.env.IS_MONGO_CLOUD == "true") {
  console.log('using cloud mongo db');

  mongoose
    .connect(
      "mongodb+srv://process.env.MONGO_ATLAS_UID:" +
      process.env.MONGO_ATLAS_PW +
      process.env.MONGO_ATLAS_URL,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    ).then(() => {
      console.log("Connected to database!");
    })
    .catch(() => {
      console.log("Connection failed!");
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
