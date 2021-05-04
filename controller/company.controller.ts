import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getCompanyByEmail, getProducts, getSale } from '../database/company-service';
import * as service from '../database/company-service';
import {
  jwtSignUser, isEmail, isPassword, isPhone, jwtVerify,
} from './utils';
import * as S3 from './s3';
import errCode from './errCode';
import { postVerifyCode, confirmVerifyCode } from './smsVerification';

const login = async (req:Request, res:Response):Promise<void> => {
  try {
    if (!isEmail(req.body.email)) {
      res.status(202).json({
        status: 'error',
        data: {
          errCode: 101,
        },
        message: errCode[101],
      });
      return;
    }
    const result = await getCompanyByEmail(req.body.email);
    if (result.status === 'success') {
      if (result.data.length === 1) {
        const user:any = result.data[0];
        if (!await bcrypt.compare(req.body.password, user.password)) {
          res
            .status(405)
            .json({
              status: 'error',
              data: {
                errCode: 405,
              },
              message: errCode[405],
            })
            .end();
          return;
        }
        user.type = 'company';
        delete user.password;
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

const products = async (req:Request, res:Response): Promise<void> => {
  try {
    const { id, type } = res.locals;
    if (type !== 'company') {
      res.status(403).json({
        status: 'error',
        data: {
          errCode: 200,
        },
        message: errCode[200],
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
const signup = async (req:Request, res:Response): Promise<void> => {
  try {
    const info = req.body;
    const saltRounds = 10;
    const { verification: token } = req.headers;
    const verifiedPhoneNumber = jwtVerify(token as string).data;

    if (verifiedPhoneNumber !== info.phone_number) {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 404,
          },
          message: errCode[404],
        })
        .end();
      return;
    }
    if (!isPassword(info.password)) {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 103,
          },
          message: errCode[103],
        })
        .end();
      return;
    }
    if (!isEmail(info.email)) {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 101,
          },
          message: errCode[101],
        })
        .end();
      return;
    }
    info.password = await bcrypt.hash(info.password, saltRounds);
    const result = await service.companySignup(info);
    if (result.status === 'duplicate') {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 306,
          },
          message: errCode[306],
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
          message: errCode[307],
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
        message: errCode[0],
      })
      .end();
  }
};

// 상품 등록하기
const addProduct = async (req:Request, res:Response): Promise<void> => {
  try {
    const { id, type } = res.locals;
    const { files } = req;
    const inform = req.body;
    const order = JSON.parse(inform.order);
    const fileList: any = files;

    if (type !== 'company') {
      res
        .status(403)
        .json({
          status: 'error',
          data: {
            errCode: 200,
          },
          message: errCode[200],
        })
        .end();
      return;
    }

    // 이미지 파일이 한 종류라도 없으면 에러
    if (!fileList.product_image || !fileList.desc_image || !fileList.thumb_image) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 302,
          },
          message: errCode[302],
        })
        .end();
      return;
    }

    const result = await service.addProduct(
      fileList.product_image,
      order,
      id,
      fileList.desc_image[0].key,
      fileList.thumb_image[0].key,
      inform.description,
      inform.name,
      inform.price,
      inform.stock,
      inform.delivery_charge,
    );
    if (result.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 301,
          },
          message: errCode[301],
        })
        .end();
      return;
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
      message: errCode[0],
    });
  }
};

// 상품 삭제하기
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
          message: errCode[200],
        })
        .end();
      return;
    }

    // 상품 상세이미지들이 있는 경로 구하기
    const productImageKeys = await service.getProductImageKeys(productId);
    if (productImageKeys.status !== 'success') {
      res
        .status(400)
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

    // 상품 설명 이미지, 썸네일이 있는 경로 구하기
    const otherImageKeys = await service.getOtherImageKeys(productId);
    if (otherImageKeys.status !== 'success') {
      res
        .status(400)
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

    // 상품 상세이미지와 설명 이미지, 썸네일을 S3에서 삭제
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

    // 상품 DB에서 해당 상품의 정보를 삭제
    const deleteDetail = await service.deleteProduct(productId);
    if (deleteDetail.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 303,
          },
          message: errCode[303],
        })
        .end();
      return;
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
          errCode: 0,
        },
        message: errCode[0],
      })
      .end();
  }
};

// 상품 상세정보(설명 이미지, 썸네일 포함)를 업데이트
const updateProductDetail = async (req:Request, res:Response): Promise<void> => {
  try {
    const { type } = res.locals;
    const detail:any = JSON.parse(req.body.detail);
    const productId = Number(req.params.productId);
    const fileList:any = req.files;
    const descImage = fileList.desc_image ? fileList.desc_image[0] : undefined;
    const thumbImage = fileList.thumb_image ? fileList.thumb_image[0] : undefined;
    if (type !== 'company') {
      res
        .status(403)
        .json({
          status: 'error',
          data: {
            errCode: 200,
          },
          message: errCode[200],
        })
        .end();
      return;
    }

    // description image가 업데이트 된다면
    // 해당 상품의 설명 이미지 경로를 가져와 S3에서 파일 삭제
    if (descImage !== undefined) {
      detail.description_url = descImage.key;
      const deleteList = await service.getOtherImageKeys(productId);
      if (deleteList.status !== 'success') {
        res
          .status(400)
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
      const descImageKey:Array<S3.s3Object> = [{
        Key: deleteList.data[0],
      }];
      await S3.deleteFile(descImageKey);
    }
    // thumbnail image가 업데이트 된다면
    // 해당 상품의 썸네일 이미지 경로를 가져와 S3에서 파일 삭제
    if (thumbImage !== undefined) {
      detail.thumb_url = thumbImage.key;
      const deleteList = await service.getOtherImageKeys(productId);
      if (deleteList.status !== 'success') {
        res
          .status(400)
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
      const thumbImageKey:Array<S3.s3Object> = [{
        Key: deleteList.data[1],
      }];
      await S3.deleteFile(thumbImageKey);
    }
    // 상품 상세 정보 DB를 업데이트
    const result = await service.updateProductDetail(
      productId,
      detail,
    );
    if (result.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 304,
          },
          message: errCode[304],
        })
        .end();
      return;
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
          errCode: 0,
        },
        message: errCode[0],
      })
      .end();
  }
};

// 상품 상세이미지 등록
const addProductImage = async (req:Request, res:Response): Promise<void> => {
  try {
    const { type } = res.locals;
    const productId = Number(req.params.productId);
    const orders = JSON.parse(req.body.order);
    const fileList:any = req.files;

    if (type !== 'company') {
      res
        .status(403)
        .json({
          status: 'error',
          data: {
            errCode: 200,
          },
          message: errCode[200],
        })
        .end();
      return;
    }

    // 상품 상세이미지에 대한 정보를 상세이미지 테이블에 등록
    const addProductResult = await service.addProductImage(
      productId,
      orders,
      fileList.product_image,
    );
    if (addProductResult.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 301,
          },
          message: errCode[301],
        })
        .end();
      return;
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
          errCode: 0,
        },
        message: errCode[0],
      })
      .end();
  }
};

// 상품 상세이미지 삭제
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
          message: errCode[200],
        })
        .end();
      return;
    }

    // 해당 상품의 상세이미지 경로를 가져오기
    const productImageKeys = await service.getProductImageKeys(productId);
    if (productImageKeys.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 303,
          },
          message: errCode[303],
        })
        .end();
      return;
    }

    // 해당 상품의 상세이미지를 S3에서 삭제
    const keys = productImageKeys.data.map((key: string) => {
      const obj:S3.s3Object = {
        Key: '',
      };
      obj.Key = key;
      return obj;
    });

    const deleteResult = await S3.deleteFile(keys);
    if (deleteResult.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 305,
          },
          message: errCode[305],
        })
        .end();
      return;
    }

    // 해당 상품의 상세이미지 정보를 상세이미지 DB에서 삭제
    const deleteImage = await service.deleteProductImage(productId);
    if (deleteImage.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 303,
          },
          message: errCode[303],
        })
        .end();
      return;
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
          errCode: 0,
        },
        message: errCode[0],
      })
      .end();
  }
};

const sale = async (req:Request, res:Response): Promise<void> => {
  try {
    const { id, type } = res.locals;
    if (type !== 'company') {
      res.status(403).json({
        status: 'error',
        data: {
          errCode: 200,
        },
        message: errCode[200],
      });
    }
    const result = await getSale(id);
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

const reqVerifyCode = async (req: Request, res: Response):Promise<void> => {
  try {
    const phoneNumber = req.body.phone_number;
    if (!isPhone(phoneNumber)) {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 104,
          },
          message: errCode[104],
        })
        .end();
      return;
    }
    const result = await postVerifyCode(phoneNumber);
    if (result.data.statusCode === '202') {
      res
        .status(200)
        .json({
          status: 'success',
          data: {},
        })
        .end();
      return;
    }
    res
      .status(404)
      .json({
        status: 'error',
        data: {
          errCode: 403,
        },
        message: errCode[403],
      })
      .end();
  } catch (err) {
    res
      .status(200)
      .json({
        status: 'success',
        data: {},
      })
      .end();
  }
};

const conVerifyCode = async (req: Request, res: Response):Promise<void> => {
  try {
    const { code } = req.body;
    const phoneNumber = req.body.phone_number;
    const result = await confirmVerifyCode(phoneNumber, code);
    if (result.status !== 'success') {
      if (result.errCode === 400) {
        res
          .status(404)
          .json({
            status: 'error',
            data: {
              errCode: 400,
            },
            message: errCode[400],
          })
          .end();
        return;
      }
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 401,
          },
          message: errCode[401],
        })
        .end();
      return;
    }
    res
      .status(200)
      .json({
        status: 'success',
        data: {
          token: result.token,
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
        },
        message: errCode[0],
      })
      .end();
  }
};

const checkEmail = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email } = req.body;
    if (!isEmail(email)) {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 101,
          },
          message: errCode[101],
        })
        .end();
      return;
    }
    const result = await service.checkEmailDuplicate(email);
    if (result.status === 'error') {
      if (result.errCode === 402) {
        res
          .status(404)
          .json({
            status: 'error',
            data: {
              errCode: 402,
            },
            message: errCode[402],
          })
          .end();
        return;
      }
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
        data: {},
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

export {
  login,
  products,
  signup,
  addProduct,
  deleteProduct,
  updateProductDetail,
  addProductImage,
  deleteProductImage,
  sale,
  reqVerifyCode,
  conVerifyCode,
  checkEmail,
};
