import { NextResponse } from 'next/server';

// 健康检查
export async function GET() {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        uptime: Math.round(uptime),
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, message: '健康检查失败' },
      { status: 500 }
    );
  }
}
