/**
 * 修正CSV格式脚本
 * 将现有的CSV文件修正为符合设计标准的格式
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDataDir = path.join(projectRoot, 'src', 'data');

/**
 * 修正网站CSV格式
 */
function fixSitesCSV() {
  console.log('🔧 修正网站CSV格式...');
  
  const sitesPath = path.join(srcDataDir, 'sites.csv');
  const csvContent = fs.readFileSync(sitesPath, 'utf8');
  
  // 解析CSV
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true
  });
  
  console.log(`📊 读取到 ${result.data.length} 行数据`);
  
  // 修正数据
  const fixedData = result.data.map((row, index) => {
    // 修正menuId - 如果为空，根据上下文推断
    let menuId = row.menuId || '';
    if (!menuId) {
      // 根据网站名称推断menuId
      const title = row.title || '';
      if (title.includes('Binom') || title.includes('Voluum') || title.includes('FunnelFlux')) {
        menuId = 'tracking';
      } else if (title.includes('Adplexity') || title.includes('Anstrex') || title.includes('BigSpy')) {
        menuId = 'spy';
      } else if (title.includes('PropellerAds') || title.includes('Zeropark') || title.includes('Popads')) {
        menuId = 'traffic-pop';
      } else if (title.includes('MGID') || title.includes('Taboola') || title.includes('Outbrain')) {
        menuId = 'traffic-native';
      } else if (title.includes('Facebook') || title.includes('TikTok') || title.includes('Twitter')) {
        menuId = 'traffic-social';
      } else if (title.includes('Google') || title.includes('Bing') || title.includes('Yandex')) {
        menuId = 'traffic-search';
      } else if (title.includes('TrafficFactory') || title.includes('Exoclick') || title.includes('JuicyAds')) {
        menuId = 'traffic-adult';
      } else if (title.includes('Push') || title.includes('RichAds') || title.includes('Megapu')) {
        menuId = 'traffic-push';
      } else if (title.includes('CJ') || title.includes('Rakuten') || title.includes('Shareasale')) {
        menuId = 'networks';
      } else if (title.includes('PerformCB') || title.includes('Maxbounty') || title.includes('ClickDealer')) {
        menuId = 'cpa';
      } else if (title.includes('Forum') || title.includes('forum')) {
        menuId = 'forum';
      } else if (title.includes('SEMRush') || title.includes('Ahrefs') || title.includes('Moz')) {
        menuId = 'seo';
      } else if (title.includes('Mailgun') || title.includes('Sendgrid') || title.includes('Mailchimp')) {
        menuId = 'email';
      } else if (title.includes('Amazon') || title.includes('eBay') || title.includes('Shopify')) {
        menuId = 'ecommerce';
      } else if (title.includes('GetCake') || title.includes('Tune') || title.includes('Affise')) {
        menuId = 'backend';
      } else if (title.includes('Dynadot') || title.includes('Namecheap') || title.includes('Godaddy')) {
        menuId = 'domain';
      } else if (title.includes('Vultr') || title.includes('DigitalOcean') || title.includes('Linode')) {
        menuId = 'hosting';
      } else if (title.includes('Paxum') || title.includes('Payoneer') || title.includes('Wise')) {
        menuId = 'payment';
      } else if (title.includes('911') || title.includes('代理') || title.includes('VPS')) {
        menuId = 'vps';
      } else if (title.includes('Instapage') || title.includes('Unbounce') || title.includes('Leadpages')) {
        menuId = 'tools';
      } else {
        console.warn(`⚠️ 无法推断 menuId: ${title} (行 ${index + 2})`);
        menuId = 'other';
      }
    }
    
    // 处理related字段 - 转换为relatedTitles和relatedDescriptions
    let relatedTitles = '';
    let relatedDescriptions = '';
    
    if (row.related) {
      try {
        const relatedData = JSON.parse(row.related);
        if (Array.isArray(relatedData)) {
          relatedTitles = relatedData.map(item => item.title || '').join(';');
          relatedDescriptions = relatedData.map(item => item.description || '').join(';');
        }
      } catch (error) {
        // 如果不是JSON，可能是其他格式，保持为空
      }
    }
    
    // 返回修正后的数据
    return {
      menuId: menuId,
      title: row.title || '',
      description: row.description || '',
      url: row.url || '',
      logo: row.logo || '',
      advantages: row.advantages || '',
      features: row.features || '',
      intro: row.intro || '',
      pricing: row.pricing || '',
      pros: row.pros || '',
      cons: row.cons || '',
      tips: row.tips || '',
      relatedTitles: relatedTitles,
      relatedDescriptions: relatedDescriptions,
      sortOrder: index + 1  // 按原始顺序排序
    };
  });
  
  // 生成新的CSV内容
  const headers = [
    'menuId', 'title', 'description', 'url', 'logo', 
    'advantages', 'features', 'intro', 'pricing', 
    'pros', 'cons', 'tips', 'relatedTitles', 'relatedDescriptions', 'sortOrder'
  ];
  
  const csvLines = [headers.join(',')];
  
  fixedData.forEach(row => {
    const line = headers.map(header => {
      const value = String(row[header] || '');
      // 转义CSV字段
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    }).join(',');
    csvLines.push(line);
  });
  
  // 写入修正后的文件
  fs.writeFileSync(sitesPath, csvLines.join('\n'), 'utf8');
  
  console.log('✅ 网站CSV格式修正完成');
  console.log(`📊 处理了 ${fixedData.length} 行数据`);
  
  // 统计menuId分布
  const menuIdStats = {};
  fixedData.forEach(row => {
    const menuId = row.menuId;
    menuIdStats[menuId] = (menuIdStats[menuId] || 0) + 1;
  });
  
  console.log('📋 menuId分布:');
  Object.entries(menuIdStats).forEach(([menuId, count]) => {
    console.log(`   - ${menuId}: ${count} 个网站`);
  });
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 CSV格式修正工具');
  
  try {
    fixSitesCSV();
    
    console.log('');
    console.log('🎉 CSV格式修正完成！');
    console.log('📋 修正内容:');
    console.log('   ✅ 添加了 relatedTitles 和 relatedDescriptions 字段');
    console.log('   ✅ 移除了 related 字段');
    console.log('   ✅ 添加了 sortOrder 字段');
    console.log('   ✅ 修正了空的 menuId');
    console.log('');
    console.log('🔧 现在CSV格式符合设计标准了！');
    
  } catch (error) {
    console.error('❌ 修正失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 执行主函数
main();
