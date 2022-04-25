const express = require("express");
const cookieParser = require("cookie-parser");
const mainRoutes = require('./router/index');
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.use('/', mainRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started on Port 3000");
});
