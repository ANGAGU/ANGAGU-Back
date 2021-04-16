import AWS from 'aws-sdk';
import multerS3 = require('multer-s3');
import multer = require('multer');

const s3 = new AWS.S3();

export const imageStorage = multerS3({
  s3,
  bucket: 'angagu',
  key: (req, file, cb) => {
    if (file.fieldname === 'product_image') {
      cb(null, `productImages/${Date.now().toString()}`);
    } else if (file.fieldname === 'desc_image') {
      cb(null, `descriptionImages/${Date.now().toString()}`);
    } else {
      cb(null, `thumbImages/${Date.now().toString()}`);
    }
  },
});

export const imageUpload = multer({
  storage: imageStorage,
});

export const fileUpload = imageUpload.fields([
  {
    name: 'product_image', maxCount: 20,
  },
  {
    name: 'desc_image', maxCount: 1,
  },
  {
    name: 'thumb_image', maxCount: 1,
  },
]);
