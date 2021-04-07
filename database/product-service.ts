import { resourceLimits } from 'node:worker_threads';
import pool from './pool';

const getProductDetailById = async (productId: number): Promise<any> => {
  try{
    const data = await pool.query('SELECT * FROM PRODUCT WHERE id = ?', productId);
    return data[0];
  } catch(err){
    console.log(err)
    throw Error(err);
  }
};

export {
  getProductDetailById,
};