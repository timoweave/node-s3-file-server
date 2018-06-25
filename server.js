const express = require("express");
const body_parser = require("body-parser");
const morgan = require("morgan");
const uploads = require("./uploads.js");
const {port} = require("./config.js");

const app = express();

app.use(body_parser.json());
app.use(morgan("dev"));
app.use("/", express.static("./"));

app.use("/uploads", uploads);

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
