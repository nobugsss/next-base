import { NextResponse } from "next/server";
import pool from "@/lib/database";

// 获取分类列表
export async function GET() {
	try {
		const [rows] = await pool.execute("SELECT * FROM categories ORDER BY created_at DESC");

		return NextResponse.json({
			success: true,
			data: rows
		});
	} catch (error) {
		console.error("获取分类列表失败:", error);
		return NextResponse.json({ success: false, message: "获取分类列表失败" }, { status: 500 });
	}
}
