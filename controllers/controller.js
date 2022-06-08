const dataManager = require("../data/data-manager");
const cookie = require("./cookieController");

/**
 * Control router data to render the next template in the process.
 * @param req
 * @param res
 * @param template
 */
function getResponse(req, res, template) {
  const selection = buildSelection(req);
  buildTemplateVariables(res, selection, cookie.getCookies(req));
  renderTemplate(res, selection.region, template);
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
 * @param {array} richnessArray
 */
function buildResults(req, res, richnessArray) {
  const selection = buildSelection(req, richnessArray);
  const results = dataManager.generateResults(selection);
  results.sort((a, b) => b["Output"] - a["Output"]);

  buildTemplateVariables(
    res,
    selection,
    cookie.checkRichness(req, richnessArray)
  );
  renderTemplate(res, selection.region, "result-builder", results);
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
 * Variables for Template access
 * @param res
 * @param {object} selection User selections.
 * @param {string} selection.region
 * @param {string} selection.constellation
 * @param {string} selection.material
 * @param {object} richness
 */
function buildTemplateVariables(res, selection, richness) {
  res.locals.region = selection.region;
  res.locals.constellation = selection.constellation;
  res.locals.material = selection.material;
  res.locals.richness = richness;
}

/**
 * Rebuild template with new client selection
 * @param res
 * @param {string} region
 * @param {string} template Template to render by.
 * @param {option? : Object} results optional
 */
function renderTemplate(res, region, template, results) {
  res.render(template ? template : "region", {
    regionArray: dataManager.generateRegionList(),
    materialsArray: dataManager.generateMaterialList(),
    selectedResults: results,
    constellationArray: dataManager.constellationFilter(region),
  });
}

module.exports = {
  rebuildResults: buildResults,
  renderTemplate,
  getResponse,
  getResults,
};
