import { pool, DBresult } from './pool';

const getCompanyByEmailPassword = async (email:string, password:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT id,email,name,phone_number, business_number, is_approve, is_block FROM company WHERE email = ? AND password = ?', [email, password]);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getProducts = async (id :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT * FROM product WHERE company_id = ?', id);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const companySignup = async (info:any):Promise<any> => {
  try {
    const sql = 'INSERT INTO company(email, name, password, phone_number, business_number, account_number, account_holder, account_bank) VALUES(?,?,?,?,?,?,?,?)';
    const [result] = await pool.query(sql, [
      info.email,
      info.name,
      info.password,
      info.phone_number,
      info.business_number,
      info.account_number,
      info.account_holder,
      info.account_bank,
    ]);
    const data:any = result;
    return {
      status: 'success',
      data: data.insertId,
    };
  } catch (err) {
    if (err.errno === 1062) {
      return {
        status: 'duplicate',
        data: err,
      };
    }
    return {
      status: 'error',
      data: err,
    };
  }
};

export {
  getCompanyByEmailPassword,
  getProducts,
  companySignup,
};
