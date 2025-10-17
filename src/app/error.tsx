'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error('应用错误:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          出现错误
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          抱歉，应用遇到了一个错误。请尝试刷新页面或联系管理员。
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            重试
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            返回首页
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
              错误详情 (开发模式)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
