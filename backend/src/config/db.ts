import dotenv from "dotenv";
import mysql2 from "mysql2/promise";
dotenv.config();

const connectDB = mysql2.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
export default connectDB;
