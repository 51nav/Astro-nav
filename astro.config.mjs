import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://51nav.github.io',
    integrations: [sitemap()],
});
