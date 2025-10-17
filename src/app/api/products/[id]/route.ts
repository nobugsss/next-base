import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/services";
import { Validator } from "@/lib/validator";

// 创建成功响应
function createSuccessResponse(data: unknown, message: string) {
	return NextResponse.json({
		success: true,
		data,
		message,
		timestamp: new Date().toISOString()
	});
}

// 创建错误响应
function createErrorResponse(message: string, status: number = 400) {
	return NextResponse.json({
		success: false,
		error: message,
		timestamp: new Date().toISOString()
	}, { status });
}

// 获取单个产品
async function getProduct(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		
		// 验证ID参数
		const idValidation = Validator.validateId(id);
		if (!idValidation.isValid) {
			return createErrorResponse(idValidation.errors.join(', '), 400);
		}

		const product = await ProductService.findById(idValidation.numericId!);
		if (!product) {
			return createErrorResponse("产品不存在", 404);
		}

		return createSuccessResponse(product, "获取产品成功");
	} catch (error) {
		console.error('获取产品失败:', error);
		return createErrorResponse("服务器内部错误", 500);
	}
}

// 更新产品
async function updateProduct(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const body = await request.json();
		
		// 验证ID参数
		const idValidation = Validator.validateId(id);
		if (!idValidation.isValid) {
			return createErrorResponse(idValidation.errors.join(', '), 400);
		}

		// 验证产品数据
		const validation = Validator.validateProduct(body);
		if (!validation.isValid) {
			return createErrorResponse(validation.errors.join(', '), 400);
		}

		const { name, description, price, stock, category_id } = body;

		// 检查产品是否存在
		const existingProduct = await ProductService.findById(idValidation.numericId!);
		if (!existingProduct) {
			return createErrorResponse("产品不存在", 404);
		}

		const affectedRows = await ProductService.update(
			idValidation.numericId!, 
			name, 
			description, 
			price, 
			stock, 
			category_id
		);
		
		if (affectedRows === 0) {
			return createErrorResponse("产品更新失败", 500);
		}

		return createSuccessResponse({
			id: idValidation.numericId,
			name,
			description,
			price,
			stock,
			category_id,
			message: "产品更新成功"
		}, "产品更新成功");
	} catch (error) {
		console.error('更新产品失败:', error);
		return createErrorResponse("服务器内部错误", 500);
	}
}

// 删除产品
async function deleteProduct(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		
		// 验证ID参数
		const idValidation = Validator.validateId(id);
		if (!idValidation.isValid) {
			return createErrorResponse(idValidation.errors.join(', '), 400);
		}

		// 检查产品是否存在
		const existingProduct = await ProductService.findById(idValidation.numericId!);
		if (!existingProduct) {
			return createErrorResponse("产品不存在", 404);
		}

		const affectedRows = await ProductService.delete(idValidation.numericId!);
		if (affectedRows === 0) {
			return createErrorResponse("产品删除失败", 500);
		}

		return createSuccessResponse({
			message: "产品删除成功"
		}, "产品删除成功");
	} catch (error) {
		console.error('删除产品失败:', error);
		return createErrorResponse("服务器内部错误", 500);
	}
}

// 导出处理函数
export const GET = getProduct;
export const PUT = updateProduct;
export const DELETE = deleteProduct;
