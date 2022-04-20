const express = require("express");
let piData = require("./echoesPI.json");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.set("view engine", "pug");

let constellationArray;
let materialsArray = getMaterials();
let regionArray = regionFilter();
let selectedRegion;
let selectedConstellation;
let selectedMaterials;
let results;
let selectedRichness;

function regionFilter() {
  let set = new Set();
  piData.forEach((planetObject) => {
    set.add(planetObject["Region"]);
  });
  return [...set].sort();
}

function constellationFilter() {
  let set = new Set();
  piData.forEach((planetObject) => {
    if (planetObject["Region"] === selectedRegion) {
      set.add(planetObject["Constellation"]);
    }
  });
  return [...set].sort();
}

function filterAnyConstellation(systemObject, constellation) {
  if (selectedConstellation === "All") {
    return true;
  }
  return systemObject["Constellation"] === constellation;
}

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

function getMaterials() {
  let set = new Set();
  piData.forEach((systemObject) => {
    set.add(systemObject["Resource"]);
  });
  return [...set].sort();
}

function getResponseLocals(res) {
  res.locals.region = selectedRegion;
  res.locals.constellation = selectedConstellation;
  res.locals.material = selectedMaterials;
  res.locals.richness = selectedRichness;
}

function renderResultsTemplate(res) {
  res.render("result-builder", {
    regionArray,
    materialsArray,
    selectedResults: results,
    constellationArray,
  });
}

function autoRefreshResults(res, path) {
  if (results) {
    results = filterByRichness(
      selectedRichness,
      selectedRegion,
      selectedMaterials,
      selectedConstellation
    );
    return res.redirect("results");
  }
  res.redirect(path);
}

function createCookie(req, res) {
  res.cookie("Poor", req.body["Poor"]);
  res.cookie("Medium", req.body["Medium"]);
  res.cookie("Rich", req.body["Rich"]);
  res.cookie("Perfect", req.body["Perfect"]);
}

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

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  renderResultsTemplate(res);
});

app.post("/", (req, res) => {
  selectedRegion = req.body.region;
  if (results) {
    selectedConstellation = undefined;
  }
  autoRefreshResults(res,"constellation");
});

app.get("/constellation", (req, res) => {
  getResponseLocals(res);
  constellationArray = constellationFilter();
  renderResultsTemplate(res);
});

app.post("/constellation", (req, res) => {
  selectedConstellation = req.body.constellation;
  autoRefreshResults(res,"materials");
});

app.get("/materials", (req, res) => {
  getResponseLocals(res);
  renderResultsTemplate(res);
});

app.post("/materials", (req, res) => {
  selectedMaterials = req.body["piMaterial"];
  autoRefreshResults(res,"richness");
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
  getResults();
  cookieRichnessCheck(req, res);
});

app.post("/results", (req, res) => {
  selectedConstellation = req.body.constellation;
  selectedRichness = Object.getOwnPropertyNames(req.body);
getResults();
  getResponseLocals(res);
  res.redirect("results");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started on Port 3000");
});
