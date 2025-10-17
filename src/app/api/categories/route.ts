import { NextResponse } from "next/server";
import { CategoryService } from "@/lib/services";
import { ApiResponse } from "@/types/api";

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

// 获取分类列表
export async function GET() {
  try {
    const categories = await CategoryService.findAll();
    return createSuccessResponse(categories, "获取分类列表成功");
  } catch (error) {
    console.error("获取分类列表失败:", error);
    return createErrorResponse("获取分类列表失败", 500);
  }
}
