const express = require("express");
const dataController = require("../controllers/controller");

const router = express.Router();

router.get("/", (req, res) => {
  dataController.renderTemplate(res);
});

router.post("/", (req, res) => {
  dataController.getResponse(req, res, "constellation");
});

router.post("/constellation", (req, res) => {
  dataController.getResponse(req, res, "material");
});

router.post("/materials", (req, res) => {
  dataController.getResponse(req, res, "richness");
});

router.post("/richness", (req, res) => {
  dataController.getResults(req, res);
});

router.post("/results", (req, res) => {
  dataController.rebuildResults(req, res);
});

module.exports = router;
