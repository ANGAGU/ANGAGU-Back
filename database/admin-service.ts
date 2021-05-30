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

const getSale = async (companyId:number, from:string, to:string):Promise<any> => {
  try {
    const [getSaleResult] = await pool.query('SELECT * FROM sale WHERE create_time BETWEEN (?) and DATE_ADD(?, INTERVAL 1 DAY) AND company_id = (?)', [from, to, companyId]);
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

const get6monthSale = async ():Promise<any> => {
  try {
    const sql = 'SELECT sum(price) as total_price, `date` FROM angagu.sale Group by `date` order by `date` desc limit 6';
    const [rows] = await pool.query(sql);
    return {
      status: 'success',
      data: JSON.parse(JSON.stringify(rows)),
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const getSaleCompany = async (month:string):Promise<any> => {
  try {
    const sql = 'SELECT ord.company_id, c.`name`, sum(ord.price) as total_price FROM angagu.`order`as ord JOIN angagu.company as c on c.id = ord.company_id WHERE ord.create_time between ? and date_sub(date_add(?,interval 1 month),interval 1 second) Group by ord.company_id;';
    const [rows] = await pool.query(sql, [month, month]);
    return {
      status: 'success',
      data: JSON.parse(JSON.stringify(rows)),
    };
  } catch (err) {
    console.log(err);
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
  get6monthSale,
  getSaleCompany,
};
