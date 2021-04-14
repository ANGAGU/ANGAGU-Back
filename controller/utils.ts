import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { jwtSecret } from '../config.json';

export interface User {
  id:number;
  type:string;
  email:string;
  birth:Date;
  phoneNumber:string;
}

export interface ProductImage {
  productId: number,
  imageUrl: string,
  imageOrder: number,
}

export interface Product {
  id: number,
  companyId: number,
  descriptionUrl: string,
  thumbUrl: string,
  objectUrl: string,
  description: string,
  name: string,
  price: string,
  stock: number,
  sellCount: number,
  viewCount: number,
  deliveryCharge: number,
  freeDeliveryCondition?: string,
  isApprove: number,
  createTime: Date,
  updateTime: Date,
  images: Array<ProductImage>,
}

function jwtSignUser(user:User):string {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign({ data: user }, jwtSecret, {
    expiresIn: ONE_WEEK,
  });
}

function jwtVerify(token:string):any {
  try {
    const decode = jwt.verify(token, jwtSecret);
    return decode;
  } catch {
    return {};
  }
}

function isEmail(asValue: string):boolean {
  const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return regExp.test(asValue);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

export {
  jwtSignUser,
  jwtVerify,
  isEmail,
  storage,
};
