const express = require("express");
const data = require("/data/data-manager");

const router = (express.Router);
router.get("/", (req, res) => {
    data.renderResultsTemplate(res);
});

router.post("/", (req, res) => {
    data.selectedRegion = req.body.region;
    if (data.results) {
        data.selectedConstellation = undefined;
    }
    data.redirectRouter(res,"constellation");
});

router.get("/constellation", (req, res) => {
    data.getResponseLocals(res);
    data.constellationArray = data.constellationFilter();
    data.renderResultsTemplate(res);
});

router.post("/constellation", (req, res) => {
    data.selectedConstellation = req.body.constellation;
    data.redirectRouter(res,"materials");
});

router.get("/materials", (req, res) => {
    data.getResponseLocals(res);
    data.renderResultsTemplate(res);
});

router.post("/materials", (req, res) => {
    data.selectedMaterials = req.body["piMaterial"];
    data.redirectRouter(res,"richness");
});

router.get("/richness", (req, res) => {
    data.getResponseLocals(res);
    data.cookieRichnessCheck(req, res);
});

router.post("/richness", (req, res) => {
    data.selectedRichness = Object.getOwnPropertyNames(req.body);
    data.createCookie(req, res);
    data.getResults();
    res.redirect("/results");
});

router.get("/results", (req, res) => {
    data.getResponseLocals(res);
    data.constellationArray = data.constellationFilter();
    data.cookieRichnessCheck(req, res);
});

router.post("/results", (req, res) => {
    data.selectedConstellation = req.body.constellation;
    data.selectedRichness = Object.getOwnPropertyNames(req.body);
    data.getResponseLocals(res);
    res.redirect("results");
});

module.exports = router;