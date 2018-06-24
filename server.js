const express = require("express");

const body_parser = require("body-parser");
const morgan = require("morgan");

const uploads = require("./uploads.js");

const app = express();

app.use(body_parser.json());
app.use(morgan("dev"));

app.use("/uploads", uploads);

app.listen(8001, () => {
  console.log(`listening on http://localhost:8001`);
});
