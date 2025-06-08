import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://affnav.github.io',
    integrations: [sitemap()],
    output: 'hybrid', // 支持API Routes和静态页面

    // 静态文件配置 - 支持GitHub Actions部署
    publicDir: './static', // 使用 static/ 文件夹作为静态资源目录

    // 构建配置
    build: {
        assets: '_astro'
    }
});
