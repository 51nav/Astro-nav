#!/usr/bin/env node

/**
 * Git Hooks 安装脚本
 * 
 * 功能:
 * 1. 安装 pre-commit hook 用于自动更新时间戳
 * 2. 设置 hook 文件权限
 * 3. 验证安装是否成功
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 获取项目根目录
 */
function getProjectRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('❌ 错误: 当前目录不是 Git 仓库');
    process.exit(1);
  }
}

/**
 * 创建 pre-commit hook 文件
 */
function createPreCommitHook(projectRoot) {
  const hooksDir = path.join(projectRoot, '.git', 'hooks');
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  
  // 确保 hooks 目录存在
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // 创建 pre-commit hook 内容
  const hookContent = `#!/bin/sh
#
# Git Pre-commit Hook: 自动更新文档时间戳
# 由 install-git-hooks.js 自动生成
#

# 检查 Node.js 是否可用
if ! command -v node >/dev/null 2>&1; then
    echo "❌ 错误: 需要 Node.js 来运行时间戳更新脚本"
    exit 1
fi

# 运行时间戳更新脚本
node "${projectRoot.replace(/\\/g, '/')}/scripts/git-hooks/pre-commit-timestamp.js"

# 检查脚本执行结果
if [ $? -ne 0 ]; then
    echo "❌ 时间戳更新失败"
    exit 1
fi

echo "✅ 时间戳更新完成"
`;

  // 写入 hook 文件
  fs.writeFileSync(preCommitPath, hookContent, 'utf8');
  
  // 设置执行权限 (Unix/Linux/macOS)
  if (process.platform !== 'win32') {
    try {
      execSync(`chmod +x "${preCommitPath}"`);
    } catch (error) {
      console.warn('⚠️ 警告: 无法设置 hook 文件执行权限');
    }
  }

  return preCommitPath;
}

/**
 * 备份现有的 pre-commit hook
 */
function backupExistingHook(projectRoot) {
  const preCommitPath = path.join(projectRoot, '.git', 'hooks', 'pre-commit');
  
  if (fs.existsSync(preCommitPath)) {
    const backupPath = `${preCommitPath}.backup.${Date.now()}`;
    fs.copyFileSync(preCommitPath, backupPath);
    console.log(`📦 已备份现有 hook 到: ${backupPath}`);
    return backupPath;
  }
  
  return null;
}

/**
 * 验证安装
 */
function verifyInstallation(projectRoot) {
  const preCommitPath = path.join(projectRoot, '.git', 'hooks', 'pre-commit');
  const timestampScriptPath = path.join(projectRoot, 'scripts', 'git-hooks', 'pre-commit-timestamp.js');
  
  const checks = [
    {
      name: 'Pre-commit hook 文件存在',
      check: () => fs.existsSync(preCommitPath),
      fix: '运行安装脚本重新创建'
    },
    {
      name: '时间戳更新脚本存在',
      check: () => fs.existsSync(timestampScriptPath),
      fix: '确保 scripts/git-hooks/pre-commit-timestamp.js 文件存在'
    },
    {
      name: 'Node.js 可用',
      check: () => {
        try {
          execSync('node --version', { stdio: 'pipe' });
          return true;
        } catch {
          return false;
        }
      },
      fix: '安装 Node.js'
    }
  ];

  console.log('\n🔍 验证安装...');
  
  let allPassed = true;
  checks.forEach(({ name, check, fix }) => {
    const passed = check();
    console.log(`${passed ? '✅' : '❌'} ${name}`);
    if (!passed) {
      console.log(`   💡 解决方案: ${fix}`);
      allPassed = false;
    }
  });

  return allPassed;
}

/**
 * 主函数
 */
function main() {
  console.log('🔧 Git Hooks 安装程序');
  console.log('功能: 自动更新文档时间戳\n');

  const projectRoot = getProjectRoot();
  console.log(`📁 项目根目录: ${projectRoot}`);

  // 备份现有 hook
  const backupPath = backupExistingHook(projectRoot);
  
  // 创建新的 pre-commit hook
  console.log('\n📝 安装 pre-commit hook...');
  const hookPath = createPreCommitHook(projectRoot);
  console.log(`✅ Hook 已安装到: ${hookPath}`);

  // 验证安装
  const success = verifyInstallation(projectRoot);
  
  if (success) {
    console.log('\n🎉 Git Hooks 安装成功！');
    console.log('\n📋 功能说明:');
    console.log('   • 提交时自动更新 .md 文件的 lastModified 字段');
    console.log('   • 新文件会自动设置 created 和 lastModified 字段');
    console.log('   • 只处理暂存区中的 Markdown 文件');
    
    console.log('\n🚀 使用方法:');
    console.log('   1. 正常编辑 .md 文件');
    console.log('   2. git add <文件>');
    console.log('   3. git commit (自动更新时间戳)');
    
    if (backupPath) {
      console.log(`\n📦 原有 hook 已备份到: ${path.basename(backupPath)}`);
    }
  } else {
    console.log('\n❌ 安装验证失败，请检查上述问题');
    process.exit(1);
  }
}

// 执行主函数 - 直接执行，因为这是一个安装脚本
main();

export {
  createPreCommitHook,
  backupExistingHook,
  verifyInstallation
};
