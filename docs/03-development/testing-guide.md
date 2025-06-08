---
title: "Testing Guide"
description: "Testing Guide相关文档"
type: "docs"
category: "03-development"
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

# 🧪 测试指南

## 🎯 概述

本文档提供Astro-nav项目的详细测试指南，包括测试文件组织、测试方法和最佳实践。配合[开发流程](development-guide.md)和[编码规范](coding-standards.md)使用。

## 📁 测试文件组织 (混合式策略)

### 🎯 组织原则
- **单元测试**: 与源码就近放置，便于维护
- **功能测试页面**: 按类型分组，便于管理
- **集成/E2E/性能测试**: 项目级分离，便于CI/CD
- **测试工具和数据**: 统一管理，便于复用

### 📂 目录结构详解

#### 源码目录中的测试
```
src/
├── utils/
│   ├── ConfigManager.ts
│   ├── ConfigManager.test.ts           # ✅ 单元测试就近放置
│   ├── lazyLoader.ts
│   └── lazyLoader.test.ts              # ✅ 单元测试就近放置
├── components/
│   ├── LoadingIndicator.astro
│   ├── LoadingIndicator.test.ts        # ✅ 组件测试就近放置
│   └── __tests__/                      # 复杂组件的多个测试文件
│       ├── LoadingIndicator.unit.test.ts
│       ├── LoadingIndicator.visual.test.ts
│       └── LoadingIndicator.accessibility.test.ts
└── types/
    ├── config.ts
    └── config.test.ts                  # ✅ 类型测试就近放置
```

#### 功能测试页面目录
```
src/pages/tests/
├── _index.md                           # 📋 测试页面索引和说明
├── unit/                               # 单元测试页面
│   ├── test-configmanager-enhanced.astro
│   ├── test-lazyloader-basic.astro
│   └── test-loading-indicator.astro
├── integration/                        # 集成测试页面
│   ├── test-config-loading-flow.astro
│   ├── test-lazy-loading-integration.astro
│   └── test-component-interaction.astro
├── performance/                        # 性能测试页面
│   ├── test-loading-benchmark.astro
│   ├── test-memory-usage.astro
│   └── test-network-performance.astro
└── e2e/                               # 端到端测试页面
    ├── test-complete-user-workflow.astro
    └── test-error-recovery.astro
```

#### 项目级测试目录
```
tests/
├── integration/                        # 集成测试
│   ├── config-loading-flow.test.ts
│   ├── lazy-loading-integration.test.ts
│   └── component-interaction.test.ts
├── e2e/                               # 端到端测试
│   ├── user-navigation.e2e.test.ts
│   ├── error-handling.e2e.test.ts
│   └── performance.e2e.test.ts
├── performance/                        # 性能测试
│   ├── loading-benchmark.test.ts
│   ├── memory-usage.test.ts
│   └── network-performance.test.ts
├── fixtures/                          # 测试数据
│   ├── mock-config.json
│   ├── sample-categories/
│   │   ├── category-0.json
│   │   └── category-1.json
│   └── test-data/
│       ├── valid-configs/
│       └── invalid-configs/
├── helpers/                           # 测试工具
│   ├── test-utils.ts
│   ├── mock-factory.ts
│   ├── performance-helpers.ts
│   └── assertion-helpers.ts
└── setup/                             # 测试设置
    ├── global-setup.ts
    └── test-environment.ts
```

## 🧪 测试类型和方法

### 1. 单元测试 (就近放置)

#### 基本单元测试
```typescript
// src/utils/ConfigManager.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigManager } from './ConfigManager';

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  
  beforeEach(() => {
    configManager = new ConfigManager();
    // 重置模拟
    vi.clearAllMocks();
  });
  
  describe('loadOptimizedConfig', () => {
    it('应该成功加载优化配置', async () => {
      // 模拟fetch响应
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          optimization: { totalCategories: 21 }
        })
      });
      
      const result = await configManager.loadOptimizedConfig();
      
      expect(result.success).toBe(true);
      expect(result.isOptimized).toBe(true);
    });
    
    it('应该处理网络错误', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await configManager.loadOptimizedConfig();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });
});
```

#### 组件测试
```typescript
// src/components/LoadingIndicator.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/dom';
import LoadingIndicator from './LoadingIndicator.astro';

describe('LoadingIndicator', () => {
  it('应该渲染加载指示器', () => {
    const { container } = render(LoadingIndicator, {
      props: { isLoading: true }
    });
    
    expect(container.querySelector('.loading-indicator')).toBeTruthy();
  });
  
  it('应该在不加载时隐藏', () => {
    const { container } = render(LoadingIndicator, {
      props: { isLoading: false }
    });
    
    expect(container.querySelector('.loading-indicator')).toBeFalsy();
  });
});
```

### 2. 功能测试页面

#### 测试页面模板
```typescript
// src/pages/tests/unit/test-configmanager-enhanced.astro
---
import { 
  loadOptimizedConfig, 
  loadCategoryData, 
  getCategoryInfo, 
  getAllCategoryIndexes 
} from '../../../utils/ConfigManager';

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  details: any;
  error?: string;
}

async function runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
  const startTime = performance.now();
  try {
    const result = await testFn();
    return {
      name,
      success: true,
      duration: performance.now() - startTime,
      details: result
    };
  } catch (error) {
    return {
      name,
      success: false,
      duration: performance.now() - startTime,
      details: {},
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

// 执行测试
const testResults: TestResult[] = [
  await runTest('加载优化配置', () => loadOptimizedConfig()),
  await runTest('获取所有分类索引', () => Promise.resolve(getAllCategoryIndexes())),
  await runTest('获取分类信息', () => {
    const indexes = getAllCategoryIndexes();
    return Promise.resolve(getCategoryInfo(indexes[0] || 0));
  }),
  await runTest('加载分类数据', async () => {
    const indexes = getAllCategoryIndexes();
    return await loadCategoryData(indexes[0] || 0);
  })
];

const successCount = testResults.filter(r => r.success).length;
const totalTests = testResults.length;
const successRate = (successCount / totalTests * 100).toFixed(1);
---

<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ConfigManager增强功能测试</title>
  <style>
    /* 测试页面样式 */
    body { font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .test-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .test-case { background: white; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 15px; }
    .test-case.success { border-left: 4px solid #28a745; }
    .test-case.error { border-left: 4px solid #dc3545; }
    .test-header { padding: 15px; border-bottom: 1px solid #dee2e6; }
    .test-content { padding: 15px; }
    .test-details { background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px; }
    .error-message { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-top: 10px; }
    pre { margin: 0; font-size: 14px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="test-summary">
    <h1>🧪 ConfigManager增强功能测试</h1>
    <p><strong>测试时间:</strong> {new Date().toLocaleString()}</p>
    <p><strong>成功率:</strong> {successRate}% ({successCount}/{totalTests})</p>
  </div>

  {testResults.map((result, index) => (
    <div class={`test-case ${result.success ? 'success' : 'error'}`}>
      <div class="test-header">
        <h3>{result.success ? '✅' : '❌'} 测试 {index + 1}: {result.name}</h3>
        <small>执行时间: {result.duration.toFixed(2)}ms</small>
      </div>
      <div class="test-content">
        <div class="test-details">
          <strong>测试详情:</strong>
          <pre>{JSON.stringify(result.details, null, 2)}</pre>
        </div>
        {result.error && (
          <div class="error-message">
            <strong>错误信息:</strong> {result.error}
          </div>
        )}
      </div>
    </div>
  ))}

  <div style="text-align: center; margin-top: 30px;">
    <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
      🔄 重新测试
    </button>
  </div>
</body>
</html>
```

### 3. 集成测试

#### 集成测试示例
```typescript
// tests/integration/config-loading-flow.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ConfigManager } from '../../src/utils/ConfigManager';
import { LazyLoader } from '../../src/utils/lazyLoader';

describe('配置加载流程集成测试', () => {
  let configManager: ConfigManager;
  let lazyLoader: LazyLoader;
  
  beforeEach(() => {
    configManager = new ConfigManager();
    lazyLoader = new LazyLoader(configManager);
  });
  
  it('应该完成完整的配置加载和分类数据获取流程', async () => {
    // 1. 加载配置
    const configResult = await configManager.loadOptimizedConfig();
    expect(configResult.success).toBe(true);
    
    // 2. 获取分类索引
    const indexes = configManager.getAllCategoryIndexes();
    expect(indexes.length).toBeGreaterThan(0);
    
    // 3. 加载分类数据
    const categoryResult = await lazyLoader.loadCategory(indexes[0]);
    expect(categoryResult.success).toBe(true);
    
    // 4. 验证数据一致性
    const categoryInfo = configManager.getCategoryInfo(indexes[0]);
    expect(categoryInfo).toBeTruthy();
    expect(categoryResult.data?.categoryName).toBe(categoryInfo?.name);
  });
});
```

## 📊 测试最佳实践

### 测试命名规范
- **描述性**: 测试名称应该清楚描述测试内容
- **结构化**: 使用 "应该...当...时" 的格式
- **具体化**: 避免模糊的描述

### 测试组织
- **分组**: 使用 `describe` 对相关测试进行分组
- **设置**: 使用 `beforeEach` 进行测试前设置
- **清理**: 使用 `afterEach` 进行测试后清理

### 断言策略
- **明确**: 每个测试应该有明确的断言
- **完整**: 验证所有重要的输出
- **错误**: 测试错误情况和边界条件

## 🚀 测试执行

### 运行测试命令
```bash
# 运行所有测试
npm run test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行性能测试
npm run test:performance

# 生成覆盖率报告
npm run test:coverage
```

### CI/CD集成
测试应该在以下情况下自动运行：
- 每次代码提交
- Pull Request创建和更新
- 主分支合并前
- 发布版本前

### 任务完成流程
每个任务完成后必须执行：
1. **运行所有相关测试** - 确保功能正常
2. **验证测试覆盖率** - 达到90%以上
3. **记录测试结果** - 在测试页面中展示
4. **更新项目进度** - 更新所有相关文档 🚨

---

**文档版本**: v1.0  
**创建日期**: 2024-12-07  
**适用范围**: Astro-nav项目所有测试工作  
**维护者**: Augment Agent  
**状态**: 正式生效
