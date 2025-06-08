#!/usr/bin/env node

/**
 * Front Matter 生成器
 * 
 * 功能:
 * 1. 自动为没有 Front Matter 的文档添加标准化元数据
 * 2. 验证现有 Front Matter 的格式和完整性
 * 3. 批量更新文档的 Front Matter 字段
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 获取当前日期
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * 文档类型映射
 */
const DOC_TYPE_MAP = {
  'guide': {
    difficulty: 'beginner',
    target_audience: ['developers'],
    prerequisites: [],
    step_by_step: true,
    practical_examples: true
  },
  'standard': {
    difficulty: 'intermediate',
    standard_type: 'documentation',
    enforcement_level: 'recommended',
    compliance_tools: [],
    review_frequency: 'quarterly'
  },
  'overview': {
    difficulty: 'beginner',
    overview_scope: 'category',
    covered_topics: [],
    quick_links: true,
    summary_format: 'structured'
  },
  'plan': {
    difficulty: 'intermediate',
    plan_type: 'project',
    timeline: 'TBD',
    priority: 'medium',
    project_phase: 'planning'
  },
  'design': {
    difficulty: 'advanced',
    design_type: 'architecture',
    design_phase: 'concept',
    stakeholders: ['developers'],
    technologies: [],
    diagrams_included: false
  },
  'reference': {
    difficulty: 'intermediate',
    reference_type: 'documentation',
    format: 'markdown',
    interactive: false,
    code_examples: false,
    external_links: false
  }
};

/**
 * 根据文件路径推断文档类型
 */
function inferDocType(filePath) {
  const fileName = path.basename(filePath, '.md').toLowerCase();
  const dirName = path.dirname(filePath).toLowerCase();
  
  // 根据文件名推断
  if (fileName.includes('guide') || fileName.includes('manual')) return 'guide';
  if (fileName.includes('standard') || fileName.includes('specification')) return 'standard';
  if (fileName.includes('overview') || fileName.includes('summary')) return 'overview';
  if (fileName.includes('plan') || fileName.includes('roadmap')) return 'plan';
  if (fileName.includes('design') || fileName.includes('architecture')) return 'design';
  if (fileName.includes('reference') || fileName.includes('api')) return 'reference';
  
  // 根据目录推断
  if (dirName.includes('user-guides')) return 'guide';
  if (dirName.includes('development')) return 'guide';
  if (dirName.includes('references')) return 'reference';
  if (dirName.includes('design')) return 'design';
  if (dirName.includes('project-management')) return 'plan';
  if (dirName.includes('technical')) return 'reference';
  
  return 'guide'; // 默认类型
}

/**
 * 根据文件路径推断分类
 */
function inferCategory(filePath) {
  const pathParts = filePath.split(path.sep);
  const docsIndex = pathParts.indexOf('docs');
  
  if (docsIndex >= 0 && docsIndex < pathParts.length - 1) {
    return pathParts[docsIndex + 1];
  }
  
  return '09-references'; // 默认分类
}

/**
 * 根据文件名推断标题
 */
function inferTitle(filePath) {
  const fileName = path.basename(filePath, '.md');
  
  // 转换常见的文件名格式
  return fileName
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 生成标准 Front Matter
 */
function generateFrontMatter(filePath, existingContent = '') {
  const docType = inferDocType(filePath);
  const category = inferCategory(filePath);
  const title = inferTitle(filePath);
  const currentDate = getCurrentDate();
  
  // 基础 Front Matter
  const frontMatter = {
    title: title,
    description: `${title}相关文档`,
    type: 'docs',
    category: category,
    doc_type: docType,
    order: 1,
    version: '1.0',
    created: currentDate,
    lastModified: currentDate,
    author: '项目团队',
    maintainer: '维护者名称',
    status: 'active'
  };
  
  // 添加类型特定字段
  const typeSpecific = DOC_TYPE_MAP[docType] || {};
  Object.assign(frontMatter, typeSpecific);
  
  // 添加 cascade 配置
  frontMatter.cascade = [
    'type: docs',
    'show_breadcrumb: true',
    'show_toc: true',
    'show_edit_link: true',
    'show_last_modified: true'
  ];
  
  return frontMatter;
}

/**
 * 将 Front Matter 对象转换为 YAML 字符串
 */
function frontMatterToYaml(frontMatter) {
  let yaml = '---\n';
  
  // 基础信息
  yaml += `title: "${frontMatter.title}"\n`;
  yaml += `description: "${frontMatter.description}"\n`;
  yaml += `type: "${frontMatter.type}"\n`;
  yaml += `category: "${frontMatter.category}"\n`;
  yaml += `doc_type: "${frontMatter.doc_type}"\n`;
  yaml += `order: ${frontMatter.order}\n`;
  yaml += `version: "${frontMatter.version}"\n`;
  yaml += `created: "${frontMatter.created}"\n`;
  yaml += `lastModified: "${frontMatter.lastModified}"\n`;
  yaml += `author: "${frontMatter.author}"\n`;
  yaml += `maintainer: "${frontMatter.maintainer}"\n`;
  yaml += `status: "${frontMatter.status}"\n`;
  
  // 类型特定字段
  if (frontMatter.difficulty) yaml += `difficulty: "${frontMatter.difficulty}"\n`;
  
  // 添加类型特定字段注释和内容
  if (frontMatter.doc_type === 'guide') {
    yaml += '\n# 指南特有字段\n';
    if (frontMatter.target_audience) yaml += `target_audience: ${JSON.stringify(frontMatter.target_audience)}\n`;
    if (frontMatter.prerequisites) yaml += `prerequisites: ${JSON.stringify(frontMatter.prerequisites)}\n`;
    if (frontMatter.step_by_step !== undefined) yaml += `step_by_step: ${frontMatter.step_by_step}\n`;
    if (frontMatter.practical_examples !== undefined) yaml += `practical_examples: ${frontMatter.practical_examples}\n`;
  } else if (frontMatter.doc_type === 'standard') {
    yaml += '\n# 规范特有字段\n';
    if (frontMatter.standard_type) yaml += `standard_type: "${frontMatter.standard_type}"\n`;
    if (frontMatter.enforcement_level) yaml += `enforcement_level: "${frontMatter.enforcement_level}"\n`;
    if (frontMatter.compliance_tools) yaml += `compliance_tools: ${JSON.stringify(frontMatter.compliance_tools)}\n`;
    if (frontMatter.review_frequency) yaml += `review_frequency: "${frontMatter.review_frequency}"\n`;
  } else if (frontMatter.doc_type === 'plan') {
    yaml += '\n# 计划特有字段\n';
    if (frontMatter.plan_type) yaml += `plan_type: "${frontMatter.plan_type}"\n`;
    if (frontMatter.timeline) yaml += `timeline: "${frontMatter.timeline}"\n`;
    if (frontMatter.priority) yaml += `priority: "${frontMatter.priority}"\n`;
    if (frontMatter.project_phase) yaml += `project_phase: "${frontMatter.project_phase}"\n`;
  }
  
  // cascade 配置
  yaml += '\ncascade:\n';
  frontMatter.cascade.forEach(item => {
    yaml += `  - ${item}\n`;
  });
  
  yaml += '---\n\n';
  
  return yaml;
}

/**
 * 检查文件是否已有 Front Matter
 */
function hasFrontMatter(content) {
  return content.trim().startsWith('---');
}

/**
 * 为单个文件添加 Front Matter
 */
function addFrontMatterToFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (hasFrontMatter(content)) {
    console.log(`⏭️ 已有 Front Matter: ${filePath}`);
    return false;
  }
  
  const frontMatter = generateFrontMatter(filePath, content);
  const yamlString = frontMatterToYaml(frontMatter);
  const newContent = yamlString + content;
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ 添加 Front Matter: ${filePath}`);
  return true;
}

/**
 * 批量处理文档目录
 */
function processDocsDirectory(docsPath) {
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.md') && item !== '_index.md') {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(docsPath);
  return files;
}

/**
 * 主函数
 */
function main() {
  console.log('🔧 Front Matter 生成器');
  console.log('功能: 自动为文档添加标准化 Front Matter\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  const docsPath = path.join(projectRoot, 'docs');
  
  if (!fs.existsSync(docsPath)) {
    console.error('❌ docs 目录不存在');
    process.exit(1);
  }
  
  console.log(`📁 扫描目录: ${docsPath}`);
  const markdownFiles = processDocsDirectory(docsPath);
  
  console.log(`📋 找到 ${markdownFiles.length} 个 Markdown 文件\n`);
  
  let processedCount = 0;
  let skippedCount = 0;
  
  markdownFiles.forEach(file => {
    const relativePath = path.relative(projectRoot, file);
    if (addFrontMatterToFile(file)) {
      processedCount++;
    } else {
      skippedCount++;
    }
  });
  
  console.log('\n🎉 处理完成！');
  console.log(`📊 统计信息:`);
  console.log(`   - 处理文件: ${processedCount} 个`);
  console.log(`   - 跳过文件: ${skippedCount} 个`);
  console.log(`   - 总计文件: ${markdownFiles.length} 个`);
  
  if (processedCount > 0) {
    console.log('\n💡 提示:');
    console.log('   - 请检查生成的 Front Matter 是否正确');
    console.log('   - 根据需要调整 title 和 description');
    console.log('   - 运行 Git Hooks 会自动管理时间戳');
  }
}

// 执行主函数
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('front-matter-generator.js')) {
  main();
}

export {
  generateFrontMatter,
  addFrontMatterToFile,
  processDocsDirectory
};
