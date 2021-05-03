import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { jwtSecret } from '../config.json';

export interface User {
  id:number;
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

const hashing = async (password:string):Promise<string> => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      reject(err);
    } else {
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve(hash);
        }
      });
    }
  });
});

const compareHash = async (
  password: string, hash:string,
):Promise<boolean> => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err, res) => {
    if (err) {
      reject(err);
    } else if (res) resolve(true);
    else {
      resolve(false);
    }
  });
});

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
  jwtVerify,
  isEmail,
  isPhone,
  isPassword,
  hashing,
  compareHash,
};
