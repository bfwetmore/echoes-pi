const dataManager = require("../data/data-manager");
const cookie = require("./cookieController");

/**
 * Gets the regions to render to the template.
 * @param res
 */
function getRegion(res) {
  const templateVariables = {
    regionArray: dataManager.generateRegionList(),
  };
  renderTemplate(res, "region", templateVariables);
}

/**
 * Gets the Constellations based on region selection, to render to the template.
 * @param req
 * @param res
 */
function getConstellations(req, res) {
  const selection = buildSelection(req);
  const templateVariables = {
    region: selection.region,
    regionArray: dataManager.generateRegionList(),
    constellationArray: dataManager.constellationFilter(selection.region),
  };
  renderTemplate(res, "constellation", templateVariables);
}

/**
 * Gets the Materials to render to the template.
 * @param req
 * @param res
 */
function getMaterials(req, res) {
  const selection = buildSelection(req);
  const templateVariables = {
    region: selection.region,
    constellation: selection.constellation,
    regionArray: dataManager.generateRegionList(),
    constellationArray: dataManager.constellationFilter(selection.region),
    materialsArray: dataManager.generateMaterialList(),
  };
  renderTemplate(res, "material", templateVariables);
}

/**
 * Gets the Richness to render to the template. Uses Cookies to remember user previous selection.
 * @param req
 * @param res
 */
function getRichness(req, res) {
  const selection = buildSelection(req);
  const templateVariables = {
    region: selection.region,
    constellation: selection.constellation,
    material: selection.material,
    regionArray: dataManager.generateRegionList(),
    constellationArray: dataManager.constellationFilter(selection.region),
    materialsArray: dataManager.generateMaterialList(),
    richness: cookie.getCookies(req),
  };
  renderTemplate(res, "richness", templateVariables);
}

/**
 * Get initial results, creates newly selected richness cookies.
 * @param req
 * @param res
 */
function getResults(req, res) {
  cookie.createRichnessCookie(req, res);
  const richnessArray = Object.getOwnPropertyNames(req.body);
  buildResults(req, res, richnessArray);
}


/**
 * Builds initial results and rebuilds resubmitted Data.
 * @param req
 * @param res
 * @param {option? : array} richnessArray
 */
function buildResults(req, res, richnessArray) {
  const selection = buildSelection(req, richnessArray);
  const results = dataManager.generateResults(selection);
  results.sort((a, b) => b["Output"] - a["Output"]);
  const templateVariables = {
    region: selection.region,
    constellation: selection.constellation,
    material: selection.material,
    regionArray: dataManager.generateRegionList(),
    constellationArray: dataManager.constellationFilter(selection.region),
    materialsArray: dataManager.generateMaterialList(),
    richness: cookie.checkRichness(req, richnessArray),
    selectedResults: results,
  };
  renderTemplate(res, "result-builder", templateVariables);
}

/**
 * Construct an object of users Selections.
 * @param req
 * @param {option? : Array} richness optional.
 * @returns {object} of selection(s).
 */
function buildSelection(req, richness) {
  const material = req.body.material ? req.body.material : req.query.material;
  const region = req.body.region ? req.body.region : req.query.region;
  const constellation = req.body.region
    ? undefined
    : req.body.constellation
    ? req.body.constellation
    : req.query.constellation;

  const richnessArray = richness ? richness : cookie.createArray(req);
  return { material, region, constellation, richnessArray };
}


/**
 * Rebuild template with new client selection.
 * @param res
 * @param {string} templateName
 * @param {object} templateData Template to render by.
 */
function renderTemplate(res, templateName, templateData) {
  res.render(templateName, templateData);
}

module.exports = {
  getRegion,
  getConstellations,
  getMaterials,
  getRichness,
  getResults,
  buildResults,
  buildSelection,
};
