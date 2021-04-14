import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ProductImage } from '../controller/utils';
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

const addProducctImage = async (dataList: Array<string>): Promise<any> => {
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

const deleteProduct = async (id: number): Promise<any> => {
  const result = 0;
  return result;
};

const updateProduct = async (
  companyId: number,
  descriptionUrl: string,
  thumbUrl: string,
  name: string,
  price: number,
  stock: number,
  deliveryCharge: number,
): Promise<any> => {
  const result = 0;
  return result;
};

export {
  getCompanyByEmailPassword,
  getProducts,
  addProduct,
  addProducctImage,
  deleteProduct,
  updateProduct,
};
