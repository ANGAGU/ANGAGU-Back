import { Request, Response } from 'express';
import { getCompanyByEmailPassword, getProduct } from '../database/company-service';
import { jwtSignUser, isEmail } from './utils';
import errorCode from './errorCode';

const login = async (req:Request, res:Response):Promise<void> => {
  try {
    if (!isEmail(req.body.email)) {
      res.status(202).json({
        status: 'error',
        data: {
          errCode: 101,
        },
        message: errorCode[101],
      });
      return;
    }
    const result = await getCompanyByEmailPassword(req.body.email, req.body.password);
    if (result.status === 'success') {
      if (result.data.length === 1) {
        const user:any = result.data[0];
        user.type = 'company';
        const token = jwtSignUser(user);
        res.json({
          status: 'success',
          data: {
            user,
            token,
          },
        });
      } else {
        res.status(202).json({
          status: 'error',
          data: {
            errCode: 102,
          },
          message: errorCode[102],
        });
      }
    } else {
      res.status(500).json({
        status: 'error',
        data: {
          errCode: 100,
          data: result.data,
        },
        message: errorCode[100],
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      data: {
        errCode: 0,
        data: err,
      },
      message: errorCode[0],
    });
  }
};

const product = async (req:Request, res:Response) => {
  try {
    const { id, type } = res.locals;
    if (type !== 'company') {
      res.status(403).json({
        status: 'error',
        data: {
          errCode: 200,
        },
        message: errorCode[200],
      });
    }
    const result = await getProduct(id);
    if (result.status === 'success') {
      res.json({
        status: 'success',
        data: result.data,
      });
    } else {
      res.status(202).json({
        status: 'error',
        data: {
          errCode: 100,
        },
        message: errorCode[100],
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      data: {
        errCode: 0,
        data: err,
      },
      message: errorCode[0],
    });
  }
};

export {
  login,
  product,
};
