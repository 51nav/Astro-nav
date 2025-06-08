/**
 * 测试工具函数
 * Week 3 - 测试辅助工具
 */

import type { CategoryData, ConfigLoadResult } from '../../src/types/lazyLoading';

/**
 * 创建模拟的分类数据
 */
export function createMockCategoryData(categoryIndex: number, siteCount: number = 5): CategoryData {
  const sites = Array.from({ length: siteCount }, (_, i) => ({
    title: `测试网站 ${categoryIndex}-${i + 1}`,
    description: `这是分类 ${categoryIndex} 中的第 ${i + 1} 个测试网站`,
    url: `https://example-${categoryIndex}-${i + 1}.com`,
    advantages: [`优势${i + 1}`, `特点${i + 1}`],
    details: {
      pricing: i % 2 === 0 ? '免费' : '付费',
      pros: [`优点${i + 1}A`, `优点${i + 1}B`],
      cons: [`缺点${i + 1}A`]
    }
  }));

  return {
    categoryIndex,
    categoryName: `测试分类 ${categoryIndex}`,
    sites,
    metadata: {
      siteCount,
      fileSizeKB: Math.round(JSON.stringify(sites).length / 1024 * 100) / 100
    }
  };
}

/**
 * 创建模拟的配置加载结果
 */
export function createMockConfigLoadResult(isOptimized: boolean = true): ConfigLoadResult {
  const mockConfig = {
    menuItems: [
      {
        name: '测试分类1',
        categoryIndex: 0,
        siteCount: 5,
        previewSites: [
          { title: '预览网站1', description: '预览描述1' },
          { title: '预览网站2', description: '预览描述2' }
        ]
      },
      {
        name: '测试分类2',
        categoryIndex: 1,
        siteCount: 3,
        previewSites: [
          { title: '预览网站3', description: '预览描述3' }
        ]
      }
    ],
    optimization: isOptimized ? {
      totalCategories: 2,
      totalSites: 8,
      compressionRatio: 0.95,
      splitFiles: true
    } : undefined
  };

  return {
    success: true,
    config: mockConfig,
    isOptimized,
    loadTime: Math.random() * 100 + 50 // 50-150ms
  };
}

/**
 * 等待指定时间
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 创建性能测试计时器
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private endTime: number = 0;
  private marks: Map<string, number> = new Map();

  start(): void {
    this.startTime = performance.now();
  }

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  end(): number {
    this.endTime = performance.now();
    return this.getDuration();
  }

  getDuration(): number {
    return this.endTime - this.startTime;
  }

  getMarkDuration(markName: string): number {
    const markTime = this.marks.get(markName);
    if (!markTime) {
      throw new Error(`Mark '${markName}' not found`);
    }
    return markTime - this.startTime;
  }

  getMarkInterval(startMark: string, endMark: string): number {
    const startTime = this.marks.get(startMark);
    const endTime = this.marks.get(endMark);
    
    if (!startTime || !endTime) {
      throw new Error(`Mark '${startMark}' or '${endMark}' not found`);
    }
    
    return endTime - startTime;
  }

  getAllMarks(): Record<string, number> {
    const result: Record<string, number> = {};
    this.marks.forEach((time, name) => {
      result[name] = time - this.startTime;
    });
    return result;
  }

  reset(): void {
    this.startTime = 0;
    this.endTime = 0;
    this.marks.clear();
  }
}

/**
 * 批量性能测试工具
 */
export class BatchPerformanceTester {
  private results: Array<{
    name: string;
    duration: number;
    success: boolean;
    error?: string;
  }> = [];

  async runTest<T>(
    name: string, 
    testFn: () => Promise<T>,
    expectedMaxDuration?: number
  ): Promise<T> {
    const timer = new PerformanceTimer();
    timer.start();
    
    try {
      const result = await testFn();
      const duration = timer.end();
      
      const success = expectedMaxDuration ? duration <= expectedMaxDuration : true;
      
      this.results.push({
        name,
        duration,
        success
      });
      
      if (!success && expectedMaxDuration) {
        console.warn(`⚠️ 性能测试 '${name}' 超时: ${duration.toFixed(2)}ms > ${expectedMaxDuration}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = timer.end();
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      this.results.push({
        name,
        duration,
        success: false,
        error: errorMessage
      });
      
      throw error;
    }
  }

  getResults() {
    return [...this.results];
  }

  getSummary() {
    const total = this.results.length;
    const successful = this.results.filter(r => r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = total > 0 ? totalDuration / total : 0;
    
    return {
      total,
      successful,
      failed: total - successful,
      successRate: total > 0 ? (successful / total * 100) : 0,
      totalDuration,
      avgDuration,
      results: this.results
    };
  }

  reset(): void {
    this.results = [];
  }
}

/**
 * 内存使用监控工具
 */
export class MemoryMonitor {
  private initialMemory: number = 0;
  private snapshots: Array<{
    name: string;
    memory: number;
    timestamp: number;
  }> = [];

  start(): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      this.initialMemory = (performance as any).memory.usedJSHeapSize;
    }
    this.takeSnapshot('initial');
  }

  takeSnapshot(name: string): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory.usedJSHeapSize;
      this.snapshots.push({
        name,
        memory,
        timestamp: Date.now()
      });
    }
  }

  getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize - this.initialMemory;
    }
    return 0;
  }

  getSnapshots() {
    return this.snapshots.map(snapshot => ({
      ...snapshot,
      memoryDiff: snapshot.memory - this.initialMemory,
      memoryMB: Math.round(snapshot.memory / 1024 / 1024 * 100) / 100
    }));
  }

  reset(): void {
    this.initialMemory = 0;
    this.snapshots = [];
  }
}

/**
 * 测试数据验证工具
 */
export class TestDataValidator {
  static validateCategoryData(data: any): data is CategoryData {
    return (
      typeof data === 'object' &&
      typeof data.categoryIndex === 'number' &&
      typeof data.categoryName === 'string' &&
      Array.isArray(data.sites) &&
      typeof data.metadata === 'object' &&
      typeof data.metadata.siteCount === 'number'
    );
  }

  static validateConfigLoadResult(result: any): result is ConfigLoadResult {
    return (
      typeof result === 'object' &&
      typeof result.success === 'boolean' &&
      typeof result.isOptimized === 'boolean' &&
      typeof result.loadTime === 'number'
    );
  }

  static validateSiteData(site: any): boolean {
    return (
      typeof site === 'object' &&
      typeof site.title === 'string' &&
      typeof site.description === 'string'
    );
  }
}

/**
 * 随机测试数据生成器
 */
export class RandomDataGenerator {
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomString(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static randomArray<T>(generator: () => T, minLength: number = 1, maxLength: number = 10): T[] {
    const length = this.randomInt(minLength, maxLength);
    return Array.from({ length }, generator);
  }

  static randomCategoryIndexes(count: number, max: number = 20): number[] {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      indexes.add(this.randomInt(0, max));
    }
    return Array.from(indexes).sort((a, b) => a - b);
  }
}

/**
 * 测试环境检查工具
 */
export class TestEnvironment {
  static isNode(): boolean {
    return typeof process !== 'undefined' && process.versions && process.versions.node;
  }

  static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static hasPerformanceAPI(): boolean {
    return typeof performance !== 'undefined';
  }

  static hasMemoryAPI(): boolean {
    return typeof performance !== 'undefined' && (performance as any).memory;
  }

  static getEnvironmentInfo() {
    return {
      isNode: this.isNode(),
      isBrowser: this.isBrowser(),
      hasPerformanceAPI: this.hasPerformanceAPI(),
      hasMemoryAPI: this.hasMemoryAPI(),
      userAgent: this.isBrowser() ? navigator.userAgent : 'Node.js'
    };
  }
}
