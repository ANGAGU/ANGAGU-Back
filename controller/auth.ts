import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from './utils';
import errorCode from './errorCode';

const authorization = (req:Request, res:Response, next:NextFunction):any => {
  const { authorization: token } = req.headers;
  const { id, type } = jwtVerify(token as string);
  if (typeof id === 'undefined' || typeof type === 'undefined') {
    return res.status(403).json({
      status: 'error',
      data: {
        errCode: 201,
      },
      message: errorCode[201],
    });
  }
  res.locals.id = id;
  res.locals.type = type;
  return next();
};

export {
  authorization,
};
