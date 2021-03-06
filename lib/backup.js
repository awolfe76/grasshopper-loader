var fs = require('fs-extra');
var path = require('path');
var pump = require('pump');
var zlib = require('zlib');
var jsonToCsv = require('./jsonToCsv');
var UploadStream = require('./UploadStream');

module.exports = function(options, stream, record, callback){
  if(options.backupBucket) var uploadStream = new UploadStream(options.backupBucket, options.profile);

  if(options.backupBucket && !options.backupDirectory){
    options.backupDirectory = '.';
  }

  if(!options.backupDirectory) return callback(new Error('Must provide a backup bucket and/or directory to backup data.'));

  var endfile = path.join(options.backupDirectory, record.name + '.csv.gz');
  var csvStream = jsonToCsv();
  var zipStream = zlib.createGzip();
  var destStream;

  if(options.backupBucket){
    destStream = uploadStream.stream(endfile);
    record._retrieverOutput = destStream;
  }else{
    destStream = fs.createOutputStream(endfile);
    record._retrieverOutput = endfile;
  }

  //don't close stream on backup failure
  stream.pipe(csvStream);

  pump(csvStream, zipStream, destStream, callback);
};
