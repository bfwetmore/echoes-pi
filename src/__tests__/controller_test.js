describe("main controller buildSelection_method", () => {
  const buildSelection = require("../controllers/controller").buildSelection;
  test("when body is material material body is used", () => {
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

  test("when body is region, region body is used", () => {
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

  test("when body is constellation, constellation body is used", () => {
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

  test("when no richness parameter passed, uses cookies", () => {
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
  test("getCookies - when all richness cookies are on, object of keys all true", () => {
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
  test("checkRichness, when richness body parameter is passed body is returned as object", () => {
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
