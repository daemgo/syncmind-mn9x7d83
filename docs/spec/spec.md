> **版本**：1.0.0 | **状态**：draft | **更新时间**：2026-03-28T00:00:00Z
>
> **来源方案**：normal 场景 1.0.1 版本

---

#### 约定说明

本文档使用以下标准值：
- **布局类型**: `list` / `detail` / `form` / `dashboard` / `steps` / `custom`
- **区块类型**: `table` / `form` / `card` / `cards` / `chart` / `tabs` / `steps` / `timeline` / `description` / `statistic` / `custom`
- **字段类型**: `text` / `textarea` / `number` / `money` / `date` / `select` / `multiselect` / `switch` / `upload` 等（完整列表见下游约定）

---

## 一、产品概述

### 1.1 项目背景

长机科技做齿轮加工机床，资产规模5亿，生产设备主要用西门子系统。公司拿过DCMM认证，数字化基础算不错，但设备管理主要靠老工程师的经验，没有统一台账和预防性维护计划，车间设备状态看不见，发现故障往往靠人打电话。

公司打算建一套EAM系统，预算100万，要求2026年年底前上线，把设备台账理清楚，同时在监控大屏上能实时看到设备状态。

### 1.2 产品目标

- 建立设备唯一身份档案，实现设备全生命周期可追溯
- 从被动维修转向预防性维护，降低意外停机，延长设备寿命
- 实时监控设备运行状态，快速响应异常，提升管理效率
- 整合西门子数控系统数据，支持预测性维护和数据分析
- 标准化维修流程，积累维修知识库，提高响应速度

### 1.3 目标用户

| 角色 | 描述 | 核心诉求 |
|------|------|---------|
| 设备管理员 | 负责设备台账管理、维护计划制定 | 快速查找设备信息，制定和执行维护计划，跟踪维护历史 |
| 维修工程师 | 执行维修工单，处理设备故障 | 及时接收工单，查看设备历史记录，记录维修过程 |
| 车间主任 | 监控车间设备运行状态 | 实时掌握设备状态，快速响应异常，了解维护执行情况 |
| 采购人员 | 管理备品备件库存 | 掌握备件库存状态，及时采购，避免缺件延误 |
| 公司领导 | 查看设备管理报表 | 了解设备整体运行情况，基于数据决策 |

### 1.4 范围定义

**本期包含**：
- 设备台账管理：设备基础信息、规格参数、维护历史
- 预防性维护：维护计划制定、工单自动触发
- 维修工单管理：工单创建、派工、执行、验收、归档
- 备品备件管理：备件库存台账、安全库存预警
- 监控大屏：设备运行状态、OEE指标、故障预警
- 分析报表：设备OEE、故障率、维护成本分析
- 西门子系统集成：设备运行数据采集

**本期不含**（及原因）：
- 移动端应用：优先级P3，预算和时间有限，暂不开发
- 状态监测预警（基于IoT传感器）：需要额外硬件投入，数据来源依赖西门子系统已足够
- 设备采购管理：非核心需求，聚焦在用设备管理
- 多租户支持：单企业私有化部署，不需要
- 与ERP/MES集成：本期聚焦设备管理核心功能，集成留待后续

---

## 二、信息架构

### 2.1 站点地图

```
EAM设备管理系统
├── 监控大屏 (/dashboard)
├── 设备管理
│   ├── 设备台账 (/equipment)
│   └── 设备详情 (/equipment/:id)
├── 维护管理
│   ├── 维护计划 (/maintenance/plans)
│   └── 维修工单 (/maintenance/workorders)
├── 备件管理
│   ├── 备件台账 (/spares)
│   └── 库存预警 (/spares/alerts)
├── 分析报表
│   ├── 设备绩效 (/analytics/performance)
│   └── 维护分析 (/analytics/maintenance)
└── 系统设置
    ├── 基础数据 (/settings/basis)
    └── 集成配置 (/settings/integration)
```

### 2.2 导航结构

| 一级菜单 | 二级菜单 | 路由 | 说明 |
|---------|---------|------|------|
| 监控大屏 | - | /dashboard | 设备运行状态总览，支持大屏硬件 |
| 设备管理 | 设备台账 | /equipment | 设备列表管理 |
| 设备管理 | 设备详情 | /equipment/:id | 设备详细信息查看 |
| 维护管理 | 维护计划 | /maintenance/plans | 预防性维护计划管理 |
| 维护管理 | 维修工单 | /maintenance/workorders | 维修工单全流程管理 |
| 备件管理 | 备件台账 | /spares | 备品备件库存管理 |
| 备件管理 | 库存预警 | /spares/alerts | 安全库存预警列表 |
| 分析报表 | 设备绩效 | /analytics/performance | 设备OEE、故障率分析 |
| 分析报表 | 维护分析 | /analytics/maintenance | 维护成本、计划执行率分析 |
| 系统设置 | 基础数据 | /settings/basis | 设备分类、故障类型等字典管理 |
| 系统设置 | 集成配置 | /settings/integration | 西门子系统对接配置 |

---

## 三、功能模块

### 3.1 监控大屏

> 实时展示设备运行状态，解决"看不见"的问题，让管理者快速掌握全局设备状态，快速响应异常。

#### 3.1.1 监控大屏首页

**路由**：`/dashboard`
**布局**：`dashboard`
**描述**：大屏专用页面，实时展示设备运行状态和关键指标

##### 全局状态区（statistic）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 设备总数 | totalDevices | number | 是 | 全厂设备总数 |
| 运行中 | runningCount | number | 是 | 当前运行设备数 |
| 停机 | stoppedCount | number | 是 | 当前停机设备数 |
| 故障 | faultCount | number | 是 | 当前故障设备数 |
| 综合OEE | overallOEE | percent | 是 | 全厂设备综合OEE |

##### 分区状态区（chart）

图表类型：地图式分布图，按车间/产线展示设备位置和运行状态

##### 关键指标区（cards）

| 卡片标题 | 指标类型 | 数据来源 |
|---------|---------|---------|
| TOP5故障设备 | 列表 | 故障次数统计 |
| TOP5低效设备 | 列表 | OEE倒序 |
| 维护计划执行率 | 百分比 | 本月已完成计划/总计划 |

##### 实时预警区（timeline）

展示最新10条故障预警、异常设备、待处理工单

##### 趋势分析区（chart）

| 图表类型 | 时间维度 | 指标 |
|---------|---------|------|
| OEE趋势 | 最近24小时 | 小时级OEE |
| 故障率趋势 | 最近7天 | 日故障率 |
| 维护成本趋势 | 最近6个月 | 月度维护成本 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 全屏 | action | toolbar-right | 全屏显示 |
| 刷新 | action | toolbar-right | 刷新数据 |
| 设置 | action | toolbar-right | modal（配置大屏显示内容） |

##### 业务规则

- 数据刷新延迟≤5秒
- 异常状态红色闪烁告警
- 支持声音提示（可配置）

---

### 3.2 设备管理

> 建立设备唯一身份档案，解决设备信息分散、档案不完整的问题，实现全生命周期可追溯。

#### 3.2.1 设备台账列表

**路由**：`/equipment`
**布局**：`list`
**描述**：设备列表管理，支持筛选、搜索、批量操作

##### 筛选区（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 设备编号 | equipmentNo | text | 否 | 精确搜索 |
| 设备名称 | equipmentName | text | 否 | 模糊搜索 |
| 设备分类 | categoryId | select | 否 | 选项来源: dict-equipment-category |
| 车间 | workshopId | select | 否 | 选项来源: dict-workshop |
| 运行状态 | status | select | 否 | 选项来源: dict-equipment-status |

##### 列表区（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 设备编号 | equipmentNo | text | 是 | 点击可进入详情 |
| 设备名称 | equipmentName | text | 是 | - |
| 设备分类 | categoryName | tag | 是 | - |
| 车间 | workshopName | text | 是 | - |
| 运行状态 | status | status | 是 | 运行/停机/故障 |
| OEE | oee | percent | 是 | 近24小时 |
| 下次维护 | nextMaintenanceDate | date | 是 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新增设备 | action | toolbar-left | navigate(/equipment/create) |
| 导入 | action | toolbar-left | modal（批量导入设备） |
| 导出 | action | toolbar-right | download |
| 查看 | action | row | navigate(/equipment/:id) |
| 编辑 | action | row | navigate(/equipment/:id/edit) |
| 停用 | action | row-more | action（停用设备） |

##### 业务规则

- 设备编号全局唯一
- 停用设备不显示在监控大屏

#### 3.2.2 设备详情

**路由**：`/equipment/:id`
**布局**：`detail`
**描述**：查看设备完整信息和历史记录

##### 基础信息区（description）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 设备编号 | equipmentNo | text | 是 | 系统生成，唯一 |
| 设备名称 | equipmentName | text | 是 | - |
| 设备分类 | categoryName | text | 是 | - |
| 车间 | workshopName | text | 是 | - |
| 位置 | location | text | 是 | 具体位置描述 |
| 规格型号 | model | text | 是 | - |
| 制造商 | manufacturer | text | 否 | - |
| 出厂日期 | manufactureDate | date | 否 | - |
| 投用日期 | commissionDate | date | 是 | - |
| 购置价格 | purchasePrice | money | 否 | - |
| 当前状态 | status | status | 是 | 运行/停机/故障/停用 |
| 当前OEE | oee | percent | 是 | 近24小时 |

##### 实时数据区（card）

从西门子系统实时采集的运行数据

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 运行状态 | runtimeStatus | status | 是 | 运行/停机/故障 |
| 负载率 | loadRate | percent | 是 | - |
| 主轴温度 | spindleTemperature | number | 是 | 单位：℃ |
| 运行时间 | runtimeHours | number | 是 | 单位：小时 |
| 采集时间 | collectTime | datetime | 是 | - |

##### 维护历史区（timeline）

展示维护记录和维修工单

##### 备件关联区（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 备件名称 | spareName | text | 否 | - |
| 备件编号 | spareNo | text | 否 | - |
| 规格 | specification | text | 否 | - |
| 安全库存 | safetyStock | number | 否 | - |
| 当前库存 | currentStock | number | 否 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑 | action | card-header | navigate(/equipment/:id/edit) |
| 创建工单 | action | card-header | navigate(/maintenance/workorders/create?equipmentId=:id) |
| 返回 | action | card-footer | navigate(/equipment) |

##### 业务规则

- 实时数据每5秒刷新一次
- 维护历史按时间倒序

#### 3.2.3 新增/编辑设备

**路由**：`/equipment/create` | `/equipment/:id/edit`
**布局**：`form`
**描述**：新增或编辑设备信息

##### 基础信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 设备编号 | equipmentNo | text | 是 | 编辑时禁用 |
| 设备名称 | equipmentName | text | 是 | - |
| 设备分类 | categoryId | select | 是 | 选项来源: dict-equipment-category |
| 车间 | workshopId | select | 是 | 选项来源: dict-workshop |
| 位置 | location | text | 是 | - |
| 规格型号 | model | text | 是 | - |
| 制造商 | manufacturer | text | 否 | - |
| 出厂日期 | manufactureDate | date | 否 | - |
| 投用日期 | commissionDate | date | 是 | - |
| 购置价格 | purchasePrice | money | 否 | - |
| 西门子系统型号 | siemensModel | text | 否 | 用于数据采集配置 |
| 设备图片 | images | upload | 否 | 支持多图 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | action | form-footer | action（保存并返回列表） |
| 保存并继续 | action | form-footer | action（保存并进入详情） |
| 取消 | action | form-footer | navigate(/equipment) |

##### 业务规则

- 设备编号格式：EQ+年月+4位流水（如EQ26030001）
- 投用日期不能晚于当前日期

---

### 3.3 维护管理

> 通过预防性维护计划从被动修变成主动防，降低故障率，延长设备寿命。

#### 3.3.1 维护计划列表

**路由**：`/maintenance/plans`
**布局**：`list`
**描述**：预防性维护计划管理

##### 筛选区（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 设备编号 | equipmentNo | text | 否 | 精确搜索 |
| 计划状态 | status | select | 否 | 选项来源: dict-plan-status |
| 计划类型 | planType | select | 否 | 选项来源: dict-plan-type |

##### 列表区（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 计划编号 | planNo | text | 是 | 点击可进入详情 |
| 设备名称 | equipmentName | text | 是 | - |
| 计划类型 | planType | tag | 是 | 保养/检修/校准 |
| 计划周期 | cycle | text | 是 | 如：每月/每500小时 |
| 执行时间 | executeTime | datetime | 是 | - |
| 状态 | status | status | 是 | 待执行/执行中/已完成/已跳过 |
| 负责人 | assigneeName | text | 是 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新建计划 | action | toolbar-left | navigate(/maintenance/plans/create) |
| 批量生成 | action | toolbar-left | modal（按规则批量生成） |
| 导出 | action | toolbar-right | download |
| 查看 | action | row | navigate(/maintenance/plans/:id) |
| 编辑 | action | row | navigate(/maintenance/plans/:id/edit) |
| 删除 | action | row-more | action（软删除） |

##### 业务规则

- 系统每天自动扫描计划，到期生成工单
- 设备停用时自动暂停计划

#### 3.3.2 新增/编辑维护计划

**路由**：`/maintenance/plans/create` | `/maintenance/plans/:id/edit`
**布局**：`form`
**描述**：创建或编辑维护计划

##### 计划信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 计划编号 | planNo | text | 是 | 系统生成 |
| 设备 | equipmentId | select | 是 | 选项来源: 设备台账 |
| 计划类型 | planType | select | 是 | 选项来源: dict-plan-type |
| 计划周期 | cycle | select | 是 | 选项来源: dict-plan-cycle |
| 周期数值 | cycleValue | number | 是 | 如周期选择"按小时"，则填小时数 |
| 首次执行 | firstExecuteTime | datetime | 是 | - |
| 负责人 | assigneeId | select | 是 | 选项来源: 用户列表（角色为维修工程师） |
| 计划说明 | description | textarea | 否 | - |

##### 维护内容（form）

支持动态添加多个维护项

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 维护项名称 | itemName | text | 是 | - |
| 维护项说明 | itemDescription | textarea | 否 | - |
| 是否必做 | required | switch | 是 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | action | form-footer | action（保存并返回列表） |
| 取消 | action | form-footer | navigate(/maintenance/plans) |

##### 业务规则

- 计划编号格式：MP+年月+4位流水
- 周期类型：按时间（日/周/月）或按运行时间（小时）

#### 3.3.3 维修工单列表

**路由**：`/maintenance/workorders`
**布局**：`list`
**描述**：维修工单全流程管理

##### 筛选区（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 工单编号 | workOrderNo | text | 否 | 精确搜索 |
| 设备编号 | equipmentNo | text | 否 | 精确搜索 |
| 工单状态 | status | select | 否 | 选项来源: dict-workorder-status |
| 工单类型 | orderType | select | 否 | 选项来源: dict-order-type |
| 负责人 | assigneeId | select | 否 | 选项来源: 用户列表 |

##### 列表区（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 工单编号 | workOrderNo | text | 是 | 点击可进入详情 |
| 设备名称 | equipmentName | text | 是 | - |
| 工单类型 | orderType | tag | 是 | 计划维护/故障维修 |
| 故障描述 | faultDescription | text | 否 | 最多显示50字 |
| 紧急程度 | priority | status | 是 | 高/中/低 |
| 状态 | status | status | 是 | 待派工/待执行/执行中/待验收/已完成 |
| 负责人 | assigneeName | text | 是 | - |
| 创建时间 | createTime | datetime | 是 | - |
| 完成时间 | completeTime | datetime | 是 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新建工单 | action | toolbar-left | navigate(/maintenance/workorders/create) |
| 导出 | action | toolbar-right | download |
| 查看 | action | row | navigate(/maintenance/workorders/:id) |
| 接单 | action | row-more | action（状态变更为执行中） |
| 完成 | action | row-more | action（状态变更为待验收） |

##### 业务规则

- 待派工状态可编辑和删除
- 工单按紧急程度和创建时间排序

#### 3.3.4 新增/编辑维修工单

**路由**：`/maintenance/workorders/create` | `/maintenance/workorders/:id/edit`
**布局**：`form`
**描述**：创建或编辑维修工单

##### 工单信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 工单编号 | workOrderNo | text | 是 | 系统生成，编辑时禁用 |
| 设备 | equipmentId | select | 是 | 选项来源: 设备台账 |
| 工单类型 | orderType | select | 是 | 选项来源: dict-order-type |
| 紧急程度 | priority | select | 是 | 选项来源: dict-priority |
| 关联计划 | planId | select | 否 | 选项来源: 维护计划（计划维护时必填） |
| 故障描述 | faultDescription | textarea | 是 | - |
| 负责人 | assigneeId | select | 是 | 选项来源: 用户列表（角色为维修工程师） |
| 期望完成时间 | expectCompleteTime | datetime | 是 | - |
| 附件 | attachments | upload | 否 | 故障照片等 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | action | form-footer | action（保存并返回列表） |
| 保存并派工 | action | form-footer | action（保存并通知负责人） |
| 取消 | action | form-footer | navigate(/maintenance/workorders) |

##### 业务规则

- 工单编号格式：WO+年月+4位流水
- 计划维护类工单由系统自动生成

#### 3.3.5 工单详情

**路由**：`/maintenance/workorders/:id`
**布局**：`detail`
**描述**：查看工单详情和处理进度

##### 工单信息（description）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 工单编号 | workOrderNo | text | 是 | - |
| 设备名称 | equipmentName | text | 是 | - |
| 工单类型 | orderType | text | 是 | - |
| 紧急程度 | priority | status | 是 | - |
| 状态 | status | status | 是 | - |
| 故障描述 | faultDescription | textarea | 是 | - |
| 负责人 | assigneeName | text | 是 | - |
| 创建时间 | createTime | datetime | 是 | - |
| 期望完成时间 | expectCompleteTime | datetime | 是 | - |
| 实际完成时间 | actualCompleteTime | datetime | 否 | - |

##### 处理记录（timeline）

展示工单处理过程的时间线

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 编辑 | action | card-header | navigate(/maintenance/workorders/:id/edit) |
| 添加记录 | action | card-header | modal（添加处理记录） |
| 开始执行 | action | card-footer | action（状态变更为执行中） |
| 提交验收 | action | card-footer | action（状态变更为待验收） |
| 验收通过 | action | card-footer | action（状态变更为已完成） |
| 返回 | action | card-footer | navigate(/maintenance/workorders) |

##### 业务规则

- 只有负责人可以开始执行和提交验收
- 只有设备管理员可以验收通过

---

### 3.4 备件管理

> 建立备件库存台账，关联设备BOM，支持安全库存预警，保障维修及时性。

#### 3.4.1 备件台账列表

**路由**：`/spares`
**布局**：`list`
**描述**：备品备件库存管理

##### 筛选区（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 备件编号 | spareNo | text | 否 | 精确搜索 |
| 备件名称 | spareName | text | 否 | 模糊搜索 |
| 备件分类 | categoryId | select | 否 | 选项来源: dict-spare-category |
| 库存状态 | stockStatus | select | 否 | 选项来源: dict-stock-status |

##### 列表区（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 备件编号 | spareNo | text | 是 | 点击可进入详情 |
| 备件名称 | spareName | text | 是 | - |
| 备件分类 | categoryName | tag | 是 | - |
| 规格 | specification | text | 是 | - |
| 当前库存 | currentStock | number | 是 | - |
| 安全库存 | safetyStock | number | 是 | - |
| 库存状态 | stockStatus | status | 是 | 正常/预警/缺货 |
| 单价 | unitPrice | money | 是 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新增备件 | action | toolbar-left | navigate(/spares/create) |
| 导入 | action | toolbar-left | modal（批量导入） |
| 导出 | action | toolbar-right | download |
| 查看 | action | row | navigate(/spares/:id) |
| 编辑 | action | row | navigate(/spares/:id/edit) |
| 入库 | action | row-more | modal（入库操作） |
| 出库 | action | row-more | modal（出库操作） |

##### 业务规则

- 库存状态自动计算：当前库存<安全库存为预警，=0为缺货
- 出库时库存不足则提示

#### 3.4.2 新增/编辑备件

**路由**：`/spares/create` | `/spares/:id/edit`
**布局**：`form`
**描述**：新增或编辑备件信息

##### 备件信息（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 备件编号 | spareNo | text | 是 | 系统生成，编辑时禁用 |
| 备件名称 | spareName | text | 是 | - |
| 备件分类 | categoryId | select | 是 | 选项来源: dict-spare-category |
| 规格 | specification | text | 否 | - |
| 型号 | model | text | 否 | - |
| 品牌 | brand | text | 否 | - |
| 单位 | unit | select | 是 | 选项来源: dict-unit |
| 单价 | unitPrice | money | 是 | - |
| 安全库存 | safetyStock | number | 是 | - |
| 当前库存 | currentStock | number | 是 | 默认0，编辑时可改 |
| 供应商 | supplier | text | 否 | - |
| 关联设备 | equipmentIds | multiselect | 否 | 选项来源: 设备台账 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 保存 | action | form-footer | action（保存并返回列表） |
| 取消 | action | form-footer | navigate(/spares) |

##### 业务规则

- 备件编号格式：SP+年月+4位流水

#### 3.4.3 库存预警列表

**路由**：`/spares/alerts`
**布局**：`list`
**描述**：安全库存预警列表

##### 列表区（table）

| 列名 | fieldKey | 列类型 | 可排序 | 说明 |
|------|----------|--------|--------|------|
| 备件名称 | spareName | text | 是 | 点击可进入详情 |
| 备件编号 | spareNo | text | 是 | - |
| 当前库存 | currentStock | number | 是 | - |
| 安全库存 | safetyStock | number | 是 | - |
| 缺口数量 | gap | number | 是 | 安全库存-当前库存 |
| 预警级别 | alertLevel | status | 是 | 预警/缺货 |
| 最近出库 | lastOutTime | datetime | 是 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 导出 | action | toolbar-right | download |
| 生成采购单 | action | row-more | action（生成采购建议单） |

##### 业务规则

- 只显示当前库存≤安全库存的备件
- 按缺口数量降序排列

---

### 3.5 分析报表

> 多维度分析设备绩效，优化维护策略，降低总体成本。

#### 3.5.1 设备绩效分析

**路由**：`/analytics/performance`
**布局**：`dashboard`
**描述**：设备OEE、故障率等绩效指标分析

##### 筛选区（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 时间范围 | dateRange | daterange | 是 | 默认最近7天 |
| 设备 | equipmentId | select | 否 | 选项来源: 设备台账，默认全部 |
| 车间 | workshopId | select | 否 | 选项来源: dict-workshop，默认全部 |

##### OEE趋势（chart）

折线图，展示选定时间范围内的OEE变化

##### 设备排名（cards）

| 卡片标题 | 排序规则 |
|---------|---------|
| OEE TOP5 | OEE降序 |
| OEE BOTTOM5 | OEE升序 |
| 故障次数TOP5 | 故障次数降序 |

##### 汇总统计（statistic）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 平均OEE | avgOEE | percent | 是 | - |
| 平均故障率 | avgFaultRate | percent | 是 | - |
| 平均停机时间 | avgDowntime | number | 是 | 单位：小时 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 刷新 | action | toolbar-right | action（刷新数据） |
| 导出 | action | toolbar-right | download |

##### 业务规则

- OEE = 可用率×性能效率×质量指数
- 默认按日聚合，时间范围超过30天时按周聚合

#### 3.5.2 维护分析

**路由**：`/analytics/maintenance`
**布局**：`dashboard`
**描述**：维护成本、计划执行率等维护指标分析

##### 筛选区（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 时间范围 | dateRange | daterange | 是 | 默认最近6个月 |
| 车间 | workshopId | select | 否 | 选项来源: dict-workshop，默认全部 |

##### 维护成本趋势（chart）

柱状图，按月展示维护成本（含备件成本+人工成本）

##### 计划执行率（chart）

饼图，展示计划维护的执行情况

| 分类 | 说明 |
|------|------|
| 按时完成 | 在计划时间±2小时内完成 |
| 延期完成 | 超过计划时间2小时但已完成 |
| 未执行 | 超过计划时间2小时且未完成 |
| 跳过 | 设备停用等原因跳过 |

##### 汇总统计（statistic）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 总维护成本 | totalCost | money | 是 | - |
| 计划执行率 | planExecuteRate | percent | 是 | 按时完成/总计划 |
| 平均响应时间 | avgResponseTime | number | 是 | 单位：分钟 |
| 平均修复时间 | avgRepairTime | number | 是 | 单位：小时 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 刷新 | action | toolbar-right | action（刷新数据） |
| 导出 | action | toolbar-right | download |

##### 业务规则

- 维护成本 = 备件出库成本 + 工时×人工时薪
- 响应时间 = 工单派工时间 - 工单创建时间
- 修复时间 = 工单完成时间 - 工单开始执行时间

---

### 3.6 系统设置

> 管理基础数据和集成配置，保障系统正常运行。

#### 3.6.1 基础数据管理

**路由**：`/settings/basis`
**布局**：`custom`
**描述**：管理设备分类、故障类型等基础字典

##### 字典导航（tabs）

| 字典名称 | 说明 |
|---------|------|
| 设备分类 | 设备的分类体系 |
| 车间列表 | 车间信息 |
| 故障类型 | 常见故障类型 |
| 备件分类 | 备件的分类体系 |

##### 设备分类（form）

支持树形结构，增删改

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 分类名称 | name | text | 是 | - |
| 上级分类 | parentId | treeselect | 否 | 支持多级分类 |
| 排序 | sort | number | 是 | 数字越小越靠前 |

##### 车间列表（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 车间名称 | name | text | 是 | - |
| 车间编码 | code | text | 是 | 唯一 |
| 负责人 | managerId | select | 否 | 选项来源: 用户列表 |

##### 故障类型（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 故障类型名称 | name | text | 是 | - |
| 排序 | sort | number | 是 | - |

##### 备件分类（form）

支持树形结构，增删改

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 分类名称 | name | text | 是 | - |
| 上级分类 | parentId | treeselect | 否 | 支持多级分类 |
| 排序 | sort | number | 是 | - |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 新增 | action | card-header | modal（新增子项） |
| 编辑 | action | row | modal（编辑） |
| 删除 | action | row-more | action（删除） |

##### 业务规则

- 删除分类前需检查是否有关联数据
- 车间编码全局唯一

#### 3.6.2 西门子集成配置

**路由**：`/settings/integration`
**布局**：`form`
**描述**：配置西门子数控系统对接参数

##### 连接配置（form）

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 协议类型 | protocol | select | 是 | 选项来源: dict-protocol |
| 服务器地址 | serverHost | text | 是 | IP地址或域名 |
| 服务器端口 | serverPort | number | 是 | - |
| 用户名 | username | text | 是 | - |
| 密码 | password | password | 是 | 加密存储 |
| 采集频率 | collectInterval | number | 是 | 单位：秒，默认5 |

##### 采集点位配置（form）

支持动态添加多个采集点位

| 字段 | fieldKey | 类型 | 必填 | 说明 |
|------|----------|------|------|------|
| 点位名称 | tagName | text | 是 | 如：主轴温度 |
| 点位地址 | tagAddress | text | 是 | OPC UA/Modbus地址 |
| 数据类型 | dataType | select | 是 | 选项来源: dict-datatype |
| 采集设备 | equipmentId | select | 是 | 选项来源: 设备台账 |

##### 操作

| 按钮 | 类型 | 位置 | 行为 |
|------|------|------|------|
| 测试连接 | action | card-footer | action（测试连接是否成功） |
| 保存 | action | form-footer | action（保存配置） |
| 取消 | action | form-footer | navigate(/settings) |

##### 业务规则

- 保存前需测试连接成功
- 修改采集频率后立即生效

---

## 四、全局规则

### 4.1 角色权限

| 角色 | 描述 | 模块权限 |
|------|------|---------|
| 系统管理员 | 系统最高权限，负责配置和管理 | 全部模块全部权限 |
| 设备管理员 | 负责设备台账、维护计划管理 | 设备管理（全部）、维护管理（全部）、备件管理（查看）、分析报表（查看）、系统设置（基础数据） |
| 维修工程师 | 执行维修工单 | 设备管理（查看）、维护管理（工单处理）、分析报表（查看） |
| 车间主任 | 监控车间设备状态 | 监控大屏（查看）、设备管理（查看）、维护管理（查看）、分析报表（查看） |
| 采购人员 | 管理备品备件 | 备件管理（全部）、分析报表（查看） |
| 公司领导 | 查看报表 | 监控大屏（查看）、分析报表（查看） |

### 4.2 数据字典

#### dict-equipment-status（设备状态）

| 值 | 显示 | 颜色 |
|----|------|------|
| running | 运行中 | green |
| stopped | 停机 | gray |
| fault | 故障 | red |
| disabled | 停用 | default |

#### dict-equipment-category（设备分类）

| 值 | 显示 |
|----|------|
| cnc | 数控机床 |
| milling | 铣床 |
| lathe | 车床 |
| grinding | 磨床 |
| other | 其他 |

#### dict-workshop（车间）

| 值 | 显示 |
|----|------|
| ws1 | 一车间 |
| ws2 | 二车间 |
| ws3 | 三车间 |

#### dict-plan-status（计划状态）

| 值 | 显示 | 颜色 |
|----|------|------|
| pending | 待执行 | default |
| running | 执行中 | blue |
| completed | 已完成 | green |
| skipped | 已跳过 | gray |

#### dict-plan-type（计划类型）

| 值 | 显示 |
|----|------|
| maintenance | 保养 |
| overhaul | 检修 |
| calibration | 校准 |

#### dict-plan-cycle（计划周期）

| 值 | 显示 |
|----|------|
| day | 按日 |
| week | 按周 |
| month | 按月 |
| hour | 按运行小时 |

#### dict-workorder-status（工单状态）

| 值 | 显示 | 颜色 |
|----|------|------|
| pending | 待派工 | default |
| assigned | 待执行 | orange |
| processing | 执行中 | blue |
| verifying | 待验收 | purple |
| completed | 已完成 | green |
| cancelled | 已取消 | gray |

#### dict-order-type（工单类型）

| 值 | 显示 |
|----|------|
| planned | 计划维护 |
| breakdown | 故障维修 |

#### dict-priority（紧急程度）

| 值 | 显示 | 颜色 |
|----|------|------|
| high | 高 | red |
| medium | 中 | orange |
| low | 低 | green |

#### dict-spare-category（备件分类）

| 值 | 显示 |
|----|------|
| electrical | 电气元件 |
| mechanical | 机械零件 |
| hydraulic | 液压元件 |
| cutting | 刀具 |
| other | 其他 |

#### dict-stock-status（库存状态）

| 值 | 显示 | 颜色 |
|----|------|------|
| normal | 正常 | green |
| warning | 预警 | orange |
| outofstock | 缺货 | red |

#### dict-unit（单位）

| 值 | 显示 |
|----|------|
| piece | 件 |
| set | 套 |
| kg | 千克 |
| meter | 米 |

#### dict-protocol（协议类型）

| 值 | 显示 |
|----|------|
| opcua | OPC UA |
| modbus | Modbus TCP |

#### dict-datatype（数据类型）

| 值 | 显示 |
|----|------|
| bool | 布尔 |
| int | 整数 |
| float | 浮点数 |
| string | 字符串 |

### 4.3 状态流转

#### 维修工单状态流转

| 当前状态 | 操作 | 目标状态 | 条件 |
|---------|------|---------|------|
| 待派工 | 派工 | 待执行 | 指定负责人 |
| 待派工 | 取消 | 已取消 | - |
| 待执行 | 开始执行 | 执行中 | 负责人操作 |
| 执行中 | 提交验收 | 待验收 | 填写处理记录 |
| 待验收 | 验收通过 | 已完成 | 设备管理员操作 |
| 待验收 | 验收驳回 | 执行中 | 设备管理员操作 |

#### 设备状态流转

| 当前状态 | 操作 | 目标状态 | 条件 |
|---------|------|---------|------|
| 运行中 | 故障发生 | 故障 | 西门子系统自动触发或人工报修 |
| 故障 | 维修完成 | 运行中 | 工单验收通过 |
| 运行中 | 正常停机 | 停机 | - |
| 停机 | 启动 | 运行中 | - |
| 任意状态 | 停用 | 停用 | 设备管理员操作 |
| 停用 | 启用 | 运行中 | 设备管理员操作 |

---

## 附录

### A. 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| 1.0.0 | 2026-03-28 | 初始版本，基于normal场景1.0.1版本方案生成 |
