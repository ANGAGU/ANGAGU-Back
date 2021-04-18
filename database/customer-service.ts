import { pool, DBresult } from './pool';

const getCustomerByEmailPassword = async (email:string, password:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT id,email,birth,phone_number FROM CUSTOMER WHERE email = ? AND password = ?', [email, password]);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getProducts = async ():Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT * FROM product');
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getProductDetailById = async (productId: number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM PRODUCT WHERE id = ?', productId);
    const [images] = await pool.query('SELECT image_url, image_order FROM PRODUCT_IMAGE WHERE product_id = ?', productId);
    const data:any = result;
    return {
      data: [data[0], images],
      status: 'success',
    };
  } catch (err) {
    return {
      status: 'error',
    };
  }
};

export {
  getCustomerByEmailPassword,
  getProducts,
  getProductDetailById,
};
