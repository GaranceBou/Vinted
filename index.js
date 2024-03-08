require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config(
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_API_SECRET
);

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

app.listen(process.env.PORT, () => {
  console.log("Server started ! 🚀");
});
