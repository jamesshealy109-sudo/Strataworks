import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://strataworks.tech',
  integrations: [sitemap()],
  output: 'static'
});