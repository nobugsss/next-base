import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// 下载文件
export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
	try {
		const { filename } = await params;
		const filePath = join(UPLOAD_DIR, filename);

		// 检查文件是否存在
		await stat(filePath);

		const fileBuffer = await readFile(filePath);

		return new NextResponse(fileBuffer, {
			headers: {
				"Content-Type": "application/octet-stream",
				"Content-Disposition": `attachment; filename="${filename}"`,
				"Content-Length": fileBuffer.length.toString()
			}
		});
	} catch (error) {
		console.error("文件下载失败:", error);
		return NextResponse.json({ success: false, message: "文件不存在或下载失败" }, { status: 404 });
	}
}
