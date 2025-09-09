// const AWS = require('aws-sdk');
// require('dotenv').config();
// function uploadToS3(data, fileName) {

//   let s3Bucket = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   });

//   var params = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: fileName,
//     Body: data,
//     ACL: "public-read",
//   };
//   return new Promise((resolve, reject) => {
//     s3Bucket.upload(params, (err, s3res) => {
//         if (err) {
//             reject(err)
//         }
//         else {
//             resolve(s3res.Location);
//         }
//     });
//   })
// }

// module.exports = uploadToS3;

const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const path = require("path");
require("dotenv").config();

// Configure AWS SDK v2
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;

// File filter for PDF, DOC, DOCX
function fileFilter(req, file, cb) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."), false);
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
      const fileName = `${Date.now()}_${baseName}${ext}`;
      cb(null, fileName);
    },
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "coverLetter", maxCount: 1 },
]);
