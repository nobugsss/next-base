'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServerTimeData {
  datetime: string;
  timestamp: number;
  timezone: string;
}

export default function ServerTimePage() {
  const [serverTime, setServerTime] = useState<ServerTimeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServerTime = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/time/time');
      const data = await response.json();
      
      if (data.success) {
        setServerTime(data.data);
      } else {
        setError(data.message || '获取服务器时间失败');
      }
    } catch (err) {
      setError('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取时间
  useEffect(() => {
    fetchServerTime();
  }, []);

  // 格式化时间显示
  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
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

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            ⏰ 服务器时间
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* 刷新按钮 */}
            <div className="text-center mb-6">
              <button
                onClick={fetchServerTime}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center mx-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    获取中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    刷新时间
                  </>
                )}
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

            {/* 服务器时间显示 */}
            {serverTime && (
              <div className="space-y-6">
                {/* 主要时间显示 */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {formatTime(serverTime.datetime)}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    服务器时间
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      ISO 格式
                    </h3>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">
                      {serverTime.datetime}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      时间戳
                    </h3>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">
                      {serverTime.timestamp}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      时区
                    </h3>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">
                      {serverTime.timezone}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      本地时间
                    </h3>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">
                      {formatTimestamp(serverTime.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 自动刷新说明 */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                说明：
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• 点击"刷新时间"按钮获取最新的服务器时间</li>
                <li>• 服务器时间基于服务器所在时区</li>
                <li>• 时间戳为 Unix 时间戳（毫秒）</li>
                <li>• 本地时间根据您的浏览器时区显示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
