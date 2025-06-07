/**
 * 构建时配置转换脚本
 * 从 CSV 文件生成优化配置
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDataDir = path.join(projectRoot, 'src', 'data');
const staticDir = path.join(projectRoot, 'static');

/**
 * 读取CSV文件
 */
function readCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV文件不存在: ${filePath}`);
  }
  
  const csvContent = fs.readFileSync(filePath, 'utf8');
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  });
  
  if (result.errors.length > 0) {
    console.warn('⚠️ CSV解析警告:', result.errors);
  }
  
  return result.data;
}

/**
 * 读取网站基本信息
 */
function readSiteInfo() {
  const siteInfoPath = path.join(srcDataDir, 'site-info.json');
  
  if (fs.existsSync(siteInfoPath)) {
    try {
      return JSON.parse(fs.readFileSync(siteInfoPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ site-info.json 解析失败，使用默认值');
    }
  }
  
  // 默认网站信息
  return {
    title: "导航网站",
    description: "专业的导航平台",
    logoText: "Nav"
  };
}

/**
 * 转换菜单数据
 */
function transformMenuData(menuRows) {
  return menuRows.map(row => ({
    menuId: row.menuId || row['菜单ID'] || '',
    menuName: row.menuName || row['菜单名称'] || '',
    parentMenuId: row.parentMenuId || row['父菜单ID'] || '',
    menuIcon: row.menuIcon || row['菜单图标'] || 'mdi:folder',
    sortOrder: parseInt(row.sortOrder || row['排序'] || '0')
  }));
}

/**
 * 转换网站数据
 */
function transformSiteData(siteRows) {
  return siteRows.map(row => ({
    menuId: row.menuId || row['菜单ID'] || '',
    title: row.title || row['网站标题'] || '',
    description: row.description || row['网站描述'] || '',
    url: row.url || row['网站链接'] || '',
    logo: row.logo || row['网站图标'] || '',
    advantages: parseArrayField(row.advantages || row['优势'] || ''),
    features: parseArrayField(row.features || row['功能特点'] || ''),
    details: parseDetailsField(row),
    related: parseRelatedField(row)
  }));
}

/**
 * 解析数组字段 (用分号分隔)
 */
function parseArrayField(value) {
  if (!value || typeof value !== 'string') return [];
  return value.split(';').map(item => item.trim()).filter(item => item);
}

/**
 * 解析详细信息字段
 */
function parseDetailsField(row) {
  const details = {};
  
  if (row.intro || row['详细介绍']) {
    details.intro = row.intro || row['详细介绍'];
  }
  
  if (row.pricing || row['价格信息']) {
    details.pricing = row.pricing || row['价格信息'];
  }
  
  if (row.pros || row['优点']) {
    details.pros = parseArrayField(row.pros || row['优点']);
  }
  
  if (row.cons || row['缺点']) {
    details.cons = parseArrayField(row.cons || row['缺点']);
  }
  
  if (row.tips || row['使用技巧']) {
    details.tips = parseArrayField(row.tips || row['使用技巧']);
  }
  
  return Object.keys(details).length > 0 ? details : undefined;
}

/**
 * 解析相关网站字段
 */
function parseRelatedField(row) {
  const relatedStr = row.related || row['相关网站'] || '';
  if (!relatedStr) return [];
  
  try {
    // 尝试解析JSON格式
    return JSON.parse(relatedStr);
  } catch {
    // 如果不是JSON，按分号分隔处理
    return relatedStr.split(';').map(item => {
      const parts = item.trim().split(':');
      return {
        title: parts[0] || '',
        description: parts[1] || ''
      };
    }).filter(item => item.title);
  }
}

/**
 * 生成优化配置
 */
async function generateOptimizedConfig() {
  console.log('🔄 开始从CSV生成优化配置...');
  
  try {
    // 1. 读取源数据
    const menuPath = path.join(srcDataDir, 'menu.csv');
    const sitesPath = path.join(srcDataDir, 'sites.csv');
    
    console.log('📖 读取CSV文件...');
    const menuRows = readCSV(menuPath);
    const siteRows = readCSV(sitesPath);
    const siteInfo = readSiteInfo();
    
    console.log(`   - 菜单数据: ${menuRows.length} 条`);
    console.log(`   - 网站数据: ${siteRows.length} 条`);
    
    // 2. 转换数据格式
    console.log('🔄 转换数据格式...');
    const menuData = transformMenuData(menuRows);
    const siteData = transformSiteData(siteRows);
    
    // 3. 动态导入ConfigConverter (避免ES模块问题)
    const { ConfigConverter } = await import('../src/utils/ConfigConverter.ts');
    
    // 4. 生成优化配置
    console.log('⚡ 生成优化配置...');
    const result = ConfigConverter.convertToOptimized(
      { menuItems: [], site: siteInfo }, // 临时结构
      {
        previewCount: 3,
        chunkSizeLimit: 100,
        enablePreload: true
      }
    );
    
    // 5. 确保static目录存在
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
      console.log('📁 创建目录: static/');
    }
    
    // 6. 写入基础配置文件
    const configPath = path.join(staticDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(result.baseConfig, null, 2));
    console.log('✅ 生成 static/config.json');
    
    // 7. 创建categories目录并写入分类文件
    const categoriesDir = path.join(staticDir, 'categories');
    if (!fs.existsSync(categoriesDir)) {
      fs.mkdirSync(categoriesDir, { recursive: true });
      console.log('📁 创建目录: static/categories/');
    }
    
    result.categoryFiles.forEach(file => {
      const filePath = path.join(categoriesDir, file.filename);
      fs.writeFileSync(filePath, JSON.stringify(file.content, null, 2));
      console.log(`✅ 生成 static/categories/${file.filename}`);
    });
    
    // 8. 显示统计信息
    console.log('🎉 优化配置生成完成！');
    console.log('📊 统计信息:');
    console.log(`   - 总分类数: ${result.optimization.totalCategories}`);
    console.log(`   - 总网站数: ${result.optimization.totalSites}`);
    console.log(`   - 原始大小: ${result.optimization.originalSizeKB}KB`);
    console.log(`   - 优化后大小: ${result.optimization.optimizedSizeKB}KB`);
    console.log(`   - 压缩比例: ${result.optimization.compressionRatio}%`);
    
  } catch (error) {
    console.error('❌ 配置生成失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * 检查CSV文件是否存在
 */
function checkCSVFiles() {
  const menuPath = path.join(srcDataDir, 'menu.csv');
  const sitesPath = path.join(srcDataDir, 'sites.csv');
  
  const menuExists = fs.existsSync(menuPath);
  const sitesExists = fs.existsSync(sitesPath);
  
  if (!menuExists || !sitesExists) {
    console.log('ℹ️ CSV文件检查:');
    console.log(`   - menu.csv: ${menuExists ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`   - sites.csv: ${sitesExists ? '✅ 存在' : '❌ 不存在'}`);
    
    if (!menuExists || !sitesExists) {
      console.log('');
      console.log('📋 请创建以下CSV文件:');
      console.log('   - src/data/menu.csv (菜单配置)');
      console.log('   - src/data/sites.csv (网站数据)');
      console.log('   - src/data/site-info.json (可选，网站基本信息)');
      return false;
    }
  }
  
  return true;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 构建时配置生成器');
  
  // 检查CSV文件
  if (!checkCSVFiles()) {
    process.exit(1);
  }
  
  // 生成优化配置
  await generateOptimizedConfig();
}

// 执行主函数
main().catch(error => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});
