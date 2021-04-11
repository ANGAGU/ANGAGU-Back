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
  name: string,
  price: number,
  stock: number,
  deliveryCharge: number,
): Promise<any> => {
  const result = 0;
  return result;
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
  deleteProduct,
  updateProduct,
};
