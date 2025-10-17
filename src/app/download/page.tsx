import Link from "next/link";
import { Metadata } from "next";
import { DownloadClient } from "./_components/DownloadClient";

// 服务器端元数据
export const metadata: Metadata = {
  title: "文件下载 - Next.js Base",
  description: "查看和下载已上传的文件",
};

// 服务器组件 - 获取初始文件列表
async function getInitialFiles() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/files/files`, {
      cache: 'no-store' // 确保获取最新文件列表
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('获取文件列表失败:', error);
    return [];
  }
}

export default async function DownloadPage() {
  // 服务器端获取初始文件列表
  const initialFiles = await getInitialFiles();

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

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            📥 文件下载
          </h1>

          {/* 服务器端渲染的初始文件列表 */}
          {initialFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                服务器端渲染文件列表
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialFiles.slice(0, 6).map((file: { filename: string; size: number; created: string }, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-900 dark:text-white font-medium text-sm truncate">
                        {file.filename}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      大小: {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      创建: {new Date(file.created).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                ))}
              </div>
              {initialFiles.length > 6 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  还有 {initialFiles.length - 6} 个文件...
                </p>
              )}
            </div>
          )}

          {/* 客户端交互组件 */}
          <DownloadClient />

          {/* 架构说明 */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              架构说明：
            </h3>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 初始文件列表在服务器端获取和渲染（更好的 SEO 和首屏性能）</li>
              <li>• 刷新和下载功能通过客户端组件实现（用户交互）</li>
              <li>• 混合架构既保证了性能，又提供了良好的用户体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 格式化文件大小
function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
