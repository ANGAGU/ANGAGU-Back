import AWS from 'aws-sdk';
import shortId from 'shortid';
import multerS3 from 'multer-s3';
import multer from 'multer';
import { awsConfig } from '../config.json';

const s3 = new AWS.S3({
  accessKeyId: awsConfig.keyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

export const imageStorage = multerS3({
  s3,
  bucket: 'angagu',
  key: (req, file, cb) => {
    const name = shortId.generate();
    if (file.fieldname === 'product_ar') {
      cb(null, `product/ar/${name.toString()}`);
    } else if (file.fieldname === 'product_image') {
      cb(null, `product/productImages/${name.toString()}`);
    } else if (file.fieldname === 'desc_image') {
      cb(null, `product/desc/${name.toString()}`);
    } else {
      cb(null, `product/thumb/${name.toString()}`);
    }
  },
});

export const imageUpload = multer({
  storage: imageStorage,
});

export const fileUpload = imageUpload.fields([
  {
    name: 'product_ar', maxCount: 1,
  },
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

export interface s3Object {
  Key: string,
}

export const deleteFile = (objects:Array<s3Object>):any => {
  const params = {
    Bucket: 'angagu',
    Delete: {
      Objects: objects,
    },
  };
  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
