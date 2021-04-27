import { Request, Response } from 'express';
import { getCompanyByEmailPassword, getProducts, companySignup } from '../database/company-service';
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

const products = async (req:Request, res:Response): Promise<void> => {
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
    const result = await getProducts(id);
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
const signup = async (req:Request, res:Response): Promise<void> => {
  try {
    const info = req.body;
    const result = await companySignup(info);
    if (result.status === 'duplicate') {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 306,
          },
          message: errorCode[306],
        })
        .end();
      return;
    }
    if (result.status === 'error') {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 307,
          },
          message: errorCode[307],
        })
        .end();
      return;
    }
    res
      .status(200)
      .json({
        status: 'success',
        data: {
          id: result.data,
        },
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errCode: 0,
          data: err,
        },
        message: errorCode[0],
      })
      .end();
  }
};

export {
  login,
  products,
  signup,
};
