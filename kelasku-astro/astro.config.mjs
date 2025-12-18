// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://gumgum-sys.github.io/',
  outDir: './dist',
  trailingSlash: 'ignore',
  build: {
    format: 'file'
  },
  base: '/kelasregb/',
});
