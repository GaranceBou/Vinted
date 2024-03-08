const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/vinted");

cloudinary.config({
  cloud_name: "drswijtdf",
  api_key: "493119573659948",
  api_secret: "3lGLxeuF33oSSjM4ZbIHO86miZI",
});

const userRoutes = require("./routes/routesuser");
const offerRoutes = require("./routes/routesoffer");
app.use(userRoutes);
app.use(offerRoutes);

app.get("/", (req, res) => {
  try {
    return res.json("Bienvenue sur notre serveur Vinted");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(400).json("Not found");
});

app.listen(3000, () => {
  console.log("Server started ! 🚀");
});
