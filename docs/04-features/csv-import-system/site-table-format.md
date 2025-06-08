---
title: "Site Table Format"
description: "Site Table Format相关文档"
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

# 🌐 网站表格格式说明

## 🎯 概述

网站表格用于定义各个菜单下的具体网站数据，对应配置文件中的 `Site` 接口。

## 📊 网站表格结构

### 表头定义

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `menuName` | 必填 | 所属菜单名称 | 追踪系统 |
| `submenuName` | 可选 | 所属子菜单名称 | PoP流量 |
| `title` | 必填 | 网站标题 | Binom |
| `description` | 必填 | 网站描述 | 老毛子写的高性能tracker |
| `url` | 可选 | 网站链接 | https://binom.org |
| `logo` | 可选 | Logo链接 | /logos/binom.png |
| `advantages` | 可选 | 优势特点 | 跳转速度快;价格基于服务器;报表生成快 |
| `features` | 可选 | 功能特性 | 多用户管理;API支持;无限域名 |
| `intro` | 可选 | 详细介绍 | Binom是由俄罗斯开发团队开发的... |
| `pricing` | 可选 | 价格信息 | 基础版本起价约$100/月 |
| `pros` | 可选 | 优点 | 性价比高;响应速度快;安装简单 |
| `cons` | 可选 | 缺点 | 需要管理服务器;界面简单 |
| `tips` | 可选 | 使用技巧 | 建议选择SSD服务器;新手先用共享方案 |
| `relatedTitles` | 可选 | 相关网站标题 | Voluum;FunnelFlux |
| `relatedDescriptions` | 可选 | 相关网站描述 | 业界知名tracker;功能强大但昂贵 |

### 字段详细说明

#### `menuName` - 所属菜单名称
- 必须与菜单表格中的 `name` 字段匹配
- 用于确定网站归属的顶级分类

#### `submenuName` - 所属子菜单名称  
- 可选字段，仅当网站属于子菜单时填写
- 必须与菜单表格中对应的子菜单 `name` 字段匹配
- 空值表示网站直接属于顶级菜单

#### `title` - 网站标题
- 显示在导航卡片上的主标题
- 建议简洁明了

#### `description` - 网站描述
- 显示在标题下方的简短描述
- 建议控制在50字以内

#### `url` - 网站链接
- 完整的网站URL
- 支持 `#` 表示暂无链接

#### `logo` - Logo链接
- 网站Logo图片的URL或路径
- 建议使用相对路径如 `/logos/site-name.png`

#### 多值字段（用分号分隔）
- `advantages` - 优势特点列表
- `features` - 功能特性列表  
- `pros` - 优点列表
- `cons` - 缺点列表
- `tips` - 使用技巧列表
- `relatedTitles` - 相关网站标题列表
- `relatedDescriptions` - 相关网站描述列表

#### 详细信息字段
- `intro` - 详细介绍文本
- `pricing` - 价格信息描述

## 📝 Excel/CSV 模板

### 表头行
```csv
menuName,submenuName,title,description,url,logo,advantages,features,intro,pricing,pros,cons,tips,relatedTitles,relatedDescriptions
```

### 示例数据

```csv
menuName,submenuName,title,description,url,logo,advantages,features,intro,pricing,pros,cons,tips,relatedTitles,relatedDescriptions
追踪系统,,Binom,老毛子写的高性能tracker,https://binom.org,/logos/binom.png,跳转速度快;价格基于服务器;报表生成快,多用户管理;API支持;无限域名,Binom是由俄罗斯开发团队开发的高性能追踪系统,基础版本起价约$100/月,性价比高;响应速度快;安装简单,需要管理服务器;界面简单,建议选择SSD服务器;新手先用共享方案,Voluum;FunnelFlux,业界知名tracker;功能强大但昂贵
追踪系统,,Voluum,业界成名较早的tracker之一,https://voluum.com,/logos/voluum.png,云端部署;完善报表;支持多种追踪模式,防作弊系统;团队协作,Voluum是业内最知名的追踪系统之一,按点击计费起价$69/月,部署简单;界面美观;客服及时,价格较贵;部分功能需高套餐,先使用试用版;选择合适套餐,Binom;RedTrack,高性价比自建系统;新一代云追踪
流量平台,PoP流量,PropellerAds,很多人都在用的平台,https://propellerads.com,/logos/propellerads.png,全球流量覆盖;支持多种广告形式;门槛低,实时报表;智能出价;反作弊,PropellerAds是全球领先的Pop和Push广告网络,最低充值$100,流量质量稳定;覆盖地区广;优化工具完善,部分地区竞争激烈;优质流量成本高,从小预算开始;注意黑名单过滤,Adcash;Popads,大佬们都在用;老牌Pop联盟
流量平台,PoP流量,Zeropark,老牌流量平台Pop和Domain流量质量好,https://zeropark.com,/logos/zeropark.png,高质量Pop流量;强大定向;详细数据分析,Domain流量;RON/ROC投放,Zeropark是业内知名的流量平台,最低充值$200,流量质量高;定向丰富;报表专业,入门门槛高;需要大测试预算,准备充足预算;重视数据收集,PropellerAds;Popcash,很多人都在用;历史悠久联盟
```

## 🏗️ 生成的结构

上述表格将生成以下网站数据结构：

```json
{
  "menuItems": [
    {
      "name": "追踪系统",
      "type": "single",
      "sites": [
        {
          "title": "Binom",
          "description": "老毛子写的高性能tracker",
          "url": "https://binom.org",
          "logo": "/logos/binom.png",
          "advantages": ["跳转速度快", "价格基于服务器", "报表生成快"],
          "features": ["多用户管理", "API支持", "无限域名"],
          "details": {
            "intro": "Binom是由俄罗斯开发团队开发的高性能追踪系统",
            "pricing": "基础版本起价约$100/月",
            "pros": ["性价比高", "响应速度快", "安装简单"],
            "cons": ["需要管理服务器", "界面简单"],
            "tips": ["建议选择SSD服务器", "新手先用共享方案"]
          },
          "related": [
            {"title": "Voluum", "description": "业界知名tracker"},
            {"title": "FunnelFlux", "description": "功能强大但昂贵"}
          ]
        }
      ]
    },
    {
      "name": "流量平台", 
      "type": "tabs",
      "submenu": [
        {
          "name": "PoP流量",
          "sites": [
            {
              "title": "PropellerAds",
              "description": "很多人都在用的平台"
              // ... 其他字段
            }
          ]
        }
      ]
    }
  ]
}
```

## ⚠️ 注意事项

1. **菜单匹配**：`menuName` 和 `submenuName` 必须与菜单表格中定义的名称完全匹配
2. **分隔符**：多值字段使用英文分号 `;` 分隔
3. **相关网站**：`relatedTitles` 和 `relatedDescriptions` 数量必须一致
4. **编码格式**：CSV文件使用 UTF-8 编码
5. **空值处理**：可选字段可以留空，但不要删除列

## 🔄 导入流程

1. 先导入菜单表格，建立分类结构
2. 再导入网站表格，填充具体内容  
3. 系统自动验证数据完整性
4. 生成最终的配置文件
