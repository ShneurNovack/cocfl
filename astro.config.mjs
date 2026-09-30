import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chabadoncampusfl.org',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      serialize(item) {
        const u = item.url;
        if (u === 'https://chabadoncampusfl.org/') item.priority = 1.0;
        else if (u.endsWith('/campuses/') || u.endsWith('/programs/')) item.priority = 0.9;
        else if (u.includes('/campuses/')) item.priority = 0.8;
        else item.priority = 0.7;
        return item;
      },
    }),
  ],
});
