import { Request, Response } from 'express';
import { getCustomerByEmailPassword } from '../database/customer-service';
import { jwtSignUser, User, isEmail } from './utils';

const login = async (req:Request, res:Response):Promise<void> => {
  try {
    if (!isEmail(req.body.email)) {
      res.status(202).json({
        status: 'error',
        data: {
          errCode: 101,
        },
        message: 'wrong email format',
      });
      return;
    }

    const result = await getCustomerByEmailPassword(req.body.email, req.body.password);
    if (result.status === 'success') {
      const user:User = result.data[0];
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
        message: 'can not find user',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      data: {
        errCode: 0,
        data: err,
      },
      message: 'unknown error',
    });
  }
};

export {
  login,
};
