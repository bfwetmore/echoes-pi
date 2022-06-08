const express = require("express");
const cookieParser = require("cookie-parser");
const mainRoutes = require("./router/index");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/static", express.static("stylesheets"));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.use("/", mainRoutes);
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(
    /**
     * Express Error Handler
     * @param {Object} err error
     * @param {Object} req request
     * @param {Object} res response
     * @param {Object} next next
     */
        // eslint-disable-next-line no-unused-vars
    (err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
