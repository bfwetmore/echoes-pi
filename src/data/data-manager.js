const piData = require("./echoesPI.json");

/**
 * Construct a list of regions.
 * @returns {array}
 */
function generateRegionList() {
  let set = new Set();
  piData.forEach((planetObject) => {
    set.add(planetObject["Region"]);
  });
  return [...set].sort();
}

/**
 * Filters by region for a list of Constellations
 *  @param {string} region
 * @returns {array}
 */
function constellationFilter(region) {
  let set = new Set();
  piData.forEach((planetObject) => {
    if (planetObject["Region"] === region) {
      set.add(planetObject["Constellation"]);
    }
  });
  return [...set].sort();
}

/**
 * Construct a list of materials
 * @returns {array}
 */
function generateMaterialList() {
  let set = new Set();
  piData.forEach((systemObject) => {
    set.add(systemObject["Resource"]);
  });
  return [...set].sort();
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
  let set = new Set();
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
          set.add(systemObject);
        }
      }
    }
  });
  return [...set];
}

module.exports = {
  constellationFilter,
  generateRegionList,
  generateMaterialList,
  generateResults,
};