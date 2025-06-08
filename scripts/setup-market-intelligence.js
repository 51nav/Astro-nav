#!/usr/bin/env node

/**
 * 市场情报分析模块安装脚本
 * 
 * 功能:
 * 1. 安装必要的依赖包
 * 2. 创建配置文件模板
 * 3. 设置数据库结构
 * 4. 创建示例配置
 * 5. 验证安装
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class MarketIntelligenceSetup {
  constructor() {
    this.moduleName = 'Market Intelligence';
    this.moduleVersion = '1.0.0';
  }

  async install() {
    console.log(`🚀 开始安装 ${this.moduleName} 模块...`);
    console.log(`📦 版本: ${this.moduleVersion}\n`);

    try {
      // 1. 检查环境
      await this.checkEnvironment();

      // 2. 安装依赖
      await this.installDependencies();

      // 3. 创建目录结构
      await this.createDirectoryStructure();

      // 4. 创建配置文件
      await this.createConfigFiles();

      // 5. 创建工具类
      await this.createUtilityClasses();

      // 6. 创建示例文件
      await this.createExampleFiles();

      // 7. 更新package.json脚本
      await this.updatePackageScripts();

      // 8. 创建文档
      await this.createDocumentation();

      console.log('\n🎉 市场情报分析模块安装完成！');
      console.log('\n📖 下一步:');
      console.log('1. 编辑 config/api-keys.js 添加你的API密钥');
      console.log('2. 运行 npm run market-intelligence:test 测试配置');
      console.log('3. 查看 docs/04-features/market-intelligence/ 了解使用方法');

    } catch (error) {
      console.error('\n❌ 安装失败:', error.message);
      process.exit(1);
    }
  }

  async checkEnvironment() {
    console.log('🔍 检查环境...');

    // 检查Node.js版本
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      throw new Error(`需要 Node.js 16+ (当前版本: ${nodeVersion})`);
    }

    // 检查是否在项目根目录
    if (!fs.existsSync(path.join(projectRoot, 'package.json'))) {
      throw new Error('请在项目根目录运行此脚本');
    }

    console.log('✅ 环境检查通过');
  }

  async installDependencies() {
    console.log('📦 安装依赖包...');

    const dependencies = [
      'node-fetch@3.3.2',
      'csv-parser@3.0.0',
      'node-cron@3.0.3'
    ];

    const devDependencies = [
      '@types/node-cron@3.0.11'
    ];

    try {
      // 安装生产依赖
      console.log('  安装生产依赖...');
      execSync(`npm install ${dependencies.join(' ')}`, { 
        stdio: 'pipe',
        cwd: projectRoot 
      });

      // 安装开发依赖
      console.log('  安装开发依赖...');
      execSync(`npm install --save-dev ${devDependencies.join(' ')}`, { 
        stdio: 'pipe',
        cwd: projectRoot 
      });

      console.log('✅ 依赖包安装完成');
    } catch (error) {
      throw new Error(`依赖安装失败: ${error.message}`);
    }
  }

  async createDirectoryStructure() {
    console.log('📁 创建目录结构...');

    const directories = [
      'src/modules/market-intelligence',
      'src/modules/market-intelligence/api',
      'src/modules/market-intelligence/analyzers',
      'src/modules/market-intelligence/models',
      'src/modules/market-intelligence/services',
      'src/modules/market-intelligence/utils',
      'src/components/market-intelligence',
      'src/pages/market-intelligence',
      'config',
      'docs/04-features/market-intelligence',
      'docs/05-technical',
      'scripts/market-intelligence'
    ];

    directories.forEach(dir => {
      const fullPath = path.join(projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`  创建目录: ${dir}`);
      }
    });

    console.log('✅ 目录结构创建完成');
  }

  async createConfigFiles() {
    console.log('⚙️ 创建配置文件...');

    // API密钥配置模板
    const apiKeysTemplate = `/**
 * API密钥配置
 * 
 * 请将此文件复制为 api-keys.js 并填入真实的API密钥
 */

export const apiKeys = {
  // Semrush API密钥
  semrush: process.env.SEMRUSH_API_KEY || 'your-semrush-api-key-here',
  
  // SimilarWeb API密钥 (可选)
  similarweb: process.env.SIMILARWEB_API_KEY || 'your-similarweb-api-key-here',
  
  // Ahrefs API密钥 (可选)
  ahrefs: process.env.AHREFS_API_KEY || 'your-ahrefs-api-key-here'
};

// API配置
export const apiConfig = {
  semrush: {
    baseURL: 'https://api.semrush.com/',
    requestsPerMinute: 100,
    timeout: 30000
  },
  similarweb: {
    baseURL: 'https://api.similarweb.com/',
    requestsPerMinute: 50,
    timeout: 30000
  }
};
`;

    // 分析配置
    const analysisConfigTemplate = `/**
 * 市场情报分析配置
 */

export const analysisConfig = {
  // 默认分析阈值
  defaultThresholds: {
    traffic: 50000,           // 最小月访问量
    engagement: 180,          // 最小平均停留时间(秒)
    bounceRate: 40,          // 最大跳出率(%)
    valueScore: 60           // 最小价值分数
  },

  // 速率限制配置
  rateLimits: {
    semrush: { 
      requests: 100, 
      window: 60000,         // 1分钟
      burst: 10              // 突发请求数
    },
    similarweb: { 
      requests: 50, 
      window: 60000 
    }
  },

  // 缓存配置
  caching: {
    ttl: 3600,               // 缓存时间(秒)
    maxSize: 1000,           // 最大缓存条目数
    enabled: true
  },

  // 分析配置
  analysis: {
    maxDomainsPerBatch: 100,  // 每批次最大域名数
    maxConcurrentRequests: 5, // 最大并发请求数
    retryAttempts: 3,        // 重试次数
    retryDelay: 1000         // 重试延迟(毫秒)
  },

  // 支付关键词库
  paymentKeywords: [
    'payment gateway', 'checkout process', 'billing system',
    'subscription platform', 'payment processor', 'online payment',
    'stripe checkout', 'paypal integration', 'square payment',
    'e-commerce platform', 'saas billing', 'subscription management'
  ],

  // 支付页面识别模式
  paymentPagePatterns: [
    'checkout', 'payment', 'billing', 'subscribe',
    'buy-now', 'purchase', 'order', 'cart',
    'pricing', 'plans', 'upgrade', 'premium'
  ]
};
`;

    // 写入配置文件
    fs.writeFileSync(
      path.join(projectRoot, 'config/api-keys.example.js'), 
      apiKeysTemplate
    );
    
    fs.writeFileSync(
      path.join(projectRoot, 'config/analysis-config.js'), 
      analysisConfigTemplate
    );

    console.log('✅ 配置文件创建完成');
  }

  async createUtilityClasses() {
    console.log('🔧 创建工具类...');

    // 速率限制器
    const rateLimiterCode = `/**
 * API请求速率限制器
 */

export class RateLimiter {
  constructor(requestsPerWindow = 100, windowMs = 60000) {
    this.requestsPerWindow = requestsPerWindow;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  async wait(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // 清理过期请求
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const requestTimes = this.requests.get(identifier);
    const validRequests = requestTimes.filter(time => time > windowStart);
    
    if (validRequests.length >= this.requestsPerWindow) {
      const oldestRequest = Math.min(...validRequests);
      const waitTime = oldestRequest + this.windowMs - now;
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // 记录当前请求
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
  }

  getRequestCount(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requestTimes = this.requests.get(identifier) || [];
    
    return requestTimes.filter(time => time > windowStart).length;
  }

  getRemainingRequests(identifier = 'default') {
    return Math.max(0, this.requestsPerWindow - this.getRequestCount(identifier));
  }
}
`;

    // 缓存管理器
    const cacheManagerCode = `/**
 * 内存缓存管理器
 */

export class CacheManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 3600; // 默认1小时
    this.maxSize = options.maxSize || 1000;
    this.enabled = options.enabled !== false;
  }

  async get(key) {
    if (!this.enabled) return null;
    
    const item = this.cache.get(key);
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key, value, ttl = this.ttl) {
    if (!this.enabled) return;
    
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000)
    });
  }

  async delete(key) {
    this.cache.delete(key);
  }

  async clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      enabled: this.enabled
    };
  }
}
`;

    // 写入工具类文件
    fs.writeFileSync(
      path.join(projectRoot, 'src/modules/market-intelligence/utils/rate-limiter.js'),
      rateLimiterCode
    );

    fs.writeFileSync(
      path.join(projectRoot, 'src/modules/market-intelligence/utils/cache-manager.js'),
      cacheManagerCode
    );

    console.log('✅ 工具类创建完成');
  }

  async createExampleFiles() {
    console.log('📄 创建示例文件...');

    // 测试脚本
    const testScript = `#!/usr/bin/env node

/**
 * 市场情报分析模块测试脚本
 */

import { PaymentFlowAnalyzer } from '../src/modules/market-intelligence/analyzers/payment-flow-analyzer.js';
import { apiKeys } from '../config/api-keys.js';

async function testMarketIntelligence() {
  console.log('🧪 测试市场情报分析模块...');
  
  try {
    // 初始化分析器
    const analyzer = new PaymentFlowAnalyzer({
      semrushApiKey: apiKeys.semrush,
      similarwebApiKey: apiKeys.similarweb
    });

    // 测试域名分析
    console.log('🔍 测试域名分析...');
    const testDomain = 'stripe.com';
    const analysis = await analyzer.analyzeDomainValue(testDomain);
    
    console.log('✅ 域名分析结果:');
    console.log(\`  域名: \${analysis.domain}\`);
    console.log(\`  价值分数: \${analysis.valueScore}\`);
    console.log(\`  有支付流程: \${analysis.hasPaymentFlow ? '是' : '否'}\`);
    
    console.log('\\n🎉 测试完成！模块工作正常。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\\n💡 请检查:');
    console.log('1. API密钥是否正确配置');
    console.log('2. 网络连接是否正常');
    console.log('3. API配额是否充足');
  }
}

testMarketIntelligence();
`;

    fs.writeFileSync(
      path.join(projectRoot, 'scripts/market-intelligence/test-module.js'),
      testScript
    );

    console.log('✅ 示例文件创建完成');
  }

  async updatePackageScripts() {
    console.log('📝 更新package.json脚本...');

    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // 添加市场情报相关脚本
    const newScripts = {
      'market-intelligence:test': 'node scripts/market-intelligence/test-module.js',
      'market-intelligence:discover': 'node scripts/market-intelligence/domain-discovery.js',
      'market-intelligence:analyze': 'node scripts/market-intelligence/batch-analysis.js'
    };

    packageJson.scripts = {
      ...packageJson.scripts,
      ...newScripts
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json脚本更新完成');
  }

  async createDocumentation() {
    console.log('📚 创建文档...');

    // 功能概览文档
    const overviewDoc = `---
title: "市场情报分析功能概览"
description: "Semrush高级分析功能的完整介绍"
type: "docs"
category: "04-features"
doc_type: "overview"
order: 1
version: "1.0"
created: "2025-06-08"
lastModified: "2025-06-08"
author: "项目团队"
maintainer: "维护者名称"
status: "active"
difficulty: "intermediate"

cascade:
  - type: docs
  - show_breadcrumb: true
  - show_toc: true
  - show_edit_link: true
  - show_last_modified: true
---

# 🎯 市场情报分析功能概览

## 功能介绍

市场情报分析模块集成了Semrush等专业工具的API，提供强大的市场分析能力。

## 核心功能

### 1. 支付流量发现
- 自动发现高价值支付相关域名
- 基于关键词和流量数据的智能筛选
- 多维度价值评估

### 2. 用户行为分析
- 深度分析用户访问路径
- 识别转化关键点
- 评估用户参与度

### 3. 竞争对手分析
- 发现竞争对手的支付策略
- 分析市场机会
- 监控行业趋势

## 快速开始

\`\`\`bash
# 1. 配置API密钥
cp config/api-keys.example.js config/api-keys.js

# 2. 测试模块
npm run market-intelligence:test

# 3. 开始分析
npm run market-intelligence:discover
\`\`\`

## 更多信息

- [API集成指南](api-integration.md)
- [分析工作流](analysis-workflows.md)
- [数据模型](data-models.md)
`;

    fs.writeFileSync(
      path.join(projectRoot, 'docs/04-features/market-intelligence/OVERVIEW.md'),
      overviewDoc
    );

    console.log('✅ 文档创建完成');
  }
}

// 执行安装
const setup = new MarketIntelligenceSetup();
setup.install().catch(console.error);
