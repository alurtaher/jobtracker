const AWS = require('aws-sdk');
require('dotenv').config();
function uploadToS3(data, fileName) {

  let s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  var params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3res) => {
        if (err) {
            reject(err)
        }
        else {
            resolve(s3res.Location);
        }
    });
  })
}

module.exports = uploadToS3;