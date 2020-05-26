const path = require('path')
const uuid = require("uuid");
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const {FileFilters}= require('./Filters');

const s3 = new aws.S3({
	accessKeyId: 'AKIA5CHJSW7U6K4SDATG',
	secretAccessKey: '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',
	Bucket: 'news-bucket-5986'
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "news-bucket-5986",
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, "users/"+uuid.v4() + path.extname(file.originalname))
      }
    }),
    fileFilter:FileFilters
  });
  
  module.exports= upload;