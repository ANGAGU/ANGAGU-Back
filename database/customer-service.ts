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
    const [result] = await pool.query('SELECT * FROM product WHERE id = (?)', productId);
    const [images] = await pool.query('SELECT image_url, image_order FROM product_image WHERE product_id = (?)', productId);
    const data:any = result;
    return [data[0], images];
  } catch (err) {
    throw Error(err);
  }
};

const getOrderList = async (customerId: number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM order_list WHERE customer_id = (?)', customerId);
    const data:any = result;
    return {
      data,
      status: 'success',
    };
  } catch (err) {
    throw Error(err);
  }
};

const getOrderDetail = async (orderId: number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM `order` WHERE order_list_id = (?)', orderId);
    const data:any = result;
    return {
      data,
      status: 'success',
    };
  } catch (err) {
    throw Error(err);
  }
};

export {
  getCustomerByEmailPassword,
  getProducts,
  getProductDetailById,
  getOrderList,
  getOrderDetail,
};
