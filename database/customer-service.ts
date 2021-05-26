import { pool, DBresult } from './pool';

const getCustomerByEmail = async (email:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT id,email,password,birth,phone_number FROM customer WHERE email = ?', [email]);
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
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE product SET view_count = view_count+1 WHERE id = (?)', productId);
    const [result] = await conn.query('SELECT * FROM product WHERE id = (?)', productId);
    const [images] = await conn.query('SELECT image_url, image_order FROM product_image WHERE product_id = (?)', productId);
    const data:any = result;
    await conn.commit();
    return {
      status: 'success',
      data: data[0],
      images,
    };
  } catch (err) {
    await conn.rollback();
    return {
      status: 'error',
    };
  } finally {
    conn.release();
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
    return {
      status: 'error',
    };
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
    return {
      status: 'error',
    };
  }
};

const getModelUrl = async (productId: number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT 3d_model_url FROM product WHERE id = (?)', productId);
    const data:any = result;
    return {
      status: 'success',
      data: data[0],
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const customerSignup = async (info:any, verifiedPhoneNumber:string): Promise<any> => {
  try {
    const sql = 'INSERT INTO customer(email, password, name, birth, phone_number) VALUES(?,?,?,?,?)';
    const [result] = await pool.query(sql, [
      info.email,
      info.password,
      info.name,
      info.birth,
      verifiedPhoneNumber,
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

const checkEmailDuplicate = async (email:string): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM customer WHERE email = (?)', email);
    const data:any = result;
    if (!data[0]) {
      return {
        status: 'success',
      };
    }
    return {
      status: 'error',
      errCode: 402,
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const getAddress = async (customerId: number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM address WHERE customer_id = (?)', customerId);
    const data:any = result;
    return {
      data,
      status: 'success',
    };
  } catch (err) {
    return {
      status: 'error',
    };
  }
};

export {
  getCustomerByEmail,
  getProducts,
  getProductDetailById,
  getOrderList,
  getOrderDetail,
  getModelUrl,
  customerSignup,
  checkEmailDuplicate,
  getAddress,
};
