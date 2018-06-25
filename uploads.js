const express = require("express");
const path = require("path");
const {
  add_s3_files,
  get_s3_file,
  list_s3_id,
  list_s3_ids,
  delete_s3_file,
} = require("./storage.js");

const router = express.Router();

router.post("/", add_s3_files, (req, resp) => {
  resp.json({ids: req.files.map(f => f.key)});
});

router.delete("/:id", delete_s3_file, (req, resp) => {
  resp.send(200);
});

router.get("/keys", list_s3_ids, (req, resp) => {
  resp.send(resp.ids.map(i => i.Key).join("\n"));
});

router.get("/:id/content", get_s3_file);

router.get("/:id", list_s3_id, (req, resp) => {
  resp.json({id: resp.id});
});

router.get("/", list_s3_ids, (req, resp) => {
  resp.json({ids: resp.ids});
});

module.exports = router;
