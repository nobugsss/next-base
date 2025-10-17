/*
 * @Author: boykaaa
 * @Date: 2025-10-18 04:20:32
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-18 04:20:56
 * @description: 
 * @param: 
 * @return: 
 */
import mysql from "mysql2/promise";
import { config } from "dotenv";

// 加载环境变量
config();

// 读取环境变量
const dbConfig = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "3306"),
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "11223344",
	database: process.env.DB_NAME || "next_base_db"
};

async function checkDatabaseConnection() {
	console.log("🔍 检查数据库连接配置...");
	console.log("📋 环境变量调试信息:");
	console.log(`   process.env.DB_HOST = "${process.env.DB_HOST}"`);
	console.log(`   process.env.DB_PORT = "${process.env.DB_PORT}"`);
	console.log(`   process.env.DB_USER = "${process.env.DB_USER}"`);
	console.log(`   process.env.DB_PASSWORD = "${process.env.DB_PASSWORD}"`);
	console.log(`   process.env.DB_NAME = "${process.env.DB_NAME}"`);
	console.log("");
	console.log("⚙️  最终配置:");
	console.log(`   主机: ${dbConfig.host}`);
	console.log(`   端口: ${dbConfig.port}`);
	console.log(`   用户: ${dbConfig.user}`);
	console.log(`   密码: ${dbConfig.password ? '***' : '(无密码)'}`);
	console.log(`   数据库: ${dbConfig.database}`);
	console.log("");

	let connection;
	
	try {
		console.log("📡 尝试连接到 MySQL 服务器...");
		connection = await mysql.createConnection({
			host: dbConfig.host,
			port: dbConfig.port,
			user: dbConfig.user,
			password: dbConfig.password
		});

		console.log("✅ 成功连接到 MySQL 服务器！");
		
		// 检查数据库是否存在
		const [rows] = await connection.execute(`SHOW DATABASES LIKE '${dbConfig.database}'`);
		if (Array.isArray(rows) && rows.length > 0) {
			console.log(`✅ 数据库 '${dbConfig.database}' 已存在`);
		} else {
			console.log(`⚠️  数据库 '${dbConfig.database}' 不存在，需要创建`);
		}

		console.log("\n🎉 数据库连接检查完成！");
		console.log("💡 如果连接成功，可以运行: npx tsx scripts/init-database.ts");
		
	} catch (error: any) {
		console.error("❌ 数据库连接失败:");
		console.error(`   错误代码: ${error.code}`);
		console.error(`   错误信息: ${error.message}`);
		
		console.log("\n🔧 可能的解决方案:");
		console.log("1. 检查 MySQL 服务是否正在运行");
		console.log("2. 检查用户名和密码是否正确");
		console.log("3. 检查端口是否正确 (默认 3306)");
		console.log("4. 编辑 .env.local 文件修改数据库配置");
		
		if (error.code === 'ECONNREFUSED') {
			console.log("\n💡 MySQL 服务可能未启动，尝试:");
			console.log("   brew services start mysql");
			console.log("   或");
			console.log("   sudo /usr/local/mysql/support-files/mysql.server start");
		}
		
		if (error.code === 'ER_ACCESS_DENIED_ERROR') {
			console.log("\n💡 用户名或密码错误，请检查 .env.local 文件");
		}
		
		process.exit(1);
	} finally {
		if (connection) {
			await connection.end();
		}
	}
}

// 运行检查
checkDatabaseConnection();
