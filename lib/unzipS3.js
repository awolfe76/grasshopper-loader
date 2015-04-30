'use strict';
var s3Auth = require('s3-querystring-auth');

function unzipS3(S3, bucket, resource, profile, cb){
 S3.getBucketLocation({'Bucket':bucket},function(err, resp){
  if(err) return cb(err);
  var queryString = s3Auth(bucket, resource, resp.LocationConstraint, profile);
  return cb(null, '/vsizip/vsicurl/' + queryString);
 });
}

module.exports = unzipS3;
