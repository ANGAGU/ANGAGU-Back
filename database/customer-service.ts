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

const getProductById = async (id:number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT * FROM product where id = ?', id);
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
    const [reviews] = await conn.query('SELECT r.*, c.`name` FROM review as r JOIN customer as c ON r.customer_id = c.id WHERE r.product_id = ?', productId);
    const data:any = result;
    await conn.commit();
    return {
      status: 'success',
      data: data[0],
      images,
      reviews,
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
    const sql = `SELECT ord.id,
    ord.product_id,
    prd.\`name\`,
    prd.thumb_url,
    ord.price,
    ord.delivery_fee,
    ord.count,
    ord.delivery_number,
    ord.create_time,
    addr.recipient,
    addr.road,
    addr.detail,
    ord.review_id,
    ord.refund_state,
    ord.refund_text
    FROM \`order\` as ord 
    JOIN product as prd on prd.id = ord.product_id 
    JOIN address as addr on addr.id = ord.address_id
    WHERE ord.customer_id = ?`;
    const [result] = await pool.query(sql, customerId);
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

const postOrder = async (info:any): Promise<any> => {
  try {
    const sql = 'INSERT INTO `order`(product_id, company_id,customer_id, import_1, import_2, count, price, address_id, delivery_fee) VALUES(?,?,?,?,?,?,?,?,?)';
    const [result] = await pool.query(sql, [
      info.productId,
      info.companyId,
      info.customerId,
      info.import1,
      info.import2,
      info.count,
      info.price,
      info.addressId,
      info.deliveryFee,
    ]);
    const data:any = result;
    return {
      data,
      status: 'success',
    };
  } catch (err) {
    console.log(err);
    return {
      status: 'error',
      err,
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

const postAddress = async (data:any): Promise<any> => {
  try {
    const sql = 'INSERT INTO address(customer_id, recipient, road, land, detail) VALUES(?,?,?,?,?)';
    const [result]:any = await pool.query(sql, [
      data.id,
      data.recipient,
      data.road,
      data.land,
      data.detail,
    ]);
    return {
      status: 'success',
      data: result.insertId,
    };
  } catch (err) {
    return {
      status: 'error',
      err,
    };
  }
};

const deleteAddress = async (id: number): Promise<any> => {
  try {
    const [result] = await pool.query('DELETE FROM address WHERE id = (?)', id);
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

const putAddress = async (id: number, data:any): Promise<any> => {
  try {
    const sql = 'UPDATE address SET recipient = ?, road = ?, land = ?, detail = ? WHERE id = ?';
    const [result]:any = await pool.query(sql, [
      data.recipient,
      data.road,
      data.land,
      data.detail,
      id,
    ]);

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

const getCustomerByAddress = async (id :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT customer_id FROM address WHERE id = ?', id);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const setDefaultAddress = async (id :number, addressId:number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const sql = 'UPDATE customer SET address_id = ? WHERE id = ?';
    const [rows] = await pool.query(sql, [addressId, id]);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getDefaultAddress = async (id :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const sql = 'Select address_id FROM customer WHERE id = ?';
    const [rows] = await pool.query(sql, id);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getProductBoard = async (productId: number): Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT * FROM board WHERE product_id = (?)', productId);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const postProductBoard = async (id:number, productId: number, boardData:any): Promise<DBresult> => {
  try {
    const sql = 'INSERT INTO board(product_id, customer_id, title, content) VALUES(?,?,?,?)';
    const [result] = await pool.query(sql, [id, productId, boardData.title, boardData.content]);
    const data:any = result;
    return {
      status: 'success',
      data: data.insertId,
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const getIdByNameAndPhone = async (name:string, phone: string):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT email FROM customer WHERE name = ? AND phone_number = ?', [name, phone]);
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

const updateNewPw = async (newPw:string, phone:string):Promise<any> => {
  try {
    const [result] = await pool.query('UPDATE customer SET password = ? WHERE phone_number = ?', [newPw, phone]);
    const data:any = result;
    if (data.affectedRows === 0) {
      return {
        errCode: 102,
        status: 'error',
      };
    }
    return {
      status: 'success',
      data: data[0],
    };
  } catch (err) {
    return {
      errCode: 304,
      status: 'error',
      data: err,
    };
  }
};

const getUserByEmailNamePhone = async (
  email:string, name:string, phone:string,
):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM customer WHERE email = ? AND name = ? AND phone_number = ?', [email, name, phone]);
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

const getInfo = async (id:number):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT email, name, birth, phone_number FROM customer WHERE id = ?', id);
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

const getCustomerPwById = async (id:number):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT password FROM customer WHERE id = ?', id);
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

const updateInfo = async (newPw:string, id:number):Promise<any> => {
  try {
    const [result] = await pool.query('UPDATE customer SET password = ? WHERE id = ?', [newPw, id]);
    const data:any = result;
    if (data.affectedRows === 0) {
      return {
        errCode: 102,
        status: 'error',
      };
    }
    return {
      status: 'success',
      data: data[0],
    };
  } catch (err) {
    return {
      errCode: 304,
      status: 'error',
      data: err,
    };
  }
};

const getCart = async (customerId: number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM cart WHERE customer_id = (?)', customerId);
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

const postCart = async (customerId: number, productId:number): Promise<any> => {
  try {
    const sql = 'INSERT INTO cart(customer_id, product_id) VALUES(?,?)';
    const [result] = await pool.query(sql, [customerId, productId]);
    const data:any = result;
    return {
      status: 'success',
      data: data.insertId,
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const deleteCart = async (cartId: number): Promise<any> => {
  try {
    const [result] = await pool.query('DELETE FROM cart WHERE id = (?)', cartId);
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

const getCustomerByCart = async (id :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT customer_id FROM cart WHERE id = ?', id);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getInfoByOrderId = async (orderId:number):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT customer_id as customerId, product_id as productId, review_id as reviewId FROM `order` WHERE id = ?', orderId);
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

const postReview = async (
  orderId:number,
  id:number,
  productId:number,
  star:number,
  content:string,
):Promise<any> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query('INSERT INTO review(product_id, customer_id, star, content) VALUES(?,?,?,?)', [productId, id, star, content]);
    const data:any = result;
    const reviewId = data.insertId;
    const [result2] = await conn.query('UPDATE `order` SET review_id = ? WHERE id = ?', [reviewId, orderId]);
    const data2:any = result2;
    if (data2.affectedRows.length === 0) {
      return {
        status: 'error',
      };
    }
    await conn.commit();
    return {
      status: 'success',
      data: reviewId,
    };
  } catch (err) {
    await conn.rollback();
    return {
      status: 'error',
      data: err,
    };
  } finally {
    conn.release();
  }
};

const getReview = async (reviewId:number, customerId:number):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM review WHERE id = ? AND customer_id', [reviewId, customerId]);
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

const deleteReview = async (orderId:number, reviewId:number, customerId:number):Promise<any> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query('DELETE FROM review WHERE id = ? AND customer_id', [reviewId, customerId]);
    const data:any = result;
    const [result2] = await conn.query('UPDATE `order` SET review_id = ? WHERE id = ?', [null, orderId]);
    const data2:any = result2;
    if (data.affectedRows === 0 || data2.affectedRows === 0) {
      conn.rollback();
      return {
        status: 'error',
      };
    }
    await conn.commit();
    return {
      status: 'success',
    };
  } catch (err) {
    await conn.rollback();
    return {
      status: 'error',
      data: err,
    };
  } finally {
    conn.release();
  }
};

const updateReview = async (
  star:number, content:string, reviewId:number, customerId:number,
):Promise<any> => {
  try {
    const [result] = await pool.query('UPDATE review SET star = ?, content = ? WHERE id = ? AND customer_id', [star, content, reviewId, customerId]);
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

export {
  getCustomerByEmail,
  getProducts,
  getProductById,
  getProductDetailById,
  getOrderList,
  postOrder,
  getModelUrl,
  customerSignup,
  checkEmailDuplicate,
  getAddress,
  postAddress,
  deleteAddress,
  putAddress,
  getCustomerByAddress,
  setDefaultAddress,
  getDefaultAddress,
  getProductBoard,
  postProductBoard,
  getIdByNameAndPhone,
  updateNewPw,
  getUserByEmailNamePhone,
  getInfo,
  getCustomerPwById,
  updateInfo,
  getCart,
  postCart,
  deleteCart,
  getCustomerByCart,
  getInfoByOrderId,
  postReview,
  getReview,
  deleteReview,
  updateReview,
};
