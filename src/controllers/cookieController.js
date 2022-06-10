/**
 * Create cookies for checkbox memory.
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
 * Check for user cookies on checkboxes
 * @param req
 * @returns {*} Renders page based on cookies
 * Otherwise leaves checkboxes unchecked.
 */
function getCookies(req) {
  return {
    poor: req.cookies["Poor"] === "on",
    medium: req.cookies["Medium"] === "on",
    rich: req.cookies["Rich"] === "on",
    perfect: req.cookies["Perfect"] === "on",
  };
}

/**
 * Create an array of current 'truthy' cookies.
 * @param req
 * @returns {array}
 */
function createArray(req) {
  let cookieObject = getCookies(req);
  let cookieArray = Object.keys(cookieObject).filter(
    (key) => cookieObject[key]
  );
  return cookieArray.map((element) => {
    return element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
  });
}

/**
 * Check POST body for most recent Checkmarks before using the cookies.
 * If true converts values to an object.
 * @param req
 * @param {array} richnessBody
 * @returns {object}
 */
function checkRichness(req, richnessBody) {
  let richnessCookie = {};
  if (richnessBody) {
    richnessBody.forEach((key) => (richnessCookie[key.toLowerCase()] = true));
    return richnessCookie;
  }
  return getCookies(req);
}

module.exports = {
  createRichnessCookie,
  getCookies,
  createArray,
  checkRichness,
};
