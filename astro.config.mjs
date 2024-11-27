import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://51nav.github.io',
    integrations: [
        sitemap({
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date(),
            filter: (page) => {
                // 排除一些不需要收录的页面
                const excludedPaths = ['/submit'];
                return !excludedPaths.some(path => page.includes(path));
            },
            // 自定义每个页面的优先级
            customPages: [
                {
                    url: '/',
                    changefreq: 'daily',
                    priority: 1.0,
                    lastmod: new Date()
                },
                {
                    url: '/sites/*',
                    changefreq: 'weekly',
                    priority: 0.8,
                    lastmod: new Date()
                }
            ]
        }),
    ],
});
