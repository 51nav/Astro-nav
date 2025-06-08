/**
 * 支付流量分析器
 * 
 * 核心功能:
 * 1. 发现高价值支付相关域名
 * 2. 分析用户支付流程和行为
 * 3. 识别转化关键点和优化机会
 */

import { SemrushClient } from '../api/semrush-client.js';
import { SimilarWebClient } from '../api/similarweb-client.js';
import { CacheManager } from '../utils/cache-manager.js';
import { RateLimiter } from '../utils/rate-limiter.js';

export class PaymentFlowAnalyzer {
  constructor(config = {}) {
    this.semrush = new SemrushClient(config.semrushApiKey);
    this.similarweb = new SimilarWebClient(config.similarwebApiKey);
    this.cache = new CacheManager(config.cache);
    this.rateLimiter = new RateLimiter(config.rateLimit);
    
    // 支付相关关键词库
    this.paymentKeywords = [
      // 通用支付关键词
      'payment gateway', 'checkout process', 'billing system',
      'subscription platform', 'payment processor', 'online payment',
      
      // 特定支付服务
      'stripe checkout', 'paypal integration', 'square payment',
      'adyen payment', 'worldpay gateway', 'braintree payment',
      
      // 电商和SaaS
      'e-commerce platform', 'saas billing', 'subscription management',
      'recurring payment', 'one-time payment', 'payment form',
      
      // 行业特定
      'fintech payment', 'crypto payment', 'mobile payment',
      'b2b payment', 'marketplace payment', 'affiliate payment'
    ];
    
    // 支付页面识别模式
    this.paymentPagePatterns = [
      /checkout/i, /payment/i, /billing/i, /subscribe/i,
      /buy-now/i, /purchase/i, /order/i, /cart/i,
      /pricing/i, /plans/i, /upgrade/i, /premium/i
    ];
  }

  /**
   * 发现高价值支付域名
   */
  async discoverPaymentDomains(criteria = {}) {
    const {
      trafficThreshold = 50000,
      engagementThreshold = 180,
      geoTargets = ['us', 'global'],
      industries = ['all'],
      maxResults = 1000
    } = criteria;

    console.log('🔍 开始发现支付相关域名...');
    
    const discoveredDomains = new Set();
    const analysisResults = [];

    // 1. 基于关键词的域名发现
    for (const keyword of this.paymentKeywords) {
      try {
        await this.rateLimiter.wait('semrush');
        
        const keywordData = await this.semrush.keywordResearch({
          keyword,
          database: geoTargets[0],
          limit: 100
        });

        // 提取相关域名
        keywordData.forEach(item => {
          if (item.domain && !discoveredDomains.has(item.domain)) {
            discoveredDomains.add(item.domain);
          }
        });

        console.log(`📊 关键词 "${keyword}" 发现 ${keywordData.length} 个相关域名`);
        
      } catch (error) {
        console.error(`关键词 "${keyword}" 分析失败:`, error.message);
      }
    }

    // 2. 批量分析发现的域名
    console.log(`🎯 开始分析 ${discoveredDomains.size} 个候选域名...`);
    
    const domainArray = Array.from(discoveredDomains).slice(0, maxResults);
    
    for (const domain of domainArray) {
      try {
        const analysis = await this.analyzeDomainValue(domain);
        
        // 应用过滤条件
        if (this.meetsValueCriteria(analysis, {
          trafficThreshold,
          engagementThreshold
        })) {
          analysisResults.push({
            domain,
            ...analysis,
            discoveryMethod: 'keyword_research'
          });
        }
        
      } catch (error) {
        console.error(`域名 ${domain} 分析失败:`, error.message);
      }
    }

    // 3. 按价值排序
    analysisResults.sort((a, b) => b.valueScore - a.valueScore);
    
    console.log(`✅ 发现 ${analysisResults.length} 个高价值支付域名`);
    return analysisResults;
  }

  /**
   * 分析单个域名的商业价值
   */
  async analyzeDomainValue(domain) {
    const cacheKey = `domain_analysis_${domain}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    console.log(`🔍 分析域名: ${domain}`);

    // 并行获取多维度数据
    const [trafficData, engagementData, backlinksData, pagesData] = await Promise.allSettled([
      this.getTrafficAnalytics(domain),
      this.getEngagementMetrics(domain),
      this.getBacklinksAnalysis(domain),
      this.getTopPagesAnalysis(domain)
    ]);

    const analysis = {
      domain,
      traffic: this.extractValue(trafficData),
      engagement: this.extractValue(engagementData),
      backlinks: this.extractValue(backlinksData),
      pages: this.extractValue(pagesData),
      analyzedAt: new Date().toISOString()
    };

    // 计算综合价值分数
    analysis.valueScore = this.calculateValueScore(analysis);
    analysis.hasPaymentFlow = this.detectPaymentFlow(analysis);
    analysis.conversionPotential = this.assessConversionPotential(analysis);

    // 缓存结果
    await this.cache.set(cacheKey, analysis, 3600); // 缓存1小时
    
    return analysis;
  }

  /**
   * 深度分析支付流程
   */
  async analyzePaymentFlow(domain) {
    console.log(`💰 深度分析支付流程: ${domain}`);

    const [
      userJourney,
      conversionFunnel,
      paymentMethods,
      competitorAnalysis
    ] = await Promise.allSettled([
      this.analyzeUserJourney(domain),
      this.buildConversionFunnel(domain),
      this.identifyPaymentMethods(domain),
      this.analyzeCompetitors(domain)
    ]);

    return {
      domain,
      userJourney: this.extractValue(userJourney),
      conversionFunnel: this.extractValue(conversionFunnel),
      paymentMethods: this.extractValue(paymentMethods),
      competitors: this.extractValue(competitorAnalysis),
      insights: this.generateFlowInsights(domain, {
        userJourney: this.extractValue(userJourney),
        conversionFunnel: this.extractValue(conversionFunnel)
      })
    };
  }

  /**
   * 分析用户访问路径
   */
  async analyzeUserJourney(domain) {
    const [referrals, topPages, searchTerms] = await Promise.all([
      this.semrush.getReferralTraffic(domain),
      this.semrush.getTopPages(domain),
      this.semrush.getOrganicKeywords(domain)
    ]);

    // 识别关键路径
    const entryPoints = this.identifyEntryPoints(referrals, searchTerms);
    const navigationFlow = this.analyzeNavigationFlow(topPages);
    const exitPoints = this.identifyExitPoints(referrals);

    return {
      entryPoints,
      navigationFlow,
      exitPoints,
      criticalPaths: this.identifyCriticalPaths(entryPoints, navigationFlow, exitPoints)
    };
  }

  /**
   * 构建转化漏斗
   */
  async buildConversionFunnel(domain) {
    const pages = await this.semrush.getTopPages(domain);
    
    // 按页面类型分类
    const pageTypes = {
      landing: [],
      product: [],
      pricing: [],
      checkout: [],
      confirmation: []
    };

    pages.forEach(page => {
      const pageType = this.classifyPageType(page.url);
      if (pageTypes[pageType]) {
        pageTypes[pageType].push(page);
      }
    });

    // 计算漏斗转化率
    const funnelSteps = [
      { name: 'Landing', pages: pageTypes.landing },
      { name: 'Product', pages: pageTypes.product },
      { name: 'Pricing', pages: pageTypes.pricing },
      { name: 'Checkout', pages: pageTypes.checkout },
      { name: 'Confirmation', pages: pageTypes.confirmation }
    ];

    return {
      steps: funnelSteps,
      conversionRates: this.calculateConversionRates(funnelSteps),
      bottlenecks: this.identifyBottlenecks(funnelSteps),
      optimizationOpportunities: this.identifyOptimizationOpportunities(funnelSteps)
    };
  }

  /**
   * 识别支付方式
   */
  async identifyPaymentMethods(domain) {
    const pages = await this.semrush.getTopPages(domain);
    const paymentIndicators = {
      stripe: /stripe/i,
      paypal: /paypal/i,
      square: /square/i,
      adyen: /adyen/i,
      braintree: /braintree/i,
      worldpay: /worldpay/i,
      cryptocurrency: /crypto|bitcoin|ethereum/i,
      applePay: /apple.?pay/i,
      googlePay: /google.?pay/i
    };

    const detectedMethods = {};
    
    pages.forEach(page => {
      Object.entries(paymentIndicators).forEach(([method, pattern]) => {
        if (pattern.test(page.url) || pattern.test(page.title)) {
          detectedMethods[method] = (detectedMethods[method] || 0) + 1;
        }
      });
    });

    return {
      methods: Object.keys(detectedMethods),
      confidence: this.calculatePaymentMethodConfidence(detectedMethods),
      diversity: Object.keys(detectedMethods).length,
      modernPayments: this.hasModernPaymentMethods(detectedMethods)
    };
  }

  /**
   * 计算域名价值分数
   */
  calculateValueScore(analysis) {
    const weights = {
      traffic: 0.3,
      engagement: 0.25,
      paymentFlow: 0.2,
      backlinks: 0.15,
      conversionPotential: 0.1
    };

    let score = 0;

    // 流量分数 (0-100)
    if (analysis.traffic?.monthlyVisits) {
      score += Math.min(analysis.traffic.monthlyVisits / 1000000 * 100, 100) * weights.traffic;
    }

    // 参与度分数 (0-100)
    if (analysis.engagement?.avgSessionDuration) {
      score += Math.min(analysis.engagement.avgSessionDuration / 300 * 100, 100) * weights.engagement;
    }

    // 支付流程分数 (0-100)
    if (analysis.hasPaymentFlow) {
      score += 100 * weights.paymentFlow;
    }

    // 反向链接分数 (0-100)
    if (analysis.backlinks?.totalBacklinks) {
      score += Math.min(analysis.backlinks.totalBacklinks / 10000 * 100, 100) * weights.backlinks;
    }

    // 转化潜力分数 (0-100)
    score += (analysis.conversionPotential || 0) * weights.conversionPotential;

    return Math.round(score);
  }

  /**
   * 检测是否有支付流程
   */
  detectPaymentFlow(analysis) {
    if (!analysis.pages?.topPages) return false;

    return analysis.pages.topPages.some(page => 
      this.paymentPagePatterns.some(pattern => 
        pattern.test(page.url) || pattern.test(page.title || '')
      )
    );
  }

  /**
   * 评估转化潜力
   */
  assessConversionPotential(analysis) {
    let potential = 0;

    // 基于参与度指标
    if (analysis.engagement) {
      if (analysis.engagement.avgSessionDuration > 180) potential += 25;
      if (analysis.engagement.pagesPerSession > 3) potential += 20;
      if (analysis.engagement.bounceRate < 40) potential += 25;
      if (analysis.engagement.returnVisitorRate > 30) potential += 30;
    }

    return Math.min(potential, 100);
  }

  /**
   * 检查是否满足价值标准
   */
  meetsValueCriteria(analysis, criteria) {
    const { trafficThreshold, engagementThreshold } = criteria;

    return (
      analysis.traffic?.monthlyVisits >= trafficThreshold &&
      analysis.engagement?.avgSessionDuration >= engagementThreshold &&
      analysis.hasPaymentFlow &&
      analysis.valueScore >= 60
    );
  }

  /**
   * 获取流量分析数据
   */
  async getTrafficAnalytics(domain) {
    await this.rateLimiter.wait('semrush');
    return await this.semrush.getTrafficAnalytics(domain);
  }

  /**
   * 获取用户参与度数据
   */
  async getEngagementMetrics(domain) {
    await this.rateLimiter.wait('similarweb');
    return await this.similarweb.getEngagementMetrics(domain);
  }

  /**
   * 获取反向链接分析
   */
  async getBacklinksAnalysis(domain) {
    await this.rateLimiter.wait('semrush');
    return await this.semrush.getBacklinks(domain);
  }

  /**
   * 获取热门页面分析
   */
  async getTopPagesAnalysis(domain) {
    await this.rateLimiter.wait('semrush');
    return await this.semrush.getTopPages(domain);
  }

  /**
   * 提取Promise结果值
   */
  extractValue(promiseResult) {
    return promiseResult.status === 'fulfilled' ? promiseResult.value : null;
  }

  /**
   * 生成流程洞察
   */
  generateFlowInsights(domain, data) {
    const insights = [];

    // 分析用户路径优化机会
    if (data.userJourney?.criticalPaths) {
      insights.push({
        type: 'user_journey',
        priority: 'high',
        message: `发现 ${data.userJourney.criticalPaths.length} 个关键用户路径`,
        recommendation: '优化关键路径以提高转化率'
      });
    }

    // 分析转化漏斗瓶颈
    if (data.conversionFunnel?.bottlenecks?.length > 0) {
      insights.push({
        type: 'conversion_bottleneck',
        priority: 'high',
        message: `检测到 ${data.conversionFunnel.bottlenecks.length} 个转化瓶颈`,
        recommendation: '重点优化瓶颈环节以提升整体转化率'
      });
    }

    return insights;
  }
}

export default PaymentFlowAnalyzer;
