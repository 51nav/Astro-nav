/**
 * 技术栈分析器
 * 
 * 基于 BuiltWith API 分析网站技术栈，识别支付能力和商业价值
 */

import { BuiltWithClient } from '../api/builtwith-client.js';
import { HunterClient } from '../api/hunter-client.js';
import { WhoisClient } from '../api/whois-client.js';
import { CacheManager } from '../utils/cache-manager.js';
import { RateLimiter } from '../utils/rate-limiter.js';

export class TechStackAnalyzer {
  constructor(config = {}) {
    this.builtwith = new BuiltWithClient(config.builtwithApiKey);
    this.hunter = new HunterClient(config.hunterApiKey);
    this.whois = new WhoisClient(config.whoisApiKey);
    this.cache = new CacheManager(config.cache);
    this.rateLimiter = new RateLimiter(config.rateLimit);
    
    // 支付技术栈分类
    this.paymentTechnologies = {
      processors: {
        'Stripe': { weight: 10, sophistication: 9 },
        'PayPal': { weight: 8, sophistication: 7 },
        'Square': { weight: 7, sophistication: 8 },
        'Adyen': { weight: 9, sophistication: 9 },
        'Braintree': { weight: 8, sophistication: 8 },
        'Worldpay': { weight: 7, sophistication: 7 },
        'Authorize.Net': { weight: 6, sophistication: 6 },
        'Klarna': { weight: 8, sophistication: 8 },
        'Afterpay': { weight: 7, sophistication: 7 }
      },
      
      platforms: {
        'Shopify': { weight: 9, sophistication: 8 },
        'WooCommerce': { weight: 7, sophistication: 6 },
        'Magento': { weight: 8, sophistication: 7 },
        'BigCommerce': { weight: 8, sophistication: 8 },
        'Salesforce Commerce': { weight: 10, sophistication: 10 },
        'PrestaShop': { weight: 6, sophistication: 5 }
      },
      
      subscription: {
        'Recurly': { weight: 9, sophistication: 9 },
        'Chargebee': { weight: 9, sophistication: 9 },
        'Zuora': { weight: 10, sophistication: 10 },
        'Paddle': { weight: 8, sophistication: 8 },
        'FastSpring': { weight: 7, sophistication: 7 },
        'Chargify': { weight: 7, sophistication: 7 }
      },
      
      crypto: {
        'Coinbase Commerce': { weight: 8, sophistication: 9 },
        'BitPay': { weight: 7, sophistication: 8 },
        'CoinGate': { weight: 6, sophistication: 7 }
      }
    };

    // 高价值技术指标
    this.sophisticatedTech = {
      analytics: ['Google Analytics 4', 'Mixpanel', 'Amplitude', 'Segment'],
      marketing: ['HubSpot', 'Marketo', 'Pardot', 'Intercom'],
      infrastructure: ['AWS', 'Google Cloud', 'Azure', 'Cloudflare'],
      development: ['React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js']
    };
  }

  /**
   * 发现使用特定支付技术的域名
   */
  async discoverPaymentDomains(criteria = {}) {
    const {
      technologies = ['Stripe', 'PayPal'],
      minTechScore = 70,
      includeContacts = true,
      maxResults = 500,
      country = 'US'
    } = criteria;

    console.log('🔍 基于技术栈发现支付域名...');
    console.log(`📊 目标技术: ${technologies.join(', ')}`);
    
    const discoveredDomains = new Set();
    const analysisResults = [];

    // 1. 通过 BuiltWith 查找使用特定技术的网站
    for (const tech of technologies) {
      try {
        await this.rateLimiter.wait('builtwith');
        
        const sites = await this.builtwith.findSitesUsingTechnology(tech, {
          limit: Math.floor(maxResults / technologies.length),
          country: country
        });

        sites.forEach(site => {
          if (!discoveredDomains.has(site.domain)) {
            discoveredDomains.add(site.domain);
          }
        });

        console.log(`📈 技术 "${tech}" 发现 ${sites.length} 个网站`);
        
      } catch (error) {
        console.error(`查找技术 "${tech}" 失败:`, error.message);
      }
    }

    console.log(`🎯 总共发现 ${discoveredDomains.size} 个候选域名`);

    // 2. 分析每个域名的完整技术栈和商业价值
    const domainArray = Array.from(discoveredDomains);
    
    for (let i = 0; i < domainArray.length; i++) {
      const domain = domainArray[i];
      
      try {
        console.log(`🔍 分析域名 ${i + 1}/${domainArray.length}: ${domain}`);
        
        const analysis = await this.analyzeCompleteDomainProfile(domain, {
          includeContacts
        });
        
        // 应用过滤条件
        if (analysis.techScore >= minTechScore && analysis.hasPaymentCapability) {
          analysisResults.push({
            domain,
            ...analysis,
            discoveryMethod: 'tech_stack_analysis'
          });
          
          console.log(`✅ 高价值域名: ${domain} (分数: ${analysis.techScore})`);
        }
        
      } catch (error) {
        console.error(`分析域名 ${domain} 失败:`, error.message);
      }
    }

    // 3. 按综合价值排序
    analysisResults.sort((a, b) => b.comprehensiveScore - a.comprehensiveScore);
    
    console.log(`🎉 发现 ${analysisResults.length} 个高价值支付域名`);
    return analysisResults;
  }

  /**
   * 分析单个域名的完整档案
   */
  async analyzeCompleteDomainProfile(domain, options = {}) {
    const { includeContacts = false } = options;
    
    const cacheKey = `complete_profile_${domain}_${includeContacts}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    console.log(`🔍 完整分析域名: ${domain}`);

    // 并行获取多维度数据
    const dataPromises = [
      this.analyzeTechStack(domain),
      this.analyzeDomainIntelligence(domain)
    ];

    if (includeContacts) {
      dataPromises.push(this.findDecisionMakers(domain));
    }

    const [techAnalysis, domainIntel, contacts] = await Promise.allSettled(dataPromises);

    const profile = {
      domain,
      techStack: this.extractValue(techAnalysis),
      domainIntelligence: this.extractValue(domainIntel),
      contacts: includeContacts ? this.extractValue(contacts) : null,
      analyzedAt: new Date().toISOString()
    };

    // 计算各种分数
    profile.techScore = this.calculateTechSophistication(profile.techStack);
    profile.hasPaymentCapability = this.detectPaymentCapability(profile.techStack);
    profile.businessMaturity = this.assessBusinessMaturity(profile.domainIntelligence);
    profile.contactability = this.assessContactability(profile.contacts);
    profile.comprehensiveScore = this.calculateComprehensiveScore(profile);

    // 生成洞察和建议
    profile.insights = this.generateInsights(profile);
    profile.recommendations = this.generateRecommendations(profile);

    // 缓存结果
    await this.cache.set(cacheKey, profile, 7200); // 缓存2小时
    
    return profile;
  }

  /**
   * 分析技术栈
   */
  async analyzeTechStack(domain) {
    await this.rateLimiter.wait('builtwith');
    
    const technologies = await this.builtwith.getTechnologies(domain);
    
    return {
      allTechnologies: technologies,
      paymentTech: this.extractPaymentTechnologies(technologies),
      ecommercePlatform: this.extractEcommercePlatform(technologies),
      analyticsTools: this.extractAnalyticsTools(technologies),
      marketingStack: this.extractMarketingStack(technologies),
      infrastructure: this.extractInfrastructure(technologies),
      developmentStack: this.extractDevelopmentStack(technologies)
    };
  }

  /**
   * 分析域名情报
   */
  async analyzeDomainIntelligence(domain) {
    await this.rateLimiter.wait('whois');
    
    const whoisData = await this.whois.getDomainInfo(domain);
    
    const registrationDate = new Date(whoisData.creationDate);
    const now = new Date();
    const ageInYears = (now - registrationDate) / (1000 * 60 * 60 * 24 * 365);

    return {
      age: Math.round(ageInYears * 10) / 10,
      registrar: whoisData.registrar,
      registrant: whoisData.registrant,
      hasPrivacyProtection: this.detectPrivacyProtection(whoisData),
      expirationDate: whoisData.expirationDate,
      lastUpdated: whoisData.updatedDate,
      maturityStage: this.inferMaturityStage(ageInYears),
      businessProfile: this.inferBusinessProfile(whoisData)
    };
  }

  /**
   * 发现决策者联系人
   */
  async findDecisionMakers(domain) {
    await this.rateLimiter.wait('hunter');
    
    try {
      const domainSearch = await this.hunter.domainSearch(domain, {
        limit: 50,
        type: 'personal'
      });

      if (!domainSearch.emails || domainSearch.emails.length === 0) {
        return [];
      }

      // 筛选决策者
      const decisionMakers = this.filterDecisionMakers(domainSearch.emails);
      
      // 验证邮箱（限制数量以节省配额）
      const validatedContacts = [];
      const maxValidations = Math.min(decisionMakers.length, 5);
      
      for (let i = 0; i < maxValidations; i++) {
        const contact = decisionMakers[i];
        try {
          await this.rateLimiter.wait('hunter');
          const verification = await this.hunter.verifyEmail(contact.email);
          
          if (verification.result === 'deliverable') {
            validatedContacts.push({
              ...contact,
              confidence: verification.score,
              verified: true
            });
          }
        } catch (error) {
          // 验证失败，但保留联系人信息
          validatedContacts.push({
            ...contact,
            confidence: contact.confidence || 50,
            verified: false
          });
        }
      }

      return validatedContacts.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error(`获取 ${domain} 联系人失败:`, error.message);
      return [];
    }
  }

  /**
   * 提取支付技术
   */
  extractPaymentTechnologies(technologies) {
    const paymentTech = [];
    
    Object.entries(this.paymentTechnologies).forEach(([category, techs]) => {
      Object.keys(techs).forEach(tech => {
        if (technologies.some(t => t.name === tech)) {
          paymentTech.push({
            name: tech,
            category,
            ...techs[tech]
          });
        }
      });
    });
    
    return paymentTech;
  }

  /**
   * 检测支付能力
   */
  detectPaymentCapability(techStack) {
    if (!techStack || !techStack.paymentTech) return false;
    
    return techStack.paymentTech.length > 0 || 
           (techStack.ecommercePlatform && techStack.ecommercePlatform.length > 0);
  }

  /**
   * 计算技术成熟度分数
   */
  calculateTechSophistication(techStack) {
    if (!techStack) return 0;
    
    let score = 0;
    let maxScore = 0;
    
    // 支付技术分数 (40%)
    if (techStack.paymentTech) {
      const paymentScore = techStack.paymentTech.reduce((sum, tech) => 
        sum + tech.sophistication, 0
      );
      score += paymentScore * 4; // 权重 40%
      maxScore += 40;
    }
    
    // 分析工具分数 (20%)
    if (techStack.analyticsTools) {
      const analyticsScore = techStack.analyticsTools.length * 5;
      score += Math.min(analyticsScore, 20);
      maxScore += 20;
    }
    
    // 营销工具分数 (20%)
    if (techStack.marketingStack) {
      const marketingScore = techStack.marketingStack.length * 5;
      score += Math.min(marketingScore, 20);
      maxScore += 20;
    }
    
    // 基础设施分数 (20%)
    if (techStack.infrastructure) {
      const infraScore = techStack.infrastructure.length * 5;
      score += Math.min(infraScore, 20);
      maxScore += 20;
    }
    
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }

  /**
   * 计算综合价值分数
   */
  calculateComprehensiveScore(profile) {
    const weights = {
      techSophistication: 0.30,
      businessMaturity: 0.25,
      contactability: 0.25,
      paymentCapability: 0.20
    };

    const scores = {
      techSophistication: profile.techScore || 0,
      businessMaturity: this.scoreBusinessMaturity(profile.domainIntelligence),
      contactability: this.scoreContactability(profile.contacts),
      paymentCapability: profile.hasPaymentCapability ? 100 : 0
    };

    const finalScore = Object.entries(weights).reduce((total, [metric, weight]) => {
      return total + (scores[metric] * weight);
    }, 0);

    return Math.round(finalScore);
  }

  /**
   * 筛选决策者
   */
  filterDecisionMakers(emails) {
    const decisionMakerRoles = [
      'cto', 'ceo', 'founder', 'vp', 'director',
      'head of', 'chief', 'president', 'owner',
      'ecommerce', 'digital', 'technology', 'product'
    ];

    return emails.filter(email => {
      const position = (email.position || '').toLowerCase();
      const firstName = (email.first_name || '').toLowerCase();
      const lastName = (email.last_name || '').toLowerCase();
      
      return decisionMakerRoles.some(role => 
        position.includes(role) || 
        firstName.includes(role) || 
        lastName.includes(role)
      );
    }).map(email => ({
      email: email.value,
      firstName: email.first_name,
      lastName: email.last_name,
      position: email.position,
      department: email.department,
      confidence: email.confidence || 50,
      sources: email.sources
    }));
  }

  /**
   * 生成洞察
   */
  generateInsights(profile) {
    const insights = [];

    // 技术栈洞察
    if (profile.techScore > 80) {
      insights.push({
        type: 'tech_sophistication',
        priority: 'high',
        message: '技术栈非常成熟，表明公司有强大的技术团队',
        recommendation: '适合推广高级技术解决方案'
      });
    }

    // 支付能力洞察
    if (profile.hasPaymentCapability) {
      const paymentTech = profile.techStack?.paymentTech || [];
      insights.push({
        type: 'payment_capability',
        priority: 'high',
        message: `已集成 ${paymentTech.length} 种支付技术`,
        recommendation: '可以推广支付优化或新支付方式'
      });
    }

    // 联系人洞察
    if (profile.contacts && profile.contacts.length > 0) {
      insights.push({
        type: 'contactability',
        priority: 'medium',
        message: `发现 ${profile.contacts.length} 个决策者联系方式`,
        recommendation: '可以直接进行商务拓展'
      });
    }

    return insights;
  }

  /**
   * 提取Promise结果值
   */
  extractValue(promiseResult) {
    return promiseResult.status === 'fulfilled' ? promiseResult.value : null;
  }

  // 其他辅助方法...
  scoreBusinessMaturity(domainIntel) {
    if (!domainIntel) return 0;
    
    const age = domainIntel.age || 0;
    if (age < 1) return 20;
    if (age < 3) return 50;
    if (age < 7) return 80;
    return 100;
  }

  scoreContactability(contacts) {
    if (!contacts || contacts.length === 0) return 0;
    
    const avgConfidence = contacts.reduce((sum, c) => sum + c.confidence, 0) / contacts.length;
    return Math.round(avgConfidence);
  }
}

export default TechStackAnalyzer;
