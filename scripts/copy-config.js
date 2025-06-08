/**
 * 配置文件复制脚本
 * 将 src/data/ 中的配置文件复制到 public/ 目录，支持懒加载
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const srcDataDir = path.join(projectRoot, 'src', 'data');
const staticDir = path.join(projectRoot, 'static');

/**
 * 复制配置文件到static目录
 */
function copyConfigFiles() {
  console.log('🔄 开始复制配置文件...');

  // 确保static目录存在
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
    console.log('📁 创建目录: static/');
  }

  // 复制 config.json
  const srcConfigPath = path.join(srcDataDir, 'config.json');
  const destConfigPath = path.join(staticDir, 'config.json');

  if (fs.existsSync(srcConfigPath)) {
    fs.copyFileSync(srcConfigPath, destConfigPath);
    console.log('✅ 复制 config.json 到 static/');
  } else {
    console.warn('⚠️ 源配置文件不存在:', srcConfigPath);
  }

  // 复制其他配置文件
  const configFiles = ['config-optimized.json', 'config-test.json'];
  configFiles.forEach(filename => {
    const srcPath = path.join(srcDataDir, filename);
    const destPath = path.join(staticDir, filename);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 复制 ${filename} 到 static/`);
    }
  });

  console.log('🎉 配置文件复制完成！');
  console.log('📋 说明:');
  console.log('  - 开发环境: Astro dev server 会服务 static/ 文件');
  console.log('  - 生产环境: static/ 文件会复制到 dist/ 根目录');
}

/**
 * 监听文件变化
 */
function watchConfigFiles() {
  console.log('👀 开始监听 src/data/ 配置文件变化...');
  console.log('💡 修改 src/data/config.json 会自动同步到 static/');

  if (fs.existsSync(srcDataDir)) {
    fs.watch(srcDataDir, (eventType, filename) => {
      if (filename && filename.endsWith('.json')) {
        console.log(`📝 检测到 ${filename} 变化，重新复制到 static/...`);
        copyConfigFiles();
      }
    });
  }
}

// 执行复制
copyConfigFiles();

// 如果是开发模式，启动监听
if (process.argv.includes('--watch')) {
  watchConfigFiles();
}
