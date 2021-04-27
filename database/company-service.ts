import { pool, DBresult } from './pool';

const getCompanyByEmailPassword = async (email:string, password:string):Promise<DBresult> => {
  const result:DBresult = {
    status: 'error',
    data: [],
  };
  try {
    const [rows] = await pool.query('SELECT id,email,company_name,phone_number, business_number, is_approve, is_block FROM company WHERE email = ? AND password = ?', [email, password]);
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
): Promise<any> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const productInsertQeury = 'INSERT INTO product(company_id, description_url, thumb_url, description, name, price, stock, delivery_charge) VALUES(?,?,?,?,?,?,?,?)';
    const [result] = await conn.query(
      productInsertQeury,
      [companyId, descriptionUrl, thumbUrl, description, name, price, stock, deliveryCharge],
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
    return {
      status: 'error',
    };
  } finally {
    conn.release();
  }
};

export {
  getCompanyByEmailPassword,
  getProducts,
  addProduct,
  deleteProduct,
  deleteProductImage,
  updateProductDetail,
  getProductImageKeys,
  getOtherImageKeys,
  addProductImage,
};
