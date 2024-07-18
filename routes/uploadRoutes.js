const AWS = require('aws-sdk');
const uuid = require('uuid').v1;
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    credentials: {
      accessKeyId: keys.accessKeyId,
      secretAccessKey: keys.secretAccessKey,
    },
    region: '<enter your aws s3 bucket region>',
  });

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const fileType = req.query.fileType;
        const fileExt = fileType.substring(fileType.indexOf('/')+1);

        const key = `${req.user.id}/${uuid()}.${fileExt}`;

        s3.getSignedUrl('putObject', {
            Bucket: '<enter your aws s3 bucket name>',
            ContentType: 'image/jpeg',
            Key: key
        }, 
        (err, url) => {res.send({key, url});}
        )
    })
}

