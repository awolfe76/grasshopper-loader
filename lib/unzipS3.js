'use strict';
var s3Auth = require('s3-querystring-auth');

function unzipS3(bucket, resource, profile, cb){
  var queryString = s3Auth(bucket, resource, profile);
  return cb(null, '/vsizip/vsicurl/' + queryString);
}

module.exports = unzipS3;
