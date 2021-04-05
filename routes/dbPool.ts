import mysql from 'mysql2';
import { dbConfig } from '../config.json';

const pool = mysql.createPool(dbConfig).promise();
export default pool;
