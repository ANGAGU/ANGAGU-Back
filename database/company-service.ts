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
  companyId: number,
  descriptionUrl: string,
  thumbUrl: string,
  description: string,
  name: string,
  price: number,
  stock: number,
  deliveryCharge: number,
): Promise<any> => {
  try {
    const productInsertQeury = 'INSERT INTO product(company_id, description_url, thumb_url, description, name, price, stock, delivery_charge) VALUES(?,?,?,?,?,?,?,?)';
    const [result] = await pool.query(
      productInsertQeury,
      [companyId, descriptionUrl, thumbUrl, description, name, price, stock, deliveryCharge],
    );
    const data:any = result;
    return { status: 'success', data: data.insertId };
  } catch (err) {
    throw Error(err);
  }
};

// 상품 이미지 등록
const addProductImage = async (dataList: Array<string>): Promise<any> => {
  try {
    const addImageQuery = 'INSERT INTO product_image(product_id, image_url, image_order) VALUES(?,?,?)';
    dataList.forEach(async (data: string) => {
      const dataTrans = JSON.parse(data);
      const id = dataTrans.product_id;
      const url = dataTrans.image_url;
      const order = Number(dataTrans.image_order);
      await pool.query(addImageQuery, [id, url, order]);
    });
    return { status: 'success' };
  } catch (err) {
    throw Error(err);
  }
};

// 상품 상세정보 삭제
const deleteProductDetail = async (productId: number): Promise<any> => {
  try {
    await pool.query('DELETE FROM product WHERE id = (?)', productId);
    return {
      data: [],
      status: 'success',
    };
  } catch (err) {
    throw Error(err);
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
    throw Error(err);
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
    throw Error(err);
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
    throw Error(err);
  }
};

// 상품 상세정보 업데이트
const updateProductDetail = async (
  productId: number,
  descriptionUrl: string,
  thumbUrl: string,
  description: string,
  name: string,
  price: number,
  stock: number,
  deliveryCharge: number,
): Promise<any> => {
  try {
    const updateResult = await pool.query('UPDATE PRODUCT SET description_url = (?), thumb_url = (?), description = (?), name = (?), price = (?), stock = (?), delivery_charge = (?) WHERE id = (?)', [descriptionUrl, thumbUrl, description, name, price, stock, deliveryCharge, productId]);
    return {
      data: updateResult,
      status: 'success',
    };
  } catch (err) {
    throw Error(err);
  }
};

export {
  getCompanyByEmailPassword,
  getProducts,
  addProduct,
  deleteProductDetail,
  deleteProductImage,
  updateProductDetail,
  getProductImageKeys,
  getOtherImageKeys,
  addProductImage,
};
