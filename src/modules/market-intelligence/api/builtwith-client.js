/**
 * BuiltWith API 客户端
 * 
 * 提供对 BuiltWith API 的完整访问，包括:
 * - 域名技术栈分析
 * - 技术使用趋势
 * - 竞争对手技术对比
 * - 技术采用历史
 */

import fetch from 'node-fetch';
import { RateLimiter } from '../utils/rate-limiter.js';

export class BuiltWithClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.builtwith.com/';
    this.rateLimiter = new RateLimiter(
      options.requestsPerMinute || 200,
      60000
    );
    
    // API端点配置
    this.endpoints = {
      domain: 'v21/api.json',           // 域名技术栈
      trends: 'trends/v1/api.json',     // 技术趋势
      lists: 'lists/v3/api.json',       // 技术使用列表
      keywords: 'kw1/api.json',         // 关键词分析
      social: 'social1/api.json'        // 社交媒体分析
    };

    // 技术分类映射
    this.techCategories = {
      'Payment Processors': 'payment',
      'Ecommerce': 'ecommerce',
      'Analytics and Tracking': 'analytics',
      'Marketing Automation': 'marketing',
      'Content Management System': 'cms',
      'JavaScript Frameworks': 'frontend',
      'Web Servers': 'infrastructure',
      'CDN': 'infrastructure',
      'Email Hosting Providers': 'email'
    };
  }

  /**
   * 获取域名的完整技术栈
   */
  async getTechnologies(domain) {
    await this.rateLimiter.wait();

    const url = `${this.baseURL}${this.endpoints.domain}`;
    const params = new URLSearchParams({
      KEY: this.apiKey,
      LOOKUP: domain,
      NOMETA: '1',
      NOATTR: '1'
    });

    try {
      const response = await this.makeRequest(`${url}?${params}`);
      
      if (response.Results && response.Results.length > 0) {
        const result = response.Results[0];
        return this.parseTechnologies(result.Result);
      }
      
      return [];
    } catch (error) {
      console.error(`获取 ${domain} 技术栈失败:`, error.message);
      return [];
    }
  }

  /**
   * 查找使用特定技术的网站
   */
  async findSitesUsingTechnology(technology, options = {}) {
    const {
      limit = 100,
      country = 'US',
      minRank = 1000000,
      maxRank = 1
    } = options;

    await this.rateLimiter.wait();

    const url = `${this.baseURL}${this.endpoints.lists}`;
    const params = new URLSearchParams({
      KEY: this.apiKey,
      TECH: technology,
      LIMIT: limit,
      COUNTRY: country,
      MINRANK: minRank,
      MAXRANK: maxRank
    });

    try {
      const response = await this.makeRequest(`${url}?${params}`);
      
      if (response.Results && response.Results.length > 0) {
        return response.Results.map(result => ({
          domain: result.Domain,
          rank: result.Rank,
          firstDetected: result.FirstIndexed,
          lastSeen: result.LastSeen,
          country: result.Country,
          spend: result.Spend
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`查找使用 ${technology} 的网站失败:`, error.message);
      return [];
    }
  }

  /**
   * 获取技术使用趋势
   */
  async getTechnologyTrends(technology, options = {}) {
    const {
      period = '6m',
      country = 'US'
    } = options;

    await this.rateLimiter.wait();

    const url = `${this.baseURL}${this.endpoints.trends}`;
    const params = new URLSearchParams({
      KEY: this.apiKey,
      TECH: technology,
      PERIOD: period,
      COUNTRY: country
    });

    try {
      const response = await this.makeRequest(`${url}?${params}`);
      
      if (response.Trends) {
        return {
          technology,
          period,
          trends: response.Trends.map(trend => ({
            date: trend.Date,
            websites: trend.Websites,
            change: trend.Change
          }))
        };
      }
      
      return null;
    } catch (error) {
      console.error(`获取 ${technology} 趋势失败:`, error.message);
      return null;
    }
  }

  /**
   * 批量分析多个域名
   */
  async batchAnalyzeDomains(domains, options = {}) {
    const {
      concurrency = 5,
      delay = 1000
    } = options;

    console.log(`🔍 批量分析 ${domains.length} 个域名...`);
    
    const results = [];
    const batches = this.createBatches(domains, concurrency);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📊 处理批次 ${i + 1}/${batches.length} (${batch.length} 个域名)`);

      const batchPromises = batch.map(async (domain) => {
        try {
          const technologies = await this.getTechnologies(domain);
          return {
            domain,
            technologies,
            success: true,
            analyzedAt: new Date().toISOString()
          };
        } catch (error) {
          return {
            domain,
            error: error.message,
            success: false,
            analyzedAt: new Date().toISOString()
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(r => r.value || r.reason));

      // 批次间延迟
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`✅ 批量分析完成: ${results.filter(r => r.success).length}/${domains.length} 成功`);
    return results;
  }

  /**
   * 获取竞争对手技术对比
   */
  async compareCompetitors(domains) {
    console.log(`🔍 对比 ${domains.length} 个竞争对手的技术栈...`);

    const analyses = await this.batchAnalyzeDomains(domains);
    const comparison = {
      domains: domains,
      technologies: {},
      summary: {
        totalTechnologies: 0,
        commonTechnologies: [],
        uniqueTechnologies: {},
        technologyOverlap: {}
      }
    };

    // 分析技术使用情况
    analyses.forEach(analysis => {
      if (analysis.success && analysis.technologies) {
        analysis.technologies.forEach(tech => {
          if (!comparison.technologies[tech.name]) {
            comparison.technologies[tech.name] = {
              name: tech.name,
              category: tech.category,
              usedBy: [],
              usage: 0
            };
          }
          
          comparison.technologies[tech.name].usedBy.push(analysis.domain);
          comparison.technologies[tech.name].usage++;
        });
      }
    });

    // 计算总结信息
    const techList = Object.values(comparison.technologies);
    comparison.summary.totalTechnologies = techList.length;
    
    // 找出共同技术 (被50%以上域名使用)
    const threshold = Math.ceil(domains.length * 0.5);
    comparison.summary.commonTechnologies = techList
      .filter(tech => tech.usage >= threshold)
      .map(tech => tech.name);

    // 找出独特技术 (只被一个域名使用)
    domains.forEach(domain => {
      comparison.summary.uniqueTechnologies[domain] = techList
        .filter(tech => tech.usage === 1 && tech.usedBy.includes(domain))
        .map(tech => tech.name);
    });

    return comparison;
  }

  /**
   * 获取支付技术采用报告
   */
  async getPaymentTechReport(options = {}) {
    const {
      country = 'US',
      limit = 1000,
      minRank = 100000
    } = options;

    const paymentTechnologies = [
      'Stripe', 'PayPal', 'Square', 'Adyen', 'Braintree',
      'Worldpay', 'Authorize.Net', 'Klarna', 'Afterpay'
    ];

    console.log('📊 生成支付技术采用报告...');

    const report = {
      generatedAt: new Date().toISOString(),
      country,
      technologies: {},
      summary: {
        totalSites: 0,
        topTechnologies: [],
        growthTrends: {}
      }
    };

    // 分析每种支付技术
    for (const tech of paymentTechnologies) {
      try {
        console.log(`🔍 分析 ${tech} 使用情况...`);

        const [sites, trends] = await Promise.all([
          this.findSitesUsingTechnology(tech, { country, limit, minRank }),
          this.getTechnologyTrends(tech, { country })
        ]);

        report.technologies[tech] = {
          name: tech,
          sitesCount: sites.length,
          sites: sites.slice(0, 50), // 只保留前50个
          trends: trends,
          marketShare: 0 // 稍后计算
        };

        report.summary.totalSites += sites.length;

      } catch (error) {
        console.error(`分析 ${tech} 失败:`, error.message);
        report.technologies[tech] = {
          name: tech,
          sitesCount: 0,
          sites: [],
          trends: null,
          error: error.message
        };
      }
    }

    // 计算市场份额
    Object.values(report.technologies).forEach(tech => {
      if (tech.sitesCount > 0) {
        tech.marketShare = Math.round((tech.sitesCount / report.summary.totalSites) * 100 * 100) / 100;
      }
    });

    // 生成排行榜
    report.summary.topTechnologies = Object.values(report.technologies)
      .filter(tech => tech.sitesCount > 0)
      .sort((a, b) => b.sitesCount - a.sitesCount)
      .slice(0, 10)
      .map(tech => ({
        name: tech.name,
        sitesCount: tech.sitesCount,
        marketShare: tech.marketShare
      }));

    console.log('✅ 支付技术报告生成完成');
    return report;
  }

  /**
   * 解析技术栈数据
   */
  parseTechnologies(result) {
    const technologies = [];

    if (result.Paths && result.Paths.length > 0) {
      result.Paths.forEach(path => {
        if (path.Technologies && path.Technologies.length > 0) {
          path.Technologies.forEach(tech => {
            technologies.push({
              name: tech.Name,
              category: this.techCategories[tech.Categories?.[0]?.Name] || 'other',
              firstDetected: tech.FirstDetected,
              lastDetected: tech.LastDetected,
              isDead: tech.IsDead || false,
              categories: tech.Categories?.map(cat => cat.Name) || []
            });
          });
        }
      });
    }

    // 去重
    const uniqueTech = technologies.reduce((acc, tech) => {
      const existing = acc.find(t => t.name === tech.name);
      if (!existing) {
        acc.push(tech);
      }
      return acc;
    }, []);

    return uniqueTech;
  }

  /**
   * 创建批次
   */
  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * 发起HTTP请求
   */
  async makeRequest(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'MarketIntelligence/1.0',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      if (!response.ok) {
        throw new Error(`BuiltWith API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 检查API错误
      if (data.Errors && data.Errors.length > 0) {
        throw new Error(`BuiltWith API error: ${data.Errors[0].Message}`);
      }

      return data;
    } catch (error) {
      console.error('BuiltWith API request failed:', error);
      throw error;
    }
  }

  /**
   * 验证API密钥
   */
  async validateApiKey() {
    try {
      await this.getTechnologies('google.com');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取API使用统计
   */
  async getApiUsage() {
    return {
      requestsToday: this.rateLimiter.getRequestCount(),
      remainingRequests: this.rateLimiter.getRemainingRequests(),
      resetTime: this.rateLimiter.getResetTime()
    };
  }
}

export default BuiltWithClient;
