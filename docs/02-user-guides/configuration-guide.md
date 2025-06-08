---
title: "Configuration Guide"
description: "Configuration Guide相关文档"
type: "docs"
category: "02-user-guides"
doc_type: "guide"
order: 1
version: "1.0"
created: "2025-06-08"
lastModified: "2025-06-08"
author: "项目团队"
maintainer: "维护者名称"
status: "active"
difficulty: "beginner"

# 指南特有字段
target_audience: ["developers"]
prerequisites: []
step_by_step: true
practical_examples: true

cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: true
  - show_edit_link: true
  - show_last_modified: true
---

# 🎯 配置化导航系统使用指南

## 📋 概述

本项目已重构为配置化架构，用户可以通过修改配置文件来定制自己的导航网站，无需修改代码。

## 🏗️ 架构设计

### 文件结构
```
src/
├── config/
│   └── site.ts              # 网站基础配置
├── data/
│   └── config.json          # 主要导航数据配置
├── types/
│   ├── config.ts            # 新的配置类型定义
│   └── navigation.ts        # 旧的类型定义（向后兼容）
├── utils/
│   ├── config.ts            # 配置读取工具
│   └── dataConverter.ts     # 数据格式转换工具
└── components/
    ├── ConfigurableNavCard.astro    # 新的配置化导航卡片
    └── ConfigurableSidebar.astro    # 新的配置化侧边栏
```

## 🔧 配置文件说明

### 1. 主配置文件 (`src/data/config.json`)

```json
{
  "site": {
    "title": "您的网站标题",
    "description": "网站描述",
    "logo": {
      "text": "Logo文字",
      "href": "/"
    }
  },
  "categoryMap": {
    "分类名称": "category-id"
  },
  "menuItems": [
    {
      "name": "分类名称",
      "href": "#category-anchor",
      "icon": "mdi:icon-name",
      "type": "single",
      "sites": [...]
    }
  ]
}
```

### 2. 网站数据结构

```json
{
  "title": "网站名称",
  "description": "网站描述",
  "url": "https://example.com",
  "logo": "/logos/site-logo.png",
  "advantages": [
    "优势1",
    "优势2"
  ],
  "details": {
    "intro": "详细介绍",
    "pricing": "价格信息",
    "pros": ["优点1", "优点2"],
    "cons": ["缺点1", "缺点2"],
    "tips": ["使用技巧1", "使用技巧2"]
  },
  "related": [
    {
      "title": "相关网站",
      "description": "相关网站描述"
    }
  ]
}
```

## 🚀 快速开始

### 1. 修改网站基础信息

编辑 `src/data/config.json` 中的 `site` 部分：

```json
{
  "site": {
    "title": "我的导航网站",
    "description": "专业的工具导航平台",
    "logo": {
      "text": "MyNav",
      "href": "/"
    }
  }
}
```

### 2. 添加新分类

在 `menuItems` 数组中添加新的分类：

```json
{
  "name": "设计工具",
  "href": "#design",
  "icon": "mdi:palette",
  "type": "single",
  "sites": [
    {
      "title": "Figma",
      "description": "协作设计工具",
      "url": "https://figma.com",
      "advantages": [
        "实时协作",
        "云端同步",
        "插件丰富"
      ]
    }
  ]
}
```

### 3. 创建带子分类的分类

```json
{
  "name": "开发工具",
  "href": "#development",
  "icon": "mdi:code-tags",
  "type": "tabs",
  "submenu": [
    {
      "name": "前端工具",
      "href": "#dev-frontend",
      "icon": "mdi:web",
      "sites": [...]
    },
    {
      "name": "后端工具", 
      "href": "#dev-backend",
      "icon": "mdi:server",
      "sites": [...]
    }
  ]
}
```

## 🎨 图标使用

项目使用 [Iconify](https://iconify.design/) 图标库，支持 Material Design Icons：

- `mdi:chart-line` - 图表线条
- `mdi:eye` - 眼睛
- `mdi:traffic-light` - 交通灯
- `mdi:handshake` - 握手
- `mdi:code-tags` - 代码标签
- `mdi:palette` - 调色板

更多图标请访问：https://icon-sets.iconify.design/mdi/

## 🔄 数据迁移

如果您有现有的导航数据，可以使用内置的转换工具：

```typescript
import { convertNavigationData } from '../utils/dataConverter';
import { navigationData } from '../data/navigation';

// 将旧格式转换为新格式
const newConfig = convertNavigationData(navigationData);
```

## 📱 响应式设计

配置化组件已内置响应式设计：

- **桌面端**: 6列网格布局
- **平板端**: 4-5列网格布局  
- **手机端**: 1-2列网格布局

## 🛠️ 高级定制

### 1. 自定义样式

可以通过修改组件的 CSS 变量来定制样式：

```css
:root {
  --primary-color: #2937f0;
  --sidebar-width: 200px;
  --card-border-radius: 8px;
}
```

### 2. 添加新字段

在 `src/types/config.ts` 中扩展 `Site` 接口：

```typescript
export interface Site {
  // 现有字段...
  tags?: string[];
  rating?: number;
  lastUpdated?: string;
}
```

### 3. 自定义组件

创建新的组件来处理特殊的数据展示需求。

## 🔍 API 工具函数

项目提供了丰富的工具函数：

```typescript
import { 
  getConfig,
  getSiteInfo,
  getMenuItems,
  getAllSites,
  searchSites,
  getStats
} from '../utils/config';

// 获取完整配置
const config = getConfig();

// 搜索网站
const results = searchSites('设计');

// 获取统计信息
const stats = getStats();
```

## 📝 最佳实践

1. **保持数据一致性**: 确保所有必需字段都有值
2. **优化图片**: 使用适当大小的 logo 图片
3. **SEO友好**: 填写完整的描述信息
4. **定期更新**: 保持网站信息的时效性
5. **测试响应式**: 在不同设备上测试布局

## 🚀 部署

配置完成后，使用标准的 Astro 部署流程：

```bash
npm run build
npm run preview
```

## 📞 支持

如有问题，请查看：
- [Astro 文档](https://docs.astro.build)
- [项目 Issues](https://github.com/your-repo/issues)
- [配置示例](./src/pages/config-demo.astro)
