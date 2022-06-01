const express = require("express");
const dataController = require("../controller");

const router = express.Router();

router.get("/", (req, res) => {
  dataController.renderResultsTemplate(res);
});

router.post("/", (req, res) => {
  dataController.selectRegion(req, res);
});

router.post("/constellation", (req, res) => {
  dataController.selectConstellation(req, res);
});

router.post("/materials", (req, res) => {
  dataController.selectMaterials(req, res);
});

router.get("/richness", (req, res) => {
  dataController.cookieRichnessCheck(req, res);
});

router.post("/richness", (req, res) => {
  dataController.selectRichness(req, res);
});

router.get("/results", (req, res) => {
  dataController.cookieRichnessCheck(req, res);
});

module.exports = router;
