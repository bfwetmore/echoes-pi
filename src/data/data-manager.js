const piData = require("./echoesPI.json");

/**
 * Construct a list of regions.
 * @returns {array}
 */
function generateRegionList() {
  let regionSet = new Set();
  piData.forEach((systemObject) => {
    regionSet.add(systemObject["Region"]);
  });
  return [...regionSet].sort();
}

/**
 * Filters by region for a list of Constellations
 *  @param {string} region
 * @returns {array}
 */
function constellationFilter(region) {
  let constellationSet = new Set();
  piData.forEach((systemObject) => {
    if (systemObject["Region"] === region) {
      constellationSet.add(systemObject["Constellation"]);
    }
  });
  return [...constellationSet].sort();
}

/**
 * Construct a list of materials
 * @returns {array}
 */
function generateMaterialList() {
  let materialSet = new Set();
  piData.forEach((systemObject) => {
    materialSet.add(systemObject["Resource"]);
  });
  return [...materialSet].sort();
}

/**
 * Take selections to filter out results.
 * @param {object} selection - Object of Selections
 * @param {string} selection.region
 * @param {string} selection.material
 * @param {string} selection.constellation
 * @param {array} selection.richnessArray
 * @returns {array [objects]} of Systems.
 */
function generateResults(selection) {
  let systemSet = new Set();
  piData.forEach((systemObject) => {
    if (
      systemObject["Region"] === selection.region &&
      systemObject["Resource"] === selection.material &&
      (selection.constellation === "All"
        ? true
        : systemObject["Constellation"] === selection.constellation)
    ) {
      for (let i = 0; i < selection.richnessArray.length; i++) {
        if (systemObject["Richness"] === selection.richnessArray[i]) {
          systemSet.add(systemObject);
        }
      }
    }
  });
  return [...systemSet];
}

module.exports = {
  constellationFilter,
  generateRegionList,
  generateMaterialList,
  generateResults,
};
