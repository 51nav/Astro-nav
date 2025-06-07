/**
 * ConfigManager - 配置管理器
 * Week 2: 基于设计文档重构的配置管理系统
 */

import type { SiteConfig } from '../types/config';
import type { 
  OptimizedConfig, 
  UnifiedConfig, 
  ConfigLoadResult, 
  ConfigDetectionResult,
  UnifiedMenuItem,
  UnifiedSubMenuItem,
  ConfigFormat,
  LoadingState
} from '../types/lazyLoading';

/**
 * 配置管理器 - 核心配置管理类
 */
export class ConfigManager {
  private static instance: ConfigManager;
  
  // 核心状态
  private currentConfig: UnifiedConfig | null = null;
  private configFormat: ConfigFormat = 'unknown';
  private loadingState: LoadingState = 'idle';
  private configPath: string;
  
  // 性能监控
  private loadStartTime: number = 0;
  private loadMetrics: {
    configLoadTime: number;
    detectionTime: number;
    conversionTime: number;
  } = {
    configLoadTime: 0,
    detectionTime: 0,
    conversionTime: 0
  };

  constructor(configPath?: string) {
    // 智能路径检测：优先使用public/，回退到src/data/
    this.configPath = configPath || this.detectConfigPath();
  }

  /**
   * 智能检测配置文件路径
   */
  private detectConfigPath(): string {
    // 开发环境优先级：public/ > src/data/
    const paths = [
      '/config.json',           // public/config.json (懒加载友好)
      '/src/data/config.json'   // src/data/config.json (构建时)
    ];

    // 在实际使用中，我们会先尝试public/路径
    // 如果失败，ConfigManager会自动处理错误
    return paths[0];
  }

  /**
   * 获取单例实例
   */
  static getInstance(configPath?: string): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager(configPath);
    }
    return ConfigManager.instance;
  }

  /**
   * 检测配置格式
   */
  detectConfigFormat(config: any): ConfigDetectionResult {
    const startTime = performance.now();
    
    let confidence = 0;
    let isOptimized = false;
    let hasOptimizationField = false;
    let hasCategoryIndexes = false;
    let hasPreviewSites = false;
    let estimatedCategories = 0;

    // 1. 检查optimization字段 (权重: 40%)
    if (config.optimization && typeof config.optimization === 'object') {
      hasOptimizationField = true;
      if (config.optimization.enabled === true) {
        confidence += 0.4;
        isOptimized = true;
      }
    }

    // 2. 检查categoryIndex字段 (权重: 40%)
    if (config.menuItems && Array.isArray(config.menuItems)) {
      const itemsWithCategoryIndex = config.menuItems.filter((item: any) => 
        typeof item.categoryIndex === 'number' && item.categoryIndex >= 0
      );
      
      if (itemsWithCategoryIndex.length > 0) {
        hasCategoryIndexes = true;
        confidence += 0.4;
        isOptimized = true;
        
        // 计算分类数量 (包括submenu)
        const allIndexes: number[] = [];
        config.menuItems.forEach((item: any) => {
          if (typeof item.categoryIndex === 'number' && item.categoryIndex >= 0) {
            allIndexes.push(item.categoryIndex);
          }
          if (item.submenu && Array.isArray(item.submenu)) {
            item.submenu.forEach((sub: any) => {
              if (typeof sub.categoryIndex === 'number' && sub.categoryIndex >= 0) {
                allIndexes.push(sub.categoryIndex);
              }
            });
          }
        });
        estimatedCategories = allIndexes.length > 0 ? Math.max(...allIndexes) + 1 : 0;
      }
    }

    // 3. 检查previewSites字段 (权重: 20%)
    if (config.menuItems && config.menuItems.some((item: any) => 
      Array.isArray(item.previewSites) || 
      (item.submenu && item.submenu.some((sub: any) => Array.isArray(sub.previewSites)))
    )) {
      hasPreviewSites = true;
      confidence += 0.2;
      isOptimized = true;
    }

    // 4. 检查传统格式特征
    if (!isOptimized && config.menuItems && config.menuItems.some((item: any) => 
      Array.isArray(item.sites) || 
      (item.submenu && item.submenu.some((sub: any) => Array.isArray(sub.sites)))
    )) {
      confidence = 0.95; // 传统配置的高置信度
    }

    // 5. 检查categoryMap字段 (传统格式特征)
    if (config.categoryMap && typeof config.categoryMap === 'object') {
      if (!isOptimized) {
        confidence += 0.05; // 增强传统格式置信度
      }
    }

    const detectionTime = performance.now() - startTime;
    this.loadMetrics.detectionTime = detectionTime;

    const result: ConfigDetectionResult = {
      isOptimized,
      hasOptimizationField,
      hasCategoryIndexes,
      hasPreviewSites,
      estimatedCategories,
      confidence
    };

    console.log('🔍 配置格式检测:', {
      ...result,
      detectionTime: `${detectionTime.toFixed(2)}ms`
    });

    return result;
  }

  /**
   * 加载配置文件
   */
  async loadConfig(): Promise<ConfigLoadResult> {
    this.loadStartTime = performance.now();
    this.loadingState = 'loading';
    
    try {
      console.log('🔄 ConfigManager: 开始加载配置文件...');
      
      // 1. 加载主配置文件
      const response = await fetch(this.configPath);
      if (!response.ok) {
        throw new Error(`配置文件加载失败: ${response.status} ${response.statusText}`);
      }
      
      const rawConfig = await response.json();
      this.loadMetrics.configLoadTime = performance.now() - this.loadStartTime;
      
      // 2. 检测配置格式
      const detection = this.detectConfigFormat(rawConfig);
      this.configFormat = detection.isOptimized ? 'optimized' : 'traditional';
      
      // 3. 转换为统一格式
      const conversionStartTime = performance.now();
      const unifiedConfig = detection.isOptimized 
        ? this.convertOptimizedConfig(rawConfig as OptimizedConfig)
        : this.convertTraditionalConfig(rawConfig as SiteConfig);
      
      this.loadMetrics.conversionTime = performance.now() - conversionStartTime;
      this.currentConfig = unifiedConfig;
      this.loadingState = 'success';
      
      const totalLoadTime = performance.now() - this.loadStartTime;
      
      console.log('✅ ConfigManager: 配置加载成功', {
        format: this.configFormat,
        loadTime: `${totalLoadTime.toFixed(2)}ms`,
        menuItems: unifiedConfig.menuItems.length,
        totalSites: this.getTotalSiteCount(unifiedConfig),
        metrics: this.loadMetrics
      });
      
      return {
        success: true,
        config: unifiedConfig,
        isOptimized: detection.isOptimized,
        loadTime: totalLoadTime,
        detection
      };
      
    } catch (error) {
      this.loadingState = 'error';
      const totalLoadTime = performance.now() - this.loadStartTime;
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      console.error('❌ ConfigManager: 配置加载失败', {
        error: errorMessage,
        loadTime: `${totalLoadTime.toFixed(2)}ms`
      });
      
      return {
        success: false,
        error: errorMessage,
        isOptimized: false,
        loadTime: totalLoadTime
      };
    }
  }

  /**
   * 转换传统配置为统一格式
   */
  private convertTraditionalConfig(config: SiteConfig): UnifiedConfig {
    const unifiedMenuItems: UnifiedMenuItem[] = config.menuItems.map(item => ({
      name: item.name,
      href: item.href,
      icon: item.icon,
      type: item.type,
      sites: item.sites,
      submenu: item.submenu?.map(sub => ({
        name: sub.name,
        href: sub.href,
        icon: sub.icon,
        sites: sub.sites,
        isLazyLoaded: false
      } as UnifiedSubMenuItem)),
      isLazyLoaded: false
    }));

    return {
      site: config.site,
      menuItems: unifiedMenuItems,
      isOptimized: false,
      categoryMap: config.categoryMap
    };
  }

  /**
   * 转换优化配置为统一格式
   */
  private convertOptimizedConfig(config: OptimizedConfig): UnifiedConfig {
    const unifiedMenuItems: UnifiedMenuItem[] = config.menuItems.map(item => ({
      name: item.name,
      href: item.href,
      icon: item.icon,
      type: item.type,
      categoryIndex: item.categoryIndex,
      siteCount: item.siteCount,
      previewSites: item.previewSites,
      submenu: item.submenu?.map(sub => ({
        name: sub.name,
        href: sub.href,
        icon: sub.icon,
        categoryIndex: sub.categoryIndex,
        siteCount: sub.siteCount,
        previewSites: sub.previewSites,
        isLazyLoaded: true
      } as UnifiedSubMenuItem)),
      isLazyLoaded: item.categoryIndex !== undefined && item.categoryIndex >= 0
    }));

    return {
      site: config.site,
      menuItems: unifiedMenuItems,
      isOptimized: true,
      optimization: config.optimization
    };
  }

  /**
   * 获取总网站数量
   */
  private getTotalSiteCount(config: UnifiedConfig): number {
    if (config.isOptimized && config.optimization) {
      return config.optimization.totalSites || 0;
    }
    
    // 传统配置需要计算
    let total = 0;
    config.menuItems.forEach(item => {
      if (item.sites) {
        total += item.sites.length;
      }
      if (item.submenu) {
        item.submenu.forEach(sub => {
          if (sub.sites) {
            total += sub.sites.length;
          }
        });
      }
    });
    
    return total;
  }

  // ============ 公共API ============

  /**
   * 获取当前配置
   */
  getCurrentConfig(): UnifiedConfig | null {
    return this.currentConfig;
  }

  /**
   * 获取配置格式
   */
  getConfigFormat(): ConfigFormat {
    return this.configFormat;
  }

  /**
   * 获取加载状态
   */
  getLoadingState(): LoadingState {
    return this.loadingState;
  }

  /**
   * 检查是否为优化模式
   */
  isOptimizedMode(): boolean {
    return this.configFormat === 'optimized';
  }

  /**
   * 获取菜单项
   */
  getMenuItems(): UnifiedMenuItem[] {
    return this.currentConfig?.menuItems || [];
  }

  /**
   * 检查配置是否已加载
   */
  isConfigLoaded(): boolean {
    return this.currentConfig !== null && this.loadingState === 'success';
  }

  /**
   * 重新加载配置
   */
  async reloadConfig(): Promise<ConfigLoadResult> {
    this.currentConfig = null;
    this.configFormat = 'unknown';
    this.loadingState = 'idle';
    return this.loadConfig();
  }

  /**
   * 获取配置统计信息
   */
  getConfigStats() {
    if (!this.currentConfig) {
      return null;
    }

    const config = this.currentConfig;
    const stats = {
      format: this.configFormat,
      isOptimized: config.isOptimized,
      loadingState: this.loadingState,
      menuItemCount: config.menuItems.length,
      totalSites: this.getTotalSiteCount(config),
      lazyLoadedItems: config.menuItems.filter(item => item.isLazyLoaded).length,
      loadMetrics: this.loadMetrics
    };

    if (config.optimization) {
      Object.assign(stats, {
        optimization: {
          totalCategories: config.optimization.totalCategories,
          previewCount: config.optimization.previewCount,
          fileSizeKB: config.optimization.fileSizeKB,
          compressionRatio: config.optimization.compressionRatio
        }
      });
    }

    return stats;
  }

  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    return {
      ...this.loadMetrics,
      totalLoadTime: this.loadMetrics.configLoadTime + this.loadMetrics.detectionTime + this.loadMetrics.conversionTime
    };
  }
}

/**
 * 默认配置管理器实例
 */
export const defaultConfigManager = ConfigManager.getInstance();

/**
 * 便捷函数：加载配置
 */
export async function loadConfig(configPath?: string): Promise<ConfigLoadResult> {
  const manager = configPath ? new ConfigManager(configPath) : defaultConfigManager;
  return manager.loadConfig();
}

/**
 * 便捷函数：获取当前配置
 */
export function getCurrentConfig(): UnifiedConfig | null {
  return defaultConfigManager.getCurrentConfig();
}

/**
 * 便捷函数：检查是否为优化模式
 */
export function isOptimizedMode(): boolean {
  return defaultConfigManager.isOptimizedMode();
}
