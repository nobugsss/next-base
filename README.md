# Next.js Base 项目

这是一个基于 Next.js 15 + TypeScript + Tailwind CSS 构建的全栈项目，实现了完整的 CRUD 功能和文件管理功能。项目采用现代化的架构设计，具有强大的扩展性和规范性。

## ✨ 功能特性

### 🏠 Hello World 页面
- 美观的首页设计
- 功能导航卡片
- 响应式布局

### 📅 日历组件
- 支持选择任意年份、月份和日期
- 显示完整日历网格
- 格式化日期显示（MM/DD/YYYY）
- 显示星期几

### 🧮 计算器
- 完整的四则运算功能
- 支持小数运算
- 键盘快捷键支持
- 无需服务器交互

### 📤 文件上传
- 单文件上传
- 多文件上传
- 拖拽上传支持
- 文件类型和大小验证
- 文件类型限制和大小限制

### ⏰ 服务器时间
- 实时获取服务器时间
- 支持手动刷新
- 多种时间格式显示
- 时区信息

### 📥 文件下载
- 文件列表查看
- 文件下载功能
- 文件信息显示
- 自动刷新列表

### 🗄️ 数据库管理
- 用户管理（增删改查）
- 产品管理（增删改查）
- 分类管理
- 分页支持
- 数据验证和错误处理

### 📊 数据库概览
- 服务器组件和客户端组件混合使用
- 实时数据统计和刷新
- 服务器端数据获取
- 客户端交互功能

## 🛠️ 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: MySQL
- **文件上传**: Multer
- **数据库连接**: mysql2
- **架构**: 中间件系统、服务层、验证层

## 📋 环境要求

- Node.js 18+
- MySQL 5.7+
- pnpm (推荐) 或 npm

## 🚀 快速开始

### 方法一：使用快速启动脚本（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd next-base

# 运行快速启动脚本
./scripts/start.sh
```

### 方法二：手动安装

#### 1. 安装依赖

```bash
pnpm install
# 或
npm install
```

#### 2. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置以下变量：

```env
# 服务器配置
PORT=3000                    # 服务器端口号

# 数据库配置
DB_HOST=localhost           # MySQL 数据库主机地址
DB_PORT=3306               # MySQL 数据库端口号
DB_USER=root               # MySQL 数据库用户名
DB_PASSWORD=your_password_here  # MySQL 数据库密码
DB_NAME=next_base_db       # 数据库名称

# 文件上传配置
UPLOAD_DIR=uploads         # 文件上传目录

# 应用配置
NODE_ENV=development       # 运行环境
NEXT_PUBLIC_APP_NAME="Next.js Base"      # 应用名称
NEXT_PUBLIC_APP_VERSION="0.1.0"          # 应用版本

# 安全配置（可选）
JWT_SECRET=your_jwt_secret_here          # JWT 密钥
CORS_ORIGIN=http://localhost:3000        # CORS 允许的源

# 日志配置（可选）
LOG_LEVEL=info             # 日志级别
LOG_FILE=logs/app.log      # 日志文件路径
```

> **注意**: 
> - `NEXT_PUBLIC_` 前缀的变量会在客户端可用
> - 生产环境请修改默认密码和敏感配置
> - 不要将 `.env.local` 文件提交到版本控制系统

#### 3. 初始化数据库

```bash
npx tsx scripts/init-database.ts
```

#### 4. 启动开发服务器

```bash
pnpm run dev
# 或
npm run dev
```

访问 http://localhost:3000 查看应用。

## 🚀 构建和部署

### 开发环境

```bash
# 启动开发服务器
pnpm run dev

# 启动开发服务器（使用 Turbopack）
pnpm run dev --turbopack
```

### 生产构建

```bash
# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm run start
```

### 代码检查

```bash
# 运行 ESLint 检查
pnpm run lint
```

## 📚 API 接口

### 🔧 中间件系统

项目采用 Next.js 15 标准的中间件系统，提供以下功能：
- **全局中间件**: 使用 `middleware.ts` 文件处理所有请求
- **CORS支持**: 自动处理跨域请求
- **请求日志**: 记录所有API请求信息
- **预检请求**: 自动处理 OPTIONS 请求
- **路径匹配**: 智能匹配API路由

### 📊 API 响应格式

所有API接口都遵循统一的响应格式：

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}
```

### 🕐 时间相关

- `GET /api/time/time` - 获取服务器时间
- `GET /api/time/health` - 服务健康状态

### 📁 文件管理

- `GET /api/files/files` - 获取文件列表
- `GET /api/files/files/:filename` - 下载文件
- `POST /api/upload/single` - 单文件上传
- `POST /api/upload/multiple` - 多文件上传

### 👥 用户管理

- `GET /api/users` - 获取用户列表（支持分页）
- `GET /api/users/:id` - 获取单个用户
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 🛍️ 产品管理

- `GET /api/products` - 获取产品列表（支持分页和分类筛选）
- `GET /api/products/:id` - 获取单个产品
- `POST /api/products` - 创建产品
- `PUT /api/products/:id` - 更新产品
- `DELETE /api/products/:id` - 删除产品

### 📂 分类管理

- `GET /api/categories` - 获取分类列表

## 🏗️ 项目架构

```
next-base/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   │   ├── time/       # 时间相关 API
│   │   │   ├── files/      # 文件管理 API
│   │   │   ├── upload/     # 文件上传 API
│   │   │   ├── users/      # 用户管理 API
│   │   │   ├── products/   # 产品管理 API
│   │   │   └── categories/ # 分类管理 API
│   │   ├── calendar/       # 日历页面
│   │   ├── calculator/     # 计算器页面
│   │   ├── upload/         # 文件上传页面
│   │   ├── server-time/    # 服务器时间页面
│   │   ├── download/       # 文件下载页面
│   │   ├── database/       # 数据库管理页面
│   │   ├── layout.tsx      # 根布局组件
│   │   ├── page.tsx        # 首页
│   │   ├── loading.tsx     # 全局加载页面
│   │   ├── error.tsx       # 全局错误页面
│   │   ├── not-found.tsx   # 404 页面
│   │   ├── globals.css     # 全局样式
│   │   └── favicon.ico     # 网站图标
│   ├── lib/                # 工具库
│   │   ├── database.ts     # 数据库连接配置
│   │   ├── services.ts     # 服务层
│   │   └── validator.ts     # 验证工具
│   ├── types/              # 类型定义
│   │   └── api.ts          # API 类型定义
│   └── middleware.ts        # Next.js 中间件
├── scripts/                # 脚本文件
│   ├── init-database.ts    # 数据库初始化脚本
│   └── start.sh            # 快速启动脚本
├── public/                 # 静态资源
├── uploads/                # 文件上传目录
├── .env.example            # 环境变量模板
├── next.config.ts          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖
└── README.md               # 项目文档
```

## 🔧 开发说明

### 架构特点

1. **Next.js App Router**: 使用最新的 App Router 架构
2. **服务器组件**: 默认使用服务器组件，提供更好的性能和 SEO
3. **混合架构**: 服务器组件和客户端组件的智能结合使用
4. **约定文件**: 遵循 Next.js 15 的文件命名约定
   - `layout.tsx`: 根布局组件
   - `page.tsx`: 页面组件
   - `route.ts`: API 路由处理
   - `middleware.ts`: 全局中间件
   - `loading.tsx`: 全局加载状态
   - `error.tsx`: 全局错误处理
   - `not-found.tsx`: 404 页面处理
   - `_components/`: 私有组件文件夹（不会被路由系统处理）
   - `_lib/`: 私有工具库文件夹
   - `_utils/`: 私有工具函数文件夹
5. **服务层**: 数据库操作抽象，提供统一的CRUD接口
6. **验证层**: 统一的参数验证和类型安全
7. **类型安全**: 完整的 TypeScript 类型定义
8. **错误处理**: 统一的错误处理和响应格式
9. **日志系统**: 自动记录请求和响应信息

### 数据库连接

- 使用连接池管理数据库连接
- 支持事务处理
- 自动重连机制

### 文件上传

- 支持单文件和多文件上传
- 文件保存在 `uploads` 目录
- 文件类型和大小验证
- 自动创建上传目录

### 响应式设计

- 使用 Tailwind CSS 实现响应式布局
- 移动端友好的界面设计

## ⚠️ 注意事项

### 数据库配置

1. **MySQL 服务**: 确保 MySQL 服务正在运行
2. **用户权限**: 确保数据库用户有足够的权限
3. **连接信息**: 根据实际情况修改数据库连接信息

### 环境变量

1. **本地开发**: 创建 `.env.local` 文件存储本地配置
2. **生产环境**: 修改默认密码和配置
3. **安全**: 不要将包含敏感信息的 `.env` 文件提交到 git

### 文件权限

1. **上传目录**: 文件上传目录需要有写入权限
2. **目录创建**: 确保 `uploads` 目录存在或可创建

### 开发环境

1. **启动命令**: 使用 `pnpm run dev` 启动开发服务器
2. **热重载**: 开发模式下支持热重载
3. **API 路由**: API 路由在 `/api` 路径下可用

## 🔒 安全特性

- **参数验证**: 所有输入参数都经过验证
- **SQL 注入防护**: 使用参数化查询
- **文件类型限制**: 限制可上传的文件类型
- **文件大小限制**: 限制上传文件的大小
- **错误信息**: 不暴露敏感的错误信息

## 📈 性能优化

- **数据库连接池**: 复用数据库连接
- **分页查询**: 支持大数据集的分页
- **索引优化**: 数据库表结构优化
- **缓存策略**: 可扩展的缓存机制

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License
