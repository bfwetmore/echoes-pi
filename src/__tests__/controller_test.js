describe("main_controller_buildSelection_method", () => {
  const buildSelection = require("../controllers/controller").buildSelection;
  test("buildSelection_WhenBodyIsMaterial_MaterialBodyIsUsed", () => {
    const request = {
      body: {
        material: "Coolant",
      },
      query: {
        constellation: "XHQ-R",
        region: "Providence",
        material: "Coolant",
      },
    };
    const richness = ["rich", "poor"];
    expect(buildSelection(request, richness)).toStrictEqual({
      material: "Coolant",
      region: "Providence",
      constellation: "XHQ-R",
      richnessArray: ["rich", "poor"],
    });
  });

  test("buildSelection_WhenBodyIsRegion_RegionBodyIsUsed", () => {
    const request = {
      body: {
        region: "Providence",
      },
      query: {
        constellation: "XHQ-R",
        region: "Providence",
        material: "Coolant",
      },
    };
    const richness = ["rich", "poor"];
    expect(buildSelection(request, richness)).toStrictEqual({
      material: "Coolant",
      region: "Providence",
      constellation: undefined,
      richnessArray: ["rich", "poor"],
    });
  });

  test("buildSelection_WhenBodyIsConstellation_Constellation_Body_Is_Used", () => {
    const request = {
      body: {
        constellation: "XHQ-R",
      },
      query: {
        constellation: "PPQ-R",
        region: "Providence",
        material: "Coolant",
      },
    };
    const richness = ["rich", "poor"];
    expect(buildSelection(request, richness)).toStrictEqual({
      material: "Coolant",
      region: "Providence",
      constellation: "XHQ-R",
      richnessArray: ["rich", "poor"],
    });
  });

  test("buildSelection_WhenNoRichnessParameterPass_UsesCookies", () => {
    const request = {
      body: {
        constellation: "XHQ-R",
      },
      query: {
        region: "Providence",
        material: "Coolant",
      },
      cookies: {
        Perfect: "on",
        Poor: "on",
        Medium: "on",
        Rich: "on",
      },
    };

    expect(buildSelection(request)).toStrictEqual({
      material: "Coolant",
      region: "Providence",
      constellation: "XHQ-R",
      richnessArray: ["Poor", "Medium", "Rich", "Perfect"],
    });
  });
});

describe("cookie_controller", () => {
  const cookies = require("../controllers/cookieController");
  test("getCookies_WhenAllRichnessCookiesAreOn_ObjectOfKeysAllTrue", () => {
    const request = {
      cookies: {
        Perfect: "on",
        Poor: "on",
        Medium: "on",
        Rich: "on",
      },
    };

    expect(cookies.getCookies(request)).toStrictEqual({
      poor: true,
      medium: true,
      rich: true,
      perfect: true,
    });
  });
  test("checkRichness_WhenRichnessBodyParameterIsPassed_BodyIsReturnedAsObject", () => {
    const request = {
      cookies: {
        Perfect: "on",
        Poor: "on",
        Medium: "on",
        Rich: "on",
      },
    };
    const richnessBody = ["Rich", "Perfect"];
    expect(cookies.checkRichness(request, richnessBody)).toStrictEqual({
      rich: true,
      perfect: true,
    });
  });
});
