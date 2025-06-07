import type { APIRoute } from 'astro';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { SiteTableRow, TableImportResult } from '../../../types/tableImport';

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

    let result: TableImportResult<SiteTableRow>;
    
    if (isExcel) {
      result = await parseSiteExcelFile(file);
    } else {
      result = await parseSiteCSVFile(file);
    }

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('网站文件解析错误:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `服务器错误: ${error instanceof Error ? error.message : '未知错误'}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// 解析网站Excel文件
async function parseSiteExcelFile(file: File): Promise<TableImportResult<SiteTableRow>> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return processSiteData(jsonData as string[][]);
  } catch (error) {
    return {
      success: false,
      error: `Excel文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
}

// 解析网站CSV文件
async function parseSiteCSVFile(file: File): Promise<TableImportResult<SiteTableRow>> {
  try {
    const text = await file.text();
    
    return new Promise((resolve) => {
      Papa.parse(text, {
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
  } catch (error) {
    return {
      success: false,
      error: `文件读取失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
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
  const warnings: string[] = [];
  
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
            warnings.push(`第${i + 2}行: sortOrder不是有效数字，将使用默认值`);
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
    
    // 验证URL格式
    if (siteRow.url && siteRow.url !== '#') {
      try {
        new URL(siteRow.url);
      } catch {
        warnings.push(`第${i + 2}行: URL格式可能不正确`);
      }
    }
    
    // 验证相关网站数据一致性
    if (siteRow.relatedTitles || siteRow.relatedDescriptions) {
      const titles = siteRow.relatedTitles?.split(';').filter(t => t.trim()) || [];
      const descriptions = siteRow.relatedDescriptions?.split(';').filter(d => d.trim()) || [];
      
      if (titles.length !== descriptions.length) {
        warnings.push(`第${i + 2}行: 相关网站标题和描述数量不匹配`);
      }
    }
    
    siteData.push(siteRow as SiteTableRow);
  }
  
  if (errors.length > 0) {
    return {
      success: false,
      error: `数据验证失败:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? '\n...' : ''}`
    };
  }
  
  const result: TableImportResult<SiteTableRow> = {
    success: true,
    data: siteData,
    rowCount: siteData.length
  };
  
  // 如果有警告，添加到结果中
  if (warnings.length > 0) {
    (result as any).warnings = warnings;
  }
  
  return result;
}
