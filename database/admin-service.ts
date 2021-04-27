import { pool } from './pool';

const getApproveList = async ():Promise<any> => {
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

export {
  getApproveList,
  approveProduct,
};
