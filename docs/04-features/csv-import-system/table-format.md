---
title: "Table Format"
description: "Table Format相关文档"
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

# 📊 表格导入格式说明

## 🎯 概述

本工具支持从Excel (.xlsx) 或 CSV 文件导入导航数据，自动生成配置文件。

## 📋 表格结构

### 必填字段

| 字段名 | 说明 | 示例 |
|--------|------|------|
| `category` | 分类名称 | 追踪系统 |
| `title` | 网站/工具名称 | Binom |
| `description` | 简短描述 | 老毛子写的高性能tracker |

### 可选字段

| 字段名 | 说明 | 示例 |
|--------|------|------|
| `subcategory` | 子分类名称 | PoP流量 |
| `url` | 网站链接 | https://binom.org |
| `logo` | Logo图片链接 | /logos/binom.png |
| `advantages` | 优势特点（用分号分隔） | 跳转速度快;价格基于服务器;报表生成快 |
| `pricing` | 价格信息 | 基础版本起价约$100/月 |
| `pros` | 优点（用分号分隔） | 性价比高;响应速度快;安装简单 |
| `cons` | 缺点（用分号分隔） | 需要管理服务器;界面简单 |
| `tips` | 使用技巧（用分号分隔） | 建议选择SSD服务器;新手先用共享方案 |
| `intro` | 详细介绍 | Binom是由俄罗斯开发团队开发的高性能追踪系统... |
| `relatedTitles` | 相关网站标题（用分号分隔） | Voluum;FunnelFlux |
| `relatedDescriptions` | 相关网站描述（用分号分隔） | 业界知名tracker;功能强大但昂贵 |

## 📝 表格模板

### Excel/CSV 表头行（第一行）

```
category,subcategory,title,description,url,logo,advantages,pricing,pros,cons,tips,intro,relatedTitles,relatedDescriptions
```

### 示例数据行

```csv
追踪系统,,Binom,老毛子写的高性能tracker,https://binom.org,/logos/binom.png,跳转速度快;价格基于服务器;报表生成快,基础版本起价约$100/月,性价比高;响应速度快;安装简单,需要管理服务器;界面简单,建议选择SSD服务器;新手先用共享方案,Binom是由俄罗斯开发团队开发的高性能追踪系统,Voluum;FunnelFlux,业界知名tracker;功能强大但昂贵
流量平台,PoP流量,PropellerAds,很多人都在用的平台,https://propellerads.com,,全球流量覆盖广;支持多种广告形式,最低充值$100,流量质量稳定;覆盖地区广,部分地区竞争激烈;成本较高,从小预算开始;注意黑名单过滤,PropellerAds是全球领先的Pop和Push广告网络,,
```

## 🔧 分类结构说明

### 单级分类
如果只填写 `category` 字段，不填写 `subcategory`，则生成单级分类结构：

```
追踪系统
├── Binom
├── Voluum
└── FunnelFlux
```

### 多级分类（带子分类）
如果同时填写 `category` 和 `subcategory`，则生成多级分类结构：

```
流量平台
├── PoP流量
│   ├── PropellerAds
│   └── Zeropark
├── 原生广告流量
│   ├── MGID
│   └── Taboola
└── Push流量
    ├── RichAds
    └── Megapu.sh
```

## ⚠️ 注意事项

1. **字段分隔符**：多个值用英文分号 `;` 分隔
2. **编码格式**：CSV文件请使用 UTF-8 编码
3. **空值处理**：可选字段可以留空，但不要删除列
4. **相关网站**：`relatedTitles` 和 `relatedDescriptions` 必须一一对应
5. **URL格式**：建议使用完整的URL，如 `https://example.com`

## 📥 支持的文件格式

- ✅ Excel (.xlsx)
- ✅ CSV (.csv)
- ❌ 旧版Excel (.xls) - 请转换为 .xlsx 格式

## 🎨 图标说明

系统会根据分类名称自动分配图标：

| 分类名称 | 图标 |
|----------|------|
| 追踪系统 | mdi:chart-line |
| SPY服务 | mdi:eye |
| 流量平台 | mdi:traffic-light |
| 综合性联盟 | mdi:handshake |
| 其他 | mdi:web |

如需自定义图标，请在生成配置文件后手动修改。
