import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://51nav.github.io',
    integrations: [
        sitemap({
            // 自定义配置选项
            filter: (page) => !page.includes('/submit'), // 排除提交页面
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date(), // 最后修改时间
        }),
    ],
});
