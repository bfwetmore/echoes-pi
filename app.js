const express = require("express");
let piData = require("./echoesPI.json");

const app = express();

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
  piData.forEach((data) => {
    set.add(data["Region"]);
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
  return systemObject['Constellation'] === constellation;
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

function renderResultsTemplate(res){
  res.render("results", {
    regionArray,
    materialsArray,
    selectedResults: results,
    constellationArray,
  });
}

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("results", {
    regionArray,
    materialsArray,
    selectedResults: results,
    constellationArray,
  });
});

app.post("/", (req, res) => {
  selectedRegion = req.body.region;
  res.redirect("constellation");
});

app.get("/constellation", (req, res) => {
  getResponseLocals(res);
  constellationArray = constellationFilter();
  renderResultsTemplate(res);
});

app.post("/constellation", (req, res) => {
  selectedConstellation = req.body.constellation;
  res.redirect("materials");
});

app.get("/materials", (req, res) => {
  getResponseLocals(res);
  res.render("results", {
    regionArray,
    materialsArray,
    selectedResults: results,
    constellationArray,
  });
});

app.post("/materials", (req, res) => {
  selectedMaterials = req.body["piMaterial"];
  res.redirect("/richness");
});

app.get("/richness", (req, res) => {
  getResponseLocals(res);
  res.render("results", {
    regionArray,
    materialsArray,
    selectedResults: results,
    constellationArray,
  });
});

app.post("/richness", (req, res) => {
  selectedRichness = Object.getOwnPropertyNames(req.body);
  results = filterByRichness(selectedRichness, selectedRegion, selectedMaterials, selectedConstellation);
  results.sort((a, b) => {
    return b["Output"] - a["Output"];
  });
  res.redirect("/results");
});

app.get("/results", (req, res) => {
  getResponseLocals(res);
  res.render("results", {
    regionArray,
    materialsArray,
    selectedResults: results,
    constellationArray,
  });
});

app.post("/results", (req, res) => {
  selectedConstellation = req.body.constellation;
  selectedRichness = Object.getOwnPropertyNames(req.body);
  results = filterByRichness(
    selectedRichness,
    selectedRegion,
    selectedMaterials,
    selectedConstellation
  );
  results.sort((a, b) => {
    return b["Output"] - a["Output"];
  });
  getResponseLocals(res);
  res.redirect("results");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started on Port 3000");
});