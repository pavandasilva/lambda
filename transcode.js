'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const { basename, extname } = require('path');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

module.exports.handle = async ({Records: records}, context) => {
  try{
    await Promise.all(records.map(async record => {
      const { key } = record.s3.object;

      const video = await S3.getObject({
        Bucket: process.env.bucket,
        Key: key,
      }).promise();

      ffmpeg(video)
      .on('filenames', function(filenames) {
          console.log('screenshots are ' + filenames.join(', '));   
      })
      .on('end', async function() {
          console.log('screenshots were saved');
          const response = await s3.putObject({
            Body: fs.createReadStream('thumbnails/1.png'),
            Bucket: process.env.bucket,
            ContentType: 'image/png',
            Key: `compressed/${basename(key, extname(key))}.png`
          }).promise();
    
          files.push(response);
          return {
            statusCode: 301,
            body: files,
          }
      })
      .on('error', function(err) {
          console.log('an error happened: ' + err.message);
      })
      .takeScreenshots({ count: 1, size: '1280x720', filename: '1' }, "thumbnails/");
    }));
  } catch(err){
    return {
      statusCode: 501,
      body: err,
    }
  }
}