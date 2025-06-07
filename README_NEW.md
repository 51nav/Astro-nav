# 🚀 Astro-Nav - 配置驱动的导航网站

[![GitHub stars](https://img.shields.io/github/stars/your-org/astro-nav?style=social)](https://github.com/your-org/astro-nav)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-ff5d01.svg)](https://astro.build)

> 🎯 通过表格数据快速生成专业导航网站的完整解决方案

## ✨ 特性

- 🚀 **极速性能** - 纯静态部署，零API调用
- 📊 **表格驱动** - Excel/CSV导入，无需编程
- 🎨 **响应式设计** - 完美适配所有设备
- 🔍 **智能搜索** - 快速定位目标网站
- 🛠️ **易于定制** - 配置文件控制所有内容
- 💰 **零成本部署** - 支持GitHub Pages等免费托管

## 🏗️ 项目架构

本项目采用前后端分离架构：

```
📁 astro-nav-site (导航网站)     📁 astro-nav-generator (配置生成器)
├── 纯静态前端                   ├── 后端API服务
├── 配置文件驱动                 ├── 表格解析处理
├── 极速加载体验                 ├── 数据验证生成
└── 免费部署                     └── 配置文件下载
```

## 🚀 快速开始

### 方式一：使用现有配置

```bash
# 克隆项目
git clone https://github.com/your-org/astro-nav.git
cd astro-nav

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 方式二：从表格生成

1. **访问配置生成器**: https://nav-generator.vercel.app
2. **下载模板文件**: 菜单模板 + 网站模板
3. **填写表格数据**: 按照格式填写您的导航数据
4. **上传生成配置**: 获得 `config.json` 文件
5. **替换配置文件**: 将文件放到 `src/config/site.json`
6. **部署网站**: 推送代码自动部署

## 📁 项目结构

```
astro-nav/
├── src/
│   ├── pages/
│   │   ├── index.astro              # 导航首页
│   │   ├── config-demo.astro        # 配置演示
│   │   └── table-import.astro       # 导入工具
│   ├── components/
│   │   ├── Navigation.astro         # 导航组件
│   │   ├── CategoryCard.astro       # 分类卡片
│   │   ├── SiteCard.astro          # 网站卡片
│   │   └── Sidebar.astro           # 侧边栏
│   ├── layouts/
│   │   └── Layout.astro            # 页面布局
│   ├── config/
│   │   └── site.json               # 🎯 核心配置文件
│   ├── utils/
│   │   ├── config.ts               # 配置读取工具
│   │   └── dataConverter.ts        # 数据转换工具
│   └── types/
│       ├── config.ts               # 配置类型定义
│       └── navigation.ts           # 导航类型定义
├── public/
│   ├── templates/                  # 表格模板
│   │   ├── menu-template.csv       # 菜单模板
│   │   └── site-template.csv       # 网站模板
│   └── logos/                      # 网站Logo
├── docs/                           # 项目文档
│   ├── PROJECT_ARCHITECTURE.md     # 架构设计
│   ├── USER_GUIDE.md              # 用户指南
│   └── TABLE_FORMAT.md            # 表格格式说明
└── README.md                       # 项目说明
```

## 🎯 配置文件格式

### 基本结构

```json
{
  "site": {
    "title": "我的导航网站",
    "description": "专业的导航平台",
    "logo": {
      "text": "MyNav",
      "href": "/"
    }
  },
  "categoryMap": {
    "工具": "tools",
    "资源": "resources"
  },
  "menuItems": [
    {
      "name": "开发工具",
      "href": "#tools",
      "icon": "mdi:tools",
      "type": "single",
      "sites": [...]
    }
  ]
}
```

## 🛠️ 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run astro check

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 表格格式

#### 菜单表格 (menu-template.csv)
```csv
menuId,menuName,menuIcon,menuType,parentMenuId,sortOrder
tools,开发工具,mdi:tools,single,,1
design,设计资源,mdi:palette,tabs,,2
design-ui,UI设计,mdi:monitor,single,design,1
```

#### 网站表格 (site-template.csv)
```csv
menuId,title,description,url,advantages,pros,cons,tips
tools,VS Code,代码编辑器,https://code.visualstudio.com,免费;插件丰富,启动快;功能强,内存占用大,安装插件;定制主题
```

## 🚀 部署指南

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install and Build
        run: |
          npm install
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📚 文档

- [📋 项目架构设计](PROJECT_ARCHITECTURE.md)
- [📖 用户使用指南](USER_GUIDE.md)
- [📊 表格格式说明](src/docs/TABLE_FORMAT.md)

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Astro](https://astro.build) - 现代化的静态网站生成器
- [Iconify](https://iconify.design) - 丰富的图标库
- [XLSX](https://github.com/SheetJS/sheetjs) - Excel文件处理
- [Papa Parse](https://www.papaparse.com) - CSV解析库

## 📞 联系我们

- **项目主页**: https://github.com/your-org/astro-nav
- **演示地址**: https://astro-nav-demo.github.io
- **问题反馈**: [GitHub Issues](https://github.com/your-org/astro-nav/issues)

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！
