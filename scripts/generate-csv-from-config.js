/**
 * 从现有的 config.json 生成 CSV 文件
 * 用于测试 CSV 构建流程
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const staticDir = path.join(projectRoot, 'static');
const srcDataDir = path.join(projectRoot, 'src', 'data');

/**
 * 转义CSV字段中的特殊字符
 */
function escapeCSVField(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const str = String(value);
  
  // 如果包含逗号、引号或换行符，需要用引号包围并转义内部引号
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  
  return str;
}

/**
 * 数组转换为分号分隔的字符串
 */
function arrayToString(arr) {
  if (!Array.isArray(arr)) return '';
  return arr.join(';');
}

/**
 * 对象转换为JSON字符串
 */
function objectToString(obj) {
  if (!obj || typeof obj !== 'object') return '';
  return JSON.stringify(obj);
}

/**
 * 生成菜单CSV
 */
function generateMenuCSV(config) {
  console.log('🔄 生成菜单CSV...');
  
  const menuRows = [];
  let sortOrder = 1;
  
  // 处理顶级菜单
  config.menuItems.forEach(item => {
    menuRows.push({
      menuId: item.name.toLowerCase().replace(/\s+/g, '-'),
      menuName: item.name,
      parentMenuId: '',
      menuIcon: item.icon || 'mdi:folder',
      sortOrder: sortOrder++
    });
    
    // 处理子菜单
    if (item.submenu && Array.isArray(item.submenu)) {
      let subSortOrder = 1;
      item.submenu.forEach(subItem => {
        menuRows.push({
          menuId: subItem.name.toLowerCase().replace(/\s+/g, '-'),
          menuName: subItem.name,
          parentMenuId: item.name.toLowerCase().replace(/\s+/g, '-'),
          menuIcon: subItem.icon || 'mdi:folder',
          sortOrder: subSortOrder++
        });
      });
    }
  });
  
  // 生成CSV内容
  const headers = ['menuId', 'menuName', 'parentMenuId', 'menuIcon', 'sortOrder'];
  const csvLines = [headers.join(',')];
  
  menuRows.forEach(row => {
    const line = headers.map(header => escapeCSVField(row[header])).join(',');
    csvLines.push(line);
  });
  
  return csvLines.join('\n');
}

/**
 * 生成网站CSV
 */
function generateSitesCSV(config) {
  console.log('🔄 生成网站CSV...');
  
  const siteRows = [];
  
  // 处理所有菜单项
  config.menuItems.forEach(item => {
    const menuId = item.name.toLowerCase().replace(/\s+/g, '-');
    
    // 处理单级菜单的网站
    if (item.sites && Array.isArray(item.sites)) {
      item.sites.forEach(site => {
        siteRows.push(processSite(site, menuId));
      });
    }
    
    // 处理子菜单的网站
    if (item.submenu && Array.isArray(item.submenu)) {
      item.submenu.forEach(subItem => {
        const subMenuId = subItem.name.toLowerCase().replace(/\s+/g, '-');
        if (subItem.sites && Array.isArray(subItem.sites)) {
          subItem.sites.forEach(site => {
            siteRows.push(processSite(site, subMenuId));
          });
        }
      });
    }
  });
  
  // 生成CSV内容
  const headers = [
    'menuId', 'title', 'description', 'url', 'logo', 
    'advantages', 'features', 'intro', 'pricing', 
    'pros', 'cons', 'tips', 'related'
  ];
  const csvLines = [headers.join(',')];
  
  siteRows.forEach(row => {
    const line = headers.map(header => escapeCSVField(row[header])).join(',');
    csvLines.push(line);
  });
  
  return csvLines.join('\n');
}

/**
 * 处理单个网站数据
 */
function processSite(site, menuId) {
  const siteData = {
    menuId: menuId,
    title: site.title || '',
    description: site.description || '',
    url: site.url || '',
    logo: site.logo || '',
    advantages: arrayToString(site.advantages),
    features: arrayToString(site.features),
    intro: '',
    pricing: '',
    pros: '',
    cons: '',
    tips: '',
    related: ''
  };
  
  // 处理详细信息
  if (site.details) {
    siteData.intro = site.details.intro || '';
    siteData.pricing = site.details.pricing || '';
    siteData.pros = arrayToString(site.details.pros);
    siteData.cons = arrayToString(site.details.cons);
    siteData.tips = arrayToString(site.details.tips);
  }
  
  // 处理相关网站
  if (site.related && Array.isArray(site.related)) {
    siteData.related = objectToString(site.related);
  }
  
  return siteData;
}

/**
 * 生成网站信息JSON
 */
function generateSiteInfoJSON(config) {
  console.log('🔄 生成网站信息JSON...');
  
  return {
    title: config.site.title || "导航网站",
    description: config.site.description || "专业的导航平台",
    logoText: config.site.logo?.text || "Nav"
  };
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 从 config.json 生成 CSV 文件');
  
  try {
    // 1. 读取现有配置
    const configPath = path.join(staticDir, 'config.json');
    if (!fs.existsSync(configPath)) {
      console.error('❌ static/config.json 不存在');
      process.exit(1);
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('✅ 读取配置文件成功');
    
    // 2. 确保目标目录存在
    if (!fs.existsSync(srcDataDir)) {
      fs.mkdirSync(srcDataDir, { recursive: true });
      console.log('📁 创建目录: src/data/');
    }
    
    // 3. 生成菜单CSV
    const menuCSV = generateMenuCSV(config);
    const menuPath = path.join(srcDataDir, 'menu.csv');
    fs.writeFileSync(menuPath, menuCSV, 'utf8');
    console.log('✅ 生成 src/data/menu.csv');
    
    // 4. 生成网站CSV
    const sitesCSV = generateSitesCSV(config);
    const sitesPath = path.join(srcDataDir, 'sites.csv');
    fs.writeFileSync(sitesPath, sitesCSV, 'utf8');
    console.log('✅ 生成 src/data/sites.csv');
    
    // 5. 生成网站信息JSON
    const siteInfo = generateSiteInfoJSON(config);
    const siteInfoPath = path.join(srcDataDir, 'site-info.json');
    fs.writeFileSync(siteInfoPath, JSON.stringify(siteInfo, null, 2), 'utf8');
    console.log('✅ 生成 src/data/site-info.json');
    
    // 6. 显示统计信息
    const menuCount = config.menuItems.length;
    const totalSites = config.menuItems.reduce((count, item) => {
      let sites = (item.sites || []).length;
      if (item.submenu) {
        sites += item.submenu.reduce((subCount, subItem) => 
          subCount + (subItem.sites || []).length, 0);
      }
      return count + sites;
    }, 0);
    
    console.log('🎉 CSV 文件生成完成！');
    console.log('📊 统计信息:');
    console.log(`   - 菜单项数: ${menuCount}`);
    console.log(`   - 总网站数: ${totalSites}`);
    console.log(`   - 网站标题: ${config.site.title}`);
    
    console.log('');
    console.log('📋 生成的文件:');
    console.log('   - src/data/menu.csv (菜单配置)');
    console.log('   - src/data/sites.csv (网站数据)');
    console.log('   - src/data/site-info.json (网站基本信息)');
    
    console.log('');
    console.log('🚀 下一步:');
    console.log('   1. 检查生成的CSV文件');
    console.log('   2. 根据需要编辑CSV内容');
    console.log('   3. 运行 npm run build-config 测试转换');
    
  } catch (error) {
    console.error('❌ 生成失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 执行主函数
main();
