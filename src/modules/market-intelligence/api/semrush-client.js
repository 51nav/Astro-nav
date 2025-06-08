/**
 * Semrush API 客户端
 * 
 * 提供对Semrush各种API端点的访问，包括:
 * - 域名分析
 * - 关键词研究  
 * - 反向链接分析
 * - 流量分析
 * - 竞争对手分析
 */

import fetch from 'node-fetch';
import { RateLimiter } from '../utils/rate-limiter.js';

export class SemrushClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.semrush.com/';
    this.rateLimiter = new RateLimiter(
      options.requestsPerMinute || 100,
      60000
    );
    
    // API端点配置
    this.endpoints = {
      analytics: 'analytics/ta/api/v3/',
      backlinks: 'analytics/ba/api/v3/',
      keywords: 'analytics/ka/api/v3/',
      advertising: 'analytics/ad/api/v3/'
    };

    // 数据库映射
    this.databases = {
      global: 'us',
      us: 'us',
      uk: 'uk',
      ca: 'ca',
      au: 'au',
      de: 'de',
      fr: 'fr',
      es: 'es',
      it: 'it',
      br: 'br',
      ru: 'ru',
      jp: 'jp',
      cn: 'cn'
    };
  }

  /**
   * 关键词研究 - 发现相关域名
   */
  async keywordResearch(params) {
    const {
      keyword,
      database = 'us',
      limit = 100,
      offset = 0
    } = params;

    await this.rateLimiter.wait();

    const queryParams = new URLSearchParams({
      type: 'phrase_organic',
      key: this.apiKey,
      phrase: keyword,
      database: this.databases[database] || database,
      display_limit: limit,
      display_offset: offset,
      export_columns: 'Ph,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td'
    });

    const url = `${this.baseURL}${this.endpoints.analytics}?${queryParams}`;
    const response = await this.makeRequest(url);
    
    return this.parseCSVResponse(response);
  }

  /**
   * 域名概览分析
   */
  async getDomainOverview(domain, database = 'us') {
    await this.rateLimiter.wait();

    const queryParams = new URLSearchParams({
      type: 'domain_overview',
      key: this.apiKey,
      domain: domain,
      database: this.databases[database] || database,
      export_columns: 'Dn,Rk,Or,Ot,Oc,Ad,At,Ac,FKn,FPn'
    });

    const url = `${this.baseURL}${this.endpoints.analytics}?${queryParams}`;
    const response = await this.makeRequest(url);
    const data = this.parseCSVResponse(response);

    if (data.length > 0) {
      const row = data[0];
      return {
        domain: row.Dn,
        rank: parseInt(row.Rk) || 0,
        organicKeywords: parseInt(row.Or) || 0,
        organicTraffic: parseInt(row.Ot) || 0,
        organicCost: parseFloat(row.Oc) || 0,
        adKeywords: parseInt(row.Ad) || 0,
        adTraffic: parseInt(row.At) || 0,
        adCost: parseFloat(row.Ac) || 0
      };
    }

    return null;
  }

  /**
   * 获取流量分析数据
   */
  async getTrafficAnalytics(domain, database = 'us') {
    await this.rateLimiter.wait();

    const queryParams = new URLSearchParams({
      type: 'domain_organic',
      key: this.apiKey,
      domain: domain,
      database: this.databases[database] || database,
      display_limit: 10,
      export_columns: 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td'
    });

    const url = `${this.baseURL}${this.endpoints.analytics}?${queryParams}`;
    const response = await this.makeRequest(url);
    const data = this.parseCSVResponse(response);

    // 聚合流量数据
    const totalTraffic = data.reduce((sum, row) => {
      return sum + (parseInt(row.Tr) || 0);
    }, 0);

    const avgPosition = data.length > 0 ? 
      data.reduce((sum, row) => sum + (parseFloat(row.Po) || 0), 0) / data.length : 0;

    return {
      domain,
      monthlyVisits: totalTraffic,
      avgPosition: avgPosition,
      totalKeywords: data.length,
      topKeywords: data.slice(0, 5).map(row => ({
        keyword: row.Ph,
        position: parseInt(row.Po) || 0,
        traffic: parseInt(row.Tr) || 0,
        cpc: parseFloat(row.Cp) || 0
      }))
    };
  }

  /**
   * 获取热门页面
   */
  async getTopPages(domain, database = 'us') {
    await this.rateLimiter.wait();

    const queryParams = new URLSearchParams({
      type: 'domain_organic',
      key: this.apiKey,
      domain: domain,
      database: this.databases[database] || database,
      display_limit: 50,
      export_columns: 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td'
    });

    const url = `${this.baseURL}${this.endpoints.analytics}?${queryParams}`;
    const response = await this.makeRequest(url);
    const data = this.parseCSVResponse(response);

    // 按URL分组并聚合流量
    const pageTraffic = {};
    data.forEach(row => {
      const url = row.Ur;
      if (url) {
        if (!pageTraffic[url]) {
          pageTraffic[url] = {
            url,
            traffic: 0,
            keywords: [],
            avgPosition: 0
          };
        }
        pageTraffic[url].traffic += parseInt(row.Tr) || 0;
        pageTraffic[url].keywords.push({
          keyword: row.Ph,
          position: parseInt(row.Po) || 0,
          traffic: parseInt(row.Tr) || 0
        });
      }
    });

    // 转换为数组并排序
    const topPages = Object.values(pageTraffic)
      .map(page => ({
        ...page,
        avgPosition: page.keywords.reduce((sum, kw) => sum + kw.position, 0) / page.keywords.length,
        keywordCount: page.keywords.length
      }))
      .sort((a, b) => b.traffic - a.traffic)
      .slice(0, 20);

    return topPages;
  }

  /**
   * 获取反向链接数据
   */
  async getBacklinks(domain) {
    await this.rateLimiter.wait();

    const queryParams = new URLSearchParams({
      type: 'backlinks_overview',
      key: this.apiKey,
      target: domain,
      target_type: 'root_domain',
      export_columns: 'total,domains_num,urls_num,ips_num,ipclassc_num,follows_num,nofollows_num,sponsored_num,ugc_num,texts_num,images_num,forms_num,frames_num'
    });

    const url = `${this.baseURL}${this.endpoints.backlinks}?${queryParams}`;
    const response = await this.makeRequest(url);
    const data = this.parseCSVResponse(response);

    if (data.length > 0) {
      const row = data[0];
      return {
        totalBacklinks: parseInt(row.total) || 0,
        referringDomains: parseInt(row.domains_num) || 0,
        referringUrls: parseInt(row.urls_num) || 0,
        referringIPs: parseInt(row.ips_num) || 0,
        followLinks: parseInt(row.follows_num) || 0,
        nofollowLinks: parseInt(row.nofollows_num) || 0,
        textLinks: parseInt(row.texts_num) || 0,
        imageLinks: parseInt(row.images_num) || 0
      };
    }

    return {
      totalBacklinks: 0,
      referringDomains: 0,
      referringUrls: 0,
      referringIPs: 0,
      followLinks: 0,
      nofollowLinks: 0,
      textLinks: 0,
      imageLinks: 0
    };
  }

  /**
   * 获取引荐流量数据
   */
  async getReferralTraffic(domain, database = 'us') {
    await this.rateLimiter.wait();

    const queryParams = new URLSearchParams({
      type: 'domain_organic',
      key: this.apiKey,
      domain: domain,
      database: this.databases[database] || database,
      display_limit: 100,
      export_columns: 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td'
    });

    const url = `${this.baseURL}${this.endpoints.analytics}?${queryParams}`;
    const response = await this.makeRequest(url);
    const data = this.parseCSVResponse(response);

    // 分析引荐来源
    const referralSources = {};
    data.forEach(row => {
      const keyword = row.Ph;
      const traffic = parseInt(row.Tr) || 0;
      
      if (keyword && traffic > 0) {
        // 简单的来源分类
        let source = 'organic_search';
        if (keyword.includes('brand') || keyword.includes(domain.split('.')[0])) {
          source = 'branded_search';
        }
        
        if (!referralSources[source]) {
          referralSources[source] = 0;
        }
        referralSources[source] += traffic;
      }
    });

    return {
      totalReferralTraffic: Object.values(referralSources).reduce((sum, traffic) => sum + traffic, 0),
      sources: referralSources,
      topReferralKeywords: data
        .sort((a, b) => (parseInt(b.Tr) || 0) - (parseInt(a.Tr) || 0))
        .slice(0, 10)
        .map(row => ({
          keyword: row.Ph,
          traffic: parseInt(row.Tr) || 0,
          position: parseInt(row.Po) || 0
        }))
    };
  }

  /**
   * 获取有机关键词数据
   */
  async getOrganicKeywords(domain, database = 'us', limit = 100) {
    await this.rateLimiter.wait();

    const queryParams = new URLSearchParams({
      type: 'domain_organic',
      key: this.apiKey,
      domain: domain,
      database: this.databases[database] || database,
      display_limit: limit,
      export_columns: 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td'
    });

    const url = `${this.baseURL}${this.endpoints.analytics}?${queryParams}`;
    const response = await this.makeRequest(url);
    const data = this.parseCSVResponse(response);

    return data.map(row => ({
      keyword: row.Ph,
      position: parseInt(row.Po) || 0,
      previousPosition: parseInt(row.Pp) || 0,
      searchVolume: parseInt(row.Nq) || 0,
      cpc: parseFloat(row.Cp) || 0,
      url: row.Ur,
      traffic: parseInt(row.Tr) || 0,
      trafficCost: parseFloat(row.Tc) || 0,
      competition: parseFloat(row.Co) || 0
    }));
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
          'Accept': 'text/csv'
        },
        timeout: 30000
      });

      if (!response.ok) {
        throw new Error(`Semrush API error: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      
      // 检查是否是错误响应
      if (text.includes('ERROR')) {
        throw new Error(`Semrush API error: ${text}`);
      }

      return text;
    } catch (error) {
      console.error('Semrush API request failed:', error);
      throw error;
    }
  }

  /**
   * 解析CSV响应
   */
  parseCSVResponse(csvText) {
    if (!csvText || csvText.trim() === '') {
      return [];
    }

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return [];
    }

    const headers = lines[0].split(';');
    
    return lines.slice(1).map(line => {
      const values = line.split(';');
      const obj = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      return obj;
    });
  }

  /**
   * 验证API密钥
   */
  async validateApiKey() {
    try {
      await this.getDomainOverview('google.com');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取API使用统计
   */
  async getApiUsage() {
    // Semrush没有直接的API使用统计端点
    // 这里返回本地统计信息
    return {
      requestsToday: this.rateLimiter.getRequestCount(),
      remainingRequests: this.rateLimiter.getRemainingRequests(),
      resetTime: this.rateLimiter.getResetTime()
    };
  }
}

export default SemrushClient;
