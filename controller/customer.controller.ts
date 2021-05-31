import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  getCustomerByEmail, getProducts, getProductDetailById, customerSignup,
} from '../database/customer-service';
import errCode from './errCode';
import * as service from '../database/customer-service';
import {
  jwtSignUser, isEmail, Product, ProductImage, isPhone, isPassword, jwtVerify,
} from './utils';
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
    const result = await getCustomerByEmail(req.body.email);
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
        user.type = 'customer';
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

const productDetail = async (req: Request, res: Response):Promise<void> => {
  const productId = Number(req.params.productId);
  try {
    const result = await getProductDetailById(productId);
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
    const product:Product = result.data;
    const productImages:Array<ProductImage> = result.images;
    if (!product) {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 300,
          },
          message: errCode[300],
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
        message: errCode[100],
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
          message: errCode[200],
        })
        .end();
      return;
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
          errCode: 100,
        },
        message: errCode[100],
      })
      .end();
  }
};

const postOrder = async (req: Request, res: Response): Promise<void> => {
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
          message: errCode[200],
        })
        .end();
      return;
    }

    const info = req.body;
    const productResult = await service.getProductById(info.productId);
    if (productResult.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 300,
          },
          message: errCode[300],
        })
        .end();
      return;
    }

    const data:any = productResult.data[0];
    if (data.price * info.count !== info.price) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 501,
          },
          message: errCode[501],
        })
        .end();
      return;
    }
    info.companyId = data.company_id;
    info.customerId = id;
    const result = await service.postOrder(info);
    if (result.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 301,
            err: result.err,
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
          err,
        },
        message: errCode[0],
      })
      .end();
  }
};

const modelUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.productId);
    const modelUrlResult = await service.getModelUrl(productId);
    if (modelUrlResult.status !== 'success') {
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
        data: modelUrlResult.data,
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

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const info = req.body;
    const saltRounds = 10;
    const { verification: token } = req.headers;
    const verifiedPhoneNumber = jwtVerify(token as string).data;

    if (verifiedPhoneNumber === undefined) {
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
    const result = await customerSignup(info, verifiedPhoneNumber);
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
          drrCode: 0,
        },
        message: errCode[0],
      })
      .end();
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

const getAddress = async (req:Request, res:Response):Promise<void> => {
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
          message: errCode[200],
        })
        .end();
      return;
    }

    const result = await service.getAddress(id);

    if (result.status !== 'success') {
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
        message: errCode[100],
      })
      .end();
  }
};

const postAddress = async (req:Request, res:Response):Promise<void> => {
  try {
    const { id, type } = res.locals;
    if (type !== 'customer') {
      res
        .status(400)
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
    const data = req.body;
    data.id = id;

    if ((data.road === undefined && data.land === undefined)
    || (data.road !== undefined && data.land !== undefined)
    || (data.recipient === undefined || data.detail === undefined)) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 501,
          },
          message: errCode[501],
        })
        .end();
      return;
    }
    const result = await service.postAddress(data);
    if (result.status !== 'success') {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 301,
            err: result.err,
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
          errCode: 100,
        },
        message: errCode[100],
      })
      .end();
  }
};

const deleteAddress = async (req:Request, res:Response):Promise<void> => {
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
          message: errCode[200],
        })
        .end();
      return;
    }

    const addressId = Number(req.params.addressId);
    const result = await service.getCustomerByAddress(addressId);
    if (result.status !== 'success') {
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

    if (result.data.length === 1) {
      const customer:any = result.data[0];
      if (customer.customer_id !== id) {
        res.status(403).json({
          status: 'error',
          data: {
            errCode: 502,
          },
          message: errCode[502],
        }).end();
        return;
      }
    } else {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 503,
          },
          message: errCode[503],
        })
        .end();
      return;
    }

    const delResult = await service.deleteAddress(addressId);
    if (delResult.status !== 'success') {
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
          err,
        },
        message: errCode[100],
      })
      .end();
  }
};

const putAddress = async (req:Request, res:Response):Promise<void> => {
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
          message: errCode[200],
        })
        .end();
      return;
    }

    const addressId = Number(req.params.addressId);
    const result = await service.getCustomerByAddress(addressId);
    if (result.status !== 'success') {
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

    if (result.data.length === 1) {
      const customer:any = result.data[0];
      if (customer.customer_id !== id) {
        res.status(403).json({
          status: 'error',
          data: {
            errCode: 502,
          },
          message: errCode[502],
        }).end();
        return;
      }
    } else {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 503,
          },
          message: errCode[503],
        })
        .end();
      return;
    }

    const data = req.body;
    if ((data.road === undefined && data.land === undefined)
    || (data.road !== undefined && data.land !== undefined)
    || (data.recipient === undefined || data.detail === undefined)) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 501,
          },
          message: errCode[501],
        })
        .end();
      return;
    }
    const putResult = await service.putAddress(addressId, data);
    if (putResult.status !== 'success') {
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
          err,
        },
        message: errCode[100],
      })
      .end();
  }
};

const setDefaultAddress = async (req:Request, res:Response):Promise<void> => {
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
          message: errCode[200],
        })
        .end();
      return;
    }

    const addressId = Number(req.params.addressId);
    const result = await service.getCustomerByAddress(addressId);
    if (result.status !== 'success') {
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

    if (result.data.length === 1) {
      const customer:any = result.data[0];
      if (customer.customer_id !== id) {
        res.status(403).json({
          status: 'error',
          data: {
            errCode: 502,
          },
          message: errCode[502],
        }).end();
        return;
      }
    } else {
      res
        .status(404)
        .json({
          status: 'error',
          data: {
            errCode: 503,
          },
          message: errCode[503],
        })
        .end();
      return;
    }

    const setResult = await service.setDefaultAddress(id, addressId);
    if (setResult.status !== 'success') {
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
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .json({
        status: 'error',
        data: {
          errCode: 0,
          err,
        },
        message: errCode[0],
      })
      .end();
  }
};

const getDefaultAddress = async (req:Request, res:Response):Promise<void> => {
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
          message: errCode[200],
        })
        .end();
      return;
    }

    const result = await service.getDefaultAddress(id);
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
          err,
        },
        message: errCode[0],
      })
      .end();
  }
};

const getProductBoard = async (req: Request, res: Response):Promise<void> => {
  try {
    const productId = Number(req.params.productId);

    const result = await service.getProductBoard(productId);
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
          err: result.data,
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

const postProductBoard = async (req: Request, res: Response):Promise<void> => {
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
          message: errCode[200],
        })
        .end();
      return;
    }

    const productId = Number(req.params.productId);
    const { title, content } = req.body;
    if (title === undefined || content === undefined) {
      res
        .status(403)
        .json({
          status: 'error',
          data: {
            errCode: 501,
          },
          message: errCode[501],
        })
        .end();
      return;
    }
    const boardData = { title, content };
    const result:any = await service.postProductBoard(id, productId, boardData);
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
          err,
        },
        message: errCode[0],
      })
      .end();
  }
};

const postReview = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id, type } = res.locals;
    const orderId = Number(req.params.orderId);
    const {
      star, content, imageUrl,
    } = req.body;
    if (type !== 'customer') {
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
    const result = await service.getInfoByOrderId(orderId);
    if (result.status !== 'success' || result.data.length === 0) {
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
    if (result.data.customerId !== id) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 504,
          },
          message: errCode[504],
        })
        .end();
      return;
    }
    if (result.data.reviewId !== null) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 505,
          },
          message: errCode[505],
        })
        .end();
      return;
    }
    const { productId } = result.data;
    const postResult = await service.postReview(orderId, id, productId, star, content, imageUrl);
    if (postResult.status !== 'success') {
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
        data: {
          reviewId: postResult.data,
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
          err,
        },
        message: errCode[0],
      })
      .end();
  }
};

const getReview = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id, type } = res.locals;
    const orderId = Number(req.params.orderId);
    if (type !== 'customer') {
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
    const result = await service.getInfoByOrderId(orderId);
    if (result.status !== 'success' || result.data.length === 0) {
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
    if (result.data.customerId !== id) {
      res
        .status(400)
        .json({
          status: 'error',
          data: {
            errCode: 504,
          },
          message: errCode[504],
        })
        .end();
      return;
    }
    const { reviewId } = result.data;
    const getResult = await service.getReview(reviewId);
    if (getResult.status !== 'success') {
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
    res
      .status(200)
      .json({
        status: 'success',
        data: {
          id: getResult.data[0].id,
          productId: getResult.data[0].product_id,
          customerId: getResult.data[0].customer_id,
          star: getResult.data[0].star,
          content: getResult.data[0].content,
          imageUrl: getResult.data[0].image_url,
          createTime: getResult.data[0].create_time,
          updateTime: getResult.data[0].update_time,
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
          err,
        },
        message: errCode[0],
      })
      .end();
  }
};

export {
  login,
  products,
  productDetail,
  orderList,
  postOrder,
  modelUrl,
  signup,
  reqVerifyCode,
  conVerifyCode,
  checkEmail,
  getAddress,
  postAddress,
  deleteAddress,
  putAddress,
  setDefaultAddress,
  getDefaultAddress,
  getProductBoard,
  postProductBoard,
  postReview,
  getReview,
};
