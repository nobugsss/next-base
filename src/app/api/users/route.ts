import { NextRequest, NextResponse } from 'next/server';
import { UserService } from "@/lib/services";
import { Validator } from "@/lib/validator";
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

// 获取用户列表（支持分页）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 验证分页参数
    const paginationValidation = Validator.validatePagination(searchParams);
    if (!paginationValidation.isValid) {
      return createErrorResponse(paginationValidation.errors.join(', '), 400);
    }

    const { page, limit } = paginationValidation;
    const result = await UserService.findAll({ page, limit });

    return createSuccessResponse(result, "获取用户列表成功");
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return createErrorResponse("获取用户列表失败", 500);
  }
}

// 创建用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证用户数据
    const validation = Validator.validateUser(body);
    if (!validation.isValid) {
      return createErrorResponse(validation.errors.join(', '), 400);
    }

    const { username, email } = body;

    // 检查邮箱是否已存在
    const emailExists = await UserService.existsByEmail(email);
    if (emailExists) {
      return createErrorResponse("邮箱已存在", 400);
    }

    // 检查用户名是否已存在
    const usernameExists = await UserService.existsByUsername(username);
    if (usernameExists) {
      return createErrorResponse("用户名已存在", 400);
    }

    const userId = await UserService.create(username, email);

    return createSuccessResponse({
      id: userId,
      username,
      email,
      message: "用户创建成功"
    }, "用户创建成功");
  } catch (error) {
    console.error("创建用户失败:", error);
    return createErrorResponse("创建用户失败", 500);
  }
}