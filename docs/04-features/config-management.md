---
title: "Config Management"
description: "Config Management相关文档"
type: "docs"
category: "04-features"
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

# 📋 配置文件整理方案

## 🔍 当前配置文件状态分析

### 📁 现有文件

1. **`src/data/navigation.ts`** (2712行) - ❌ **需要清理**
   - 包含大量硬编码的导航数据
   - 使用旧的数据结构
   - 不利于配置化管理

2. **`src/config/site.ts`** - ⚠️ **需要合并**
   - 包含基础网站配置
   - TypeScript格式，不利于用户编辑

3. **`src/data/config.json`** - ✅ **保留并完善**
   - 新的配置化格式
   - 用户友好的JSON格式

## 🎯 整理目标

### **统一配置文件结构**

```
src/
├── config/
│   └── site.json          # 🎯 唯一的配置文件
├── utils/
│   └── config.ts          # 配置读取工具
└── types/
    └── config.ts          # 类型定义
```

## 🔄 迁移步骤

### **第1步：数据迁移**

将 `src/data/navigation.ts` 中的数据转换为新格式：

```typescript
// 旧格式 (navigation.ts)
export const navigationData: Category[] = [
  {
    name: "追踪系统",
    icon: "mdi:chart-line", 
    items: [...]
  }
];

// 新格式 (site.json)
{
  "menuItems": [
    {
      "name": "追踪系统",
      "href": "#tracking",
      "icon": "mdi:chart-line",
      "type": "single",
      "sites": [...]
    }
  ]
}
```

### **第2步：文件清理**

**删除的文件：**
- ❌ `src/data/navigation.ts` - 硬编码数据文件
- ❌ `src/config/site.ts` - TypeScript配置文件

**保留的文件：**
- ✅ `src/config/site.json` - 统一配置文件
- ✅ `src/utils/config.ts` - 配置读取工具
- ✅ `src/types/config.ts` - 类型定义

### **第3步：代码更新**

更新所有引用旧配置的代码：

```typescript
// 旧的引用方式
import { navigationData } from '../data/navigation';

// 新的引用方式  
import { getConfig, getMenuItems } from '../utils/config';
const menuItems = getMenuItems();
```

## 📊 数据转换映射

### **Category → MenuItem 转换**

```typescript
// 旧结构
interface Category {
  name: string;
  icon: string;
  subCategories?: SubCategory[];
  items?: NavItem[];
}

// 新结构
interface MenuItem {
  name: string;
  href: string;
  icon: string;
  type: 'single' | 'tabs';
  sites?: Site[];
  submenu?: SubMenuItem[];
}
```

### **NavItem → Site 转换**

```typescript
// 旧结构
interface NavItem {
  title: string;
  description?: string;
  url?: string;
  features?: string[];
  details?: {...};
}

// 新结构
interface Site {
  title: string;
  description: string;
  url?: string;
  advantages?: string[];
  details?: {...};
}
```

## 🛠️ 实施建议

### **方案A：自动迁移** (推荐)

创建迁移脚本自动转换数据：

```typescript
// scripts/migrate-config.ts
import { navigationData } from '../src/data/navigation';
import { convertNavigationData } from '../src/utils/dataConverter';

const newConfig = convertNavigationData(navigationData);
// 写入 src/config/site.json
```

### **方案B：手动整理**

1. 保留重要数据
2. 删除过时信息
3. 按新格式重新组织

### **方案C：混合方式**

1. 先自动迁移主要数据
2. 手动优化和清理
3. 验证数据完整性

## 📋 迁移检查清单

### **数据完整性检查**
- [ ] 所有分类都已迁移
- [ ] 网站数据完整
- [ ] 图标路径正确
- [ ] URL链接有效

### **功能验证**
- [ ] 导航渲染正常
- [ ] 搜索功能正常
- [ ] 详情弹窗正常
- [ ] 响应式布局正常

### **代码清理**
- [ ] 删除旧的导入语句
- [ ] 更新组件引用
- [ ] 清理未使用的类型
- [ ] 更新测试文件

## 🎯 最终目标

### **简化的项目结构**

```
src/
├── config/
│   └── site.json              # 🎯 唯一配置文件
├── components/
│   ├── ConfigurableNavCard.astro
│   └── ConfigurableSidebar.astro
├── utils/
│   └── config.ts              # 配置读取
├── types/
│   └── config.ts              # 类型定义
└── pages/
    └── index.astro            # 主页
```

### **用户友好的配置**

```json
{
  "site": {
    "title": "我的导航网站",
    "description": "专业导航平台"
  },
  "menuItems": [
    {
      "name": "开发工具",
      "icon": "mdi:tools",
      "type": "single",
      "sites": [
        {
          "title": "VS Code",
          "description": "强大的代码编辑器",
          "url": "https://code.visualstudio.com"
        }
      ]
    }
  ]
}
```

## 🚀 执行建议

### **立即执行**
1. 创建数据迁移脚本
2. 备份现有数据
3. 执行自动迁移

### **验证测试**
1. 检查数据完整性
2. 测试所有功能
3. 修复发现的问题

### **清理优化**
1. 删除旧文件
2. 更新文档
3. 提交代码

## ❓ 您的选择

请确认您希望的处理方式：

1. **🚀 自动迁移** - 我创建脚本自动转换所有数据
2. **✋ 手动整理** - 您手动选择需要保留的数据
3. **🔄 混合方式** - 先自动迁移，再手动优化

您希望采用哪种方式？我可以立即开始实施。
