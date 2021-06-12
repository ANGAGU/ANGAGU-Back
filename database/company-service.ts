import { pool, DBresult } from './pool';

const getCompanyByEmail = async (email:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT id,email,password,name,phone_number, business_number, is_approve, is_block FROM company WHERE email = ?', email);
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

const getProductDetail = async (companyId:number, productId:number):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM product WHERE company_id = ? AND id = ?', [companyId, productId]);
    const resultData:any = result;
    if (!resultData) {
      return {
        status: 'error',
        errCode: 300,
      };
    }
    return {
      status: 'success',
      data: resultData[0],
    };
  } catch (err) {
    return {
      status: 'error',
      data: err,
    };
  }
};

const getCompanyByProduct = async (id :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT company_id FROM product WHERE id = ?', id);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

// 상품 등록
const addProduct = async (
  productImages: Array<any>,
  orders: any,
  companyId: number,
  descriptionUrl: string,
  thumbUrl: string,
  description: string,
  name: string,
  price: number,
  stock: number,
  deliveryCharge: number,
  width: number,
  depth: number,
  height: number,
): Promise<any> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const productInsertQeury = 'INSERT INTO product(company_id, description_url, thumb_url, description, name, price, stock, delivery_charge, width, depth, height) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
    const [result] = await conn.query(
      productInsertQeury,
      [
        companyId,
        descriptionUrl,
        thumbUrl,
        description,
        name, price,
        stock,
        deliveryCharge,
        width,
        depth,
        height,
      ],
    );
    const data:any = result;

    const dataList: any = productImages.map((x: any) => [
      data.insertId,
      x.key,
      orders[x.originalname],
    ]);

    const addImageQuery = 'INSERT INTO product_image(product_id, image_url, image_order) VALUES ?';

    await conn.query(addImageQuery, [dataList]);

    await conn.commit();

    return {
      status: 'success',
      data: {},
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

// 상품 이미지 등록
const addProductImage = async (
  productId: number,
  orders: any,
  productImages:Array<any>,
): Promise<any> => {
  try {
    const addImageQuery = 'INSERT INTO product_image(product_id, image_url, image_order) VALUES ?';

    const dataList: any = productImages.map((x: any) => [
      productId,
      x.key,
      orders[x.originalname],
    ]);
    await pool.query(addImageQuery, [dataList]);
    return { status: 'success' };
  } catch (err) {
    return {
      status: 'error',
    };
  }
};

// 상품 삭제
const deleteProduct = async (productId: number): Promise<any> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM product WHERE id = (?)', productId);
    await conn.query('DELETE FROM product_image WHERE product_id = (?)', productId);

    await conn.commit();
    return {
      data: [],
      status: 'success',
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

// 상품 상세이미지 삭제
const deleteProductImage = async (productId: number): Promise<any> => {
  try {
    await pool.query('DELETE FROM product_image WHERE product_id = (?)', productId);
    return {
      data: [],
      status: 'success',
    };
  } catch (err) {
    return {
      status: 'error',
    };
  }
};

// 상품 상세이미지 경로 조회
const getProductImageKeys = async (productId: number): Promise<any> => {
  try {
    const data:Array<string> = [];
    const [productImageKeys] = await pool.query('SELECT image_url FROM product_image WHERE product_id = (?)', productId);
    const result:any = JSON.parse(JSON.stringify(productImageKeys));
    result.map((key:any) => data.push(key.image_url));
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

// 상품 설명이미지, 썸네일 경로 조회
const getOtherImageKeys = async (productId: number): Promise<any> => {
  try {
    const data:Array<string> = [];
    const [otherImageKeys] = await pool.query('SELECT description_url, thumb_url  FROM product WHERE id = (?)', productId);
    const result:any = JSON.parse(JSON.stringify(otherImageKeys));
    data.push(result[0].description_url, result[0].thumb_url);
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

// 상품 상세정보 업데이트
const updateProductDetail = async (
  productId: number,
  detail: any,
): Promise<any> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql1 = 'UPDATE PRODUCT SET ';
    const sql2 = conn.escape(Object.keys(detail).map((key) => `${key} = ?`).join(', '));
    const sql3 = ' WHERE id = ?';
    const sql = sql1 + sql2.replace(/['']+/g, '') + sql3;
    const parameters = [...Object.values(detail), productId];
    const updateResult = await conn.query(sql, parameters);
    await conn.commit();
    return {
      data: updateResult,
      status: 'success',
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

const getSale = async (id :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT * FROM angagu.sale where company_id = ? order by `date` desc limit 6', id);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getSaleProduct = async (id :number, month:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const sql = 'SELECT ord.product_id,p.`name`, sum(ord.count) as total_count ,sum(ord.price) as total_price FROM angagu.`order`as ord JOIN angagu.product as p on p.id = ord.product_id WHERE ord.company_id=? AND ord.create_time between ? and date_sub(date_add(?,interval 1 month),interval 1 second) Group by ord.product_id;';
    const [rows] = await pool.query(sql, [id, month, month]);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const getCompanyByOrder = async (orderId :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT company_id, refund_state, price, create_time FROM `order` WHERE id = ?', orderId);
    result.status = 'success';
    result.data = JSON.parse(JSON.stringify(rows));
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const refund = async (orderId :number, data:any):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = 'UPDATE `order` SET refund_state = 2 WHERE id = ?';
    const [rows] = await conn.query(sql, orderId);

    const sql2 = 'UPDATE sale SET price = price - ? WHERE company_id = ? AND date = DATE_FORMAT(?, \'%y-%m-01\')';
    const [rows2] = await conn.query(sql2, [data.price, data.company_id, data.create_time]);

    await conn.commit();
    result.status = 'success';
    return result;
  } catch (err) {
    await conn.rollback();
    result.status = 'error';
    result.data = err;
    return result;
  } finally {
    conn.release();
  }
};

const addBusinessInfo = async (id :number, businessNumber:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    await pool.query('UPDATE company SET `business_number` = ? WHERE id = ?', [businessNumber, id]);
    result.status = 'success';
    return result;
  } catch (err) {
    result.status = 'error';
    result.data = err;
    return result;
  }
};

const companySignup = async (info:any, verifiedPhoneNumber:string):Promise<any> => {
  try {
    const sql = 'INSERT INTO company(email, name, password, phone_number, business_number, account_number, account_holder, account_bank) VALUES(?,?,?,?,?,?,?,?)';
    const [result] = await pool.query(sql, [
      info.email,
      info.name,
      info.password,
      verifiedPhoneNumber,
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

const checkEmailDuplicate = async (email:string): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT * FROM company WHERE email = (?)', email);
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
const getInfo = async (id:number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT id, name, email, phone_number, business_number, account_number, account_holder, account_bank, is_approve, is_block, create_time, update_time FROM company WHERE id = ?', id);
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

const updateInfo = async (id:number, detail:any): Promise<any> => {
  const conn = await pool.getConnection();
  try {
    const keys = Object.keys(detail).filter((key) => detail[key]);

    await conn.beginTransaction();
    const sql1 = 'UPDATE company SET ';
    const sql2 = conn.escape(keys.map((key) => `${key} = ?`).join(', '));
    const sql3 = ' WHERE id = ?';
    const sql = sql1 + sql2.replace(/['']+/g, '') + sql3;

    const parameters = [...keys.map((key) => detail[key]), id];
    const updateResult = await conn.query(sql, parameters);
    await conn.commit();
    return {
      data: updateResult,
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

const addProductAr = async (
  id:number,
  originalUrl:string,
  textureUrl:Array<string>,
): Promise<any> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  const conn = await pool.getConnection();
  try {
    conn.beginTransaction();
    await conn.query('TRUNCATE TABLE original_ar');
    const addArQuery = 'INSERT INTO original_ar(product_id, main_path, texture_path) VALUES ?';
    const values:any = [];
    textureUrl.forEach((texturePath:any) => {
      const value:any = [];
      value.push(id, originalUrl, texturePath);
      values.push(value);
    });
    await conn.query(addArQuery, [values]);
    await conn.commit();
    result.status = 'success';
    return result;
  } catch (err) {
    await conn.rollback();
    return result;
  } finally {
    conn.release();
  }
};

const getOrder = async (id:number): Promise<any> => {
  try {
    const [result] = await pool.query('SELECT ord.*, ct.name as customer_name, pd.name as product_name FROM angagu.`order` as ord JOIN angagu.customer as ct ON ord.customer_id = ct.id JOIN angagu.product as pd ON ord.product_id = pd.id WHERE ord.company_id = ?', id);
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

const addDeliveryNumber = async (
  orderId: number,
  companyId:number,
  deliveryNumber:string,
): Promise<any> => {
  try {
    const [result] = await pool.query('UPDATE `order` SET delivery_number = ? WHERE company_id = ? AND id = ?', [deliveryNumber, companyId, orderId]);
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

const getIdByNameAndPhone = async (name:string, phone: string):Promise<any> => {
  try {
    const [result] = await pool.query('SELECT email FROM company WHERE name = ? AND phone_number = ?', [name, phone]);
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
    const [result] = await pool.query('UPDATE company SET password = ? WHERE phone_number = ?', [newPw, phone]);
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
    const [result] = await pool.query('SELECT * FROM company WHERE email = ? AND name = ? AND phone_number = ?', [email, name, phone]);
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

const getBoard = async (id:number): Promise<any> => {
  try {
    const sql = 'select board.*, customer.name as customer_name, product.name as product_name from board join product on product.id = board.product_id join customer on board.customer_id = customer.id where company_id = ?';
    const [result] = await pool.query(sql, id);
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

const getCompanyByBoard = async (id :number):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const sql = 'select product.company_id from board join product on product.id = board.product_id where board.id = ?';
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
const postBoard = async (id:number, answer:string): Promise<any> => {
  try {
    const sql = 'UPDATE board SET answer = ?, answer_time = now() WHERE id = ?';
    const [result] = await pool.query(sql, [answer, id]);
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
  getCompanyByEmail,
  getProducts,
  getProductDetail,
  getCompanyByProduct,
  companySignup,
  addProduct,
  deleteProduct,
  deleteProductImage,
  updateProductDetail,
  getProductImageKeys,
  getOtherImageKeys,
  addProductImage,
  addProductAr,
  getSale,
  getSaleProduct,
  getCompanyByOrder,
  refund,
  addBusinessInfo,
  checkEmailDuplicate,
  getInfo,
  updateInfo,
  getOrder,
  addDeliveryNumber,
  getIdByNameAndPhone,
  updateNewPw,
  getUserByEmailNamePhone,
  getBoard,
  postBoard,
  getCompanyByBoard,
};
