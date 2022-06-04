import { defineConfig } from 'tsup'
export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  format: ['cjs', 'esm'],
  sourcemap: false,
  clean: true,
  bundle: true,
  outDir: 'dist',
  external: ['esbuild'], // 可以使用esbuild的插件  /** Don't bundle these modules */
})
