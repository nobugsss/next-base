import Link from "next/link";
import { Metadata } from "next";
import { ServerTimeClient } from "./_components/ServerTimeClient";

// 服务器端元数据
export const metadata: Metadata = {
  title: "服务器时间 - Next.js Base",
  description: "获取并显示服务器时间，支持手动刷新",
};

// 服务器组件 - 获取初始服务器时间
async function getInitialServerTime() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/time/time`, {
      cache: 'no-store' // 确保获取最新时间
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch server time');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('获取服务器时间失败:', error);
    return null;
  }
}

export default async function ServerTimePage() {
  // 服务器端获取初始时间
  const initialServerTime = await getInitialServerTime();

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

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            ⏰ 服务器时间
          </h1>

          {/* 服务器端渲染的初始时间 */}
          {initialServerTime && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                服务器端渲染时间
              </h2>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {new Date(initialServerTime.datetime).toLocaleString('zh-CN')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  ISO: {initialServerTime.datetime}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  时间戳: {initialServerTime.timestamp}
                </div>
              </div>
            </div>
          )}

          {/* 客户端交互组件 */}
          <ServerTimeClient />

          {/* 架构说明 */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              架构说明：
            </h3>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 初始时间在服务器端获取和渲染（更好的 SEO 和首屏性能）</li>
              <li>• 刷新功能通过客户端组件实现（用户交互）</li>
              <li>• 混合架构既保证了性能，又提供了良好的用户体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
