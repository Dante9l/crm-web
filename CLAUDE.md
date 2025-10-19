# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 + TypeScript 的客户关系管理系统(CRM)，采用现代化的前端技术栈，具有完整的权限管理体系和业务模块。

## 常用命令

### 开发环境

```bash
# 安装依赖
npm install 或 pnpm install

# 启动开发服务器 (端口4000)
npm run dev 或 pnpm run dev

# 类型检查
npm run ts:check

# 代码质量检查
npm run lint:eslint      # ESLint检查
npm run lint:prettier   # Prettier格式化
npm run lint:style      # Stylelint样式检查
```

### 构建部署

```bash
# 开发环境构建 (包含类型检查)
npm run build-dev

# 测试环境构建
npm run build-test

# 生产环境构建
npm run build-pro

# 预览构建结果
npm run serve:dev     # 预览开发环境构建
npm run serve:test     # 预览测试环境构建
npm run serve:pro      # 预览生产环境构建
```

### 其他工具

```bash
# 清理依赖和缓存
npm run clean         # 删除node_modules
npm run clean:cache   # 删除缓存文件

# 分析WindiCSS使用情况
npm run analysis

# Git提交规范化
npm run prepare       # 安装husky钩子
npm run lint:lint-staged  # 运行lint-staged
```

## 核心架构

### 技术栈

- **前端框架**: Vue 3.3.4 + TypeScript 5.2.2
- **构建工具**: Vite 4.1.4
- **UI 组件库**: Element Plus 2.5.6
- **样式框架**: WindiCSS 3.5.6
- **状态管理**: Pinia 2.1.7 (支持持久化)
- **路由管理**: Vue Router 4.2.1 (动态路由)
- **HTTP 客户端**: Axios 1.6.3

### 目录结构关键点

- `src/api/modules/` - 按业务模块组织的 API 接口
- `src/components/ProTable/` - 增强型表格组件，支持搜索、分页、操作
- `src/configs/enum.ts` - 业务枚举定义，包含客户等级、来源、状态等
- `src/store/modules/` - Pinia 状态管理模块
- `src/views/` - 页面组件，按业务模块组织

### 核心组件架构

#### ProTable 组件系统

这是项目的核心表格组件，位于 `src/components/ProTable/index.vue`，提供：

- 自动分页和数据请求
- 搜索表单集成
- 列配置和显示控制
- 选择和批量操作
- 打印功能

#### Dialog 组件系统

- `src/components/Dialog/index.vue` - 基础弹窗组件
- `src/views/System/components/CustomerDialog.vue` - 客户信息表单弹窗

## 权限系统架构

### 动态路由系统

基于 RBAC 模型的权限控制：

1. 用户登录后获取菜单权限 (`getAuthMenuListApi`)
2. 动态生成路由 (`initDynamicRouter`)
3. 路由守卫验证访问权限 (`router.beforeEach`)
4. 按钮权限控制 (`getAuthButtonListApi`)

### 权限状态管理

- `store/modules/permission.ts` - 管理菜单、路由名称、按钮权限
- `store/modules/app.ts` - 管理用户 token 和基础应用状态

## 业务模块设计

### 客户管理模块

- **API 模块**: `src/api/modules/customer/index.ts`
- **页面**: `src/views/Customer/CustomerManage.vue`
- **表单**: `src/views/System/components/CustomerDialog.vue`
- **特殊功能**: 公海/私海客户流转 (`toPublic`, `toPrivate`)

### 产品管理模块

- **API 模块**: `src/api/modules/product/index.ts`
- **页面**: `src/views/Product/ProductManage.vue`
- **状态管理**: `src/configs/enum.ts` 中的 `ProductStatus` 枚举

### 系统管理模块

- 部门管理、角色管理、菜单管理、用户管理
- 统一使用 ProTable 组件展示数据
- 统一的 CRUD 操作模式

## API 架构设计

### 请求配置

- 基础路径配置在环境变量文件中
- 开发环境代理: `/dev` -> `http://127.0.0.1:8081`
- 统一的错误处理和响应拦截

### API 模块规范

每个业务模块的 API 都遵循统一模式：

```typescript
export const ModuleApi = {
  page: (params: any) => http.post(`${COMMON_ADMIN_API}/module/page`, params),
  saveOrEdit: (params: any) => http.post(`${COMMON_ADMIN_API}/module/saveOrEdit`, params),
  remove: (params: any) => http.post(`${COMMON_ADMIN_API}/module/remove`, params)
}
```

## 开发规范

### 枚举使用

所有业务相关的枚举定义在 `src/configs/enum.ts`：

- 使用 TypeScript enum 定义值
- 提供对应的 List 映射，用于下拉选择
- 在 ProTable 中自动转换为可读标签

### 组件开发模式

1. 页面级组件使用 Composition API
2. 业务组件复用 ProTable 和 Dialog
3. 表单验证规则统一在组件内定义
4. 使用 TypeScript 接口定义 props 和事件

### 状态管理模式

- 使用 Pinia 进行状态管理
- 支持持久化存储 (`pinia-plugin-persistedstate`)
- 模块化组织，每个业务领域独立模块

## 环境配置

### 端口和代理

- 开发服务器端口: 4000
- API 代理: `/dev` -> `http://127.0.0.1:8081`
- 支持多环境构建: dev/test/pro

### 构建优化

- 使用 Terser 进行代码压缩
- 支持 source map 配置
- 可配置移除 console 和 debugger

## Git 工作流

### 提交规范

项目使用 Commitizen 进行提交规范化，支持的提交类型：

- `feat`: 新增功能
- `fix`: 修复缺陷
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建相关
- `chore`: 其他修改

### 代码质量检查

- Husky Git 钩子自动运行
- lint-staged 在提交前检查暂存文件
- ESLint + Prettier + Stylelint 三重检查

## 特殊注意事项

### ProTable 使用要点

- `columns` 配置是核心，定义表格列和行为
- `requestApi` 用于自动数据请求
- `dataCallback` 可以处理返回数据格式
- `initParam` 设置初始搜索参数

### 动态路由实现

- 首次访问时从后端获取菜单数据
- 将菜单转换为路由配置
- 使用 Vue Router 的 addRoute 动态添加
- 支持路由级别的权限控制

### 国际化支持

- 使用 Vue I18n 进行多语言支持
- 语言文件位于 `src/locales/`
- 支持语言切换功能

### 图标系统

- 使用 Element Plus Icons
- 支持自定义 SVG 图标 (`src/assets/icons/`)
- 通过 vite-plugin-svg-icons 处理

## 登录信息

- 超级管理员: admin / admin
- 测试账号: dong / Dong@1234
