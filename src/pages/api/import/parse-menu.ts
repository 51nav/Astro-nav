import type { APIRoute } from 'astro';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { MenuTableRow, TableImportResult } from '../../../types/tableImport';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: '未找到上传的文件'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查文件类型
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx');
    const isCSV = fileName.endsWith('.csv');
    
    if (!isExcel && !isCSV) {
      return new Response(JSON.stringify({
        success: false,
        error: '不支持的文件格式，请上传 .xlsx 或 .csv 文件'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result: TableImportResult<MenuTableRow>;
    
    if (isExcel) {
      result = await parseMenuExcelFile(file);
    } else {
      result = await parseMenuCSVFile(file);
    }

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('菜单文件解析错误:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// 解析菜单Excel文件
async function parseMenuExcelFile(file: File): Promise<TableImportResult<MenuTableRow>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return processMenuData(jsonData as string[][]);
  } catch (error) {
    return {
      success: false,
      error: `Excel文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

// 解析菜单CSV文件
async function parseMenuCSVFile(file: File): Promise<TableImportResult<MenuTableRow>> {
  try {
    const text = await file.text();
    
    return new Promise((resolve) => {
      Papa.parse(text, {
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
  } catch (error) {
    return {
      success: false,
      error: `文件读取失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
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
    if (!menuRow.menuIcon) {
      errors.push(`第${i + 2}行: menuIcon不能为空`);
    }
    if (!menuRow.menuType) {
      errors.push(`第${i + 2}行: menuType不能为空`);
    }
    if (menuRow.sortOrder === undefined) {
      errors.push(`第${i + 2}行: sortOrder不能为空`);
    }
    
    menuData.push(menuRow as MenuTableRow);
  }
  
  // 检查menuId唯一性
  const menuIds = new Set<string>();
  menuData.forEach((row, index) => {
    if (row.menuId) {
      if (menuIds.has(row.menuId)) {
        errors.push(`第${index + 2}行: menuId "${row.menuId}" 重复`);
      } else {
        menuIds.add(row.menuId);
      }
    }
  });
  
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
