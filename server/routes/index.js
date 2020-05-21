const express = require("express");
const router = express.Router();
const aws = require('aws-sdk')
const bucket = 'hatchways-hummingbird'
const config = require('../config/default.json')
const { region, accessKeyId, secretAccessKey } = config

aws.config.update({ region, accessKeyId, secretAccessKey })

router.get("/welcome", function (req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

//Sign AWS uploads
router.get('/s3/sign', (req, res) => {
  let query = (req.query)

  const s3 = new aws.S3();
  const objectName = query.objectName
  const contentType = query.contentType

  const s3Param = {
    Bucket: bucket,
    Key: objectName,
    Expires: 500,
    ContentType: contentType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Param, (err, data) => {
    if (err) {
      console.log(err)
      res.json({ success: false, error: err })
    }

    const returnData = {
      signedUrl: data,
      url: `https://${bucket}.s3.amazonaws.com/${objectName}`,
    }
    res.send({ success: true, signedUrl: data, })
  })

});



module.exports = router;
