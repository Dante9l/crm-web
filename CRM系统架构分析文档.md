# CRM 客户关系管理系统 - 架构分析文档

## 📋 文档概述

本文档详细描述了 CRM 客户关系管理系统的技术架构、核心组件、数据模型和业务逻辑，为开发团队提供全面的技术参考。

## 🏗️ 技术架构全景图

### 系统架构层次

```plantuml
@startuml
!define AWSPUML https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v17.0/dist
!include AWSPUML/AWSCommon.puml
!include AWSPUML/ApplicationIntegration/APIGateway.puml
!include AWSPUML/Compute/Lambda.puml
!include AWSPUML/Database/DynamoDB.puml

package "前端层 (Vue 3 + TypeScript)" {
    [客户管理模块] as CustomerUI
    [产品管理模块] as ProductUI
    [系统管理模块] as SystemUI
    [公海客户模块] as PublicUI
}

package "组件层" {
    [ProTable组件] as ProTable
    [Dialog组件] as Dialog
    [SearchForm组件] as SearchForm
    [Upload组件] as Upload
}

package "API服务层" {
    [客户API] as CustomerAPI
    [产品API] as ProductAPI
    [系统API] as SystemAPI
}

package "数据状态管理" {
    [Pinia Store] as Store
    [用户状态] as UserState
    [权限状态] as PermissionState
}

package "工具与配置" {
    [HTTP拦截器] as HttpInterceptor
    [权限指令] as PermissionDirective
    [枚举配置] as EnumConfig
    [路由守卫] as RouteGuard
}

CustomerUI --> ProTable
ProductUI --> ProTable
SystemUI --> ProTable
PublicUI --> ProTable

CustomerUI --> CustomerAPI
ProductUI --> ProductAPI
SystemUI --> SystemAPI

CustomerUI --> Dialog
CustomerUI --> SearchForm

ProTable --> Store
CustomerAPI --> HttpInterceptor
CustomerUI --> PermissionDirective
CustomerUI --> EnumConfig

CustomerUI --> RouteGuard
SystemUI --> RouteGuard

@enduml
```

### 技术栈架构

```plantuml
@startuml
package "前端框架层" {
    [Vue 3.4+]
    [TypeScript 5.0+]
    [Vite 5.0+]
}

package "UI组件层" {
    [Element Plus]
    [WindiCSS]
    [Font Awesome Icons]
}

package "状态管理层" {
    [Pinia 2.0+]
    [Vue Router 4.0+]
}

package "HTTP通信层" {
    [Axios]
    [Request拦截器]
    [Response拦截器]
}

package "工具库层" {
    [Day.js]
    [Print-js]
    [Excel导入导出]
}

[Vue 3.4+] --> [Element Plus]
[Vue 3.4+] --> [Pinia 2.0+]
[Vue 3.4+] --> [Vue Router 4.0+]
[TypeScript 5.0+] --> [Element Plus]
[Vite 5.0+] --> [WindiCSS]
[Pinia 2.0+] --> [Axios]
[Axios] --> [Request拦截器]
[Axios] --> [Response拦截器]

@enduml
```

## 🧩 核心类关系图

### 业务实体关系

```plantuml
@startuml
class Customer {
    +id: string
    +name: string
    +phone: string
    +email: string
    +gender: Gender
    +level: CustomerLevel
    +source: CustomerSource
    +followStatus: FollowUpStatus
    +isKeyDecisionMaker: IsKeyDecisionMaker
    +address: string
    +dealCount: number
    +createrName: string
    +ownerName: string
    +intoPublicSeaStatus: IntoPublicSeaStatus
    +nextFollowTime: Date
    +createTime: Date
    +updateTime: Date
}

class Product {
    +id: string
    +name: string
    +description: string
    +price: number
    +status: ProductStatus
    +createTime: Date
    +updateTime: Date
}

class Department {
    +id: string
    +name: string
    +parentId: string
    +level: number
    +sort: number
    +description: string
    +createTime: Date
}

class User {
    +id: string
    +username: string
    +realName: string
    +phone: string
    +email: string
    +departmentId: string
    +roleId: string
    +status: UserStatus
    +createTime: Date
}

class Role {
    +id: string
    +name: string
    +description: string
    +permissions: Permission[]
}

Customer "1" -- "*" Product : "购买"
Customer "N" -- "1" User : "所属销售"
User "N" -- "1" Department : "所属部门"
User "N" -- "N" Role : "拥有角色"

@enduml
```

### 组件继承关系

```plantuml
@startuml
class BaseComponent {
    +ref(): Ref
    +computed(): Computed
    +watch(): Watcher
}

class ProTable {
    +columns: ColumnProps[]
    +requestApi: Function
    +data: any[]
    +searchParam: Object
    +selectedList: any[]
    +getTableList(): void
    +reset(): void
    +clearSelection(): void
}

class Dialog {
    +visible: boolean
    +title: string
    +width: string
    +maxHeight: string
    +acceptParams(): void
    +handleSubmit(): void
}

class SearchForm {
    +search: Function
    +reset: Function
    +columns: ColumnProps[]
    +searchParam: Object
}

class CustomerDialog {
    +dialogProps: DialogProps
    +rules: FormRules
    +handleSubmit(): void
    +validateForm(): boolean
}

BaseComponent <|-- ProTable
BaseComponent <|-- Dialog
BaseComponent <|-- SearchForm
Dialog <|-- CustomerDialog

ProTable *-- SearchForm
ProTable *-- Dialog

@enduml
```

## 🔄 业务流程时序图

### 客户管理核心流程

```plantuml
@startuml
actor 销售人员 as Sales
participant "CustomerManage.vue" as CustomerUI
participant "CustomerDialog.vue" as Dialog
participant "CustomerApi" as API
participant "后端服务" as Backend

== 新增客户流程 ==
Sales -> CustomerUI: 点击"新增客户"
CustomerUI -> Dialog: 打开客户新增弹窗
Sales -> Dialog: 填写客户信息
Dialog -> Dialog: 表单验证
Dialog -> API: 调用saveOrEdit接口
API -> Backend: POST /customer/saveOrEdit
Backend --> API: 返回创建结果
API --> Dialog: 返回响应数据
Dialog -> CustomerUI: 关闭弹窗并刷新列表
CustomerUI -> Sales: 显示新增成功消息

== 转入公海流程 ==
Sales -> CustomerUI: 点击"转入公海"
CustomerUI -> Sales: 确认转入操作
CustomerUI -> API: 调用toPublic接口
API -> Backend: POST /customer/toPublic
Backend --> API: 返回处理结果
API --> CustomerUI: 返回响应
CustomerUI -> CustomerUI: 刷新表格数据
CustomerUI -> Sales: 显示转入成功消息

== 客户导出流程 ==
Sales -> CustomerUI: 点击"导出客户"
CustomerUI -> Sales: 确认导出操作
CustomerUI -> API: 调用export接口
API -> Backend: POST /customer/export (blob)
Backend --> API: 返回Excel文件流
API --> CustomerUI: 处理文件下载
CustomerUI -> Sales: 触发浏览器下载

@enduml
```

### 权限验证流程

```plantuml
@startuml
actor 用户 as User
participant "路由守卫" as RouteGuard
participant "权限指令" as PermissionDirective
participant "Pinia Store" as Store
participant "后端服务" as Backend

== 页面访问权限验证 ==
User -> RouteGuard: 访问受保护页面
RouteGuard -> Store: 检查用户登录状态
Store --> RouteGuard: 返回登录状态
alt 未登录
    RouteGuard -> User: 重定向到登录页
else 已登录
    RouteGuard -> Store: 检查页面权限
    Store --> RouteGuard: 返回权限结果
    alt 无权限
        RouteGuard -> User: 显示403错误页
    else 有权限
        RouteGuard -> User: 允许访问页面
    end
end

== 按钮权限验证 ==
User -> PermissionDirective: 查看页面按钮
PermissionDirective -> Store: 检查按钮权限标识
Store --> PermissionDirective: 返回权限验证结果
alt 有权限
    PermissionDirective -> User: 显示按钮
else 无权限
    PermissionDirective -> User: 隐藏按钮
end

@enduml
```

## 📦 模块依赖关系图

```plantuml
@startuml
package "视图层 (Views)" {
    [CustomerManage.vue] as CM
    [PublicManager.vue] as PM
    [ProductManage.vue] as PDM
    [DepartmentManage.vue] as DM
    [Menu.vue] as M
    [Role.vue] as R
    [Manager.vue] as UM
}

package "API层" {
    [CustomerApi] as CA
    [ProductApi] as PA
    [DepartmentApi] as DA
    [RoleApi] as RA
    [ManagerApi] as MA
    [MenuApi] as MApi
}

package "组件层" {
    [ProTable] as PT
    [Dialog] as D
    [SearchForm] as SF
    [CustomerDialog] as CD
}

package "工具层" {
    [useHandleData] as UHD
    [useDownload] as UD
    [useTable] as UT
    [useAuthButtons] as UAB
}

package "配置层" {
    [enum.ts] as E
    [config.ts] as C
}

CM --> CA
PM --> CA
PDM --> PA
DM --> DA
R --> RA
UM --> MA
M --> MApi

CM --> PT
CM --> CD
PM --> PT
PDM --> PT
DM --> PT
R --> PT
UM --> PT

CM --> UHD
CM --> UD
CM --> UAB
PM --> UHD
PM --> UD
PDM --> UHD

CM --> E
PM --> E
CD --> E

PT --> UT
PT --> SF
CD --> D

@enduml
```

## 🎯 核心特性说明

### 1. ProTable 组件特性

- **动态列配置**: 支持列的显示/隐藏、排序、自定义渲染
- **搜索表单集成**: 自动生成搜索表单，支持多种输入类型
- **分页处理**: 内置分页组件，支持前后端分页
- **批量操作**: 支持批量选择、批量删除等操作
- **数据导出**: 集成 Excel 导出功能
- **权限控制**: 支持按钮级别的权限控制

### 2. 权限管理系统

- **路由级权限**: 通过路由守卫实现页面访问控制
- **按钮级权限**: 通过自定义指令实现按钮显示控制
- **数据级权限**: 通过 API 参数实现数据访问控制
- **角色管理**: 支持多角色权限分配

### 3. 状态管理架构

- **模块化设计**: 按业务模块划分状态管理
- **持久化存储**: 关键状态数据持久化到本地存储
- **响应式更新**: 基于 Vue 3 响应式系统实现状态同步
- **类型安全**: 基于 TypeScript 实现类型检查

## 🚀 性能优化策略

### 1. 组件懒加载

```typescript
// 路由懒加载配置
const CustomerManage = () => import('@/views/Customer/CustomerManage.vue')
const ProductManage = () => import('@/views/Product/ProductManage.vue')
```

### 2. 数据缓存策略

```typescript
// API响应缓存
const useCache = () => {
  // 实现智能缓存机制
}
```

### 3. 组件性能优化

- 使用`v-memo`优化列表渲染
- 合理使用`computed`和`watch`
- 避免不必要的组件重新渲染

## 📊 监控与日志

### 1. 错误监控

- 全局错误捕获
- API 请求异常监控
- 组件渲染错误追踪

### 2. 性能监控

- 页面加载时间监控
- API 请求响应时间统计
- 用户操作行为分析

## 🔒 安全考虑

### 1. 前端安全

- XSS 防护
- CSRF 防护
- 敏感数据加密传输

### 2. 权限安全

- JWT Token 管理
- 权限验证链
- 安全路由配置

---

_文档版本: v1.0.0_ _最后更新: 2025-10-26_ _维护团队: CRM 开发组_
