#!/usr/bin/env node

/**
 * Git Pre-commit Hook: 自动更新文档时间戳
 * 
 * 功能:
 * 1. 检测被修改的 .md 文件
 * 2. 自动更新 lastModified 字段
 * 3. 对于新文件，设置 created 和 lastModified
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 获取当前日期 (YYYY-MM-DD 格式)
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * 获取文件的首次提交日期
 */
function getFileCreationDate(filePath) {
  try {
    // 获取文件的第一次提交日期
    const result = execSync(`git log --follow --format=%ad --date=short -- "${filePath}" | tail -1`, {
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();
    
    return result || getCurrentDate();
  } catch (error) {
    // 如果是新文件，返回当前日期
    return getCurrentDate();
  }
}

/**
 * 检查文件是否为新文件 (未被 Git 跟踪)
 */
function isNewFile(filePath) {
  try {
    execSync(`git log --oneline -- "${filePath}"`, { stdio: 'pipe' });
    return false; // 有历史记录，不是新文件
  } catch (error) {
    return true; // 没有历史记录，是新文件
  }
}

/**
 * 更新文件的 Front Matter 时间戳
 */
function updateTimestamps(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否有 Front Matter
  if (!content.startsWith('---')) {
    return false;
  }

  const currentDate = getCurrentDate();
  const isNew = isNewFile(filePath);
  
  let updatedContent = content;
  let hasChanges = false;

  if (isNew) {
    // 新文件: 设置 created 和 lastModified
    console.log(`📝 新文件: ${filePath} - 设置创建和修改时间`);
    
    // 更新或添加 created 字段
    if (content.includes('created:')) {
      updatedContent = updatedContent.replace(
        /created: "[^"]*"/g,
        `created: "${currentDate}"`
      );
    } else {
      // 在 Front Matter 中添加 created 字段
      updatedContent = updatedContent.replace(
        /(# 时间信息\s*\n)/,
        `$1created: "${currentDate}"\n`
      );
    }
    
    // 更新或添加 lastModified 字段
    if (content.includes('lastModified:')) {
      updatedContent = updatedContent.replace(
        /lastModified: "[^"]*"/g,
        `lastModified: "${currentDate}"`
      );
    } else {
      // 在 created 后添加 lastModified 字段
      updatedContent = updatedContent.replace(
        /(created: "[^"]*"\s*\n)/,
        `$1lastModified: "${currentDate}"\n`
      );
    }
    
    hasChanges = true;
  } else {
    // 已存在文件: 只更新 lastModified
    if (content.includes('lastModified:')) {
      const oldContent = updatedContent;
      updatedContent = updatedContent.replace(
        /lastModified: "[^"]*"/g,
        `lastModified: "${currentDate}"`
      );
      
      if (oldContent !== updatedContent) {
        console.log(`🔄 更新文件: ${filePath} - 更新修改时间`);
        hasChanges = true;
      }
    }
  }

  // 如果有变更，写入文件
  if (hasChanges && updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    // 将更新后的文件添加到暂存区
    execSync(`git add "${filePath}"`);
    
    return true;
  }

  return false;
}

/**
 * 获取暂存区中的 .md 文件
 */
function getStagedMarkdownFiles() {
  try {
    const result = execSync('git diff --cached --name-only --diff-filter=AM', {
      encoding: 'utf8'
    });
    
    return result
      .split('\n')
      .filter(file => file.trim())
      .filter(file => file.endsWith('.md'))
      .filter(file => fs.existsSync(file));
  } catch (error) {
    console.error('❌ 获取暂存文件失败:', error.message);
    return [];
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🕒 Git Hook: 自动更新文档时间戳...');
  
  const stagedFiles = getStagedMarkdownFiles();
  
  if (stagedFiles.length === 0) {
    console.log('📝 没有需要更新时间戳的 Markdown 文件');
    return;
  }

  console.log(`📋 检测到 ${stagedFiles.length} 个 Markdown 文件:`);
  stagedFiles.forEach(file => console.log(`   - ${file}`));

  let updatedCount = 0;
  
  stagedFiles.forEach(file => {
    if (updateTimestamps(file)) {
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    console.log(`✅ 成功更新 ${updatedCount} 个文件的时间戳`);
  } else {
    console.log('📝 所有文件的时间戳都是最新的');
  }
}

// 执行主函数 - 只在直接运行时执行
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  main();
}

export {
  updateTimestamps,
  getCurrentDate,
  getFileCreationDate,
  isNewFile
};
