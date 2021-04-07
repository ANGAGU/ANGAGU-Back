import { Request, Response } from 'express';
import { ok } from 'node:assert';
import { idText } from 'typescript';
import { getProductDetailById } from '../database/products-service';
import { Product } from './utils';

const productDetail = async(req: Request, res: Response):Promise<void> => {
  const productId = Number(req.params.productId);
  try{
    const result = await getProductDetailById(productId);
    const product:Product = result[0];
    const productImages:Array<object> = result[1];

    if(!product){
      const resPayload = {
        status: 'error',
        message: 'cannot find that product.'
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
    console.log(err);
    const resPayload = {
      status: 'error',
      message: 'db select err',
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


