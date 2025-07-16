import {defineConfig} from 'tsup';
export default defineConfig({
  entry:['src/index.ts'],
  dts:true,
  format:['esm','cjs'],
  clean:true,
  minify:false,
  sourcemap:false,
  external:['postcss'],
  outExtension({format}) {
    return {
      js:format==='cjs'?'.cjs':'.mjs'
    }
  }
});
