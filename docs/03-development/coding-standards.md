# 📝 编码规范

## 🎯 概述

本文档定义了Astro-nav项目的编码规范和质量标准，与[开发流程](development-guide.md)配合使用，确保代码的一致性、可维护性和高质量。

## 🔗 与开发流程的关系

本编码规范是[开发流程](development-guide.md#功能开发流程)的技术实现细则，特别是**第4步测试验证**的具体标准。请先阅读开发流程了解整体要求，再参考本文档的技术细节。

## 🔧 核心开发原则

### 1. 功能完成必须测试原则 ⭐
**每完成一个功能都必须进行测试验证，这是强制性要求！**

#### 📋 测试要求
- **单元测试**: 每个新增的函数/方法都必须有对应的单元测试
- **集成测试**: 每个新增的组件/模块都必须有集成测试
- **功能测试**: 每个完整功能都必须创建功能测试页面
- **性能测试**: 涉及性能的功能必须进行性能基准测试

#### 🧪 测试流程
1. **开发阶段**: 边开发边写测试
2. **完成阶段**: 创建专门的测试页面验证功能
3. **提交前**: 运行所有相关测试确保通过
4. **文档更新**: 在文档中记录测试结果

#### 📊 测试覆盖率要求
- **新增代码**: 测试覆盖率必须 ≥ 90%
- **核心功能**: 测试覆盖率必须 = 100%
- **工具函数**: 测试覆盖率必须 = 100%

### 2. 代码质量原则

#### TypeScript严格模式
- 启用TypeScript严格模式
- 所有函数必须有明确的类型定义
- 禁止使用 `any` 类型，除非有充分理由

#### 错误处理
- 所有异步操作必须有错误处理
- 网络请求必须有重试机制
- 用户友好的错误提示

#### 性能考虑
- 避免不必要的重复计算
- 合理使用缓存机制
- 监控内存使用情况

## 📁 文件组织规范

### 项目目录结构 (混合式测试组织)
```
project/
├── src/                                # 源代码目录
│   ├── utils/                          # 工具函数
│   │   ├── ConfigManager.ts
│   │   ├── ConfigManager.test.ts       # 单元测试 (就近放置)
│   │   ├── lazyLoader.ts
│   │   └── lazyLoader.test.ts          # 单元测试 (就近放置)
│   ├── components/                     # Astro组件
│   │   ├── LoadingIndicator.astro
│   │   ├── LoadingIndicator.test.ts    # 组件测试 (就近放置)
│   │   └── __tests__/                  # 复杂组件测试目录
│   │       ├── LoadingIndicator.unit.test.ts
│   │       └── LoadingIndicator.visual.test.ts
│   ├── pages/                          # 页面文件
│   │   ├── index.astro
│   │   └── tests/                      # 功能测试页面 (分组)
│   │       ├── _index.md               # 测试页面索引
│   │       ├── unit/                   # 单元测试页面
│   │       ├── integration/            # 集成测试页面
│   │       ├── performance/            # 性能测试页面
│   │       └── e2e/                    # 端到端测试页面
│   ├── types/                          # 类型定义
│   │   ├── config.ts
│   │   └── config.test.ts              # 类型测试 (就近放置)
│   ├── scripts/                        # 客户端脚本
│   └── styles/                         # 样式文件
├── tests/                              # 项目级测试 (分离)
│   ├── integration/                    # 集成测试
│   ├── e2e/                           # 端到端测试
│   ├── performance/                    # 性能测试
│   ├── fixtures/                       # 测试数据
│   └── helpers/                        # 测试工具
└── __mocks__/                          # 全局模拟 (分离)
```

### 测试文件组织原则

#### 🎯 混合式组织策略
- **单元测试**: 与源码就近放置 (`*.test.ts`)
- **功能测试页面**: 按类型分组 (`src/pages/tests/`)
- **集成/E2E/性能测试**: 项目级分离 (`tests/`)
- **测试工具和数据**: 统一管理 (`tests/helpers/`, `tests/fixtures/`)

#### 📋 目录职责划分

| 目录 | 职责 | 测试类型 | 示例文件 |
|------|------|----------|----------|
| `src/*/` | 单元测试 | 函数、类、组件 | `ConfigManager.test.ts` |
| `src/pages/tests/` | 功能测试页面 | 用户可见功能 | `test-configmanager.astro` |
| `tests/integration/` | 集成测试 | 模块协作 | `config-loading.test.ts` |
| `tests/e2e/` | 端到端测试 | 完整流程 | `user-workflow.e2e.test.ts` |
| `tests/performance/` | 性能测试 | 性能基准 | `loading-benchmark.test.ts` |

### 命名规范

#### 源码文件
- **文件名**: kebab-case (`lazy-loader.ts`)
- **组件名**: PascalCase (`LazyLoader.astro`)
- **函数名**: camelCase (`loadCategoryData`)
- **类名**: PascalCase (`ConfigManager`)
- **常量**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **接口**: PascalCase (`CategoryLoadResult`)

#### 测试文件
- **单元测试**: `SourceFile.test.ts` (就近放置)
- **集成测试**: `feature-name.integration.test.ts`
- **E2E测试**: `workflow-name.e2e.test.ts`
- **性能测试**: `feature-name.performance.test.ts`
- **功能测试页面**: `test-feature-name.astro`

## 🧪 测试规范

### 测试文件组织详细规范

#### 功能测试页面结构
```
src/pages/tests/
├── _index.md                          # 测试页面索引和说明
├── unit/                              # 单元测试页面
│   ├── test-configmanager.astro
│   └── test-lazyloader.astro
├── integration/                       # 集成测试页面
│   ├── test-config-loading-flow.astro
│   └── test-lazy-loading-integration.astro
├── performance/                       # 性能测试页面
│   ├── test-loading-benchmark.astro
│   └── test-memory-usage.astro
└── e2e/                              # 端到端测试页面
    └── test-complete-workflow.astro
```

#### 项目级测试结构
```
tests/
├── integration/                       # 集成测试
│   ├── config-loading-flow.test.ts
│   └── lazy-loading-integration.test.ts
├── e2e/                              # 端到端测试
│   ├── user-navigation.e2e.test.ts
│   └── performance.e2e.test.ts
├── performance/                       # 性能测试
│   ├── loading-benchmark.test.ts
│   └── memory-usage.test.ts
├── fixtures/                         # 测试数据
│   ├── mock-config.json
│   └── sample-categories/
└── helpers/                          # 测试工具
    ├── test-utils.ts
    └── mock-factory.ts
```

### 测试页面规范
每个主要功能完成后，必须创建对应的测试页面：

```typescript
// 测试页面模板
---
// 1. 导入要测试的功能
import { functionToTest } from '../utils/module';

// 2. 定义测试用例
interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  details: any;
  error?: string;
}

// 3. 执行测试
async function runTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // 测试用例1
  const startTime = performance.now();
  try {
    const result = await functionToTest();
    results.push({
      name: '功能测试1',
      success: true,
      duration: performance.now() - startTime,
      details: result
    });
  } catch (error) {
    results.push({
      name: '功能测试1',
      success: false,
      duration: performance.now() - startTime,
      details: {},
      error: error.message
    });
  }
  
  return results;
}

const testResults = await runTests();
---

<!-- 4. 渲染测试结果 -->
<html>
  <!-- 测试结果展示UI -->
</html>
```

### 测试文档要求
每个测试页面必须包含：
- 测试目的说明
- 测试用例列表
- 成功/失败标准
- 性能基准数据
- 错误处理验证

## 📊 代码审查规范

### 提交前检查清单
- [ ] 代码符合TypeScript严格模式
- [ ] 所有新增功能都有对应测试
- [ ] 测试覆盖率达到要求 (≥90%)
- [ ] 功能测试页面已创建并通过
- [ ] 性能测试通过 (如适用)
- [ ] 错误处理完善
- [ ] 代码注释清晰
- [ ] 文档已更新
- [ ] **项目进度已更新** 🚨

### 代码审查要点
1. **功能正确性**: 功能是否按预期工作
2. **测试完整性**: 测试是否覆盖所有场景
3. **性能影响**: 是否影响系统性能
4. **错误处理**: 异常情况是否处理得当
5. **代码可读性**: 代码是否易于理解和维护

## 🔍 质量保证工具

### 静态分析
- **ESLint**: 代码风格检查
- **TypeScript**: 类型检查
- **Prettier**: 代码格式化

### 测试工具
- **Vitest**: 单元测试框架
- **Playwright**: 端到端测试
- **自定义测试页面**: 功能验证

### 性能监控
- **Performance API**: 性能测量
- **Memory Usage**: 内存监控
- **Network Timing**: 网络性能

## 📝 文档规范

### 代码注释
```typescript
/**
 * 加载分类数据 (Week 3 新增)
 * 
 * @param categoryIndex 分类索引
 * @returns Promise<CategoryLoadResult> 加载结果
 * 
 * @example
 * ```typescript
 * const result = await loadCategoryData(0);
 * if (result.success) {
 *   console.log('加载成功:', result.data);
 * }
 * ```
 */
async function loadCategoryData(categoryIndex: number): Promise<CategoryLoadResult> {
  // 实现代码...
}
```

### 功能文档
每个新功能必须更新相关文档：
- 功能说明文档
- API文档
- 使用示例
- 测试报告

## 🔍 质量保证工具

### 开发工具脚本
```json
// package.json scripts
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest src/",
    "test:integration": "vitest tests/integration/",
    "test:e2e": "vitest tests/e2e/",
    "test:performance": "vitest tests/performance/",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src/"
  }
}
```

### 测试配置文件
```typescript
// vitest.config.ts
export default {
  test: {
    include: [
      'src/**/*.test.ts',           // 单元测试 (就近放置)
      'tests/**/*.test.ts',         // 集成/E2E/性能测试
    ],
    exclude: [
      'src/pages/tests/**',         // 排除功能测试页面
      'node_modules/**',
      'dist/**'
    ],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/pages/tests/**',
        'src/**/*.d.ts'
      ],
      threshold: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
}
```

### ESLint配置
```json
// .eslintrc.json
{
  "overrides": [
    {
      "files": ["**/*.test.ts", "tests/**/*.ts"],
      "rules": {
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    {
      "files": ["src/pages/tests/**/*.astro"],
      "rules": {
        "no-console": "off"
      }
    }
  ]
}
```

## 🚨 强制性要求

### ⚠️ 禁止行为
- **禁止**: 未经测试就提交代码
- **禁止**: 跳过错误处理
- **禁止**: 使用未定义类型的变量
- **禁止**: 提交包含console.log的生产代码

### ✅ 必须行为
- **必须**: 每个功能都要有测试页面
- **必须**: 所有异步操作都要有错误处理
- **必须**: 性能敏感的功能要有性能测试
- **必须**: 更新相关文档
- **必须**: 每完成任务都要更新项目进度 📊

## 📈 持续改进

### 代码质量指标
- 测试覆盖率 ≥ 90%
- 代码重复率 ≤ 5%
- 圈复杂度 ≤ 10
- 技术债务 ≤ 1小时/1000行代码

### 定期审查
- 每周代码质量审查
- 每月技术债务清理
- 每季度规范更新

---

**规范版本**: v1.0  
**制定日期**: 2024-12-07  
**适用范围**: Astro-nav项目所有开发工作  
**维护者**: Augment Agent  
**状态**: 正式生效

## 🎯 重要提醒

**🔥 核心要求: 每完成一个功能都必须进行测试和进度更新！**

这不是建议，而是强制性要求：
1. 任何未经测试的功能都不应该被认为是"完成"的
2. 任何未更新项目进度的任务都不应该被认为是"完成"的
