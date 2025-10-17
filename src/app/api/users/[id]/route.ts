import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

// 获取单个用户
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);

		if ((rows as any[]).length === 0) {
			return NextResponse.json({ success: false, message: "用户不存在" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: rows[0]
		});
	} catch (error) {
		console.error("获取用户失败:", error);
		return NextResponse.json({ success: false, message: "获取用户失败" }, { status: 500 });
	}
}

// 更新用户
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		const { username, email } = body;

		if (!username || !email) {
			return NextResponse.json({ success: false, message: "用户名和邮箱不能为空" }, { status: 400 });
		}

		const [result] = await pool.execute("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, id]);

		if ((result as any).affectedRows === 0) {
			return NextResponse.json({ success: false, message: "用户不存在" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: {
				id,
				username,
				email,
				message: "用户更新成功"
			}
		});
	} catch (error) {
		console.error("更新用户失败:", error);
		return NextResponse.json({ success: false, message: "更新用户失败" }, { status: 500 });
	}
}

// 删除用户
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

		if ((result as any).affectedRows === 0) {
			return NextResponse.json({ success: false, message: "用户不存在" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			data: {
				message: "用户删除成功"
			}
		});
	} catch (error) {
		console.error("删除用户失败:", error);
		return NextResponse.json({ success: false, message: "删除用户失败" }, { status: 500 });
	}
}
