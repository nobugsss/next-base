// API 响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// 分页响应类型
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// 产品类型
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number | null;
  category_name?: string;
  created_at: string;
  updated_at: string;
}

// 分类类型
export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 文件上传响应类型
export interface FileUploadResponse {
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadTime: string;
}

// 请求验证错误类型
export interface ValidationError {
  field: string;
  message: string;
}

// 中间件配置类型
export interface MiddlewareConfig {
  enableCors?: boolean;
  enableRateLimit?: boolean;
  enableLogging?: boolean;
  enableAuth?: boolean;
}

// 数据库查询选项
export interface QueryOptions {
  page?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}
