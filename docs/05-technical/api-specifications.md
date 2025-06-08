# Week 3 前端集成技术规范

## 📅 规范版本: v1.0 (2024-12-07)

## 🎯 技术架构概览

基于Week 2成功验证的懒加载后端功能，设计前端集成的技术规范，确保高性能、高可用性和良好的用户体验。

## 🏗️ 核心组件规范

### 1. ConfigManager 增强规范

#### 1.1 类定义
```typescript
interface ConfigManager {
  // 现有方法
  detectConfigFormat(config: any): FormatDetectionResult
  
  // 新增方法
  loadOptimizedConfig(): Promise<OptimizedConfig>
  loadCategoryData(categoryId: number): Promise<CategoryData>
  isOptimizedFormat(config: any): boolean
  getConfigStats(): ConfigStats
}

interface FormatDetectionResult {
  format: 'optimized' | 'traditional'
  confidence: number // 0-1
  details: DetectionDetail[]
  optimizationInfo?: OptimizationInfo
}

interface DetectionDetail {
  check: string
  passed: boolean
  weight: number
  description: string
}

interface OptimizationInfo {
  version: string
  totalCategories: number
  totalSites: number
  compressionRatio: number
  generatedAt: string
}
```

#### 1.2 格式检测算法
```typescript
// 检测权重分配
const DETECTION_WEIGHTS = {
  OPTIMIZATION_FIELD: 0.4,    // optimization字段存在且enabled=true
  CATEGORY_INDEX: 0.4,        // menuItems包含categoryIndex字段
  PREVIEW_SITES: 0.2          // 包含previewSites字段 (可选)
}

// 置信度阈值
const CONFIDENCE_THRESHOLD = 0.8  // 80%以上认为是优化格式
```

#### 1.3 错误处理规范
```typescript
interface ConfigError extends Error {
  code: 'NETWORK_ERROR' | 'PARSE_ERROR' | 'FORMAT_ERROR' | 'TIMEOUT_ERROR'
  retryable: boolean
  fallbackStrategy: 'traditional' | 'cache' | 'offline'
}

// 重试策略
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: [1000, 2000, 4000], // 指数退避
  timeoutMs: 10000
}
```

### 2. LazyLoader 组件规范

#### 2.1 类定义
```typescript
class LazyLoader {
  private cache: Map<number, CategoryData>
  private loadingStates: Map<number, Promise<CategoryData>>
  private config: LazyLoaderConfig
  
  constructor(config: LazyLoaderConfig)
  
  // 核心方法
  async loadCategory(categoryId: number): Promise<CategoryData>
  async preloadCategories(categoryIds: number[]): Promise<void>
  getCachedCategory(categoryId: number): CategoryData | null
  clearCache(): void
  
  // 统计方法
  getCacheStats(): CacheStats
  getLoadingStats(): LoadingStats
}

interface LazyLoaderConfig {
  maxCacheSize: number        // 默认: 10
  preloadStrategy: 'eager' | 'lazy' | 'smart'
  cacheStrategy: 'lru' | 'lfu' | 'ttl'
  enableLocalStorage: boolean // 默认: true
  localStoragePrefix: string  // 默认: 'nav_cache_'
  localStorageMaxAge: number  // 默认: 7天
}
```

#### 2.2 缓存策略规范
```typescript
// 内存缓存 (LRU策略)
interface MemoryCache {
  maxSize: number           // 最大缓存项数: 10
  evictionPolicy: 'lru'     // 淘汰策略: 最近最少使用
  ttl: number              // 生存时间: 30分钟
}

// 本地存储缓存
interface LocalStorageCache {
  prefix: string           // 键前缀: 'nav_cache_'
  maxAge: number          // 最大存储时间: 7天
  maxSize: number         // 最大存储大小: 5MB
  compression: boolean    // 是否压缩: true
}

// 缓存键格式
const CACHE_KEY_FORMAT = 'nav_cache_category_{categoryId}_{version}'
```

#### 2.3 预加载策略规范
```typescript
interface PreloadStrategy {
  // 热门分类 (固定预加载)
  popularCategories: number[]     // [0, 1, 2] 前3个分类
  
  // 智能预加载
  adjacentCategories: boolean     // 预加载相邻分类
  userHistoryBased: boolean       // 基于用户历史
  hoverPreload: boolean          // 鼠标悬停预加载
  
  // 预加载时机
  timing: {
    onPageLoad: boolean          // 页面加载时
    onIdle: boolean             // 浏览器空闲时
    onHover: boolean            // 鼠标悬停时
    delayMs: number             // 延迟时间: 500ms
  }
}
```

### 3. 加载状态组件规范

#### 3.1 LoadingIndicator 组件
```astro
---
interface Props {
  isLoading: boolean
  message?: string
  progress?: number        // 0-100
  size?: 'small' | 'medium' | 'large'
  variant?: 'spinner' | 'progress' | 'skeleton'
}

const {
  isLoading = false,
  message = '正在加载...',
  progress,
  size = 'medium',
  variant = 'spinner'
} = Astro.props
---

<div class={`loading-indicator ${size} ${variant}`} class:list={{ hidden: !isLoading }}>
  {variant === 'spinner' && <div class="spinner"></div>}
  {variant === 'progress' && <div class="progress-bar" style={`width: ${progress}%`}></div>}
  {variant === 'skeleton' && <div class="skeleton-loader"></div>}
  {message && <span class="loading-message">{message}</span>}
</div>
```

#### 3.2 样式规范
```css
/* 加载指示器样式 */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease;
}

.loading-indicator.hidden {
  opacity: 0;
  pointer-events: none;
}

/* 旋转加载器 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 进度条 */
.progress-bar {
  height: 4px;
  background: #007bff;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 骨架屏 */
.skeleton-loader {
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton 1.5s infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 📊 性能规范

### 4.1 性能指标要求

#### 关键性能指标 (KPI)
```typescript
interface PerformanceTargets {
  // 加载时间指标
  firstContentfulPaint: number    // <500ms
  categoryLoadTime: number        // <100ms
  cacheHitTime: number           // <10ms
  
  // 用户体验指标
  timeToInteractive: number       // <1000ms
  cumulativeLayoutShift: number   // <0.1
  
  // 缓存效率指标
  cacheHitRate: number           // >80%
  memoryUsage: number            // <50MB
  
  // 网络指标
  totalRequests: number          // 最小化
  dataTransfer: number           // <100KB初始加载
}
```

#### 性能监控实现
```typescript
class PerformanceMonitor {
  private metrics: Map<string, number[]>
  private startTimes: Map<string, number>
  
  startTimer(label: string): void
  endTimer(label: string): number
  recordMetric(name: string, value: number): void
  getStats(): PerformanceStats
  exportReport(): PerformanceReport
}

interface PerformanceStats {
  averageLoadTime: number
  p95LoadTime: number
  cacheHitRate: number
  totalRequests: number
  errorRate: number
  userSatisfactionScore: number
}
```

### 4.2 内存管理规范

#### 内存使用限制
```typescript
const MEMORY_LIMITS = {
  maxCacheSize: 10 * 1024 * 1024,      // 10MB
  maxCacheItems: 50,                    // 50个分类
  gcThreshold: 0.8,                     // 80%时触发清理
  gcStrategy: 'lru'                     // 清理策略
}

// 内存监控
interface MemoryMonitor {
  getCurrentUsage(): number
  getMaxUsage(): number
  triggerGC(): void
  isMemoryPressure(): boolean
}
```

## 🔒 数据安全规范

### 5.1 数据验证
```typescript
// 配置数据验证
interface ConfigValidator {
  validateOptimizedConfig(config: any): ValidationResult
  validateCategoryData(data: any): ValidationResult
  sanitizeUserInput(input: string): string
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// 数据结构验证规则
const CONFIG_SCHEMA = {
  site: { required: true, type: 'object' },
  menuItems: { required: true, type: 'array', minLength: 1 },
  optimization: { required: true, type: 'object' }
}

const CATEGORY_SCHEMA = {
  categoryId: { required: true, type: 'number', min: 0 },
  categoryName: { required: true, type: 'string', minLength: 1 },
  sites: { required: true, type: 'array' }
}
```

### 5.2 错误处理规范
```typescript
// 错误分类
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

// 错误处理策略
interface ErrorHandlingStrategy {
  [ErrorType.NETWORK_ERROR]: 'retry' | 'fallback' | 'cache'
  [ErrorType.PARSE_ERROR]: 'fallback' | 'traditional'
  [ErrorType.VALIDATION_ERROR]: 'sanitize' | 'reject'
  [ErrorType.CACHE_ERROR]: 'clear' | 'ignore'
  [ErrorType.TIMEOUT_ERROR]: 'retry' | 'fallback'
}
```

## 🧪 测试规范

### 6.1 单元测试要求
```typescript
// 测试覆盖率要求
const TEST_COVERAGE_REQUIREMENTS = {
  statements: 90,    // 语句覆盖率 >90%
  branches: 85,      // 分支覆盖率 >85%
  functions: 95,     // 函数覆盖率 >95%
  lines: 90         // 行覆盖率 >90%
}

// 关键测试场景
const CRITICAL_TEST_SCENARIOS = [
  'optimized_config_detection',
  'category_lazy_loading',
  'cache_hit_miss_scenarios',
  'error_handling_fallback',
  'performance_under_load'
]
```

### 6.2 集成测试规范
```typescript
// 端到端测试场景
interface E2ETestScenario {
  name: string
  description: string
  steps: TestStep[]
  expectedResult: ExpectedResult
  performanceThreshold: PerformanceThreshold
}

// 性能基准测试
interface PerformanceBenchmark {
  scenario: string
  iterations: number
  acceptableRange: [number, number]  // [min, max] ms
  memoryLimit: number               // MB
}
```

## 📱 兼容性规范

### 7.1 浏览器支持
```typescript
// 最低支持版本
const BROWSER_SUPPORT = {
  chrome: 80,      // Chrome 80+
  firefox: 75,     // Firefox 75+
  safari: 13,      // Safari 13+
  edge: 80,        // Edge 80+
  mobile: {
    ios: 13,       // iOS Safari 13+
    android: 80    // Chrome Mobile 80+
  }
}

// 功能检测
const FEATURE_DETECTION = {
  fetch: 'required',
  localStorage: 'required',
  Promise: 'required',
  Map: 'required',
  WeakMap: 'optional'
}
```

### 7.2 降级策略
```typescript
// 功能降级矩阵
interface FallbackMatrix {
  optimizedFormat: 'traditional_format'
  lazyLoading: 'eager_loading'
  memoryCache: 'no_cache'
  localStorage: 'session_only'
  preloading: 'on_demand_only'
}
```

## 🚀 部署规范

### 8.1 构建配置
```typescript
// 构建优化配置
const BUILD_CONFIG = {
  minification: true,
  compression: 'gzip',
  bundleSplitting: true,
  treeShaking: true,
  sourceMap: 'production' ? false : true
}

// 资源优化
const ASSET_OPTIMIZATION = {
  images: 'webp_with_fallback',
  fonts: 'woff2_preload',
  css: 'critical_inline',
  js: 'defer_non_critical'
}
```

### 8.2 监控配置
```typescript
// 生产环境监控
interface ProductionMonitoring {
  errorTracking: boolean      // 错误追踪
  performanceMonitoring: boolean  // 性能监控
  userAnalytics: boolean      // 用户行为分析
  realUserMonitoring: boolean // 真实用户监控
}

// 告警阈值
const ALERT_THRESHOLDS = {
  errorRate: 0.01,           // 错误率 >1%
  loadTime: 1000,            // 加载时间 >1s
  cacheHitRate: 0.7,         // 缓存命中率 <70%
  memoryUsage: 100 * 1024 * 1024  // 内存使用 >100MB
}
```

---

**规范版本**: v1.0
**制定日期**: 2024-12-07
**审核状态**: 待实施
**维护者**: Augment Agent
