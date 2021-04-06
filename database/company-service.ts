import pool from './pool';

const getCompanyByEmailPassword = async (email:string, password:string):Promise<any> => {
  const result:any = {};
  try {
    const [rows] = await pool.query('SELECT id,email,company_name,phone_number, business_number, is_approve, is_block FROM company WHERE email = ? AND password = ?', [email, password]);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    result.message = 'company select error';
    return result;
  }
};

export {
  getCompanyByEmailPassword,
};
