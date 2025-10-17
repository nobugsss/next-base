import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

// 获取文件列表
export async function GET() {
  try {
    const files = await readdir(UPLOAD_DIR);
    const fileList = [];
    
    for (const file of files) {
      const filePath = join(UPLOAD_DIR, file);
      const stats = await stat(filePath);
      
      if (stats.isFile()) {
        fileList.push({
          filename: file,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString()
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: fileList
    });
  } catch (error) {
    console.error('获取文件列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取文件列表失败' },
      { status: 500 }
    );
  }
}
