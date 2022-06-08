const dataManager = require("./data/data-manager");

/**
 * Creates Cookies for Checkboxes
 * @param req
 * @param res
 */
function createRichnessCookie(req, res) {
  res.cookie("Poor", req.body["Poor"]);
  res.cookie("Medium", req.body["Medium"]);
  res.cookie("Rich", req.body["Rich"]);
  res.cookie("Perfect", req.body["Perfect"]);
}

/**
 * Checks for cookies on checkboxes, and applies checks to last cookie state
 * @param req
 * @returns {*} Renders page based on cookies
 * Otherwise leaves checkboxes unchecked.
 */
function cookieRichnessCheck(req) {
  return {
    poor: req.cookies["Poor"] === "on",
    medium: req.cookies["Medium"] === "on",
    rich: req.cookies["Rich"] === "on",
    perfect: req.cookies["Perfect"] === "on",
  };
}

function getCookieArray(req) {
  let cookieObject = cookieRichnessCheck(req);
  let cookieArray = Object.keys(cookieObject).filter(
    (key) => cookieObject[key]
  );

  return cookieArray.map((element) => {
    return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
  });
}

function getResponse(req, res, template) {
  const selection = buildSelection(req);
  buildTemplateVariables(res, selection, cookieRichnessCheck(req));
  renderTemplate(res, selection.region, template);
}

function getResults(req, res) {
  createRichnessCookie(req, res);
  const richness = Object.getOwnPropertyNames(req.body);
  return rebuildResults(req, res, richness);
}

function checkRichnessState(req, richnessBody) {
  let richnessCookie = {};
  if (richnessBody) {
    richnessBody.forEach((key) => (richnessCookie[key.toLowerCase()] = true));
    return richnessCookie;
  }
  return cookieRichnessCheck(req);
}

function buildSelection(req, richnessBody) {
  const material = req.body.material ? req.body.material : req.query.material;
  const region = req.body.region ? req.body.region : req.query.region;
  const constellation = req.body.region
    ? undefined
    : req.body.constellation
    ? req.body.constellation
    : req.query.constellation;

  const richness = richnessBody ? richnessBody : getCookieArray(req);
  return { material, region, constellation, richness };
}

/**
 * Builds Initial results
 */
function rebuildResults(req, res, richnessBody) {
  const selection = buildSelection(req, richnessBody);

  const results = dataManager.filterByRichness(
    selection.richness,
    selection.region,
    selection.material,
    selection.constellation
  );
  results.sort((a, b) => b["Output"] - a["Output"]);

  buildTemplateVariables(res, selection, checkRichnessState(req, richnessBody));
  renderTemplate(res, selection.region, "result-builder", results);
}

/**
 * Variables for Template access
 * @param res
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
 * @param region
 */
function renderTemplate(res, region, template, results) {
  res.render(template ? template : "region", {
    regionArray: dataManager.regionFilter(),
    materialsArray: dataManager.materialFilter(),
    selectedResults: results,
    constellationArray: dataManager.constellationFilter(region),
  });
}

module.exports = {
  rebuildResults,
  renderTemplate,
  getResponse,
  getResults,
};
