'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number | null;
  category_name: string | null;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 表单状态
  const [showUserForm, setShowUserForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // 用户表单
  const [userForm, setUserForm] = useState({
    username: '',
    email: ''
  });
  
  // 产品表单
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.data);
      }
    } catch (err) {
      console.error('获取用户列表失败:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.data);
      }
    } catch (err) {
      console.error('获取产品列表失败:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('获取分类列表失败:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchCategories();
  }, []);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowUserForm(false);
        setEditingUser(null);
        setUserForm({ username: '', email: '' });
        fetchUsers();
      } else {
        setError(data.message || '操作失败');
      }
    } catch {
      setError('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          category_id: productForm.category_id ? parseInt(productForm.category_id) : null,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({ name: '', description: '', price: '', stock: '', category_id: '' });
        fetchProducts();
      } else {
        setError(data.message || '操作失败');
      }
    } catch {
      setError('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
      } else {
        setError(data.message || '删除失败');
      }
    } catch {
      setError('网络请求失败');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('确定要删除这个产品吗？')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchProducts();
      } else {
        setError(data.message || '删除失败');
      }
    } catch {
      setError('网络请求失败');
    }
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email
    });
    setShowUserForm(true);
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id?.toString() || ''
    });
    setShowProductForm(true);
  };

  const resetForms = () => {
    setShowUserForm(false);
    setShowProductForm(false);
    setEditingUser(null);
    setEditingProduct(null);
    setUserForm({ username: '', email: '' });
    setProductForm({ name: '', description: '', price: '', stock: '', category_id: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            ← 返回首页
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            🗄️ 数据库管理
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* 标签页 */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'users'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                用户管理
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === 'products'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                产品管理
              </button>
            </div>

            {/* 错误信息 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* 用户管理 */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    用户列表
                  </h2>
                  <button
                    onClick={() => {
                      resetForms();
                      setShowUserForm(true);
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    添加用户
                  </button>
                </div>

                {/* 用户表格 */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">用户名</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">邮箱</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">创建时间</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{user.id}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{user.username}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {new Date(user.created_at).toLocaleString('zh-CN')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => editUser(user)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors duration-200"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors duration-200"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 用户表单 */}
                {showUserForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {editingUser ? '编辑用户' : '添加用户'}
                      </h3>
                      <form onSubmit={handleUserSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              用户名
                            </label>
                            <input
                              type="text"
                              value={userForm.username}
                              onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              邮箱
                            </label>
                            <input
                              type="email"
                              value={userForm.email}
                              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            type="button"
                            onClick={resetForms}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
                          >
                            取消
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors duration-200"
                          >
                            {loading ? '保存中...' : '保存'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 产品管理 */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    产品列表
                  </h2>
                  <button
                    onClick={() => {
                      resetForms();
                      setShowProductForm(true);
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    添加产品
                  </button>
                </div>

                {/* 产品表格 */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">名称</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">价格</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">库存</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">分类</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{product.id}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{product.name}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">¥{product.price}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{product.stock}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{product.category_name || '无'}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => editProduct(product)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors duration-200"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors duration-200"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 产品表单 */}
                {showProductForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {editingProduct ? '编辑产品' : '添加产品'}
                      </h3>
                      <form onSubmit={handleProductSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              产品名称
                            </label>
                            <input
                              type="text"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              描述
                            </label>
                            <textarea
                              value={productForm.description}
                              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              价格
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              库存
                            </label>
                            <input
                              type="number"
                              value={productForm.stock}
                              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              分类
                            </label>
                            <select
                              value={productForm.category_id}
                              onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">选择分类</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                          <button
                            type="button"
                            onClick={resetForms}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
                          >
                            取消
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors duration-200"
                          >
                            {loading ? '保存中...' : '保存'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
