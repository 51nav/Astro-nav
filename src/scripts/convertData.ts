import { navigationData } from '../data/navigation';
import { convertNavigationData } from '../utils/dataConverter';
import fs from 'fs';
import path from 'path';

// 转换数据
const convertedConfig = convertNavigationData(navigationData);

// 写入新的配置文件
const configPath = path.join(process.cwd(), 'src/data/config.json');
fs.writeFileSync(configPath, JSON.stringify(convertedConfig, null, 2), 'utf-8');

console.log('✅ 数据转换完成！');
console.log(`📁 配置文件已保存到: ${configPath}`);
console.log(`📊 转换统计:`);
console.log(`   - 分类数量: ${convertedConfig.menuItems.length}`);
console.log(`   - 总网站数量: ${convertedConfig.menuItems.reduce((total, item) => {
  if (item.submenu) {
    return total + item.submenu.reduce((subTotal, sub) => subTotal + sub.sites.length, 0);
  }
  return total + (item.sites ? item.sites.length : 0);
}, 0)}`);
