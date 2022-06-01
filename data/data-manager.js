const piData = require("../echoesPI.json");

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
  if (constellation === "All") {
    return true;
  }
  return planetObject["Constellation"] === constellation;
}

module.exports = {
  constellationFilter,
  regionFilter,
  materialFilter,
  filterByRichness,
};
