import { pool, DBresult } from './pool';

const getApproveProductList = async ():Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM product WHERE is_approve = 0');
    const data:any = result;
    return {
      status: 'success',
      data,
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};
const approveProduct = async (productId: number):Promise<any> => {
  try {
    await pool.query('UPDATE product SET is_approve = 1 WHERE id = ?', productId);
    return {
      status: 'success',
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const getAdminByIdPassword = async (id:string, password:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT id FROM admin WHERE id = ? AND password = ?', [id, password]);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getSale = async ():Promise<any> => {
  try {
    const [getSaleResult] = await pool.query('SELECT * FROM sale');
    return {
      status: 'success',
      data: getSaleResult,
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const getCompanyList = async ():Promise<any> => {
  try {
    const [getCompanyListResult] = await pool.query('SELECT id, name, email, phone_number, business_number, account_number, account_holder, account_bank, is_approve, is_block, create_time, update_time FROM company');
    const data:any = getCompanyListResult;
    return {
      status: 'success',
      data,
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

export {
  getApproveProductList,
  approveProduct,
  getAdminByIdPassword,
  getSale,
  getCompanyList,
};
