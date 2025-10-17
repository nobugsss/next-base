// 验证工具类
import { ReadonlyURLSearchParams } from 'next/navigation';

export class Validator {
  // 验证用户数据
  static validateUser(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 类型检查
    if (!data || typeof data !== 'object' || data === null) {
      errors.push('数据格式不正确');
      return { isValid: false, errors };
    }

    const userData = data as Record<string, unknown>;

    if (!userData.username || typeof userData.username !== 'string' || userData.username.trim().length === 0) {
      errors.push('用户名不能为空');
    } else if (userData.username.length < 3 || userData.username.length > 50) {
      errors.push('用户名长度必须在3-50个字符之间');
    }

    if (!userData.email || typeof userData.email !== 'string' || userData.email.trim().length === 0) {
      errors.push('邮箱不能为空');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('邮箱格式不正确');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 验证产品数据
  static validateProduct(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 类型检查
    if (!data || typeof data !== 'object' || data === null) {
      errors.push('数据格式不正确');
      return { isValid: false, errors };
    }

    const productData = data as Record<string, unknown>;

    if (!productData.name || typeof productData.name !== 'string' || productData.name.trim().length === 0) {
      errors.push('产品名称不能为空');
    } else if (productData.name.length > 200) {
      errors.push('产品名称不能超过200个字符');
    }

    if (productData.description && typeof productData.description !== 'string') {
      errors.push('产品描述必须是字符串');
    }

    if (!productData.price || typeof productData.price !== 'number' || productData.price <= 0) {
      errors.push('产品价格必须是大于0的数字');
    }

    if (productData.stock !== undefined && (typeof productData.stock !== 'number' || productData.stock < 0)) {
      errors.push('库存必须是非负整数');
    }

    if (productData.category_id !== undefined && productData.category_id !== null && (typeof productData.category_id !== 'number' || productData.category_id <= 0)) {
      errors.push('分类ID必须是正整数');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 验证分类数据
  static validateCategory(data: unknown): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 类型检查
    if (!data || typeof data !== 'object' || data === null) {
      errors.push('数据格式不正确');
      return { isValid: false, errors };
    }

    const categoryData = data as Record<string, unknown>;

    if (!categoryData.name || typeof categoryData.name !== 'string' || categoryData.name.trim().length === 0) {
      errors.push('分类名称不能为空');
    } else if (categoryData.name.length > 100) {
      errors.push('分类名称不能超过100个字符');
    }

    if (categoryData.description && typeof categoryData.description !== 'string') {
      errors.push('分类描述必须是字符串');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 验证分页参数
  static validatePagination(searchParams: ReadonlyURLSearchParams | URLSearchParams): { isValid: boolean; errors: string[]; page: number; limit: number } {
    const errors: string[] = [];
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (isNaN(page) || page < 1) {
      errors.push('页码必须是大于0的整数');
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('每页数量必须是1-100之间的整数');
    }

    return {
      isValid: errors.length === 0,
      errors,
      page,
      limit
    };
  }

  // 验证ID参数
  static validateId(id: string): { isValid: boolean; errors: string[]; numericId?: number } {
    const errors: string[] = [];
    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      errors.push('ID必须是正整数');
    }

    return {
      isValid: errors.length === 0,
      errors,
      numericId: errors.length === 0 ? numericId : undefined
    };
  }

  // 验证文件上传
  static validateFileUpload(file: File | null): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!file) {
      errors.push('没有上传文件');
      return { isValid: false, errors };
    }

    // 文件大小限制 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('文件大小不能超过10MB');
    }

    // 文件类型限制
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push('不支持的文件类型');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 邮箱格式验证
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 清理字符串输入
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  // 清理数字输入
  static sanitizeNumber(input: unknown): number | null {
    if (typeof input === 'number') {
      return isNaN(input) ? null : input;
    }
    if (typeof input === 'string') {
      const num = parseFloat(input);
      return isNaN(num) ? null : num;
    }
    return null;
  }
}
