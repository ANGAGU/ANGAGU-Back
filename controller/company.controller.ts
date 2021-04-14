import { Request, Response } from 'express';
import { getCompanyByEmailPassword, getProducts } from '../database/company-service';
import * as service from '../database/company-service';
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

const addProduct = async (req:Request, res:Response): Promise<void> => {
  try {
    const { id, type } = res.locals;
    const { files } = req;
    const inform = req.body;
    const fileList: any = files;
    if (type !== 'company') {
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

    if (!files) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 302,
          },
          message: errorCode[302],
        })
        .end();
    }
    const productId = await service.addProduct(
      id,
      fileList.description_image[0].path,
      fileList.thumb_image[0].path,
      inform.description,
      inform.name,
      inform.price,
      inform.stock,
      inform.delivery_charge,
    );

    const dataList: Array<string> = fileList.images.map((x: any) => JSON.stringify({
      product_id: productId.data,
      image_url: x.path,
      image_order: inform[x.filename],
    }));
    const addProductResult = await service.addProducctImage(dataList);
    if (addProductResult.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errorCode: 301,
          },
          message: errorCode[301],
        })
        .end();
    }
    res
      .status(200)
      .json({
        status: 'success',
        data: {},
      })
      .end();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      data: {
        errCode: 0,
      },
      message: errorCode[0],
    });
  }
};

const deleteProduct = async (req:Request, res:Response): Promise<void> => {
  try {
    const { id, type } = res.locals;
    const productId = Number(req.params.productId);

    if (type !== 'company') {
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
    const deleteResult = await service.deleteProduct(productId);
    const deleteImageResult = await service.deleteProductImage(productId);
    if (deleteResult.status !== 'success' || deleteImageResult.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errorCode: 303,
          },
          message: errorCode[303],
        })
        .end();
    }
    res
      .status(200)
      .json({
        status: 'success',
        data: {},
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errorCode: 0,
        },
        message: errorCode[0],
      });
  }
};

const updateProduct = async (req:Request, res:Response): Promise<void> => {
  const result = await service.updateProduct(100, 'descriptionUrl', 'thumbUrl', 'desk', 50000, 10, 3000);
  res.status(200).end();
};

export {
  login,
  products,
  addProduct,
  deleteProduct,
  updateProduct,
};
