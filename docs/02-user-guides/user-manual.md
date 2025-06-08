---
title: "用户使用指南"
description: "项目使用指南和操作说明"
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
target_audience: ["end-users", "beginners"]
prerequisites: []
step_by_step: true
practical_examples: true
related_guides: ["configuration-guide.md"]

cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: true
  - show_edit_link: true
  - show_last_modified: true
---

# 📖 用户使用指南

## 🎯 快速开始

### 什么是 Astro-Nav？

Astro-Nav 是一个让您通过简单的表格数据就能生成专业导航网站的工具。无需编程知识，只需要会使用 Excel 或 CSV 文件。

### 5分钟快速上手

1. **下载模板** → 2. **填写数据** → 3. **上传生成** → 4. **部署网站**

## 🚀 详细使用流程

### 第一步：准备表格数据

#### 📋 下载模板文件
访问配置生成器，下载以下模板：
- `menu-template.csv` - 菜单结构模板
- `site-template.csv` - 网站数据模板

#### 📝 填写菜单数据 (menu-template.csv)

**必填字段：**
- `menuId`: 菜单唯一标识 (如: tracking, spy, traffic)
- `menuName`: 菜单显示名称 (如: 追踪系统, SPY服务)
- `menuIcon`: 图标名称 (如: mdi:chart-line, mdi:eye)
- `menuType`: 菜单类型 (single 或 tabs)
- `sortOrder`: 排序顺序 (数字)

**可选字段：**
- `parentMenuId`: 父菜单ID (用于子菜单)

**示例数据：**
```csv
menuId,menuName,menuIcon,menuType,parentMenuId,sortOrder
tracking,追踪系统,mdi:chart-line,single,,1
spy,SPY服务,mdi:eye,single,,2
traffic,流量平台,mdi:traffic-light,tabs,,3
traffic-pop,PoP流量,mdi:popup,single,traffic,1
traffic-push,Push流量,mdi:bell,single,traffic,2
```

#### 🌐 填写网站数据 (site-template.csv)

**必填字段：**
- `menuId`: 所属菜单ID (必须与菜单表格中的menuId匹配)
- `title`: 网站名称
- `description`: 网站描述

**可选字段：**
- `url`: 网站链接
- `logo`: Logo图片路径
- `advantages`: 优势特点 (用分号分隔)
- `features`: 功能特性 (用分号分隔)
- `pros`: 优点 (用分号分隔)
- `cons`: 缺点 (用分号分隔)
- `tips`: 使用技巧 (用分号分隔)
- `intro`: 详细介绍
- `pricing`: 价格信息
- `relatedTitles`: 相关网站标题 (用分号分隔)
- `relatedDescriptions`: 相关网站描述 (用分号分隔)
- `sortOrder`: 排序顺序

**示例数据：**
```csv
menuId,title,description,url,advantages,pros,cons,tips
tracking,Binom,高性能tracker,https://binom.org,速度快;价格合理,性价比高;响应快,需要技术;界面简单,选择SSD服务器;新手用共享方案
traffic-pop,PropellerAds,很多人都在用的平台,https://propellerads.com,覆盖面广;门槛低,流量稳定;地区广,竞争激烈;成本高,小预算开始;注意黑名单
```

### 第二步：上传和生成配置

#### 🔄 访问配置生成器
打开配置生成器网站 (如: https://nav-generator.vercel.app)

#### 📤 上传表格文件
1. 选择菜单表格文件 (menu-template.csv)
2. 选择网站表格文件 (site-template.csv)
3. 点击"解析数据"按钮

#### ✅ 验证数据
系统会自动验证数据格式：
- 检查必填字段
- 验证数据关联关系
- 提示错误和警告

#### ⚙️ 配置网站信息
填写您的网站基本信息：
- 网站标题
- 网站描述  
- Logo文字

#### 💾 下载配置文件
点击"生成配置文件"，下载 `config.json` 文件

### 第三步：部署导航网站

#### 📁 获取前端项目
1. Fork 或下载导航网站项目
2. 将下载的 `config.json` 替换项目中的 `src/config/site.json`

#### 🚀 部署到托管平台

**GitHub Pages 部署：**
1. 将项目推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 GitHub Actions 作为部署源

**Netlify 部署：**
1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令: `npm run build`
3. 设置发布目录: `dist`

**Vercel 部署：**
1. 导入 GitHub 仓库到 Vercel
2. 选择 Astro 框架预设
3. 自动部署

## 📋 数据格式详解

### 菜单结构设计

#### 单级菜单
```csv
menuId,menuName,menuIcon,menuType,parentMenuId,sortOrder
tools,开发工具,mdi:tools,single,,1
```
生成结果：
```
🔧 开发工具
  ├── VS Code
  ├── WebStorm  
  └── Sublime Text
```

#### 多级菜单
```csv
menuId,menuName,menuIcon,menuType,parentMenuId,sortOrder
design,设计资源,mdi:palette,tabs,,1
design-ui,UI设计,mdi:monitor,single,design,1
design-icon,图标资源,mdi:star,single,design,2
```
生成结果：
```
🎨 设计资源
  ├── UI设计 (标签页)
  │   ├── Figma
  │   └── Sketch
  └── 图标资源 (标签页)
      ├── Iconify
      └── Feather Icons
```

### 网站数据格式

#### 基础信息
```csv
menuId,title,description,url
tools,VS Code,强大的代码编辑器,https://code.visualstudio.com
```

#### 详细信息
```csv
menuId,title,description,advantages,pros,cons,tips
tools,VS Code,强大的代码编辑器,免费;插件丰富;跨平台,启动快;功能强,内存占用大,安装必要插件;定制主题
```

#### 相关推荐
```csv
menuId,title,description,relatedTitles,relatedDescriptions
tools,VS Code,强大的代码编辑器,WebStorm;Sublime Text,JetBrains IDE;轻量编辑器
```

## ⚠️ 常见问题

### 数据格式问题

**Q: CSV文件中文乱码怎么办？**
A: 保存CSV文件时选择UTF-8编码格式。

**Q: 分号分隔的字段如何处理？**
A: 多个值用英文分号`;`分隔，如：`优点1;优点2;优点3`

**Q: menuId重复了怎么办？**
A: 每个menuId必须唯一，检查菜单表格中是否有重复的menuId。

### 关联关系问题

**Q: 网站表格中的menuId找不到对应菜单？**
A: 确保网站表格中的menuId在菜单表格中存在。

**Q: 父子菜单关系错误？**
A: 确保子菜单的parentMenuId对应的父菜单存在，且父菜单的menuType为"tabs"。

### 部署问题

**Q: 配置文件更新后网站没有变化？**
A: 确保配置文件路径正确 (`src/config/site.json`)，并重新构建部署。

**Q: 图标不显示？**
A: 检查图标名称格式，必须使用 `mdi:` 前缀，如 `mdi:chart-line`。

## 🎨 自定义指南

### 图标选择
访问 [Iconify](https://icon-sets.iconify.design/mdi/) 选择合适的图标：
- 追踪类: `mdi:chart-line`, `mdi:analytics`
- 工具类: `mdi:tools`, `mdi:wrench`
- 社交类: `mdi:account-group`, `mdi:share`
- 搜索类: `mdi:magnify`, `mdi:search-web`

### 主题定制
修改 CSS 变量来定制主题：
```css
:root {
  --primary-color: #2937f0;
  --sidebar-width: 200px;
  --card-border-radius: 8px;
}
```

### Logo设置
将Logo文件放在 `public/logos/` 目录下，在网站数据中引用：
```csv
logo,/logos/your-logo.png
```

## 📞 获取帮助

- **文档**: 查看完整的技术文档
- **示例**: 参考示例项目和模板
- **社区**: 加入用户交流群
- **反馈**: 通过 GitHub Issues 报告问题

## 🎯 最佳实践

1. **数据准备**: 先整理好所有网站信息再填写表格
2. **分类设计**: 合理规划菜单层级，避免过深嵌套
3. **内容质量**: 提供准确的网站描述和有用的使用技巧
4. **定期更新**: 及时更新失效链接和过时信息
5. **备份配置**: 保存好配置文件，便于后续修改

---

*遇到问题？查看 [常见问题解答](FAQ.md) 或 [联系我们](mailto:support@astro-nav.com)*
