# 🏥 医路相伴 (MedPal)

院外医患长效随访健康管理平台 —— 连接医生与患者，从院内到院外的全周期健康守护。

## 业务介绍

医路相伴是一个多端协同的医患沟通与健康管理平台，覆盖院外随访全场景：

| 端 | 用户 | 终端类型 | 路径 | 核心功能 |
|---|---|---|---|---|
| **患者端** | 患者 | H5 | `/patient/` | 健康档案 · 在线咨询 · 用药提醒 · 医药商城 · 病友圈子 |
| **医生端** | 医生 | H5 | `/doctor/` | 患者管理 · 咨询回复 · 随访计划 · 助理账号 |
| **医患管理端** | 机构管理员 | Web | `/management/` | 数据看板 · 医生/患者管理 · 商品订单 · 机构设置 |
| **平台端** | 平台管理员 | Web | `/platform/` | 租户审核 · 全量总览 · 内容风控 · 合规管理 · 系统配置 |

> 当前所有数据均为 Mock 模拟，开箱即用。

---

## 技术架构

```
ylxb/
├── index.html                  # 统一入口导航页
├── vite.config.ts              # 根 Vite 配置（开发入口 + 代理）
├── package.json                # 根 package（scripts）
├── pnpm-workspace.yaml         # pnpm monorepo 工作空间
├── tsconfig.base.json          # 共享 TypeScript 配置
├── scripts/
│   └── build.sh                # 生产构建脚本（聚合所有子包）
│
├── packages/
│   ├── patient-h5/             # 患者端 - Vue 3 + Vant UI + Vite
│   │   ├── src/
│   │   │   ├── views/
│   │   │   │   ├── auth/       #   登录 / 注册 / 实名认证
│   │   │   │   ├── home/       #   首页
│   │   │   │   ├── health/     #   健康档案 / 报告上传 / 体征 / 用药
│   │   │   │   ├── consultation/ # 咨询列表 / 咨询对话 / 医生列表
│   │   │   │   ├── mall/       #   商城首页 / 商品详情 / 购物车 / 订单
│   │   │   │   ├── community/  #   病友圈子 / 帖子详情 / 发帖
│   │   │   │   ├── reminders/  #   用药提醒
│   │   │   │   └── profile/    #   个人中心
│   │   │   ├── router/         #   Vue Router (Hash 模式)
│   │   │   ├── stores/         #   Pinia 状态管理
│   │   │   └── styles/         #   全局样式
│   │   └── vite.config.ts      #   base: /patient/
│   │
│   ├── doctor-h5/              # 医生端 - Vue 3 + Vant UI + Vite
│   │   ├── src/views/
│   │   │   ├── auth/           #   登录
│   │   │   ├── home/           #   首页
│   │   │   ├── patients/       #   患者列表 / 患者详情
│   │   │   ├── consultation/   #   咨询管理 / 咨询对话
│   │   │   ├── follow-up/      #   随访计划 / 创建 / 详情
│   │   │   ├── assistants/     #   助理列表 / 创建 / 权限
│   │   │   └── profile/        #   个人中心
│   │   └── vite.config.ts      #   base: /doctor/
│   │
│   ├── management-web/         # 医患管理端 - Vue 3 + Element Plus + ECharts + Vite
│   │   ├── src/views/
│   │   │   ├── auth/           #   登录
│   │   │   ├── dashboard/      #   数据概览 (ECharts)
│   │   │   ├── doctors/        #   医生列表 / 邀请 / 详情
│   │   │   ├── patients/       #   患者列表 / 邀请 / 黑名单
│   │   │   ├── products/       #   商品列表 / 新增 / 编辑
│   │   │   ├── orders/         #   订单列表 / 详情
│   │   │   ├── follow-up/      #   随访数据
│   │   │   ├── assistants/     #   权限模板
│   │   │   └── settings/       #   机构设置
│   │   └── vite.config.ts      #   base: /management/
│   │
│   ├── platform-web/           # 平台端 - Vue 3 + Element Plus + ECharts + Vite
│   │   ├── src/views/
│   │   │   ├── auth/           #   登录
│   │   │   ├── dashboard/      #   数据总览
│   │   │   ├── tenants/        #   入驻审核 / 租户列表 / 详情
│   │   │   ├── users/          #   医生总览 / 患者总览
│   │   │   ├── moderation/     #   社区审核 / 咨询审核
│   │   │   ├── compliance/     #   设备合规 / 知识库
│   │   │   ├── system/         #   系统配置 / 操作日志
│   │   │   └── profile/        #   个人中心
│   │   └── vite.config.ts      #   base: /platform/
│   │
│   └── shared/                 # 共享模块
│       └── src/
│           ├── api/            #   HTTP 请求封装 + Mock 注册器
│           ├── mock/           #   Mock 数据（全部业务数据）
│           ├── types/          #   类型定义（用户/健康/咨询/商城/社区/随访/租户）
│           ├── constants/      #   常量配置 + 枚举
│           └── utils/          #   工具函数（日期/格式化/存储/校验）
```

---

## 技术栈

```
Vue 3 · Vue Router · Pinia · TypeScript · Vite · pnpm monorepo

患者端/医生端:  Vant 4 (移动端 H5 UI)
管理端/平台端:  Element Plus + ECharts (桌面端 UI + 图表)
共享层:         Mock 数据驱动，无需后端即可运行
```

---

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发（5 个服务同时启动，统一入口 localhost:3000）
pnpm dev

# 3. 生产构建（输出到 dist/）
pnpm build

# 4. 本地预览生产构建
pnpm preview
```

### 开发模式

| 服务 | 端口 | 说明 |
|---|---|---|
| 根入口 | `:3000` | Vite 静态 + 代理，统一入口 |
| patient-h5 | `:3001` | 患者端 Vite dev server |
| doctor-h5 | `:3002` | 医生端 Vite dev server |
| management-web | `:3003` | 医患管理端 Vite dev server |
| platform-web | `:3004` | 平台端 Vite dev server |

根 Vite 配置了代理规则：
- `/patient/*` → `localhost:3001`
- `/doctor/*` → `localhost:3002`
- `/management/*` → `localhost:3003`
- `/platform/*` → `localhost:3004`

打开 `http://localhost:3000` 即可访问全部端，无需手动切换端口。

---

## 部署

### Cloudflare Pages

| 配置项 | 值 |
|---|---|
| 构建命令 | `bash scripts/build.sh` |
| 输出目录 | `dist` |
| Node 版本 | `>= 18` |

构建产物结构：

```
dist/
├── index.html          # 入口导航页
├── patient/            # 患者端
├── doctor/             # 医生端
├── management/         # 医患管理端
└── platform/           # 平台端
```

### 快速演示地址
https://ylxb.pages.dev/

### 快速演示账号

| 角色 | 手机号 | 说明 |
|---|---|---|
| 患者 | `13800001111` | 患者端登录 |
| 医生 | `13900001111` | 医生端登录 |
| 机构管理员 | `13900009999` | 医患管理端登录 |
| 平台管理员 | `13900008888` | 平台端登录 |

> 仅需手机号登录，无需真实验证码。
