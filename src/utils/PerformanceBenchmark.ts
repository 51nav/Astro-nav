/**
 * 性能基准测试工具
 * Week 3 - 任务1.4性能监控
 */

export interface BenchmarkResult {
  name: string;
  duration: number;
  success: boolean;
  iterations: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  metadata?: any;
}

export interface PerformanceThresholds {
  configLoad: number;      // 配置加载阈值 (ms)
  categoryLoad: number;    // 分类加载阈值 (ms)
  cacheHit: number;        // 缓存命中阈值 (ms)
  memoryUsage: number;     // 内存使用阈值 (MB)
}

export class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];
  private thresholds: PerformanceThresholds;

  constructor(thresholds?: Partial<PerformanceThresholds>) {
    this.thresholds = {
      configLoad: 1000,     // 1秒
      categoryLoad: 2000,   // 2秒
      cacheHit: 10,         // 10ms
      memoryUsage: 50,      // 50MB
      ...thresholds
    };
  }

  /**
   * 运行性能基准测试
   */
  async runBenchmark<T>(
    name: string,
    testFn: () => Promise<T>,
    iterations: number = 1
  ): Promise<BenchmarkResult> {
    console.log(`🔄 开始性能基准测试: ${name} (${iterations}次迭代)`);

    const times: number[] = [];
    let lastResult: T;
    let success = true;

    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        lastResult = await testFn();
        const duration = performance.now() - startTime;
        times.push(duration);
      } catch (error) {
        console.error(`❌ 基准测试失败 (第${i + 1}次):`, error);
        success = false;
        break;
      }
    }

    const result: BenchmarkResult = {
      name,
      duration: times.reduce((sum, time) => sum + time, 0),
      success,
      iterations: times.length,
      avgTime: times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0,
      minTime: times.length > 0 ? Math.min(...times) : 0,
      maxTime: times.length > 0 ? Math.max(...times) : 0,
      metadata: {
        times,
        lastResult: success ? lastResult : null
      }
    };

    this.results.push(result);

    console.log(`✅ 基准测试完成: ${name}`, {
      avgTime: `${result.avgTime.toFixed(2)}ms`,
      minTime: `${result.minTime.toFixed(2)}ms`,
      maxTime: `${result.maxTime.toFixed(2)}ms`,
      success
    });

    return result;
  }

  /**
   * 批量运行基准测试
   */
  async runBenchmarkSuite(
    tests: Array<{
      name: string;
      testFn: () => Promise<any>;
      iterations?: number;
    }>
  ): Promise<BenchmarkResult[]> {
    console.log(`🚀 开始批量基准测试 (${tests.length}个测试)`);

    const results: BenchmarkResult[] = [];

    for (const test of tests) {
      const result = await this.runBenchmark(
        test.name,
        test.testFn,
        test.iterations || 1
      );
      results.push(result);
    }

    console.log(`🎉 批量基准测试完成`, {
      totalTests: tests.length,
      successfulTests: results.filter(r => r.success).length,
      totalTime: results.reduce((sum, r) => sum + r.duration, 0).toFixed(2) + 'ms'
    });

    return results;
  }

  /**
   * 验证性能阈值
   */
  validateThresholds(): {
    passed: boolean;
    results: Array<{
      name: string;
      threshold: number;
      actual: number;
      passed: boolean;
    }>;
  } {
    const validationResults = [];

    for (const result of this.results) {
      let threshold: number;
      let thresholdName: string;

      // 根据测试名称确定阈值
      if (result.name.includes('配置') || result.name.includes('config')) {
        threshold = this.thresholds.configLoad;
        thresholdName = 'configLoad';
      } else if (result.name.includes('分类') || result.name.includes('category')) {
        threshold = this.thresholds.categoryLoad;
        thresholdName = 'categoryLoad';
      } else if (result.name.includes('缓存') || result.name.includes('cache')) {
        threshold = this.thresholds.cacheHit;
        thresholdName = 'cacheHit';
      } else {
        continue; // 跳过无法分类的测试
      }

      const passed = result.avgTime <= threshold;
      validationResults.push({
        name: result.name,
        threshold,
        actual: result.avgTime,
        passed
      });
    }

    const allPassed = validationResults.every(r => r.passed);

    return {
      passed: allPassed,
      results: validationResults
    };
  }

  /**
   * 获取性能报告
   */
  getPerformanceReport(): {
    summary: {
      totalTests: number;
      successfulTests: number;
      totalTime: number;
      avgTime: number;
    };
    thresholdValidation: ReturnType<typeof this.validateThresholds>;
    results: BenchmarkResult[];
    recommendations: string[];
  } {
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgTime = totalTests > 0 ? totalTime / totalTests : 0;

    const thresholdValidation = this.validateThresholds();

    // 生成性能优化建议
    const recommendations: string[] = [];

    for (const validation of thresholdValidation.results) {
      if (!validation.passed) {
        if (validation.name.includes('配置')) {
          recommendations.push('考虑优化配置文件大小或使用更高效的解析方法');
        } else if (validation.name.includes('分类')) {
          recommendations.push('考虑实现更积极的预加载策略或优化数据结构');
        } else if (validation.name.includes('缓存')) {
          recommendations.push('检查缓存实现，确保LRU算法效率');
        }
      }
    }

    if (successfulTests < totalTests) {
      recommendations.push('修复失败的测试用例以提高系统稳定性');
    }

    if (avgTime > 1000) {
      recommendations.push('整体性能需要优化，考虑并行处理或异步优化');
    }

    return {
      summary: {
        totalTests,
        successfulTests,
        totalTime,
        avgTime
      },
      thresholdValidation,
      results: this.results,
      recommendations
    };
  }

  /**
   * 内存使用监控
   */
  getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
    withinThreshold: boolean;
  } | null {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const totalMB = memory.totalJSHeapSize / 1024 / 1024;
      const percentage = (usedMB / totalMB) * 100;

      return {
        used: usedMB,
        total: totalMB,
        percentage,
        withinThreshold: usedMB <= this.thresholds.memoryUsage
      };
    }

    return null;
  }

  /**
   * 清理结果
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * 获取所有结果
   */
  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  /**
   * 导出结果为JSON
   */
  exportResults(): string {
    const report = this.getPerformanceReport();
    return JSON.stringify(report, null, 2);
  }

  /**
   * 比较两次基准测试结果
   */
  static compareResults(
    baseline: BenchmarkResult[],
    current: BenchmarkResult[]
  ): Array<{
    name: string;
    baselineTime: number;
    currentTime: number;
    improvement: number;
    improvementPercentage: number;
  }> {
    const comparisons = [];

    for (const currentResult of current) {
      const baselineResult = baseline.find(b => b.name === currentResult.name);
      if (baselineResult) {
        const improvement = baselineResult.avgTime - currentResult.avgTime;
        const improvementPercentage = (improvement / baselineResult.avgTime) * 100;

        comparisons.push({
          name: currentResult.name,
          baselineTime: baselineResult.avgTime,
          currentTime: currentResult.avgTime,
          improvement,
          improvementPercentage
        });
      }
    }

    return comparisons;
  }
}

/**
 * 默认性能基准测试实例
 */
export const defaultBenchmark = new PerformanceBenchmark();

/**
 * 便捷函数：快速性能测试
 */
export async function quickBenchmark<T>(
  name: string,
  testFn: () => Promise<T>,
  iterations: number = 1
): Promise<BenchmarkResult> {
  return defaultBenchmark.runBenchmark(name, testFn, iterations);
}

/**
 * 便捷函数：获取性能报告
 */
export function getPerformanceReport() {
  return defaultBenchmark.getPerformanceReport();
}
