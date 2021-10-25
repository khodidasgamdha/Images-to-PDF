const express = require("express");
const auth = require("../middleware/auth");
const Images = require("../models/image");

// create new route
const router = new express.Router();

router.get("/login", function (req, res) {
    res.render("login");
});

router.get("/", auth, async function (req, res) {
    const images = await Images.find();
    res.render("home", { images: images });
});

router.get("/developer", function (req, res) {
    res.render("profile");
});

router.get("/add-image", auth, function (req, res) {
    res.render("add-image");
});

module.exports = router