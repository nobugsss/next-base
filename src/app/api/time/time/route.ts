import { NextResponse } from 'next/server';

// 获取服务器时间
export async function GET() {
  try {
    const now = new Date();
    const datetime = now.toISOString();
    const timestamp = now.getTime();
    
    return NextResponse.json({
      success: true,
      data: {
        datetime,
        timestamp,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '获取时间失败' },
      { status: 500 }
    );
  }
}
