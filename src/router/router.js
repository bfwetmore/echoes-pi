const express = require("express");
const controller = require("../controllers/controller");

const router = express.Router();

router.get("/", (req, res) => {
  controller.getRegion(res);
});

router.get("/thankyou", (req, res) => {
  controller.getThankYou(res);
});

router.post("/", (req, res) => {
  controller.getConstellations(req, res);
});

router.post("/constellation", (req, res) => {
  controller.getMaterials(req, res);
});

router.post("/materials", (req, res) => {
  controller.getRichness(req, res);
});

router.post("/richness", (req, res) => {
  controller.getResults(req, res);
});

router.post("/results", (req, res) => {
  controller.buildResults(req, res);
});

module.exports = router;
