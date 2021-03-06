import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.json';

export interface User {
  id:number;
  name:string;
  type:string;
  email:string;
  birth:Date;
  phoneNumber:string;
}

export interface ProductImage {
  id: number,
  productId: number,
  imageUrl: string,
  imageOrder: number,
}

export interface Review {
  id: number,
  productId: number,
  customerId: number,
  star: number,
  content: string,
  createTime: Date,
  updateTime: Date,
  customerName: string,
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
  reviews: Array<Review>,
}

function jwtSignUser(user:User):string {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign({ data: user }, jwtSecret, {
    expiresIn: ONE_WEEK,
  });
}

function jwtSignPhone(phoneNumber:string):string {
  const timeout = 300;
  return jwt.sign({ data: phoneNumber }, jwtSecret, {
    expiresIn: timeout,
  });
}

function jwtSignUpdatePw(phone:string, email:string, name:string, type:string):string {
  const timeout = 300;
  return jwt.sign({
    phone, email, name, type,
  }, jwtSecret, {
    expiresIn: timeout,
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

function isPassword(input: string):boolean {
  const regExpPw = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
  return regExpPw.test(input);
}

function isPhone(input: string):boolean {
  const regExpPw = /^01([0|1|6|7|8|9])([0-9]{4})([0-9]{4})$/;
  return regExpPw.test(input);
}

export {
  jwtSignUser,
  jwtSignPhone,
  jwtSignUpdatePw,
  jwtVerify,
  isEmail,
  isPhone,
  isPassword,
};
