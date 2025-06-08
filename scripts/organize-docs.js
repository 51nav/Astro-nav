/**
 * 文档整理脚本
 * 将分散的文档文件整理到统一的docs目录结构中
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * 文件移动映射
 */
const moveMap = [
  // 用户文档
  { from: 'USER_GUIDE.md', to: 'docs/user/user-guide.md' },
  { from: 'CONFIG_GUIDE.md', to: 'docs/user/config-guide.md' },
  
  // 开发文档
  { from: 'PROJECT_ARCHITECTURE.md', to: 'docs/development/project-architecture.md' },
  { from: 'DEVELOPMENT_PLAN.md', to: 'docs/development/development-plan.md' },
  { from: 'PERFORMANCE_OPTIMIZATION_DESIGN.md', to: 'docs/development/performance-optimization.md' },
  
  // 部署文档 (已在docs/中，移动到子目录)
  { from: 'docs/github-actions-deployment.md', to: 'docs/deployment/github-actions-deployment.md' },
  { from: 'docs/config-file-architecture.md', to: 'docs/deployment/config-file-architecture.md' },
  
  // 功能文档 (已在docs/中，移动到子目录)
  { from: 'docs/week2-frontend-adaptation-design.md', to: 'docs/features/week2-frontend-adaptation-design.md' },
  { from: 'docs/week2-frontend-adaptation.md', to: 'docs/features/week2-frontend-adaptation.md' },
  { from: 'CONFIG_CLEANUP_PLAN.md', to: 'docs/features/config-cleanup-plan.md' },
  
  // CSV导入文档 (从src/docs/移动)
  { from: 'src/docs/TABLE_IMPORT_GUIDE.md', to: 'docs/csv-import/table-import-guide.md' },
  { from: 'src/docs/MENU_DESIGN.md', to: 'docs/csv-import/menu-design.md' },
  { from: 'src/docs/SITE_DESIGN.md', to: 'docs/csv-import/site-design.md' },
  { from: 'src/docs/TABLE_FORMAT.md', to: 'docs/csv-import/table-format.md' },
  { from: 'src/docs/MENU_TABLE_FORMAT.md', to: 'docs/csv-import/menu-table-format.md' },
  { from: 'src/docs/SITE_TABLE_FORMAT.md', to: 'docs/csv-import/site-table-format.md' }
];

/**
 * 要删除的重复文件
 */
const filesToDelete = [
  'README_NEW.md'  // 重复的README文件
];

/**
 * 移动文件
 */
function moveFile(fromPath, toPath) {
  const fullFromPath = path.join(projectRoot, fromPath);
  const fullToPath = path.join(projectRoot, toPath);
  
  if (!fs.existsSync(fullFromPath)) {
    console.log(`⚠️ 源文件不存在: ${fromPath}`);
    return false;
  }
  
  // 确保目标目录存在
  const toDir = path.dirname(fullToPath);
  if (!fs.existsSync(toDir)) {
    fs.mkdirSync(toDir, { recursive: true });
  }
  
  // 移动文件
  fs.renameSync(fullFromPath, fullToPath);
  console.log(`✅ 移动: ${fromPath} → ${toPath}`);
  return true;
}

/**
 * 删除文件
 */
function deleteFile(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ 文件不存在: ${filePath}`);
    return false;
  }
  
  fs.unlinkSync(fullPath);
  console.log(`🗑️ 删除: ${filePath}`);
  return true;
}

/**
 * 删除空目录
 */
function removeEmptyDir(dirPath) {
  const fullPath = path.join(projectRoot, dirPath);
  
  if (!fs.existsSync(fullPath)) {
    return false;
  }
  
  const files = fs.readdirSync(fullPath);
  if (files.length === 0) {
    fs.rmdirSync(fullPath);
    console.log(`📁 删除空目录: ${dirPath}`);
    return true;
  }
  
  return false;
}

/**
 * 创建文档索引
 */
function createDocIndex() {
  const indexContent = `# 项目文档

## 📁 文档结构

### 用户文档 (\`user/\`)
- [用户指南](user/user-guide.md) - 项目使用指南
- [配置指南](user/config-guide.md) - 配置文件使用说明

### 开发文档 (\`development/\`)
- [项目架构](development/project-architecture.md) - 整体架构设计
- [开发计划](development/development-plan.md) - 开发路线图
- [性能优化](development/performance-optimization.md) - 性能优化方案

### 部署文档 (\`deployment/\`)
- [GitHub Actions部署](deployment/github-actions-deployment.md) - 自动化部署指南
- [配置文件架构](deployment/config-file-architecture.md) - 配置文件结构说明

### 功能文档 (\`features/\`)
- [Week2前端适配设计](features/week2-frontend-adaptation-design.md) - 懒加载功能设计
- [Week2前端适配实现](features/week2-frontend-adaptation.md) - 懒加载功能实现
- [配置清理计划](features/config-cleanup-plan.md) - 配置优化计划

### CSV导入文档 (\`csv-import/\`)
- [表格导入指南](csv-import/table-import-guide.md) - CSV导入使用指南
- [菜单设计](csv-import/menu-design.md) - 菜单结构设计
- [网站设计](csv-import/site-design.md) - 网站数据设计
- [表格格式](csv-import/table-format.md) - CSV格式规范
- [菜单表格格式](csv-import/menu-table-format.md) - 菜单CSV格式
- [网站表格格式](csv-import/site-table-format.md) - 网站CSV格式

## 🚀 快速导航

- **新用户**: 从 [用户指南](user/user-guide.md) 开始
- **开发者**: 查看 [项目架构](development/project-architecture.md)
- **部署**: 参考 [GitHub Actions部署](deployment/github-actions-deployment.md)
- **CSV导入**: 查看 [表格导入指南](csv-import/table-import-guide.md)

## 📝 文档维护

- 所有文档使用Markdown格式
- 文档按功能分类存放
- 保持文档与代码同步更新
- 定期检查文档链接有效性
`;

  const indexPath = path.join(projectRoot, 'docs', 'README.md');
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('✅ 创建文档索引: docs/README.md');
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始整理项目文档...');
  
  let movedCount = 0;
  let deletedCount = 0;
  
  // 移动文件
  console.log('\n📁 移动文档文件...');
  moveMap.forEach(({ from, to }) => {
    if (moveFile(from, to)) {
      movedCount++;
    }
  });
  
  // 删除重复文件
  console.log('\n🗑️ 删除重复文件...');
  filesToDelete.forEach(file => {
    if (deleteFile(file)) {
      deletedCount++;
    }
  });
  
  // 删除空目录
  console.log('\n📁 清理空目录...');
  removeEmptyDir('src/docs');
  
  // 创建文档索引
  console.log('\n📝 创建文档索引...');
  createDocIndex();
  
  // 显示结果
  console.log('\n🎉 文档整理完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 移动文件: ${movedCount} 个`);
  console.log(`   - 删除文件: ${deletedCount} 个`);
  
  console.log('\n📁 新的文档结构:');
  console.log('   docs/');
  console.log('   ├── README.md (文档索引)');
  console.log('   ├── user/ (用户文档)');
  console.log('   ├── development/ (开发文档)');
  console.log('   ├── deployment/ (部署文档)');
  console.log('   ├── features/ (功能文档)');
  console.log('   └── csv-import/ (CSV导入文档)');
  
  console.log('\n🔗 根目录保留:');
  console.log('   ├── README.md (项目主文档)');
  console.log('   ├── CHANGELOG.md (变更日志)');
  console.log('   └── LICENSE (许可证)');
}

// 执行主函数
main();
