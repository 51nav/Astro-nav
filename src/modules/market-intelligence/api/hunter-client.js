/**
 * Hunter API 客户端
 * 
 * 提供对 Hunter.io API 的完整访问，包括:
 * - 域名邮箱搜索
 * - 邮箱验证
 * - 联系人信息查找
 * - 邮箱查找器
 */

import fetch from 'node-fetch';
import { RateLimiter } from '../utils/rate-limiter.js';

export class HunterClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.hunter.io/v2/';
    this.rateLimiter = new RateLimiter(
      options.requestsPerMinute || 100,
      60000
    );
    
    // API端点配置
    this.endpoints = {
      domainSearch: 'domain-search',
      emailFinder: 'email-finder',
      emailVerifier: 'email-verifier',
      emailCount: 'email-count',
      account: 'account'
    };

    // 决策者角色关键词
    this.decisionMakerRoles = [
      // C-Level
      'ceo', 'cto', 'cfo', 'coo', 'cmo', 'chief',
      
      // VP Level
      'vp', 'vice president', 'v.p.',
      
      // Director Level
      'director', 'head of', 'lead',
      
      // Founder/Owner
      'founder', 'co-founder', 'owner', 'president',
      
      // Department Heads
      'ecommerce', 'digital', 'technology', 'product',
      'engineering', 'development', 'marketing', 'sales',
      
      // Manager Level (for smaller companies)
      'manager', 'senior manager'
    ];

    // 邮箱置信度阈值
    this.confidenceThresholds = {
      high: 90,
      medium: 70,
      low: 50
    };
  }

  /**
   * 搜索域名下的所有邮箱
   */
  async domainSearch(domain, options = {}) {
    const {
      limit = 100,
      offset = 0,
      type = 'personal',
      seniority = null,
      department = null
    } = options;

    await this.rateLimiter.wait();

    const params = new URLSearchParams({
      api_key: this.apiKey,
      domain: domain,
      limit: limit,
      offset: offset,
      type: type
    });

    if (seniority) params.append('seniority', seniority);
    if (department) params.append('department', department);

    const url = `${this.baseURL}${this.endpoints.domainSearch}?${params}`;

    try {
      const response = await this.makeRequest(url);
      
      if (response.data) {
        return {
          domain: response.data.domain,
          disposable: response.data.disposable,
          webmail: response.data.webmail,
          acceptAll: response.data.accept_all,
          pattern: response.data.pattern,
          organization: response.data.organization,
          emails: response.data.emails || [],
          emailsCount: response.data.emails ? response.data.emails.length : 0,
          totalEmails: response.meta?.results || 0
        };
      }
      
      return { emails: [], emailsCount: 0 };
    } catch (error) {
      console.error(`搜索 ${domain} 邮箱失败:`, error.message);
      return { emails: [], emailsCount: 0 };
    }
  }

  /**
   * 查找特定人员的邮箱
   */
  async findEmail(domain, firstName, lastName, options = {}) {
    const {
      fullName = null,
      position = null
    } = options;

    await this.rateLimiter.wait();

    const params = new URLSearchParams({
      api_key: this.apiKey,
      domain: domain,
      first_name: firstName,
      last_name: lastName
    });

    if (fullName) params.append('full_name', fullName);
    if (position) params.append('position', position);

    const url = `${this.baseURL}${this.endpoints.emailFinder}?${params}`;

    try {
      const response = await this.makeRequest(url);
      
      if (response.data) {
        return {
          email: response.data.email,
          score: response.data.score,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          position: response.data.position,
          twitter: response.data.twitter,
          linkedinUrl: response.data.linkedin_url,
          phoneNumber: response.data.phone_number,
          company: response.data.company,
          sources: response.data.sources || []
        };
      }
      
      return null;
    } catch (error) {
      console.error(`查找 ${firstName} ${lastName} 在 ${domain} 的邮箱失败:`, error.message);
      return null;
    }
  }

  /**
   * 验证邮箱地址
   */
  async verifyEmail(email) {
    await this.rateLimiter.wait();

    const params = new URLSearchParams({
      api_key: this.apiKey,
      email: email
    });

    const url = `${this.baseURL}${this.endpoints.emailVerifier}?${params}`;

    try {
      const response = await this.makeRequest(url);
      
      if (response.data) {
        return {
          result: response.data.result,        // deliverable, undeliverable, risky, unknown
          score: response.data.score,          // 0-100
          email: response.data.email,
          regexp: response.data.regexp,
          gibberish: response.data.gibberish,
          disposable: response.data.disposable,
          webmail: response.data.webmail,
          mxRecords: response.data.mx_records,
          smtp: {
            server: response.data.smtp_server,
            check: response.data.smtp_check
          },
          acceptAll: response.data.accept_all,
          block: response.data.block,
          sources: response.data.sources || []
        };
      }
      
      return null;
    } catch (error) {
      console.error(`验证邮箱 ${email} 失败:`, error.message);
      return null;
    }
  }

  /**
   * 获取域名邮箱数量
   */
  async getEmailCount(domain) {
    await this.rateLimiter.wait();

    const params = new URLSearchParams({
      api_key: this.apiKey,
      domain: domain
    });

    const url = `${this.baseURL}${this.endpoints.emailCount}?${params}`;

    try {
      const response = await this.makeRequest(url);
      
      if (response.data) {
        return {
          total: response.data.total,
          personal: response.data.personal,
          generic: response.data.generic
        };
      }
      
      return { total: 0, personal: 0, generic: 0 };
    } catch (error) {
      console.error(`获取 ${domain} 邮箱数量失败:`, error.message);
      return { total: 0, personal: 0, generic: 0 };
    }
  }

  /**
   * 查找决策者联系人
   */
  async findDecisionMakers(domain, options = {}) {
    const {
      maxResults = 20,
      verifyEmails = true,
      includeSocial = false
    } = options;

    console.log(`🔍 查找 ${domain} 的决策者联系人...`);

    try {
      // 1. 搜索域名下的所有邮箱
      const domainSearch = await this.domainSearch(domain, {
        limit: 100,
        type: 'personal'
      });

      if (!domainSearch.emails || domainSearch.emails.length === 0) {
        console.log(`❌ ${domain} 未找到任何邮箱`);
        return [];
      }

      console.log(`📧 找到 ${domainSearch.emails.length} 个邮箱`);

      // 2. 筛选决策者
      const decisionMakers = this.filterDecisionMakers(domainSearch.emails);
      console.log(`👥 筛选出 ${decisionMakers.length} 个潜在决策者`);

      if (decisionMakers.length === 0) {
        return [];
      }

      // 3. 限制结果数量
      const limitedResults = decisionMakers.slice(0, maxResults);

      // 4. 验证邮箱（可选）
      if (verifyEmails) {
        console.log(`✅ 验证 ${limitedResults.length} 个邮箱...`);
        
        for (const contact of limitedResults) {
          try {
            const verification = await this.verifyEmail(contact.email);
            if (verification) {
              contact.verification = verification;
              contact.deliverable = verification.result === 'deliverable';
              contact.confidence = verification.score;
            }
          } catch (error) {
            console.error(`验证邮箱 ${contact.email} 失败:`, error.message);
            contact.deliverable = false;
            contact.confidence = contact.confidence || 50;
          }
        }
      }

      // 5. 添加社交媒体信息（可选）
      if (includeSocial) {
        for (const contact of limitedResults) {
          contact.socialProfiles = this.generateSocialProfiles(contact, domain);
        }
      }

      // 6. 按置信度排序
      const sortedContacts = limitedResults.sort((a, b) => {
        const scoreA = a.confidence || a.score || 50;
        const scoreB = b.confidence || b.score || 50;
        return scoreB - scoreA;
      });

      console.log(`🎯 最终返回 ${sortedContacts.length} 个高质量决策者联系人`);
      return sortedContacts;

    } catch (error) {
      console.error(`查找 ${domain} 决策者失败:`, error.message);
      return [];
    }
  }

  /**
   * 筛选决策者
   */
  filterDecisionMakers(emails) {
    return emails.filter(email => {
      const position = (email.position || '').toLowerCase();
      const firstName = (email.first_name || '').toLowerCase();
      const lastName = (email.last_name || '').toLowerCase();
      const emailAddress = (email.value || '').toLowerCase();
      
      // 检查职位是否包含决策者关键词
      const hasDecisionMakerRole = this.decisionMakerRoles.some(role => 
        position.includes(role) || 
        firstName.includes(role) || 
        lastName.includes(role) ||
        emailAddress.includes(role)
      );

      // 排除明显的非决策者
      const excludeRoles = ['intern', 'assistant', 'support', 'hr', 'admin'];
      const isExcluded = excludeRoles.some(role => 
        position.includes(role) || emailAddress.includes(role)
      );

      return hasDecisionMakerRole && !isExcluded;
    }).map(email => ({
      email: email.value,
      firstName: email.first_name,
      lastName: email.last_name,
      position: email.position,
      department: email.department,
      confidence: email.confidence || 50,
      score: email.score || 50,
      sources: email.sources || [],
      type: email.type,
      seniority: email.seniority
    }));
  }

  /**
   * 生成社交媒体档案链接
   */
  generateSocialProfiles(contact, domain) {
    const firstName = contact.firstName || '';
    const lastName = contact.lastName || '';
    const company = domain.split('.')[0];

    return {
      linkedin: `https://linkedin.com/in/${firstName}-${lastName}`,
      twitter: `https://twitter.com/${firstName}${lastName}`,
      github: `https://github.com/${firstName}${lastName}`,
      // 注意：这些是推测的链接，实际使用中需要验证
      verified: false
    };
  }

  /**
   * 批量验证邮箱
   */
  async batchVerifyEmails(emails, options = {}) {
    const {
      concurrency = 3,
      delay = 1000
    } = options;

    console.log(`✅ 批量验证 ${emails.length} 个邮箱...`);
    
    const results = [];
    const batches = this.createBatches(emails, concurrency);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📊 验证批次 ${i + 1}/${batches.length} (${batch.length} 个邮箱)`);

      const batchPromises = batch.map(async (email) => {
        try {
          const verification = await this.verifyEmail(email);
          return {
            email,
            verification,
            success: true
          };
        } catch (error) {
          return {
            email,
            error: error.message,
            success: false
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

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ 邮箱验证完成: ${successCount}/${emails.length} 成功`);
    
    return results;
  }

  /**
   * 获取账户信息
   */
  async getAccountInfo() {
    await this.rateLimiter.wait();

    const params = new URLSearchParams({
      api_key: this.apiKey
    });

    const url = `${this.baseURL}${this.endpoints.account}?${params}`;

    try {
      const response = await this.makeRequest(url);
      
      if (response.data) {
        return {
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
          planName: response.data.plan_name,
          planLevel: response.data.plan_level,
          resetDate: response.data.reset_date,
          teamId: response.data.team_id,
          calls: {
            used: response.data.calls.used,
            available: response.data.calls.available
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('获取账户信息失败:', error.message);
      return null;
    }
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
        throw new Error(`Hunter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 检查API错误
      if (data.errors && data.errors.length > 0) {
        throw new Error(`Hunter API error: ${data.errors[0].details}`);
      }

      return data;
    } catch (error) {
      console.error('Hunter API request failed:', error);
      throw error;
    }
  }

  /**
   * 验证API密钥
   */
  async validateApiKey() {
    try {
      const accountInfo = await this.getAccountInfo();
      return accountInfo !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取API使用统计
   */
  async getApiUsage() {
    const accountInfo = await this.getAccountInfo();
    
    return {
      requestsUsed: accountInfo?.calls?.used || 0,
      requestsAvailable: accountInfo?.calls?.available || 0,
      resetDate: accountInfo?.resetDate,
      planName: accountInfo?.planName
    };
  }
}

export default HunterClient;
