import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { Validator } from "@/lib/validator";
import { ApiResponse } from "@/types/api";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// 确保上传目录存在
async function ensureUploadDir() {
	try {
		await mkdir(UPLOAD_DIR, { recursive: true });
	} catch {
		// 目录可能已存在，忽略错误
	}
}

// 成功响应助手
function createSuccessResponse<T>(data: T, message?: string): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(response);
}

// 错误响应助手
function createErrorResponse(
  message: string,
  status: number = 400,
  error?: string
): NextResponse {
  const response: ApiResponse = {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(response, { status });
}

// 单文件上传
export async function POST(request: NextRequest) {
	try {
		await ensureUploadDir();

		const formData = await request.formData();
		const file = formData.get("file") as File;

		// 验证文件
		const fileValidation = Validator.validateFileUpload(file);
		if (!fileValidation.isValid) {
			return createErrorResponse(fileValidation.errors.join(', '), 400);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const fileName = `${Date.now()}-${file.name}`;
		const filePath = join(UPLOAD_DIR, fileName);

		await writeFile(filePath, buffer);

		return createSuccessResponse({
			filename: fileName,
			originalName: file.name,
			size: file.size,
			type: file.type,
			uploadTime: new Date().toISOString()
		}, "文件上传成功");
	} catch (error) {
		console.error("文件上传失败:", error);
		return createErrorResponse("文件上传失败", 500);
	}
}
