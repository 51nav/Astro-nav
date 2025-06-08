import type { SiteConfig, MenuItem, Site } from '../types/config';
import configData from '../data/config.json';

// 获取完整配置
export function getConfig(): SiteConfig {
  return configData as SiteConfig;
}

// 获取网站基础信息
export function getSiteInfo() {
  const config = getConfig();
  return config.site;
}

// 获取所有菜单项
export function getMenuItems(): MenuItem[] {
  const config = getConfig();
  return config.menuItems;
}

// 根据类别名称获取菜单项
export function getMenuItemByName(name: string): MenuItem | undefined {
  const menuItems = getMenuItems();
  return menuItems.find(item => item.name === name);
}

// 获取所有网站数据（扁平化）
export function getAllSites(): Site[] {
  const menuItems = getMenuItems();
  const sites: Site[] = [];
  
  menuItems.forEach(item => {
    if (item.sites) {
      sites.push(...item.sites);
    }
    if (item.submenu) {
      item.submenu.forEach(sub => {
        sites.push(...sub.sites);
      });
    }
  });
  
  return sites;
}

// 根据URL查找网站
export function getSiteByUrl(url: string): Site | undefined {
  const allSites = getAllSites();
  return allSites.find(site => site.url === url);
}

// 搜索网站
export function searchSites(query: string): Site[] {
  const allSites = getAllSites();
  const lowercaseQuery = query.toLowerCase();
  
  return allSites.filter(site => 
    site.title.toLowerCase().includes(lowercaseQuery) ||
    site.description.toLowerCase().includes(lowercaseQuery) ||
    (site.advantages && site.advantages.some(advantage => 
      advantage.toLowerCase().includes(lowercaseQuery)
    ))
  );
}

// 获取分类映射
export function getCategoryMap() {
  const config = getConfig();
  return config.categoryMap;
}

// 根据分类ID获取分类名称
export function getCategoryName(categoryId: string): string {
  const categoryMap = getCategoryMap();
  const entry = Object.entries(categoryMap).find(([_, id]) => id === categoryId);
  return entry ? entry[0] : categoryId;
}

// 获取统计信息
export function getStats() {
  const menuItems = getMenuItems();
  const allSites = getAllSites();
  
  return {
    totalCategories: menuItems.length,
    totalSites: allSites.length,
    categoriesWithSubmenus: menuItems.filter(item => item.submenu).length
  };
}
