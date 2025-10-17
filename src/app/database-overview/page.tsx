import Link from "next/link";
import { Metadata } from "next";
import { UserService, ProductService, CategoryService } from "@/lib/services";
import { DatabaseStats } from "./_components/DatabaseStats";
import { ServerTimeDisplay } from "./_components/ServerTimeDisplay";

// 服务器端元数据
export const metadata: Metadata = {
  title: "数据库概览 - Next.js Base",
  description: "查看数据库统计信息和服务器状态",
};

// 服务器组件 - 获取数据库统计信息
async function getDatabaseStats() {
  try {
    const [usersResult, productsResult, categoriesResult] = await Promise.all([
      UserService.findAll({ page: 1, limit: 1 }),
      ProductService.findAll({ page: 1, limit: 1 }),
      CategoryService.findAll()
    ]);

    return {
      userCount: usersResult.pagination.total,
      productCount: productsResult.pagination.total,
      categoryCount: categoriesResult.length,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('获取数据库统计失败:', error);
    return {
      userCount: 0,
      productCount: 0,
      categoryCount: 0,
      lastUpdated: new Date().toISOString(),
      error: '获取统计信息失败'
    };
  }
}

// 服务器组件 - 获取最新数据
async function getLatestData() {
  try {
    const [usersResult, productsResult] = await Promise.all([
      UserService.findAll({ page: 1, limit: 5 }),
      ProductService.findAll({ page: 1, limit: 5 })
    ]);

    return {
      latestUsers: usersResult.data,
      latestProducts: productsResult.data
    };
  } catch (error) {
    console.error('获取最新数据失败:', error);
    return {
      latestUsers: [],
      latestProducts: []
    };
  }
}

export default async function DatabaseOverviewPage() {
  // 服务器端获取数据
  const [stats, latestData] = await Promise.all([
    getDatabaseStats(),
    getLatestData()
  ]);

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
            📊 数据库概览
          </h1>

          {/* 服务器时间显示 - 客户端组件 */}
          <div className="mb-8">
            <ServerTimeDisplay />
          </div>

          {/* 数据库统计 - 客户端组件 */}
          <div className="mb-8">
            <DatabaseStats 
              initialStats={stats}
              latestUsers={latestData.latestUsers as User[]}
              latestProducts={latestData.latestProducts as Product[]}
            />
          </div>

          {/* 服务器端渲染的静态信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              🏗️ 架构说明
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  服务器组件特性
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• 数据在服务器端获取和渲染</li>
                  <li>• 更好的 SEO 和首屏性能</li>
                  <li>• 减少客户端 JavaScript 包大小</li>
                  <li>• 直接访问数据库和服务器资源</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  客户端组件特性
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• 支持用户交互和状态管理</li>
                  <li>• 实时数据更新和刷新</li>
                  <li>• 浏览器 API 访问</li>
                  <li>• 事件处理和表单验证</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                说明：
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                此页面展示了服务器组件和客户端组件的混合使用。统计数据在服务器端获取，
                实时更新功能通过客户端组件实现。这种架构既保证了性能，又提供了良好的用户体验。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
