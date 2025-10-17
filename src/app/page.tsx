import Link from "next/link";

export default function Home() {
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 日历功能 */}
          <Link href="/calendar" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                日历
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                选择任意年份、月份和日期，显示完整日历和日期格式
              </p>
            </div>
          </Link>

          {/* 计算器功能 */}
          <Link href="/calculator" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                计算器
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                无需服务器交互的本地计算器
              </p>
            </div>
          </Link>

          {/* 文件上传功能 */}
          <Link href="/upload" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                文件上传
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                上传单个或多个文件到服务器
              </p>
            </div>
          </Link>

          {/* 服务器时间功能 */}
          <Link href="/server-time" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                服务器时间
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                获取并显示服务器时间，支持刷新
              </p>
            </div>
          </Link>

          {/* 文件下载功能 */}
          <Link href="/download" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                文件下载
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                查看和下载已上传的文件
              </p>
            </div>
          </Link>

          {/* 数据库管理功能 */}
          <Link href="/database" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🗄️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                数据库管理
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                用户和产品的增删改查操作
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            基于 Next.js 15 + TypeScript + Tailwind CSS 构建
          </p>
        </div>
      </div>
    </div>
  );
}
