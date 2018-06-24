const express = require("express");
const multer = require("multer");
const body_parser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");

const uploads = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./tmp"),
  }),
});

const app = express();

app.use(body_parser.json());
app.use(morgan("dev"));

app.post("/uploads", uploads.array("uploads", 10), (req, resp) => {
  console.log({files: req.files, body: req.body});
  resp.json({file_ids: req.files.map(f => f.filename)});
});

app.get("/uploads/:id", (req, resp) => {
  resp.download(`./tmp/${req.params.id}`);
});

app.delete("/uploads/:id", (req, resp) => {
  resp.send(403);
});

app.get("/uploads/", (req, resp) => {
  fs.readdir("./tmp", (err, files) => {
    resp.json({file_ids: files});
  });
});

app.listen(8001, () => {
  console.log(`listening on http://localhost:8001`);
});
