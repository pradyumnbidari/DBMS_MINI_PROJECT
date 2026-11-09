import mysql, { type Pool } from "mysql2/promise";

const globalPool = globalThis as typeof globalThis & { mysqlPool?: Pool };
export const pool = globalPool.mysqlPool ?? mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || "skillsync_review",
  waitForConnections: true, connectionLimit: 10,
});
if (process.env.NODE_ENV !== "production") globalPool.mysqlPool = pool;
export default pool;
