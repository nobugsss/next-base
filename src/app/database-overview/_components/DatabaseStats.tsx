'use client';

import { useState } from 'react';
import { User, Product } from '@/types/api';

interface DatabaseStatsProps {
  initialStats: {
    userCount: number;
    productCount: number;
    categoryCount: number;
    lastUpdated: string;
    error?: string;
  };
  latestUsers: User[];
  latestProducts: Product[];
}

export function DatabaseStats({ initialStats, latestUsers, latestProducts }: DatabaseStatsProps) {
  const [stats, setStats] = useState(initialStats);
  const [users, setUsers] = useState(latestUsers);
  const [products, setProducts] = useState(latestProducts);
  const [loading, setLoading] = useState(false);

  const refreshStats = async () => {
    setLoading(true);
    try {
      const [usersResponse, productsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/users?page=1&limit=1'),
        fetch('/api/products?page=1&limit=1'),
        fetch('/api/categories')
      ]);

      const [usersData, productsData, categoriesData] = await Promise.all([
        usersResponse.json(),
        productsResponse.json(),
        categoriesResponse.json()
      ]);

      if (usersData.success && productsData.success && categoriesData.success) {
        setStats({
          userCount: usersData.data.pagination.total,
          productCount: productsData.data.pagination.total,
          categoryCount: categoriesData.data.length,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('刷新统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshLatestData = async () => {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        fetch('/api/users?page=1&limit=5'),
        fetch('/api/products?page=1&limit=5')
      ]);

      const [usersData, productsData] = await Promise.all([
        usersResponse.json(),
        productsResponse.json()
      ]);

      if (usersData.success && productsData.success) {
        setUsers(usersData.data.data);
        setProducts(productsData.data.data);
      }
    } catch (error) {
      console.error('刷新最新数据失败:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">用户总数</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.userCount}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">产品总数</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.productCount}</p>
            </div>
            <div className="text-4xl">🛍️</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">分类总数</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.categoryCount}</p>
            </div>
            <div className="text-4xl">📂</div>
          </div>
        </div>
      </div>

      {/* 刷新按钮 */}
      <div className="text-center">
        <button
          onClick={() => {
            refreshStats();
            refreshLatestData();
          }}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center mx-auto"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              刷新中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新数据
            </>
          )}
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          最后更新: {new Date(stats.lastUpdated).toLocaleString('zh-CN')}
        </p>
      </div>

      {/* 最新数据 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新用户 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            最新用户
          </h3>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最新产品 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            最新产品
          </h3>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">¥{product.price}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(product.created_at).toLocaleDateString('zh-CN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
