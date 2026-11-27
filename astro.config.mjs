// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Svi datumi se računaju u UTC-u da se vrijeme ne pomakne ovisno o računalu na kojem se gradi.
process.env.TZ = 'UTC';

// Kada stranica dobije pravu adresu (domenu), upišite je ovdje ili u varijablu SITE_URL na hostingu.
const site = process.env.SITE_URL || process.env.URL || process.env.CF_PAGES_URL || 'https://zupa-sv-marije-magdalene.netlify.app';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
  vite: { plugins: [tailwindcss()] },
});
