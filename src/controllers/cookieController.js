class cookie
{
  /**
   * Create cookies for checkbox memory.
   * @param req
   * @param res
   */
   static createRichnessCookie(req, res) {
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
   static getCookies(req) {
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
   static createArray(req) {
    let cookieObject = cookie.getCookies(req);
    let cookieArray = Object.keys(cookieObject).filter(
      (key) => cookieObject[key]
    );
    return cookieArray.map((element) => {
      return (
        element.charAt(0).toUpperCase() + element.substring(1).toLowerCase()
      );
    });
  }

  /**
   * Check POST body for most recent Checkmarks before using the cookies.
   * If true converts values to an object.
   * @param req
   * @param {array} richnessBody
   * @returns {object}
   */
   static checkRichness(req, richnessBody) {
    let richnessCookie = {};
    if (richnessBody) {
      richnessBody.forEach((key) => (richnessCookie[key.toLowerCase()] = true));
      return richnessCookie;
    }
    return cookie.getCookies(req);
  }
}

export default cookie;
