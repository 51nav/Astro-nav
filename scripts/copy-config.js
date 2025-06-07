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
const publicDir = path.join(projectRoot, 'public');

/**
 * 复制配置文件
 */
function copyConfigFiles() {
  console.log('🔄 开始复制配置文件...');
  
  // 确保目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // 复制 config.json
  const srcConfigPath = path.join(srcDataDir, 'config.json');
  const destConfigPath = path.join(publicDir, 'config.json');
  
  if (fs.existsSync(srcConfigPath)) {
    fs.copyFileSync(srcConfigPath, destConfigPath);
    console.log('✅ 复制 config.json 成功');
  } else {
    console.warn('⚠️ 源配置文件不存在:', srcConfigPath);
  }
  
  // 复制其他配置文件
  const configFiles = ['config-optimized.json', 'config-test.json'];
  configFiles.forEach(filename => {
    const srcPath = path.join(srcDataDir, filename);
    const destPath = path.join(publicDir, filename);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 复制 ${filename} 成功`);
    }
  });
  
  console.log('🎉 配置文件复制完成！');
}

/**
 * 监听文件变化
 */
function watchConfigFiles() {
  console.log('👀 开始监听配置文件变化...');
  
  if (fs.existsSync(srcDataDir)) {
    fs.watch(srcDataDir, (eventType, filename) => {
      if (filename && filename.endsWith('.json')) {
        console.log(`📝 检测到 ${filename} 变化，重新复制...`);
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
