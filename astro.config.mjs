import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://affnav.github.io',
    integrations: [sitemap()],
    output: 'hybrid', // 支持API Routes和静态页面
});
