const path = require('path');
const moment = require('moment');
const uuid = require("uuid");
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const {FileFilters}= require('./Filters');

const config= require('../config');
const {ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET} = config[config['mode']]['S3'];

const s3 = new aws.S3({
	accessKeyId: ACCESS_KEY_ID,
	secretAccessKey: SECRET_ACCESS_KEY,
	Bucket: BUCKET
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        let folder= req.params.folder && req.params.folder == '1' ? 'users':'news';
        cb(null, `${folder}/${moment(new Date()).format("YYYY-MM-DD")}/${uuid.v4() + path.extname(file.originalname)}`)
      }
    }),
    fileFilter:FileFilters
  });
  
  module.exports= upload;