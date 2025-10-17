import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

// 获取单个产品
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const [rows] = await pool.execute("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?", [id]);

		if ((rows as any[]).length === 0) {
			return NextResponse.json({ success: false, message: "产品不存在" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: rows[0]
		});
	} catch (error) {
		console.error("获取产品失败:", error);
		return NextResponse.json({ success: false, message: "获取产品失败" }, { status: 500 });
	}
}

// 更新产品
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { name, description, price, stock, category_id } = body;

		if (!name || !price) {
			return NextResponse.json({ success: false, message: "产品名称和价格不能为空" }, { status: 400 });
		}

		const [result] = await pool.execute("UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ? WHERE id = ?", [name, description || "", price, stock || 0, category_id || null, id]);

		if ((result as any).affectedRows === 0) {
			return NextResponse.json({ success: false, message: "产品不存在" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: {
				id,
				name,
				description,
				price,
				stock,
				category_id,
				message: "产品更新成功"
			}
		});
	} catch (error) {
		console.error("更新产品失败:", error);
		return NextResponse.json({ success: false, message: "更新产品失败" }, { status: 500 });
	}
}

// 删除产品
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [id]);

		if ((result as any).affectedRows === 0) {
			return NextResponse.json({ success: false, message: "产品不存在" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: {
				message: "产品删除成功"
			}
		});
	} catch (error) {
		console.error("删除产品失败:", error);
		return NextResponse.json({ success: false, message: "删除产品失败" }, { status: 500 });
	}
}
