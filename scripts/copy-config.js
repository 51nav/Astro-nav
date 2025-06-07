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
const staticDir = path.join(projectRoot, 'static');

/**
 * 复制配置文件到多个目标目录
 */
function copyConfigFiles() {
  console.log('🔄 开始复制配置文件...');

  // 目标目录列表 (支持开发和部署)
  const targetDirs = [
    { name: 'public', path: publicDir, desc: '开发环境' },
    { name: 'static', path: staticDir, desc: 'GitHub Actions部署' }
  ];

  // 确保目录存在
  targetDirs.forEach(target => {
    if (!fs.existsSync(target.path)) {
      fs.mkdirSync(target.path, { recursive: true });
      console.log(`📁 创建目录: ${target.name}/`);
    }
  });

  // 复制 config.json
  const srcConfigPath = path.join(srcDataDir, 'config.json');

  if (fs.existsSync(srcConfigPath)) {
    targetDirs.forEach(target => {
      const destConfigPath = path.join(target.path, 'config.json');
      fs.copyFileSync(srcConfigPath, destConfigPath);
      console.log(`✅ 复制 config.json 到 ${target.name}/ (${target.desc})`);
    });
  } else {
    console.warn('⚠️ 源配置文件不存在:', srcConfigPath);
  }

  // 复制其他配置文件
  const configFiles = ['config-optimized.json', 'config-test.json'];
  configFiles.forEach(filename => {
    const srcPath = path.join(srcDataDir, filename);

    if (fs.existsSync(srcPath)) {
      targetDirs.forEach(target => {
        const destPath = path.join(target.path, filename);
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ 复制 ${filename} 到 ${target.name}/`);
      });
    }
  });

  console.log('🎉 配置文件复制完成！');
  console.log('📋 部署说明:');
  console.log('  - 开发环境: 使用 public/ 文件夹');
  console.log('  - GitHub Actions: 使用 static/ 文件夹');
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
