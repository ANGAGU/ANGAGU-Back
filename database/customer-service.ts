import pool from './pool';

const getCustomerByEmailPassword = async (email:string, password:string):Promise<any> => {
  const result:any = {};
  try {
    const [rows] = await pool.query('SELECT id,email,birth,phone_number FROM CUSTOMER WHERE email = ? AND password = ?', [email, password]);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    console.log(err);
    result.status = 'error';
    result.data = err;
    result.message = 'customer select error';
    return result;
  }
};

export {
  getCustomerByEmailPassword,
};
