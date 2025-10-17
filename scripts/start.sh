#!/bin/bash

# Next.js Base 项目快速启动脚本
# 使用方法: ./scripts/start.sh

echo "🚀 启动 Next.js Base 项目..."

# 检查 Node.js 版本
echo "📋 检查环境..."
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $node_version"

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  未找到 pnpm，尝试使用 npm..."
    PACKAGE_MANAGER="npm"
else
    echo "✅ 找到 pnpm"
    PACKAGE_MANAGER="pnpm"
fi

# 检查环境变量文件
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  未找到环境变量文件，正在创建..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ 已创建 .env.local 文件，请编辑其中的配置"
        echo "📝 请确保数据库配置正确，然后重新运行此脚本"
        exit 1
    else
        echo "❌ 错误: 未找到 .env.example 文件"
        exit 1
    fi
fi

# 安装依赖
echo "📦 安装依赖..."
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 初始化数据库
echo "🗄️  初始化数据库..."
npx tsx scripts/init-database.ts

if [ $? -ne 0 ]; then
    echo "❌ 数据库初始化失败，请检查数据库配置"
    exit 1
fi

echo "✅ 数据库初始化完成"

# 启动开发服务器
echo "🌐 启动开发服务器..."
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm run dev
else
    npm run dev
fi
