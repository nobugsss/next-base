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

async function initDatabase() {
	let connection;

	try {
		console.log("🔍 尝试连接数据库...");
		console.log(`   主机: ${dbConfig.host}`);
		console.log(`   端口: ${dbConfig.port}`);
		console.log(`   用户: ${dbConfig.user}`);
		console.log(`   密码: ${dbConfig.password ? '***' : '(无密码)'}`);
		
		// 连接到MySQL服务器（不指定数据库）
		connection = await mysql.createConnection({
			host: dbConfig.host,
			port: dbConfig.port,
			user: dbConfig.user,
			password: dbConfig.password
		});

		console.log("✅ 已连接到MySQL服务器");

		// 创建数据库
		const dbName = dbConfig.database;
		await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
		console.log(`✅ 数据库 '${dbName}' 创建成功`);

		// 重新连接到指定数据库
		await connection.end();
		connection = await mysql.createConnection({
			host: dbConfig.host,
			port: dbConfig.port,
			user: dbConfig.user,
			password: dbConfig.password,
			database: dbName
		});

		// 创建用户表
		await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
		console.log("✅ 用户表创建成功");

		// 创建分类表
		await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
		console.log("✅ 分类表创建成功");

		// 创建产品表
		await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
		console.log("✅ 产品表创建成功");

		// 插入示例分类数据
		const categories = [
			{ name: "电子产品", description: "各种电子设备和配件" },
			{ name: "服装", description: "男装、女装、童装等" },
			{ name: "家居用品", description: "家具、装饰品、生活用品" },
			{ name: "图书", description: "各类图书和杂志" },
			{ name: "运动用品", description: "体育器材和运动装备" }
		];

		for (const category of categories) {
			await connection.execute("INSERT IGNORE INTO categories (name, description) VALUES (?, ?)", [category.name, category.description]);
		}
		console.log("✅ 分类数据插入成功");

		// 插入示例用户数据
		const users = [
			{ username: "admin", email: "admin@example.com" },
			{ username: "user1", email: "user1@example.com" },
			{ username: "user2", email: "user2@example.com" },
			{ username: "test", email: "test@example.com" }
		];

		for (const user of users) {
			await connection.execute("INSERT IGNORE INTO users (username, email) VALUES (?, ?)", [user.username, user.email]);
		}
		console.log("✅ 用户数据插入成功");

		// 插入示例产品数据
		const products = [
			{ name: "iPhone 15", description: "最新款苹果手机", price: 7999.0, stock: 50, category_id: 1 },
			{ name: "MacBook Pro", description: "专业级笔记本电脑", price: 12999.0, stock: 30, category_id: 1 },
			{ name: "Nike运动鞋", description: "舒适的运动鞋", price: 599.0, stock: 100, category_id: 5 },
			{ name: "咖啡机", description: "全自动咖啡机", price: 1299.0, stock: 25, category_id: 3 },
			{ name: "编程书籍", description: "JavaScript高级编程", price: 89.0, stock: 200, category_id: 4 },
			{ name: "羽绒服", description: "冬季保暖外套", price: 399.0, stock: 80, category_id: 2 },
			{ name: "蓝牙耳机", description: "无线降噪耳机", price: 299.0, stock: 150, category_id: 1 },
			{ name: "瑜伽垫", description: "防滑瑜伽垫", price: 199.0, stock: 60, category_id: 5 }
		];

		for (const product of products) {
			await connection.execute("INSERT IGNORE INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)", [product.name, product.description, product.price, product.stock, product.category_id]);
		}
		console.log("✅ 产品数据插入成功");

		console.log("🎉 数据库初始化完成！");
	} catch (error) {
		console.error("❌ 数据库初始化失败:", error);
		process.exit(1);
	} finally {
		if (connection) {
			await connection.end();
			console.log("📝 数据库连接已关闭");
		}
	}
}

// 运行脚本
initDatabase();
