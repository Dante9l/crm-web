# CRM 系统架构文档

## 系统概述

这是一个基于 Vue 3 + TypeScript 的客户关系管理系统，采用现代化的前端技术栈，提供完整的客户管理、产品管理和系统管理功能。

## 技术栈

### 核心框架

- **前端框架**: Vue 3.3.4
- **开发语言**: TypeScript 5.2.2
- **构建工具**: Vite 5.0.8
- **UI 组件库**: Element Plus 2.4.4
- **样式框架**: WindiCSS 3.5.6

### 状态管理与数据

- **状态管理**: Pinia 2.1.7
- **HTTP 客户端**: Axios 1.6.2
- **路由管理**: Vue Router 4.2.5

### 开发工具

- **代码规范**: ESLint + Prettier
- **Git 钩子**: Husky + lint-staged
- **提交规范**: Commitizen

## 系统架构图

```mermaid
graph TB
    %% 用户界面层
    subgraph "用户界面层 (Presentation Layer)"
        A[客户管理页面] --> B[产品管理页面]
        B --> C[系统管理页面]
        C --> D[部门管理]
        C --> E[角色管理]
        C --> F[菜单管理]
        C --> G[用户管理]
    end

    %% 业务组件层
    subgraph "业务组件层 (Component Layer)"
        H[ProTable组件] --> I[CustomerDialog组件]
        I --> J[Dialog基础组件]
        H --> K[SearchForm组件]
        H --> L[TableColumn组件]
    end

    %% 业务逻辑层
    subgraph "业务逻辑层 (Business Layer)"
        M[客户管理模块] --> N[产品管理模块]
        N --> O[系统管理模块]
        O --> P[权限控制]
        P --> Q[路由守卫]
    end

    %% 数据访问层
    subgraph "数据访问层 (Data Access Layer)"
        R[Customer API] --> S[Product API]
        S --> T[System API]
        T --> U[HTTP拦截器]
        U --> V[响应处理]
    end

    %% 基础设施层
    subgraph "基础设施层 (Infrastructure Layer)"
        W[路由配置] --> X[状态管理]
        X --> Y[工具函数]
        Y --> Z[类型定义]
    end

    %% 层级连接
    A --> H
    B --> H
    C --> H
    H --> M
    M --> R
    R --> W

    %% 外部系统
    subgraph "外部系统"
        AA[后端API服务]
        BB[数据库]
    end

    V --> AA
    AA --> BB
```

## 核心模块架构

### 1. 客户管理模块

```mermaid
graph LR
    subgraph "客户管理模块"
        A[CustomerManage.vue] --> B[CustomerDialog.vue]
        A --> C[ProTable组件]
        B --> D[表单验证]
        B --> E[数据提交]
        C --> F[搜索筛选]
        C --> G[分页显示]
        H[Customer API] --> I[分页查询]
        H --> J[新增/编辑]
        H --> K[删除操作]
        H --> L[公海流转]
    end

    A --> H
    B --> H
```

### 2. 产品管理模块

```mermaid
graph LR
    subgraph "产品管理模块"
        A[ProductManage.vue] --> B[ProTable组件]
        B --> C[产品列表]
        B --> D[状态筛选]
        B --> E[搜索功能]
        F[Product API] --> G[分页查询]
        F --> H[新增/编辑]
        F --> I[删除操作]
    end

    A --> F
    B --> F
```

### 3. 系统管理模块

```mermaid
graph TB
    subgraph "系统管理模块"
        A[系统管理入口] --> B[部门管理]
        A --> C[角色管理]
        A --> D[菜单管理]
        A --> E[用户管理]

        B --> F[部门层级结构]
        C --> G[权限分配]
        D --> H[菜单树结构]
        E --> I[用户角色绑定]

        F --> J[System API]
        G --> J
        H --> J
        I --> J
    end
```

## 数据流架构

```mermaid
sequenceDiagram
    participant U as 用户界面
    participant C as 组件层
    participant B as 业务逻辑
    participant A as API层
    participant S as 后端服务

    U->>C: 用户操作
    C->>B: 触发业务逻辑
    B->>A: 调用API接口
    A->>S: HTTP请求
    S-->>A: 响应数据
    A-->>B: 处理响应
    B-->>C: 更新状态
    C-->>U: 刷新界面
```

## 组件关系图

```mermaid
graph TD
    subgraph "核心组件"
        A[ProTable] --> B[SearchForm]
        A --> C[TableBody]
        A --> D[Pagination]
        A --> E[OperationButtons]

        F[Dialog] --> G[Form]
        G --> H[FormItem]
        H --> I[Input/Select]
    end

    subgraph "业务组件"
        J[CustomerDialog] --> F
        K[CustomerManage] --> A
        K --> J

        L[ProductManage] --> A
        M[SystemManage] --> A
    end

    subgraph "基础组件"
        N[Layout] --> O[Header]
        N --> P[Sidebar]
        N --> Q[Main]
        N --> R[Footer]
    end

    K --> N
    L --> N
    M --> N
```

## 业务枚举架构

```mermaid
graph LR
    subgraph "客户相关枚举"
        A[CustomerLevel] --> A1[普通客户]
        A --> A2[优质客户]
        A --> A3[重点客户]

        B[CustomerSource] --> B1[个人资源]
        B --> B2[客户介绍]
        B --> B3[官网咨询]

        C[FollowUpStatus] --> C1[新客]
        C --> C2[待再次沟通]
        C --> C3[有意向]
    end

    subgraph "产品相关枚举"
        D[ProductStatus] --> D1[初始化]
        D --> D2[上架]
        D --> D3[下架]
    end

    subgraph "系统枚举"
        E[Gender] --> E1[男]
        E --> E2[女]
        E --> E3[保密]

        F[IsKeyDecisionMaker] --> F1[是]
        F --> F2[否]
    end
```

## 路由权限架构

```mermaid
graph TD
    A[用户登录] --> B[获取用户信息]
    B --> C[获取角色权限]
    C --> D[生成动态路由]
    D --> E[路由守卫验证]
    E --> F[渲染菜单]
    F --> G[页面访问]

    H[路由配置] --> I[静态路由]
    H --> J[动态路由]

    K[权限验证] --> L[角色验证]
    K --> M[菜单权限]
    K --> N[操作权限]

    E --> K
    J --> D
```

## API 架构设计

### RESTful API 设计模式

```mermaid
graph TB
    subgraph "API层级结构"
        A[基础路径] --> B[模块路径]
        B --> C[操作路径]

        D[Customer模块] --> D1[/customer/page]
        D --> D2[/customer/saveOrUpdate]
        D --> D3[/customer/remove]
        D --> D4[/customer/toPublic]
        D --> D5[/customer/toPrivate]

        E[Product模块] --> E1[/product/page]
        E --> E2[/product/saveOrEdit]
        E --> E3[/product/remove]

        F[System模块] --> F1[/department/...]
        F --> F2[/role/...]
        F --> F3[/menu/...]
        F --> F4[/user/...]
    end

    B --> D
    B --> E
    B --> F
```

## 状态管理架构

```mermaid
graph LR
    subgraph "Pinia状态管理"
        A[用户状态] --> A1[用户信息]
        A --> A2[权限信息]
        A --> A3[登录状态]

        B[应用状态] --> B1[菜单状态]
        B --> B2[主题配置]
        B --> B3[系统设置]

        C[业务状态] --> C1[客户数据]
        C --> C2[产品数据]
        C --> C3[系统数据]
    end

    subgraph "状态操作"
        D[Actions] --> E[异步操作]
        D --> F[API调用]

        G[Mutations] --> H[状态更新]
        G --> I[数据变更]

        J[Getters] --> K[数据计算]
        J --> L[状态派生]
    end

    A --> D
    B --> D
    C --> D
    D --> G
    G --> J
```

## 安全架构

```mermaid
graph TD
    A[认证层] --> B[JWT Token验证]
    A --> C[登录状态检查]

    D[授权层] --> E[角色权限验证]
    D --> F[菜单权限控制]
    D --> G[操作权限验证]

    H[数据安全] --> I[输入验证]
    H --> J[XSS防护]
    H --> K[CSRF防护]

    L[网络安全] --> M[HTTPS传输]
    L --> N[API限流]
    L --> O[跨域控制]

    B --> D
    C --> D
    D --> H
    H --> L
```

## 性能优化架构

```mermaid
graph TB
    subgraph "代码优化"
        A[Tree Shaking] --> A1[移除无用代码]
        B[代码分割] --> B1[路由懒加载]
        B --> B2[组件异步加载]
    end

    subgraph "资源优化"
        C[图片压缩] --> C1[WebP格式]
        C --> C2[懒加载]
        D[资源缓存] --> D1[浏览器缓存]
        D --> D2[CDN加速]
    end

    subgraph "运行时优化"
        E[虚拟滚动] --> E1[大列表优化]
        F[防抖节流] --> F1[搜索优化]
        F --> F2[提交优化]
    end

    subgraph "网络优化"
        G[请求合并] --> G1[批量API]
        G --> G2[请求缓存]
        H[数据压缩] --> H1[Gzip压缩]
    end

    A --> E
    B --> E
    C --> G
    D --> G
```

## 部署架构

```mermaid
graph LR
    subgraph "开发环境"
        A[本地开发] --> B[Vite开发服务器]
        B --> C[热重载]
        C --> D[开发调试]
    end

    subgraph "测试环境"
        E[代码构建] --> F[单元测试]
        F --> G[集成测试]
        G --> H[E2E测试]
    end

    subgraph "生产环境"
        I[代码打包] --> J[资源优化]
        J --> K[静态部署]
        K --> L[CDN分发]
    end

    D --> E
    H --> I
```

## 开发工作流

```mermaid
graph TD
    A[需求分析] --> B[功能设计]
    B --> C[组件开发]
    C --> D[单元测试]
    D --> E[代码审查]
    E --> F[集成测试]
    F --> G[构建打包]
    G --> H[部署上线]

    I[Git工作流] --> J[Feature分支]
    J --> K[Pull Request]
    K --> L[Code Review]
    L --> M[合并主分支]

    N[自动化] --> O[ESLint检查]
    N --> P[代码格式化]
    N --> Q[自动测试]

    C --> I
    E --> N
```

## 监控与维护

```mermaid
graph TB
    subgraph "错误监控"
        A[异常捕获] --> B[错误日志]
        B --> C[错误报告]
        C --> D[实时告警]
    end

    subgraph "性能监控"
        E[页面性能] --> F[加载时间]
        F --> G[资源使用]
        G --> H[用户体验]
    end

    subgraph "业务监控"
        I[用户行为] --> J[功能使用]
        J --> K[业务指标]
        K --> L[数据分析]
    end

    D --> M[问题定位]
    H --> M
    L --> M
    M --> N[问题修复]
```

## 总结

本 CRM 系统采用现代化的 Vue 3 技术栈，具有以下特点：

1. **架构清晰**: 采用分层架构，职责分离明确
2. **组件化开发**: 高度可复用的组件设计
3. **类型安全**: TypeScript 提供完整的类型检查
4. **权限控制**: 完善的 RBAC 权限管理体系
5. **性能优化**: 多种性能优化策略确保用户体验
6. **开发效率**: 完善的开发工具链和自动化流程

系统架构支持快速开发和维护，具有良好的扩展性和可维护性，能够满足企业级 CRM 系统的需求。
