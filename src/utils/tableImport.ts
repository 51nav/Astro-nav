import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type {
  MenuTableRow,
  SiteTableRow,
  TableImportResult,
  ValidationResult,
  ValidationError
} from '../types/tableImport';
import type { SiteConfig, MenuItem, Site, SubMenuItem } from '../types/config';

// 解析菜单Excel文件
export function parseMenuExcelFile(file: File): Promise<TableImportResult<MenuTableRow>> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const result = processMenuData(jsonData as string[][]);

        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          error: `Excel文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: '文件读取失败'
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

// 解析网站Excel文件
export function parseSiteExcelFile(file: File): Promise<TableImportResult<SiteTableRow>> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const result = processSiteData(jsonData as string[][]);

        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          error: `Excel文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: '文件读取失败'
      });
    };

    reader.readAsArrayBuffer(file);
  });
}

// 解析菜单CSV文件
export function parseMenuCSVFile(file: File): Promise<TableImportResult<MenuTableRow>> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const result = processMenuData(results.data as string[][]);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: `CSV文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV文件解析失败: ${error.message}`
        });
      },
      encoding: 'UTF-8'
    });
  });
}

// 解析网站CSV文件
export function parseSiteCSVFile(file: File): Promise<TableImportResult<SiteTableRow>> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const result = processSiteData(results.data as string[][]);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: `CSV文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV文件解析失败: ${error.message}`
        });
      },
      encoding: 'UTF-8'
    });
  });
}

// 处理菜单数据
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
  const headerValidation = validateMenuHeaders(headers, requiredHeaders);
  if (!headerValidation.isValid) {
    return {
      success: false,
      error: `表头验证失败: ${headerValidation.errors.map(e => e.message).join(', ')}`
    };
  }

  // 转换数据
  const menuData: MenuTableRow[] = [];

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
          menuRow[header] = parseInt(value) || 0;
        } else if (header === 'menuType') {
          menuRow[header] = value as 'single' | 'tabs';
        } else {
          (menuRow as any)[header] = value;
        }
      }
    });

    menuData.push(menuRow as MenuTableRow);
  }

  // 验证菜单数据
  const dataValidation = validateMenuData(menuData);
  if (!dataValidation.isValid) {
    return {
      success: false,
      error: `数据验证失败: ${dataValidation.errors.slice(0, 5).map(e =>
        `第${e.row}行${e.field}: ${e.message}`
      ).join('; ')}${dataValidation.errors.length > 5 ? '...' : ''}`
    };
  }

  return {
    success: true,
    data: menuData,
    rowCount: menuData.length
  };
}

// 处理网站数据
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
  const headerValidation = validateSiteHeaders(headers, requiredHeaders);
  if (!headerValidation.isValid) {
    return {
      success: false,
      error: `表头验证失败: ${headerValidation.errors.map(e => e.message).join(', ')}`
    };
  }

  // 转换数据
  const siteData: SiteTableRow[] = [];

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
          siteRow[header] = parseInt(value) || 0;
        } else {
          (siteRow as any)[header] = value;
        }
      }
    });

    siteData.push(siteRow as SiteTableRow);
  }

  // 验证网站数据
  const dataValidation = validateSiteData(siteData);
  if (!dataValidation.isValid) {
    return {
      success: false,
      error: `数据验证失败: ${dataValidation.errors.slice(0, 5).map(e =>
        `第${e.row}行${e.field}: ${e.message}`
      ).join('; ')}${dataValidation.errors.length > 5 ? '...' : ''}`
    };
  }

  return {
    success: true,
    data: siteData,
    rowCount: siteData.length
  };
}

// 验证菜单表头
function validateMenuHeaders(headers: string[], requiredHeaders: string[]): ValidationResult {
  const errors: ValidationError[] = [];

  // 检查必填字段
  requiredHeaders.forEach(field => {
    if (!headers.includes(field)) {
      errors.push({
        row: 0,
        field: field,
        message: `缺少必填字段: ${field}`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

// 验证网站表头
function validateSiteHeaders(headers: string[], requiredHeaders: string[]): ValidationResult {
  const errors: ValidationError[] = [];

  // 检查必填字段
  requiredHeaders.forEach(field => {
    if (!headers.includes(field)) {
      errors.push({
        row: 0,
        field: field,
        message: `缺少必填字段: ${field}`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

// 验证菜单数据
function validateMenuData(data: MenuTableRow[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const menuIds = new Set<string>();

  data.forEach((row, index) => {
    const rowNum = index + 2; // 考虑表头行

    // 检查必填字段
    if (!row.menuId || row.menuId.trim() === '') {
      errors.push({
        row: rowNum,
        field: 'menuId',
        message: 'menuId字段不能为空'
      });
    }

    if (!row.menuName || row.menuName.trim() === '') {
      errors.push({
        row: rowNum,
        field: 'menuName',
        message: 'menuName字段不能为空'
      });
    }

    if (!row.menuIcon || row.menuIcon.trim() === '') {
      errors.push({
        row: rowNum,
        field: 'menuIcon',
        message: 'menuIcon字段不能为空'
      });
    }

    if (!row.menuType || !['single', 'tabs'].includes(row.menuType)) {
      errors.push({
        row: rowNum,
        field: 'menuType',
        message: 'menuType必须是single或tabs'
      });
    }

    // 检查menuId唯一性
    if (row.menuId) {
      if (menuIds.has(row.menuId)) {
        errors.push({
          row: rowNum,
          field: 'menuId',
          message: `menuId "${row.menuId}" 重复`
        });
      } else {
        menuIds.add(row.menuId);
      }
    }

    // 检查图标格式
    if (row.menuIcon && !row.menuIcon.startsWith('mdi:')) {
      warnings.push({
        row: rowNum,
        field: 'menuIcon',
        message: '建议使用mdi:前缀的图标'
      });
    }
  });

  // 检查父子关系
  data.forEach((row, index) => {
    const rowNum = index + 2;
    if (row.parentMenuId) {
      const parentExists = data.some(parent => parent.menuId === row.parentMenuId);
      if (!parentExists) {
        errors.push({
          row: rowNum,
          field: 'parentMenuId',
          message: `父菜单 "${row.parentMenuId}" 不存在`
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// 验证网站数据
function validateSiteData(data: SiteTableRow[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  data.forEach((row, index) => {
    const rowNum = index + 2; // 考虑表头行

    // 检查必填字段
    if (!row.menuId || row.menuId.trim() === '') {
      errors.push({
        row: rowNum,
        field: 'menuId',
        message: 'menuId字段不能为空'
      });
    }

    if (!row.title || row.title.trim() === '') {
      errors.push({
        row: rowNum,
        field: 'title',
        message: 'title字段不能为空'
      });
    }

    if (!row.description || row.description.trim() === '') {
      errors.push({
        row: rowNum,
        field: 'description',
        message: 'description字段不能为空'
      });
    }

    // 检查URL格式
    if (row.url && row.url !== '#') {
      try {
        new URL(row.url);
      } catch {
        warnings.push({
          row: rowNum,
          field: 'url',
          message: 'URL格式可能不正确'
        });
      }
    }

    // 检查相关网站数据一致性
    if (row.relatedTitles || row.relatedDescriptions) {
      const titles = row.relatedTitles?.split(';').filter(t => t.trim()) || [];
      const descriptions = row.relatedDescriptions?.split(';').filter(d => d.trim()) || [];

      if (titles.length !== descriptions.length) {
        warnings.push({
          row: rowNum,
          field: 'related',
          message: '相关网站标题和描述数量不匹配'
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// 生成配置文件
export function generateConfig(
  menuData: MenuTableRow[],
  siteData: SiteTableRow[],
  siteInfo: { title: string; description: string; logoText: string }
): SiteConfig {
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
  const menuItems: MenuItem[] = topMenus.map(topMenu => {
    const children = subMenus.filter(sub => sub.parentMenuId === topMenu.menuId)
                             .sort((a, b) => a.sortOrder - b.sortOrder);

    if (children.length > 0) {
      // 有子菜单的情况
      const submenu: SubMenuItem[] = children.map(child => ({
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

// 为指定菜单生成网站数据
function generateSitesForMenu(menuId: string, siteData: SiteTableRow[]): Site[] {
  const menuSites = siteData.filter(site => site.menuId === menuId)
                           .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return menuSites.map(siteRow => {
    const site: Site = {
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
