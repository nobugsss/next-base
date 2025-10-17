import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

// 获取产品列表（支持分页和分类筛选）
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const categoryId = searchParams.get("category_id");
		const offset = (page - 1) * limit;

		let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
		let params: any[] = [];

		if (categoryId) {
			query += " WHERE p.category_id = ?";
			params.push(categoryId);
		}

		query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
		params.push(limit.toString(), offset.toString());

		const [rows] = await pool.execute(query, params);

		// 获取总数
		let countQuery = "SELECT COUNT(*) as total FROM products p";
		let countParams: any[] = [];

		if (categoryId) {
			countQuery += " WHERE p.category_id = ?";
			countParams.push(categoryId);
		}

		const [countResult] = await pool.execute(countQuery, countParams);
		const total = (countResult as any)[0].total;

		return NextResponse.json({
			success: true,
			data: {
				data: rows,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit)
				}
			}
		});
	} catch (error) {
		console.error("获取产品列表失败:", error);
		return NextResponse.json({ success: false, message: "获取产品列表失败" }, { status: 500 });
	}
}

// 创建产品
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, description, price, stock, category_id } = body;

		if (!name || !price) {
			return NextResponse.json({ success: false, message: "产品名称和价格不能为空" }, { status: 400 });
		}

		const [result] = await pool.execute("INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)", [name, description || "", price, stock || 0, category_id || null]);

		const insertId = (result as any).insertId;

		return NextResponse.json({
			success: true,
			data: {
				id: insertId,
				name,
				description,
				price,
				stock,
				category_id,
				message: "产品创建成功"
			}
		});
	} catch (error) {
		console.error("创建产品失败:", error);
		return NextResponse.json({ success: false, message: "创建产品失败" }, { status: 500 });
	}
}
