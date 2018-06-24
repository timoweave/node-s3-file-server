const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express.Router();

const uploads = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./tmp"),
  }),
});

app.post("/", uploads.array("uploads", 10), (req, resp) => {
  console.log({files: req.files, body: req.body});
  resp.json({file_ids: req.files.map(f => f.filename)});
});

app.get("/:id", (req, resp) => {
  resp.download(`./tmp/${req.params.id}`);
});

app.delete("/:id", (req, resp) => {
  resp.send(403);
});

app.get("/", (req, resp) => {
  fs.readdir("./tmp", (err, files) => {
    resp.json({file_ids: files});
  });
});

module.exports = app;
