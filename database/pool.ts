import mysql from 'mysql2';
import { dbConfig } from '../config.json';

interface DBresult {
    status:string;
    data:Array<JSON>;
  }

const pool = mysql.createPool(dbConfig).promise();
export { pool, DBresult };
