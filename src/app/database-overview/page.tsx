import Link from "next/link";
import { Metadata } from "next";
import { UserService, ProductService, CategoryService } from "@/lib/services";
import { User, Product } from "@/types/api";
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
          {/* 111 */}
        </div>
      </div>
    </div>
  );
}
