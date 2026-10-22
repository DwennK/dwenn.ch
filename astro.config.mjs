import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { routes } from './src/content/site.ts';
import worker from './worker.mjs';

const site = 'https://dwenn.ch';

// Local preview uses the existing Worker with no provider bindings or secrets.
// This exposes its real unavailable state and cannot send email.
const localContact = () => ({
  name: 'local-contact-worker',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const legacy = { '/index.html': '/', '/work.html': '/realisations/', '/work': '/realisations/', '/about': '/a-propos/' };
      const pathname = req.url?.split('?')[0];
      if (legacy[pathname]) { res.writeHead(301, { Location: legacy[pathname] }); return res.end(); }
      if (!req.url?.startsWith('/api/')) return next();
      try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const request = new Request(`http://127.0.0.1${req.url}`, {
          method: req.method,
          headers: req.headers,
          ...(['GET', 'HEAD'].includes(req.method) ? {} : { body: Buffer.concat(chunks) }),
        });
        const response = await worker.fetch(request, {});
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(await response.text());
      } catch { res.writeHead(500); res.end(); }
    });
  },
});
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap({
    serialize(item) {
      // Astro discovers the pages; the shared route map pairs translated slugs.
      const pathname = new URL(item.url).pathname;
      const translations = Object.values(routes).find(route => Object.values(route).includes(pathname));
      if (translations) {
        item.links = [
          ...Object.entries(translations).map(([lang, path]) => ({ lang, url: new URL(path, site).href })),
          { lang: 'x-default', url: new URL(translations.fr, site).href },
        ];
      }
      return item;
    },
  })],
  devToolbar: { enabled: false },
  vite: { plugins: [localContact()] },
});
