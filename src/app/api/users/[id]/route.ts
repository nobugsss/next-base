import { NextRequest, NextResponse } from "next/server";
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

// 获取单个用户
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // 验证ID参数
    const idValidation = Validator.validateId(id);
    if (!idValidation.isValid) {
      return createErrorResponse(idValidation.errors.join(', '), 400);
    }

    const user = await UserService.findById(idValidation.numericId!);
    if (!user) {
      return createErrorResponse("用户不存在", 404);
    }

    return createSuccessResponse(user, "获取用户成功");
  } catch (error) {
    console.error("获取用户失败:", error);
    return createErrorResponse("获取用户失败", 500);
  }
}

// 更新用户
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // 验证ID参数
    const idValidation = Validator.validateId(id);
    if (!idValidation.isValid) {
      return createErrorResponse(idValidation.errors.join(', '), 400);
    }

    // 验证用户数据
    const validation = Validator.validateUser(body);
    if (!validation.isValid) {
      return createErrorResponse(validation.errors.join(', '), 400);
    }

    const { username, email } = body;

    // 检查用户是否存在
    const existingUser = await UserService.findById(idValidation.numericId!);
    if (!existingUser) {
      return createErrorResponse("用户不存在", 404);
    }

    // 检查邮箱是否被其他用户使用
    if (email !== (existingUser as { email: string }).email) {
      const emailExists = await UserService.existsByEmail(email);
      if (emailExists) {
        return createErrorResponse("邮箱已被其他用户使用", 400);
      }
    }

    // 检查用户名是否被其他用户使用
    if (username !== (existingUser as { username: string }).username) {
      const usernameExists = await UserService.existsByUsername(username);
      if (usernameExists) {
        return createErrorResponse("用户名已被其他用户使用", 400);
      }
    }

    const affectedRows = await UserService.update(idValidation.numericId!, username, email);
    if (affectedRows === 0) {
      return createErrorResponse("用户更新失败", 500);
    }

    return createSuccessResponse({
      id: idValidation.numericId,
      username,
      email,
      message: "用户更新成功"
    }, "用户更新成功");
  } catch (error) {
    console.error("更新用户失败:", error);
    return createErrorResponse("更新用户失败", 500);
  }
}

// 删除用户
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // 验证ID参数
    const idValidation = Validator.validateId(id);
    if (!idValidation.isValid) {
      return createErrorResponse(idValidation.errors.join(', '), 400);
    }

    // 检查用户是否存在
    const existingUser = await UserService.findById(idValidation.numericId!);
    if (!existingUser) {
      return createErrorResponse("用户不存在", 404);
    }

    const affectedRows = await UserService.delete(idValidation.numericId!);
    if (affectedRows === 0) {
      return createErrorResponse("用户删除失败", 500);
    }

    return createSuccessResponse({
      message: "用户删除成功"
    }, "用户删除成功");
  } catch (error) {
    console.error("删除用户失败:", error);
    return createErrorResponse("删除用户失败", 500);
  }
}
