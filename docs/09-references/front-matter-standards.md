---
title: "Front Matter 规范标准"
description: "文档 Front Matter 元数据的标准化规范"
type: "docs"
category: "09-references"
doc_type: "standard"
order: 2
version: "1.0"
created: "2025-06-08"
lastModified: "2025-06-08"
author: "项目团队"
maintainer: "维护者名称"
status: "active"
difficulty: "intermediate"

# 规范特有字段
standard_type: "documentation"
enforcement_level: "mandatory"
compliance_tools: ["yaml-lint", "front-matter-validator"]
review_frequency: "quarterly"
related_standards: ["documentation-standards.md"]

cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: true
  - show_edit_link: true
  - show_last_modified: true
---

# 📋 Front Matter 规范标准

## 🎯 概述

本文档定义了项目中所有 Markdown 文档的 Front Matter 元数据标准，确保文档元数据的一致性和可维护性。

## 🏗️ Front Matter 架构

### 📂 文档类型分类

#### **1. _index.md (索引文件)**
- **根目录**: `docs/_index.md`
- **分类目录**: `docs/xx-category/_index.md`

#### **2. 普通文档 (.md)**
- **指南类**: `doc_type: "guide"`
- **规范类**: `doc_type: "standard"`
- **概览类**: `doc_type: "overview"`
- **计划类**: `doc_type: "plan"`
- **设计类**: `doc_type: "design"`
- **参考类**: `doc_type: "reference"`

## 📋 _index.md Front Matter 规范

### 根目录模板 (docs/_index.md)
```yaml
---
title: "项目名称"                   # 项目名称 (仅根目录有)
linkTitle: "文档首页"
type: "docs"
description: "项目文档中心"

# 时间信息 (Git Hooks 自动管理)
created: "2025-06-08"
lastModified: "2025-06-08"

# 作者信息
author: "项目团队"
maintainer: "维护者名称"

# 版本信息
version: "1.0"
---
```

### 分类目录模板 (docs/xx-category/_index.md)
```yaml
---
linkTitle: "分类名称"               # 分类显示名称
type: "docs"
category: "xx-category"            # 目录标识
order: x                          # 排序权重 (1-9)
icon: "🚀"                        # 分类图标
description: "分类描述"            # 分类说明

# 时间信息 (Git Hooks 自动管理)
created: "2025-06-08"
lastModified: "2025-06-08"

# 作者信息
author: "项目团队"
maintainer: "维护者名称"

# 版本信息
version: "1.0"

# 显示控制
cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: false               # 索引页不需要TOC
  - show_last_modified: true
---
```

## 📝 普通文档 Front Matter 规范

### 核心字段模板 (所有文档必需)
```yaml
---
# 基础信息
title: "文档标题"                   # 完整的文档标题
description: "文档描述"             # 文档简要描述
type: "docs"                       # 固定为 docs

# 分类信息
category: "03-development"          # 所属主分类
doc_type: "guide"                  # 文档类型
order: 1                           # 在分类中的排序

# 时间信息 (Git Hooks 自动管理)
created: "2025-06-08"              # 创建日期
lastModified: "2025-06-08"         # 最后修改日期

# 作者信息
author: "作者名称"                  # 文档作者
maintainer: "维护者名称"            # 当前维护者

# 版本信息
version: "1.0"                     # 文档版本
status: "active"                   # 状态

# 显示控制
cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: true                 # 普通文档通常需要TOC
  - show_edit_link: true
  - show_last_modified: true
---
```

### 扩展字段 (根据文档类型添加)

#### 指南类文档 (guide)
```yaml
# 指南特有字段
difficulty: "beginner"             # 难度: beginner/intermediate/advanced
estimated_reading_time: "15min"    # 预估阅读时间
target_audience: ["developers"]    # 目标用户
prerequisites: ["git", "nodejs"]   # 前置知识
step_by_step: true                # 是否为步骤指南
practical_examples: true          # 是否包含实例
related_guides: ["other-guide.md"] # 相关指南
```

#### 规范类文档 (standard)
```yaml
# 规范特有字段
standard_type: "coding"                         # 规范类型
enforcement_level: "mandatory"                 # 执行级别
compliance_tools: ["eslint", "prettier"]       # 合规工具
review_frequency: "quarterly"                  # 审查频率
related_standards: ["other-standard.md"]       # 相关规范
```

#### 计划类文档 (plan)
```yaml
# 计划特有字段
plan_type: "project"                          # 计划类型
timeline: "5 weeks"                           # 时间线
start_date: "2025-06-08"                     # 开始日期
end_date: "2025-07-13"                       # 结束日期
priority: "high"                             # 优先级
project_phase: "planning"                    # 项目阶段
```

## 🔧 字段规范详解

### 必需字段
- `title`: 文档标题
- `type`: 固定为 "docs"
- `category`: 所属分类
- `doc_type`: 文档类型

### 推荐字段
- `description`: 文档描述
- `version`: 文档版本
- `author`: 文档作者
- `maintainer`: 维护者

### 自动管理字段
- `created`: 创建日期 (Git Hooks 自动设置)
- `lastModified`: 修改日期 (Git Hooks 自动更新)

### 可选字段
- 根据 `doc_type` 添加相应的专用字段

## 📊 字段值规范

### 文档类型 (doc_type)
- `guide`: 指南类文档
- `standard`: 规范类文档
- `overview`: 概览类文档
- `plan`: 计划类文档
- `design`: 设计类文档
- `reference`: 参考类文档

### 状态 (status)
- `active`: 活跃维护
- `draft`: 草稿状态
- `archived`: 已归档
- `deprecated`: 已废弃

### 难度 (difficulty)
- `beginner`: 初级
- `intermediate`: 中级
- `advanced`: 高级

### 优先级 (priority)
- `low`: 低优先级
- `medium`: 中等优先级
- `high`: 高优先级

## 🔄 Git Hooks 自动管理

### 自动时间戳更新
- **新文件**: 首次提交时设置 `created` 和 `lastModified`
- **已存在文件**: 修改后提交时更新 `lastModified`
- **格式**: `YYYY-MM-DD` (ISO 8601 日期格式)

### 安装和使用
```bash
# 安装 Git Hooks
npm run install-hooks

# 正常提交 (自动更新时间戳)
git add docs/example.md
git commit -m "更新文档"
```

## 📋 最佳实践

### 1. 模板使用
- 使用通用的占位符名称 (如 "项目团队", "维护者名称")
- 避免硬编码具体的项目名称
- 保持字段的一致性

### 2. 字段维护
- 不要手动修改时间字段 (由 Git Hooks 自动管理)
- 定期更新 `version` 字段
- 及时更新 `status` 字段

### 3. 扩展字段
- 只添加有意义的扩展字段
- 保持字段名称的一致性
- 避免冗余信息

## 🔍 验证和检查

### 自检清单
- [ ] 包含所有必需字段
- [ ] 字段值符合规范
- [ ] 时间格式正确
- [ ] 文档类型准确
- [ ] 扩展字段合理

### 验证工具
- YAML 语法检查
- Front Matter 字段验证
- Git Hooks 时间戳管理

---

**规范版本**: v1.0  
**制定日期**: 2025-06-08  
**适用范围**: 所有项目文档  
**维护者**: 项目团队  
**状态**: 正式生效
