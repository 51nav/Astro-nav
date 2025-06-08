/**
 * 配置文件验证脚本
 * 检查 static/ 目录中的配置文件是否正确
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const staticDir = path.join(projectRoot, 'static');

/**
 * 检查配置文件是否存在
 */
function checkConfigExists() {
  const configPath = path.join(staticDir, 'config.json');

  if (!fs.existsSync(staticDir)) {
    console.error('❌ static/ 目录不存在');
    return false;
  }

  if (!fs.existsSync(configPath)) {
    console.error('❌ static/config.json 不存在');
    return false;
  }

  return true;
}

/**
 * 检测配置文件格式
 */
function detectConfigFormat() {
  const configPath = path.join(staticDir, 'config.json');

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // 检查优化格式特征
    if (config.optimization && config.optimization.enabled) {
      return 'optimized';
    }

    // 检查是否有categoryIndex字段
    const hasOptimizedFields = config.menuItems && config.menuItems.some(item =>
      typeof item.categoryIndex === 'number' ||
      (item.submenu && item.submenu.some(sub => typeof sub.categoryIndex === 'number'))
    );

    if (hasOptimizedFields) {
      return 'optimized';
    }

    // 检查传统格式特征
    if (config.categoryMap || (config.menuItems && config.menuItems.some(item =>
      Array.isArray(item.sites) ||
      (item.submenu && item.submenu.some(sub => Array.isArray(sub.sites)))
    ))) {
      return 'traditional';
    }

    return 'unknown';

  } catch (error) {
    console.error('❌ 配置文件解析错误:', error.message);
    return 'invalid';
  }
}

/**
 * 检查优化配置完整性
 */
function checkOptimizedConfig() {
  console.log('🔍 检查优化配置完整性...');
  
  const configPath = path.join(staticDir, 'config.json');
  const categoriesDir = path.join(staticDir, 'categories');
  
  // 检查基础配置文件
  if (!fs.existsSync(configPath)) {
    console.error('❌ 缺少 static/config.json');
    return false;
  }
  
  // 检查分类目录
  if (!fs.existsSync(categoriesDir)) {
    console.error('❌ 缺少 static/categories/ 目录');
    return false;
  }
  
  // 检查配置格式
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    if (!config.optimization || !config.optimization.enabled) {
      console.error('❌ static/config.json 不是优化格式');
      return false;
    }
    
    if (!config.menuItems || !Array.isArray(config.menuItems)) {
      console.error('❌ 配置文件格式错误：缺少menuItems');
      return false;
    }
    
    // 检查是否有categoryIndex字段
    const hasOptimizedFields = config.menuItems.some(item => 
      typeof item.categoryIndex === 'number' || 
      (item.submenu && item.submenu.some(sub => typeof sub.categoryIndex === 'number'))
    );
    
    if (!hasOptimizedFields) {
      console.error('❌ 配置文件不包含优化字段 (categoryIndex)');
      return false;
    }
    
    // 检查分类文件
    const categoryFiles = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json'));
    if (categoryFiles.length === 0) {
      console.error('❌ categories/ 目录为空');
      return false;
    }
    
    console.log(`✅ 优化配置检查通过:`);
    console.log(`   - 基础配置: static/config.json`);
    console.log(`   - 分类文件: ${categoryFiles.length} 个`);
    console.log(`   - 总分类数: ${config.optimization.totalCategories}`);
    console.log(`   - 总网站数: ${config.optimization.totalSites}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ 配置文件解析错误:', error.message);
    return false;
  }
}

/**
 * 显示使用说明
 */
function showUsage() {
  console.log(`
📋 配置准备脚本使用说明:

🔧 命令选项:
  node scripts/prepare-config.js              # 自动检测模式
  node scripts/prepare-config.js --optimized  # 强制检查优化配置
  node scripts/prepare-config.js --traditional # 强制使用传统配置

🌍 环境变量:
  USE_OPTIMIZED_CONFIG=true                   # 使用优化配置

📁 配置类型:

1️⃣ 传统配置 (默认):
   - 复制 src/data/config.json → static/config.json
   - 适用于开发和简单部署

2️⃣ 优化配置 (手动放置):
   - 使用配置转换工具生成优化配置
   - 手动解压到 static/ 目录
   - 包含 config.json + categories/ 文件夹
   - 适用于生产部署和懒加载

🚀 推荐流程:
   1. 开发时: 使用传统配置
   2. 部署前: 生成优化配置并手动放置到 static/
   3. 构建: 脚本自动检测并验证配置完整性
`);
}

/**
 * 主函数
 */
function main() {
  console.log('🔄 开始准备配置文件...');
  
  // 显示帮助
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showUsage();
    return;
  }
  
  // 强制使用传统配置
  if (process.argv.includes('--traditional')) {
    copyTraditionalConfig();
    return;
  }
  
  // 强制检查优化配置
  if (process.argv.includes('--optimized')) {
    if (checkOptimizedConfig()) {
      console.log('🎉 优化配置准备完成！');
    } else {
      console.error('❌ 优化配置检查失败，请重新生成配置');
      process.exit(1);
    }
    return;
  }
  
  // 自动检测模式
  if (shouldUseOptimizedConfig()) {
    if (checkOptimizedConfig()) {
      console.log('🎉 使用现有优化配置！');
    } else {
      console.log('⚠️ 优化配置不完整，回退到传统配置');
      copyTraditionalConfig();
    }
  } else {
    copyTraditionalConfig();
  }
  
  console.log('📋 说明:');
  console.log('  - 开发环境: Astro dev server 会服务 static/ 文件');
  console.log('  - 生产环境: static/ 文件会复制到 dist/ 根目录');
  console.log('  - 优化配置: 需要手动使用配置转换工具生成');
}

// 执行主函数
main();
