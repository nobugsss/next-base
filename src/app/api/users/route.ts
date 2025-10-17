import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

// 获取用户列表（支持分页）
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const offset = (page - 1) * limit;

		const [rows] = await pool.execute("SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?", [limit.toString(), offset.toString()]);

		const [countResult] = await pool.execute("SELECT COUNT(*) as total FROM users");
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
		console.error("获取用户列表失败:", error);
		return NextResponse.json({ success: false, message: "获取用户列表失败" }, { status: 500 });
	}
}

// 创建用户
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { username, email } = body;

		if (!username || !email) {
			return NextResponse.json({ success: false, message: "用户名和邮箱不能为空" }, { status: 400 });
		}

		const [result] = await pool.execute("INSERT INTO users (username, email) VALUES (?, ?)", [username, email]);

		const insertId = (result as any).insertId;

		return NextResponse.json({
			success: true,
			data: {
				id: insertId,
				username,
				email,
				message: "用户创建成功"
			}
		});
	} catch (error) {
		console.error("创建用户失败:", error);
		return NextResponse.json({ success: false, message: "创建用户失败" }, { status: 500 });
	}
}
