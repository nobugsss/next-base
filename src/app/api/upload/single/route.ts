import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// 确保上传目录存在
async function ensureUploadDir() {
	try {
		await mkdir(UPLOAD_DIR, { recursive: true });
	} catch (error) {
		// 目录可能已存在，忽略错误
	}
}

// 单文件上传
export async function POST(request: NextRequest) {
	try {
		await ensureUploadDir();

		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ success: false, message: "没有上传文件" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const fileName = `${Date.now()}-${file.name}`;
		const filePath = join(UPLOAD_DIR, fileName);

		await writeFile(filePath, buffer);

		return NextResponse.json({
			success: true,
			data: {
				filename: fileName,
				originalName: file.name,
				size: file.size,
				type: file.type,
				uploadTime: new Date().toISOString()
			}
		});
	} catch (error) {
		console.error("文件上传失败:", error);
		return NextResponse.json({ success: false, message: "文件上传失败" }, { status: 500 });
	}
}
