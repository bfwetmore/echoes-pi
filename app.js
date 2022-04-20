const express = require("express");
let piData = require("./echoesPI.json");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

let materialsArray = materialFilter();
let constellationArray;
let regionArray = regionFilter();
let selectedRegion;
let selectedConstellation;
let selectedMaterials;
let results;
let selectedRichness;

/**
 * Filters for a list of Regions
 * @returns {array}
 */
function regionFilter() {
  let set = new Set();
  piData.forEach((planetObject) => {
    set.add(planetObject["Region"]);
  });
  return [...set].sort();
}

/**
 * Filters for a list of Constellations
 * @returns {array}
 */
function constellationFilter() {
  let set = new Set();
  piData.forEach((planetObject) => {
    if (planetObject["Region"] === selectedRegion) {
      set.add(planetObject["Constellation"]);
    }
  });
  return [...set].sort();
}

/**
 * Filters for a list of Materials
 * @returns {array}
 */
function materialFilter() {
  let set = new Set();
  piData.forEach((systemObject) => {
    set.add(systemObject["Resource"]);
  });
  return [...set].sort();
}

/**
 * Filter Richness selection for Results
 * @param richness {array} Selected Richness(s)
 * @param region {string} Selected region
 * @param material {string} Selected material
 * @param constellation {string} Selected constellation
 * @returns {any[]}
 */
function filterByRichness(richness, region, material, constellation) {
  let set = new Set();
  piData.forEach((systemObject) => {
    if (
        systemObject["Region"] === region &&
        systemObject["Resource"] === material &&
        filterAnyConstellation(systemObject, constellation)
    ) {
      for (let i = 0; i < richness.length; i++) {
        if (systemObject["Richness"] === richness[i]) {
          set.add(systemObject);
        }
      }
    }
  });
  return [...set];
}

/**
 * Checks if All Constellations was selected
 * @param planetObject {object}
 * @param constellation {string} Selected Constellation
 * @returns {boolean}
 */
function filterAnyConstellation(planetObject, constellation) {
  if (selectedConstellation === "All") {
    return true;
  }
  return planetObject["Constellation"] === constellation;
}

/**
 * Variables for Template access
 * @param res
 */
function getResponseLocals(res) {
  res.locals.region = selectedRegion;
  res.locals.constellation = selectedConstellation;
  res.locals.material = selectedMaterials;
  res.locals.richness = selectedRichness;
}

/**
 * Rebuild template with new client selection
 * @param res
 */
function renderResultsTemplate(res) {
  res.render("result-builder", {
    regionArray,
    materialsArray,
    selectedResults: results,
    constellationArray,
  });
}

/**
 * Creates Cookies for Checkboxes
 * @param req
 * @param res
 */
function createCookie(req, res) {
  res.cookie("Poor", req.body["Poor"]);
  res.cookie("Medium", req.body["Medium"]);
  res.cookie("Rich", req.body["Rich"]);
  res.cookie("Perfect", req.body["Perfect"]);
}

/**
 * Checks for cookies on checkboxes, and applies checks to last cookie state
 * @param req
 * @param res
 * @returns {*} Renders page based on cookies
 * Otherwise leaves checkboxes unchecked.
 */
function cookieRichnessCheck(req, res) {
  let poor = req.cookies['Poor'];
  let medium = req.cookies['Medium'];
  let rich = req.cookies['Rich'];
  let perfect = req.cookies['Perfect'];

  if (poor || medium || rich || perfect) {
    poor = poor === "on";
    medium = medium === "on";
    rich = rich === "on";
    perfect = perfect === "on";
    return res.render("result-builder", {
      regionArray,
      materialsArray,
      selectedResults: results,
      constellationArray,
      poor,
      medium,
      rich,
      perfect,
    });
  }
  renderResultsTemplate(res);
}

/**
 * Checks if results already exists, modifies them then redirects to result.
 * @param res
 * @param path
 * @returns {*} Redirect directly to results or next path.
 */
function redirectRouter(res, path) {
  if (results) {
    results = filterByRichness(
        selectedRichness,
        selectedRegion,
        selectedMaterials,
        selectedConstellation
    );
    results.sort((a, b) => {
      return b["Output"] - a["Output"];
    });
    return res.redirect("results");
  }
  res.redirect(path);
}

/**
 * Builds Initial results
 */
function getResults(){
  results = filterByRichness(
      selectedRichness,
      selectedRegion,
      selectedMaterials,
      selectedConstellation
  );
  results.sort((a, b) => {
    return b["Output"] - a["Output"];
  });
}

app.get("/", (req, res) => {
  renderResultsTemplate(res);
});

app.post("/", (req, res) => {
  selectedRegion = req.body.region;
  if (results) {
    selectedConstellation = undefined;
  }
  redirectRouter(res,"constellation");
});

app.get("/constellation", (req, res) => {
  getResponseLocals(res);
  constellationArray = constellationFilter();
  renderResultsTemplate(res);
});

app.post("/constellation", (req, res) => {
  selectedConstellation = req.body.constellation;
  redirectRouter(res,"materials");
});

app.get("/materials", (req, res) => {
  getResponseLocals(res);
  renderResultsTemplate(res);
});

app.post("/materials", (req, res) => {
  selectedMaterials = req.body["piMaterial"];
  redirectRouter(res,"richness");
});

app.get("/richness", (req, res) => {
  getResponseLocals(res);
  cookieRichnessCheck(req, res);
});

app.post("/richness", (req, res) => {
  selectedRichness = Object.getOwnPropertyNames(req.body);
  createCookie(req, res);
  getResults();
  res.redirect("/results");
});

app.get("/results", (req, res) => {
  getResponseLocals(res);
  constellationArray = constellationFilter();
  cookieRichnessCheck(req, res);
});

app.post("/results", (req, res) => {
  selectedConstellation = req.body.constellation;
  selectedRichness = Object.getOwnPropertyNames(req.body);
  getResponseLocals(res);
  res.redirect("results");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started on Port 3000");
});
