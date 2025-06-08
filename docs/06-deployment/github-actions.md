---
title: "Github Actions"
description: "Github Actions相关文档"
type: "docs"
category: "06-deployment"
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

# GitHub Actions 部署指南

## 🎯 部署架构设计

### **问题背景**
- 开发时没有 `public/` 文件夹
- GitHub Actions 构建时才生成 `dist/` 文件夹
- 需要在构建过程中包含配置文件
- 支持优化格式的懒加载功能

### **解决方案**
使用 `static/` 文件夹作为静态资源目录，在 GitHub Actions 中自动复制配置文件。

## 📁 文件夹结构

### **开发环境**
```
项目根目录/
├── src/data/           # 源配置文件 (您编辑的地方)
│   └── config.json
├── static/             # 静态资源 (GitHub Actions使用)
│   ├── config.json     # 自动复制
│   └── categories/     # 优化格式分类文件
├── public/             # 开发时静态资源 (可选)
│   └── config.json     # 自动复制
└── scripts/
    └── copy-config.js  # 自动复制脚本
```

### **构建后 (GitHub Actions)**
```
dist/                   # 构建输出
├── config.json         # 来自 static/
├── categories/         # 来自 static/
├── index.html
└── ...
```

## 🔧 配置更新

### **1. Astro 配置 (astro.config.mjs)**
```javascript
export default defineConfig({
    site: 'https://affnav.github.io',
    integrations: [sitemap()],
    output: 'hybrid',
    
    // 使用 static/ 作为静态资源目录
    publicDir: './static',
    
    build: {
        assets: '_astro'
    }
});
```

### **2. 复制脚本 (scripts/copy-config.js)**
- 自动复制 `src/data/` → `static/` 和 `public/`
- 支持开发和部署两种环境
- 监听文件变化自动同步

### **3. GitHub Actions (.github/workflows/deploy.yml)**
```yaml
- name: Copy config files to static directory
  run: npm run copy-config

- name: Install and Build
  uses: withastro/action@v3
```

## 🚀 工作流程

### **开发流程**
1. **编辑配置**: 只修改 `src/data/config.json`
2. **自动复制**: 运行 `npm run copy-config`
3. **开发测试**: `npm run dev` (使用 `public/` 文件)
4. **推送代码**: Git 推送到 GitHub

### **部署流程**
1. **GitHub Actions 触发**: 推送到 main 分支
2. **安装依赖**: `npm ci`
3. **复制配置**: `npm run copy-config` → `static/`
4. **构建项目**: Astro 构建 → `dist/`
5. **部署**: 部署 `dist/` 到 GitHub Pages

### **优化配置部署**
1. **生成优化配置**: 使用配置转换工具
2. **下载ZIP文件**: 包含 `config.json` + `categories/`
3. **解压到static**: 将文件放到 `static/` 目录
4. **提交推送**: Git 提交并推送
5. **自动部署**: GitHub Actions 自动构建部署

## 📋 操作指南

### **步骤1: 生成优化配置**

1. **访问转换工具**:
   ```
   http://localhost:4321/config-converter-test
   ```

2. **转换配置**:
   - 点击"🚀 开始转换"
   - 查看转换结果
   - 点击"📥 下载优化配置"

3. **解压文件**:
   ```
   optimized-config-xxx.zip
   ├── config.json          # 优化格式基础配置
   ├── categories/          # 分类数据文件夹
   │   ├── 0.json
   │   ├── 1.json
   │   └── ...
   └── CONVERSION_REPORT.md # 转换报告
   ```

### **步骤2: 部署到static目录**

1. **复制文件**:
   ```bash
   # 复制基础配置
   cp config.json static/config.json
   
   # 复制分类文件夹
   cp -r categories/ static/categories/
   ```

2. **验证结构**:
   ```
   static/
   ├── config.json          # 优化格式
   └── categories/          # 分类文件夹
       ├── 0.json
       ├── 1.json
       └── ...
   ```

### **步骤3: 提交和部署**

1. **提交更改**:
   ```bash
   git add static/
   git commit -m "feat: 部署优化配置格式"
   git push origin main
   ```

2. **监控部署**:
   - 查看 GitHub Actions 执行状态
   - 确认构建成功
   - 验证网站更新

### **步骤4: 验证部署**

1. **访问生产网站**:
   ```
   https://affnav.github.io
   ```

2. **测试懒加载**:
   - 打开浏览器开发者工具
   - 点击不同分类
   - 观察网络请求 (应该看到 categories/X.json 请求)

## 🔍 故障排除

### **常见问题**

#### 1. 配置文件404错误
```
问题: 网站访问时配置文件加载失败
检查: static/ 目录是否包含配置文件
解决: 运行 npm run copy-config 并重新部署
```

#### 2. 分类数据加载失败
```
问题: 点击分类时数据加载失败
检查: static/categories/ 目录是否存在
解决: 重新生成优化配置并部署
```

#### 3. GitHub Actions构建失败
```
问题: 构建过程中出错
检查: Actions 日志中的错误信息
解决: 确保 package.json 中有 copy-config 脚本
```

### **调试工具**

1. **本地测试**:
   ```bash
   # 模拟构建过程
   npm run copy-config
   npm run build
   npm run preview
   ```

2. **检查文件**:
   ```bash
   # 检查static目录
   ls -la static/
   ls -la static/categories/
   
   # 检查构建输出
   ls -la dist/
   ls -la dist/categories/
   ```

3. **网络调试**:
   - 浏览器开发者工具 → Network
   - 查看配置文件请求状态
   - 验证分类文件加载

## 📊 性能优化

### **CDN配置**
```javascript
// 在ConfigManager中配置CDN
const configManager = new ConfigManager('https://cdn.example.com/config.json');
```

### **缓存策略**
```
# 在服务器配置中设置缓存头
config.json: Cache-Control: max-age=3600
categories/*.json: Cache-Control: max-age=86400
```

### **预加载优化**
```javascript
// 在页面中预加载热门分类
<link rel="prefetch" href="/categories/0.json">
<link rel="prefetch" href="/categories/1.json">
```

## 📝 总结

通过 `static/` 文件夹和 GitHub Actions 的配合，我们实现了：

1. ✅ **开发友好**: 只需编辑 `src/data/config.json`
2. ✅ **部署自动化**: GitHub Actions 自动处理配置文件
3. ✅ **懒加载支持**: 优化格式支持按需加载
4. ✅ **性能优化**: 减少首次加载时间
5. ✅ **维护简单**: 自动化脚本处理文件管理

这种架构既解决了 GitHub Actions 部署的限制，又保持了懒加载功能的完整性。
