import dataManager from "../data/data-manager.js";
import cookie from "./cookieController.js";


export class controller {
  /**
   * Gets the regions to render to the template.
   * @param res
   */


  static getRegion(res) {
    const templateVariables = {
      regionArray: dataManager.generateRegionList(),
    };
    controller.renderTemplate(res, "region", templateVariables);
  }

  /**
   * Gets the Constellations based on region selection, to render to the template.
   * @param req
   * @param res
   */


  static getConstellations(req, res) {
    const selection = controller.buildSelection(req);
    const templateVariables = {
      region: selection.region,
      regionArray: dataManager.generateRegionList(),
      constellationArray: dataManager.constellationFilter(selection.region),
    };
    controller.renderTemplate(res, "constellation", templateVariables);
  }

  /**
   * Gets the Materials to render to the template.
   * @param req
   * @param res
   */


  static getMaterials(req, res) {
    const selection = controller.buildSelection(req);
    const templateVariables = {
      region: selection.region,
      constellation: selection.constellation,
      regionArray: dataManager.generateRegionList(),
      constellationArray: dataManager.constellationFilter(selection.region),
      materialsArray: dataManager.generateMaterialList(),
    };
    controller.renderTemplate(res, "material", templateVariables);
  }

  /**
   * Gets the Richness to render to the template. Uses Cookies to remember user previous selection.
   * @param req
   * @param res
   */


  static getRichness(req, res) {
    const selection = controller.buildSelection(req);
    const templateVariables = {
      region: selection.region,
      constellation: selection.constellation,
      material: selection.material,
      regionArray: dataManager.generateRegionList(),
      constellationArray: dataManager.constellationFilter(selection.region),
      materialsArray: dataManager.generateMaterialList(),
      richness: cookie.getCookies(req),
    };
    controller.renderTemplate(res, "richness", templateVariables);
  }

  /**
   * Get initial results, creates newly selected richness cookies.
   * @param req
   * @param res
   */


  static getResults(req, res) {
    cookie.createRichnessCookie(req, res);
    const richnessArray = Object.getOwnPropertyNames(req.body);
    controller.buildResults(req, res, richnessArray);
  }


  /**
   * Builds initial results and rebuilds resubmitted Data.
   * @param req
   * @param res
   * @param {option? : array} richnessArray
   */


  static buildResults(req, res, richnessArray) {
    const selection = controller.buildSelection(req, richnessArray);
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
    controller.renderTemplate(res, "result-builder", templateVariables);
  }

  /**
   * Construct an object of users Selections.
   * @param req
   * @param {option? : Array} richness optional.
   * @returns {object} of selection(s).
   */

  static buildSelection(req, richness) {
    const material = req.body.material ? req.body.material : req.query.material;
    const region = req.body.region ? req.body.region : req.query.region;
    const constellation = req.body.region
        ? undefined
        : req.body.constellation
            ? req.body.constellation
            : req.query.constellation;

    const richnessArray = richness ? richness : cookie.createArray(req);
    return {material, region, constellation, richnessArray};
  }


  /**
   * Rebuild template with new client selection.
   * @param res
   * @param {string} templateName
   * @param {object} templateData Template to render by.
   */

  static renderTemplate(res, templateName, templateData) {
    res.render(templateName, templateData);
  }
}
export default controller;