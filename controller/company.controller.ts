import { Request, Response } from 'express';
import { getCompanyByEmailPassword, getProducts } from '../database/company-service';
import * as service from '../database/company-service';
import { jwtSignUser, isEmail } from './utils';
import * as S3 from './s3';
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
      return;
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
      fileList.desc_image[0].key,
      fileList.thumb_image[0].key,
      inform.description,
      inform.name,
      inform.price,
      inform.stock,
      inform.delivery_charge,
    );

    const dataList: Array<string> = fileList.product_image.map((x: any) => JSON.stringify({
      product_id: productId.data,
      image_url: x.key,
      image_order: inform[x.originalname],
    }));

    const addProductResult = await service.addProductImage(dataList);
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
    const { type } = res.locals;
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
    const productImageKeys = await service.getProductImageKeys(productId);
    if (productImageKeys.status !== 'success') {
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
    const otherImageKeys = await service.getOtherImageKeys(productId);
    if (otherImageKeys.status !== 'success') {
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
    const keyResult = [
      ...productImageKeys.data,
      ...otherImageKeys.data,
    ];
    const keys = keyResult.map((key: string) => {
      const obj:S3.s3Object = {
        Key: '',
      };
      obj.Key = key;
      return obj;
    });

    await S3.deleteFile(keys);

    const deleteImage = await service.deleteProductImage(productId);
    if (deleteImage.status !== 'success') {
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

    const deleteDetail = await service.deleteProductDetail(productId);
    if (deleteDetail.status !== 'success') {
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
      })
      .end();
  }
};

const updateProductDetail = async (req:Request, res:Response): Promise<void> => {
  try {
    const { type } = res.locals;
    const detail = req.body;
    const productId = Number(req.params.productId);
    const fileList:any = req.files;
    const descImage = fileList.desc_image[0];
    const thumbImage = fileList.thumb_image[0];

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

    const deleteList = await service.getOtherImageKeys(productId);
    const keys = deleteList.data.map((key: string) => {
      const obj:S3.s3Object = {
        Key: '',
      };
      obj.Key = key;
      return obj;
    });
    await S3.deleteFile(keys);

    const result = await service.updateProductDetail(
      productId,
      descImage.key,
      thumbImage.key,
      detail.description,
      detail.name,
      detail.price,
      detail.stock,
      detail.delivery_charge,
    );
    if (result.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errorCode: 304,
          },
          message: errorCode[304],
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
      })
      .end();
  }
};

const addProductImage = async (req:Request, res:Response): Promise<void> => {
  try {
    const { type } = res.locals;
    const productId = Number(req.params.productId);
    const order = JSON.parse(req.body.order);
    const fileList:any = req.files;

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
    const dataList: Array<string> = fileList.product_image.map((x: any) => JSON.stringify({
      product_id: productId,
      image_url: x.key,
      image_order: order[x.originalname],
    }));

    const addProductResult = await service.addProductImage(dataList);
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
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errorCode: 0,
        },
        message: errorCode[0],
      })
      .end();
  }
};
const deleteProductImage = async (req:Request, res:Response): Promise<void> => {
  try {
    const { type } = res.locals;
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
    const productImageKeys = await service.getProductImageKeys(productId);
    if (productImageKeys.status !== 'success') {
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
    const keys = productImageKeys.data.map((key: string) => {
      const obj:S3.s3Object = {
        Key: '',
      };
      obj.Key = key;
      return obj;
    });

    await S3.deleteFile(keys);

    const deleteImage = await service.deleteProductImage(productId);
    if (deleteImage.status !== 'success') {
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
      })
      .end();
  }
};

export {
  login,
  products,
  addProduct,
  deleteProduct,
  updateProductDetail,
  addProductImage,
  deleteProductImage,
};
