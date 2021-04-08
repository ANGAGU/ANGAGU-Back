import { Request, Response } from 'express';
import { ok } from 'node:assert';
import { idText } from 'typescript';
import { getProductDetailById } from '../database/products-service';
import { Product } from './utils';
import errorCode from './errorCode';

const productDetail = async(req: Request, res: Response):Promise<void> => {
  const productId = Number(req.params.productId);
  try{
    const result = await getProductDetailById(productId);
    const product:Product = result[0];
    const productImages:Array<object> = result[1];

    if(!product){
      const resPayload = {
        status: 'error',
        data: {
          errCode: 103,
        },
        message: errorCode[103],
      }
      res
        .status(404)
        .json(resPayload)
        .end();
      return;
    }

    product.images = productImages;

    const resPayload = {
      status: 'success',
      data: product,
    };
    res
      .status(200)
      .json(resPayload)
      .end();
  } catch(err) {
    const resPayload = {
      status: 'error',
      data: {
        errCode: 100,
      },
      message: errorCode[100],
    };
  res
    .status(500)
    .json(resPayload)
    .end();
  }
}

export {
  productDetail,
};


