/**
 * 配置加载器 - 智能检测和加载传统/优化配置
 * Week 2: 前端懒加载机制实现
 */

import type { SiteConfig } from '../types/config';
import type { 
  OptimizedConfig, 
  UnifiedConfig, 
  ConfigLoadResult, 
  ConfigDetectionResult,
  UnifiedMenuItem,
  UnifiedSubMenuItem
} from '../types/lazyLoading';

/**
 * 配置加载器类
 */
export class ConfigLoader {
  private static instance: ConfigLoader;
  private loadedConfig: UnifiedConfig | null = null;
  private configPath: string;

  constructor(configPath: string = '/config.json') {
    this.configPath = configPath;
  }

  /**
   * 获取单例实例
   */
  static getInstance(configPath?: string): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader(configPath);
    }
    return ConfigLoader.instance;
  }

  /**
   * 加载配置文件
   */
  async loadConfig(): Promise<ConfigLoadResult> {
    const startTime = performance.now();
    
    try {
      console.log('🔄 开始加载配置文件...');
      
      // 加载主配置文件
      const response = await fetch(this.configPath);
      if (!response.ok) {
        throw new Error(`配置文件加载失败: ${response.status} ${response.statusText}`);
      }
      
      const rawConfig = await response.json();
      const loadTime = performance.now() - startTime;
      
      // 检测配置类型
      const detection = this.detectConfigType(rawConfig);
      console.log('📊 配置检测结果:', detection);
      
      // 转换为统一格式
      const unifiedConfig = detection.isOptimized 
        ? this.convertOptimizedConfig(rawConfig as OptimizedConfig)
        : this.convertTraditionalConfig(rawConfig as SiteConfig);
      
      this.loadedConfig = unifiedConfig;
      
      console.log('✅ 配置加载成功:', {
        isOptimized: detection.isOptimized,
        loadTime: `${loadTime.toFixed(2)}ms`,
        menuItems: unifiedConfig.menuItems.length,
        totalSites: this.getTotalSiteCount(unifiedConfig)
      });
      
      return {
        success: true,
        config: unifiedConfig,
        isOptimized: detection.isOptimized,
        loadTime
      };
      
    } catch (error) {
      const loadTime = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      console.error('❌ 配置加载失败:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        isOptimized: false,
        loadTime
      };
    }
  }

  /**
   * 检测配置类型
   */
  private detectConfigType(config: any): ConfigDetectionResult {
    let confidence = 0;
    let isOptimized = false;
    let hasOptimizationField = false;
    let hasCategoryIndexes = false;
    let estimatedCategories = 0;

    // 检查是否有optimization字段
    if (config.optimization && config.optimization.enabled === true) {
      hasOptimizationField = true;
      confidence += 0.4;
      isOptimized = true;
    }

    // 检查菜单项是否有categoryIndex字段
    if (config.menuItems && Array.isArray(config.menuItems)) {
      const itemsWithCategoryIndex = config.menuItems.filter((item: any) => 
        typeof item.categoryIndex === 'number'
      );
      
      if (itemsWithCategoryIndex.length > 0) {
        hasCategoryIndexes = true;
        confidence += 0.4;
        isOptimized = true;
        
        // 估算分类数量
        const maxIndex = Math.max(...itemsWithCategoryIndex.map((item: any) => item.categoryIndex));
        estimatedCategories = maxIndex + 1;
      }
    }

    // 检查是否有previewSites字段
    if (config.menuItems && config.menuItems.some((item: any) => 
      Array.isArray(item.previewSites)
    )) {
      confidence += 0.2;
      isOptimized = true;
    }

    // 如果没有明确的优化标识，但有传统的sites字段，则认为是传统配置
    if (!isOptimized && config.menuItems && config.menuItems.some((item: any) => 
      Array.isArray(item.sites)
    )) {
      confidence = 0.9; // 传统配置的置信度
    }

    return {
      isOptimized,
      hasOptimizationField,
      hasCategoryIndexes,
      estimatedCategories,
      confidence
    };
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
      isOptimized: false
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
      isLazyLoaded: true
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
      return config.optimization.totalSites;
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

  /**
   * 获取已加载的配置
   */
  getLoadedConfig(): UnifiedConfig | null {
    return this.loadedConfig;
  }

  /**
   * 重新加载配置
   */
  async reloadConfig(): Promise<ConfigLoadResult> {
    this.loadedConfig = null;
    return this.loadConfig();
  }

  /**
   * 检查配置是否已加载
   */
  isConfigLoaded(): boolean {
    return this.loadedConfig !== null;
  }

  /**
   * 获取配置统计信息
   */
  getConfigStats(): any {
    if (!this.loadedConfig) {
      return null;
    }

    const config = this.loadedConfig;
    const stats = {
      isOptimized: config.isOptimized,
      menuItemCount: config.menuItems.length,
      totalSites: this.getTotalSiteCount(config),
      lazyLoadedItems: config.menuItems.filter(item => item.isLazyLoaded).length
    };

    if (config.optimization) {
      Object.assign(stats, {
        totalCategories: config.optimization.totalCategories,
        previewCount: config.optimization.previewCount,
        fileSizeKB: config.optimization.fileSizeKB,
        compressionRatio: config.optimization.compressionRatio
      });
    }

    return stats;
  }
}

/**
 * 默认配置加载器实例
 */
export const defaultConfigLoader = ConfigLoader.getInstance();

/**
 * 便捷函数：加载配置
 */
export async function loadConfig(configPath?: string): Promise<ConfigLoadResult> {
  const loader = configPath ? new ConfigLoader(configPath) : defaultConfigLoader;
  return loader.loadConfig();
}

/**
 * 便捷函数：获取已加载的配置
 */
export function getLoadedConfig(): UnifiedConfig | null {
  return defaultConfigLoader.getLoadedConfig();
}
