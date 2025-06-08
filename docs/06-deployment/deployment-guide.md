---
title: "Deployment Guide"
description: "Deployment Guide相关文档"
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

# 配置文件架构说明

## 📁 文件夹结构和用途

### `src/data/` 目录
- **用途**: 源配置文件存储
- **特点**: 构建时处理，服务器端可访问
- **访问方式**: `import config from '../data/config.json'`
- **适用场景**: 
  - 服务器端渲染 (SSR)
  - 构建时数据处理
  - 静态导入

### `public/` 目录  
- **用途**: 运行时配置文件存储
- **特点**: 浏览器可直接访问，支持动态加载
- **访问方式**: `fetch('/config.json')`
- **适用场景**:
  - 客户端动态加载
  - 懒加载功能
  - 按需数据获取

## 🔄 为什么需要两个位置？

### 传统SSR模式 (`src/data/`)
```javascript
// 构建时导入 - 适用于传统渲染
import config from '../data/config.json';

// 优点：构建时优化，SEO友好
// 缺点：无法动态加载，不支持懒加载
```

### 懒加载模式 (`public/`)
```javascript
// 运行时获取 - 适用于懒加载
const config = await fetch('/config.json').then(r => r.json());

// 优点：支持动态加载，按需获取
// 缺点：需要网络请求，首次加载稍慢
```

## 🏗️ 架构设计

### 开发流程
```
src/data/config.json (源文件)
        ↓ (自动复制)
public/config.json (运行时文件)
        ↓ (HTTP请求)
ConfigManager (智能加载)
```

### 自动化脚本
- **`scripts/copy-config.js`**: 自动复制配置文件
- **`npm run copy-config`**: 手动复制
- **`npm run copy-config:watch`**: 监听变化自动复制
- **`npm run dev`**: 开发时自动复制并启动

## 📋 使用指南

### 1. 开发环境设置
```bash
# 方式1: 自动复制 + 开发
npm run dev

# 方式2: 监听模式 (推荐)
npm run dev:watch

# 方式3: 手动复制
npm run copy-config
npm start
```

### 2. 配置文件管理
```
src/data/
├── config.json          # 主配置文件 (源)
├── config-test.json     # 测试配置
└── config-optimized.json # 优化格式示例

public/                   # 自动生成
├── config.json          # 主配置文件 (运行时)
├── config-test.json     # 测试配置
├── config-optimized.json # 优化格式示例
└── categories/          # 优化格式分类文件
    ├── 0.json
    ├── 1.json
    └── ...
```

### 3. ConfigManager使用
```typescript
// 自动检测路径
const manager = ConfigManager.getInstance();

// 指定路径
const manager = new ConfigManager('/config.json');

// 加载配置
const result = await manager.loadConfig();
```

## 🎯 最佳实践

### 开发阶段
1. **编辑**: 只修改 `src/data/config.json`
2. **测试**: 使用 `npm run dev:watch` 自动同步
3. **验证**: 通过ConfigManager测试页面验证

### 生产部署
1. **构建**: `npm run build` 自动复制配置
2. **部署**: 确保 `public/` 目录包含所有配置文件
3. **CDN**: 配置CDN加速 `public/categories/` 文件访问

### 优化配置部署
1. **生成**: 使用配置转换工具生成优化格式
2. **解压**: 将ZIP文件解压到 `public/` 目录
3. **结构**: 确保文件结构正确
   ```
   public/
   ├── config.json          # 优化格式基础配置
   └── categories/          # 分类数据文件
       ├── 0.json
       ├── 1.json
       └── ...
   ```

## 🔧 故障排除

### 常见问题

#### 1. 404 Not Found
```
错误: 配置文件加载失败: 404 Not Found
解决: 运行 npm run copy-config 复制配置文件
```

#### 2. 配置未更新
```
问题: 修改src/data/config.json后，页面未更新
解决: 使用 npm run dev:watch 启用自动同步
```

#### 3. 懒加载失败
```
问题: 分类数据加载失败
检查: public/categories/ 目录是否存在
解决: 使用配置转换工具重新生成优化配置
```

### 调试工具
- **ConfigManager测试页面**: `/config-manager-test`
- **配置转换工具**: `/config-converter-test`
- **浏览器开发者工具**: 检查网络请求

## 📊 性能对比

### 传统模式 (src/data/)
- ✅ 构建时优化
- ✅ SEO友好
- ❌ 无法懒加载
- ❌ 首次加载大

### 懒加载模式 (public/)
- ✅ 按需加载
- ✅ 首次加载快
- ✅ 支持缓存
- ❌ 需要网络请求

### 混合模式 (推荐)
- ✅ 基础配置SSR
- ✅ 分类数据懒加载
- ✅ 最佳性能
- ✅ 最佳用户体验

---

## 📝 总结

通过 `src/data/` → `public/` 的自动复制机制，我们实现了：

1. **开发友好**: 只需编辑源文件，自动同步
2. **懒加载支持**: public/文件支持运行时访问
3. **性能优化**: 按需加载，减少首次加载时间
4. **部署简单**: 自动化脚本处理文件复制

这种架构既保持了开发的便利性，又支持了懒加载的高级功能。
