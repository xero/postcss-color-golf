import { defineConfig } from 'tsup';
export default defineConfig({
  entry: ['postcss-color-golf.js'],
  dts: true,
  format: ['esm', 'cjs'],
  clean: true,
  minify: false,
  sourcemap: false,
  external: ['postcss']
});
