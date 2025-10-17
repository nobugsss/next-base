'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface UploadResult {
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadTime: string;
}

export default function UploadPage() {
  const [uploadType, setUploadType] = useState<'single' | 'multiple'>('single');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      setError('请选择要上传的文件');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      
      if (uploadType === 'single') {
        formData.append('file', files[0]);
      } else {
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
      }

      const endpoint = uploadType === 'single' ? '/api/upload/single' : '/api/upload/multiple';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        if (uploadType === 'single') {
          setUploadResult([data.data]);
        } else {
          setUploadResult(data.data.files);
        }
      } else {
        setError(data.message || '上传失败');
      }
    } catch {
      setError('网络请求失败');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            📤 文件上传
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* 上传类型选择 */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                选择上传类型
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setUploadType('single')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    uploadType === 'single'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  单文件上传
                </button>
                <button
                  onClick={() => setUploadType('multiple')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    uploadType === 'multiple'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  多文件上传
                </button>
              </div>
            </div>

            {/* 文件上传区域 */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200"
            >
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                拖拽文件到此处或点击选择文件
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {uploadType === 'single' ? '选择一个文件上传' : '选择多个文件上传'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple={uploadType === 'multiple'}
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                选择文件
              </button>
            </div>

            {/* 上传状态 */}
            {uploading && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  上传中...
                </div>
              </div>
            )}

            {/* 错误信息 */}
            {error && (
              <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* 上传结果 */}
            {uploadResult && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  上传成功！
                </h3>
                <div className="space-y-3">
                  {uploadResult.map((file, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            {file.originalName}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            大小: {formatFileSize(file.size)} | 类型: {file.type}
                          </p>
                          <p className="text-xs text-green-500 dark:text-green-500">
                            上传时间: {new Date(file.uploadTime).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <div className="text-green-600 dark:text-green-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 使用说明 */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                使用说明：
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• 支持拖拽文件到上传区域</li>
                <li>• 点击&quot;选择文件&quot;按钮选择文件</li>
                <li>• 单文件上传：一次只能选择一个文件</li>
                <li>• 多文件上传：可以同时选择多个文件</li>
                <li>• 上传成功后文件会保存到服务器</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
