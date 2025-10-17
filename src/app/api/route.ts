import { NextResponse } from "next/server";

// 根路径 - 获取API基本信息
export async function GET() {
	return NextResponse.json({
		message: "Next.js Base API 服务运行中",
		version: "1.0.0",
		timestamp: new Date().toISOString(),
		endpoints: {
			time: {
				"/api/time/time": "GET - 获取服务器时间",
				"/api/time/health": "GET - 服务健康状态"
			},
			files: {
				"/api/files/files": "GET - 获取上传文件列表",
				"/api/files/files/:filename": "GET - 下载指定文件"
			},
			upload: {
				"/api/upload/single": "POST - 上传单个文件",
				"/api/upload/multiple": "POST - 上传多个文件"
			},
			users: {
				"GET /api/users": "获取用户列表（支持分页）",
				"GET /api/users/:id": "获取单个用户信息",
				"POST /api/users": "创建新用户",
				"PUT /api/users/:id": "更新用户信息",
				"DELETE /api/users/:id": "删除用户"
			},
			products: {
				"GET /api/products": "获取产品列表（支持分页和分类筛选）",
				"GET /api/products/:id": "获取单个产品信息",
				"POST /api/products": "创建新产品",
				"PUT /api/products/:id": "更新产品信息",
				"DELETE /api/products/:id": "删除产品"
			}
		}
	});
}
