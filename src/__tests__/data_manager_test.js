const dataManager = require("../data/data-manager");

describe("data-manager_tests", () => {
  test("generateRegionList_NoConditions_GenerateListOfRegions", () => {
    expect(dataManager.generateRegionList()).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
    expect(dataManager.generateRegionList()).toEqual(
      expect.arrayContaining([expect.stringContaining("Providence")])
    );
    expect(dataManager.generateRegionList().length).toBeGreaterThanOrEqual(56);
  });

  test("generateMaterialList_NoConditions_GenerateListOfMaterials", () => {
    expect(dataManager.generateMaterialList()).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
  });

  test("constellationFilter_ARegionPassedAsParameter_GenerateListOfConstellationsInRegion", () => {
    const selectedRegion = "Providence";

    expect(dataManager.constellationFilter(selectedRegion)).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
  });

  test("generateResults_PassAMockOfUserSelection_ReturnArrayOfSystemObjects", () => {
    const selection = {
      region: "Providence",
      constellation: "ZQ2-CF",
      material: "Condensates",
      richnessArray: ["Medium", "Rich", "Perfect"],
    };

    expect(dataManager.generateResults(selection)).toEqual([
      {
        Constellation: "ZQ2-CF",
        Output: 25.3,
        "Planet ID": 40236692,
        "Planet Name": "F-DTOO IV",
        "Planet Type": "Temperate",
        Region: "Providence",
        Resource: "Condensates",
        Richness: "Perfect",
        System: "F-DTOO",
      },
      {
        Constellation: "ZQ2-CF",
        Output: 17.2,
        "Planet ID": 40236739,
        "Planet Name": "5KG-PY II",
        "Planet Type": "Temperate",
        Region: "Providence",
        Resource: "Condensates",
        Richness: "Medium",
        System: "5KG-PY",
      },
    ]);
  });
});
