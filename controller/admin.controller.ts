import { Request, Response } from 'express';
import * as service from '../database/admin-service';
import errCode from './errCode';
import { jwtSignUser } from './utils';

const approveProductList = async (req:Request, res:Response):Promise<void> => {
  try {
    const result = await service.getApproveProductList();
    if (result.status !== 'success') {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 100,
          },
          message: errCode[100],
        })
        .end();
      return;
    }
    res
      .status(200)
      .json({
        status: 'success',
        data: result.data,
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errCode: 0,
        },
        message: errCode[0],
      })
      .end();
  }
};

const approveProduct = async (req:Request, res:Response):Promise<void> => {
  try {
    const productId = Number(req.params.productId);
    const result = await service.approveProduct(productId);
    if (result.status !== 'success') {
      res
        .status(304)
        .json({
          status: 'error',
          data: {
            errCode: 304,
          },
          message: errCode[304],
        })
        .end();
    }
    res
      .status(200)
      .json({
        status: 'success',
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errCode: 0,
        },
        message: errCode[0],
      })
      .end();
  }
};

const login = async (req:Request, res:Response):Promise<void> => {
  try {
    const result = await service.getAdminByIdPassword(req.body.email, req.body.password);
    if (result.status === 'success') {
      if (result.data.length === 1) {
        const user:any = result.data[0];
        user.type = 'admin';
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
          message: errCode[102],
        });
      }
    } else {
      res.status(500).json({
        status: 'error',
        data: {
          errCode: 100,
          data: result.data,
        },
        message: errCode[100],
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      data: {
        errCode: 0,
        data: err,
      },
      message: errCode[0],
    });
  }
};

const sale = async (req:Request, res:Response):Promise<void> => {
  try {
    const result = await service.getSale();
    if (result.status !== 'success') {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 100,
          },
          message: errCode[100],
        })
        .end();
      return;
    }
    res
      .status(200)
      .json({
        status: 'success',
        data: result.data,
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errCode: 0,
        },
        message: errCode[0],
      });
  }
};

export {
  approveProductList,
  approveProduct,
  login,
  sale,
};
