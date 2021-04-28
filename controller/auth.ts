import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from './utils';
import errCode from './errCode';

const authorization = (req:Request, res:Response, next:NextFunction):any => {
  const { authorization: token } = req.headers;
  if (typeof token === 'undefined') {
    return res.status(403).json({
      status: 'error',
      data: {
        errCode: 201,
      },
      message: errCode[201],
    });
  }
  try {
    const { id, type } = jwtVerify(token as string).data;
    if (typeof id === 'undefined' || typeof type === 'undefined') {
      return res.status(403).json({
        status: 'error',
        data: {
          errCode: 201,
        },
        message: errCode[201],
      });
    }
    res.locals.id = id;
    res.locals.type = type;
    next();
  } catch (err) {
    res.status(403).json({
      status: 'error',
      data: {
        errCode: 202,
      },
      message: errCode[202],
    });
  }
};

export {
  authorization,
};
