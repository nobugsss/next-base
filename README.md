# Next.js Base 项目

这是一个基于 Next.js 15 + TypeScript + Tailwind CSS 构建的全栈项目，实现了完整的 CRUD 功能和文件管理功能。

## 功能特性

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
- 文件类型和大小显示

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

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: MySQL
- **文件上传**: Multer
- **数据库连接**: mysql2

## 环境要求

- Node.js 18+
- MySQL 5.7+
- pnpm (推荐) 或 npm

## 安装和运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env.local` 文件（推荐）或 `.env` 文件：

> **注意**:
>
> - `.env.local` 文件会被 git 忽略，适合存储敏感信息如数据库密码
> - `.env` 文件也会被 git 忽略（项目已配置），适合本地开发
> - 如果需要共享环境变量模板，可以创建 `.env.example` 文件

**环境变量说明**：

- `PORT`: 服务器端口号（默认 3000）
- `DB_HOST`: MySQL 数据库主机地址
- `DB_PORT`: MySQL 数据库端口号
- `DB_USER`: MySQL 数据库用户名
- `DB_PASSWORD`: MySQL 数据库密码
- `DB_NAME`: 数据库名称
- `UPLOAD_DIR`: 文件上传目录（相对于项目根目录）

### 3. 初始化数据库

```bash
# 使用 TypeScript 运行数据库初始化脚本
npx tsx scripts/init-database.ts
```

### 4. 启动开发服务器

```bash
pnpm run dev
```

访问 http://localhost:3000 查看应用。

## API 接口

### 时间相关

- `GET /api/time/time` - 获取服务器时间
- `GET /api/time/health` - 服务健康状态

### 文件管理

- `GET /api/files/files` - 获取文件列表
- `GET /api/files/files/:filename` - 下载文件
- `POST /api/upload/single` - 单文件上传
- `POST /api/upload/multiple` - 多文件上传

### 用户管理

- `GET /api/users` - 获取用户列表（支持分页）
- `GET /api/users/:id` - 获取单个用户
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 产品管理

- `GET /api/products` - 获取产品列表（支持分页和分类筛选）
- `GET /api/products/:id` - 获取单个产品
- `POST /api/products` - 创建产品
- `PUT /api/products/:id` - 更新产品
- `DELETE /api/products/:id` - 删除产品

### 分类管理

- `GET /api/categories` - 获取分类列表

## 项目结构

```
src/
├── app/
│   ├── api/                 # API 路由
│   │   ├── time/           # 时间相关 API
│   │   ├── files/          # 文件管理 API
│   │   ├── upload/         # 文件上传 API
│   │   ├── users/          # 用户管理 API
│   │   ├── products/       # 产品管理 API
│   │   └── categories/     # 分类管理 API
│   ├── calendar/           # 日历页面
│   ├── calculator/          # 计算器页面
│   ├── upload/              # 文件上传页面
│   ├── server-time/         # 服务器时间页面
│   ├── download/            # 文件下载页面
│   ├── database/            # 数据库管理页面
│   ├── layout.tsx           # 布局组件
│   └── page.tsx             # 首页
├── lib/
│   └── database.ts          # 数据库连接配置
└── scripts/
    └── init-database.ts     # 数据库初始化脚本
```

## 开发说明

1. **数据库连接**: 使用连接池管理数据库连接
2. **文件上传**: 支持单文件和多文件上传，文件保存在 `uploads` 目录
3. **错误处理**: 统一的错误处理和响应格式
4. **类型安全**: 完整的 TypeScript 类型定义
5. **响应式设计**: 使用 Tailwind CSS 实现响应式布局

## 注意事项

1. **数据库配置**：
   - 确保 MySQL 服务正在运行
   - 确保数据库用户有足够的权限
   - 根据实际情况修改数据库连接信息

2. **环境变量**：
   - 创建 `.env.local` 文件存储本地配置
   - 生产环境请修改默认密码和配置
   - 不要将包含敏感信息的 `.env` 文件提交到 git

3. **文件权限**：
   - 文件上传目录需要有写入权限
   - 确保 `uploads` 目录存在或可创建

4. **开发环境**：
   - 使用 `pnpm run dev` 启动开发服务器
   - 开发模式下支持热重载
   - API 路由在 `/api` 路径下可用

## 许可证

MIT License
