const dataManager = require("./data/data-manager");

let selectedRegion;
let selectedConstellation;
let selectedMaterials;
let results;
let selectedRichness;

/**
 * Variables for Template access
 * @param res
 */
function buildTemplateVariables(
  res,
  region,
  constellation,
  material,
  richness
) {
  res.locals.region = region;
  res.locals.constellation = constellation;
  res.locals.material = material;
  res.locals.richness = richness;
  renderResultsTemplate(res, region, richness);
}

/**
 * Rebuild template with new client selection
 * @param res
 * @param region
 */
function renderResultsTemplate(res, region, richness) {
  res.render("result-builder", {
    regionArray: dataManager.regionFilter(),
    materialsArray: dataManager.materialFilter(),
    selectedResults: results,
    constellationArray: dataManager.constellationFilter(region),
    richness
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
function cookieRichnessCheck(req) {
  let poor = req.cookies["Poor"];
  let medium = req.cookies["Medium"];
  let rich = req.cookies["Rich"];
  let perfect = req.cookies["Perfect"];

  if (poor || medium || rich || perfect) {
    poor = poor === "on";
    medium = medium === "on";
    rich = rich === "on";
    perfect = perfect === "on";
  }
  return [poor, medium, rich, perfect];
}

function selectRegion(req, res) {
  if (selectedConstellation) {
    selectedConstellation = undefined;
  }
  let region = req.body["region"];
  if (!region) {
    region = req.query.region;
  }
  buildTemplateVariables(res, region);
}

function selectConstellation(req, res) {
  const constellation = req.body["constellation"];
  const region = req.query.region;
  return !results
    ? buildTemplateVariables(res, region, constellation)
    : getResults(res);
}

function selectMaterials(req, res) {
  const material = req.body["piMaterial"];
  const region = req.query.region;
  const constellation = req.query.region;
  const richness = cookieRichnessCheck(req);
  return !results ? buildTemplateVariables(res, region, constellation, material, richness) : getResults(res);
}

function selectRichness(req, res) {
  selectedRichness = Object.getOwnPropertyNames(req.body);
  createCookie(req, res);
  getResults(res);
}

/**
 * Builds Initial results
 */
function getResults(res) {
  results = dataManager.filterByRichness(
    selectedRichness,
    selectedRegion,
    selectedMaterials,
    selectedConstellation
  );
  results.sort((a, b) => b["Output"] - a["Output"]);
  res.redirect("/results");
}

module.exports = {
  renderResultsTemplate,
  selectRegion,
  selectConstellation,
  selectMaterials,
  cookieRichnessCheck,
  selectRichness,
};
