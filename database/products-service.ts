import pool from './pool';

const getProductDetailById = async (productId: number): Promise<any> => {
  try{
    const [result] = await pool.query('SELECT * FROM PRODUCT WHERE id = ?', productId);
    const [images] = await pool.query('SELECT id, image_url, image_order FROM PRODUCT_IMAGE WHERE product_id = ?', productId);
    const data:any = result;
    return [data[0], images];
  } catch(err){
    console.log(err)
    throw Error(err);
  }
};

export {
  getProductDetailById,
};