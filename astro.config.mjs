import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://affnav.github.io',
    integrations: [sitemap()],
});
