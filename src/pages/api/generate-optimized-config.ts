import type { APIRoute } from 'astro';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import JSZip from 'jszip';
import busboy from 'busboy';
import { Readable } from 'stream';
import { splitConfig } from '../../utils/configSplitter';
import type {
  OptimizationOptions,
  ConfigResult,
  OptimizedConfigResult
} from '../../types/optimization';
import type { MenuTableRow, SiteTableRow, TableImportResult } from '../../types/tableImport';

// 强制此API路由为服务器端渲染
export const prerender = false;
import type { 
  GenerateConfigRequest, 
  GenerateConfigResponse,
  OptimizationOptions,
  ConfigResult,
  DEFAULT_OPTIMIZATION_OPTIONS
} from '../../types/optimization';
import type { MenuTableRow, SiteTableRow, TableImportResult } from '../../types/tableImport';
import { splitConfig } from '../../utils/configSplitter';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('=== 配置生成API ===');
    console.log('Method:', request.method);
    console.log('URL:', request.url);

    // 检查Content-Type
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!contentType || !contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({
        success: false,
        error: `无效的Content-Type: ${contentType}。请使用multipart/form-data格式上传文件。`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 使用busboy解析multipart数据
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const bb = busboy({
      headers: { 'content-type': contentType }
    });

    // 存储解析结果
    const formFields: Record<string, string> = {};
    const files: Record<string, { buffer: Buffer; filename: string; mimeType: string }> = {};

    // 解析表单数据
    const parseResult = await new Promise<{ formFields: typeof formFields; files: typeof files }>((resolve, reject) => {
      bb.on('field', (fieldname, value) => {
        console.log(`表单字段: ${fieldname} = ${value}`);
        formFields[fieldname] = value;
      });

      bb.on('file', (fieldname, file, info) => {
        console.log(`文件字段: ${fieldname}`, info);
        const { filename, mimeType } = info;

        let fileBuffer = Buffer.alloc(0);

        file.on('data', (data) => {
          fileBuffer = Buffer.concat([fileBuffer, data]);
        });

        file.on('end', () => {
          console.log(`文件 ${fieldname} 上传完成，大小: ${fileBuffer.length}`);
          files[fieldname] = {
            buffer: fileBuffer,
            filename,
            mimeType
          };
        });
      });

      bb.on('finish', () => {
        console.log('Busboy解析完成');
        resolve({ formFields, files });
      });

      bb.on('error', (error) => {
        console.error('Busboy解析错误:', error);
        reject(error);
      });

      stream.pipe(bb);
    });
    
    // 获取文件
    const menuFile = parseResult.files.menuFile;
    const siteFile = parseResult.files.siteFile;

    // 获取网站信息
    const siteTitle = parseResult.formFields.siteTitle || '我的导航网站';
    const siteDescription = parseResult.formFields.siteDescription || '专业的导航平台';
    const logoText = parseResult.formFields.logoText || 'MyNav';

    // 获取优化选项
    const optimizationEnabled = parseResult.formFields.enableOptimization === 'true';
    const previewCount = parseInt(parseResult.formFields.previewSiteCount) || 3;
    const chunkSizeLimit = parseInt(parseResult.formFields.fileSizeLimit) || 100;
    const enablePreload = parseResult.formFields.enableSmartPreload === 'true';
    
    // 验证文件
    if (!menuFile || !siteFile) {
      return new Response(JSON.stringify({
        success: false,
        error: '请上传菜单文件和网站文件'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 解析菜单文件
    const menuResult = await parseMenuFile(menuFile);
    if (!menuResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: `菜单文件解析失败: ${menuResult.error}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 解析网站文件
    const siteResult = await parseSiteFile(siteFile);
    if (!siteResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: `网站文件解析失败: ${siteResult.error}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const siteInfo = {
      title: siteTitle,
      description: siteDescription,
      logoText
    };
    
    const optimizationOptions: OptimizationOptions = {
      enabled: optimizationEnabled,
      previewCount,
      chunkSizeLimit,
      enablePreload
    };
    
    // 生成配置
    const result = await generateConfig(
      menuResult.data!,
      siteResult.data!,
      siteInfo,
      optimizationOptions
    );
    
    if (optimizationEnabled) {
      // 生成优化版本 - ZIP文件
      const zipBlob = await createOptimizedZip(result);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `optimized-config-${timestamp}.zip`;
      
      return new Response(zipBlob, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'X-Config-Info': JSON.stringify({
            success: true,
            data: {
              fileType: 'zip',
              filename,
              optimization: result.optimization
            }
          })
        }
      });
    } else {
      // 生成传统版本 - JSON文件
      const configJson = JSON.stringify(result.config, null, 2);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `config-${timestamp}.json`;
      
      return new Response(configJson, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'X-Config-Info': JSON.stringify({
            success: true,
            data: {
              fileType: 'json',
              filename,
              optimization: result.optimization
            }
          })
        }
      });
    }
    
  } catch (error) {
    console.error('配置生成错误:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * 解析菜单文件
 */
async function parseMenuFile(file: { buffer: Buffer; filename: string; mimeType: string }): Promise<TableImportResult<MenuTableRow>> {
  try {
    const fileName = file.filename.toLowerCase();

    if (fileName.endsWith('.xlsx')) {
      return await parseMenuExcelFile(file);
    } else if (fileName.endsWith('.csv')) {
      return await parseMenuCSVFile(file);
    } else {
      return {
        success: false,
        error: '不支持的文件格式，请上传 .xlsx 或 .csv 文件'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 解析网站文件
 */
async function parseSiteFile(file: { buffer: Buffer; filename: string; mimeType: string }): Promise<TableImportResult<SiteTableRow>> {
  try {
    const fileName = file.filename.toLowerCase();

    if (fileName.endsWith('.xlsx')) {
      return await parseSiteExcelFile(file);
    } else if (fileName.endsWith('.csv')) {
      return await parseSiteCSVFile(file);
    } else {
      return {
        success: false,
        error: '不支持的文件格式，请上传 .xlsx 或 .csv 文件'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

/**
 * 解析菜单Excel文件
 */
async function parseMenuExcelFile(file: { buffer: Buffer; filename: string; mimeType: string }): Promise<TableImportResult<MenuTableRow>> {
  const data = new Uint8Array(file.buffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  return processMenuData(jsonData as string[][]);
}

/**
 * 解析菜单CSV文件
 */
async function parseMenuCSVFile(file: { buffer: Buffer; filename: string; mimeType: string }): Promise<TableImportResult<MenuTableRow>> {
  const text = file.buffer.toString('utf-8');

  return new Promise((resolve) => {
    Papa.parse(text, {
      complete: (results) => {
        const result = processMenuData(results.data as string[][]);
        resolve(result);
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV解析失败: ${error.message}`
        });
      },
      encoding: 'UTF-8'
    });
  });
}

/**
 * 解析网站Excel文件
 */
async function parseSiteExcelFile(file: { buffer: Buffer; filename: string; mimeType: string }): Promise<TableImportResult<SiteTableRow>> {
  const data = new Uint8Array(file.buffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  return processSiteData(jsonData as string[][]);
}

/**
 * 解析网站CSV文件
 */
async function parseSiteCSVFile(file: { buffer: Buffer; filename: string; mimeType: string }): Promise<TableImportResult<SiteTableRow>> {
  const text = file.buffer.toString('utf-8');

  return new Promise((resolve) => {
    Papa.parse(text, {
      complete: (results) => {
        const result = processSiteData(results.data as string[][]);
        resolve(result);
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV解析失败: ${error.message}`
        });
      },
      encoding: 'UTF-8'
    });
  });
}

/**
 * 处理菜单数据
 */
function processMenuData(rawData: string[][]): TableImportResult<MenuTableRow> {
  if (!rawData || rawData.length < 2) {
    return {
      success: false,
      error: '文件内容为空或格式不正确'
    };
  }

  const headers = rawData[0].map(h => h?.toString().trim());
  const rows = rawData.slice(1);

  // 验证菜单表头
  const requiredHeaders = ['menuId', 'menuName', 'menuIcon', 'menuType', 'sortOrder'];
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

  if (missingHeaders.length > 0) {
    return {
      success: false,
      error: `缺少必填字段: ${missingHeaders.join(', ')}`
    };
  }

  // 转换数据
  const menuData: MenuTableRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
      continue; // 跳过空行
    }

    const menuRow: Partial<MenuTableRow> = {};

    headers.forEach((header, index) => {
      const value = row[index]?.toString().trim();
      if (value) {
        if (header === 'sortOrder') {
          const sortOrder = parseInt(value);
          if (isNaN(sortOrder)) {
            errors.push(`第${i + 2}行: sortOrder必须是数字`);
          } else {
            menuRow[header] = sortOrder;
          }
        } else if (header === 'menuType') {
          if (!['single', 'tabs'].includes(value)) {
            errors.push(`第${i + 2}行: menuType必须是single或tabs`);
          } else {
            menuRow[header] = value as 'single' | 'tabs';
          }
        } else {
          (menuRow as any)[header] = value;
        }
      }
    });

    // 验证必填字段
    if (!menuRow.menuId) {
      errors.push(`第${i + 2}行: menuId不能为空`);
    }
    if (!menuRow.menuName) {
      errors.push(`第${i + 2}行: menuName不能为空`);
    }

    menuData.push(menuRow as MenuTableRow);
  }

  // 检查父子关系
  menuData.forEach((row, index) => {
    if (row.parentMenuId) {
      const parentExists = menuData.some(parent => parent.menuId === row.parentMenuId);
      if (!parentExists) {
        errors.push(`第${index + 2}行: 父菜单 "${row.parentMenuId}" 不存在`);
      }
    }
  });

  if (errors.length > 0) {
    return {
      success: false,
      error: `数据验证失败:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? '\n...' : ''}`
    };
  }

  return {
    success: true,
    data: menuData,
    rowCount: menuData.length
  };
}

/**
 * 处理网站数据
 */
function processSiteData(rawData: string[][]): TableImportResult<SiteTableRow> {
  if (!rawData || rawData.length < 2) {
    return {
      success: false,
      error: '文件内容为空或格式不正确'
    };
  }

  const headers = rawData[0].map(h => h?.toString().trim());
  const rows = rawData.slice(1);

  // 验证网站表头
  const requiredHeaders = ['menuId', 'title', 'description'];
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

  if (missingHeaders.length > 0) {
    return {
      success: false,
      error: `缺少必填字段: ${missingHeaders.join(', ')}`
    };
  }

  // 转换数据
  const siteData: SiteTableRow[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
      continue; // 跳过空行
    }

    const siteRow: Partial<SiteTableRow> = {};

    headers.forEach((header, index) => {
      const value = row[index]?.toString().trim();
      if (value) {
        if (header === 'sortOrder') {
          const sortOrder = parseInt(value);
          if (isNaN(sortOrder)) {
            siteRow[header] = 0;
          } else {
            siteRow[header] = sortOrder;
          }
        } else {
          (siteRow as any)[header] = value;
        }
      }
    });

    // 验证必填字段
    if (!siteRow.menuId) {
      errors.push(`第${i + 2}行: menuId不能为空`);
    }
    if (!siteRow.title) {
      errors.push(`第${i + 2}行: title不能为空`);
    }
    if (!siteRow.description) {
      errors.push(`第${i + 2}行: description不能为空`);
    }

    siteData.push(siteRow as SiteTableRow);
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: `数据验证失败:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? '\n...' : ''}`
    };
  }

  return {
    success: true,
    data: siteData,
    rowCount: siteData.length
  };
}

/**
 * 生成配置
 */
async function generateConfig(
  menuData: MenuTableRow[],
  siteData: SiteTableRow[],
  siteInfo: { title: string; description: string; logoText: string },
  options: OptimizationOptions
): Promise<ConfigResult> {

  if (options.enabled) {
    // 生成优化版本
    const optimizedResult = splitConfig(menuData, siteData, siteInfo, options);
    return optimizedResult as ConfigResult;
  } else {
    // 生成传统版本
    const config = generateTraditionalConfig(menuData, siteData, siteInfo);
    return {
      config,
      optimization: { enabled: false }
    } as ConfigResult;
  }
}

/**
 * 生成传统配置
 */
function generateTraditionalConfig(
  menuData: MenuTableRow[],
  siteData: SiteTableRow[],
  siteInfo: { title: string; description: string; logoText: string }
): any {
  // 按sortOrder排序菜单
  const sortedMenus = [...menuData].sort((a, b) => a.sortOrder - b.sortOrder);

  // 分离顶级菜单和子菜单
  const topMenus = sortedMenus.filter(menu => !menu.parentMenuId);
  const subMenus = sortedMenus.filter(menu => menu.parentMenuId);

  // 生成categoryMap
  const categoryMap: { [key: string]: string } = {};
  topMenus.forEach(menu => {
    categoryMap[menu.menuName] = menu.menuId;
  });

  // 生成menuItems
  const menuItems = topMenus.map(topMenu => {
    const children = subMenus.filter(sub => sub.parentMenuId === topMenu.menuId)
                             .sort((a, b) => a.sortOrder - b.sortOrder);

    if (children.length > 0) {
      // 有子菜单的情况
      const submenu = children.map(child => ({
        name: child.menuName,
        href: `#${child.menuId}`,
        icon: child.menuIcon,
        sites: generateSitesForMenu(child.menuId, siteData)
      }));

      return {
        name: topMenu.menuName,
        href: `#${topMenu.menuId}`,
        icon: topMenu.menuIcon,
        type: 'tabs' as const,
        submenu
      };
    } else {
      // 单级菜单的情况
      return {
        name: topMenu.menuName,
        href: `#${topMenu.menuId}`,
        icon: topMenu.menuIcon,
        type: 'single' as const,
        sites: generateSitesForMenu(topMenu.menuId, siteData)
      };
    }
  });

  return {
    site: {
      title: siteInfo.title,
      description: siteInfo.description,
      logo: {
        text: siteInfo.logoText,
        href: "/"
      }
    },
    categoryMap,
    menuItems
  };
}

/**
 * 为指定菜单生成网站数据
 */
function generateSitesForMenu(menuId: string, siteData: SiteTableRow[]) {
  const menuSites = siteData.filter(site => site.menuId === menuId)
                           .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return menuSites.map(siteRow => {
    const site: any = {
      title: siteRow.title,
      description: siteRow.description
    };

    // 可选字段
    if (siteRow.url) site.url = siteRow.url;
    if (siteRow.logo) site.logo = siteRow.logo;

    // 数组字段（分号分隔）
    if (siteRow.advantages) {
      site.advantages = siteRow.advantages.split(';').map(s => s.trim()).filter(s => s);
    }
    if (siteRow.features) {
      site.features = siteRow.features.split(';').map(s => s.trim()).filter(s => s);
    }

    // 详细信息
    const details: any = {};
    if (siteRow.intro) details.intro = siteRow.intro;
    if (siteRow.pricing) details.pricing = siteRow.pricing;
    if (siteRow.pros) {
      details.pros = siteRow.pros.split(';').map(s => s.trim()).filter(s => s);
    }
    if (siteRow.cons) {
      details.cons = siteRow.cons.split(';').map(s => s.trim()).filter(s => s);
    }
    if (siteRow.tips) {
      details.tips = siteRow.tips.split(';').map(s => s.trim()).filter(s => s);
    }

    if (Object.keys(details).length > 0) {
      site.details = details;
    }

    // 相关网站
    if (siteRow.relatedTitles && siteRow.relatedDescriptions) {
      const titles = siteRow.relatedTitles.split(';').map(s => s.trim()).filter(s => s);
      const descriptions = siteRow.relatedDescriptions.split(';').map(s => s.trim()).filter(s => s);

      if (titles.length === descriptions.length && titles.length > 0) {
        site.related = titles.map((title, index) => ({
          title,
          description: descriptions[index]
        }));
      }
    }

    return site;
  });
}

/**
 * 创建优化版本的ZIP文件
 */
async function createOptimizedZip(result: ConfigResult): Promise<Blob> {
  if (result.optimization.enabled === false) {
    throw new Error('不是优化版本的配置');
  }

  // 类型断言为优化配置结果
  const optimizedResult = result as OptimizedConfigResult;

  const zip = new JSZip();

  // 添加基础配置文件 (新格式)
  zip.file('config.json', JSON.stringify(optimizedResult.baseConfig, null, 2));

  // 添加分类文件
  const categoriesFolder = zip.folder('categories');
  if (categoriesFolder) {
    optimizedResult.categoryFiles.forEach(file => {
      categoriesFolder.file(file.filename, JSON.stringify(file.content, null, 2));
    });
  }

  // 添加说明文档
  const readme = generateReadme(result);
  zip.file('README.md', readme);

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * 生成README文档
 */
function generateReadme(result: ConfigResult): string {
  if (result.optimization.enabled === false) {
    return '# 传统配置文件\n\n直接将 config.json 放到项目的 src/data/ 目录下即可。';
  }

  // 类型断言为优化配置结果
  const optimizedResult = result as OptimizedConfigResult;

  return `# 优化版本配置文件

## 🚀 部署说明

1. 将 \`config.json\` 放到项目的 \`public/\` 目录下
2. 将 \`categories/\` 文件夹放到项目的 \`public/\` 目录下
3. 重新构建和部署项目

## 📊 优化效果

- 总分类数: ${optimizedResult.optimization.totalCategories}
- 总网站数: ${optimizedResult.optimization.totalSites}
- 原始大小: ${optimizedResult.optimization.originalSizeKB}KB
- 优化后大小: ${optimizedResult.optimization.optimizedSizeKB}KB
- 压缩比例: ${optimizedResult.optimization.compressionRatio}%

## 📁 文件结构

\`\`\`
public/
├── config.json              # 基础配置文件 (新格式)
└── categories/              # 分类数据文件夹
    ├── 0.json              # 第1个分类数据
    ├── 1.json              # 第2个分类数据
    └── ...
\`\`\`

## 🔧 配置格式说明

### 基础配置文件 (config.json)
包含网站基本信息和菜单结构，每个菜单项包含：
- \`categoryIndex\`: 对应的分类文件索引
- \`siteCount\`: 该分类的网站总数
- \`previewSites\`: 前几个网站的预览数据

### 分类文件 (categories/*.json)
包含完整的网站数据，按需加载。

## ⚡ 性能优化原理

1. **首次加载**: 只加载基础配置和预览数据
2. **按需加载**: 用户点击分类时才加载完整数据
3. **缓存机制**: 已加载的分类数据会被缓存
4. **预加载**: 智能预加载下一个可能访问的分类

## 🔄 前端适配

确保前端项目支持懒加载功能：
- 检测配置格式 (传统 vs 优化)
- 实现分类数据懒加载
- 添加loading状态和错误处理
- 启用缓存和预加载机制

## 📈 建议

- 启用CDN加速分类文件的加载速度
- 监控分类文件的加载性能
- 根据用户行为调整预加载策略
`;
}


