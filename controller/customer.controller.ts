import { Request, Response } from 'express';
import { servicesVersion } from 'typescript';
import { getCustomerByEmailPassword, getProducts, getProductDetailById } from '../database/customer-service';
import * as service from '../database/customer-service';
import errorCode from './errorCode';
import {
  jwtSignUser, isEmail, Product, ProductImage,
} from './utils';

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
    const result = await getCustomerByEmailPassword(req.body.email, req.body.password);
    if (result.status === 'success') {
      if (result.data.length === 1) {
        const user:any = result.data[0];
        user.type = 'customer';
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

const products = async (req:Request, res:Response):Promise<void> => {
  try {
    const result = await getProducts();
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

const productDetail = async (req: Request, res: Response):Promise<void> => {
  const productId = Number(req.params.productId);
  try {
    const result = await getProductDetailById(productId);
    const product:Product = result[0];
    const productImages:Array<ProductImage> = result[1];
    if (!product) {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 300,
          },
          message: errorCode[300],
        })
        .end();
      return;
    }

    product.images = productImages;

    res
      .status(200)
      .json({
        status: 'success',
        data: product,
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errCode: 100,
        },
        message: errorCode[100],
      })
      .end();
  }
};

const orderList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, type } = res.locals;

    if (type !== 'customer') {
      res
        .status(403)
        .json({
          status: 'error',
          data: {
            errCode: 200,
          },
          message: errorCode[200],
        })
        .end();
    }

    const result = await service.getOrderList(id);

    if (result.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 100,
          },
          message: errorCode[100],
        })
        .end();
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
          errCode: 100,
        },
        message: errorCode[100],
      })
      .end();
  }
};

const orderDetail = async (req: Request, res: Response): Promise<void> => {
  res.status(200).end();
};

export {
  login,
  products,
  productDetail,
  orderList,
  orderDetail,
};
