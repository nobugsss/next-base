import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/services";
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

// 获取产品列表（支持分页和分类筛选）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 验证分页参数
    const paginationValidation = Validator.validatePagination(searchParams);
    if (!paginationValidation.isValid) {
      return createErrorResponse(paginationValidation.errors.join(', '), 400);
    }

    const { page, limit } = paginationValidation;
    const categoryId = searchParams.get("category_id");
    
    // 验证分类ID（如果提供）
    let numericCategoryId: number | undefined;
    if (categoryId) {
      const categoryValidation = Validator.validateId(categoryId);
      if (!categoryValidation.isValid) {
        return createErrorResponse("分类ID格式不正确", 400);
      }
      numericCategoryId = categoryValidation.numericId;
    }

    const result = await ProductService.findAll({ page, limit }, numericCategoryId);

    return createSuccessResponse(result, "获取产品列表成功");
  } catch (error) {
    console.error("获取产品列表失败:", error);
    return createErrorResponse("获取产品列表失败", 500);
  }
}

// 创建产品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证产品数据
    const validation = Validator.validateProduct(body);
    if (!validation.isValid) {
      return createErrorResponse(validation.errors.join(', '), 400);
    }

    const { name, description, price, stock, category_id } = body;

    const productId = await ProductService.create(name, description, price, stock, category_id);

    return createSuccessResponse({
      id: productId,
      name,
      description,
      price,
      stock,
      category_id,
      message: "产品创建成功"
    }, "产品创建成功");
  } catch (error) {
    console.error("创建产品失败:", error);
    return createErrorResponse("创建产品失败", 500);
  }
}
