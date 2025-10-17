import { NextRequest, NextResponse } from 'next/server';

// Next.js 15 中间件 - 在请求到达 API 路由之前执行
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 只对 API 路由应用中间件
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 添加 CORS 头
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers });
  }

  // 记录请求日志
  console.log(`[${new Date().toISOString()}] ${request.method} ${pathname} - 开始处理`);
  
  return response;
}

// 配置中间件匹配规则
export const config = {
  matcher: [
    /*
     * 匹配所有 API 路由，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
