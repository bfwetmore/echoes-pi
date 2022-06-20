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
 * @returns {*} Object of richness cookies and the state they are in.
 */
function getRichnessCookiesObject(req) {
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
  let cookieObject = getRichnessCookiesObject(req);
  let cookieArray = Object.keys(cookieObject).filter(
    key => cookieObject[key]
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
function getRichnessObject(req, richnessBody) {
  let richnessObject = {};
  if (richnessBody) {
    richnessBody.forEach((key) => (richnessObject[key.toLowerCase()] = true));
    return richnessObject;
  }
  return getRichnessCookiesObject(req);
}

module.exports = {
  createRichnessCookie,
  getRichnessCookiesObject,
  createArray,
  getRichnessObject,
};
