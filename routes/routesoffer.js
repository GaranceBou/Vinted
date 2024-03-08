const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");

const Offer = require("../models/Offer");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const picture = req.files.picture;
      const result = await cloudinary.uploader.upload(convertToBase64(picture));
      console.log(result);

      const newOffer = new Offer({
        product_name: req.body.name,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          { MARQUE: req.body.brand },
          { TAILLE: req.body.size },
          { CONDITION: req.body.condition },
          { COULEUR: req.body.color },
          { EMPLACEMENT: req.body.city },
        ],
        product_image: result,
        owner: req.user,
      });

      await newOffer.save();
      res.status(200).json(newOffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const filters = {};
    const { title, priceMin, priceMax, sort, page } = req.query;
    if (title) {
      filters.product_name = new RegExp(title, "i");
    }
    if (priceMin) {
      filters.product_price = { $gte: priceMin };
    }
    if (priceMax) {
      filters.product_price = { $lte: priceMax };
    }
    if (priceMax && priceMin) {
      filters.product_price = {
        $gt: priceMin,
        $lt: priceMax,
      };
    }
    const sorter = {};
    if (sort === "price-asc") {
      sorter.product_price = "asc";
    }
    if (sort === "price-desc") {
      sorter.product_price = "desc";
    }
    let skip = 0;
    if (page) {
      skip = (page - 1) * 3;
    }

    const searchedOffer = await Offer.find(filters)
      .sort(sorter)
      .limit(3)
      .skip(skip);

    const counting = await Offer.countDocuments(filters);

    res.json({ count: counting, offers: searchedOffer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/offers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const offer = await Offer.findById(id).populate("owner", "account");
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
