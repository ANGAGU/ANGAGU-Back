import { Request, Response } from 'express';
import { ok } from 'node:assert';
import { getProductDetailById } from '../database/product-service';

const productDetail = async(req: Request, res: Response):Promise<void> => {
  const productId = Number(req.params.id);
  const result:any = {};
  try{
    const rows = await getProductDetailById(productId);
    const resPayload = {
      status: 'success',
      data: rows[0],
    };
    res
      .status(200)
      .json(resPayload)
      .end();
  } catch(err) {
    console.log(err);
    const resPayload = {
      status: 'error',
      data: 'db select err',
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


