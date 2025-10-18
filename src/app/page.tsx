import Link from "next/link";
import { Metadata } from "next";

// 服务器端元数据
export const metadata: Metadata = {
  title: "Next.js Base - 全栈项目模板",
  description: "基于 Next.js 15 + TypeScript + Tailwind CSS 构建的全栈项目，包含完整的 CRUD 功能和文件管理功能",
};

// 服务器组件 - 获取当前时间
async function getCurrentTime() {
  const now = new Date();
  return {
    date: now.toLocaleDateString('zh-CN'),
    time: now.toLocaleTimeString('zh-CN'),
    timestamp: now.getTime()
  };
}

// 功能卡片组件
function FeatureCard({ 
  href, 
  emoji, 
  title, 
  description 
}: { 
  href: string; 
  emoji: string; 
  title: string; 
  description: string; 
}) {
  return (
    <Link href={href} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
        <div className="text-4xl mb-4">{emoji}</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default async function Home() {
  // 服务器端获取当前时间
  const currentTime = await getCurrentTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Hello World! 🌍
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            欢迎来到 Next.js Base 项目
          </p>
          
          {/* 服务器端渲染的当前时间 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md mx-auto mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🕐 服务器时间
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              日期: {currentTime.date}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              时间: {currentTime.time}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              时间戳: {currentTime.timestamp}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            href="/calendar"
            emoji="📅"
            title="日历"
            description="选择任意年份、月份和日期，显示完整日历和日期格式"
          />

          <FeatureCard
            href="/calculator"
            emoji="🧮"
            title="计算器"
            description="无需服务器交互的本地计算器"
          />

          <FeatureCard
            href="/upload"
            emoji="📤"
            title="文件上传"
            description="上传单个或多个文件到服务器"
          />

          <FeatureCard
            href="/server-time"
            emoji="⏰"
            title="服务器时间"
            description="获取并显示服务器时间，支持刷新"
          />

          <FeatureCard
            href="/download"
            emoji="📥"
            title="文件下载"
            description="查看和下载已上传的文件"
          />

          <FeatureCard
            href="/database"
            emoji="🗄️"
            title="数据库管理"
            description="用户和产品的增删改查操作"
          />

          <FeatureCard
            href="/database-overview"
            emoji="📊"
            title="数据库概览"
            description="服务器组件和客户端组件混合使用示例"
          />
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            基于 Next.js 15 + TypeScript + Tailwind CSS 构建
          </p>
          {/* <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            📊 数据库概览、⏰ 服务器时间、📥 文件下载 已优化为混合架构
          </p> */}
        </div>
      </div>
    </div>
  );
}
