import mysql from "mysql2/promise";

// 数据库连接配置
const dbConfig = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "3306"),
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "112233",
	database: process.env.DB_NAME || "next_base_db",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

export default pool;
