export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          加载中...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          请稍候，正在加载页面内容
        </p>
      </div>
    </div>
  );
}
