/**
 * 懒加载管理器 - 管理分类数据的按需加载
 * Week 2: 前端懒加载机制实现
 */

import type { 
  CategoryData, 
  CategoryLoadResult, 
  CategoryLoadState, 
  LazyLoadManager,
  LazyLoadConfig,
  LoadingState 
} from '../types/lazyLoading';

/**
 * 默认懒加载配置
 */
const DEFAULT_CONFIG: LazyLoadConfig = {
  preloadNext: true,
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 10000,
  enableCache: true,
  cacheConfig: {
    maxSize: 50, // 50MB
    expiry: 30 * 60 * 1000, // 30分钟
    enablePersistence: true,
    storageKey: 'astro-nav-category-cache'
  }
};

/**
 * 懒加载管理器类
 */
export class LazyLoadManager {
  private static instance: LazyLoadManager;
  private loadedCategories: Map<number, CategoryData> = new Map();
  private loadingStates: Map<number, CategoryLoadState> = new Map();
  private config: LazyLoadConfig;
  private loadingPromises: Map<number, Promise<CategoryLoadResult>> = new Map();

  constructor(config: Partial<LazyLoadConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeCache();
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: Partial<LazyLoadConfig>): LazyLoadManager {
    if (!LazyLoadManager.instance) {
      LazyLoadManager.instance = new LazyLoadManager(config);
    }
    return LazyLoadManager.instance;
  }

  /**
   * 初始化缓存
   */
  private initializeCache(): void {
    if (this.config.enableCache && this.config.cacheConfig.enablePersistence) {
      try {
        const cached = localStorage.getItem(this.config.cacheConfig.storageKey);
        if (cached) {
          const data = JSON.parse(cached);
          const now = Date.now();
          
          // 检查缓存是否过期
          Object.entries(data).forEach(([key, value]: [string, any]) => {
            if (value.timestamp && (now - value.timestamp) < this.config.cacheConfig.expiry) {
              this.loadedCategories.set(parseInt(key), value.data);
              console.log(`📦 从缓存恢复分类 ${key}`);
            }
          });
        }
      } catch (error) {
        console.warn('⚠️ 缓存恢复失败:', error);
      }
    }
  }

  /**
   * 保存到持久化缓存
   */
  private saveToCache(): void {
    if (this.config.enableCache && this.config.cacheConfig.enablePersistence) {
      try {
        const cacheData: any = {};
        const now = Date.now();
        
        this.loadedCategories.forEach((data, index) => {
          cacheData[index] = {
            data,
            timestamp: now
          };
        });
        
        localStorage.setItem(this.config.cacheConfig.storageKey, JSON.stringify(cacheData));
      } catch (error) {
        console.warn('⚠️ 缓存保存失败:', error);
      }
    }
  }

  /**
   * 加载分类数据
   */
  async loadCategory(categoryIndex: number): Promise<CategoryLoadResult> {
    const startTime = performance.now();
    
    // 检查是否已在加载中
    if (this.loadingPromises.has(categoryIndex)) {
      console.log(`⏳ 分类 ${categoryIndex} 正在加载中，等待现有请求...`);
      return this.loadingPromises.get(categoryIndex)!;
    }
    
    // 检查缓存
    if (this.loadedCategories.has(categoryIndex)) {
      const data = this.loadedCategories.get(categoryIndex)!;
      const loadTime = performance.now() - startTime;
      
      console.log(`📦 从缓存加载分类 ${categoryIndex} (${loadTime.toFixed(2)}ms)`);
      
      return {
        success: true,
        data,
        fromCache: true,
        loadTime
      };
    }

    // 创建加载Promise
    const loadPromise = this.performLoad(categoryIndex, startTime);
    this.loadingPromises.set(categoryIndex, loadPromise);
    
    // 加载完成后清理Promise
    loadPromise.finally(() => {
      this.loadingPromises.delete(categoryIndex);
    });
    
    return loadPromise;
  }

  /**
   * 执行实际的加载操作
   */
  private async performLoad(categoryIndex: number, startTime: number): Promise<CategoryLoadResult> {
    // 更新加载状态
    this.updateLoadingState(categoryIndex, 'loading');
    
    let lastError: string | undefined;
    
    // 重试机制
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`🔄 加载分类 ${categoryIndex} (尝试 ${attempt}/${this.config.retryAttempts})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(`/categories/${categoryIndex}.json`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data: CategoryData = await response.json();
        const loadTime = performance.now() - startTime;
        
        // 验证数据格式
        if (!this.validateCategoryData(data)) {
          throw new Error('分类数据格式无效');
        }
        
        // 保存到缓存
        this.loadedCategories.set(categoryIndex, data);
        this.updateLoadingState(categoryIndex, 'success', data);
        this.saveToCache();
        
        console.log(`✅ 分类 ${categoryIndex} 加载成功 (${loadTime.toFixed(2)}ms, ${data.sites.length} 个网站)`);
        
        // 预加载下一个分类
        if (this.config.preloadNext) {
          this.preloadNext(categoryIndex);
        }
        
        return {
          success: true,
          data,
          fromCache: false,
          loadTime
        };
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : '未知错误';
        console.warn(`⚠️ 分类 ${categoryIndex} 加载失败 (尝试 ${attempt}): ${lastError}`);
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < this.config.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
        }
      }
    }
    
    // 所有重试都失败
    const loadTime = performance.now() - startTime;
    this.updateLoadingState(categoryIndex, 'error', undefined, lastError);
    
    console.error(`❌ 分类 ${categoryIndex} 加载失败: ${lastError}`);
    
    return {
      success: false,
      error: lastError,
      fromCache: false,
      loadTime
    };
  }

  /**
   * 预加载下一个分类
   */
  private preloadNext(currentIndex: number): void {
    const nextIndex = currentIndex + 1;
    
    // 检查下一个分类是否已加载或正在加载
    if (!this.loadedCategories.has(nextIndex) && !this.loadingPromises.has(nextIndex)) {
      console.log(`🔮 预加载分类 ${nextIndex}`);
      
      // 异步预加载，不等待结果
      this.loadCategory(nextIndex).catch(error => {
        console.warn(`⚠️ 预加载分类 ${nextIndex} 失败:`, error);
      });
    }
  }

  /**
   * 验证分类数据格式
   */
  private validateCategoryData(data: any): data is CategoryData {
    return (
      typeof data === 'object' &&
      typeof data.categoryIndex === 'number' &&
      typeof data.categoryName === 'string' &&
      Array.isArray(data.sites) &&
      typeof data.metadata === 'object' &&
      typeof data.metadata.siteCount === 'number'
    );
  }

  /**
   * 更新加载状态
   */
  private updateLoadingState(
    categoryIndex: number, 
    state: LoadingState, 
    data?: CategoryData, 
    error?: string
  ): void {
    const currentState = this.loadingStates.get(categoryIndex);
    const retryCount = currentState?.retryCount || 0;
    
    this.loadingStates.set(categoryIndex, {
      categoryIndex,
      state,
      data,
      error,
      loadedAt: state === 'success' ? new Date() : currentState?.loadedAt,
      retryCount: state === 'error' ? retryCount + 1 : retryCount
    });
  }

  /**
   * 获取分类数据
   */
  getCategory(categoryIndex: number): CategoryData | undefined {
    return this.loadedCategories.get(categoryIndex);
  }

  /**
   * 获取加载状态
   */
  getLoadingState(categoryIndex: number): CategoryLoadState | undefined {
    return this.loadingStates.get(categoryIndex);
  }

  /**
   * 检查分类是否已加载
   */
  isCategoryLoaded(categoryIndex: number): boolean {
    return this.loadedCategories.has(categoryIndex);
  }

  /**
   * 检查分类是否正在加载
   */
  isCategoryLoading(categoryIndex: number): boolean {
    const state = this.loadingStates.get(categoryIndex);
    return state?.state === 'loading';
  }

  /**
   * 清理缓存
   */
  clearCache(): void {
    this.loadedCategories.clear();
    this.loadingStates.clear();
    
    if (this.config.cacheConfig.enablePersistence) {
      localStorage.removeItem(this.config.cacheConfig.storageKey);
    }
    
    console.log('🗑️ 缓存已清理');
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): any {
    const totalSize = Array.from(this.loadedCategories.values())
      .reduce((size, data) => size + JSON.stringify(data).length, 0);
    
    return {
      loadedCategories: this.loadedCategories.size,
      totalSizeBytes: totalSize,
      totalSizeKB: Math.round(totalSize / 1024),
      cacheHitRate: this.calculateCacheHitRate(),
      loadingStates: Object.fromEntries(
        Array.from(this.loadingStates.entries()).map(([key, value]) => [
          key, 
          { state: value.state, error: value.error }
        ])
      )
    };
  }

  /**
   * 计算缓存命中率
   */
  private calculateCacheHitRate(): number {
    // 这里可以实现更复杂的统计逻辑
    // 目前简单返回已加载分类的比例
    const totalRequests = this.loadingStates.size;
    const cacheHits = this.loadedCategories.size;
    
    return totalRequests > 0 ? (cacheHits / totalRequests) : 0;
  }
}

/**
 * 默认懒加载管理器实例
 */
export const defaultLazyLoadManager = LazyLoadManager.getInstance();

/**
 * 便捷函数：加载分类
 */
export async function loadCategory(categoryIndex: number): Promise<CategoryLoadResult> {
  return defaultLazyLoadManager.loadCategory(categoryIndex);
}

/**
 * 便捷函数：获取分类数据
 */
export function getCategory(categoryIndex: number): CategoryData | undefined {
  return defaultLazyLoadManager.getCategory(categoryIndex);
}

/**
 * 便捷函数：检查是否已加载
 */
export function isCategoryLoaded(categoryIndex: number): boolean {
  return defaultLazyLoadManager.isCategoryLoaded(categoryIndex);
}
