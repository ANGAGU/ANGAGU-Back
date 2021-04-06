import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.json';

export interface User {
  id:number;
  type:string;
  email:string;
  birth:Date;
  phoneNumber:string;
}

function jwtSignUser(user:User):string {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign({ data: user }, jwtSecret, {
    expiresIn: ONE_WEEK,
  });
}

function jwtVerify(token:string):any {
  const decode = jwt.verify(token, jwtSecret);
  return decode;
}

function isEmail(asValue: string):boolean {
  const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return regExp.test(asValue);
}

export {
  jwtSignUser,
  jwtVerify,
  isEmail,
};
