---
title: "模板使用指南"
description: "Augment Template Starter 的完整使用和维护指南"
type: "docs"
category: "01-getting-started"
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
target_audience: ["developers", "project-managers", "teams"]
prerequisites: ["git", "nodejs", "basic-markdown"]
step_by_step: true
practical_examples: true
related_guides: ["git-hooks-guide.md", "front-matter-standards.md"]

cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: true
  - show_edit_link: true
  - show_last_modified: true
---

# 🚀 Augment Template Starter 使用指南

## 🎯 概述

本指南将帮助你快速上手 Augment Template Starter，建立高效的 AI-Human 协作开发环境。

## 🏁 快速开始

### 1. 创建新项目

#### 使用 GitHub 模板
```bash
# 方法1: 使用 GitHub "Use this template" 按钮
# 1. 访问 https://github.com/51nav/Astro-nav
# 2. 点击 "Use this template" 按钮
# 3. 创建新仓库

# 方法2: 克隆仓库
git clone https://github.com/51nav/Astro-nav.git your-project-name
cd your-project-name
```

#### 初始化项目
```bash
# 安装依赖
npm install

# 安装 Git Hooks (重要!)
npm run install-hooks

# 验证安装
git status
```

### 2. 自定义项目信息

#### 更新 package.json
```json
{
  "name": "your-project-name",
  "description": "你的项目描述",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-project.git"
  }
}
```

#### 更新项目文档
```bash
# 编辑主文档
vim docs/_index.md
# 将 title 从 "Augment Template Starter" 改为你的项目名

# 编辑 README.md
vim README.md
# 更新项目名称、描述和相关信息
```

### 3. 配置 Git 仓库
```bash
# 设置远程仓库
git remote set-url origin https://github.com/your-username/your-project.git

# 首次提交
git add .
git commit -m "feat: 基于 Augment Template Starter 初始化项目"
git push -u origin main
```

## 📚 文档体系使用

### 9大分类架构

#### 用户导向层
- **01-getting-started**: 快速开始和入门指南
- **02-user-guides**: 用户操作指南
- **06-deployment**: 部署和运维文档

#### 开发技术层
- **03-development**: 开发环境、规范和架构
- **04-features**: 功能设计和实现
- **05-technical**: 技术规范和API文档
- **07-design**: 系统设计和架构文档

#### 项目管理层
- **08-project-management**: 项目规划、进度和管理
- **09-references**: 参考资料、规范和最佳实践

### 文档创建流程

#### 1. 选择合适的分类
```bash
# 根据文档类型选择目录
docs/03-development/     # 开发相关
docs/04-features/        # 功能文档
docs/08-project-management/  # 项目管理
```

#### 2. 创建文档文件
```bash
# 创建新文档
touch docs/03-development/new-feature-guide.md

# 自动生成 Front Matter
npm run generate-front-matter
```

#### 3. 编辑文档内容
```markdown
---
title: "新功能指南"
description: "新功能的使用和配置指南"
type: "docs"
category: "03-development"
doc_type: "guide"
# ... 其他 Front Matter 字段
---

# 新功能指南

## 概述
...
```

#### 4. 更新索引文件
```bash
# 编辑对应的 _index.md 文件
vim docs/03-development/_index.md
# 在文档列表中添加新文档链接
```

## 🔧 核心工具使用

### Git Hooks 自动时间戳

#### 安装和配置
```bash
# 安装 Git Hooks
npm run install-hooks

# 验证安装
ls -la .git/hooks/pre-commit
```

#### 日常使用
```bash
# 正常的 Git 工作流程
vim docs/example.md
git add docs/example.md
git commit -m "更新文档"
# Git Hooks 会自动更新 lastModified 字段
```

#### 手动更新时间戳
```bash
# 手动运行时间戳更新
npm run update-timestamps
```

### Front Matter 生成器

#### 批量生成 Front Matter
```bash
# 为所有缺少 Front Matter 的文档添加
npm run generate-front-matter
```

#### 自定义 Front Matter
```yaml
---
title: "自定义标题"
description: "自定义描述"
type: "docs"
category: "03-development"
doc_type: "guide"  # guide/standard/overview/plan/design/reference
order: 1
version: "1.0"
# Git Hooks 自动管理的字段
created: "2025-06-08"
lastModified: "2025-06-08"
author: "作者名称"
maintainer: "维护者名称"
status: "active"  # active/draft/archived/deprecated
difficulty: "beginner"  # beginner/intermediate/advanced

# 类型特定字段 (根据 doc_type 添加)
target_audience: ["developers"]
prerequisites: ["git", "nodejs"]
step_by_step: true
practical_examples: true

cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: true
  - show_edit_link: true
  - show_last_modified: true
---
```

## 🤖 AI 协作最佳实践

### 结构化交互

#### 1. 使用文档驱动开发
```markdown
# 在开始编码前，先创建设计文档
docs/07-design/feature-design.md

# 明确需求和技术方案
docs/04-features/feature-specification.md

# 制定实施计划
docs/08-project-management/implementation-plan.md
```

#### 2. 维护项目上下文
```bash
# 定期更新项目概览
vim docs/08-project-management/project-overview.md

# 记录重要决策
vim docs/09-references/decision-log.md

# 维护变更日志
vim docs/08-project-management/changelog.md
```

#### 3. 标准化任务分解
```markdown
# 使用统一的任务模板
## 任务概述
## 技术要求
## 验收标准
## 实施步骤
## 风险评估
```

### AI 友好的文档结构

#### 1. 清晰的标题层次
```markdown
# 主标题 (H1)
## 章节标题 (H2)
### 小节标题 (H3)
#### 详细说明 (H4)
```

#### 2. 结构化的信息组织
```markdown
## 📋 需求分析
- 功能需求
- 性能需求
- 兼容性需求

## 🏗️ 技术方案
- 架构设计
- 技术选型
- 实现方案

## ✅ 验收标准
- [ ] 功能完整性
- [ ] 性能指标
- [ ] 代码质量
```

## 📊 项目管理工作流

### 项目规划

#### 1. 创建项目计划
```bash
# 创建项目计划文档
touch docs/08-project-management/project-plan.md
npm run generate-front-matter
```

#### 2. 制定里程碑
```markdown
## 里程碑规划

### Milestone 1: 基础架构 (Week 1)
- [ ] 环境搭建
- [ ] 基础组件开发
- [ ] 文档框架建立

### Milestone 2: 核心功能 (Week 2-3)
- [ ] 主要功能实现
- [ ] 测试用例编写
- [ ] 文档完善

### Milestone 3: 优化发布 (Week 4)
- [ ] 性能优化
- [ ] 用户测试
- [ ] 正式发布
```

### 进度跟踪

#### 1. 周计划管理
```bash
# 创建周计划
mkdir -p docs/08-project-management/weekly-plans
touch docs/08-project-management/weekly-plans/week1-planning.md
```

#### 2. 任务清单
```bash
# 创建任务清单
mkdir -p docs/08-project-management/todo-lists
touch docs/08-project-management/todo-lists/current-tasks.md
```

## 🔍 质量保证

### 文档质量检查

#### 1. Front Matter 验证
```bash
# 检查所有文档的 Front Matter
npm run generate-front-matter
# 查看输出，确保所有文档都有正确的 Front Matter
```

#### 2. 链接检查
```bash
# 手动检查文档间的链接
# 确保所有相对链接都正确
```

#### 3. 内容一致性
- 检查术语使用的一致性
- 确保文档结构符合规范
- 验证代码示例的正确性

### 版本管理

#### 1. 文档版本控制
```yaml
# 在 Front Matter 中管理版本
version: "1.0"  # 主要更新
version: "1.1"  # 功能增加
version: "1.0.1"  # 错误修复
```

#### 2. 变更记录
```bash
# 维护变更日志
vim docs/08-project-management/changelog.md
```

## 🚀 部署和分享

### 创建 GitHub 模板

#### 1. 清理项目特定内容
```bash
# 移除项目特定的文件和配置
# 保留通用的模板结构
```

#### 2. 设置模板仓库
```bash
# 在 GitHub 仓库设置中启用 "Template repository"
```

#### 3. 编写模板文档
```bash
# 更新 README.md 为模板说明
# 提供详细的使用指南
```

### 团队协作

#### 1. 团队成员入门
```bash
# 为新成员提供快速入门指南
docs/01-getting-started/team-onboarding.md
```

#### 2. 协作规范
```bash
# 建立团队协作规范
docs/03-development/collaboration-guidelines.md
```

## 📋 常见问题

### Git Hooks 问题

**Q: Git Hooks 没有执行？**
```bash
# 检查 hook 文件是否存在
ls -la .git/hooks/pre-commit

# 重新安装 hooks
npm run install-hooks
```

**Q: 时间戳没有更新？**
```bash
# 手动运行时间戳更新
npm run update-timestamps

# 检查文件是否在暂存区
git status
```

### Front Matter 问题

**Q: Front Matter 格式错误？**
```bash
# 重新生成 Front Matter
npm run generate-front-matter

# 检查 YAML 语法
# 确保缩进和引号正确
```

**Q: 文档类型不正确？**
```yaml
# 手动调整 doc_type
doc_type: "guide"  # guide/standard/overview/plan/design/reference
```

## 🎯 最佳实践总结

### 1. 文档优先
- 先写文档，再写代码
- 保持文档与代码同步
- 定期审查和更新文档

### 2. 标准化流程
- 使用统一的 Front Matter 格式
- 遵循文档组织规范
- 保持命名约定一致

### 3. 自动化工具
- 充分利用 Git Hooks
- 使用 Front Matter 生成器
- 建立质量检查流程

### 4. 团队协作
- 建立清晰的协作规范
- 定期进行文档审查
- 分享最佳实践经验

---

**指南版本**: v1.0  
**适用版本**: Augment Template Starter v1.0+  
**维护者**: 项目团队  
**最后更新**: 2025-06-08
