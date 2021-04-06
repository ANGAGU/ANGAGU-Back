import { Request, Response } from 'express';
import { getCustomerByEmailPassword } from '../database/customer-service';
import { jwtSignUser, User, isEmail } from './utils';

const login = async (req:Request, res:Response):Promise<void> => {
  try {
    console.log(isEmail(req.body.email));
    if (!isEmail(req.body.email)) {
      res.json({
        status: 'fail',
        data: null,
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
      res.json({
        status: 'fail',
        data: null,
        message: 'can not find user',
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export {
  login,
};
