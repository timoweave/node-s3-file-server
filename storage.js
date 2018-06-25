const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("./config.js");
const uuidv4 = require("uuid/v4");

aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

const s3 = new aws.S3();

const add_s3_files = (req, resp, next) => {
  const storage = multerS3({
    s3,
    bucket: config.bucket,
    contentType: (req, file, cb) => {
      cb(null, file.mimetype);
    },
    metadata: (req, file, cb) => {
      cb(null, {...file});
    },
    key: (req, file, cb) => {
      cb(null, uuidv4());
    },
  });

  const upload = multer({storage}).array("uploads", config.maxUploadCount);
  upload(req, resp, next);
};

const get_s3_file = (req, resp) => {
  const params = {
    Bucket: config.bucket,
    Key: req.params.id,
  };

  s3.headObject(params, (err, data) => {
    if (err) {
      resp.json({error: `cannot find file ${req.params.id}`});
      return;
    }
    const {Metadata: {originalname}} = data;
    s3
      .getObject(params)
      .createReadStream()
      .pipe(resp.attachment(originalname));
  });
};

const list_s3_ids = (req, resp, next) =>
  s3.listObjects(
    {
      Bucket: config.bucket,
      MaxKeys: 50,
    },
    (err, data) => {
      if (err) {
        next(err);
        return;
      }
      const metadata_promise = data.Contents.map(
        ({Key, Size}) =>
          new Promise((resolve, reject) =>
            s3.headObject({Bucket: config.bucket, Key}, (err, data) => {
              if (err) {
                reject(err);
              } else resolve({Key, Size, ...data.Metadata});
            }),
          ),
      );
      Promise.all(metadata_promise).then(values => {
        resp.ids = values;
        next();
      });
    },
  );

const list_s3_id = (req, resp, next) =>
  s3.getObject({Bucket: config.bucket, Key: req.params.id}, (err, data) => {
    if (err) {
      next(err);
    } else {
      resp.id = {Key: req.params.id, ...data.Metadata};
      next();
    }
  });

const delete_s3_file = (req, resp, next) =>
  s3.deleteObject(
    {
      Bucket: config.bucket,
      Key: req.params.id,
    },
    (err, data) => {
      if (err) {
        next(err);
        return;
      }
      resp.ok = true;
      next();
    },
  );

module.exports = {
  add_s3_files,
  get_s3_file,
  list_s3_id,
  list_s3_ids,
  delete_s3_file,
};
