# 🤖 Augment Template Starter

[![GitHub Stars](https://img.shields.io/github/stars/51nav/Astro-nav?style=flat-square)](https://github.com/51nav/Astro-nav)
[![GitHub Issues](https://img.shields.io/github/issues/51nav/Astro-nav?style=flat-square)](https://github.com/51nav/Astro-nav/issues)
[![License](https://img.shields.io/github/license/51nav/Astro-nav?style=flat-square)](LICENSE)

一个专为 AI-Human 协作开发设计的项目模板，提供标准化的文档体系、工作流程和开发规范，让开发者与 AI Agent 高效协作。

## ✨ 核心特性

### 🤖 AI-Human 协作优化
- **标准化交互**: 基于文档的结构化 AI 交互模式
- **上下文管理**: 通过完善的文档体系维护项目上下文
- **任务分解**: AI 友好的任务分解和执行模板
- **质量保证**: AI 辅助的代码和文档质量检查

### 📚 完整文档体系
- **9大分类架构**: 用户导向、开发技术、项目管理三层架构
- **标准化规范**: 统一的文档格式和组织规范
- **Front Matter**: 完整的元数据管理系统
- **自动化工具**: 文档生成和验证工具

### 🔄 自动化工作流
- **Git Hooks**: 自动更新文档时间戳
- **项目初始化**: 一键生成完整项目结构
- **质量检查**: 自动化的代码和文档质量验证
- **CI/CD 模板**: 标准化的持续集成流程

### 🎯 开发效率提升
- **模板化**: 开箱即用的项目模板
- **规范统一**: 统一的开发规范和最佳实践
- **工具集成**: VS Code 插件支持和自动化脚本
- **团队协作**: 标准化的团队协作流程

## 🎯 适用场景

- **AI 协作开发**: 与 AI Agent 高效协作的项目开发
- **团队标准化**: 建立统一的团队开发规范和流程
- **文档驱动开发**: 文档优先的开发模式
- **开源项目**: 需要完善文档体系的开源项目
- **企业项目**: 需要标准化管理的企业级项目

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Git
- VS Code (推荐)

### 安装步骤

```bash
# 使用此模板创建新项目
git clone https://github.com/51nav/Astro-nav.git your-project-name
cd your-project-name

# 安装依赖
npm install

# 安装 Git Hooks (自动时间戳更新)
npm run install-hooks

# 开始开发
npm run dev
```

### 初始化项目

```bash
# 1. 更新项目信息
# 编辑 package.json 中的项目名称、描述等

# 2. 更新文档
# 编辑 docs/_index.md 中的项目名称
# 根据需要修改各分类文档

# 3. 配置 Git
git remote set-url origin https://github.com/your-username/your-project.git
git add .
git commit -m "feat: 初始化项目基于 Augment Template Starter"
```

## 📁 项目结构

```text
augment-template-starter/
├── docs/                           # 📚 文档体系
│   ├── _index.md                   # 文档总入口
│   ├── 01-getting-started/         # 🚀 快速开始
│   ├── 02-user-guides/             # 👥 用户指南
│   ├── 03-development/             # 🔧 开发文档
│   ├── 04-features/                # ✨ 功能文档
│   ├── 05-technical/               # 🔬 技术规范
│   ├── 06-deployment/              # 🚀 部署文档
│   ├── 07-design/                  # 🎨 设计文档
│   ├── 08-project-management/      # 📊 项目管理
│   └── 09-references/              # 📖 参考资料
├── scripts/                        # 🔧 自动化脚本
│   ├── git-hooks/                  # Git Hooks 脚本
│   └── install-git-hooks.js        # Git Hooks 安装器
├── src/                            # 💻 源代码 (根据需要调整)
├── package.json                    # 📦 项目配置
└── README.md                       # 📖 项目说明
```

## 🧞 命令说明

| 命令 | 功能 |
|------|------|
| `npm run install-hooks` | 安装 Git Hooks (自动时间戳更新) |
| `npm run update-timestamps` | 手动更新文档时间戳 |
| `npm run dev` | 启动开发服务器 (如适用) |
| `npm run build` | 构建项目 (如适用) |

## 📚 文档体系

本模板采用标准化的9大分类文档架构：

### 🎯 三层架构设计
- **用户导向层** (01-02, 06): 面向最终用户
- **开发技术层** (03-05, 07): 面向开发者
- **项目管理层** (08-09): 面向项目管理

### 📋 核心文档
- 📋 **[文档索引](docs/_index.md)** - 完整的文档导航
- 📚 **[文档规范](docs/09-references/documentation-standards.md)** - 文档编写标准
- 🕒 **[Git Hooks 指南](docs/03-development/git-hooks-guide.md)** - 自动时间戳更新
- 🏗️ **[目录结构](docs/09-references/directory-structure.md)** - 架构设计说明

### 🚀 快速导航
- 🆕 **新用户**: [快速开始](docs/01-getting-started/) | [用户指南](docs/02-user-guides/)
- 👨‍💻 **开发者**: [开发文档](docs/03-development/) | [技术规范](docs/05-technical/)
- 📊 **项目管理**: [项目管理](docs/08-project-management/) | [参考资料](docs/09-references/)

## 🔧 核心功能

### 1. Front Matter 标准化 ✅
- 根目录和分类目录的统一 Front Matter 规范
- 自动时间戳管理 (created/lastModified)
- VS Code 插件支持的元数据格式

### 2. Git Hooks 自动化 ✅
- 自动更新文档时间戳
- 新文件自动设置创建时间
- 已存在文件自动更新修改时间

### 3. 文档规范体系 ✅
- 完整的文档编写和组织标准
- 统一的命名规范和格式要求
- 分层架构的文档组织原则

### 4. AI 协作优化 🔄
- 结构化的 AI 交互模式
- 基于文档的上下文管理
- AI 友好的任务分解模板

## 🤝 贡献指南

### 使用此模板
1. 点击 "Use this template" 创建新仓库
2. 按照安装步骤初始化项目
3. 根据需要自定义文档和配置

### 改进模板
1. Fork 此仓库
2. 创建功能分支
3. 提交 Pull Request

### 文档贡献
- 遵循 [文档规范](docs/09-references/documentation-standards.md)
- 使用标准化的 Front Matter 格式
- 确保 Git Hooks 正常工作

## 📊 项目状态

### 模板功能完成度
- ✅ **文档体系**: 9大分类架构完成
- ✅ **Front Matter**: 标准化元数据系统
- ✅ **Git Hooks**: 自动时间戳更新
- ✅ **文档规范**: 完整的编写标准
- 🔄 **AI 协作**: 持续优化中
- ⏳ **VS Code 扩展**: 计划中

### 版本历史
- **v1.0** (当前): 基础模板和文档体系
- **v1.1** (计划): AI 协作工具增强
- **v2.0** (计划): VS Code 扩展和自动化工具

## 🐛 问题反馈

- [GitHub Issues](https://github.com/51nav/Astro-nav/issues) - 报告问题或功能请求
- [GitHub Discussions](https://github.com/51nav/Astro-nav/discussions) - 讨论和交流

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- [Augment Code](https://augmentcode.com/) - AI 协作开发平台
- [Claude](https://claude.ai/) - AI 助手技术支持
- 所有使用此模板的开发者和贡献者

---

**模板维护者**: Augment Agent & Development Team  
**最后更新**: 2025-06-08  
**模板状态**: 积极维护中  
**适用于**: AI-Human 协作开发项目
