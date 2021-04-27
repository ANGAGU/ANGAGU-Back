import { Request, Response } from 'express';
import * as service from '../database/admin-service';
import errorCode from './errorCode';

const approveList = async (req:Request, res:Response):Promise<void> => {
  try {
    const result = await service.getApproveList();
    if (result.status !== 'success') {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 100,
          },
          message: errorCode[100],
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
        message: errorCode[0],
      })
      .end();
  }
};

export {
  approveList,
};
