const dataManager = require("./data/data-manager");

/**
 * Variables for Template access
 * @param res
 */
function buildTemplateVariables(
  template,
  res,
  region,
  constellation,
  material,
  richness,
  results
) {
  res.locals.region = region;
  res.locals.constellation = constellation;
  res.locals.material = material;
  res.locals.richness = richness;
  renderResultsTemplate(res, region, results, template);
}

/**
 * Rebuild template with new client selection
 * @param res
 * @param region
 */
function renderResultsTemplate(res, region, results, template) {
    res.render(template ? template : "region", {
        regionArray: dataManager.regionFilter(),
        materialsArray: dataManager.materialFilter(),
        selectedResults: results,
        constellationArray: dataManager.constellationFilter(region),
    });
}

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
    let cookieArray = Object.keys(cookieObject).filter((key) => cookieObject[key]);

    return cookieArray.map((element) => {
        return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
    });
}

function selectRegion(req, res) {
    let region = req.body["region"];
    buildTemplateVariables("constellation", res, region);
}

function selectConstellation(req, res) {
    const constellation = req.body.constellation;
    const region = req.query.region;
    return buildTemplateVariables("material", res, region, constellation);
}

function selectMaterials(req, res) {
    const material = req.body.material;
    const region = req.query.region;
    const constellation = req.query.constellation;
    const richness = cookieRichnessCheck(req);
    return buildTemplateVariables(
        "richness",
        res,
        region,
        constellation,
        material,
        richness
    );
}

function selectRichness(req, res) {
    createRichnessCookie(req, res);
    const richness = Object.getOwnPropertyNames(req.body);
    return getResults(req, res, richness);
}

function getRichnessCheckboxState(req, richnessBody) {
    let richnessCookie = {};
    if (richnessBody) {
        richnessBody.forEach(key => richnessCookie[key.toLowerCase()] = true);
        return richnessCookie;
    }
    return cookieRichnessCheck(req);
}

/**
 * Builds Initial results
 */
function getResults(req, res, richnessBody) {
    const material = req.body.material ? req.body.material : req.query.material;
    const region = req.body.region ? req.body.region : req.query.region;
    const constellation = req.body.region ? undefined : req.body.constellation
        ? req.body.constellation
        : req.query.constellation;

    const richness = richnessBody ? richnessBody : getCookieArray(req);

    const results = dataManager.filterByRichness(
        richness,
        region,
        material,
        constellation
    );
    results.sort((a, b) => b["Output"] - a["Output"]);

    return buildTemplateVariables(
        "result-builder",
        res,
        region,
        constellation,
        material,
        getRichnessCheckboxState(req, richnessBody),
        results
    );
}

module.exports = {
  getResults,
  renderResultsTemplate,
  selectRegion,
  selectConstellation,
  selectMaterials,
  selectRichness,
};
