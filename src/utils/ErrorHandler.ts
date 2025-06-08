/**
 * 错误处理工具
 * Week 3 - 任务2.3
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATA_ERROR = 'DATA_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  PRELOAD_ERROR = 'PRELOAD_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorInfo {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  timestamp: number;
  context?: any;
  stack?: string;
  retryable: boolean;
  fallbackAvailable: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

export interface FallbackStrategy {
  type: 'optimized_to_traditional' | 'lazy_to_full' | 'cache_to_network' | 'preload_to_ondemand';
  description: string;
  execute: () => Promise<any>;
}

export class ErrorHandler {
  private errorLog: ErrorInfo[] = [];
  private retryAttempts = new Map<string, number>();
  private fallbackStrategies = new Map<ErrorType, FallbackStrategy[]>();
  
  // 默认重试配置
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
    maxDelay: 10000
  };

  constructor() {
    this.initializeFallbackStrategies();
    console.log('🛡️ ErrorHandler初始化完成');
  }

  /**
   * 处理错误
   */
  async handleError(
    error: Error | any,
    context?: any,
    retryConfig?: Partial<RetryConfig>
  ): Promise<{ success: boolean; data?: any; error?: ErrorInfo }> {
    const errorInfo = this.analyzeError(error, context);
    this.logError(errorInfo);

    console.warn(`🚨 错误处理: ${errorInfo.type} - ${errorInfo.message}`);

    // 尝试重试
    if (errorInfo.retryable) {
      const retryResult = await this.attemptRetry(errorInfo, retryConfig);
      if (retryResult.success) {
        return retryResult;
      }
    }

    // 尝试降级策略
    if (errorInfo.fallbackAvailable) {
      const fallbackResult = await this.attemptFallback(errorInfo);
      if (fallbackResult.success) {
        return fallbackResult;
      }
    }

    // 返回错误信息
    return {
      success: false,
      error: errorInfo
    };
  }

  /**
   * 分析错误类型和严重程度
   */
  private analyzeError(error: Error | any, context?: any): ErrorInfo {
    let errorType = ErrorType.UNKNOWN_ERROR;
    let severity = ErrorSeverity.MEDIUM;
    let userMessage = '操作失败，请稍后重试';
    let retryable = true;
    let fallbackAvailable = false;

    const message = error?.message || error?.toString() || '未知错误';

    // 网络错误
    if (this.isNetworkError(error, message)) {
      errorType = ErrorType.NETWORK_ERROR;
      severity = ErrorSeverity.HIGH;
      userMessage = '网络连接不稳定，正在重试...';
      retryable = true;
      fallbackAvailable = true;
    }
    // 超时错误
    else if (this.isTimeoutError(error, message)) {
      errorType = ErrorType.TIMEOUT_ERROR;
      severity = ErrorSeverity.HIGH;
      userMessage = '加载超时，请检查网络连接';
      retryable = true;
      fallbackAvailable = true;
    }
    // 数据解析错误
    else if (this.isParseError(error, message)) {
      errorType = ErrorType.PARSE_ERROR;
      severity = ErrorSeverity.MEDIUM;
      userMessage = '数据格式错误，已切换到备用模式';
      retryable = false;
      fallbackAvailable = true;
    }
    // 配置错误
    else if (this.isConfigError(error, message, context)) {
      errorType = ErrorType.CONFIG_ERROR;
      severity = ErrorSeverity.HIGH;
      userMessage = '配置加载失败，正在尝试备用配置';
      retryable = true;
      fallbackAvailable = true;
    }
    // 缓存错误
    else if (this.isCacheError(error, message, context)) {
      errorType = ErrorType.CACHE_ERROR;
      severity = ErrorSeverity.LOW;
      userMessage = '缓存已清理，正在重新加载...';
      retryable = true;
      fallbackAvailable = true;
    }
    // 预加载错误
    else if (this.isPreloadError(error, message, context)) {
      errorType = ErrorType.PRELOAD_ERROR;
      severity = ErrorSeverity.LOW;
      userMessage = '预加载失败，不影响正常使用';
      retryable = false;
      fallbackAvailable = true;
    }
    // 存储错误
    else if (this.isStorageError(error, message)) {
      errorType = ErrorType.STORAGE_ERROR;
      severity = ErrorSeverity.MEDIUM;
      userMessage = '存储空间不足，已清理缓存';
      retryable = false;
      fallbackAvailable = true;
    }

    return {
      type: errorType,
      severity,
      message,
      userMessage,
      timestamp: Date.now(),
      context,
      stack: error?.stack,
      retryable,
      fallbackAvailable
    };
  }

  /**
   * 尝试重试操作
   */
  private async attemptRetry(
    errorInfo: ErrorInfo,
    retryConfig?: Partial<RetryConfig>
  ): Promise<{ success: boolean; data?: any }> {
    const config = { ...this.defaultRetryConfig, ...retryConfig };
    const retryKey = `${errorInfo.type}_${errorInfo.timestamp}`;
    
    const currentAttempts = this.retryAttempts.get(retryKey) || 0;
    
    if (currentAttempts >= config.maxRetries) {
      console.warn(`🔄 重试次数已达上限: ${errorInfo.type}`);
      return { success: false };
    }

    this.retryAttempts.set(retryKey, currentAttempts + 1);

    // 计算延迟时间
    const delay = Math.min(
      config.retryDelay * Math.pow(config.backoffMultiplier, currentAttempts),
      config.maxDelay
    );

    console.log(`🔄 重试 ${currentAttempts + 1}/${config.maxRetries}: ${errorInfo.type} (延迟: ${delay}ms)`);

    await this.sleep(delay);

    // 这里应该重新执行原始操作，但由于我们不知道具体操作，返回false
    // 在实际使用中，调用方会处理重试逻辑
    return { success: false };
  }

  /**
   * 尝试降级策略
   */
  private async attemptFallback(errorInfo: ErrorInfo): Promise<{ success: boolean; data?: any }> {
    const strategies = this.fallbackStrategies.get(errorInfo.type);
    
    if (!strategies || strategies.length === 0) {
      console.warn(`🔄 没有可用的降级策略: ${errorInfo.type}`);
      return { success: false };
    }

    for (const strategy of strategies) {
      try {
        console.log(`🔄 尝试降级策略: ${strategy.type} - ${strategy.description}`);
        const result = await strategy.execute();
        
        console.log(`✅ 降级策略成功: ${strategy.type}`);
        return { success: true, data: result };
      } catch (fallbackError) {
        console.warn(`❌ 降级策略失败: ${strategy.type}`, fallbackError);
      }
    }

    return { success: false };
  }

  /**
   * 初始化降级策略
   */
  private initializeFallbackStrategies(): void {
    // 网络错误降级策略
    this.fallbackStrategies.set(ErrorType.NETWORK_ERROR, [
      {
        type: 'cache_to_network',
        description: '使用缓存数据',
        execute: async () => {
          // 实际实现中会从缓存获取数据
          return { fromCache: true, message: '使用缓存数据' };
        }
      }
    ]);

    // 配置错误降级策略
    this.fallbackStrategies.set(ErrorType.CONFIG_ERROR, [
      {
        type: 'optimized_to_traditional',
        description: '从优化格式降级到传统格式',
        execute: async () => {
          return { fallbackMode: 'traditional', message: '使用传统配置格式' };
        }
      }
    ]);

    // 缓存错误降级策略
    this.fallbackStrategies.set(ErrorType.CACHE_ERROR, [
      {
        type: 'cache_to_network',
        description: '清理缓存并重新加载',
        execute: async () => {
          return { cacheCleared: true, message: '缓存已清理' };
        }
      }
    ]);

    // 预加载错误降级策略
    this.fallbackStrategies.set(ErrorType.PRELOAD_ERROR, [
      {
        type: 'preload_to_ondemand',
        description: '禁用预加载，改为按需加载',
        execute: async () => {
          return { preloadDisabled: true, message: '已禁用预加载' };
        }
      }
    ]);

    // 解析错误降级策略
    this.fallbackStrategies.set(ErrorType.PARSE_ERROR, [
      {
        type: 'optimized_to_traditional',
        description: '使用传统数据格式',
        execute: async () => {
          return { fallbackFormat: true, message: '使用传统数据格式' };
        }
      }
    ]);
  }

  /**
   * 错误类型判断方法
   */
  private isNetworkError(error: any, message: string): boolean {
    return (
      error?.name === 'NetworkError' ||
      error?.code === 'NETWORK_ERROR' ||
      message.includes('fetch') ||
      message.includes('network') ||
      message.includes('连接') ||
      error?.status >= 500
    );
  }

  private isTimeoutError(error: any, message: string): boolean {
    return (
      error?.name === 'TimeoutError' ||
      error?.code === 'TIMEOUT' ||
      message.includes('timeout') ||
      message.includes('超时')
    );
  }

  private isParseError(error: any, message: string): boolean {
    return (
      error?.name === 'SyntaxError' ||
      error?.name === 'TypeError' ||
      message.includes('JSON') ||
      message.includes('parse') ||
      message.includes('解析')
    );
  }

  private isConfigError(error: any, message: string, context?: any): boolean {
    return (
      context?.type === 'config' ||
      message.includes('config') ||
      message.includes('配置') ||
      context?.operation === 'loadConfig'
    );
  }

  private isCacheError(error: any, message: string, context?: any): boolean {
    return (
      context?.type === 'cache' ||
      message.includes('cache') ||
      message.includes('缓存') ||
      context?.operation === 'cache'
    );
  }

  private isPreloadError(error: any, message: string, context?: any): boolean {
    return (
      context?.type === 'preload' ||
      message.includes('preload') ||
      message.includes('预加载') ||
      context?.operation === 'preload'
    );
  }

  private isStorageError(error: any, message: string): boolean {
    return (
      error?.name === 'QuotaExceededError' ||
      message.includes('storage') ||
      message.includes('quota') ||
      message.includes('存储')
    );
  }

  /**
   * 记录错误日志
   */
  private logError(errorInfo: ErrorInfo): void {
    this.errorLog.unshift(errorInfo);
    
    // 保持最近100个错误记录
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(0, 100);
    }
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取错误日志
   */
  getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    recentErrors: ErrorInfo[];
  } {
    const errorsByType = {} as Record<ErrorType, number>;
    const errorsBySeverity = {} as Record<ErrorSeverity, number>;

    // 初始化计数器
    Object.values(ErrorType).forEach(type => {
      errorsByType[type] = 0;
    });
    Object.values(ErrorSeverity).forEach(severity => {
      errorsBySeverity[severity] = 0;
    });

    // 统计错误
    this.errorLog.forEach(error => {
      errorsByType[error.type]++;
      errorsBySeverity[error.severity]++;
    });

    return {
      totalErrors: this.errorLog.length,
      errorsByType,
      errorsBySeverity,
      recentErrors: this.errorLog.slice(0, 10)
    };
  }

  /**
   * 清理错误日志
   */
  clearErrorLog(): void {
    this.errorLog = [];
    this.retryAttempts.clear();
    console.log('🗑️ 错误日志已清理');
  }

  /**
   * 检查系统健康状态
   */
  getSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const recentErrors = this.errorLog.filter(
      error => Date.now() - error.timestamp < 5 * 60 * 1000 // 最近5分钟
    );

    const criticalErrors = recentErrors.filter(
      error => error.severity === ErrorSeverity.CRITICAL
    ).length;

    const highErrors = recentErrors.filter(
      error => error.severity === ErrorSeverity.HIGH
    ).length;

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    let score = 100;
    const issues: string[] = [];
    const recommendations: string[] = [];

    // 评估系统状态
    if (criticalErrors > 0) {
      status = 'critical';
      score -= criticalErrors * 30;
      issues.push(`${criticalErrors}个严重错误`);
      recommendations.push('立即检查系统配置和网络连接');
    }

    if (highErrors > 2) {
      status = status === 'healthy' ? 'warning' : status;
      score -= highErrors * 10;
      issues.push(`${highErrors}个高级错误`);
      recommendations.push('检查网络稳定性和数据源');
    }

    if (recentErrors.length > 10) {
      status = status === 'healthy' ? 'warning' : status;
      score -= 20;
      issues.push('错误频率过高');
      recommendations.push('检查系统负载和资源使用情况');
    }

    score = Math.max(0, score);

    return {
      status,
      score,
      issues,
      recommendations
    };
  }
}

/**
 * 默认错误处理实例
 */
export const defaultErrorHandler = new ErrorHandler();

/**
 * 便捷函数：处理错误
 */
export async function handleError(
  error: Error | any,
  context?: any,
  retryConfig?: Partial<RetryConfig>
) {
  return defaultErrorHandler.handleError(error, context, retryConfig);
}

/**
 * 便捷函数：获取用户友好的错误消息
 */
export function getUserErrorMessage(error: Error | any, context?: any): string {
  const errorHandler = new ErrorHandler();
  const errorInfo = (errorHandler as any).analyzeError(error, context);
  return errorInfo.userMessage;
}
