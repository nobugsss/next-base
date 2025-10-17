import pool from './database';
import { QueryOptions, PaginationResponse } from '@/types/api';

// 数据库查询工具类
export class DatabaseService {
  // 执行查询
  static async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('数据库查询错误:', error);
      throw new Error('数据库查询失败');
    }
  }

  // 执行单个查询
  static async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  // 执行插入操作
  static async insert(sql: string, params: any[] = []): Promise<number> {
    try {
      const [result] = await pool.execute(sql, params);
      return (result as any).insertId;
    } catch (error) {
      console.error('数据库插入错误:', error);
      throw new Error('数据库插入失败');
    }
  }

  // 执行更新操作
  static async update(sql: string, params: any[] = []): Promise<number> {
    try {
      const [result] = await pool.execute(sql, params);
      return (result as any).affectedRows;
    } catch (error) {
      console.error('数据库更新错误:', error);
      throw new Error('数据库更新失败');
    }
  }

  // 执行删除操作
  static async delete(sql: string, params: any[] = []): Promise<number> {
    try {
      const [result] = await pool.execute(sql, params);
      return (result as any).affectedRows;
    } catch (error) {
      console.error('数据库删除错误:', error);
      throw new Error('数据库删除失败');
    }
  }

  // 分页查询
  static async paginate<T>(
    tableName: string,
    options: QueryOptions = {},
    whereClause: string = '',
    whereParams: any[] = []
  ): Promise<PaginationResponse<T>> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'created_at',
      orderDirection = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = whereClause ? `WHERE ${whereClause}` : '';
    const order = `ORDER BY ${orderBy} ${orderDirection}`;

    // 查询数据
    const dataSql = `
      SELECT * FROM ${tableName} 
      ${where} 
      ${order} 
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...whereParams, limit.toString(), offset.toString()];
    const data = await this.query<T>(dataSql, dataParams);

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM ${tableName} ${where}`;
    const countResult = await this.queryOne<{ total: number }>(countSql, whereParams);
    const total = countResult?.total || 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 检查记录是否存在
  static async exists(tableName: string, whereClause: string, params: any[]): Promise<boolean> {
    const sql = `SELECT 1 FROM ${tableName} WHERE ${whereClause} LIMIT 1`;
    const result = await this.queryOne(sql, params);
    return result !== null;
  }

  // 获取记录数量
  static async count(tableName: string, whereClause: string = '', params: any[] = []): Promise<number> {
    const where = whereClause ? `WHERE ${whereClause}` : '';
    const sql = `SELECT COUNT(*) as total FROM ${tableName} ${where}`;
    const result = await this.queryOne<{ total: number }>(sql, params);
    return result?.total || 0;
  }
}

// 用户服务
export class UserService {
  static async findAll(options: QueryOptions = {}) {
    return DatabaseService.paginate('users', options);
  }

  static async findById(id: number) {
    return DatabaseService.queryOne('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async findByEmail(email: string) {
    return DatabaseService.queryOne('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async create(username: string, email: string) {
    return DatabaseService.insert(
      'INSERT INTO users (username, email) VALUES (?, ?)',
      [username, email]
    );
  }

  static async update(id: number, username: string, email: string) {
    return DatabaseService.update(
      'UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [username, email, id]
    );
  }

  static async delete(id: number) {
    return DatabaseService.delete('DELETE FROM users WHERE id = ?', [id]);
  }

  static async existsByEmail(email: string) {
    return DatabaseService.exists('users', 'email = ?', [email]);
  }

  static async existsByUsername(username: string) {
    return DatabaseService.exists('users', 'username = ?', [username]);
  }
}

// 产品服务
export class ProductService {
  static async findAll(options: QueryOptions = {}, categoryId?: number) {
    const whereClause = categoryId ? 'p.category_id = ?' : '';
    const whereParams = categoryId ? [categoryId] : [];
    
    const {
      page = 1,
      limit = 10,
      orderBy = 'p.created_at',
      orderDirection = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    const where = whereClause ? `WHERE ${whereClause}` : '';
    const order = `ORDER BY ${orderBy} ${orderDirection}`;

    // 查询数据（包含分类名称）
    const dataSql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ${where} 
      ${order} 
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...whereParams, limit.toString(), offset.toString()];
    const data = await DatabaseService.query(dataSql, dataParams);

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM products p ${where}`;
    const countResult = await DatabaseService.queryOne<{ total: number }>(countSql, whereParams);
    const total = countResult?.total || 0;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async findById(id: number) {
    return DatabaseService.queryOne(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [id]);
  }

  static async create(name: string, description: string, price: number, stock: number, categoryId?: number) {
    return DatabaseService.insert(
      'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, categoryId || null]
    );
  }

  static async update(id: number, name: string, description: string, price: number, stock: number, categoryId?: number) {
    return DatabaseService.update(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, price, stock, categoryId || null, id]
    );
  }

  static async delete(id: number) {
    return DatabaseService.delete('DELETE FROM products WHERE id = ?', [id]);
  }
}

// 分类服务
export class CategoryService {
  static async findAll() {
    return DatabaseService.query('SELECT * FROM categories ORDER BY name');
  }

  static async findById(id: number) {
    return DatabaseService.queryOne('SELECT * FROM categories WHERE id = ?', [id]);
  }

  static async create(name: string, description?: string) {
    return DatabaseService.insert(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
  }

  static async update(id: number, name: string, description?: string) {
    return DatabaseService.update(
      'UPDATE categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description || null, id]
    );
  }

  static async delete(id: number) {
    return DatabaseService.delete('DELETE FROM categories WHERE id = ?', [id]);
  }

  static async existsByName(name: string) {
    return DatabaseService.exists('categories', 'name = ?', [name]);
  }
}
